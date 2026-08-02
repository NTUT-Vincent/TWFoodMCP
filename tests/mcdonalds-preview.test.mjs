import assert from "node:assert/strict";
import test from "node:test";
import worker from "../.test-dist/app.js";

const bigMac = {
  id: "food:tw:menu:mcdonalds:big-mac",
  title: "麥當勞 大麥克",
  status: "draft",
  kind: "menu_item",
  brand: "麥當勞",
  name: "大麥克",
  aliases: ["大麥克", "麥當勞大麥克", "McDonald's 大麥克", "big-mac"],
  tags: ["麥當勞", "McDonald's", "官方營養"],
  serving: { description: "官方每份 211.64 公克", amount: 211.64, unit: "g" },
  nutrition: [{ basis: "per_serving", values: { energy_kcal: 503.17, protein_g: 26, sodium_mg: 1092.5 } }],
  ingredients: [],
  allergens: [{ allergen: "牛奶", status: "contains" }],
  quality: { data_quality: "official_brand", confidence: "high", calculation_allowed: true },
  trust_tier: "unverified",
  stale: false,
  stale_after: "2027-02-01",
  revision: { revision_id: "official-api-200008-2026-08-01", source_product_id: "200008" },
  sources: [{ id: "mcdonalds-tw-nutrition-2026-08-01" }],
  verification: [],
};

class MockKV {
  async get(key, type) {
    const stableManifest = {
      dataset_version: "v-mcdonalds",
      source_commit: "test",
      stable_documents: 0,
      stale_documents: 0,
      last_deployment: "2026-08-01T15:30:00Z",
      documents: [],
    };
    const previewManifest = {
      ...stableManifest,
      draft_documents: 1,
      preview_documents: 1,
      documents: [bigMac],
    };
    if (key === "dataset:current" || key === "dataset:preview") return "v-mcdonalds";
    if (key === "manifest:v-mcdonalds") return type === "json" ? stableManifest : JSON.stringify(stableManifest);
    if (key === "preview-manifest:v-mcdonalds") return type === "json" ? previewManifest : JSON.stringify(previewManifest);
    return null;
  }
}

const env = {
  DATASET: new MockKV(),
  GITHUB_REPOSITORY: "NTUT-Vincent/TWFoodMCP",
  GITHUB_DEFAULT_BRANCH: "main",
};

async function callTool(name, args) {
  const response = await worker.fetch(new Request("https://example.test/mcp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
  }), env);
  return response.json();
}

test("status stable does not expose McDonald's draft records", async () => {
  const body = await callTool("search_food", { query: "大麥克", status: "stable" });
  assert.equal(body.result.structuredContent.results.length, 0);
  assert.equal(body.result.structuredContent.dataset_channel, "stable");
});

test("preview search exposes McDonald's drafts and resolves common English brand aliases", async () => {
  const body = await callTool("search_food", { query: "大麥克", brand: "McDonald's", dataset_channel: "preview" });
  const result = body.result.structuredContent;
  assert.equal(result.results.length, 1);
  assert.equal(result.results[0].food_id, bigMac.id);
  assert.equal(result.results[0].status, "draft");
  assert.equal(result.dataset_channel, "preview");
  assert.match(result.warning, /unreviewed draft/);
});

test("preview get_food returns official nutrition with an explicit draft warning", async () => {
  const body = await callTool("get_food", { food_id: bigMac.id, dataset_channel: "preview" });
  const food = body.result.structuredContent;
  assert.equal(food.nutrition[0].values.energy_kcal, 503.17);
  assert.equal(food.serving.amount, 211.64);
  assert.equal(food.status, "draft");
  assert.equal(food.dataset_channel, "preview");
  assert.match(food.freshness_warnings.join(" "), /未經真人審核/);
});

test("preview dataset status reports draft counts without changing stable counts", async () => {
  const body = await callTool("get_dataset_status", { dataset_channel: "preview" });
  const status = body.result.structuredContent;
  assert.equal(status.stable_documents, 0);
  assert.equal(status.draft_documents, 1);
  assert.equal(status.preview_documents, 1);
  assert.equal(status.dataset_channel, "preview");
});

test("draft records remain unavailable to calculation tools", async () => {
  const body = await callTool("calculate_nutrition", { items: [{ food_id: bigMac.id, quantity: 1, unit: "serving" }] });
  assert.equal(body.result.isError, true);
  assert.match(body.result.content[0].text, /unavailable for calculation/);
});
