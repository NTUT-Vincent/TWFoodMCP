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

function readArg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const outputPath = readArg('--output', process.env.OUTPUT_PATH ?? DEFAULT_OUTPUT);
const maxProducts = Number(readArg('--max-products', process.env.MAX_PRODUCTS ?? '300'));
const delayMs = Number(readArg('--delay-ms', process.env.DELAY_MS ?? '350'));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function curlText(url, { accept = 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8', referer } = {}) {
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

function decodeEntities(value) {
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

function stripTags(value) {
  return decodeEntities(String(value ?? '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function parseAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)) {
    attributes[match[1]] = decodeEntities(match[2]);
  }
  return attributes;
}

function normalizeUrl(raw, baseUrl) {
  try {
    return new URL(decodeEntities(raw), baseUrl).href.split('#')[0].split('?')[0];
  } catch {
    return null;
  }
}

function collectProductLinks(html, baseUrl) {
  const links = new Set();
  const patterns = [
    /href\s*=\s*["']([^"']*\/tw\/zh-tw\/product\/[^"'#?]+\.html[^"']*)["']/gi,
    /["'](\/tw\/zh-tw\/product\/[^"']+?\.html)["']/gi,
  ];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const url = normalizeUrl(match[1].replaceAll('\\/', '/'), baseUrl);
      if (url?.includes('mcdonalds.com/tw/zh-tw/product/')) links.add(url);
    }
  }
  return [...links].sort();
}

function pageName(html, fallbackUrl) {
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1 && stripTags(h1[1])) return stripTags(h1[1]);
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (title) return stripTags(title[1]).replace(/\s*[|｜].*$/, '').trim();
  return new URL(fallbackUrl).pathname.split('/').pop()?.replace(/\.html$/, '') ?? fallbackUrl;
}

function productConfig(html, pageUrl) {
  const match = html.match(/<[^>]+data-component=["']pdp["'][^>]*>/i);
  if (!match) return null;

  const attributes = parseAttributes(match[0]);
  const productId = attributes['data-product-id'];
  const apiPath = attributes['data-product-api-url'];
  if (!productId || !apiPath) return null;

  const apiUrl = new URL(apiPath, pageUrl);
  apiUrl.searchParams.set('country', attributes['data-country'] || 'tw');
  apiUrl.searchParams.set('language', attributes['data-language'] || 'zh-tw');
  apiUrl.searchParams.set('showLiveData', attributes['data-show-live-data'] || 'true');
  apiUrl.searchParams.set('item', productId);
  if (attributes['data-daypart-id']) {
    apiUrl.searchParams.set('daypartId', attributes['data-daypart-id']);
  }
  apiUrl.searchParams.set('compType', 'core');
  apiUrl.searchParams.set('returnType', 'json');

  return {
    product_id: productId,
    nutrients_id: attributes['data-nutrients-id'] || null,
    api_url: apiUrl.href,
  };
}

function numeric(value) {
  if (value === null || value === undefined || value === '') return null;
  const matched = String(value).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  if (!matched) return null;
  const number = Number(matched[0]);
  return Number.isFinite(number) ? number : null;
}

function canonicalKey(nutrient) {
  const combined = [
    nutrient?.nutrient_name_id,
    nutrient?.nutrientNameId,
    nutrient?.name,
    nutrient?.title,
    nutrient?.description,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/energy_kcal|calories|kcal|熱量/.test(combined)) return 'energy_kcal';
  if (/saturated/.test(combined) || /飽和脂肪/.test(combined)) return 'saturated_fat_g';
  if (/trans[_ -]?fat/.test(combined) || /反式脂肪/.test(combined)) return 'trans_fat_g';
  if (/carbohydrate|碳水化合物/.test(combined)) return 'carbohydrate_g';
  if (/(^|[_ -])sugar($|[_ -])|糖/.test(combined)) return 'sugar_g';
  if (/dietary[_ -]?fiber|\bfiber\b|fibre|膳食纖維/.test(combined)) return 'dietary_fiber_g';
  if (/protein|蛋白質/.test(combined)) return 'protein_g';
  if (/sodium|鈉/.test(combined)) return 'sodium_mg';
  if (/(^|[_ -])fat($|[_ -])|總脂肪|^脂肪$/.test(combined)) return 'fat_g';
  return null;
}

function nutrientValue(nutrient) {
  return numeric(
    nutrient?.value ??
      nutrient?.amount ??
      nutrient?.nutrient_value ??
      nutrient?.nutrientValue ??
      nutrient?.primary_serving_value,
  );
}

function looksLikeNutrient(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return false;
  return Boolean(canonicalKey(record)) && nutrientValue(record) !== null;
}

function collectNutrientRecords(node, found = [], seen = new Set()) {
  if (!node || typeof node !== 'object' || seen.has(node)) return found;
  seen.add(node);

  if (Array.isArray(node)) {
    for (const entry of node) {
      if (looksLikeNutrient(entry)) found.push(entry);
      collectNutrientRecords(entry, found, seen);
    }
    return found;
  }

  if (looksLikeNutrient(node)) found.push(node);
  for (const value of Object.values(node)) collectNutrientRecords(value, found, seen);
  return found;
}

function findItem(payload) {
  if (payload?.item && typeof payload.item === 'object') return payload.item;
  if (payload?.itemDetail?.item && typeof payload.itemDetail.item === 'object') return payload.itemDetail.item;
  if (payload?.itemDetails?.item && typeof payload.itemDetails.item === 'object') return payload.itemDetails.item;
  if (payload?.data?.item && typeof payload.data.item === 'object') return payload.data.item;
  return null;
}

function normalizeApiPayload(payload) {
  const item = findItem(payload);
  const rawNutrients = collectNutrientRecords(payload);
  const nutrition = {};
  const evidence = [];
  const dedupe = new Set();

  for (const nutrient of rawNutrients) {
    const key = canonicalKey(nutrient);
    const value = nutrientValue(nutrient);
    if (!key || value === null || nutrition[key] !== undefined) continue;
    const signature = `${key}:${value}`;
    if (dedupe.has(signature)) continue;
    dedupe.add(signature);
    nutrition[key] = value;
    evidence.push({
      key,
      id: nutrient?.id ?? null,
      name: nutrient?.name ?? nutrient?.title ?? null,
      nutrient_name_id: nutrient?.nutrient_name_id ?? nutrient?.nutrientNameId ?? null,
      value: nutrient?.value ?? nutrient?.amount ?? nutrient?.nutrient_value ?? null,
      uom: nutrient?.uom ?? nutrient?.unit ?? null,
      uom_description: nutrient?.uom_description ?? nutrient?.unit_description ?? null,
      adult_dv: nutrient?.adult_dv ?? nutrient?.daily_value ?? null,
    });
  }

  return {
    item,
    raw_nutrients: rawNutrients,
    nutrition,
    nutrition_evidence: evidence,
    payload_top_level_keys:
      payload && typeof payload === 'object' && !Array.isArray(payload) ? Object.keys(payload) : [],
  };
}

async function main() {
  const retrievedAt = new Date().toISOString();
  const errors = [];
  const productLinks = new Set();
  const enumeratorPages = [];

  for (const url of [CALCULATOR_URL, FULL_MENU_URL]) {
    try {
      const html = await curlText(url);
      const links = collectProductLinks(html, url);
      links.forEach((link) => productLinks.add(link));
      enumeratorPages.push({
        url,
        byte_length: Buffer.byteLength(html),
        discovered_links: links.length,
      });
    } catch (error) {
      errors.push({ stage: 'enumerate', url, error: String(error) });
    }
  }

  const selectedLinks = [...productLinks].slice(0, maxProducts);
  const items = [];

  for (const [index, pageUrl] of selectedLinks.entries()) {
    try {
      const html = await curlText(pageUrl);
      const config = productConfig(html, pageUrl);
      if (!config) throw new Error('Product page did not expose PDP API configuration.');

      const rawApiText = await curlText(config.api_url, {
        accept: 'application/json',
        referer: pageUrl,
      });
      const payload = JSON.parse(rawApiText);
      const normalized = normalizeApiPayload(payload);
      const apiName =
        normalized.item?.product_marketing_name ||
        normalized.item?.item_marketing_name ||
        normalized.item?.productName ||
        normalized.item?.name;
      const nutritionCount = Object.keys(normalized.nutrition).length;

      items.push({
        source_url: pageUrl,
        source_api_url: config.api_url,
        product_id: config.product_id,
        nutrients_id: config.nutrients_id,
        name: typeof apiName === 'string' && apiName.trim() ? apiName.trim() : pageName(html, pageUrl),
        nutrition_basis: 'per_portion_as_published',
        serving_size: null,
        nutrition: normalized.nutrition,
        nutrition_evidence: normalized.nutrition_evidence,
        raw_nutrients: normalized.raw_nutrients,
        api_payload_top_level_keys: normalized.payload_top_level_keys,
        api_item_metadata: {
          product_name: normalized.item?.product_name ?? normalized.item?.productName ?? null,
          product_marketing_name: normalized.item?.product_marketing_name ?? null,
          item_name: normalized.item?.item_name ?? normalized.item?.name ?? null,
          item_marketing_name: normalized.item?.item_marketing_name ?? null,
          item_allergen: normalized.item?.item_allergen ?? null,
          item_additional_allergen: normalized.item?.item_additional_allergen ?? null,
        },
        extraction_status:
          normalized.nutrition.energy_kcal !== undefined && nutritionCount >= 5
            ? 'parsed_from_official_api'
            : 'needs_review',
      });
    } catch (error) {
      errors.push({ stage: 'product', url: pageUrl, error: String(error) });
    }

    process.stdout.write(`[${index + 1}/${selectedLinks.length}] ${pageUrl}\n`);
    await sleep(delayMs);
  }

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
      'nutrition_basis 保留為官方 API 的每份 per portion；若官方未提供重量，不自行換算每 100 g。',
      '缺少欄位保持 unknown，不補成 0。',
      '官方說明產品數值為平均資料，實際產品可能因配方、操作及食材差異而變動。',
    ],
    enumeration: {
      discovered_product_count: productLinks.size,
      attempted_product_count: selectedLinks.length,
      pages: enumeratorPages,
    },
    items,
    errors,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');

  const parsed = items.filter((item) => item.extraction_status === 'parsed_from_official_api').length;
  console.log(`Wrote ${outputPath}`);
  console.log(`Discovered ${productLinks.size} products; API parsed ${parsed}/${items.length}.`);

  if (productLinks.size === 0 || items.length === 0 || parsed === 0) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
