import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../.test-dist/index.js';

const stableFood = {
  id: 'food:tw:generic:rice',
  title: '熟白飯',
  status: 'stable',
  kind: 'generic_food',
  name: '白飯',
  aliases: ['米飯'],
  tags: ['主食'],
  serving: { description: '一碗 150 g', amount: 150, unit: 'g' },
  nutrition: [{ basis: 'per_100g', values: { energy_kcal: 130, protein_g: 2.4, carbohydrate_g: 28 } }],
  ingredients: ['白米', '水'],
  allergens: [],
  quality: { data_quality: 'government_database', confidence: 'high', calculation_allowed: true },
  trust_tier: 'human-reviewed',
  stale: false,
  sources: [{ source_class: 'primary_official' }],
  verification: [{ by: 'human:reviewer' }],
};

const draftFood = {
  id: 'food:tw:menu:mcdonalds:big-mac',
  title: '麥當勞 大麥克',
  status: 'draft',
  kind: 'menu_item',
  brand: '麥當勞',
  name: '大麥克',
  aliases: ['大麥克', '麥當勞大麥克', 'big-mac'],
  tags: ['麥當勞', '官方營養'],
  serving: { description: '官方每份 211.64 公克', amount: 211.64, unit: 'g' },
  nutrition: [{ basis: 'per_serving', values: { energy_kcal: 503.17, protein_g: 26, fat_g: 25 } }],
  ingredients: [],
  allergens: [],
  quality: { data_quality: 'official_brand', confidence: 'high', calculation_allowed: true },
  trust_tier: 'unverified',
  stale: false,
  sources: [{ source_class: 'primary_official' }],
  verification: [],
};

const deprecatedFood = {
  ...draftFood,
  id: 'food:tw:menu:mcdonalds:old-big-mac',
  title: '舊大麥克資料',
  status: 'deprecated',
};

const stableManifest = {
  dataset_version: 'v-all',
  source_commit: 'abc123',
  stable_documents: 1,
  stale_documents: 0,
  last_deployment: '2026-08-02T00:00:00Z',
  documents: [stableFood],
};

const previewManifest = {
  ...stableManifest,
  draft_documents: 1,
  preview_documents: 2,
  documents: [stableFood, draftFood, deprecatedFood],
};

class MockKV {
  async get(key, type) {
    if (key === 'dataset:current' || key === 'dataset:preview') return 'v-all';
    if (key === 'manifest:v-all') return type === 'json' ? stableManifest : JSON.stringify(stableManifest);
    if (key === 'preview-manifest:v-all') return type === 'json' ? previewManifest : JSON.stringify(previewManifest);
    return null;
  }
  async list() { return { keys: [], list_complete: true }; }
}

const env = {
  DATASET: new MockKV(),
  GITHUB_REPOSITORY: 'NTUT-Vincent/TWFoodMCP',
  GITHUB_DEFAULT_BRANCH: 'main',
};

async function rpc(method, params) {
  const response = await worker.fetch(new Request('https://example.test/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, ...(params ? { params } : {}) }),
  }), env);
  return response.json();
}

async function callTool(name, args) {
  return rpc('tools/call', { name, arguments: args });
}

test('search and get schemas expose an all/stable/draft status filter', async () => {
  const tools = (await rpc('tools/list')).result.tools;
  for (const name of ['search_food', 'get_food']) {
    const tool = tools.find((candidate) => candidate.name === name);
    assert.deepEqual(tool.inputSchema.properties.status.enum, ['all', 'stable', 'draft']);
    assert.equal(tool.inputSchema.properties.status.default, 'all');
    assert.equal(tool.inputSchema.properties.dataset_channel, undefined);
  }
});

test('search defaults to all discoverable records and clearly labels drafts', async () => {
  const result = await callTool('search_food', { query: '大麥克' });
  const content = result.result.structuredContent;
  assert.equal(content.results.length, 1);
  assert.equal(content.results[0].food_id, draftFood.id);
  assert.equal(content.results[0].status, 'draft');
  assert.equal(content.results[0].trust_tier, 'unverified');
  assert.equal(content.results[0].data_quality, 'official_brand');
  assert.equal(content.results[0].confidence, 'high');
  assert.equal(content.results[0].calculation_allowed, true);
  assert.equal(content.status_filter, 'all');
  assert.equal(content.dataset_channel, 'preview');
  assert.match(content.warning, /draft/i);
});

test('status can explicitly limit discovery to stable or draft records', async () => {
  const stable = await callTool('search_food', { query: '大麥克', status: 'stable' });
  assert.equal(stable.result.structuredContent.results.length, 0);
  assert.equal(stable.result.structuredContent.dataset_channel, 'stable');

  const draft = await callTool('search_food', { query: '大麥克', status: 'draft' });
  assert.equal(draft.result.structuredContent.results[0].food_id, draftFood.id);
  assert.equal(draft.result.structuredContent.status_filter, 'draft');
});

test('get_food defaults to all and returns complete draft data with a warning', async () => {
  const result = await callTool('get_food', { food_id: draftFood.id });
  const content = result.result.structuredContent;
  assert.equal(content.status, 'draft');
  assert.equal(content.nutrition[0].values.energy_kcal, 503.17);
  assert.equal(content.status_filter, 'all');
  assert.match(content.freshness_warnings.join(' '), /draft/i);
});

test('legacy preview channel calls remain backward compatible', async () => {
  const result = await callTool('search_food', { query: '大麥克', dataset_channel: 'preview' });
  assert.equal(result.result.structuredContent.results[0].food_id, draftFood.id);
});

test('nutrition calculation remains limited to stable records', async () => {
  const result = await callTool('calculate_nutrition', {
    items: [{ food_id: draftFood.id, quantity: 1, unit: 'serving' }],
  });
  assert.equal(result.result.isError, true);
  assert.match(result.result.content[0].text, /unavailable for calculation/);
});
