import assert from "node:assert/strict";
import test from "node:test";
import worker from "../.test-dist/app.js";

const food = {
  id: "food:tw:menu:familymart:famice-nissei-peach",
  title: "全家 Fami!ce 日世霜淇淋－水蜜桃",
  status: "stable",
  kind: "menu_item",
  brand: "全家便利商店 Fami!ce",
  name: "日世霜淇淋－水蜜桃",
  aliases: ["全家水蜜桃霜淇淋", "Fami霜淇淋水蜜桃"],
  tags: ["全家", "Fami!ce", "霜淇淋", "水蜜桃"],
  serving: { description: "每份 110 公克", amount: 110, unit: "g" },
  nutrition: [{ basis: "per_serving", values: { energy_kcal: 151 } }],
  ingredients: ["水", "水蜜桃原汁"],
  allergens: [{ allergen: "牛奶及其製品", status: "contains" }],
  quality: { data_quality: "official_brand", confidence: "high", calculation_allowed: true },
  trust_tier: "human-reviewed",
  stale: false,
  sources: [],
  verification: [{ by: "human:ntut-vincent", at: "2026-07-31T17:37:00.000Z" }],
};

class MockKV {
  async get(key, type) {
    if (key === "dataset:current") return "v-familymart";
    if (key === "manifest:v-familymart") {
      const manifest = {
        dataset_version: "v-familymart",
        source_commit: "test",
        stable_documents: 1,
        stale_documents: 0,
        last_deployment: "2026-08-01T00:00:00Z",
        documents: [food],
      };
      return type === "json" ? manifest : JSON.stringify(manifest);
    }
    return null;
  }
}

async function search(brand) {
  const response = await worker.fetch(
    new Request("https://example.test/mcp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "search_food",
          arguments: { query: "水蜜桃", brand },
        },
      }),
    }),
    {
      DATASET: new MockKV(),
      GITHUB_REPOSITORY: "NTUT-Vincent/TWFoodMCP",
      GITHUB_DEFAULT_BRANCH: "main",
    },
  );
  return response.json();
}

test("search retries common FamilyMart aliases with the canonical stored brand", async () => {
  for (const brand of ["全家", "全家便利商店", "FamilyMart", "Fami!ce"]) {
    const body = await search(brand);
    assert.equal(body.result.structuredContent.results.length, 1, `expected a result for brand alias ${brand}`);
    assert.equal(body.result.structuredContent.results[0].food_id, food.id);
  }
});

test("unknown brand filters remain strict", async () => {
  const body = await search("其他商店");
  assert.equal(body.result.structuredContent.results.length, 0);
});
