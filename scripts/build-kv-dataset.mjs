#!/usr/bin/env node
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildDataset } from "./lib/dataset.mjs";

const outputDir = process.env.DATASET_OUTPUT_DIR ?? "dist/kv";

try {
  const dataset = await buildDataset();
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  await Promise.all([
    writeFile(path.join(outputDir, "versioned.json"), `${JSON.stringify(dataset.versionedEntries, null, 2)}\n`),
    writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(dataset.manifest, null, 2)}\n`),
    writeFile(path.join(outputDir, "stats.json"), `${JSON.stringify(dataset.stats, null, 2)}\n`),
    writeFile(path.join(outputDir, "runtime-documents.json"), `${JSON.stringify(dataset.runtimeFoods, null, 2)}\n`),
    writeFile(path.join(outputDir, "preview-manifest.json"), `${JSON.stringify(dataset.previewManifest, null, 2)}\n`),
    writeFile(path.join(outputDir, "preview-runtime-documents.json"), `${JSON.stringify(dataset.previewFoods, null, 2)}\n`),
    writeFile(path.join(outputDir, "current-version.txt"), `${dataset.version}\n`),
  ]);

  console.log(`Built dataset ${dataset.version}.`);
  console.log(`Stable published candidates: ${dataset.runtimeFoods.length}; stale: ${dataset.manifest.stale_documents}.`);
  console.log(`Preview candidates: ${dataset.previewFoods.length}; drafts: ${dataset.previewManifest.draft_documents}.`);
  console.log(`Versioned KV entries: ${dataset.versionedEntries.length}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
