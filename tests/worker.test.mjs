import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../.test-dist/index.js';

const baseEnv = {
  GITHUB_REPOSITORY: 'NTUT-Vincent/TWFoodMCP',
  GITHUB_DEFAULT_BRANCH: 'main',
};

const foods = [
  {
    id: 'food:tw:barcode:471000000001',
    title: '統一高纖無糖豆漿',
    status: 'stable',
    kind: 'packaged_food',
    brand: '統一',
    name: '高纖無糖豆漿',
    barcode: '471000000001',
    variant: '400 ml',
    aliases: ['無糖豆漿', '高纖豆漿'],
    tags: ['豆漿', '植物蛋白'],
    serving: { description: '每份 400 ml', amount: 400, unit: 'ml' },
    nutrition: [
      { basis: 'per_100ml', values: { energy_kcal: 40, protein_g: 3.3, fat_g: 2, carbohydrate_g: 2.5, sugar_g: 0.5, sodium_mg: 35 } },
      { basis: 'per_serving', values: { energy_kcal: 160, protein_g: 13.2, fat_g: 8, carbohydrate_g: 10, sugar_g: 2, sodium_mg: 140 } },
    ],
    ingredients: ['水', '非基因改造黃豆'],
    allergens: [{ allergen: '大豆', status: 'contains' }],
    quality: { data_quality: 'official_label', confidence: 'high', calculation_allowed: true },
    trust_tier: 'human-reviewed',
    stale: false,
    last_verified: '2026-07-30',
    revision: { revision_id: '2026-07' },
    sources: [{ type: 'label' }],
    verification: [{ by: 'human:reviewer' }],
  },
  {
    id: 'food:tw:generic:oats',
    title: '即食燕麥片',
    status: 'stable',
    kind: 'generic_food',
    name: '燕麥片',
    aliases: ['燕麥'],
    tags: ['穀物'],
    nutrition: [
      { basis: 'per_100g', values: { energy_kcal: 380, protein_g: 13, fat_g: 7, carbohydrate_g: 68, dietary_fiber_g: 10 } },
    ],
    ingredients: ['燕麥'],
    allergens: [{ allergen: '麩質穀物', status: 'may_contain' }],
    quality: { data_quality: 'government_database', confidence: 'medium', calculation_allowed: true },
    trust_tier: 'machine-confirmed',
    stale: true,
    last_verified: '2025-01-01',
    sources: [],
    verification: [],
  },
  {
    id: 'food:tw:generic:cooked-rice',
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
    sources: [{}],
    verification: [{}],
  },
  {
    id: 'food:tw:menu:test-drink',
    title: '測試茶飲 500 ml',
    status: 'stable',
    kind: 'menu_item',
    brand: '測試店',
    name: '測試茶飲',
    aliases: ['茶飲'],
    tags: ['飲料'],
    serving: { description: '一杯 500 ml', amount: 500, unit: 'ml' },
    nutrition: [{ basis: 'per_serving', values: { energy_kcal: 200, sugar_g: 40 } }],
    ingredients: ['水', '茶', '糖'],
    allergens: [],
    quality: { data_quality: 'official_brand', confidence: 'high', calculation_allowed: true },
    trust_tier: 'human-reviewed',
    stale: false,
    sources: [{}],
    verification: [{}],
  },
  {
    id: 'food:tw:generic:old',
    title: '舊資料',
    status: 'deprecated',
    kind: 'generic_food',
    name: '舊資料',
    aliases: ['豆漿'],
    tags: [],
    nutrition: [],
    ingredients: [],
    allergens: [],
    quality: { data_quality: 'community_report', confidence: 'low', calculation_allowed: false },
    trust_tier: 'unverified',
    stale: true,
    sources: [],
    verification: [],
  },
];

class MockKV {
  constructor(manifest) { this.manifest = manifest; }
  async get(key, type) {
    if (key === 'dataset:current') return 'v-test';
    if (key === 'manifest:v-test') return type === 'json' ? this.manifest : JSON.stringify(this.manifest);
    return null;
  }
  async list() { return { keys: [], list_complete: true }; }
}

const manifest = {
  dataset_version: 'v-test',
  source_commit: 'abc123',
  stable_documents: 4,
  stale_documents: 1,
  last_deployment: '2026-07-31T00:00:00Z',
  documents: foods,
};
const env = { ...baseEnv, DATASET: new MockKV(manifest) };

async function request(path, init = {}, useEnv = env) {
  return worker.fetch(new Request(`https://example.test${path}`, init), useEnv);
}
async function responseBody(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
async function rpc(method, params, { id = 1, headers = {}, useEnv = env } = {}) {
  return request('/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, ...(params ? { params } : {}) }),
  }, useEnv);
}
async function callTool(name, args, options) {
  return responseBody(await rpc('tools/call', { name, arguments: args }, options));
}

test('root, health, and dataset endpoints work without exposing embedded documents', async () => {
  const root = await responseBody(await request('/'));
  assert.deepEqual(root, { name: 'TWFoodMCP', endpoints: { mcp: '/mcp', health: '/health', dataset: '/dataset' } });
  const health = await responseBody(await request('/health'));
  assert.equal(health.status, 'ok');
  const dataset = await responseBody(await request('/dataset'));
  assert.equal(dataset.dataset_version, 'v-test');
  assert.equal(dataset.documents, undefined);
});

test('dataset endpoint remains usable before KV is configured', async () => {
  const response = await request('/dataset', {}, baseEnv);
  const body = await responseBody(response);
  assert.equal(response.status, 200);
  assert.equal(body.dataset_version, 'unconfigured');
  assert.equal(body.documents, undefined);
});

test('MCP initialize, ping, tools/list, and initialized notification work', async () => {
  const initialized = await responseBody(await rpc('initialize', { protocolVersion: '2025-06-18' }));
  assert.equal(initialized.result.serverInfo.name, 'TWFoodMCP');
  assert.equal(initialized.result.protocolVersion, '2025-06-18');
  assert.deepEqual((await responseBody(await rpc('ping'))).result, {});
  const tools = (await responseBody(await rpc('tools/list'))).result.tools;
  assert.deepEqual(tools.map((tool) => tool.name), ['search_food', 'get_food', 'calculate_nutrition', 'compare_foods', 'get_dataset_status', 'create_draft']);
  const notification = await rpc('notifications/initialized');
  assert.equal(notification.status, 202);
  assert.equal(await notification.text(), '');
});

test('MCP reports parse, invalid request, invalid params, and unknown method errors', async () => {
  const parse = await responseBody(await request('/mcp', { method: 'POST', body: '{bad' }));
  assert.equal(parse.error.code, -32700);
  const invalid = await responseBody(await request('/mcp', { method: 'POST', body: JSON.stringify({ foo: 'bar' }) }));
  assert.equal(invalid.error.code, -32600);
  const invalidParams = await responseBody(await rpc('tools/call', undefined));
  assert.equal(invalidParams.error.code, -32602);
  const unknown = await responseBody(await rpc('unknown/method'));
  assert.equal(unknown.error.code, -32601);
});

test('search supports Chinese multi-keyword matching and excludes deprecated documents', async () => {
  const result = await callTool('search_food', { query: '無糖豆漿 植物蛋白' });
  assert.equal(result.result.structuredContent.results.length, 1);
  assert.equal(result.result.structuredContent.results[0].food_id, 'food:tw:barcode:471000000001');
});

test('exact barcode is prioritized and trust modifier is deterministic', async () => {
  const result = await callTool('search_food', { query: '471000000001' });
  assert.equal(result.result.structuredContent.results[0].score, 120);
});

test('search rejects a non-integer limit', async () => {
  const result = await callTool('search_food', { query: '豆漿', limit: 1.5 });
  assert.equal(result.result.isError, true);
  assert.match(result.result.content[0].text, /integer/);
});

test('KV document listing follows pagination', async () => {
  class PagedKV {
    async get(key, type) {
      if (key === 'dataset:current') return 'paged';
      if (key === 'manifest:paged') return type === 'json' ? { ...manifest, dataset_version: 'paged', documents: undefined } : null;
      if (key === 'doc:paged:first') return foods[0];
      if (key === 'doc:paged:second') return foods[2];
      return null;
    }
    async list({ cursor } = {}) {
      return cursor
        ? { keys: [{ name: 'doc:paged:second' }], list_complete: true }
        : { keys: [{ name: 'doc:paged:first' }], list_complete: false, cursor: 'next' };
    }
  }
  const result = await callTool('search_food', { query: '白飯' }, { useEnv: { ...baseEnv, DATASET: new PagedKV() } });
  assert.equal(result.result.structuredContent.results[0].food_id, 'food:tw:generic:cooked-rice');
});

test('get_food returns full stable data and prominent stale warning', async () => {
  const result = await callTool('get_food', { food_id: 'food:tw:generic:oats' });
  assert.equal(result.result.structuredContent.freshness_warnings.length, 1);
  assert.equal(result.result.structuredContent.dataset_version, 'v-test');
});

test('calculation converts per-100g evidence to per-serving', async () => {
  const result = await callTool('calculate_nutrition', { items: [{ food_id: 'food:tw:generic:cooked-rice', quantity: 2, unit: 'serving' }] });
  const item = result.result.structuredContent.items[0];
  assert.equal(item.values.energy_kcal, 390);
  assert.equal(item.source_basis, 'per_100g');
  assert.match(item.conversion, /150g serving/);
});

test('calculation converts per-serving evidence to requested millilitres', async () => {
  const result = await callTool('calculate_nutrition', { items: [{ food_id: 'food:tw:menu:test-drink', quantity: 100, unit: 'ml' }] });
  assert.equal(result.result.structuredContent.total.energy_kcal, 40);
  assert.equal(result.result.structuredContent.items[0].source_basis, 'per_serving');
});

test('missing nutrition values remain unknown rather than becoming zero', async () => {
  const result = await callTool('calculate_nutrition', { items: [
    { food_id: 'food:tw:barcode:471000000001', quantity: 1, unit: 'serving' },
    { food_id: 'food:tw:generic:oats', quantity: 50, unit: 'g' },
  ] });
  const total = result.result.structuredContent.total;
  assert.equal(total.energy_kcal, 350);
  assert.equal(total.sodium_mg, undefined);
  assert.notEqual(total.sodium_mg, 0);
});

test('calculation never performs unsupported ml-to-g conversion', async () => {
  const result = await callTool('calculate_nutrition', { items: [{ food_id: 'food:tw:generic:oats', quantity: 100, unit: 'ml' }] });
  assert.equal(result.result.isError, true);
  assert.match(result.result.content[0].text, /never converted/);
});

test('comparison converts evidence to a common requested basis', async () => {
  const result = await callTool('compare_foods', {
    food_ids: ['food:tw:barcode:471000000001', 'food:tw:menu:test-drink'],
    basis: 'per_100ml',
  });
  const compared = result.result.structuredContent.foods;
  assert.equal(compared.length, 2);
  assert.equal(compared[1].values.energy_kcal, 40);
  assert.equal(compared[1].source_basis, 'per_serving');
});

test('comparison explains incompatible bases', async () => {
  const result = await callTool('compare_foods', {
    food_ids: ['food:tw:barcode:471000000001', 'food:tw:generic:oats'],
    basis: 'per_100g',
  });
  assert.equal(result.result.isError, true);
  assert.match(result.result.content[0].text, /cannot be converted/);
});

test('dataset status tool does not leak manifest documents', async () => {
  const result = await callTool('get_dataset_status', {});
  assert.equal(result.result.structuredContent.source_commit, 'abc123');
  assert.equal(result.result.structuredContent.documents, undefined);
});

test('create_draft requires authentication and required fields', async () => {
  const unauthenticated = await callTool('create_draft', { action: 'create_food', food: { name: '豆漿' }, evidence: [{}] });
  assert.equal(unauthenticated.result.content[0].text, 'authentication required');

  const writeEnv = { ...env, DRAFT_API_TOKEN: 'draft-secret', GITHUB_TOKEN: 'gh-secret' };
  const missingEvidence = await callTool('create_draft', { action: 'create_food', food: { name: '豆漿' } }, { headers: { authorization: 'Bearer draft-secret' }, useEnv: writeEnv });
  assert.equal(missingEvidence.result.isError, true);
  assert.match(missingEvidence.result.content[0].text, /evidence/);
});

test('create_draft rejects stable status, fake human verification, private data, unsafe URLs, and executable markup', async () => {
  const writeEnv = { ...env, DRAFT_API_TOKEN: 'draft-secret', GITHUB_TOKEN: 'gh-secret' };
  const options = { headers: { authorization: 'Bearer draft-secret' }, useEnv: writeEnv };
  const cases = [
    [{ action: 'create_food', food: { name: '豆漿' }, evidence: [{}], status: 'stable' }, /stable status/],
    [{ action: 'create_food', food: { name: '豆漿' }, evidence: [{}], verified: [{ by: 'human:fake' }] }, /human verification/],
    [{ action: 'create_food', food: { name: '豆漿' }, evidence: [{}], weight: 55 }, /private health/],
    [{ action: 'create_food', food: { name: '豆漿' }, evidence: [{ url: 'https://127.0.0.1/secret' }] }, /unsafe source URL/],
    [{ action: 'create_food', food: { name: '豆漿' }, evidence: [{ note: '<script>alert(1)</script>' }] }, /unsafe executable/],
  ];
  for (const [payload, message] of cases) {
    const result = await callTool('create_draft', payload, options);
    assert.equal(result.result.isError, true);
    assert.match(result.result.content[0].text, message);
  }
});

test('create_draft performs duplicate comparison, preserves Unicode, and opens a PR rather than writing main', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('/git/ref/heads/main')) return new Response(JSON.stringify({ object: { sha: 'base-sha' } }), { status: 200 });
    if (String(url).endsWith('/git/refs')) return new Response(JSON.stringify({ ref: 'ok' }), { status: 201 });
    if (String(url).includes('/contents/drafts/')) return new Response(JSON.stringify({ content: { sha: 'blob' } }), { status: 201 });
    if (String(url).endsWith('/pulls')) return new Response(JSON.stringify({ html_url: 'https://github.test/pr/1' }), { status: 201 });
    return new Response('unexpected', { status: 500 });
  };

  try {
    const writeEnv = { ...env, DRAFT_API_TOKEN: 'draft-secret', GITHUB_TOKEN: 'gh-secret' };
    const result = await callTool('create_draft', {
      action: 'create_food',
      food: { id: 'food:tw:barcode:471000000001', barcode: '471000000001', name: '高纖無糖豆漿', brand: '統一' },
      nutrition: [{ basis: 'per_serving', values: { energy_kcal: 170 } }],
      evidence: [{ type: 'package_photo', title: '測試豆漿標示' }],
    }, { id: 9, headers: { authorization: 'Bearer draft-secret' }, useEnv: writeEnv });

    const output = result.result.structuredContent;
    assert.equal(output.status, 'pull_request_opened');
    assert.equal(output.detected_action, 'new_revision');
    assert.equal(output.duplicate_candidates[0].food_id, 'food:tw:barcode:471000000001');
    assert.equal(calls.length, 4);
    assert.equal(calls.some((call) => /contents\/drafts\//.test(call.url)), true);
    assert.equal(calls.some((call) => call.url.includes('/contents/') && JSON.parse(call.init.body).branch === 'main'), false);

    const contentCall = calls.find((call) => call.url.includes('/contents/drafts/'));
    const contentPayload = JSON.parse(contentCall.init.body);
    const decoded = Buffer.from(contentPayload.content, 'base64').toString('utf8');
    assert.match(decoded, /測試豆漿標示/);
    const draft = JSON.parse(decoded);
    assert.equal(draft.status, 'draft');
    assert.equal(draft.pipeline.identity_resolution, 'candidate_found');
    assert.ok(draft.pipeline.comparison_with_stable.length > 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
