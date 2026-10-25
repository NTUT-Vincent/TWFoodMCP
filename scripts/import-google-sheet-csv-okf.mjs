#!/usr/bin/env node
/**
 * Incremental import of the TWFood Google Sheet "Nutrition Data" CSV export into
 * the OKF bundle.
 *
 * Unlike `import-google-sheet-okf.mjs` (which snapshots the whole spreadsheet and
 * rewrites its output directory), this pass converges the bundle with a plain CSV
 * export: for every populated CSV row it ensures exactly one OKF draft exists,
 * keyed by `food.id = food:tw:menu:google-sheet:<record_id>`.
 *
 * Rule: replace only when the concept does not exist. Rows already represented in
 * the bundle are never rewritten; only genuinely new records are added. The pass
 * is idempotent: running it again is a no-op.
 */
import crypto from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { stringify } from "yaml";
import { loadOkfDocuments } from "./lib/dataset.mjs";
import { matchAgainstOfficialDocuments } from "./lib/dailydietitian.mjs";

const KNOWLEDGE_ROOT = path.resolve("knowledge");
const GS_ROOT = path.join(KNOWLEDGE_ROOT, "menu-items", "google-sheet-deprecated");
const CSV_PATH = process.env.GOOGLE_SHEET_CSV
  ?? path.resolve("TWFood 台灣超商營養資料庫（持續更新） - Nutrition Data.csv");
const REPORT_PATH = process.env.GOOGLE_SHEET_CSV_REPORT
  ?? "reports/google-sheet-csv-import-2026-10-25.json";
const IMPORTER_ACTOR = "twfoodmcp-google-sheet-importer/1.0.0";
const CAPTURED_AT = process.env.GOOGLE_SHEET_CAPTURED_AT ?? "2026-10-25T00:00:00.000Z";
const REVISION_TAG = process.env.GOOGLE_SHEET_REVISION_TAG ?? "google-sheet-2026-10-25";
const SHEET_URL = "https://docs.google.com/spreadsheets/d/16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY/edit";
const SPREADSHEET_ID = "16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY";

const RESERVED = new Set(["index.md", "log.md"]);
const MAX_FILENAME_BYTES = 255;
const WINDOWS_RESERVED = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/iu;

const NUTRIENT_COLUMNS = {
  calories_kcal: "energy_kcal",
  protein_g: "protein_g",
  fat_g: "fat_g",
  saturated_fat_g: "saturated_fat_g",
  trans_fat_g: "trans_fat_g",
  carbohydrate_g: "carbohydrate_g",
  sugar_g: "sugar_g",
  sodium_mg: "sodium_mg",
};

const OFFICIAL_QUALITY = new Set(["official_label", "official_brand", "government_database"]);

// Keep the archive organized by brand. Exact matches first, then prefix rules for
// the composite `brand／sub-brand` strings the sheet uses.
const GS_BRAND_SLUGS = {
  "7-ELEVEN": "7-eleven",
  "7-ELEVEN CITY TEA／CITY PEARL": "7-eleven",
  "7-ELEVEN CITY CAFE": "7-eleven",
  "全家 FamilyMart": "familymart",
  全家: "familymart",
  "50嵐": "50lagu",
  麻古茶坊: "macuteafang",
  "星巴克 Starbucks": "starbucks",
  得正: "dezheng",
  八方雲集: "bafangyunji",
  "摩斯漢堡 MOS Burger": "mos-burger",
  "必勝客 Pizza Hut": "pizza-hut",
  OKmart: "okmart",
  丸龜製麵: "marugame-seimen",
  "萊爾富 Hi-Life": "laifu",
  "台灣麥當勞 McDonald's": "mcdonalds",
  "21世紀風味館": "21st-century-flavor-factory",
  早安美芝城: "morning-michishiki",
  麥味登: "mwd",
  拉亞漢堡: "laiya-burger",
  壽司郎: "sushiro",
  台灣熱門泡麵: "instant-noodles",
  呷尚寶: "kenshui",
  弘爺漢堡: "honger-burger",
  爭鮮: "zazengbao",
  藏壽司: "kura-sushi",
  非品牌食譜: "generic-recipes",
  一般壽司估算: "generic-sushi",
  "路易莎咖啡 LOUISA COFFEE": "louisa",
  SUBWAY: "subway",
  "漢堡王 Burger King": "burgerking",
  "肯德基 KFC": "kfc",
};

const BRAND_PREFIX_RULES = [
  [/^7-ELEVEN/u, "7-eleven"],
  [/^全家/u, "familymart"],
  [/^萊爾富/u, "laifu"],
  [/^OKmart/u, "okmart"],
];

function brandSlug(brand) {
  const trimmed = String(brand ?? "").trim();
  if (GS_BRAND_SLUGS[trimmed]) return GS_BRAND_SLUGS[trimmed];
  for (const [pattern, slug] of BRAND_PREFIX_RULES) {
    if (pattern.test(trimmed)) return slug;
  }
  return "other";
}

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

function parseCsv(text) {
  const rows = [];
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
    else if (char === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (char !== "\r") field += char;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const NUMERIC_COLUMNS = [
  "calories_kcal",
  "protein_g",
  "fat_g",
  "saturated_fat_g",
  "trans_fat_g",
  "carbohydrate_g",
  "sugar_g",
  "sodium_mg",
  "price_twd",
];

function coerceNumber(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).normalize("NFKC").replace(/,/gu, "").trim();
  if (text.length === 0) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function rowObject(headers, row) {
  const record = Object.fromEntries(headers.map((header, index) => [header, row[index] ?? null]));
  for (const key of Object.keys(record)) {
    if (typeof record[key] === "string" && record[key].trim().length === 0) record[key] = null;
  }
  for (const column of NUMERIC_COLUMNS) {
    if (column in record) record[column] = coerceNumber(record[column]);
  }
  return record;
}

function excelDate(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(Date.UTC(1899, 11, 30) + value * 86_400_000).toISOString().slice(0, 10);
  }
  if (!nonEmpty(value)) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
}

function addMonths(dateString, months) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + months, day)).toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Classification helpers (same policy as the snapshot importer)
// ---------------------------------------------------------------------------

function nutritionBasis(servingBasis) {
  const text = String(servingBasis ?? "").normalize("NFKC");
  if (/100\s*(?:g|克)/iu.test(text)) return "per_100g";
  if (/100\s*(?:ml|毫升)/iu.test(text)) return "per_100ml";
  return "per_serving";
}

function nutritionValues(record) {
  const values = {};
  for (const [column, field] of Object.entries(NUTRIENT_COLUMNS)) {
    const value = record[column];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) values[field] = value;
  }
  return values;
}

function sourceClass(record) {
  const type = String(record.source_type ?? "").toLowerCase();
  const method = String(record.value_method ?? "").toLowerCase();
  if (method.includes("estimated")) return "estimated_or_untraceable";
  if (type.includes("government")) return "primary_government";
  if (type.includes("official")) return "primary_official";
  if (type.includes("dietitian") || type.includes("medical") || type.includes("nutrition_article")) {
    return "expert_interpretation";
  }
  if (type.includes("social") || type.includes("forum")) return "community_submission";
  if (type.includes("blog") || type.includes("news") || type.includes("aggregator")) {
    return "third_party_dataset";
  }
  if (record.evidence_grade === "A") return "primary_official";
  if (record.evidence_grade === "B") return "verifiable_secondary";
  if (record.evidence_grade === "C") return "third_party_dataset";
  return "community_submission";
}

function dataQuality(sourceClassValue) {
  if (sourceClassValue === "primary_government") return "government_database";
  if (sourceClassValue === "primary_label") return "official_label";
  if (sourceClassValue === "primary_official") return "official_brand";
  if (sourceClassValue === "estimated_or_untraceable") return "estimated";
  if (sourceClassValue === "community_submission") return "community_report";
  return "third_party_database";
}

function completeness(values) {
  const count = Object.keys(values).length;
  if (count >= 8) return "nutrition_complete";
  if (count >= 2) return "partial";
  return "minimal";
}

function confidence(record, sourceClassValue) {
  if (sourceClassValue === "estimated_or_untraceable" || record.evidence_grade === "D") return "low";
  if (["primary_label", "primary_government", "primary_official", "verifiable_secondary"].includes(sourceClassValue)) {
    return "medium";
  }
  return "low";
}

function sourceId(url, prefix = "sheet-source") {
  return `${prefix}-${crypto.createHash("sha1").update(url).digest("hex").slice(0, 12)}`;
}

function sourcesFor(record, sourceClassValue) {
  const sources = [];
  const sourceUrl = nonEmpty(record.source_url) ? record.source_url.trim() : undefined;
  const primaryUrl = nonEmpty(record.primary_source_url) ? record.primary_source_url.trim() : undefined;
  if (sourceUrl) {
    const modified = excelDate(record.article_updated_at);
    sources.push({
      id: sourceId(sourceUrl),
      resource: sourceUrl,
      title: nonEmpty(record.source_title) ? record.source_title.trim() : "試算表記錄來源",
      source_class: sourceClassValue,
      ...(modified ? { last_modified: `${modified}T00:00:00+08:00` } : {}),
      retrieved_at: `${excelDate(record.accessed_at) ?? CAPTURED_AT.slice(0, 10)}T00:00:00+08:00`,
    });
  }
  if (primaryUrl && primaryUrl !== sourceUrl) {
    sources.push({
      id: sourceId(primaryUrl, "sheet-primary"),
      resource: primaryUrl,
      title: "試算表列出的原始／官方來源",
      source_class: primaryUrl.includes("gov.tw") ? "primary_government" : "primary_official",
      retrieved_at: `${excelDate(record.accessed_at) ?? CAPTURED_AT.slice(0, 10)}T00:00:00+08:00`,
    });
  }
  if (sources.length === 0) {
    sources.push({
      id: "twfood-google-sheet",
      resource: SHEET_URL,
      title: "TWFood 台灣超商營養資料庫 Nutrition Data",
      source_class: "community_submission",
      retrieved_at: `${CAPTURED_AT.slice(0, 10)}T00:00:00+08:00`,
    });
  }
  return sources;
}

function officialLink(match) {
  if (!nonEmpty(match?.file_path)) return undefined;
  const normalized = match.file_path.replaceAll(path.sep, "/");
  return normalized.startsWith("knowledge/") ? `/${normalized.slice("knowledge/".length)}` : undefined;
}

function servingFor(record, basis) {
  if (basis !== "per_serving" || !nonEmpty(record.serving_basis)) return undefined;
  return { description: record.serving_basis.trim(), amount: 1, unit: "serving" };
}

function aliasesFor(record) {
  return [...new Set([
    record.food_name,
    `${record.brand_or_context ?? ""}${record.food_name ?? ""}`,
    `${record.brand_or_context ?? ""} ${record.food_name ?? ""}`,
  ].map((value) => String(value ?? "").trim()).filter(Boolean))];
}

function frontmatterFor(record, match) {
  const recordId = String(record.record_id).toLowerCase();
  const values = nutritionValues(record);
  const basis = nutritionBasis(record.serving_basis);
  const sourceClassValue = sourceClass(record);
  const accessed = excelDate(record.accessed_at) ?? CAPTURED_AT.slice(0, 10);
  const matchLink = officialLink(match);
  const brand = String(record.brand_or_context ?? "未分類").trim() || "未分類";
  const name = String(record.food_name).trim();
  return {
    type: "Food Product",
    title: `${brand} ${name}`.trim(),
    description: "從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。",
    resource: nonEmpty(record.source_url) ? record.source_url.trim() : SHEET_URL,
    tags: [...new Set([brand, record.category, "TWFood 共筆", "待人工審核"].filter(nonEmpty))],
    generated: { by: IMPORTER_ACTOR, at: CAPTURED_AT },
    status: "draft",
    stale_after: addMonths(accessed, 6),
    sources: sourcesFor(record, sourceClassValue),
    access: { classification: "public" },
    food: {
      id: `food:tw:menu:google-sheet:${recordId}`,
      kind: "menu_item",
      market: "TW",
      brand,
      name,
      aliases: aliasesFor(record),
    },
    revision: { revision_id: `${REVISION_TAG}-${recordId}` },
    ...(servingFor(record, basis) ? { serving: servingFor(record, basis) } : {}),
    nutrition: [{ basis, values }],
    quality: {
      data_quality: dataQuality(sourceClassValue),
      completeness: completeness(values),
      confidence: confidence(record, sourceClassValue),
      calculation_allowed: false,
    },
    extraction: {
      source_system: "TWFood Google Sheet",
      spreadsheet_id: SPREADSHEET_ID,
      sheet_name: "Nutrition Data",
      record_id: record.record_id,
      evidence_grade: record.evidence_grade,
      verification_status_as_reported: record.verification_status,
      value_method: record.value_method,
      source_type: record.source_type,
      source_publisher: record.source_publisher,
      source_author: record.source_author,
      source_row: record,
    },
    source_observation: {
      ...(typeof record.price_twd === "number" ? { price_twd: record.price_twd } : {}),
      ...(nonEmpty(record.usage_note) ? { usage_note: record.usage_note } : {}),
    },
    official_review_hint: {
      status: match.status === "no_match" ? "not_compared_or_no_match" : match.status,
      ...(match.food_id ? { existing_food_id: match.food_id } : {}),
      ...(match.title ? { existing_title: match.title } : {}),
      ...(matchLink ? { existing_concept: matchLink } : {}),
      ...(match.comparison ? { comparison: match.comparison } : {}),
    },
    limitations: [
      "此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。",
      "試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。",
      "此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。",
      "份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。",
      ...(match.status === "conflict_existing" ? ["此觀測與既有官方 OKF 的一項或多項營養數值不一致，必須人工判讀版本與來源日期。"] : []),
    ],
  };
}

function markdownCell(value) {
  return String(value ?? "").replace(/\|/gu, "\\|").replace(/\r?\n/gu, "<br>");
}

function renderConcept(frontmatter) {
  const source = frontmatter.sources[0];
  const record = frontmatter.extraction.source_row;
  const hint = frontmatter.official_review_hint;
  const linked = hint.existing_concept
    ? `\n# Related Existing Concept\n\n${hint.status === "corroborated_existing" ? "數值可交叉支持" : "數值需要衝突審查"}：[${hint.existing_title}](${hint.existing_concept})。\n`
    : "";
  const nutrientRows = Object.entries(frontmatter.nutrition[0].values)
    .map(([field, value]) => `| ${field} | ${value} |`)
    .join("\n");
  return `---\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n# Summary\n\n此文件保存試算表記錄 ${record.record_id} 的營養觀測。[^${source.id}] 它是未驗證 draft，不能直接用於營養計算。\n\n# Observation\n\n| 欄位 | 值 |\n| --- | --- |\n| 食品 | ${markdownCell(record.food_name)} |\n| 品牌／情境 | ${markdownCell(record.brand_or_context)} |\n| 分類 | ${markdownCell(record.category)} |\n| 份量基準 | ${markdownCell(record.serving_basis)} |\n${nutrientRows}\n${linked}\n# Review Required\n\n升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。\n\n[^${source.id}]: ${source.title}\n`;
}

// ---------------------------------------------------------------------------
// Filename planning (same conventions as normalize-okf-filenames.mjs)
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
  name = name.replace(/\s+/gu, "_");
  name = name.replace(/_+/gu, "_").replace(/^[._]+|[._]+$/gu, "");
  if (WINDOWS_RESERVED.test(name)) name = `food-${name}`;
  return name;
}

function sanitizeQualifier(value) {
  const cleaned = String(value ?? "").normalize("NFKC").replace(/[^\p{L}\p{N}-]+/gu, "").trim();
  return truncateUtf8(cleaned, 24);
}

function buildName(base, qualifiers) {
  const suffix = qualifiers.filter(Boolean).map((q) => `_${q}`).join("");
  const budget = MAX_FILENAME_BYTES - Buffer.byteLength(`${suffix}.md`, "utf8") - 10;
  const trimmedBase = truncateUtf8(base, Math.max(budget, 20));
  return `${trimmedBase}${suffix}.md`;
}

function stableId12(foodId) {
  return crypto.createHash("sha256").update(foodId).digest("hex").slice(0, 12);
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

/** Assign a unique filename to every new entry in one directory. */
function planNames(entries, claimed) {
  const groups = new Map();
  for (const entry of entries) {
    const key = entry.base.toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  const assigned = new Map();
  for (const key of [...groups.keys()].sort()) {
    const group = groups.get(key).sort((a, b) => a.recordId.localeCompare(b.recordId));
    const choose = (entry, qualifiers) => {
      for (const candidate of [
        buildName(entry.base, qualifiers),
        buildName(entry.base, [...qualifiers, entry.recordId]),
        buildName(entry.base, [...qualifiers, entry.recordId, entry.stableHash]),
      ]) {
        if (!claimed.has(candidate.toLowerCase())) return candidate;
      }
      throw new Error(`unresolvable filename collision for ${entry.recordId}`);
    };
    if (group.length === 1) {
      const name = choose(group[0], []);
      claimed.add(name.toLowerCase());
      assigned.set(group[0].recordId, name);
    } else {
      for (const entry of group) {
        const name = choose(entry, [sanitizeQualifier(entry.recordId)]);
        claimed.add(name.toLowerCase());
        assigned.set(entry.recordId, name);
      }
    }
  }
  return assigned;
}

// ---------------------------------------------------------------------------
// Index generation (same format as normalize-okf-filenames.mjs)
// ---------------------------------------------------------------------------

function toPosix(value) {
  return value.replaceAll(path.sep, "/");
}

function oneLine(value) {
  return String(value ?? "").replace(/\s+/gu, " ").trim();
}

function splitFrontmatterField(markdown, field) {
  const match = markdown.match(new RegExp(`^${field}:\\s*(.+)$`, "mu"));
  return match ? match[1].trim().replace(/^["']|["']$/gu, "") : undefined;
}

function generateIndex(dir, { archive = false } = {}) {
  const dirEntries = readdirSync(dir, { withFileTypes: true });
  const directConcepts = dirEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !RESERVED.has(entry.name))
    .map((entry) => path.join(dir, entry.name));
  const subdirs = dirEntries
    .filter((entry) => entry.isDirectory() && entry.name !== ".git")
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hant"));

  const lines = [`# ${path.basename(dir)}`, ""];
  if (archive) {
    lines.push("TWFood Google Sheet 匯入的營養觀測 draft 封存，依品牌分組，全部維持未驗證 draft。", "");
  }
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
        title: oneLine(splitFrontmatterField(markdown, "title")) || path.basename(file, ".md"),
        description: oneLine(splitFrontmatterField(markdown, "description")),
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
  const raw = readFileSync(CSV_PATH, "utf8").replace(/^\uFEFF/u, "");
  const rows = parseCsv(raw);
  const [headers, ...dataRows] = rows;
  if (!Array.isArray(headers) || headers.length === 0) throw new Error("CSV header is missing");
  const records = dataRows
    .map((row) => rowObject(headers, row))
    .filter((record) => /^nut-\d+$/iu.test(String(record.record_id ?? "").trim()) && nonEmpty(record.food_name));

  const existingDocuments = await loadOkfDocuments();
  const existingIds = new Set();
  for (const { data } of existingDocuments) {
    const match = String(data.food.id).match(/^food:tw:menu:google-sheet:(nut-\d+)$/u);
    if (match) existingIds.add(match[1]);
  }

  const officialDocuments = existingDocuments.filter(({ data }) =>
    OFFICIAL_QUALITY.has(data.quality?.data_quality) && !String(data.food.id).includes("google-sheet"));
  console.log(`Existing Google Sheet concepts: ${existingIds.size}; official match targets: ${officialDocuments.length}.`);

  const missing = records.filter((record) => !existingIds.has(String(record.record_id).toLowerCase()));
  console.log(`CSV rows: ${records.length}; new rows to add: ${missing.length}.`);

  // Build per-directory plans from the *current* on-disk filenames.
  const byDir = new Map();
  for (const record of missing) {
    const slug = brandSlug(record.brand_or_context);
    const dir = path.join(GS_ROOT, slug);
    if (!byDir.has(dir)) byDir.set(dir, []);
    const foodId = `food:tw:menu:google-sheet:${String(record.record_id).toLowerCase()}`;
    byDir.get(dir).push({
      record,
      recordId: String(record.record_id).toUpperCase(),
      base: normalizeName(`${record.brand_or_context ?? ""} ${record.food_name ?? ""}`.trim()) || String(record.record_id),
      stableHash: stableId12(foodId),
      foodId,
    });
  }

  const matches = [];
  const written = [];
  for (const [dir, entries] of byDir) {
    const claimed = new Set(
      conceptFiles(dir)
        .filter((file) => path.dirname(file) === dir)
        .map((file) => path.basename(file).toLowerCase()),
    );
    const names = planNames(entries, claimed);
    mkdirSync(dir, { recursive: true });
    for (const entry of entries.sort((a, b) => a.recordId.localeCompare(b.recordId))) {
      const record = entry.record;
      const values = nutritionValues(record);
      if (Object.keys(values).length === 0) {
        throw new Error(`${record.record_id}: at least one nutrition value is required`);
      }
      const match = matchAgainstOfficialDocuments({
        brand: record.brand_or_context,
        item_name: record.food_name,
        basis: nutritionBasis(record.serving_basis),
        nutrition: values,
      }, officialDocuments);
      const frontmatter = frontmatterFor(record, match);
      const fileName = names.get(entry.recordId);
      writeFileSync(path.join(dir, fileName), renderConcept(frontmatter), "utf8");
      written.push({ record_id: record.record_id, file: toPosix(path.relative(KNOWLEDGE_ROOT, path.join(dir, fileName))) });
      if (match.status !== "no_match") {
        matches.push({ record_id: record.record_id, title: frontmatter.title, ...match, existing_concept: officialLink(match) });
      }
    }
  }

  // Refresh indexes for touched brand directories and the archive root.
  for (const dir of byDir.keys()) {
    writeFileSync(path.join(dir, "index.md"), generateIndex(dir), "utf8");
  }
  if (existsSync(GS_ROOT)) {
    writeFileSync(path.join(GS_ROOT, "index.md"), generateIndex(GS_ROOT, { archive: true }), "utf8");
  }

  const counts = Object.fromEntries(["corroborated_existing", "conflict_existing", "identity_only"].map((status) => [
    status,
    matches.filter((match) => match.status === status).length,
  ]));
  const report = {
    generated_at: CAPTURED_AT,
    csv_path: toPosix(path.relative(process.cwd(), CSV_PATH)),
    spreadsheet_id: SPREADSHEET_ID,
    csv_rows: records.length,
    existing_before: existingIds.size,
    okf_drafts_created: written.length,
    ...counts,
    no_match: written.length - matches.length,
    brand_directories_touched: [...byDir.keys()].map((dir) => toPosix(path.relative(KNOWLEDGE_ROOT, dir))).sort(),
    created: written,
    matches,
  };
  mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Added ${written.length} Google Sheet concepts (${counts.corroborated_existing} corroborated, ${counts.conflict_existing} conflicts).`);
}

await main();
