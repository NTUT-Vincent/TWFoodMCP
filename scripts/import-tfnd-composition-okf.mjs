#!/usr/bin/env node
/**
 * Import the Taiwan FDA "Food Composition Database" (台灣地區食品營養成分資料庫 /
 * TFND) into the OKF bundle as generic-food concepts.
 *
 * Source: `imports/20_2.csv` — one row per (整合編號, 分析項) with the per-100 g
 * value in `每100克含量`. The pass pivots the long-format nutrient rows into one
 * OKF concept per 整合編號.
 *
 * Policy alignment (docs/TRUST_AND_CLASSIFICATION_POLICY.md):
 * - Government deterministic import => `source_class: primary_government`,
 *   `data_quality: government_database`, `source_authority` Level A.
 * - Imports start as `status: draft` and are machine-confirmed only.
 * - Missing nutrient cells stay absent; explicit 0 values are preserved as 0.
 * - A per-100 g basis needs no ml/g conversion, so it is captured verbatim.
 * - `calculation_allowed` is false because the record is a draft.
 * - `stale_after` uses the 24-month government-generic-food default.
 *
 * The pass is additive and idempotent: it only creates concepts whose
 * `food.id` is not already present in the bundle.
 */
import crypto from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { stringify } from "yaml";

const KNOWLEDGE_ROOT = path.resolve("knowledge");
const OUTPUT_ROOT = path.join(KNOWLEDGE_ROOT, "generic-foods");
const CSV_PATH = process.env.TFND_CSV ?? path.resolve("imports/20_2.csv");
const REPORT_PATH = process.env.TFND_REPORT ?? "reports/tfnd-composition-import-2026-10-26.json";
const IMPORTER_ACTOR = "twfoodmcp-tfnd-importer/1.0.0";
const VERIFIER_ACTOR = "process:tfnd-composition-importer";
const CAPTURED_AT = process.env.TFND_CAPTURED_AT ?? "2026-10-26T00:00:00.000Z";
const RETRIEVED_AT = process.env.TFND_RETRIEVED_AT ?? "2026-10-26T00:00:00+08:00";
const STALE_AFTER = process.env.TFND_STALE_AFTER ?? "2028-10-26";
const SOURCE_URL = "https://data.gov.tw/dataset/8543";
const SOURCE_TITLE = "食品營養成分資料集（衛生福利部食品藥物管理署）";

const RESERVED = new Set(["index.md", "log.md"]);
const MAX_FILENAME_BYTES = 255;
const WINDOWS_RESERVED = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/iu;

// 食品分類 -> directory slug.
const CATEGORY_SLUGS = {
  穀物類: "grains",
  澱粉類: "starches",
  "堅果及種子類": "nuts-seeds",
  水果類: "fruits",
  蔬菜類: "vegetables",
  藻類: "algae",
  菇類: "mushrooms",
  豆類: "legumes",
  肉類: "meats",
  魚貝類: "fish-shellfish",
  蛋類: "eggs",
  乳品類: "dairy",
  油脂類: "fats-oils",
  糖類: "sugars",
  "調味料及香辛料類": "seasonings-spices",
  糕餅點心類: "bakery-snacks",
  "加工調理食品及其他類": "processed-prepared-foods",
  飲料類: "beverages",
};

// Canonical nutrient map: analysis item -> [field, expected unit, divisor].
const CANONICAL_NUTRIENTS = {
  熱量: ["energy_kcal", "kcal", 1],
  粗蛋白: ["protein_g", "g", 1],
  粗脂肪: ["fat_g", "g", 1],
  飽和脂肪: ["saturated_fat_g", "g", 1],
  反式脂肪: ["trans_fat_g", "mg", 1000],
  總碳水化合物: ["carbohydrate_g", "g", 1],
  糖質總量: ["sugar_g", "g", 1],
  膳食纖維: ["dietary_fiber_g", "g", 1],
  鈉: ["sodium_mg", "mg", 1],
};

// ---------------------------------------------------------------------------
// CSV streaming parser
// ---------------------------------------------------------------------------

function* csvRows(text) {
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; }
        else inQuotes = false;
      } else field += char;
    } else if (char === '"') inQuotes = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field); yield row; row = []; field = ""; }
    else if (char !== "\r") field += char;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); yield row; }
}

function parseNumber(value) {
  const text = String(value ?? "").normalize("NFKC").replace(/,/gu, "").trim();
  if (text.length === 0) return undefined;
  const number = Number(text);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

async function readFoods(csvPath) {
  const stream = createReadStream(csvPath, { encoding: "utf8", highWaterMark: 4 * 1024 * 1024 });
  const foods = new Map();
  let buffer = "";
  let headers = null;
  for await (const chunk of stream) {
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line) continue;
      for (const row of csvRows(`${line}\n`)) {
        if (!headers) { headers = row.map((h) => h.replace(/^\uFEFF/u, "")); continue; }
        if (row.length < 12) continue;
        const record = Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""]));
        const code = String(record["整合編號"] ?? "").trim();
        if (!code) continue;
        if (!foods.has(code)) {
          foods.set(code, {
            code,
            category: String(record["食品分類"] ?? "").trim(),
            recordKind: String(record["資料類別"] ?? "").trim(),
            name: String(record["樣品名稱"] ?? "").trim(),
            commonNames: String(record["俗名"] ?? "").trim(),
            englishName: String(record["樣品英文名稱"] ?? "").trim(),
            description: String(record["內容物描述"] ?? "").trim(),
            wasteRate: parseNumber(record["廢棄率"]),
            attributes: [],
          });
        }
        foods.get(code).attributes.push({
          category: String(record["分析項分類"] ?? "").trim(),
          item: String(record["分析項"] ?? "").trim(),
          unit: String(record["含量單位"] ?? "").trim(),
          raw: String(record["每100克含量"] ?? "").trim(),
        });
      }
    }
  }
  return [...foods.values()];
}

// ---------------------------------------------------------------------------
// Filename planning (same conventions as the other importers)
// ---------------------------------------------------------------------------

function truncateUtf8(text, maxBytes) {
  let out = "";
  let size = 0;
  for (const char of text) {
    const len = Buffer.byteLength(char, "utf8");
    if (size + len > maxBytes) break;
    out += char;
    size += len;
  }
  return out.replace(/[._\s-]+$/u, "");
}

function normalizeName(value) {
  let name = String(value ?? "").normalize("NFKC");
  name = name.replace(/[\u0000-\u001f<>:"/\\|?*#]/gu, "_");
  name = name.replace(/[[\]]/gu, "_");
  // Unbalanced parentheses in a filename break Markdown link destinations
  // (the `](...)` scanner stops at the first unmatched `)`), so fold them out.
  const open = (name.match(/\(/gu) ?? []).length;
  const close = (name.match(/\)/gu) ?? []).length;
  if (open !== close) name = name.replace(/[()]/gu, "_");
  name = name.replace(/\s+/gu, "_");
  name = name.replace(/_+/gu, "_").replace(/^[._]+|[._]+$/gu, "");
  if (WINDOWS_RESERVED.test(name)) name = `food-${name}`;
  return name;
}

function buildName(base, qualifiers) {
  const suffix = qualifiers.filter(Boolean).map((q) => `_${q}`).join("");
  const budget = MAX_FILENAME_BYTES - Buffer.byteLength(`${suffix}.md`, "utf8") - 10;
  const trimmedBase = truncateUtf8(base, Math.max(budget, 20));
  return `${trimmedBase}${suffix}.md`;
}

function conceptFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...conceptFiles(resolved));
    else if (entry.isFile() && entry.name.endsWith(".md") && !RESERVED.has(entry.name)) out.push(resolved);
  }
  return out;
}

function planNames(entries, claimed) {
  const groups = new Map();
  for (const entry of entries) {
    const key = entry.base.toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  const assigned = new Map();
  for (const key of [...groups.keys()].sort()) {
    const group = groups.get(key).sort((a, b) => a.code.localeCompare(b.code));
    const choose = (entry, qualifiers) => {
      for (const candidate of [
        buildName(entry.base, qualifiers),
        buildName(entry.base, [...qualifiers, entry.code]),
        buildName(entry.base, [...qualifiers, entry.code, entry.hash]),
      ]) {
        if (!claimed.has(candidate.toLowerCase())) return candidate;
      }
      throw new Error(`unresolvable filename collision for ${entry.code}`);
    };
    if (group.length === 1) {
      const name = choose(group[0], []);
      claimed.add(name.toLowerCase());
      assigned.set(group[0].code, name);
    } else {
      for (const entry of group) {
        const name = choose(entry, [entry.code]);
        claimed.add(name.toLowerCase());
        assigned.set(entry.code, name);
      }
    }
  }
  return assigned;
}

// ---------------------------------------------------------------------------
// Concept rendering
// ---------------------------------------------------------------------------

function foodSlug(code) {
  const slug = String(code).normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "");
  return slug || crypto.createHash("sha1").update(String(code)).digest("hex").slice(0, 12);
}

function commonNameList(value) {
  return [...new Set(String(value ?? "").split(/[,，;；、]/u).map((v) => v.trim()).filter(Boolean))];
}

function canonicalValues(attributes) {
  const values = {};
  for (const attribute of attributes) {
    const mapping = CANONICAL_NUTRIENTS[attribute.item];
    if (!mapping) continue;
    const [field, expectedUnit, divisor] = mapping;
    if (attribute.unit !== expectedUnit) continue;
    const parsed = parseNumber(attribute.raw);
    if (parsed === undefined) continue;
    const value = parsed / divisor;
    values[field] = Number.isInteger(value) ? value : Number(value.toFixed(6));
  }
  return values;
}

function completenessFor(values) {
  const count = Object.keys(values).length;
  if (count >= 8) return "nutrition_complete";
  if (count >= 2) return "partial";
  return "minimal";
}

function aliasesFor(food) {
  return [...new Set([
    food.name,
    ...commonNameList(food.commonNames),
    food.englishName,
  ].map((v) => String(v ?? "").trim()).filter(Boolean))];
}

function frontmatterFor(food, values) {
  const slug = foodSlug(food.code);
  const sourceId = `tfnd-${slug}`;
  const pms = food.attributes.find((attribute) => attribute.item === "P/M/S" && attribute.raw);
  const isAverage = food.recordKind === "樣品平均值";
  const tags = [...new Set([food.category, "政府資料", "食品營養成分資料庫", "TFND", "待人工審核", ...(isAverage ? ["樣品平均值"] : [])])];
  return {
    type: "Food Product",
    title: food.name,
    description: "台灣食品營養成分資料庫（政府資料）匯入的每 100 公克營養成分 draft。",
    resource: SOURCE_URL,
    tags,
    generated: { by: IMPORTER_ACTOR, at: CAPTURED_AT },
    verified: [{ by: VERIFIER_ACTOR, at: CAPTURED_AT }],
    status: "draft",
    stale_after: STALE_AFTER,
    sources: [
      {
        id: sourceId,
        resource: SOURCE_URL,
        title: SOURCE_TITLE,
        author: "fda-tw/food-composition-db",
        source_class: "primary_government",
        retrieved_at: RETRIEVED_AT,
        snapshot: "imports/20_2.csv",
      },
    ],
    access: { classification: "public" },
    food: {
      id: `food:tw:generic:${slug}`,
      kind: "generic_food",
      market: "TW",
      name: food.name,
      aliases: aliasesFor(food),
    },
    revision: { revision_id: `tfnd-${slug}` },
    nutrition: [{ basis: "per_100g", values }],
    quality: {
      data_quality: "government_database",
      completeness: completenessFor(values),
      confidence: "medium",
      calculation_allowed: false,
    },
    extraction: {
      source_system: "台灣地區食品營養成分資料庫 (TFND)",
      source_file: "imports/20_2.csv",
      food_code: food.code,
      food_category: food.category,
      record_kind: food.recordKind,
      sample_name: food.name,
      common_names: commonNameList(food.commonNames),
      english_name: food.englishName || null,
      content_description: food.description || null,
      waste_rate_percent: food.wasteRate ?? null,
      analysis_item_count: food.attributes.length,
      ...(pms ? { pms_ratio: pms.raw } : {}),
    },
    official_review_hint: { status: "not_compared_or_no_match" },
    limitations: [
      "此文件由衛生福利部食品藥物管理署食品營養成分資料庫的每 100 公克數值 deterministic 匯入，尚未經真人審核，仍為 draft。",
      "缺少的分析項保持 unknown，未以 0 取代；資料庫明示為 0 的項目則保留 0。",
      "資料庫數值為實驗室樣品分析結果，可能隨取樣年度、產地、品種與分析方法而變動。",
      "quality.calculation_allowed 固定為 false；在真人審核前不得用於營養計算。",
      ...(isAverage ? ["此筆為資料庫「樣品平均值」，代表同一樣品多次取樣的均值，使用前應確認是否適用。"] : []),
    ],
  };
}

function markdownCell(value) {
  return String(value ?? "").replace(/\|/gu, "\\|").replace(/\r?\n/gu, "<br>");
}

function renderConcept(frontmatter, food) {
  const source = frontmatter.sources[0];
  const sampleRows = [
    ["食品分類", food.category],
    ["資料類別", food.recordKind],
    ["整合編號", food.code],
    ["樣品名稱", food.name],
    ["俗名", food.commonNames],
    ["樣品英文名稱", food.englishName],
    ["內容物描述", food.description],
    ["廢棄率", food.wasteRate === undefined ? "" : `${food.wasteRate}%`],
  ].map(([label, value]) => `| ${label} | ${markdownCell(value)} |`).join("\n");
  const compositionRows = food.attributes
    .map((attribute) => `| ${markdownCell(attribute.category)} | ${markdownCell(attribute.item)} | ${markdownCell(attribute.unit)} | ${markdownCell(attribute.raw)} |`)
    .join("\n");
  const canonical = Object.keys(frontmatter.nutrition[0].values);
  return `---\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n# Summary\n\n此文件保存食品營養成分資料庫樣品 ${food.code}（${food.name}）的每 100 公克營養成分。[^${source.id}] 它是尚未經真人審核的 draft，不能直接用於營養計算。\n\n# Sample\n\n| 欄位 | 值 |\n| --- | --- |\n${sampleRows}\n\n# Composition (per 100 g)\n\n以下為來源資料庫針對此樣品呈現的完整分析項與每 100 公克含量（缺值以空白表示，未以 0 取代）。structured 的 canonical 營養欄位為：${canonical.length > 0 ? canonical.join(", ") : "（無）"}。\n\n| 分析項分類 | 分析項 | 含量單位 | 每100克含量 |\n| --- | --- | --- | --- |\n${compositionRows}\n\n# Review Required\n\n升為 stable 前，真人 reviewer 必須確認樣品身分、取樣年度、每 100 公克基準與分析項數值，並評估是否可納入營養計算。\n\n[^${source.id}]: ${source.title}\n`;
}

// ---------------------------------------------------------------------------
// Index generation
// ---------------------------------------------------------------------------

function oneLine(value) {
  return String(value ?? "").replace(/\s+/gu, " ").trim();
}

function frontmatterField(markdown, field) {
  const match = markdown.match(new RegExp(`^${field}:\\s*(.+)$`, "mu"));
  return match ? match[1].trim().replace(/^["']|["']$/gu, "") : undefined;
}

function generateIndex(dir, { descriptionLine } = {}) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const directConcepts = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !RESERVED.has(entry.name))
    .map((entry) => path.join(dir, entry.name));
  const subdirs = entries
    .filter((entry) => entry.isDirectory() && entry.name !== ".git")
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hant"));

  const lines = [`# ${path.basename(dir)}`, ""];
  if (descriptionLine) lines.push(descriptionLine, "");
  if (subdirs.length) {
    lines.push("# Subdirectories", "");
    for (const sub of subdirs) {
      const count = conceptFiles(path.join(dir, sub)).length;
      lines.push(`* [${sub}](${encodeURI(sub)}/) - ${count} 份概念文件。`);
    }
    lines.push("");
  }
  if (directConcepts.length) {
    lines.push("# Concepts", "");
    const meta = directConcepts.map((file) => {
      const markdown = readFileSync(file, "utf8");
      return {
        file,
        title: oneLine(frontmatterField(markdown, "title")) || path.basename(file, ".md"),
        description: oneLine(frontmatterField(markdown, "description")),
      };
    });
    meta.sort((a, b) => a.title.localeCompare(b.title, "zh-Hant"));
    for (const { file, title, description } of meta) {
      lines.push(`* [${title}](${encodeURI(path.basename(file))})${description ? ` - ${description}` : ""}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const parsed = await readFoods(CSV_PATH);
  const limit = process.env.TFND_LIMIT ? Number(process.env.TFND_LIMIT) : 0;
  const foods = limit > 0 ? parsed.slice(0, limit) : parsed;
  console.log(`Parsed ${parsed.length} foods from ${path.relative(process.cwd(), CSV_PATH)}${limit > 0 ? ` (limited to ${foods.length})` : ""}.`);

  // Existing food.ids in the bundle (additive, idempotent).
  const existing = new Set();
  for (const file of conceptFiles(KNOWLEDGE_ROOT)) {
    const match = readFileSync(file, "utf8").match(/^\s+id:\s*food:tw:generic:(\S+)\s*$/mu);
    if (match) existing.add(match[1]);
  }
  const missing = foods.filter((food) => !existing.has(foodSlug(food.code)));
  console.log(`Existing generic concepts: ${existing.size}; new foods to add: ${missing.length}.`);

  const byDir = new Map();
  for (const food of missing) {
    const slug = CATEGORY_SLUGS[food.category] ?? "other";
    const dir = path.join(OUTPUT_ROOT, slug);
    if (!byDir.has(dir)) byDir.set(dir, []);
    byDir.get(dir).push({
      food,
      code: food.code,
      base: normalizeName(food.name) || food.code,
      hash: crypto.createHash("sha256").update(`food:tw:generic:${foodSlug(food.code)}`).digest("hex").slice(0, 12),
    });
  }

  const created = [];
  for (const [dir, entries] of byDir) {
    const claimed = new Set(
      conceptFiles(dir).filter((file) => path.dirname(file) === dir).map((file) => path.basename(file).toLowerCase()),
    );
    const names = planNames(entries, claimed);
    mkdirSync(dir, { recursive: true });
    for (const entry of entries.sort((a, b) => a.code.localeCompare(b.code))) {
      const values = canonicalValues(entry.food.attributes);
      if (Object.keys(values).length === 0) throw new Error(`${entry.code}: at least one canonical nutrient is required`);
      const frontmatter = frontmatterFor(entry.food, values);
      const fileName = names.get(entry.code);
      writeFileSync(path.join(dir, fileName), renderConcept(frontmatter, entry.food), "utf8");
      created.push({
        food_id: frontmatter.food.id,
        food_code: entry.food.code,
        file: path.relative(KNOWLEDGE_ROOT, path.join(dir, fileName)).replaceAll(path.sep, "/"),
        canonical_nutrients: Object.keys(values).length,
      });
    }
  }

  // Regenerate indexes for touched category directories and the root.
  const categories = catDirNames();
  for (const category of categories) {
    const dir = path.join(OUTPUT_ROOT, category);
    if (existsSync(dir)) writeFileSync(path.join(dir, "index.md"), generateIndex(dir), "utf8");
  }
  mkdirSync(OUTPUT_ROOT, { recursive: true });
  writeFileSync(
    path.join(OUTPUT_ROOT, "index.md"),
    generateIndex(OUTPUT_ROOT, { descriptionLine: "台灣食品營養成分資料庫（衛生福利部食品藥物管理署）deterministic 匯入的 generic food draft，依食品分類分組，全部維持未經真人審核的 draft。" }),
    "utf8",
  );

  const report = {
    generated_at: CAPTURED_AT,
    source: SOURCE_URL,
    source_file: path.relative(process.cwd(), CSV_PATH).replaceAll(path.sep, "/"),
    foods_in_source: foods.length,
    existing_before: existing.size,
    concepts_created: created.length,
    categories: Object.fromEntries(categories.map((c) => [c, created.filter((e) => e.file.startsWith(`generic-foods/${c}/`)).length])),
    created,
  };
  mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Added ${created.length} TFND generic-food concepts.`);
}

function catDirNames() {
  return [...new Set(Object.values(CATEGORY_SLUGS))].sort();
}

await main();
