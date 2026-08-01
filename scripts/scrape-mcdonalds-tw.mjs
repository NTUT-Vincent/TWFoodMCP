import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CALCULATOR_URL =
  'https://www.mcdonalds.com/tw/zh-tw/sustainability/good-food/nutrition-calculator.html';
const FULL_MENU_URL = 'https://www.mcdonalds.com/tw/zh-tw/full-menu.html';
const DEFAULT_OUTPUT = 'artifacts/mcdonalds-tw-nutrition.raw.json';
const DEFAULT_DELAY_MS = 350;
const DEFAULT_MAX_PRODUCTS = 300;

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

function cleanText(value) {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseNumber(value) {
  const match = cleanText(value).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

const NUTRIENT_RULES = [
  { key: 'saturated_fat_g', pattern: /飽和脂肪|saturated\s*fat/i },
  { key: 'trans_fat_g', pattern: /反式脂肪|trans\s*fat/i },
  { key: 'dietary_fiber_g', pattern: /膳食纖維|dietary\s*fib(?:er|re)/i },
  { key: 'carbohydrate_g', pattern: /碳水化合物|carbohydrate|total\s*carb/i },
  { key: 'protein_g', pattern: /蛋白質|protein/i },
  { key: 'fat_g', pattern: /^(?:總)?脂肪|total\s*fat/i },
  { key: 'sugar_g', pattern: /糖|sugars?/i },
  { key: 'sodium_mg', pattern: /鈉|sodium/i },
  { key: 'energy_kcal', pattern: /熱量|calories?|energy/i },
];

function nutrientKey(label) {
  const normalized = cleanText(label).replace(/[：:]/g, ' ');
  return NUTRIENT_RULES.find(({ pattern }) => pattern.test(normalized))?.key ?? null;
}

function parseNutrition(rows, textBlocks) {
  const values = {};
  const evidence = [];

  for (const row of rows) {
    const cells = row.map(cleanText).filter(Boolean);
    if (cells.length < 2) continue;

    const key = nutrientKey(cells[0]);
    if (!key || values[key] !== undefined) continue;

    const value = parseNumber(cells[1]);
    if (value === null) continue;

    values[key] = value;
    evidence.push({ key, label: cells[0], per_portion: cells[1], row: cells });
  }

  // Some versions of the component render label/value pairs without a semantic table.
  if (Object.keys(values).length < 5) {
    for (const block of textBlocks.map(cleanText).filter(Boolean)) {
      for (const { key, pattern } of NUTRIENT_RULES) {
        if (values[key] !== undefined || !pattern.test(block)) continue;

        const labelMatch = block.match(pattern);
        if (!labelMatch) continue;
        const suffix = block.slice((labelMatch.index ?? 0) + labelMatch[0].length);
        const value = parseNumber(suffix);
        if (value === null) continue;

        values[key] = value;
        evidence.push({ key, label: labelMatch[0], per_portion: String(value), block });
      }
    }
  }

  return { values, evidence };
}

function hasNutritionPayload(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return /熱量|蛋白質|碳水化合物|飽和脂肪|sodium|calories|nutrition/i.test(text);
}

async function collectProductLinks(page) {
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]'), (anchor) => anchor.href)
      .filter((href) => href.includes('/tw/zh-tw/product/'))
      .map((href) => href.split('#')[0].split('?')[0]),
  );
  return [...new Set(links)].sort();
}

async function collectPageSnapshot(page) {
  const snapshot = await page.evaluate(() => {
    const text = (element) => (element?.textContent ?? '').replace(/\s+/g, ' ').trim();

    const rows = Array.from(document.querySelectorAll('tr')).map((row) =>
      Array.from(row.querySelectorAll('th, td')).map(text).filter(Boolean),
    );

    const textBlocks = Array.from(
      document.querySelectorAll(
        'tr, li, [class*="nutrition" i], [class*="nutrient" i], [data-testid*="nutrition" i], dl, p',
      ),
      text,
    ).filter(Boolean);

    const headings = Array.from(document.querySelectorAll('h1, h2, h3'), text).filter(Boolean);
    const imageUrls = Array.from(document.querySelectorAll('img[src]'), (image) => image.src);

    return {
      title: document.title,
      headings,
      rows,
      textBlocks,
      imageUrls,
      bodyText: document.body?.innerText ?? '',
      html: document.documentElement.outerHTML,
    };
  });

  return {
    ...snapshot,
    bodyText: cleanText(snapshot.bodyText),
  };
}

async function revealNutrition(page) {
  const candidates = page.getByText(/查看營養資訊|營養資訊|Nutritional Information/i);
  const count = Math.min(await candidates.count(), 8);

  for (let index = 0; index < count; index += 1) {
    const candidate = candidates.nth(index);
    try {
      if (await candidate.isVisible()) {
        await candidate.click({ timeout: 1_500 });
        await sleep(150);
      }
    } catch {
      // The text can be a heading or covered by an accordion control. Continue with DOM parsing.
    }
  }
}

async function main() {
  const retrievedAt = new Date().toISOString();
  const networkPayloads = [];
  const networkManifest = [];
  const errors = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
    userAgent:
      'TWFoodMCP/0.1 (+https://github.com/NTUT-Vincent/TWFoodMCP; public nutrition data research)',
    viewport: { width: 1440, height: 1200 },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(12_000);

  page.on('response', async (response) => {
    const url = response.url();
    if (!url.includes('mcdonalds.com')) return;

    const contentType = response.headers()['content-type'] ?? '';
    networkManifest.push({ url, status: response.status(), content_type: contentType });

    if (!/json|javascript|text\//i.test(contentType)) return;
    try {
      const body = await response.text();
      if (body.length > 5_000_000 || !hasNutritionPayload(body)) return;
      networkPayloads.push({ url, status: response.status(), content_type: contentType, body });
    } catch {
      // Streaming, cached, or opaque responses may not expose their body.
    }
  });

  const enumeratorPages = [CALCULATOR_URL, FULL_MENU_URL];
  const productLinks = new Set();
  const enumeratorSnapshots = [];

  for (const url of enumeratorPages) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        window.scrollTo(0, 0);
      });
      for (const link of await collectProductLinks(page)) productLinks.add(link);
      const snapshot = await collectPageSnapshot(page);
      enumeratorSnapshots.push({
        url,
        title: snapshot.title,
        headings: snapshot.headings,
        body_text: snapshot.bodyText,
      });
    } catch (error) {
      errors.push({ stage: 'enumerate', url, error: String(error) });
    }
  }

  const selectedLinks = [...productLinks].slice(0, maxProducts);
  const items = [];

  for (const [index, url] of selectedLinks.entries()) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
      await revealNutrition(page);
      const snapshot = await collectPageSnapshot(page);
      const nutrition = parseNutrition(snapshot.rows, snapshot.textBlocks);
      const name = snapshot.headings[0] || snapshot.title.replace(/\s*[|｜].*$/, '').trim();

      items.push({
        source_url: url,
        name,
        nutrition_basis: 'per_portion_as_published',
        nutrition: nutrition.values,
        nutrition_evidence: nutrition.evidence,
        extracted_rows: snapshot.rows.filter((row) => row.length >= 2),
        image_urls: snapshot.imageUrls,
        page_title: snapshot.title,
        extraction_status:
          Object.keys(nutrition.values).length >= 5 ? 'parsed' : 'needs_review',
      });
    } catch (error) {
      errors.push({ stage: 'product', url, error: String(error) });
    }

    process.stdout.write(`[${index + 1}/${selectedLinks.length}] ${url}\n`);
    await sleep(delayMs);
  }

  await browser.close();

  const document = {
    source: {
      publisher: '台灣麥當勞餐廳股份有限公司',
      title: '麥當勞台灣營養計算機與產品頁',
      calculator_url: CALCULATOR_URL,
      menu_url: FULL_MENU_URL,
      source_class: 'primary_official',
      retrieved_at: retrievedAt,
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
    captured_network_payloads: networkPayloads,
    network_manifest: networkManifest,
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
