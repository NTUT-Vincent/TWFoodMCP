import assert from "node:assert/strict";
import test from "node:test";
import { buildDataset } from "../scripts/lib/dataset.mjs";

const DAILYDIETITIAN_ID_PREFIX = "food:tw:menu:dailydietitian:";
const MWD_ID_PREFIX = "food:tw:menu:mwd:";
const STARBUCKS_ID_PREFIX = "food:tw:menu:starbucks:";
const EXISTING_CORPUS_DOCUMENTS = 283;
const STARBUCKS_DOCUMENTS = 424;

function splitSourceDocuments(dataset) {
  const dailydietitian = dataset.sourceDocuments.filter(({ data }) => data.food.id.startsWith(DAILYDIETITIAN_ID_PREFIX));
  const mwd = dataset.sourceDocuments.filter(({ data }) => data.food.id.startsWith(MWD_ID_PREFIX));
  const starbucks = dataset.sourceDocuments.filter(({ data }) => data.food.id.startsWith(STARBUCKS_ID_PREFIX));
  const existing = dataset.sourceDocuments.filter(({ data }) =>
    !data.food.id.startsWith(DAILYDIETITIAN_ID_PREFIX)
    && !data.food.id.startsWith(MWD_ID_PREFIX)
    && !data.food.id.startsWith(STARBUCKS_ID_PREFIX));
  return { dailydietitian, mwd, starbucks, existing };
}

test("builds reviewed public OKF records into versioned KV entries", async () => {
  const dataset = await buildDataset({
    sourceCommit: "0123456789abcdef0123456789abcdef01234567",
    version: "test-v1",
    generatedAt: "2026-08-01T02:00:00+08:00",
  });
  const { dailydietitian, mwd, starbucks, existing } = splitSourceDocuments(dataset);
  const publicPreviewDocuments = dataset.sourceDocuments.filter(({ data }) =>
    data.status !== "deprecated" && data.access?.classification === "public");
  const publicDraftDocuments = publicPreviewDocuments.filter(({ data }) => data.status === "draft");

  assert.equal(existing.length, EXISTING_CORPUS_DOCUMENTS, "the pre-existing OKF corpus must remain intact");
  assert.equal(starbucks.length, STARBUCKS_DOCUMENTS);
  assert.equal(dataset.sourceDocuments.length, existing.length + dailydietitian.length + mwd.length + starbucks.length);
  assert.equal(dataset.runtimeFoods.length, 7);
  assert.equal(dataset.manifest.dataset_version, "test-v1");
  assert.equal(dataset.manifest.source_commit, "0123456789abcdef0123456789abcdef01234567");
  assert.equal(dataset.manifest.stable_documents, 7);
  assert.equal(dataset.manifest.stale_documents, 0);
  assert.equal(dataset.previewFoods.length, publicPreviewDocuments.length);
  assert.equal(dataset.previewManifest.draft_documents, publicDraftDocuments.length);
  assert.equal(dataset.previewManifest.preview_documents, dataset.previewFoods.length);
  assert.equal(dataset.versionedEntries.length, dataset.runtimeFoods.length + dataset.previewFoods.length + 3);
  assert.equal(dataset.versionedEntries.some((entry) => entry.key === "dataset:current"), false);

  for (const food of dataset.runtimeFoods) {
    assert.equal(food.status, "stable");
    assert.equal(food.trust_tier, "human-reviewed");
    assert.equal(food.quality.confidence, "high");
    assert.equal(food.quality.calculation_allowed, true);
    assert.equal(food.stale, false);
    assert.equal(food.last_verified, "2026-07-31T17:37:00.000Z");
  }

  for (const { data } of dailydietitian) {
    assert.equal(data.status, "draft");
    assert.equal(data.verified, undefined, "DailyDietitian source drafts must stay unverified");
    assert.equal(data.sources.length, 1);
    assert.equal(data.sources[0].author, "dailydietitian/website");
    assert.ok(["expert_interpretation", "estimated_or_untraceable"].includes(data.sources[0].source_class));
    assert.ok(["third_party_database", "estimated"].includes(data.quality.data_quality));
    assert.equal(data.quality.calculation_allowed, false);
  }

  for (const { data } of mwd) {
    assert.equal(data.status, "draft");
    assert.equal(data.verified, undefined, "MWD official imports must stay unverified until human review");
    assert.equal(data.food.brand, "麥味登");
    assert.equal(data.quality.data_quality, "official_brand");
  }

  for (const { data } of starbucks) {
    assert.equal(data.status, "draft");
    assert.equal(data.food.brand, "星巴克");
    assert.equal(data.sources[0].source_class, "primary_official");
    assert.equal(data.quality.calculation_allowed, false);
  }

  assert.equal(starbucks.filter(({ data }) => data.tags.includes("食品")).length, 113);
  assert.equal(starbucks.filter(({ data }) => data.tags.includes("飲品")).length, 311);
  const starbucksGrandeLatte = dataset.previewFoods.find((food) => food.id === "food:tw:menu:starbucks:drink-692-grande");
  assert.ok(starbucksGrandeLatte);
  assert.equal(starbucksGrandeLatte.serving.amount, 473);
  assert.equal(starbucksGrandeLatte.nutrition[0].values.energy_kcal, 295);
  assert.equal(starbucksGrandeLatte.nutrition[0].values.sugar_g, 23);
  assert.equal(starbucksGrandeLatte.nutrition[0].values.caffeine_mg, 182);

  const peach = dataset.runtimeFoods.find((food) => food.id === "food:tw:menu:familymart:famice-nissei-peach");
  assert.ok(peach);
  assert.equal(peach.nutrition[0].values.energy_kcal, 151);
  assert.equal(peach.nutrition[0].values.protein_g, 2.3);
  assert.equal("dietary_fiber_g" in peach.nutrition[0].values, false, "missing nutrients must stay missing instead of becoming zero");

  const bigMac = dataset.previewFoods.find((food) => food.id === "food:tw:menu:mcdonalds:big-mac");
  assert.ok(bigMac);
  assert.equal(bigMac.status, "draft");
  assert.equal(bigMac.trust_tier, "unverified");
  assert.equal(bigMac.serving.amount, 211.64);
  assert.equal(bigMac.nutrition[0].values.energy_kcal, 503.17);
  assert.equal(dataset.runtimeFoods.some((food) => food.id === bigMac.id), false, "draft McDonald's records must stay out of the stable dataset");

  const manifestEntry = dataset.versionedEntries.find((entry) => entry.key === "manifest:test-v1");
  assert.deepEqual(JSON.parse(manifestEntry.value), dataset.manifest);
});

test("marks records stale relative to the publication timestamp", async () => {
  const dataset = await buildDataset({
    sourceCommit: "0123456789abcdef0123456789abcdef01234567",
    version: "test-stale",
    generatedAt: "2027-03-01T00:00:00Z",
  });

  assert.equal(dataset.manifest.stale_documents, dataset.runtimeFoods.length);
  assert.equal(dataset.previewManifest.stale_documents, dataset.previewFoods.length);
  assert.equal(dataset.runtimeFoods.every((food) => food.stale), true);
  assert.equal(dataset.previewFoods.every((food) => food.stale), true);
});
