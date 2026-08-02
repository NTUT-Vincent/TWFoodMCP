import assert from "node:assert/strict";
import test from "node:test";
import worker from "../.test-dist/app.js";

const stableFood = {
  id: "food:tw:menu:familymart:famice-nissei-peach",
  title: "全家 Fami!ce 日世霜淇淋－水蜜桃",
  status: "stable",
  kind: "menu_item",
  brand: "全家便利商店 Fami!ce",
  name: "日世霜淇淋－水蜜桃",
  aliases: ["全家水蜜桃霜淇淋"],
  tags: ["全家", "Fami!ce", "水蜜桃"],
  nutrition: [],
  ingredients: [],
  allergens: [],
  quality: { data_quality: "official_brand", confidence: "high", calculation_allowed: false },
  trust_tier: "human-reviewed",
  stale: false,
  sources: [],
  verification: [],
};

const draftFood = {
  ...stableFood,
  id: "food:tw:menu:mcdonalds:big-mac",
  title: "大麥克",
  status: "draft",
  brand: "麥當勞",
  name: "大麥克",
  aliases: ["Big Mac"],
  tags: ["麥當勞"],
  trust_tier: "unverified",
};

class MockStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
    this.params = [];
  }

  bind(...params) {
    this.params = params;
    return this;
  }

  async first() {
    if (!this.sql.includes("FROM dataset_meta")) return null;
    const version = this.params[0];
    if (version && version !== this.db.meta.dataset_version) return null;
    return this.db.meta;
  }

  async all() {
    if (!this.sql.includes("FROM foods")) return { results: [] };
    const preview = this.sql.includes("status IN ('stable', 'draft')");
    return {
      results: this.db.foods
        .filter((food) => preview || food.status === "stable")
        .map((food) => ({ document_json: JSON.stringify(food) })),
    };
  }
}

class MockD1 {
  constructor() {
    this.meta = {
      dataset_version: "git-d1-test",
      source_commit: "d1-test",
      generated_at: "2026-08-02T08:00:00.000Z",
      stable_documents: 1,
      preview_documents: 2,
      draft_documents: 1,
      stable_stale_documents: 0,
      preview_stale_documents: 0,
    };
    this.foods = [stableFood, draftFood];
  }

  prepare(sql) {
    return new MockStatement(this, sql);
  }
}

const env = {
  DB: new MockD1(),
  GITHUB_REPOSITORY: "NTUT-Vincent/TWFoodMCP",
  GITHUB_DEFAULT_BRANCH: "main",
};

async function callTool(name, args) {
  const response = await worker.fetch(
    new Request("https://example.test/mcp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name, arguments: args },
      }),
    }),
    env,
  );
  return response.json();
}

test("D1 adapter exposes dataset metadata without embedded documents", async () => {
  const response = await worker.fetch(new Request("https://example.test/dataset"), env);
  const body = await response.json();
  assert.equal(body.dataset_version, "git-d1-test");
  assert.equal(body.stable_documents, 1);
  assert.equal(body.documents, undefined);
});

test("D1 adapter supplies stable and preview foods to existing MCP logic", async () => {
  const stable = await callTool("search_food", { query: "水蜜桃" });
  assert.equal(stable.result.structuredContent.results[0].food_id, stableFood.id);

  const preview = await callTool("search_food", {
    query: "大麥克",
    dataset_channel: "preview",
  });
  assert.equal(preview.result.structuredContent.results[0].food_id, draftFood.id);
  assert.equal(preview.result.structuredContent.results[0].status, "draft");
});
