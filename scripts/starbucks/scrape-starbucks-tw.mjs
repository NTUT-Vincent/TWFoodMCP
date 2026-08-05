#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, readdir, rm, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";

const BASE_URL = "https://www.starbucks.com.tw";
const CALORIES_PATH = "/products/calories/calories.jspx";
const DRINKS_PATH = "/products/drinks.jspx";
const STARBUCKS_ROOT = "knowledge/menu-items/starbucks";
const FOOD_ROOT = path.join(STARBUCKS_ROOT, "foods");
const DRINK_ROOT = path.join(STARBUCKS_ROOT, "drinks");
const RAW_ROOT = path.join(STARBUCKS_ROOT, "raw");
const IMPORTER = "twfoodmcp-starbucks-importer/1.0.0";
const VALIDATOR = "process:twfoodmcp-schema-validator";
const FIXTURE_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "food-nutrition-2026-07-22.json");
const EXPECTED_FOOD_COUNT = 113;

const STANDARD_SIZES = new Map([
  ["小杯", { slug: "short", amount: 236, unit: "ml", description: "小杯 Short 8 oz（236 ml）" }],
  ["中杯", { slug: "tall", amount: 354, unit: "ml", description: "中杯 Tall 12 oz（354 ml）" }],
  ["大杯", { slug: "grande", amount: 473, unit: "ml", description: "大杯 Grande 16 oz（473 ml）" }],
  ["特大杯", { slug: "venti", amount: 591, unit: "ml", description: "特大杯 Venti 20 oz（591 ml）" }],
]);

function decodeHtml(value) {
  const named = new Map([
    ["amp", "&"], ["quot", "\""], ["apos", "'"], ["#39", "'"], ["nbsp", " "],
    ["reg", "®"], ["trade", "™"], ["egrave", "è"], ["Egrave", "È"], ["acute", "´"],
  ]);
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-zA-Z][a-zA-Z0-9]+);/gu, (match, entity) => {
    if (entity.startsWith("#x")) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    return named.get(entity) ?? match;
  });
}

function textContent(html) {
  return decodeHtml(html.replace(/<br\s*\/?\s*>/giu, " ").replace(/<[^>]+>/gu, " "))
    .replace(/\s+/gu, " ")
    .trim();
}

function parseNumber(value) {
  const match = textContent(value).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/u);
  if (!match) return undefined;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

async function fetchResponse(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "TWFoodMCP-Starbucks-Importer/1.0" } });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw new Error(`Unable to fetch ${url}: ${lastError instanceof Error ? lastError.message : lastError}`);
}

async function fetchText(url) {
  return (await fetchResponse(url)).text();
}

function sameSitePath(href) {
  const normalized = decodeHtml(href);
  const url = new URL(normalized, BASE_URL);
  if (url.origin !== BASE_URL) return undefined;
  return `${url.pathname}${url.search}`;
}

function linksFrom(html) {
  return [...html.matchAll(/href=["']([^"']+)["']/giu)].map((match) => sameSitePath(match[1])).filter(Boolean);
}

async function discoverDrinkPages() {
  const categoryPages = new Set([DRINKS_PATH]);
  const visited = new Set();
  const productPages = new Map();

  while (true) {
    const batch = [...categoryPages].filter((url) => !visited.has(url)).slice(0, 8);
    if (batch.length === 0) break;
    await Promise.all(batch.map(async (url) => {
      visited.add(url);
      const html = await fetchText(`${BASE_URL}${url}`);
      for (const href of linksFrom(html)) {
        if (href.startsWith("/products/drinks/view.jspx?")) categoryPages.add(href);
        if (href.startsWith("/products/drinks/product.jspx?")) {
          const productUrl = new URL(href, BASE_URL);
          const productId = productUrl.searchParams.get("id");
          if (productId) productPages.set(productId, href);
        }
      }
    }));
    if (visited.size > 200) throw new Error("Starbucks category discovery exceeded the safety limit");
  }

  return {
    categoryPages: [...visited].sort(),
    productPages: [...productPages.entries()].sort(([a], [b]) => Number(a) - Number(b)),
  };
}

function parseRows(tableHtml) {
  const values = {};
  for (const row of tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/giu)) {
    const header = row[1].match(/<th[^>]*>([\s\S]*?)<\/th>/iu);
    const cell = row[1].match(/<td[^>]*>([\s\S]*?)<\/td>/iu);
    if (!header || !cell) continue;
    const label = textContent(header[1]);
    const number = parseNumber(cell[1]);
    if (number === undefined) continue;
    if (label.includes("咖啡因")) values.caffeine_mg = number;
    else if (label.includes("熱量")) values.energy_kcal = number;
    else if (label.includes("糖")) values.sugar_g = number;
    else if (label.includes("價格")) values.price_twd = number;
  }
  return values;
}

export function parseProductPage(html, sourcePath) {
  const titleMatch = html.match(/<h1[^>]*class=["']title_cn["'][^>]*>([\s\S]*?)<\/h1>/iu);
  const englishMatch = html.match(/<h3[^>]*class=["']title_en["'][^>]*>([\s\S]*?)<\/h3>/iu);
  if (!titleMatch) throw new Error(`${sourcePath}: missing product title`);
  const title = textContent(titleMatch[1]);
  const titleEn = englishMatch ? textContent(englishMatch[1]) : undefined;
  const variants = [];

  for (const [index, tab] of [...html.matchAll(/<li>\s*<a href=["']#(tabs-\d+)["']>([\s\S]*?)<\/a>\s*<\/li>/giu)].entries()) {
    const tabId = tab[1];
    const label = textContent(tab[2]);
    const tablePattern = new RegExp(`<div\\s+id=["']${tabId}["'][^>]*>([\\s\\S]*?)<\\/div>`, "iu");
    const tableMatch = html.match(tablePattern);
    if (!tableMatch) throw new Error(`${sourcePath}: missing table for ${tabId}`);
    const values = parseRows(tableMatch[1]);
    const nutrition = Object.fromEntries(Object.entries(values).filter(([key]) => key !== "price_twd"));
    if (Object.keys(nutrition).length === 0) continue;
    variants.push({ index, label, nutrition, ...(values.price_twd !== undefined ? { price_twd: values.price_twd } : {}) });
  }

  return { title, ...(titleEn ? { titleEn } : {}), variants };
}

function servingFor(label, index) {
  const standard = STANDARD_SIZES.get(label);
  if (standard) return standard;
  const volume = label.match(/(\d+(?:\.\d+)?)\s*m[lL]/u);
  if (volume) {
    return { slug: `${volume[1]}ml`, amount: Number(volume[1]), unit: "ml", description: `官方杯型 ${label}` };
  }
  const asciiSlug = label.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "");
  return {
    slug: asciiSlug || `variant-${index + 1}`,
    amount: 1,
    unit: "serving",
    description: `官方規格：${label}`,
  };
}

function sha12(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function yamlDocument(frontmatter, body) {
  return `---\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n${body.trim()}\n`;
}

function staleDate(date, months) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCMonth(value.getUTCMonth() + months);
  return value.toISOString().slice(0, 10);
}

function foodRows(fixture) {
  const rows = [];
  for (const image of fixture.images) {
    for (const values of image.items) {
      if (values.length !== fixture.columns.length) throw new Error(`${image.file}: expected ${fixture.columns.length} columns`);
      const row = Object.fromEntries(fixture.columns.map((column, index) => [column, values[index]]));
      rows.push({ ...row, sourceImage: image.file, sourceHash: image.sha256 });
    }
  }
  if (rows.length !== EXPECTED_FOOD_COUNT) throw new Error(`Expected ${EXPECTED_FOOD_COUNT} food rows, found ${rows.length}`);
  if (new Set(rows.map(({ name }) => name)).size !== rows.length) throw new Error("Food source contains duplicate product names");
  for (const row of rows) {
    for (const column of fixture.columns.slice(2)) {
      if (typeof row[column] !== "number" || !Number.isFinite(row[column]) || row[column] < 0) {
        throw new Error(`${row.name}: ${column} must be a non-negative number`);
      }
    }
  }
  return rows;
}

async function verifyFoodImages(fixture) {
  for (const image of fixture.images) {
    const url = `${BASE_URL}/products/objects/images/calories/260722/${image.file}`;
    const buffer = Buffer.from(await (await fetchResponse(url)).arrayBuffer());
    const actual = createHash("sha256").update(buffer).digest("hex");
    if (actual !== image.sha256) {
      throw new Error(`${url}: image changed (expected ${image.sha256}, received ${actual}); re-transcription is required`);
    }
  }
}

function foodConcept(row, fixture, generatedAt) {
  const idHash = sha12(row.name);
  const sourceUrl = `${BASE_URL}/products/objects/images/calories/260722/${row.sourceImage}`;
  const sourceId = `starbucks-food-${fixture.sourceVersion}`;
  const frontmatter = {
    type: "Food Menu Item",
    title: `星巴克 ${row.name}`,
    description: `星巴克台灣官方 ${fixture.sourceVersion} 食品營養表所列「${row.name}」每份營養資料。`,
    resource: sourceUrl,
    tags: ["星巴克", "Starbucks", "官方營養", "食品", row.category],
    generated: { by: IMPORTER, at: generatedAt },
    verified: [{ by: VALIDATOR, at: generatedAt }],
    status: "draft",
    stale_after: staleDate(fixture.sourceVersion, 6),
    sources: [
      {
        id: sourceId,
        resource: sourceUrl,
        title: `星巴克台灣官方食品營養標示表 ${row.sourceImage}`,
        author: `starbucks-taiwan/${fixture.sourceVersion}`,
        last_modified: fixture.sourceVersion,
        source_class: "primary_official",
        retrieved_at: generatedAt,
        sha256: row.sourceHash,
      },
      {
        id: "starbucks-calories-page",
        resource: `${BASE_URL}${CALORIES_PATH}`,
        title: "星巴克台灣營養標示表",
        author: `starbucks-taiwan/${fixture.sourceVersion}`,
        source_class: "primary_official",
        retrieved_at: generatedAt,
      },
    ],
    access: { classification: "public" },
    food: {
      id: `food:tw:menu:starbucks:${idHash}`,
      kind: "menu_item",
      market: "TW",
      brand: "星巴克",
      name: row.name,
      variant: row.category,
      aliases: [row.name, `星巴克${row.name}`, `星巴克 ${row.name}`, `Starbucks ${row.name}`],
    },
    revision: {
      revision_id: `official-table-${fixture.sourceVersion}-${idHash}`,
      source_version: fixture.sourceVersion,
      source_image: row.sourceImage,
    },
    serving: { description: `官方表格所列一份（${row.weight_g} 公克）`, amount: row.weight_g, unit: "g" },
    nutrition: [{
      basis: "per_serving",
      values: {
        energy_kcal: row.energy_kcal,
        protein_g: row.protein_g,
        fat_g: row.fat_g,
        saturated_fat_g: row.saturated_fat_g,
        trans_fat_g: row.trans_fat_g,
        carbohydrate_g: row.carbohydrate_g,
        sugar_g: row.sugar_g,
        sodium_mg: row.sodium_mg,
      },
    }],
    quality: { data_quality: "official_brand", completeness: "nutrition_complete", confidence: "medium", calculation_allowed: false },
    extraction: { method: "structured_transcription_official_table", source_image_sha256: row.sourceHash },
    limitations: [
      "本文件由官方營養表自動轉換為 draft，尚未經真人逐列審核，只進入 preview dataset。",
      "官方數值為參考均值，可能因原物料、配方、產品版本與門市供應而變動。",
      "官方表格未提供成分與過敏原；未列出不代表不含，本次不自行推測。",
    ],
  };
  const body = `# Summary\n\n官方營養表提供一份 ${row.weight_g} 公克的熱量與八項營養數值；本文件保留官方每份基準，不補齊未提供欄位。[^${sourceId}]\n\n[^${sourceId}]: 星巴克台灣官方食品營養標示表`;
  return { fileName: `${row.name.replace(/[\\/:*?"<>|]/gu, "-")}-${idHash}.md`, title: row.name, category: row.category, markdown: yamlDocument(frontmatter, body) };
}

function drinkConcept(productId, sourcePath, parsed, variant, generatedAt) {
  const pageUrl = `${BASE_URL}${sourcePath}`;
  const pageUrlObject = new URL(pageUrl);
  const categoryId = pageUrlObject.searchParams.get("catId") ?? "unknown";
  const date = generatedAt.slice(0, 10);
  const serving = servingFor(variant.label, variant.index);
  const sourceId = `starbucks-drink-${productId}-${date}`;
  const aliases = [parsed.title, `星巴克${parsed.title}`, `星巴克 ${parsed.title}`, `Starbucks ${parsed.title}`];
  if (parsed.titleEn) aliases.push(parsed.titleEn);
  const frontmatter = {
    type: "Food Menu Item",
    title: `星巴克 ${parsed.title}（${variant.label}）`,
    description: `星巴克台灣官方商品頁所列「${parsed.title}」${variant.label}的熱量、糖與咖啡因資料。`,
    resource: pageUrl,
    tags: ["星巴克", "Starbucks", "官方營養", "飲品", variant.label],
    generated: { by: IMPORTER, at: generatedAt },
    verified: [{ by: VALIDATOR, at: generatedAt }],
    status: "draft",
    stale_after: staleDate(date, 6),
    sources: [{
      id: sourceId,
      resource: pageUrl,
      title: `星巴克台灣官方商品頁：${parsed.title}`,
      author: `starbucks-taiwan/${date}`,
      source_class: "primary_official",
      retrieved_at: generatedAt,
    }],
    access: { classification: "public" },
    food: {
      id: `food:tw:menu:starbucks:drink-${productId}-${serving.slug}`,
      kind: "menu_item",
      market: "TW",
      brand: "星巴克",
      name: parsed.title,
      variant: variant.label,
      aliases: [...new Set(aliases)],
    },
    revision: { revision_id: `official-web-${productId}-${date}`, source_product_id: productId, source_category_id: categoryId },
    serving: { description: serving.description, amount: serving.amount, unit: serving.unit },
    nutrition: [{ basis: "per_serving", values: variant.nutrition }],
    ...(variant.price_twd !== undefined ? { menu: { price_twd: variant.price_twd, size_label: variant.label } } : { menu: { size_label: variant.label } }),
    quality: { data_quality: "official_brand", completeness: "partial", confidence: "medium", calculation_allowed: false },
    extraction: { method: "official_product_page_html", source_product_id: productId, source_tab_label: variant.label },
    limitations: [
      "本文件由官方商品頁自動擷取為 draft，尚未經真人逐項審核，只進入 preview dataset。",
      "官方商品頁僅提供熱量、糖與部分品項的咖啡因；其他營養欄位保持未知。",
      "飲品客製化會改變營養數值；本資料僅代表官方頁面所示標準配方。",
    ],
  };
  const labels = Object.keys(variant.nutrition).map((key) => `\`${key}\``).join("、");
  const body = `# Summary\n\n官方商品頁提供${variant.label}的 ${labels}；本文件保留官方每份基準，不推測其他營養欄位。[^${sourceId}]\n\n[^${sourceId}]: 星巴克台灣官方商品頁：${parsed.title}`;
  return { fileName: `${productId}-${serving.slug}.md`, productId, title: parsed.title, variant: variant.label, markdown: yamlDocument(frontmatter, body) };
}

async function clearGeneratedMarkdown(directory) {
  await mkdir(directory, { recursive: true });
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md") await rm(path.join(directory, entry.name));
  }
}

function indexLine(fileName, title, description) {
  return `* [${title}](${encodeURI(fileName)}) - ${description}`;
}

async function writeOutputs({ foodDocs, drinkDocs, categoryPages, productPages, skippedProducts, generatedAt, fixture }) {
  await clearGeneratedMarkdown(FOOD_ROOT);
  await clearGeneratedMarkdown(DRINK_ROOT);
  await mkdir(RAW_ROOT, { recursive: true });
  for (const doc of foodDocs) await writeFile(path.join(FOOD_ROOT, doc.fileName), doc.markdown, "utf8");
  for (const doc of drinkDocs) await writeFile(path.join(DRINK_ROOT, doc.fileName), doc.markdown, "utf8");

  const foodsByCategory = Map.groupBy(foodDocs, (doc) => doc.category);
  const foodIndex = ["# 星巴克台灣食品營養資料", "", `官方 ${fixture.sourceVersion} 營養表共 ${foodDocs.length} 個品項；全部為待真人逐列審核的 draft。`, ""];
  for (const [category, docs] of foodsByCategory) {
    foodIndex.push(`## ${category}`, "", ...docs.sort((a, b) => a.title.localeCompare(b.title, "zh-Hant")).map((doc) => indexLine(doc.fileName, doc.title, "官方每份完整營養表轉錄")), "");
  }
  await writeFile(path.join(FOOD_ROOT, "index.md"), `${foodIndex.join("\n").trim()}\n`, "utf8");

  const drinksByProduct = Map.groupBy(drinkDocs, (doc) => `${doc.productId}:${doc.title}`);
  const drinkIndex = ["# 星巴克台灣飲品營養資料", "", `從 ${productPages.length} 個官方商品頁產生 ${drinkDocs.length} 個杯型／規格 draft；未提供營養欄位的商品頁不建立 concept。`, ""];
  for (const [key, docs] of drinksByProduct) {
    const title = key.slice(key.indexOf(":") + 1);
    drinkIndex.push(`## ${title}`, "", ...docs.map((doc) => indexLine(doc.fileName, doc.variant, "官方熱量、糖與咖啡因（若頁面提供）")), "");
  }
  await writeFile(path.join(DRINK_ROOT, "index.md"), `${drinkIndex.join("\n").trim()}\n`, "utf8");

  await writeFile(path.join(STARBUCKS_ROOT, "index.md"), [
    "# Starbucks Taiwan Nutrition",
    "",
    `星巴克台灣官方營養資料，共 ${foodDocs.length} 個食品品項與 ${drinkDocs.length} 個飲品杯型／規格；自動匯入資料均為 draft。`,
    "",
    "* [食品營養資料](foods/) - 官方圖片營養表逐列轉錄。",
    "* [飲品營養資料](drinks/) - 官方商品頁逐杯型擷取。",
    "* [官方來源](sources/) - OKF 與星巴克台灣來源。",
    "* [擷取與驗證報告](validation/report.md) - 本次匯入數量、限制與驗證結果。",
    "",
  ].join("\n"), "utf8");

  await writeFile(path.join(STARBUCKS_ROOT, "sources/index.md"), [
    "# 官方來源",
    "",
    "* [OKF README](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/README.md)",
    "* [OKF SPEC v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)",
    `* [星巴克台灣營養標示表](${BASE_URL}${CALORIES_PATH})`,
    `* [星巴克台灣飲品](${BASE_URL}${DRINKS_PATH})`,
    "",
  ].join("\n"), "utf8");

  const reportSources = [
    { id: "starbucks-calories-page", resource: `${BASE_URL}${CALORIES_PATH}`, title: "星巴克台灣營養標示表", author: `starbucks-taiwan/${fixture.sourceVersion}`, source_class: "primary_official" },
    { id: "starbucks-drinks-page", resource: `${BASE_URL}${DRINKS_PATH}`, title: "星巴克台灣飲品", author: `starbucks-taiwan/${generatedAt.slice(0, 10)}`, source_class: "primary_official" },
  ];
  const report = yamlDocument({
    type: "Validation Report",
    title: "星巴克台灣營養資料擷取與驗證報告",
    description: "本次星巴克台灣官方食品與飲品營養資料 OKF 轉換結果。",
    generated: { by: IMPORTER, at: generatedAt },
    status: "draft",
    sources: reportSources,
  }, `# 驗證結果\n\n- 官方食品營養表圖片：4 張，SHA-256 全數符合鎖定版本。\n- 食品品項：${foodDocs.length} 筆，9 個官方營養欄位逐列轉錄。\n- 飲品分類／入口頁：${categoryPages.length} 頁。\n- 發現官方飲品商品頁：${productPages.length} 頁。\n- 產生飲品杯型／規格 concept：${drinkDocs.length} 筆。\n- 未提供熱量、糖或咖啡因而略過的商品頁：${skippedProducts.length} 頁。\n\n# 品質與限制\n\n- 所有自動匯入 concept 均為 \`draft\`，只可進 preview，不可參與營養計算。\n- 食品表為圖片來源，雖以 SHA-256 鎖定官方版本，仍需真人逐列核對後才可升為 stable。\n- 飲品商品頁只提供熱量、糖與部分品項的咖啡因；未提供欄位維持 unknown。\n- 客製化飲品、配方調整與門市實際製作可能改變數值。\n- 未列出成分或過敏原不代表不含，本次不自行推測。\n\n[^starbucks-calories-page]: 星巴克台灣營養標示表\n[^starbucks-drinks-page]: 星巴克台灣飲品`);
  await mkdir(path.join(STARBUCKS_ROOT, "validation"), { recursive: true });
  await writeFile(path.join(STARBUCKS_ROOT, "validation/report.md"), report, "utf8");

  const manifest = {
    generated_at: generatedAt,
    importer: IMPORTER,
    official_food_source_version: fixture.sourceVersion,
    food_images: fixture.images.map(({ file, sha256, items }) => ({ file, sha256, item_count: items.length })),
    category_pages: categoryPages.map((value) => `${BASE_URL}${value}`),
    drink_product_pages_discovered: productPages.length,
    drink_concepts_generated: drinkDocs.length,
    food_concepts_generated: foodDocs.length,
    skipped_drink_products_without_nutrition: skippedProducts,
  };
  await writeFile(path.join(RAW_ROOT, "import-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const logPath = path.join(STARBUCKS_ROOT, "log.md");
  let previous = "# 更新紀錄\n";
  try { previous = await readFile(logPath, "utf8"); } catch (error) { if (error?.code !== "ENOENT") throw error; }
  const withoutFrontmatter = previous.replace(/^---\s*\n[\s\S]*?\n---\s*\n*/u, "").replace(/^# 更新紀錄\s*/u, "");
  await writeFile(logPath, `# 更新紀錄\n\n## ${generatedAt.slice(0, 10)}\n\n* **Import**: 從官方來源建立 ${foodDocs.length} 個食品與 ${drinkDocs.length} 個飲品杯型／規格 draft。\n* **Validation**: 核對 4 張食品表 SHA-256、完整抓取 ${productPages.length} 個飲品商品頁，並保留 ${skippedProducts.length} 個無營養欄位頁面的略過紀錄。\n* **Conformance**: 移除子目錄 index/log frontmatter，符合 OKF v0.2 reserved filename 規則。\n\n${withoutFrontmatter.trim()}\n`, "utf8");
}

async function mapConcurrent(entries, concurrency, mapper) {
  const results = new Array(entries.length);
  let next = 0;
  async function worker() {
    while (true) {
      const index = next;
      next += 1;
      if (index >= entries.length) return;
      results[index] = await mapper(entries[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, () => worker()));
  return results;
}

export async function main() {
  const generatedAt = process.env.STARBUCKS_RETRIEVED_AT ?? new Date().toISOString();
  if (Number.isNaN(new Date(generatedAt).getTime())) throw new Error("STARBUCKS_RETRIEVED_AT must be an ISO 8601 timestamp");
  const fixture = JSON.parse(await readFile(FIXTURE_PATH, "utf8"));
  const rows = foodRows(fixture);
  await verifyFoodImages(fixture);
  console.log(`Verified ${fixture.images.length} official food images and ${rows.length} transcribed food rows.`);

  const { categoryPages, productPages } = await discoverDrinkPages();
  console.log(`Discovered ${categoryPages.length} drink category pages and ${productPages.length} product pages.`);
  let completed = 0;
  const parsedProducts = await mapConcurrent(productPages, 12, async ([productId, sourcePath]) => {
    const parsed = parseProductPage(await fetchText(`${BASE_URL}${sourcePath}`), sourcePath);
    completed += 1;
    if (completed % 25 === 0 || completed === productPages.length) console.log(`Fetched ${completed}/${productPages.length} drink product pages.`);
    return { productId, sourcePath, parsed };
  });

  const foodDocs = rows.map((row) => foodConcept(row, fixture, generatedAt));
  const drinkDocs = [];
  const skippedProducts = [];
  for (const { productId, sourcePath, parsed } of parsedProducts) {
    if (parsed.variants.length === 0) {
      skippedProducts.push(`${BASE_URL}${sourcePath}`);
      continue;
    }
    for (const variant of parsed.variants) drinkDocs.push(drinkConcept(productId, sourcePath, parsed, variant, generatedAt));
  }

  const ids = [...foodDocs, ...drinkDocs].map(({ markdown }) => markdown.match(/\n  id: ([^\n]+)/u)?.[1]).filter(Boolean);
  if (new Set(ids).size !== ids.length) throw new Error("Generated duplicate Starbucks food IDs");
  await writeOutputs({ foodDocs, drinkDocs, categoryPages, productPages, skippedProducts, generatedAt, fixture });
  console.log(`Generated ${foodDocs.length} food concepts and ${drinkDocs.length} drink variant concepts; skipped ${skippedProducts.length} products without nutrition fields.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : error);
    process.exitCode = 1;
  });
}
