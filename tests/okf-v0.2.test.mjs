import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { loadOkfDocuments, toRuntimeFood } from "../scripts/lib/dataset.mjs";

const baseRecord = {
  type: "Food Product",
  title: "Test Food",
  description: "A test record.",
  resource: "https://example.com/food",
  status: "stable",
  stale_after: "2026-08-02",
  access: { classification: "public" },
  generated: { by: "test-importer/1.0.0", at: "2026-08-01T00:00:00Z" },
  verified: { by: "human:reviewer", at: "2026-08-01T01:00:00Z" },
  sources: [{ id: "source", resource: "https://example.com/food", author: "example-source/1.0.0", source_class: "primary_official" }],
  food: { id: "food:tw:menu:test:item", kind: "menu_item", market: "TW", name: "Test Food" },
  serving: { description: "每份 100 公克", amount: 100, unit: "g" },
  nutrition: [{ basis: "per_serving", values: { energy_kcal: 100 } }],
  quality: { data_quality: "official_brand", completeness: "minimal", confidence: "high", calculation_allowed: true },
};

function render(record) {
  return `---\n${JSON.stringify(record)}\n---\n\n# Summary\n\nTest.[^source]\n\n[^source]: Test source\n`;
}

test("reserved index/log files are not parsed as concepts and bare verified mapping is accepted", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "twfood-okf-"));
  const knowledgeRoot = path.join(root, "knowledge");
  await mkdir(knowledgeRoot, { recursive: true });
  await writeFile(path.join(knowledgeRoot, "index.md"), '---\nokf_version: "0.2"\n---\n\n# Index\n', "utf8");
  await writeFile(path.join(knowledgeRoot, "log.md"), "# Log\n\n## 2026-08-02\n", "utf8");
  await writeFile(path.join(knowledgeRoot, "test.md"), render(baseRecord), "utf8");
  const reviewersPath = path.join(root, "reviewers.json");
  await writeFile(reviewersPath, JSON.stringify({ reviewers: ["human:reviewer"] }), "utf8");

  const documents = await loadOkfDocuments({ knowledgeRoot, reviewersPath });
  assert.equal(documents.length, 1);
  assert.equal(toRuntimeFood(documents[0].data, new Date("2026-08-01T16:00:00Z")).trust_tier, "human-reviewed");
});

test("stale_after is stale on the boundary date in Asia/Taipei", () => {
  const runtime = toRuntimeFood(baseRecord, new Date("2026-08-01T16:00:00Z"));
  assert.equal(runtime.stale, true);
  assert.equal(runtime.stale_after, "2026-08-02");
});
