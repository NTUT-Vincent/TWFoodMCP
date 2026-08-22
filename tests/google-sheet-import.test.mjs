import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { extractFrontmatter } from "../scripts/lib/dataset.mjs";

const ROOT = "knowledge/menu-items/google-sheet";

async function conceptFiles(root) {
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const resolved = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await conceptFiles(resolved));
    else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md") files.push(resolved);
  }
  return files;
}

test("Google Sheet import preserves all nutrition rows as safe drafts", async () => {
  const files = await conceptFiles(ROOT);
  assert.equal(files.length, 1214);
  const records = [];
  for (const file of files) {
    const data = extractFrontmatter(await readFile(file, "utf8"), file);
    records.push(data);
    assert.equal(data.status, "draft");
    assert.equal(data.quality.calculation_allowed, false);
    assert.equal(data.verified, undefined);
    assert.equal(data.access.classification, "public");
    assert.ok(data.sources[0].resource);
    assert.ok(Object.keys(data.nutrition[0].values).length >= 1);
  }
  assert.equal(new Set(records.map(({ food }) => food.id)).size, 1214);
});

test("Google Sheet import keeps exact official corroborations and conflicts linked", async () => {
  const report = JSON.parse(await readFile("reports/google-sheet-import-2026-08-22.json", "utf8"));
  assert.equal(report.okf_drafts_created, 1214);
  assert.equal(report.corroborated_existing, 66);
  assert.equal(report.conflict_existing, 17);
  assert.equal(report.no_match, 1131);
  for (const match of report.matches) assert.match(match.existing_concept, /^\//u);
});
