#!/usr/bin/env node
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildDataset } from "./lib/dataset.mjs";

const outputDir = process.env.DATASET_OUTPUT_DIR ?? "dist/d1";

function sqlText(value) {
  if (value === undefined || value === null) return "NULL";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("zh-TW")
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

function conceptId(filePath) {
  return path
    .relative("knowledge", filePath)
    .split(path.sep)
    .join("/")
    .replace(/\.md$/u, "");
}

try {
  const dataset = await buildDataset();
  const sourceByFoodId = new Map(
    dataset.sourceDocuments.map(({ filePath, data }) => [data.food.id, filePath]),
  );

  const rows = dataset.previewFoods.map((food) => {
    const sourcePath = sourceByFoodId.get(food.id);
    if (!sourcePath) throw new Error(`Missing OKF source path for ${food.id}`);
    const normalizedSourcePath = sourcePath.split(path.sep).join("/");
    const searchText = normalize([
      food.id,
      food.title,
      food.brand,
      food.name,
      food.barcode,
      ...food.aliases,
      ...food.tags,
      ...food.ingredients,
      ...food.allergens.map(({ allergen }) => allergen),
    ].filter(Boolean).join(" "));

    return {
      id: food.id,
      conceptId: conceptId(sourcePath),
      sourcePath: normalizedSourcePath,
      status: food.status,
      kind: food.kind,
      title: food.title,
      brand: food.brand,
      brandNorm: normalize(food.brand),
      name: food.name,
      barcode: food.barcode,
      searchText,
      documentJson: JSON.stringify(food),
    };
  });

  const statements = [
    "-- Generated from the validated OKF bundle. Do not edit by hand.",
  ];

  for (const row of rows) {
    statements.push(`INSERT INTO foods (
  dataset_version, id, concept_id, source_path, status, kind,
  title, brand, brand_norm, name, barcode, search_text, document_json
) VALUES (
  ${sqlText(dataset.version)},
  ${sqlText(row.id)},
  ${sqlText(row.conceptId)},
  ${sqlText(row.sourcePath)},
  ${sqlText(row.status)},
  ${sqlText(row.kind)},
  ${sqlText(row.title)},
  ${sqlText(row.brand)},
  ${sqlText(row.brandNorm)},
  ${sqlText(row.name)},
  ${sqlText(row.barcode)},
  ${sqlText(row.searchText)},
  ${sqlText(row.documentJson)}
)
ON CONFLICT(dataset_version, id) DO UPDATE SET
  concept_id = excluded.concept_id,
  source_path = excluded.source_path,
  status = excluded.status,
  kind = excluded.kind,
  title = excluded.title,
  brand = excluded.brand,
  brand_norm = excluded.brand_norm,
  name = excluded.name,
  barcode = excluded.barcode,
  search_text = excluded.search_text,
  document_json = excluded.document_json;`);
  }

  statements.push(`INSERT INTO dataset_meta (
  singleton, dataset_version, source_commit, generated_at,
  stable_documents, preview_documents, draft_documents,
  stable_stale_documents, preview_stale_documents
) VALUES (
  1,
  ${sqlText(dataset.version)},
  ${sqlText(dataset.sourceCommit)},
  ${sqlText(dataset.generatedAt)},
  ${dataset.runtimeFoods.length},
  ${dataset.previewFoods.length},
  ${dataset.previewManifest.draft_documents},
  ${dataset.manifest.stale_documents},
  ${dataset.previewManifest.stale_documents}
)
ON CONFLICT(singleton) DO UPDATE SET
  dataset_version = excluded.dataset_version,
  source_commit = excluded.source_commit,
  generated_at = excluded.generated_at,
  stable_documents = excluded.stable_documents,
  preview_documents = excluded.preview_documents,
  draft_documents = excluded.draft_documents,
  stable_stale_documents = excluded.stable_stale_documents,
  preview_stale_documents = excluded.preview_stale_documents;`);

  statements.push(`DELETE FROM foods WHERE dataset_version <> ${sqlText(dataset.version)};`);

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(outputDir, "sync.sql"), `${statements.join("\n\n")}\n`, "utf8"),
    writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(dataset.manifest, null, 2)}\n`, "utf8"),
    writeFile(path.join(outputDir, "preview-manifest.json"), `${JSON.stringify(dataset.previewManifest, null, 2)}\n`, "utf8"),
    writeFile(path.join(outputDir, "stats.json"), `${JSON.stringify(dataset.stats, null, 2)}\n`, "utf8"),
    writeFile(path.join(outputDir, "current-version.txt"), `${dataset.version}\n`, "utf8"),
  ]);

  console.log(`Built D1 dataset ${dataset.version}.`);
  console.log(`Stable documents: ${dataset.runtimeFoods.length}.`);
  console.log(`Preview documents: ${dataset.previewFoods.length}.`);
  console.log(`D1 food rows: ${rows.length}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
