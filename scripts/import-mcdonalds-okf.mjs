#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { stringify } from "yaml";

const sourcePath = process.env.MCDONALDS_SNAPSHOT ?? "references/source-snapshots/mcdonalds-tw-nutrition-2026-08-01.json";
const outputDir = process.env.MCDONALDS_OKF_OUTPUT ?? "knowledge/menu-items/mcdonalds";
const snapshotResource = sourcePath.replaceAll(path.sep, "/");

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

function allergenNames(value) {
  if (typeof value !== "string") return [];
  return [...new Set(value.split(/[、,，]/u).map((part) => part.trim()).filter(Boolean))];
}

function formatAmount(value) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/0+$/u, "").replace(/\.$/u, "");
}

function frontmatterFor(item, snapshot) {
  const slug = slugify(item.short_name);
  if (!slug) throw new Error(`Missing usable short_name for product ${item.product_id}`);
  const sourceId = "mcdonalds-tw-nutrition-2026-08-01";
  const category = typeof item.category === "string" ? item.category.trim() : "";
  const contains = allergenNames(item.allergens);
  const mayContain = allergenNames(item.additional_allergens);
  const declarations = [
    ...contains.map((allergen) => ({ allergen, status: "contains", source_id: sourceId })),
    ...mayContain
      .filter((allergen) => !contains.includes(allergen))
      .map((allergen) => ({ allergen, status: "may_contain", source_id: sourceId })),
  ];
  const aliases = [...new Set([
    item.name,
    `麥當勞${item.name}`,
    `麥當勞 ${item.name}`,
    `McDonald's ${item.name}`,
    item.short_name,
  ].filter((value) => typeof value === "string" && value.trim()))];
  const tags = [...new Set(["麥當勞", "McDonald's", "官方營養", category].filter(Boolean))];
  const servingAmount = Number(item.serving_size?.value);
  if (!Number.isFinite(servingAmount) || servingAmount <= 0 || item.serving_size?.unit !== "g") {
    throw new Error(`Invalid serving size for ${item.name}`);
  }
  const values = Object.fromEntries(
    Object.entries(item.nutrition ?? {}).filter(([, value]) => typeof value === "number" && Number.isFinite(value) && value >= 0),
  );
  if (Object.keys(values).length === 0) throw new Error(`Missing nutrition values for ${item.name}`);

  return {
    type: "Food Product",
    title: `麥當勞 ${item.name}`,
    description: `麥當勞台灣官方品項「${item.name}」的每份營養資料，來源為官方 itemDetails API。`,
    resource: item.source_url,
    status: "draft",
    stale_after: "2027-02-01",
    access: { classification: "public" },
    tags,
    generated: {
      by: "twfoodmcp-mcdonalds-importer/1.0.0",
      at: snapshot.source.retrieved_at,
    },
    sources: [
      {
        id: sourceId,
        resource: item.source_url,
        api_resource: item.source_api_url,
        title: "麥當勞台灣官方營養資料",
        author: "mcdonalds-tw/2026-08-01",
        source_class: "primary_official",
        retrieved_at: snapshot.source.retrieved_at,
        snapshot: snapshotResource,
      },
    ],
    food: {
      id: `food:tw:menu:mcdonalds:${slug}`,
      kind: "menu_item",
      market: "TW",
      brand: "麥當勞",
      name: item.name,
      aliases,
    },
    revision: {
      revision_id: `official-api-${item.product_id}-2026-08-01`,
      source_product_id: String(item.product_id),
    },
    serving: {
      description: `官方每份 ${formatAmount(servingAmount)} 公克`,
      amount: servingAmount,
      unit: "g",
    },
    nutrition: [{ basis: "per_serving", values }],
    allergens: { declarations },
    quality: {
      data_quality: "official_brand",
      completeness: "nutrition_complete",
      confidence: "high",
      calculation_allowed: true,
    },
    limitations: [
      "此文件由官方 API 自動轉換為 draft，尚未經真人逐項審核，不進正式 stable dataset。",
      "官方營養數值為每份平均資料，實際產品可能因配方、食材與門市操作而變動。",
      "未列出過敏原不代表不含；本次僅保留官方 API 已提供的 allergen 與 additional_allergen 欄位。",
    ],
  };
}

const snapshot = JSON.parse(await readFile(sourcePath, "utf8"));
if (!Array.isArray(snapshot.items) || snapshot.items.length === 0) throw new Error("Snapshot contains no items");
await mkdir(outputDir, { recursive: true });

const ids = new Set();
for (const item of snapshot.items) {
  const frontmatter = frontmatterFor(item, snapshot);
  if (ids.has(frontmatter.food.id)) throw new Error(`Duplicate generated food ID: ${frontmatter.food.id}`);
  ids.add(frontmatter.food.id);
  const slug = frontmatter.food.id.split(":").at(-1);
  const source = frontmatter.sources[0];
  const markdown = `---\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n# Summary\n\n官方 API 提供每份重量與九項營養數值；本文件保留原始每份基準，未自行換算或補齊缺值。[^${source.id}]\n\n[^${source.id}]: ${source.title}\n`;
  await writeFile(path.join(outputDir, `${slug}.md`), markdown, "utf8");
}

console.log(`Generated ${ids.size} McDonald's draft OKF documents in ${outputDir}.`);
