import { execFile } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const BASE = 'https://www.starbucks.com.tw';
const DRINKS_URL = `${BASE}/products/drinks.jspx`;
const FOOD_CALORIES_URL = `${BASE}/products/calories/calories.jspx`;
const DRINK_CALORIES_URL = `${BASE}/products/calories/calories_drinks.jspx`;
const OUTPUT_ROOT = process.env.OUTPUT_ROOT ?? 'knowledge/menu-items/starbucks';
const USER_AGENT = 'TWFoodMCP/0.1 (+https://github.com/NTUT-Vincent/TWFoodMCP; official nutrition data research)';
const delayMs = Number(process.env.DELAY_MS ?? '250');
const maxProducts = Number(process.env.MAX_PRODUCTS ?? '500');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function curl(url, outputFile = null) {
  const args = [
    '--http1.1', '--location', '--compressed', '--silent', '--show-error', '--fail-with-body',
    '--retry', '3', '--retry-all-errors', '--connect-timeout', '20', '--max-time', '120',
    '--user-agent', USER_AGENT,
    '--header', 'Accept-Language: zh-TW,zh;q=0.9,en;q=0.7',
  ];
  if (outputFile) args.push('--output', outputFile);
  args.push(url);
  const { stdout } = await execFileAsync('curl', args, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  return stdout;
}

function decodeHtml(value) {
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

function textOnly(html) {
  return decodeHtml(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>|<\/div>|<\/tr>|<\/li>|<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\t\r ]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function safeSlug(input) {
  const normalized = String(input ?? '')
    .normalize('NFKC')
    .replace(/[\\/:*?"<>|#%{}\[\]]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
  return normalized || 'unknown';
}

function yamlScalar(value) {
  return JSON.stringify(String(value ?? ''), null, 0);
}

function absoluteUrl(raw, base = BASE) {
  try { return new URL(decodeHtml(raw).replaceAll('\\/', '/'), base).href; } catch { return null; }
}

function discoverProductLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/href\s*=\s*["']([^"']*product\.jspx\?[^"']+)["']/gi)) {
    const url = absoluteUrl(match[1], DRINKS_URL);
    if (url?.includes('/products/drinks/product.jspx')) links.add(url);
  }
  return [...links].sort();
}

function discoverNutritionImages(html, pageUrl) {
  const images = new Set();
  for (const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+\.(?:png|jpe?g)(?:\?[^"']*)?)["']/gi)) {
    const url = absoluteUrl(match[1], pageUrl);
    if (url && /calories|nutrition|food-|drink-/i.test(url)) images.add(url);
  }
  return [...images].sort();
}

function extractTitle(html, fallback) {
  const candidates = [
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1],
    html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1],
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1],
  ];
  for (const candidate of candidates) {
    const value = textOnly(candidate ?? '').replace(/\s*[|｜-]\s*星巴克.*$/i, '').trim();
    if (value && value.length <= 120) return value;
  }
  return fallback;
}

function extractNutrition(text) {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const nutrition = {};
  const patterns = [
    ['energy_kcal', /(?:熱量|卡路里)[^0-9]{0,12}([0-9]+(?:\.[0-9]+)?)\s*(?:kcal|大卡)?/i],
    ['protein_g', /蛋白質[^0-9]{0,12}([0-9]+(?:\.[0-9]+)?)\s*g?/i],
    ['fat_g', /(?:總脂肪|脂肪)[^0-9]{0,12}([0-9]+(?:\.[0-9]+)?)\s*g?/i],
    ['saturated_fat_g', /飽和脂肪[^0-9]{0,12}([0-9]+(?:\.[0-9]+)?)\s*g?/i],
    ['trans_fat_g', /反式脂肪[^0-9]{0,12}([0-9]+(?:\.[0-9]+)?)\s*g?/i],
    ['carbohydrate_g', /碳水化合物[^0-9]{0,12}([0-9]+(?:\.[0-9]+)?)\s*g?/i],
    ['sugar_g', /(?:糖|糖類)[^0-9]{0,12}([0-9]+(?:\.[0-9]+)?)\s*g?/i],
    ['sodium_mg', /鈉[^0-9]{0,12}([0-9]+(?:\.[0-9]+)?)\s*mg?/i],
    ['caffeine_mg', /咖啡因[^0-9]{0,12}([0-9]+(?:\.[0-9]+)?)\s*mg?/i],
  ];
  for (const [key, pattern] of patterns) {
    const match = text.match(pattern);
    if (match) nutrition[key] = Number(match[1]);
  }
  return { nutrition, lines };
}

function conceptMarkdown({ title, category, resource, nutrition = {}, sourceTitle, retrievedAt, status, notes = [] }) {
  const keys = Object.keys(nutrition);
  const calculationAllowed = status === 'active' && nutrition.energy_kcal != null;
  const frontmatter = [
    '---',
    'type: Food Menu Item',
    `title: ${yamlScalar(`星巴克 ${title}`)}`,
    `description: ${yamlScalar(`星巴克台灣官方來源列出的${category === 'drink' ? '飲品' : '食品'}與營養資訊。`)}`,
    `resource: ${yamlScalar(resource)}`,
    'tags:',
    '- starbucks',
    '- 台灣',
    `- ${category === 'drink' ? '飲品' : '食品'}`,
    `status: ${status}`,
    'generated:',
    '  by: process:starbucks-taiwan-github-action-scraper',
    `  at: ${yamlScalar(retrievedAt)}`,
    'sources:',
    `- id: ${yamlScalar(`starbucks-official-${category}`)}`,
    `  resource: ${yamlScalar(resource)}`,
    `  title: ${yamlScalar(sourceTitle)}`,
    '  author: organization:starbucks-taiwan',
    `  last_modified: ${yamlScalar(retrievedAt.slice(0, 10))}`,
    'food:',
    `  brand: ${yamlScalar('星巴克')}`,
    `  name: ${yamlScalar(title)}`,
    `  category: ${yamlScalar(category)}`,
    '  nutrition_basis: per_serving_as_published',
    `  calculation_allowed: ${calculationAllowed ? 'true' : 'false'}`,
    `  requires_human_review: ${status === 'draft' ? 'true' : 'false'}`,
  ];
  if (keys.length) {
    frontmatter.push('  nutrition:');
    for (const key of keys.sort()) frontmatter.push(`    ${key}: ${nutrition[key]}`);
  }
  frontmatter.push('---', '', `# ${title}`, '', `官方來源：${resource}`, '');
  if (keys.length) {
    frontmatter.push('## 營養資訊', '', '| 欄位 | 數值 |', '|---|---:|');
    for (const key of keys.sort()) frontmatter.push(`| ${key} | ${nutrition[key]} |`);
    frontmatter.push('');
  }
  if (notes.length) {
    frontmatter.push('## 擷取備註', '');
    for (const note of notes) frontmatter.push(`- ${note}`);
    frontmatter.push('');
  }
  return `${frontmatter.join('\n')}\n`;
}

function splitOcrRows(text) {
  return text.split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length >= 4 && /[\u3400-\u9fff]/.test(line) && /\d/.test(line));
}

function parseFoodOcrRow(row) {
  const numbers = [...row.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
  const name = row.slice(0, row.search(/\d/)).replace(/\s+/g, '').trim();
  if (!name || numbers.length < 2) return null;
  const [servingWeight, energy, protein, fat, saturatedFat, transFat, carbohydrate, sugar, sodium] = numbers;
  const nutrition = {};
  if (Number.isFinite(servingWeight)) nutrition.serving_weight_g = servingWeight;
  if (Number.isFinite(energy)) nutrition.energy_kcal = energy;
  if (Number.isFinite(protein)) nutrition.protein_g = protein;
  if (Number.isFinite(fat)) nutrition.fat_g = fat;
  if (Number.isFinite(saturatedFat)) nutrition.saturated_fat_g = saturatedFat;
  if (Number.isFinite(transFat)) nutrition.trans_fat_g = transFat;
  if (Number.isFinite(carbohydrate)) nutrition.carbohydrate_g = carbohydrate;
  if (Number.isFinite(sugar)) nutrition.sugar_g = sugar;
  if (Number.isFinite(sodium)) nutrition.sodium_mg = sodium;
  return { name, nutrition };
}

async function main() {
  const retrievedAt = new Date().toISOString();
  const work = '.tmp/starbucks';
  await rm(work, { recursive: true, force: true });
  await rm(OUTPUT_ROOT, { recursive: true, force: true });
  await mkdir(path.join(OUTPUT_ROOT, 'drinks'), { recursive: true });
  await mkdir(path.join(OUTPUT_ROOT, 'foods'), { recursive: true });
  await mkdir(path.join(OUTPUT_ROOT, 'sources'), { recursive: true });
  await mkdir(work, { recursive: true });

  const errors = [];
  let drinksHtml = '';
  try { drinksHtml = await curl(DRINKS_URL); } catch (error) { errors.push({ stage: 'drinks-index', error: String(error) }); }
  const productLinks = discoverProductLinks(drinksHtml).slice(0, maxProducts);
  let drinkCount = 0;

  for (const [index, url] of productLinks.entries()) {
    try {
      const html = await curl(url);
      const title = extractTitle(html, new URL(url).searchParams.get('id') ?? `drink-${index + 1}`);
      const parsed = extractNutrition(textOnly(html));
      const status = parsed.nutrition.energy_kcal != null ? 'active' : 'draft';
      const file = path.join(OUTPUT_ROOT, 'drinks', `${safeSlug(title)}-${String(index + 1).padStart(3, '0')}.md`);
      await writeFile(file, conceptMarkdown({
        title, category: 'drink', resource: url, nutrition: parsed.nutrition,
        sourceTitle: '星巴克台灣官方飲品商品頁', retrievedAt, status,
        notes: status === 'draft' ? ['商品存在已由官方頁面確認，但未能從 HTML 可靠解析完整營養值，因此禁止計算。'] : [],
      }), 'utf8');
      drinkCount += 1;
    } catch (error) {
      errors.push({ stage: 'drink-product', url, error: String(error) });
    }
    console.log(`[drink ${index + 1}/${productLinks.length}] ${url}`);
    await sleep(delayMs);
  }

  const nutritionPages = [FOOD_CALORIES_URL, DRINK_CALORIES_URL];
  const imageUrls = new Set();
  for (const pageUrl of nutritionPages) {
    try {
      const html = await curl(pageUrl);
      discoverNutritionImages(html, pageUrl).forEach((url) => imageUrls.add(url));
    } catch (error) {
      errors.push({ stage: 'nutrition-page', url: pageUrl, error: String(error) });
    }
  }

  let foodCount = 0;
  let imageIndex = 0;
  for (const imageUrl of [...imageUrls]) {
    imageIndex += 1;
    const extension = path.extname(new URL(imageUrl).pathname) || '.png';
    const imageFile = path.join(work, `nutrition-${String(imageIndex).padStart(3, '0')}${extension}`);
    const ocrBase = path.join(work, `nutrition-${String(imageIndex).padStart(3, '0')}`);
    try {
      await curl(imageUrl, imageFile);
      await execFileAsync('tesseract', [imageFile, ocrBase, '-l', 'chi_tra+eng', '--psm', '6'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
      const ocrText = await readFile(`${ocrBase}.txt`, 'utf8');
      await writeFile(path.join(OUTPUT_ROOT, 'sources', `nutrition-${String(imageIndex).padStart(3, '0')}.txt`), ocrText, 'utf8');
      for (const row of splitOcrRows(ocrText)) {
        const parsed = parseFoodOcrRow(row);
        if (!parsed) continue;
        foodCount += 1;
        const file = path.join(OUTPUT_ROOT, 'foods', `${safeSlug(parsed.name)}-${String(foodCount).padStart(3, '0')}.md`);
        await writeFile(file, conceptMarkdown({
          title: parsed.name,
          category: 'food',
          resource: imageUrl,
          nutrition: parsed.nutrition,
          sourceTitle: '星巴克台灣官方食品營養標示表',
          retrievedAt,
          status: 'draft',
          notes: ['營養數值由官方表格圖片經繁中 OCR 轉錄，尚未逐列人工核對，禁止用於精確計算。', `OCR 原始列：${row}`],
        }), 'utf8');
      }
    } catch (error) {
      errors.push({ stage: 'nutrition-image', url: imageUrl, error: String(error) });
    }
  }

  const index = `# Starbucks Taiwan OKF\n\n- 飲品商品頁 concepts：${drinkCount}\n- 食品 OCR draft concepts：${foodCount}\n- 官方營養表圖片：${imageUrls.size}\n- 擷取時間：${retrievedAt}\n\n飲品若無法可靠解析營養值會維持 draft；食品 OCR 一律維持 draft，直到人工核對。\n`;
  await writeFile(path.join(OUTPUT_ROOT, 'index.md'), index, 'utf8');
  await writeFile(path.join(OUTPUT_ROOT, 'log.md'), `# Update log\n\n- ${retrievedAt}: GitHub Action 擷取星巴克台灣官方商品頁與營養標示圖片。\n`, 'utf8');
  await mkdir('artifacts', { recursive: true });
  await writeFile('artifacts/starbucks-tw-scrape-report.json', `${JSON.stringify({ retrieved_at: retrievedAt, drink_count: drinkCount, food_count: foodCount, product_links: productLinks.length, nutrition_images: [...imageUrls], errors }, null, 2)}\n`, 'utf8');

  console.log(`Generated ${drinkCount} drinks and ${foodCount} food drafts.`);
  if (drinkCount === 0 && foodCount === 0) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
