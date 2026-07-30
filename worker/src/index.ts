interface Env {
  DATASET?: KVNamespace;
  GITHUB_TOKEN?: string;
  DRAFT_API_TOKEN?: string;
  GITHUB_REPOSITORY: string;
  GITHUB_DEFAULT_BRANCH: string;
}

type FoodKind = "packaged_food" | "menu_item" | "generic_food";
type NutritionBasis = "per_serving" | "per_100g" | "per_100ml";
type Unit = "g" | "ml" | "piece" | "package" | "serving";

type NutritionValues = Partial<Record<
  | "energy_kcal"
  | "protein_g"
  | "fat_g"
  | "saturated_fat_g"
  | "trans_fat_g"
  | "carbohydrate_g"
  | "sugar_g"
  | "dietary_fiber_g"
  | "sodium_mg",
  number
>>;

interface RuntimeFood {
  id: string;
  title: string;
  status: "stable" | "deprecated";
  kind: FoodKind;
  brand?: string;
  name: string;
  barcode?: string;
  variant?: string;
  aliases: string[];
  tags: string[];
  serving?: { description: string; amount: number; unit: Unit; servings_per_container?: number };
  nutrition: Array<{ basis: NutritionBasis; values: NutritionValues }>;
  ingredients: string[];
  allergens: Array<{ allergen: string; status: "contains" | "may_contain" | "not_declared" | "unknown" }>;
  quality: { data_quality: string; confidence: "high" | "medium" | "low"; calculation_allowed: boolean };
  trust_tier: "unverified" | "machine-confirmed" | "human-reviewed";
  stale: boolean;
  stale_after?: string;
  last_verified?: string;
  revision?: Record<string, unknown>;
  sources: Array<Record<string, unknown>>;
  verification: Array<Record<string, unknown>>;
}

interface DatasetManifest {
  dataset_version: string;
  source_commit: string;
  stable_documents: number;
  stale_documents: number;
  last_deployment: string;
  documents?: RuntimeFood[];
}

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });

const error = (code: number, message: string, id: unknown = null) =>
  json({ jsonrpc: "2.0", id, error: { code, message } });

const normalize = (value: string) =>
  value.normalize("NFKC").toLocaleLowerCase("zh-TW").replace(/[\s\p{P}\p{S}]+/gu, "");

async function loadManifest(env: Env): Promise<DatasetManifest> {
  if (!env.DATASET) {
    return {
      dataset_version: "unconfigured",
      source_commit: "unknown",
      stable_documents: 0,
      stale_documents: 0,
      last_deployment: "unknown",
      documents: [],
    };
  }
  const version = await env.DATASET.get("dataset:current");
  if (!version) throw new Error("dataset:current is not configured");
  const manifest = await env.DATASET.get<DatasetManifest>(`manifest:${version}`, "json");
  if (!manifest) throw new Error(`manifest:${version} was not found`);
  return manifest;
}

async function loadFoods(env: Env): Promise<{ manifest: DatasetManifest; foods: RuntimeFood[] }> {
  const manifest = await loadManifest(env);
  if (manifest.documents) return { manifest, foods: manifest.documents };
  if (!env.DATASET) return { manifest, foods: [] };
  const keys = await env.DATASET.list({ prefix: `doc:${manifest.dataset_version}:` });
  const foods = (await Promise.all(keys.keys.map((key) => env.DATASET!.get<RuntimeFood>(key.name, "json")))).filter(
    (food): food is RuntimeFood => Boolean(food),
  );
  return { manifest, foods };
}

function scoreFood(food: RuntimeFood, query: string, brand?: string): number {
  const q = normalize(query);
  const id = normalize(food.id);
  const barcode = normalize(food.barcode ?? "");
  const title = normalize(food.title);
  const foodBrand = normalize(food.brand ?? "");
  let score = 0;
  if (q && (q === barcode || q === id)) score = 100;
  else if (q && q === title) score = 50;
  else {
    if (brand && normalize(brand) === foodBrand && title.includes(q)) score += 40;
    if (food.aliases.some((x) => normalize(x).includes(q))) score += 12;
    if (title.includes(q)) score += 8;
    if (foodBrand.includes(q)) score += 7;
    if (food.tags.some((x) => normalize(x).includes(q))) score += 5;
    if ([...food.ingredients, ...food.allergens.map((x) => x.allergen)].some((x) => normalize(x).includes(q))) score += 2;
  }
  if (food.trust_tier === "human-reviewed") score *= 1.2;
  else if (food.trust_tier === "machine-confirmed") score *= 1.05;
  if (food.stale) score *= 0.7;
  return score;
}

function selectNutrition(food: RuntimeFood, unit: Unit) {
  if (unit === "serving") return food.nutrition.find((x) => x.basis === "per_serving");
  if (unit === "g") return food.nutrition.find((x) => x.basis === "per_100g");
  if (unit === "ml") return food.nutrition.find((x) => x.basis === "per_100ml");
  return undefined;
}

function scale(values: NutritionValues, factor: number): NutritionValues {
  return Object.fromEntries(Object.entries(values).map(([k, v]) => [k, Math.round((v as number) * factor * 1000) / 1000]));
}

function addNutrition(total: NutritionValues, values: NutritionValues) {
  const keys = new Set([...Object.keys(total), ...Object.keys(values)]);
  for (const key of keys) {
    const a = total[key as keyof NutritionValues];
    const b = values[key as keyof NutritionValues];
    total[key as keyof NutritionValues] = a === undefined || b === undefined ? undefined : a + b;
  }
}

async function callTool(name: string, args: Record<string, unknown>, env: Env, request: Request) {
  const { manifest, foods } = await loadFoods(env);

  if (name === "search_food") {
    const query = String(args.query ?? "").trim();
    if (!query || query.length > 100) throw new Error("query must contain 1-100 characters");
    const limit = Math.min(Math.max(Number(args.limit ?? 10), 1), 25);
    const results = foods
      .filter((f) => f.status === "stable")
      .filter((f) => !args.kind || f.kind === args.kind)
      .filter((f) => !args.brand || normalize(f.brand ?? "") === normalize(String(args.brand)))
      .map((food) => ({ food, score: scoreFood(food, query, args.brand ? String(args.brand) : undefined) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ food, score }) => ({
        food_id: food.id,
        title: food.title,
        brand: food.brand,
        kind: food.kind,
        barcode: food.barcode,
        score,
        trust_tier: food.trust_tier,
        last_verified: food.last_verified,
        stale: food.stale,
        dataset_version: manifest.dataset_version,
      }));
    return { results, dataset_version: manifest.dataset_version };
  }

  if (name === "get_food") {
    const food = foods.find((f) => f.id === args.food_id && f.status === "stable");
    if (!food) throw new Error("food was not found in the stable dataset");
    return {
      ...food,
      freshness_warnings: food.stale
        ? ["資料可能已過期；若涉及過敏原，請核對最新實體包裝或品牌資訊。"]
        : [],
      dataset_version: manifest.dataset_version,
    };
  }

  if (name === "calculate_nutrition") {
    if (!Array.isArray(args.items) || args.items.length === 0 || args.items.length > 50) throw new Error("items must contain 1-50 entries");
    const calculated: unknown[] = [];
    let total: NutritionValues | null = null;
    for (const raw of args.items as Array<Record<string, unknown>>) {
      const food = foods.find((f) => f.id === raw.food_id && f.status === "stable");
      if (!food || !food.quality.calculation_allowed) throw new Error(`food is unavailable for calculation: ${raw.food_id}`);
      const quantity = Number(raw.quantity);
      const unit = raw.unit as Unit;
      if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("quantity must be positive");
      const record = selectNutrition(food, unit);
      if (!record) throw new Error(`no supported ${unit} basis for ${food.id}; ml and g are never converted without evidence`);
      const factor = unit === "serving" ? quantity : quantity / 100;
      const values = scale(record.values, factor);
      if (total === null) total = { ...values };
      else addNutrition(total, values);
      calculated.push({ food_id: food.id, quantity, unit, calculation_basis: record.basis, values, stale: food.stale });
    }
    return { items: calculated, total: total ?? {}, dataset_version: manifest.dataset_version, warning: "缺值保持 unknown，不補為 0；本結果不構成健康或醫療建議。" };
  }

  if (name === "compare_foods") {
    const ids = args.food_ids;
    const basis = args.basis as NutritionBasis;
    if (!Array.isArray(ids) || ids.length < 2 || ids.length > 10) throw new Error("food_ids must contain 2-10 entries");
    if (!['per_serving', 'per_100g', 'per_100ml'].includes(basis)) throw new Error("basis is required");
    const compared = ids.map((id) => {
      const food = foods.find((f) => f.id === id && f.status === "stable");
      if (!food) throw new Error(`food was not found: ${id}`);
      const nutrition = food.nutrition.find((x) => x.basis === basis);
      if (!nutrition) throw new Error(`${food.id} cannot be compared on ${basis}`);
      return { food_id: food.id, title: food.title, basis, values: nutrition.values, stale: food.stale, trust_tier: food.trust_tier };
    });
    return { foods: compared, dataset_version: manifest.dataset_version, warning: "比較僅呈現同基準數值，不判定哪個食品更健康。" };
  }

  if (name === "get_dataset_status") return manifest;

  if (name === "create_draft") {
    const auth = request.headers.get("authorization");
    if (!env.DRAFT_API_TOKEN || auth !== `Bearer ${env.DRAFT_API_TOKEN}`) throw new Error("authentication required");
    if (!env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not configured");
    const action = String(args.action ?? "");
    if (!["create_food", "correct_food", "new_revision", "report_outdated", "deprecate_food"].includes(action)) throw new Error("unsupported draft action");
    const raw = JSON.stringify(args);
    if (raw.length > 100_000 || /<script|javascript:|onerror\s*=/i.test(raw)) throw new Error("unsafe or oversized submission");
    const draftId = `draft_${crypto.randomUUID()}`;
    const [owner, repo] = env.GITHUB_REPOSITORY.split("/");
    const branch = `draft/${draftId}`;
    const baseRef = await gh(env, `/repos/${owner}/${repo}/git/ref/heads/${env.GITHUB_DEFAULT_BRANCH}`);
    await gh(env, `/repos/${owner}/${repo}/git/refs`, "POST", { ref: `refs/heads/${branch}`, sha: baseRef.object.sha });
    const path = `drafts/${draftId}.json`;
    await gh(env, `/repos/${owner}/${repo}/contents/${path}`, "PUT", {
      message: `draft: ${action} ${draftId}`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify({ ...args, draft_id: draftId, status: "draft", generated_at: new Date().toISOString() }, null, 2)))),
      branch,
    });
    const pr = await gh(env, `/repos/${owner}/${repo}/pulls`, "POST", {
      title: `[Draft] ${action}: ${draftId}`,
      head: branch,
      base: env.GITHUB_DEFAULT_BRANCH,
      body: `Automated draft submission.\n\n- Draft ID: \`${draftId}\`\n- Action: \`${action}\`\n- Next step: schema validation, comparison, and human review.`,
    });
    return { draft_id: draftId, status: "pull_request_opened", detected_action: action, duplicate_candidates: [], pull_request_url: pr.html_url, warnings: [], next_step: "human_review" };
  }

  throw new Error(`unknown tool: ${name}`);
}

async function gh(env: Env, path: string, method = "GET", body?: unknown): Promise<any> {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "content-type": "application/json",
      "user-agent": "TWFoodMCP-Worker",
      "x-github-api-version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`GitHub API failed (${response.status}): ${await response.text()}`);
  return response.json();
}

const toolDefinitions = [
  { name: "search_food", description: "Search stable Taiwan food documents by name, brand, barcode, ID, alias, ingredient, or allergen.", inputSchema: { type: "object", required: ["query"], properties: { query: { type: "string" }, brand: { type: "string" }, kind: { enum: ["packaged_food", "menu_item", "generic_food"] }, limit: { type: "integer", minimum: 1, maximum: 25 } } } },
  { name: "get_food", description: "Get one stable food document with source, verification, revision, nutrition, ingredients, allergens, and freshness warnings.", inputSchema: { type: "object", required: ["food_id"], properties: { food_id: { type: "string" } } } },
  { name: "calculate_nutrition", description: "Deterministically calculate nutrition from stable calculation-enabled records without treating unknown fields as zero.", inputSchema: { type: "object", required: ["items"], properties: { items: { type: "array", minItems: 1, maxItems: 50, items: { type: "object", required: ["food_id", "quantity", "unit"], properties: { food_id: { type: "string" }, quantity: { type: "number", exclusiveMinimum: 0 }, unit: { enum: ["g", "ml", "serving"] } } } } } } },
  { name: "compare_foods", description: "Compare 2-10 foods only when each has nutrition on the same requested basis.", inputSchema: { type: "object", required: ["food_ids", "basis"], properties: { food_ids: { type: "array", minItems: 2, maxItems: 10, items: { type: "string" } }, basis: { enum: ["per_serving", "per_100g", "per_100ml"] } } } },
  { name: "get_dataset_status", description: "Return dataset version, source commit, document counts, stale count, and deployment time.", inputSchema: { type: "object", properties: {} } },
  { name: "create_draft", description: "Authenticated write entrypoint that creates a draft branch and GitHub pull request for downstream validation and human review.", inputSchema: { type: "object", required: ["action", "food", "evidence"], properties: { action: { enum: ["create_food", "correct_food", "new_revision", "report_outdated", "deprecate_food"] }, food: { type: "object" }, serving: { type: "object" }, nutrition: { type: "array" }, ingredients: { type: "array" }, allergens: { type: "array" }, evidence: { type: "array", minItems: 1 }, submitter_note: { type: "string", maxLength: 2000 } } } },
];

async function handleMcp(request: Request, env: Env) {
  if (request.method === "GET") return json({ name: "TWFoodMCP", protocol: "MCP Streamable HTTP", endpoint: "/mcp" });
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);
  let rpc: any;
  try { rpc = await request.json(); } catch { return error(-32700, "Parse error"); }
  if (rpc.jsonrpc !== "2.0" || typeof rpc.method !== "string") return error(-32600, "Invalid Request", rpc.id);
  if (rpc.method === "initialize") return json({ jsonrpc: "2.0", id: rpc.id, result: { protocolVersion: "2025-06-18", capabilities: { tools: { listChanged: false } }, serverInfo: { name: "TWFoodMCP", version: "0.1.0" } } });
  if (rpc.method === "notifications/initialized") return new Response(null, { status: 202 });
  if (rpc.method === "ping") return json({ jsonrpc: "2.0", id: rpc.id, result: {} });
  if (rpc.method === "tools/list") return json({ jsonrpc: "2.0", id: rpc.id, result: { tools: toolDefinitions } });
  if (rpc.method === "tools/call") {
    try {
      const value = await callTool(rpc.params?.name, rpc.params?.arguments ?? {}, env, request);
      return json({ jsonrpc: "2.0", id: rpc.id, result: { content: [{ type: "text", text: JSON.stringify(value, null, 2) }], structuredContent: value } });
    } catch (e) {
      return json({ jsonrpc: "2.0", id: rpc.id, result: { isError: true, content: [{ type: "text", text: e instanceof Error ? e.message : "Unknown error" }] } });
    }
  }
  return error(-32601, "Method not found", rpc.id);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") return json({ status: "ok", service: "TWFoodMCP", time: new Date().toISOString() });
    if (url.pathname === "/dataset") {
      try { return json(await loadManifest(env)); } catch (e) { return json({ status: "unavailable", error: e instanceof Error ? e.message : "unknown" }, 503); }
    }
    if (url.pathname === "/mcp") return handleMcp(request, env);
    return json({ name: "TWFoodMCP", endpoints: { mcp: "/mcp", health: "/health", dataset: "/dataset" } });
  },
};
