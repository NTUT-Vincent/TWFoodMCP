#!/usr/bin/env node
import crypto from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { stringify } from "yaml";
import { loadOkfDocuments } from "./lib/dataset.mjs";
import { matchAgainstOfficialDocuments } from "./lib/dailydietitian.mjs";

const SNAPSHOT_PATH = process.env.GOOGLE_SHEET_SNAPSHOT
  ?? "references/source-snapshots/google-sheet-2026-08-22.json";
const OUTPUT_ROOT = process.env.GOOGLE_SHEET_OKF_ROOT
  ?? "knowledge/menu-items/google-sheet";
const REPORT_PATH = process.env.GOOGLE_SHEET_IMPORT_REPORT
  ?? "reports/google-sheet-import-2026-08-22.json";
const IMPORTER_ACTOR = "twfoodmcp-google-sheet-importer/1.0.0";

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

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function rowObject(headers, row) {
  return Object.fromEntries(headers.map((header, index) => [header, row[index] ?? null]));
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

function sourcesFor(record, sourceClassValue, sourceRowsByUrl, capturedAt) {
  const sources = [];
  const sourceUrl = nonEmpty(record.source_url) ? record.source_url.trim() : undefined;
  const primaryUrl = nonEmpty(record.primary_source_url) ? record.primary_source_url.trim() : undefined;
  const sourceRecord = sourceUrl ? sourceRowsByUrl.get(sourceUrl) : undefined;
  if (sourceUrl) {
    const modified = excelDate(record.article_updated_at ?? sourceRecord?.article_updated_at);
    sources.push({
      id: sourceId(sourceUrl),
      resource: sourceUrl,
      title: record.source_title || sourceRecord?.article_title || "試算表記錄來源",
      source_class: sourceClassValue,
      ...(modified ? { last_modified: `${modified}T00:00:00+08:00` } : {}),
      retrieved_at: `${excelDate(record.accessed_at ?? sourceRecord?.accessed_at) ?? capturedAt.slice(0, 10)}T00:00:00+08:00`,
    });
  }
  if (primaryUrl && primaryUrl !== sourceUrl) {
    sources.push({
      id: sourceId(primaryUrl, "sheet-primary"),
      resource: primaryUrl,
      title: "試算表列出的原始／官方來源",
      source_class: primaryUrl.includes("gov.tw") ? "primary_government" : "primary_official",
      retrieved_at: `${excelDate(record.accessed_at) ?? capturedAt.slice(0, 10)}T00:00:00+08:00`,
    });
  }
  if (sources.length === 0) {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY/edit#gid=228297422";
    sources.push({
      id: "twfood-google-sheet",
      resource: sheetUrl,
      title: "TWFood 台灣超商營養資料庫 Nutrition Data",
      source_class: "community_submission",
      retrieved_at: capturedAt,
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
  return {
    description: record.serving_basis.trim(),
    amount: 1,
    unit: "serving",
  };
}

function aliasesFor(record) {
  return [...new Set([
    record.food_name,
    `${record.brand_or_context ?? ""}${record.food_name ?? ""}`,
    `${record.brand_or_context ?? ""} ${record.food_name ?? ""}`,
  ].map((value) => String(value ?? "").trim()).filter(Boolean))];
}

function frontmatterFor(record, sourceRowsByUrl, match, snapshot) {
  const recordId = String(record.record_id).toLowerCase();
  const values = nutritionValues(record);
  const basis = nutritionBasis(record.serving_basis);
  const sourceClassValue = sourceClass(record);
  const accessed = excelDate(record.accessed_at) ?? snapshot.spreadsheet.modified_at.slice(0, 10);
  const matchLink = officialLink(match);
  const brand = String(record.brand_or_context ?? "未分類").trim() || "未分類";
  const name = String(record.food_name).trim();
  return {
    type: "Food Product",
    title: `${brand} ${name}`.trim(),
    description: "從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。",
    resource: record.source_url || snapshot.spreadsheet.url,
    tags: [...new Set([brand, record.category, "TWFood 共筆", "待人工審核"].filter(nonEmpty))],
    generated: { by: IMPORTER_ACTOR, at: snapshot.spreadsheet.captured_at },
    status: "draft",
    stale_after: addMonths(accessed, 6),
    sources: sourcesFor(record, sourceClassValue, sourceRowsByUrl, snapshot.spreadsheet.captured_at),
    access: { classification: "public" },
    food: {
      id: `food:tw:menu:google-sheet:${recordId}`,
      kind: "menu_item",
      market: "TW",
      brand,
      name,
      aliases: aliasesFor(record),
    },
    revision: { revision_id: `google-sheet-2026-08-22-${recordId}` },
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
      spreadsheet_id: snapshot.spreadsheet.id,
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
  const linked = frontmatter.official_review_hint.existing_concept
    ? `\n# Related Existing Concept\n\n${frontmatter.official_review_hint.status === "corroborated_existing" ? "數值可交叉支持" : "數值需要衝突審查"}：[${frontmatter.official_review_hint.existing_title}](${frontmatter.official_review_hint.existing_concept})。\n`
    : "";
  const nutrientRows = Object.entries(frontmatter.nutrition[0].values)
    .map(([field, value]) => `| ${field} | ${value} |`)
    .join("\n");
  return `---\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n# Summary\n\n此文件保存試算表記錄 ${record.record_id} 的營養觀測。[^${source.id}] 它是未驗證 draft，不能直接用於營養計算。\n\n# Observation\n\n| 欄位 | 值 |\n| --- | --- |\n| 食品 | ${markdownCell(record.food_name)} |\n| 品牌／情境 | ${markdownCell(record.brand_or_context)} |\n| 分類 | ${markdownCell(record.category)} |\n| 份量基準 | ${markdownCell(record.serving_basis)} |\n${nutrientRows}\n${linked}\n# Review Required\n\n升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。\n\n[^${source.id}]: ${source.title}\n`;
}

function bucketFor(recordId) {
  const number = Number.parseInt(String(recordId).replace(/\D/gu, ""), 10);
  const start = Math.floor(number / 100) * 100;
  return `${String(start).padStart(5, "0")}-${String(start + 99).padStart(5, "0")}`;
}

function indexEntry(fileName, frontmatter) {
  return `* [${frontmatter.title}](${fileName}) - ${frontmatter.description}`;
}

async function main() {
  const snapshot = JSON.parse(await readFile(SNAPSHOT_PATH, "utf8"));
  const [nutritionHeaders, ...nutritionRows] = snapshot.sheets["Nutrition Data"];
  const [sourceHeaders, ...sourceRows] = snapshot.sheets.Sources;
  if (!Array.isArray(nutritionHeaders) || nutritionRows.length === 0) throw new Error("Nutrition Data is empty");
  const records = nutritionRows.map((row) => rowObject(nutritionHeaders, row));
  const sourceRecords = sourceRows.map((row) => rowObject(sourceHeaders, row));
  const sourceRowsByUrl = new Map(sourceRecords.map((record) => [record.source_url, record]));
  const existingDocuments = await loadOkfDocuments();

  await rm(OUTPUT_ROOT, { recursive: true, force: true });
  await mkdir(OUTPUT_ROOT, { recursive: true });
  await mkdir(path.dirname(REPORT_PATH), { recursive: true });

  const buckets = new Map();
  const matches = [];
  const ids = new Set();
  for (const record of records) {
    if (!nonEmpty(record.record_id) || !nonEmpty(record.food_name)) throw new Error("Every row needs record_id and food_name");
    const values = nutritionValues(record);
    if (Object.keys(values).length === 0) throw new Error(`${record.record_id}: at least one nutrition value is required`);
    const match = matchAgainstOfficialDocuments({
      brand: record.brand_or_context,
      item_name: record.food_name,
      basis: nutritionBasis(record.serving_basis),
      nutrition: values,
    }, existingDocuments);
    const frontmatter = frontmatterFor(record, sourceRowsByUrl, match, snapshot);
    if (ids.has(frontmatter.food.id)) throw new Error(`Duplicate generated food.id ${frontmatter.food.id}`);
    ids.add(frontmatter.food.id);
    const bucket = bucketFor(record.record_id);
    const bucketDir = path.join(OUTPUT_ROOT, bucket);
    await mkdir(bucketDir, { recursive: true });
    const fileName = `${String(record.record_id).toLowerCase()}.md`;
    await writeFile(path.join(bucketDir, fileName), renderConcept(frontmatter), "utf8");
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push({ fileName, frontmatter });
    if (match.status !== "no_match") {
      matches.push({ record_id: record.record_id, title: frontmatter.title, ...match, existing_concept: officialLink(match) });
    }
  }

  for (const [bucket, concepts] of [...buckets].sort(([a], [b]) => a.localeCompare(b))) {
    concepts.sort((a, b) => a.frontmatter.food.id.localeCompare(b.frontmatter.food.id));
    await writeFile(path.join(OUTPUT_ROOT, bucket, "index.md"), [
      `# Google Sheet records ${bucket}`,
      "",
      ...concepts.map(({ fileName, frontmatter }) => indexEntry(fileName, frontmatter)),
      "",
    ].join("\n"), "utf8");
  }

  await writeFile(path.join(OUTPUT_ROOT, "index.md"), [
    "# TWFood Google Sheet Import",
    "",
    "從 TWFood 共筆試算表匯入的營養觀測 draft；依記錄編號分桶，所有資料均待人工審核。",
    "",
    ...[...buckets].sort(([a], [b]) => a.localeCompare(b)).map(([bucket, concepts]) => `* [${bucket}](${bucket}/) - ${concepts.length} 筆觀測。`),
    "",
  ].join("\n"), "utf8");

  const counts = Object.fromEntries(["corroborated_existing", "conflict_existing"].map((status) => [
    status,
    matches.filter((match) => match.status === status).length,
  ]));
  const report = {
    generated_at: snapshot.spreadsheet.captured_at,
    snapshot_path: SNAPSHOT_PATH,
    spreadsheet_id: snapshot.spreadsheet.id,
    spreadsheet_modified_at: snapshot.spreadsheet.modified_at,
    sheet_rows: Object.fromEntries(Object.entries(snapshot.sheets).map(([name, rows]) => [name, rows.length - 1])),
    okf_drafts_created: records.length,
    ...counts,
    no_match: records.length - matches.length,
    matches,
  };
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Imported ${records.length} Google Sheet rows (${counts.corroborated_existing} corroborated, ${counts.conflict_existing} conflicts).`);
}

await main();
