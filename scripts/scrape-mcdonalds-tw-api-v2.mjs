import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CALCULATOR_URL =
  'https://www.mcdonalds.com/tw/zh-tw/sustainability/good-food/nutrition-calculator.html';
const FULL_MENU_URL = 'https://www.mcdonalds.com/tw/zh-tw/full-menu.html';
const DEFAULT_OUTPUT = 'artifacts/mcdonalds-tw-nutrition.api.raw.json';
const USER_AGENT =
  'TWFoodMCP/0.1 (+https://github.com/NTUT-Vincent/TWFoodMCP; public nutrition data research)';

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const outputPath = arg('--output', process.env.OUTPUT_PATH ?? DEFAULT_OUTPUT);
const maxProducts = Number(arg('--max-products', process.env.MAX_PRODUCTS ?? '300'));
const delayMs = Number(arg('--delay-ms', process.env.DELAY_MS ?? '250'));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function curlText(url, { accept = 'text/html,*/*;q=0.8', referer } = {}) {
  const args = [
    '--http1.1',
    '--location',
    '--compressed',
    '--silent',
    '--show-error',
    '--fail-with-body',
    '--retry',
    '3',
    '--retry-all-errors',
    '--connect-timeout',
    '20',
    '--max-time',
    '90',
    '--user-agent',
    USER_AGENT,
    '--header',
    'Accept-Language: zh-TW,zh;q=0.9,en;q=0.7',
    '--header',
    `Accept: ${accept}`,
  ];
  if (referer) args.push('--referer', referer);
  args.push(url);

  const { stdout } = await execFileAsync('curl', args, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  return stdout;
}

function decode(value) {
  return String(value ?? '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function attrs(tag) {
  const result = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)) {
    result[match[1]] = decode(match[2]);
  }
  return result;
}

function normalizeUrl(raw, base) {
  try {
    return new URL(decode(raw), base).href.split('#')[0].split('?')[0];
  } catch {
    return null;
  }
}

function productLinks(html, base) {
  const found = new Set();
  const patterns = [
    /href\s*=\s*["']([^"']*\/tw\/zh-tw\/product\/[^"'#?]+\.html[^"']*)["']/gi,
    /["'](\/tw\/zh-tw\/product\/[^"']+?\.html)["']/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const url = normalizeUrl(match[1].replaceAll('\\/', '/'), base);
      if (url?.includes('/tw/zh-tw/product/')) found.add(url);
    }
  }
  return [...found].sort();
}

function productConfig(html, pageUrl) {
  const tag = html.match(/<[^>]+data-component=["']pdp["'][^>]*>/i)?.[0];
  if (!tag) return null;
  const data = attrs(tag);
  if (!data['data-product-id'] || !data['data-product-api-url']) return null;

  const apiUrl = new URL(data['data-product-api-url'], pageUrl);
  apiUrl.searchParams.set('country', data['data-site-country'] || data['data-country'] || 'TW');
  apiUrl.searchParams.set('language', data['data-site-language'] || data['data-language'] || 'zh');
  apiUrl.searchParams.set('showLiveData', data['data-show-live-data'] || 'true');
  apiUrl.searchParams.set('item', data['data-product-id']);
  if (data['data-daypart-id']) apiUrl.searchParams.set('daypartId', data['data-daypart-id']);
  apiUrl.searchParams.set('compType', 'core');
  apiUrl.searchParams.set('returnType', 'json');

  return {
    product_id: data['data-product-id'],
    nutrients_id: data['data-nutrients-id'] || null,
    api_url: apiUrl.href,
  };
}

function number(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(String(value).replaceAll(',', '').trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function keyFor(nutrient) {
  const id = String(nutrient?.nutrient_name_id ?? '').toLowerCase();
  const name = String(nutrient?.name ?? '').toLowerCase();
  const combined = `${id} ${name}`;

  if (/energy_kcal|熱量/.test(combined)) return 'energy_kcal';
  if (/saturated_fat|飽和脂肪/.test(combined)) return 'saturated_fat_g';
  if (/trans_fat|反式脂肪/.test(combined)) return 'trans_fat_g';
  if (/carbohydrate|碳水化合物/.test(combined)) return 'carbohydrate_g';
  if (/sugars?|糖/.test(combined)) return 'sugar_g';
  if (/dietary_(fiber|fibre)|膳食纖維/.test(combined)) return 'dietary_fiber_g';
  if (/protein|蛋白質/.test(combined)) return 'protein_g';
  if (/sodium|salt|鈉/.test(combined)) return 'sodium_mg';
  if (/(^|\s)fat($|\s)|^fat$|^脂肪$/.test(combined)) return 'fat_g';
  return null;
}

function normalizePayload(payload) {
  if (payload?.error) {
    throw new Error(`McDonald's API ${payload.error.code}: ${payload.error.description}`);
  }
  const item = payload?.item;
  if (!item || typeof item !== 'object') throw new Error('API response has no item object.');

  const raw = item?.nutrient_facts?.nutrient;
  const rawNutrients = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const nutrition = {};
  const evidence = [];
  let servingSize = null;

  for (const nutrient of rawNutrients) {
    const id = String(nutrient?.nutrient_name_id ?? '').toLowerCase();
    const value = number(nutrient?.value);
    if (/primary_serving_size/.test(id)) {
      servingSize = {
        value,
        unit: nutrient?.uom ?? null,
        description: nutrient?.uom_description ?? null,
      };
      continue;
    }

    const key = keyFor(nutrient);
    if (!key || value === null || nutrition[key] !== undefined) continue;
    nutrition[key] = value;
    evidence.push({
      key,
      id: nutrient?.id ?? null,
      name: nutrient?.name ?? null,
      nutrient_name_id: nutrient?.nutrient_name_id ?? null,
      value: nutrient?.value ?? null,
      unit: nutrient?.uom ?? null,
      unit_description: nutrient?.uom_description ?? null,
      daily_value_percent: number(nutrient?.adult_dv),
      per_100g_value: number(nutrient?.hundred_g_per_product),
    });
  }

  return { item, rawNutrients, nutrition, evidence, servingSize };
}

async function main() {
  const retrievedAt = new Date().toISOString();
  const links = new Set();
  const enumerationPages = [];
  const errors = [];

  for (const url of [CALCULATOR_URL, FULL_MENU_URL]) {
    try {
      const html = await curlText(url);
      const discovered = productLinks(html, url);
      discovered.forEach((link) => links.add(link));
      enumerationPages.push({
        url,
        byte_length: Buffer.byteLength(html),
        discovered_links: discovered.length,
      });
    } catch (error) {
      errors.push({ stage: 'enumerate', url, error: String(error) });
    }
  }

  const selected = [...links].slice(0, maxProducts);
  const items = [];

  for (const [index, pageUrl] of selected.entries()) {
    try {
      const html = await curlText(pageUrl);
      const config = productConfig(html, pageUrl);
      if (!config) throw new Error('PDP API configuration not found.');

      const payload = JSON.parse(
        await curlText(config.api_url, { accept: 'application/json', referer: pageUrl }),
      );
      const normalized = normalizePayload(payload);
      const count = Object.keys(normalized.nutrition).length;

      items.push({
        source_url: pageUrl,
        source_api_url: config.api_url,
        product_id: config.product_id,
        nutrients_id: config.nutrients_id,
        name:
          normalized.item.item_marketing_name ||
          normalized.item.item_name ||
          normalized.item.short_name ||
          config.product_id,
        short_name: normalized.item.short_name ?? null,
        category: normalized.item.default_category?.category?.name ?? null,
        description: normalized.item.description ?? null,
        allergens: normalized.item.item_allergen ?? null,
        additional_allergens: normalized.item.item_additional_allergen ?? null,
        nutrition_basis: 'per_portion_as_published',
        serving_size: normalized.servingSize,
        nutrition: normalized.nutrition,
        nutrition_evidence: normalized.evidence,
        raw_nutrients: normalized.rawNutrients,
        extraction_status:
          normalized.nutrition.energy_kcal !== undefined && count >= 5
            ? 'parsed_from_official_api'
            : 'needs_review',
      });
    } catch (error) {
      errors.push({ stage: 'product', url: pageUrl, error: String(error) });
    }

    console.log(`[${index + 1}/${selected.length}] ${pageUrl}`);
    await sleep(delayMs);
  }

  const parsedCount = items.filter(
    (item) => item.extraction_status === 'parsed_from_official_api',
  ).length;

  const document = {
    source: {
      publisher: '台灣麥當勞餐廳股份有限公司',
      title: '麥當勞台灣營養計算機、產品頁與官方 itemDetails API',
      calculator_url: CALCULATOR_URL,
      menu_url: FULL_MENU_URL,
      api_path: '/dnaapp/itemDetails',
      source_class: 'primary_official',
      retrieved_at: retrievedAt,
      transport: 'curl_http1_1',
    },
    lifecycle: 'raw_snapshot_for_review',
    warnings: [
      '此檔案由機器從官方 API 擷取，尚未經人工逐項驗證，不可直接標記為 stable 或 human-reviewed。',
      'nutrition_basis 保留為官方 API 的每份 per portion；不自行把官方每份資料改寫為每 100 g。',
      '缺少欄位保持 unknown，不補成 0。',
      '官方數值為平均資料，實際產品可能因配方、操作及食材差異而變動。',
    ],
    enumeration: {
      discovered_product_count: links.size,
      attempted_product_count: selected.length,
      parsed_product_count: parsedCount,
      pages: enumerationPages,
    },
    items,
    errors,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${outputPath}`);
  console.log(`Discovered ${links.size}; parsed ${parsedCount}/${items.length}; errors ${errors.length}.`);

  if (links.size === 0 || items.length === 0 || parsedCount === 0) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
