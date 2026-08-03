#!/usr/bin/env node
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { stringify } from "yaml";

const execFileAsync = promisify(execFile);
const BASE_URL = "https://www.mwd.com.tw/";
const SNAPSHOT_DATE = process.env.MWD_SNAPSHOT_DATE ?? dateInTaipei(new Date());
const RETRIEVED_AT = process.env.MWD_RETRIEVED_AT ?? new Date().toISOString();
const SNAPSHOT_PATH = process.env.MWD_SNAPSHOT
  ?? `references/source-snapshots/mwd-official-nutrition-${SNAPSHOT_DATE}.json`;
const OUTPUT_DIR = process.env.MWD_OKF_OUTPUT ?? "knowledge/menu-items/mwd";
const REQUEST_CONCURRENCY = positiveInteger(process.env.MWD_CONCURRENCY, 4);
const MIN_PRODUCTS = positiveInteger(process.env.MWD_MIN_PRODUCTS, 40);
const MIN_NUTRITION = positiveInteger(process.env.MWD_MIN_NUTRITION, 25);
const MIN_COMPLETE = positiveInteger(process.env.MWD_MIN_COMPLETE_NUTRITION, 3);
const USER_AGENT = "TWFoodMCP/1.0 (+https://github.com/NTUT-Vincent/TWFoodMCP; official nutrition data import)";

const CATEGORY_PAGES = [
  ["620", "期間限定", "limited-time"],
  ["619", "早午餐", "brunch"],
  ["618", "飯食", "rice"],
  ["617", "麵食", "noodles"],
  ["616", "中式餐點", "chinese"],
  ["615", "點心", "sides"],
  ["614", "沙拉湯品", "salads-soups"],
  ["613", "漢堡", "burgers"],
  ["612", "湯種吐司", "toast"],
  ["611", "滿分堡", "muffin-burgers"],
  ["610", "鬆餅堡", "pancake-burgers"],
  ["609", "丹麥堡", "danish"],
  ["608", "可頌", "croissants"],
  ["123", "咖啡飲品", "coffee"],
  ["125", "錫蘭茶品", "ceylon-tea"],
  ["124", "風味飲品", "flavored-drinks"],
  ["829", "季節限定", "seasonal-drinks"],
].map(([id, name, slug]) => ({
  id,
  name,
  slug,
  url: new URL(`index.php?code=list&ids=${id}`, BASE_URL).href,
}));

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function dateInTaipei(value) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${values.year}-${values.month}-${values.day}`;
}

function staleAfter(date, days = 180) {
  const parsed = new Date(`${date}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function decodeHtml(value) {
  const named = {
    amp: "&",
    quot: '"',
    apos: "'",
    lt: "<",
    gt: ">",
    nbsp: " ",
  };
  return String(value ?? "")
    .replace(/&#x([0-9a-f]+);/giu, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/gu, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&([a-z]+);/giu, (match, name) => named[name.toLowerCase()] ?? match);
}

function stripHtml(value) {
  return decodeHtml(String(value ?? "").replace(/<[^>]*>/gu, " "))
    .replace(/\s+/gu, " ")
    .trim();
}

function attribute(attributes, name) {
  const match = String(attributes ?? "").match(new RegExp(`\\b${name}\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))`, "iu"));
  return decodeHtml(match?.[1] ?? match?.[2] ?? match?.[3] ?? "");
}

function anchors(html) {
  const results = [];
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/giu;
  for (const match of html.matchAll(pattern)) {
    const attributes = match[1];
    const href = attribute(attributes, "href");
    if (!href) continue;
    const text = stripHtml(match[2]) || attribute(attributes, "title") || attribute(match[2], "alt");
    results.push({ href, text });
  }
  return results;
}

function normalizeProductName(title) {
  return String(title ?? "")
    .replace(/[（(]\s*營養標示請見內文\s*[）)]/gu, "")
    .replace(/\s*[-－–—]?\s*熱量\s*[\d./]+\s*大卡.*$/gu, "")
    .replace(/\s*[-－–—]\s*[\d./]+\s*大卡.*$/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function titleCalories(title) {
  const normalized = String(title ?? "").normalize("NFKC");
  const match = normalized.match(/(?:熱量\s*)?([0-9]+(?:\.[0-9]+)?(?:\s*\/\s*[0-9]+(?:\.[0-9]+)?)*)\s*大卡/iu);
  if (!match) return [];
  return match[1]
    .split("/")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value) && value >= 0);
}

function productLinks(html, category) {
  const products = [];
  for (const anchor of anchors(html)) {
    let url;
    try {
      url = new URL(anchor.href, BASE_URL);
    } catch {
      continue;
    }
    const articleId = url.searchParams.get("article_id");
    if (!articleId || url.searchParams.get("flag") !== "detail") continue;
    const listingTitle = anchor.text.trim();
    if (!listingTitle) continue;
    products.push({
      article_id: articleId,
      name: normalizeProductName(listingTitle),
      listing_title: listingTitle,
      category: category.name,
      category_slug: category.slug,
      category_id: category.id,
      source_url: url.href,
      listing_calories_kcal: titleCalories(listingTitle),
    });
  }
  return products;
}

function imageLinks(html, sourceUrl) {
  const urls = [];
  const pattern = /\b(?:src|href)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/giu;
  for (const match of html.matchAll(pattern)) {
    const raw = decodeHtml(match[1] ?? match[2] ?? match[3] ?? "");
    if (!raw) continue;
    try {
      const resolved = new URL(raw, sourceUrl);
      if (!/\.(?:jpe?g|png|webp)(?:$|\?)/iu.test(resolved.href)) continue;
      if (resolved.hostname !== "www.superqin.com.tw" && resolved.hostname !== "superqin.com.tw") continue;
      urls.push(resolved.href.replace(/^http:/u, "https:"));
    } catch {
      // Ignore malformed resource URLs.
    }
  }
  return [...new Set(urls)];
}

async function fetchWithRetry(url, { binary = false, attempts = 3 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": USER_AGENT,
          accept: binary ? "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8" : "text/html,application/xhtml+xml",
          "accept-language": "zh-TW,zh;q=0.9,en;q=0.6",
        },
        redirect: "follow",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return binary ? Buffer.from(await response.arrayBuffer()) : await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 700));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`Failed to fetch ${url}: ${lastError instanceof Error ? lastError.message : lastError}`);
}

async function mapLimit(values, limit, mapper) {
  const results = new Array(values.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= values.length) return;
      results[index] = await mapper(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, () => worker()));
  return results;
}

function normalizedOcrText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[|｜]/gu, " ")
    .replace(/，/gu, ",")
    .replace(/。/gu, ".");
}

function numericFromLine(lines, keywords) {
  for (const line of lines) {
    const compact = line.replace(/\s+/gu, "");
    if (!keywords.some((keyword) => compact.includes(keyword))) continue;
    const afterKeyword = keywords.reduce((value, keyword) => value.replace(keyword, " "), compact);
    const match = afterKeyword.match(/(?:^|[^0-9])([0-9]+(?:\.[0-9]+)?)/u);
    if (match) return Number(match[1]);
  }
  return undefined;
}

function parseNutritionOcr(rawText) {
  const text = normalizedOcrText(rawText);
  const lines = text.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  const values = {
    energy_kcal: numericFromLine(lines, ["熱量", "热量"]),
    protein_g: numericFromLine(lines, ["蛋白質", "蛋白质"]),
    fat_g: numericFromLine(lines, ["脂肪"]),
    carbohydrate_g: numericFromLine(lines, ["碳水化合物", "碳水化合"]),
  };
  return Object.fromEntries(Object.entries(values).filter(([, value]) => Number.isFinite(value)));
}

function validateNutrition(values, listingCalories) {
  const required = ["energy_kcal", "protein_g", "fat_g", "carbohydrate_g"];
  const complete = required.every((key) => Number.isFinite(values[key]));
  const reasons = [];
  if (!complete) reasons.push("missing_required_fields");
  if (Number.isFinite(values.energy_kcal) && (values.energy_kcal < 0 || values.energy_kcal > 2_000)) reasons.push("energy_out_of_range");
  for (const key of ["protein_g", "fat_g", "carbohydrate_g"]) {
    if (Number.isFinite(values[key]) && (values[key] < 0 || values[key] > 300)) reasons.push(`${key}_out_of_range`);
  }
  if (complete) {
    const calculated = 4 * values.protein_g + 9 * values.fat_g + 4 * values.carbohydrate_g;
    const tolerance = Math.max(45, values.energy_kcal * 0.25);
    if (Math.abs(calculated - values.energy_kcal) > tolerance) reasons.push("macro_energy_mismatch");
  }
  if (listingCalories.length === 1 && Number.isFinite(values.energy_kcal)) {
    const tolerance = Math.max(8, listingCalories[0] * 0.05);
    if (Math.abs(listingCalories[0] - values.energy_kcal) > tolerance) reasons.push("listing_energy_conflict");
  }
  return { complete, valid: complete && reasons.length === 0, reasons };
}

async function tesseractAvailable() {
  try {
    await execFileAsync("tesseract", ["--version"], { timeout: 10_000 });
    return true;
  } catch {
    return false;
  }
}

async function ocrImage(imageUrl, tempDir, articleId) {
  const extension = path.extname(new URL(imageUrl).pathname) || ".jpg";
  const imagePath = path.join(tempDir, `${articleId}${extension}`);
  await writeFile(imagePath, await fetchWithRetry(imageUrl, { binary: true }));
  const attempts = [];
  for (const psm of [6, 11]) {
    try {
      const { stdout } = await execFileAsync(
        "tesseract",
        [imagePath, "stdout", "-l", "chi_tra+eng", "--psm", String(psm)],
        { timeout: 90_000, maxBuffer: 8 * 1024 * 1024 },
      );
      const nutrition = parseNutritionOcr(stdout);
      attempts.push({ psm, raw_text: stdout.trim(), nutrition });
      if (Object.keys(nutrition).length === 4) break;
    } catch (error) {
      attempts.push({ psm, error: error instanceof Error ? error.message : String(error), nutrition: {} });
    }
  }
  return attempts.sort((a, b) => Object.keys(b.nutrition).length - Object.keys(a.nutrition).length)[0];
}

function itemNutrition(item) {
  if (item.ocr?.validation?.valid) return item.ocr.nutrition;
  if (item.listing_calories_kcal.length === 1) return { energy_kcal: item.listing_calories_kcal[0] };
  return {};
}

function frontmatterFor(item, snapshotResource) {
  const values = itemNutrition(item);
  const complete = ["energy_kcal", "protein_g", "fat_g", "carbohydrate_g"].every((key) => Number.isFinite(values[key]));
  const pageSourceId = `mwd-page-${item.article_id}`;
  const labelSourceId = `mwd-label-${item.article_id}`;
  const sources = [
    {
      id: pageSourceId,
      resource: item.source_url,
      title: `麥味登官方產品頁：${item.name}`,
      author: `mwd-tw/${SNAPSHOT_DATE}`,
      source_class: "primary_official",
      retrieved_at: RETRIEVED_AT,
      snapshot: snapshotResource,
    },
  ];
  if (item.nutrition_image_url) {
    sources.push({
      id: labelSourceId,
      resource: item.nutrition_image_url,
      title: `麥味登官方營養標示：${item.name}`,
      author: `mwd-tw/${SNAPSHOT_DATE}`,
      source_class: "primary_official",
      retrieved_at: RETRIEVED_AT,
      snapshot: snapshotResource,
    });
  }
  const extractionMethod = item.ocr?.validation?.valid ? "ocr_official_label" : "official_listing_title";
  const tags = [...new Set(["麥味登", "MWD", "官方營養", item.category])];
  return {
    type: "Food Product",
    title: `麥味登 ${item.name}`,
    description: `麥味登官方品項「${item.name}」的每份營養資料。`,
    resource: item.source_url,
    tags,
    generated: {
      by: "twfoodmcp-mwd-importer/1.0.0",
      at: RETRIEVED_AT,
    },
    status: "draft",
    stale_after: staleAfter(SNAPSHOT_DATE),
    sources,
    access: { classification: "public" },
    food: {
      id: `food:tw:menu:mwd:${item.article_id}`,
      kind: "menu_item",
      market: "TW",
      brand: "麥味登",
      name: item.name,
      aliases: [...new Set([item.name, `麥味登${item.name}`, `麥味登 ${item.name}`])],
    },
    revision: {
      revision_id: `official-web-${item.article_id}-${SNAPSHOT_DATE}`,
      source_product_id: item.article_id,
    },
    serving: {
      description: "官方菜單一份（官網未提供公克重量）",
      amount: 1,
      unit: "serving",
    },
    nutrition: [{ basis: "per_serving", values }],
    quality: {
      data_quality: "official_brand",
      completeness: complete ? "nutrition_complete" : "partial",
      confidence: "high",
      calculation_allowed: complete,
    },
    extraction: {
      method: extractionMethod,
      listing_title: item.listing_title,
      ...(item.ocr ? {
        ocr_engine: "tesseract/chi_tra+eng",
        ocr_psm: item.ocr.psm,
        validation: item.ocr.validation,
      } : {}),
    },
    limitations: [
      "本文件由麥味登官方網站自動擷取並建立為 draft，尚未經真人審核，只進入 preview dataset。",
      item.ocr?.validation?.valid
        ? "營養數值由官方營養標示圖片經 OCR 擷取並通過欄位完整性、合理範圍與熱量交叉檢查；仍需真人對照原圖後才能成為 stable。"
        : "目前只保留官方產品列表標題明示的熱量；蛋白質、脂肪與碳水化合物不得推測，且不允許營養計算。",
      "官網未提供精確份量重量，因此不得換算為每 100 公克或與重量基準品項直接比較。",
      "官方數值依標準製程估算，實際餐點可能因原料大小、配方與門市製作而有差異。",
      "未列出過敏原不代表不含；本次匯入不自行推測成分或過敏原。",
    ],
  };
}

function renderOkf(item, snapshotResource) {
  const frontmatter = frontmatterFor(item, snapshotResource);
  const pageSource = frontmatter.sources[0];
  const labelSource = frontmatter.sources[1];
  const summary = item.ocr?.validation?.valid
    ? `官方營養標示提供每份熱量、蛋白質、脂肪與碳水化合物；本文件保留官方每份基準，不自行換算。[^${pageSource.id}][^${labelSource.id}]`
    : `官方產品列表標題提供每份熱量；其他營養欄位未由來源支持，因此維持缺值。[^${pageSource.id}]`;
  const footnotes = frontmatter.sources.map((source) => `[^${source.id}]: ${source.title}`).join("\n");
  return `---\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n# Summary\n\n${summary}\n\n${footnotes}\n`;
}

async function main() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "twfoodmcp-mwd-"));
  try {
    const pages = await mapLimit(CATEGORY_PAGES, REQUEST_CONCURRENCY, async (category) => ({
      category,
      html: await fetchWithRetry(category.url),
    }));

    const productMap = new Map();
    for (const { category, html } of pages) {
      for (const item of productLinks(html, category)) {
        const existing = productMap.get(item.article_id);
        if (!existing || existing.name.length < item.name.length) productMap.set(item.article_id, item);
      }
    }
    const products = [...productMap.values()].sort((a, b) => Number(a.article_id) - Number(b.article_id));
    if (products.length < MIN_PRODUCTS) {
      throw new Error(`Only discovered ${products.length} products; expected at least ${MIN_PRODUCTS}. Refusing to publish a suspiciously incomplete crawl.`);
    }

    const hasTesseract = await tesseractAvailable();
    if (!hasTesseract) console.warn("Tesseract is unavailable; only calories explicitly present in official listing titles will be imported.");

    const enriched = await mapLimit(products, REQUEST_CONCURRENCY, async (item, index) => {
      const hasDirectSingleCalorie = item.listing_calories_kcal.length === 1;
      const explicitlyRequiresDetail = /營養標示請見內文/u.test(item.listing_title);
      if (hasDirectSingleCalorie && !explicitlyRequiresDetail) {
        if ((index + 1) % 20 === 0 || index + 1 === products.length) {
          console.log(`Processed ${index + 1}/${products.length} MWD products.`);
        }
        return item;
      }

      const detailHtml = await fetchWithRetry(item.source_url);
      const nutritionImageUrl = imageLinks(detailHtml, item.source_url)[0];
      const result = { ...item, nutrition_image_url: nutritionImageUrl };
      if (hasTesseract && nutritionImageUrl) {
        const ocr = await ocrImage(nutritionImageUrl, tempDir, item.article_id);
        const validation = validateNutrition(ocr.nutrition, item.listing_calories_kcal);
        result.ocr = { ...ocr, validation };
      }
      if ((index + 1) % 20 === 0 || index + 1 === products.length) {
        console.log(`Processed ${index + 1}/${products.length} MWD products.`);
      }
      return result;
    });

    const nutritionItems = enriched.filter((item) => Object.keys(itemNutrition(item)).length > 0);
    const completeItems = enriched.filter((item) => item.ocr?.validation?.valid);
    if (nutritionItems.length < MIN_NUTRITION) {
      throw new Error(`Only ${nutritionItems.length} products yielded usable official nutrition values; expected at least ${MIN_NUTRITION}.`);
    }
    if (hasTesseract && completeItems.length < MIN_COMPLETE) {
      throw new Error(`Only ${completeItems.length} nutrition labels passed OCR validation; expected at least ${MIN_COMPLETE}.`);
    }

    const snapshot = {
      schema_version: "1.0.0",
      source: {
        name: "麥味登官方網站",
        resource: BASE_URL,
        retrieved_at: RETRIEVED_AT,
        market: "TW",
        category_pages: CATEGORY_PAGES,
      },
      extraction: {
        importer: "twfoodmcp-mwd-importer/1.0.0",
        ocr_engine: hasTesseract ? "tesseract/chi_tra+eng" : null,
        safeguards: [
          "Only official mwd.com.tw product pages and official superqin.com.tw nutrition-label images are accepted.",
          "OCR values require four fields, bounded ranges, macro-energy consistency, and listing-energy consistency when available.",
          "Records remain draft until human review.",
        ],
      },
      stats: {
        discovered_products: enriched.length,
        products_with_usable_nutrition: nutritionItems.length,
        products_with_valid_complete_labels: completeItems.length,
        products_with_title_calories_only: nutritionItems.length - completeItems.length,
      },
      items: enriched,
    };

    await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
    await writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

    await rm(OUTPUT_DIR, { recursive: true, force: true });
    for (const item of nutritionItems) {
      const categoryDir = path.join(OUTPUT_DIR, item.category_slug);
      await mkdir(categoryDir, { recursive: true });
      await writeFile(path.join(categoryDir, `mwd-${item.article_id}.md`), renderOkf(item, SNAPSHOT_PATH.replaceAll(path.sep, "/")), "utf8");
    }

    console.log(`Discovered ${enriched.length} MWD products.`);
    console.log(`Generated ${nutritionItems.length} draft OKF documents in ${OUTPUT_DIR}.`);
    console.log(`Validated complete nutrition labels: ${completeItems.length}.`);
    console.log(`Snapshot: ${SNAPSHOT_PATH}.`);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
