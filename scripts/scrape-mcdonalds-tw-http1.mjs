import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const CALCULATOR_URL =
  'https://www.mcdonalds.com/tw/zh-tw/sustainability/good-food/nutrition-calculator.html';
const FULL_MENU_URL = 'https://www.mcdonalds.com/tw/zh-tw/full-menu.html';
const DEFAULT_OUTPUT = 'artifacts/mcdonalds-tw-nutrition.http1.raw.json';
const DEFAULT_MAX_PRODUCTS = 300;
const DEFAULT_DELAY_MS = 350;
const USER_AGENT =
  'TWFoodMCP/0.1 (+https://github.com/NTUT-Vincent/TWFoodMCP; public nutrition data research)';

function readArg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const outputPath = readArg('--output', process.env.OUTPUT_PATH ?? DEFAULT_OUTPUT);
const maxProducts = Number(
  readArg('--max-products', process.env.MAX_PRODUCTS ?? DEFAULT_MAX_PRODUCTS),
);
const delayMs = Number(readArg('--delay-ms', process.env.DELAY_MS ?? DEFAULT_DELAY_MS));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  return decodeEntities(
    String(value ?? '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function parseNumber(value) {
  const match = String(value ?? '').replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

const NUTRIENTS = [
  { key: 'saturated_fat_g', labels: ['飽和脂肪', 'saturated fat'] },
  { key: 'trans_fat_g', labels: ['反式脂肪', 'trans fat'] },
  { key: 'dietary_fiber_g', labels: ['膳食纖維', 'dietary fiber', 'dietary fibre'] },
  { key: 'carbohydrate_g', labels: ['碳水化合物', 'carbohydrate', 'total carb'] },
  { key: 'protein_g', labels: ['蛋白質', 'protein'] },
  { key: 'fat_g', labels: ['總脂肪', '脂肪', 'total fat'] },
  { key: 'sugar_g', labels: ['糖', 'sugar'] },
  { key: 'sodium_mg', labels: ['鈉', 'sodium'] },
  { key: 'energy_kcal', labels: ['熱量', 'calories', 'energy'] },
];

function nutrientKey(label) {
  const normalized = stripTags(label).toLowerCase();
  return NUTRIENTS.find(({ labels }) => labels.some((item) => normalized.includes(item)))?.key ?? null;
}

async function curlText(url) {
  const { stdout, stderr } = await execFileAsync(
    'curl',
    [
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
      'Accept: text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
      url,
    ],
    { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024 },
  );

  if (stderr?.trim()) process.stderr.write(`${stderr.trim()}\n`);
  return stdout;
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
    /["'](https?:\\?\/\\?\/[^"']+?\/tw\/zh-tw\/product\/[^"']+?\.html)["']/gi,
    /["'](\/tw\/zh-tw\/product\/[^"']+?\.html)["']/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const raw = match[1].replaceAll('\\/', '/');
      const url = normalizeUrl(raw, baseUrl);
      if (url?.includes('mcdonalds.com/tw/zh-tw/product/')) links.add(url);
    }
  }

  return [...links].sort();
}

function collectResourceUrls(html, baseUrl) {
  const urls = new Set();
  const pattern = /<(?:script|link)\b[^>]*(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(pattern)) {
    const url = normalizeUrl(match[1], baseUrl);
    if (url && /mcdonalds\.com|mcd\.com|akamai|adobe/i.test(url)) urls.add(url);
  }
  return [...urls].slice(0, 500);
}

function collectRows(html) {
  const rows = [];
  for (const rowMatch of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...rowMatch[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)]
      .map((match) => stripTags(match[1]))
      .filter(Boolean);
    if (cells.length >= 2) rows.push(cells);
  }
  return rows;
}

function collectNutritionSnippets(html) {
  const snippets = [];
  const lower = html.toLowerCase();
  const needles = ['營養資訊', '熱量', '蛋白質', 'saturated fat', 'nutrition'];

  for (const needle of needles) {
    let cursor = 0;
    while (snippets.length < 30) {
      const index = lower.indexOf(needle.toLowerCase(), cursor);
      if (index < 0) break;
      const start = Math.max(0, index - 500);
      const end = Math.min(html.length, index + 2_500);
      const snippet = html.slice(start, end);
      if (!snippets.some((existing) => existing === snippet)) snippets.push(snippet);
      cursor = index + needle.length;
    }
  }

  return snippets;
}

function parseNutrition(rows, snippets) {
  const values = {};
  const evidence = [];

  for (const cells of rows) {
    const key = nutrientKey(cells[0]);
    if (!key || values[key] !== undefined) continue;
    const value = parseNumber(cells[1]);
    if (value === null) continue;
    values[key] = value;
    evidence.push({ key, label: cells[0], per_portion: cells[1], row: cells });
  }

  if (Object.keys(values).length < 5) {
    const searchable = snippets.join('\n').replaceAll('\\u002d', '-');
    for (const nutrient of NUTRIENTS) {
      if (values[nutrient.key] !== undefined) continue;
      for (const label of nutrient.labels) {
        const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(
          `${escaped}.{0,180}?(?:per[_ -]?portion|每份)?[^0-9-]{0,80}(-?\\d+(?:\\.\\d+)?)`,
          'is',
        );
        const match = searchable.match(pattern);
        if (!match) continue;
        values[nutrient.key] = Number(match[1]);
        evidence.push({ key: nutrient.key, label, source: 'embedded_source_snippet', match: match[0].slice(0, 500) });
        break;
      }
    }
  }

  return { values, evidence };
}

function pageName(html, fallbackUrl) {
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    const name = stripTags(h1[1]);
    if (name) return name;
  }
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (title) return stripTags(title[1]).replace(/\s*[|｜].*$/, '').trim();
  return new URL(fallbackUrl).pathname.split('/').pop()?.replace(/\.html$/, '') ?? fallbackUrl;
}

async function main() {
  const retrievedAt = new Date().toISOString();
  const errors = [];
  const enumeratorSnapshots = [];
  const productLinks = new Set();

  for (const url of [CALCULATOR_URL, FULL_MENU_URL]) {
    try {
      const html = await curlText(url);
      for (const link of collectProductLinks(html, url)) productLinks.add(link);
      enumeratorSnapshots.push({
        url,
        byte_length: Buffer.byteLength(html),
        title: pageName(html, url),
        product_link_count: collectProductLinks(html, url).length,
        resource_urls: collectResourceUrls(html, url),
        nutrition_snippets: collectNutritionSnippets(html).map(stripTags).filter(Boolean).slice(0, 10),
      });
    } catch (error) {
      errors.push({ stage: 'enumerate_http1', url, error: String(error) });
    }
  }

  const selectedLinks = [...productLinks].slice(0, maxProducts);
  const items = [];

  for (const [index, url] of selectedLinks.entries()) {
    try {
      const html = await curlText(url);
      const rows = collectRows(html);
      const snippets = collectNutritionSnippets(html);
      const nutrition = parseNutrition(rows, snippets);
      items.push({
        source_url: url,
        name: pageName(html, url),
        nutrition_basis: 'per_portion_as_published',
        nutrition: nutrition.values,
        nutrition_evidence: nutrition.evidence,
        extracted_rows: rows,
        resource_urls: collectResourceUrls(html, url),
        source_byte_length: Buffer.byteLength(html),
        extraction_status:
          Object.keys(nutrition.values).length >= 5 ? 'parsed' : 'needs_browser_or_endpoint_review',
        nutrition_source_snippets: snippets.map(stripTags).filter(Boolean).slice(0, 8),
      });
    } catch (error) {
      errors.push({ stage: 'product_http1', url, error: String(error) });
    }

    process.stdout.write(`[${index + 1}/${selectedLinks.length}] ${url}\n`);
    await sleep(delayMs);
  }

  const document = {
    source: {
      publisher: '台灣麥當勞餐廳股份有限公司',
      title: '麥當勞台灣營養計算機與產品頁',
      calculator_url: CALCULATOR_URL,
      menu_url: FULL_MENU_URL,
      source_class: 'primary_official',
      retrieved_at: retrievedAt,
      transport: 'curl_http1_1',
    },
    lifecycle: 'raw_snapshot_for_review',
    warnings: [
      '此檔案由機器擷取，尚未經人工逐項驗證，不可直接標記為 stable 或 human-reviewed。',
      'nutrition_basis 保留為官方頁面的每份 per portion；若官方未提供重量，不自行換算每 100 g。',
      '缺少欄位保持 unknown，不補成 0。',
      '官方說明產品數值為平均資料，實際產品可能因配方、操作及食材差異而變動。',
    ],
    enumeration: {
      discovered_product_count: productLinks.size,
      attempted_product_count: selectedLinks.length,
      pages: enumeratorSnapshots,
    },
    items,
    errors,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');

  const parsed = items.filter((item) => item.extraction_status === 'parsed').length;
  console.log(`Wrote ${outputPath}`);
  console.log(`Discovered ${productLinks.size} products; parsed ${parsed}/${items.length}.`);

  if (productLinks.size === 0) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
