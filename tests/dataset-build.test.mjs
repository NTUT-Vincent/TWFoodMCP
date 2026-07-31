import assert from "node:assert/strict";
import test from "node:test";
import { buildDataset } from "../scripts/lib/dataset.mjs";

test("builds reviewed public OKF records into versioned KV entries", async () => {
  const dataset = await buildDataset({
    sourceCommit: "0123456789abcdef0123456789abcdef01234567",
    version: "test-v1",
    generatedAt: "2026-08-01T02:00:00+08:00",
  });

  assert.equal(dataset.sourceDocuments.length, 7);
  assert.equal(dataset.runtimeFoods.length, 7);
  assert.equal(dataset.manifest.dataset_version, "test-v1");
  assert.equal(dataset.manifest.source_commit, "0123456789abcdef0123456789abcdef01234567");
  assert.equal(dataset.manifest.stable_documents, 7);
  assert.equal(dataset.manifest.stale_documents, 0);
  assert.equal(dataset.versionedEntries.length, 9);
  assert.equal(dataset.versionedEntries.some((entry) => entry.key === "dataset:current"), false);

  for (const food of dataset.runtimeFoods) {
    assert.equal(food.status, "stable");
    assert.equal(food.trust_tier, "human-reviewed");
    assert.equal(food.quality.confidence, "high");
    assert.equal(food.quality.calculation_allowed, true);
    assert.equal(food.stale, false);
    assert.match(food.last_verified, /^2026-08-01T/);
  }

  const peach = dataset.runtimeFoods.find((food) => food.id === "food:tw:menu:familymart:famice-nissei-peach");
  assert.ok(peach);
  assert.equal(peach.nutrition[0].values.energy_kcal, 151);
  assert.equal(peach.nutrition[0].values.protein_g, 2.3);
  assert.equal("dietary_fiber_g" in peach.nutrition[0].values, false, "missing nutrients must stay missing instead of becoming zero");

  const manifestEntry = dataset.versionedEntries.find((entry) => entry.key === "manifest:test-v1");
  assert.deepEqual(JSON.parse(manifestEntry.value), dataset.manifest);
});

test("marks records stale relative to the publication timestamp", async () => {
  const dataset = await buildDataset({
    sourceCommit: "0123456789abcdef0123456789abcdef01234567",
    version: "test-stale",
    generatedAt: "2027-03-01T00:00:00Z",
  });

  assert.equal(dataset.manifest.stale_documents, 7);
  assert.equal(dataset.runtimeFoods.every((food) => food.stale), true);
});
