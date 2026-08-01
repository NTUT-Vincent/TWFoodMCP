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
type DraftAction = "create_food" | "correct_food" | "new_revision" | "report_outdated" | "deprecate_food";
type DatasetChannel = "stable" | "preview";

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
  status: "draft" | "stable" | "deprecated";
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
  draft_documents?: number;
  preview_documents?: number;
  stale_documents: number;
  last_deployment: string;
  documents?: RuntimeFood[];
}

interface ResolvedNutrition {
  target_basis: NutritionBasis;
  source_basis: NutritionBasis;
  values: NutritionValues;
  conversion: string;
}

const JSON_HEADERS: HeadersInit = {
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
};

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });

const rpcError = (code: number, message: string, id: unknown = null) =>
  json({ jsonrpc: "2.0", id, error: { code, message } });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalize = (value: string) =>
  value.normalize("NFKC").toLocaleLowerCase("zh-TW").replace(/[\s\p{P}\p{S}]+/gu, "");

function queryTerms(value: string): string[] {
  const whitespace = value.split(/\s+/u).map(normalize).filter(Boolean);
  if (whitespace.length > 1) return [...new Set(whitespace)];
  const segmenter = new Intl.Segmenter("zh-TW", { granularity: "word" });
  const segmented = [...segmenter.segment(value)]
    .filter((part) => part.isWordLike)
    .map((part) => normalize(part.segment))
    .filter(Boolean);
  return [...new Set(segmented.length > 0 ? segmented : whitespace)];
}

function publicManifest(manifest: DatasetManifest, channel: DatasetChannel) {
  return {
    dataset_channel: channel,
    dataset_version: manifest.dataset_version,
    source_commit: manifest.source_commit,
    stable_documents: manifest.stable_documents,
    ...(typeof manifest.draft_documents === "number" ? { draft_documents: manifest.draft_documents } : {}),
    ...(typeof manifest.preview_documents === "number" ? { preview_documents: manifest.preview_documents } : {}),
    stale_documents: manifest.stale_documents,
    last_deployment: manifest.last_deployment,
    ...(channel === "preview" ? { warning: "Preview includes unreviewed draft records and must not be treated as stable publication." } : {}),
  };
}

function datasetChannel(args: Record<string, unknown>): DatasetChannel {
  const value = args.dataset_channel ?? "stable";
  if (value !== "stable" && value !== "preview") throw new Error("dataset_channel must be stable or preview");
  return value;
}

async function loadManifest(env: Env, channel: DatasetChannel = "stable"): Promise<DatasetManifest> {
  if (!env.DATASET) {
    return {
      dataset_version: "unconfigured",
      source_commit: "unknown",
      stable_documents: 0,
      ...(channel === "preview" ? { draft_documents: 0, preview_documents: 0 } : {}),
      stale_documents: 0,
      last_deployment: "unknown",
      documents: [],
    };
  }
  const pointer = channel === "preview" ? "dataset:preview" : "dataset:current";
  const version = await env.DATASET.get(pointer);
  if (!version) throw new Error(`${pointer} is not configured`);
  const manifestKey = channel === "preview" ? `preview-manifest:${version}` : `manifest:${version}`;
  const manifest = await env.DATASET.get<DatasetManifest>(manifestKey, "json");
  if (!manifest) throw new Error(`${manifestKey} was not found`);
  return manifest;
}

async function loadFoods(env: Env, channel: DatasetChannel = "stable"): Promise<{ manifest: DatasetManifest; foods: RuntimeFood[] }> {
  const manifest = await loadManifest(env, channel);
  if (manifest.documents) return { manifest, foods: manifest.documents };
  if (!env.DATASET) return { manifest, foods: [] };

  const prefix = channel === "preview" ? `preview-doc:${manifest.dataset_version}:` : `doc:${manifest.dataset_version}:`;
  const foods: RuntimeFood[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.DATASET.list({ prefix, cursor });
    const pageFoods = await Promise.all(page.keys.map((key) => env.DATASET!.get<RuntimeFood>(key.name, "json")));
    foods.push(...pageFoods.filter((food): food is RuntimeFood => Boolean(food)));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return { manifest, foods };
}

function scoreFood(food: RuntimeFood, query: string, brand?: string): number {
  const q = normalize(query);
  const terms = queryTerms(query);
  const id = normalize(food.id);
  const barcode = normalize(food.barcode ?? "");
  const title = normalize(food.title);
  const foodBrand = normalize(food.brand ?? "");
  let score = 0;

  if (q && (q === barcode || q === id)) score = 100;
  else if (q && q === title) score = 50;
  else {
    if (terms.length === 0) return 0;
    for (const term of terms) {
      let termScore = 0;
      if (food.aliases.some((value) => normalize(value).includes(term))) termScore = Math.max(termScore, 12);
      if (title.includes(term)) termScore = Math.max(termScore, 8);
      if (foodBrand.includes(term)) termScore = Math.max(termScore, 7);
      if (food.tags.some((value) => normalize(value).includes(term))) termScore = Math.max(termScore, 5);
      if ([...food.ingredients, ...food.allergens.map((value) => value.allergen)].some((value) => normalize(value).includes(term))) {
        termScore = Math.max(termScore, 2);
      }
      if (termScore === 0) return 0;
      score += termScore;
    }
    if (brand && normalize(brand) === foodBrand && terms.every((term) => title.includes(term))) score = Math.max(score, 40);
  }

  if (food.trust_tier === "human-reviewed") score *= 1.2;
  else if (food.trust_tier === "machine-confirmed") score *= 1.05;
  if (food.stale) score *= 0.7;
  return Math.round(score * 1000) / 1000;
}

function scale(values: NutritionValues, factor: number): NutritionValues {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Math.round((value as number) * factor * 1000) / 1000]),
  );
}

function addNutrition(total: NutritionValues, values: NutritionValues) {
  const keys = new Set([...Object.keys(total), ...Object.keys(values)]);
  for (const key of keys) {
    const a = total[key as keyof NutritionValues];
    const b = values[key as keyof NutritionValues];
    total[key as keyof NutritionValues] = a === undefined || b === undefined ? undefined : Math.round((a + b) * 1000) / 1000;
  }
}

function resolveNutrition(food: RuntimeFood, targetBasis: NutritionBasis): ResolvedNutrition | undefined {
  const exact = food.nutrition.find((record) => record.basis === targetBasis);
  if (exact) {
    return { target_basis: targetBasis, source_basis: exact.basis, values: exact.values, conversion: "none" };
  }

  const serving = food.serving;
  if (!serving || !Number.isFinite(serving.amount) || serving.amount <= 0) return undefined;

  if (targetBasis === "per_serving" && serving.unit === "g") {
    const source = food.nutrition.find((record) => record.basis === "per_100g");
    if (source) return { target_basis: targetBasis, source_basis: source.basis, values: scale(source.values, serving.amount / 100), conversion: `${serving.amount}g serving from per_100g` };
  }
  if (targetBasis === "per_serving" && serving.unit === "ml") {
    const source = food.nutrition.find((record) => record.basis === "per_100ml");
    if (source) return { target_basis: targetBasis, source_basis: source.basis, values: scale(source.values, serving.amount / 100), conversion: `${serving.amount}ml serving from per_100ml` };
  }
  if (targetBasis === "per_100g" && serving.unit === "g") {
    const source = food.nutrition.find((record) => record.basis === "per_serving");
    if (source) return { target_basis: targetBasis, source_basis: source.basis, values: scale(source.values, 100 / serving.amount), conversion: `per_100g from ${serving.amount}g serving` };
  }
  if (targetBasis === "per_100ml" && serving.unit === "ml") {
    const source = food.nutrition.find((record) => record.basis === "per_serving");
    if (source) return { target_basis: targetBasis, source_basis: source.basis, values: scale(source.values, 100 / serving.amount), conversion: `per_100ml from ${serving.amount}ml serving` };
  }
  return undefined;
}

function privateHostname(hostname: string): boolean {
  const value = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (value === "localhost" || value.endsWith(".localhost") || value.endsWith(".local")) return true;
  if (/^(127|10)\./.test(value) || /^192\.168\./.test(value) || /^169\.254\./.test(value)) return true;
  const match = value.match(/^172\.(\d{1,3})\./);
  if (match && Number(match[1]) >= 16 && Number(match[1]) <= 31) return true;
  return value === "::1" || (value.includes(":") && (value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe80:")));
}

function validateDraftSafety(value: unknown, path = "input") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateDraftSafety(item, `${path}[${index}]`));
    return;
  }
  if (!isRecord(value)) {
    if (typeof value !== "string") return;
    if (/<\s*(script|iframe|object|embed|svg|style|link|meta)\b|javascript:|data:text\/html|on\w+\s*=/iu.test(value)) {
      throw new Error(`unsafe executable content at ${path}`);
    }
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      if (url.protocol !== "https:" || privateHostname(url.hostname)) throw new Error(`unsafe source URL at ${path}`);
    }
    return;
  }

  const sensitiveKey = /(weight|height|disease|diagnosis|medication|medicine|address|phone|national.?id|precise.?location|體重|身高|疾病|診斷|用藥|地址|電話|身分證|精確位置)/iu;
  for (const [key, child] of Object.entries(value)) {
    if (sensitiveKey.test(key)) throw new Error(`private health or identity field is not accepted: ${path}.${key}`);
    if (key.toLowerCase() === "status" && child === "stable") throw new Error("draft input cannot declare stable status");
    if ((key === "verified" || key === "verification") && JSON.stringify(child).includes("human:")) {
      throw new Error("draft input cannot assign human verification");
    }
    validateDraftSafety(child, `${path}.${key}`);
  }
}

function validateNutritionInput(value: unknown) {
  if (value === undefined) return;
  if (!Array.isArray(value)) throw new Error("nutrition must be an array");
  for (const record of value) {
    if (!isRecord(record) || !["per_serving", "per_100g", "per_100ml"].includes(String(record.basis))) {
      throw new Error("nutrition basis is invalid");
    }
    if (!isRecord(record.values)) throw new Error("nutrition values must be an object");
    for (const amount of Object.values(record.values)) {
      if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) throw new Error("nutrition values must be finite and non-negative");
    }
  }
}

function validateDraftInput(args: Record<string, unknown>): DraftAction {
  const actions: DraftAction[] = ["create_food", "correct_food", "new_revision", "report_outdated", "deprecate_food"];
  const action = String(args.action ?? "") as DraftAction;
  if (!actions.includes(action)) throw new Error("unsupported draft action");
  if (!isRecord(args.food)) throw new Error("food is required");
  if (![args.food.id, args.food.barcode, args.food.name].some((value) => typeof value === "string" && value.trim())) {
    throw new Error("food must include at least one of id, barcode, or name");
  }
  if (args.food.market !== undefined && args.food.market !== "TW") throw new Error("food.market must be TW");
  if (args.food.barcode !== undefined && !/^(?:\d{8}|\d{12,14})$/.test(String(args.food.barcode))) throw new Error("barcode must contain 8, 12, 13, or 14 digits");
  if (!Array.isArray(args.evidence) || args.evidence.length === 0) throw new Error("evidence must contain at least one entry");
  if (args.submitter_note !== undefined && (typeof args.submitter_note !== "string" || args.submitter_note.length > 2000)) {
    throw new Error("submitter_note must be a string of at most 2000 characters");
  }
  if (args.serving !== undefined) {
    if (!isRecord(args.serving) || typeof args.serving.amount !== "number" || !Number.isFinite(args.serving.amount) || args.serving.amount <= 0) {
      throw new Error("serving amount must be positive");
    }
    if (!["g", "ml", "piece", "package", "serving"].includes(String(args.serving.unit))) throw new Error("serving unit is invalid");
  }
  validateNutritionInput(args.nutrition);
  const raw = JSON.stringify(args);
  if (raw.length > 100_000) throw new Error("submission is oversized");
  validateDraftSafety(args);
  return action;
}

function duplicateCandidates(foodInput: Record<string, unknown>, foods: RuntimeFood[]) {
  const id = normalize(String(foodInput.id ?? ""));
  const barcode = normalize(String(foodInput.barcode ?? ""));
  const brand = normalize(String(foodInput.brand ?? ""));
  const name = normalize(String(foodInput.name ?? ""));
  const variant = normalize(String(foodInput.variant ?? ""));

  return foods
    .filter((food) => food.status === "stable")
    .map((food) => {
      const reasons: string[] = [];
      if (id && id === normalize(food.id)) reasons.push("food_id");
      if (barcode && barcode === normalize(food.barcode ?? "")) reasons.push("barcode");
      if (brand && name && brand === normalize(food.brand ?? "") && name === normalize(food.name)) {
        reasons.push(variant && variant === normalize(food.variant ?? "") ? "brand_name_variant" : "brand_name");
      }
      return reasons.length ? { food_id: food.id, title: food.title, reasons } : null;
    })
    .filter((candidate): candidate is { food_id: string; title: string; reasons: string[] } => Boolean(candidate))
    .slice(0, 10);
}

function comparisonWithStable(args: Record<string, unknown>, candidate: RuntimeFood | undefined) {
  if (!candidate) return [];
  const proposedFood = isRecord(args.food) ? args.food : {};
  const pairs: Array<[string, unknown, unknown]> = [
    ["food.id", candidate.id, proposedFood.id],
    ["food.brand", candidate.brand, proposedFood.brand],
    ["food.name", candidate.name, proposedFood.name],
    ["food.barcode", candidate.barcode, proposedFood.barcode],
    ["food.variant", candidate.variant, proposedFood.variant],
    ["serving", candidate.serving, args.serving],
    ["nutrition", candidate.nutrition, args.nutrition],
    ["ingredients", candidate.ingredients, args.ingredients],
    ["allergens", candidate.allergens, args.allergens],
    ["revision", candidate.revision, args.revision],
    ["quality", candidate.quality, args.quality],
  ];
  return pairs
    .filter(([, current, proposed]) => proposed !== undefined && JSON.stringify(current) !== JSON.stringify(proposed))
    .map(([path, current, proposed]) => ({ path, current, proposed }));
}

function utf8ToBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
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

async function createDraft(args: Record<string, unknown>, env: Env, request: Request) {
  const auth = request.headers.get("authorization");
  if (!env.DRAFT_API_TOKEN || auth !== `Bearer ${env.DRAFT_API_TOKEN}`) throw new Error("authentication required");
  if (!env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not configured");
  const action = validateDraftInput(args);
  const { manifest, foods } = await loadFoods(env);
  const candidates = duplicateCandidates(args.food as Record<string, unknown>, foods);
  const existing = candidates[0] ? foods.find((food) => food.id === candidates[0].food_id) : undefined;
  const comparison = comparisonWithStable(args, existing);
  const detectedAction: DraftAction = action === "create_food" && candidates.length > 0
    ? comparison.some((change) => ["serving", "nutrition", "ingredients", "allergens", "revision"].includes(change.path))
      ? "new_revision"
      : "correct_food"
    : action;
  const warnings = candidates.length > 0 ? ["Possible existing stable food detected; reviewer must confirm correction versus new revision."] : [];

  const draftId = `draft_${crypto.randomUUID()}`;
  const [owner, repo] = env.GITHUB_REPOSITORY.split("/");
  if (!owner || !repo) throw new Error("GITHUB_REPOSITORY must use owner/repository format");
  const branch = `draft/${draftId}`;
  const generatedAt = new Date().toISOString();
  const draft = {
    ...args,
    draft_id: draftId,
    status: "draft",
    requested_action: action,
    detected_action: detectedAction,
    generated_at: generatedAt,
    pipeline: {
      schema_validation: "passed-basic-runtime-validation",
      identity_resolution: candidates.length > 0 ? "candidate_found" : "no_candidate",
      normalization: "unicode_nfkc_for_matching",
      duplicate_detection: candidates,
      comparison_with_stable: comparison,
      source_and_risk_checks: "passed-basic-runtime-safety-checks",
      dataset_version: manifest.dataset_version,
    },
  };

  const baseRef = await gh(env, `/repos/${owner}/${repo}/git/ref/heads/${env.GITHUB_DEFAULT_BRANCH}`);
  await gh(env, `/repos/${owner}/${repo}/git/refs`, "POST", { ref: `refs/heads/${branch}`, sha: baseRef.object.sha });
  const path = `drafts/${draftId}.json`;
  await gh(env, `/repos/${owner}/${repo}/contents/${path}`, "PUT", {
    message: `draft: ${detectedAction} ${draftId}`,
    content: utf8ToBase64(JSON.stringify(draft, null, 2)),
    branch,
  });
  const candidateLines = candidates.length
    ? candidates.map((candidate) => `- \`${candidate.food_id}\`: ${candidate.reasons.join(", ")}`).join("\n")
    : "- None detected";
  const pr = await gh(env, `/repos/${owner}/${repo}/pulls`, "POST", {
    title: `[Draft] ${detectedAction}: ${draftId}`,
    head: branch,
    base: env.GITHUB_DEFAULT_BRANCH,
    body: `Automated draft submission.\n\n- Draft ID: \`${draftId}\`\n- Requested action: \`${action}\`\n- Detected action: \`${detectedAction}\`\n- Dataset version checked: \`${manifest.dataset_version}\`\n\n## Duplicate candidates\n${candidateLines}\n\n## Pipeline\nBasic schema, identity, normalization, duplicate, comparison, and risk checks completed. Human review is required before merge.`,
  });

  return {
    draft_id: draftId,
    status: "pull_request_opened",
    detected_action: detectedAction,
    duplicate_candidates: candidates,
    pull_request_url: pr.html_url,
    warnings,
    next_step: "human_review",
  };
}

async function callTool(name: string, args: Record<string, unknown>, env: Env, request: Request) {
  if (name === "get_dataset_status") {
    const channel = datasetChannel(args);
    return publicManifest(await loadManifest(env, channel), channel);
  }
  if (name === "create_draft") return createDraft(args, env, request);
  if (!["search_food", "get_food", "calculate_nutrition", "compare_foods"].includes(name)) throw new Error(`unknown tool: ${name}`);

  if (name === "search_food" || name === "get_food") {
    const channel = datasetChannel(args);
    const { manifest, foods } = await loadFoods(env, channel);
    const readable = (food: RuntimeFood) => channel === "preview" ? food.status === "stable" || food.status === "draft" : food.status === "stable";

    if (name === "search_food") {
      const query = String(args.query ?? "").trim();
      if (!query || query.length > 100) throw new Error("query must contain 1-100 characters");
      const parsedLimit = Number(args.limit ?? 10);
      if (!Number.isInteger(parsedLimit)) throw new Error("limit must be an integer");
      const limit = Math.min(Math.max(parsedLimit, 1), 25);
      const results = foods
        .filter(readable)
        .filter((food) => !args.kind || food.kind === args.kind)
        .filter((food) => !args.brand || normalize(food.brand ?? "") === normalize(String(args.brand)))
        .map((food) => ({ food, score: scoreFood(food, query, args.brand ? String(args.brand) : undefined) }))
        .filter((result) => result.score > 0)
        .sort((a, b) => b.score - a.score || a.food.id.localeCompare(b.food.id))
        .slice(0, limit)
        .map(({ food, score }) => ({
          food_id: food.id,
          title: food.title,
          brand: food.brand,
          kind: food.kind,
          status: food.status,
          barcode: food.barcode,
          score,
          trust_tier: food.trust_tier,
          last_verified: food.last_verified,
          stale: food.stale,
          dataset_channel: channel,
          dataset_version: manifest.dataset_version,
        }));
      return {
        results,
        dataset_channel: channel,
        dataset_version: manifest.dataset_version,
        ...(channel === "preview" ? { warning: "Preview results may include unreviewed draft records and are not stable publication." } : {}),
      };
    }

    const food = foods.find((candidate) => candidate.id === args.food_id && readable(candidate));
    if (!food) throw new Error(`food was not found in the ${channel} dataset`);
    return {
      ...food,
      freshness_warnings: [
        ...(food.stale ? ["資料可能已過期；若涉及過敏原，請核對最新實體包裝或品牌資訊。"] : []),
        ...(channel === "preview" && food.status === "draft" ? ["此為未經真人審核的 preview draft，不代表 stable publication。"] : []),
      ],
      dataset_channel: channel,
      dataset_version: manifest.dataset_version,
    };
  }

  const { manifest, foods } = await loadFoods(env, "stable");

  if (name === "calculate_nutrition") {
    if (!Array.isArray(args.items) || args.items.length === 0 || args.items.length > 50) throw new Error("items must contain 1-50 entries");
    const calculated: unknown[] = [];
    let total: NutritionValues | null = null;
    for (const raw of args.items as Array<Record<string, unknown>>) {
      const food = foods.find((candidate) => candidate.id === raw.food_id && candidate.status === "stable");
      if (!food || !food.quality.calculation_allowed) throw new Error(`food is unavailable for calculation: ${raw.food_id}`);
      const quantity = Number(raw.quantity);
      const unit = raw.unit as Unit;
      if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("quantity must be positive");
      if (!["g", "ml", "serving"].includes(unit)) throw new Error("unit must be g, ml, or serving");
      const targetBasis: NutritionBasis = unit === "serving" ? "per_serving" : unit === "g" ? "per_100g" : "per_100ml";
      const resolved = resolveNutrition(food, targetBasis);
      if (!resolved) throw new Error(`no supported ${unit} basis for ${food.id}; ml and g are never converted without evidence`);
      const factor = unit === "serving" ? quantity : quantity / 100;
      const values = scale(resolved.values, factor);
      if (total === null) total = { ...values };
      else addNutrition(total, values);
      calculated.push({
        food_id: food.id,
        quantity,
        unit,
        calculation_basis: resolved.target_basis,
        source_basis: resolved.source_basis,
        conversion: resolved.conversion,
        values,
        stale: food.stale,
      });
    }
    return {
      items: calculated,
      total: total ?? {},
      dataset_version: manifest.dataset_version,
      warning: "缺值保持 unknown，不補為 0；本結果不構成健康或醫療建議。",
    };
  }

  const ids = args.food_ids;
  const basis = args.basis as NutritionBasis;
  if (!Array.isArray(ids) || ids.length < 2 || ids.length > 10) throw new Error("food_ids must contain 2-10 entries");
  if (!["per_serving", "per_100g", "per_100ml"].includes(basis)) throw new Error("basis is required");
  const compared = ids.map((id) => {
    const food = foods.find((candidate) => candidate.id === id && candidate.status === "stable");
    if (!food) throw new Error(`food was not found: ${id}`);
    const nutrition = resolveNutrition(food, basis);
    if (!nutrition) throw new Error(`${food.id} cannot be converted to ${basis} from its available nutrition and serving evidence`);
    return {
      food_id: food.id,
      title: food.title,
      basis,
      source_basis: nutrition.source_basis,
      conversion: nutrition.conversion,
      values: nutrition.values,
      stale: food.stale,
      trust_tier: food.trust_tier,
    };
  });
  return {
    foods: compared,
    dataset_version: manifest.dataset_version,
    warning: "比較僅呈現同基準數值，不判定哪個食品更健康。",
  };
}

const channelProperty = { enum: ["stable", "preview"] };
const toolDefinitions = [
  { name: "search_food", description: "Search stable Taiwan food documents, or explicitly query the preview channel to inspect unreviewed drafts.", inputSchema: { type: "object", additionalProperties: false, required: ["query"], properties: { query: { type: "string", minLength: 1, maxLength: 100 }, brand: { type: "string" }, kind: { enum: ["packaged_food", "menu_item", "generic_food"] }, limit: { type: "integer", minimum: 1, maximum: 25 }, dataset_channel: channelProperty } } },
  { name: "get_food", description: "Get one food document from the stable dataset, or explicitly inspect a draft from the preview channel.", inputSchema: { type: "object", additionalProperties: false, required: ["food_id"], properties: { food_id: { type: "string" }, dataset_channel: channelProperty } } },
  { name: "calculate_nutrition", description: "Deterministically calculate nutrition from stable calculation-enabled records without treating unknown fields as zero.", inputSchema: { type: "object", additionalProperties: false, required: ["items"], properties: { items: { type: "array", minItems: 1, maxItems: 50, items: { type: "object", additionalProperties: false, required: ["food_id", "quantity", "unit"], properties: { food_id: { type: "string" }, quantity: { type: "number", exclusiveMinimum: 0 }, unit: { enum: ["g", "ml", "serving"] } } } } } } },
  { name: "compare_foods", description: "Compare 2-10 stable foods only when each has nutrition on the same requested or evidence-convertible basis.", inputSchema: { type: "object", additionalProperties: false, required: ["food_ids", "basis"], properties: { food_ids: { type: "array", minItems: 2, maxItems: 10, items: { type: "string" } }, basis: { enum: ["per_serving", "per_100g", "per_100ml"] } } } },
  { name: "get_dataset_status", description: "Return stable or preview dataset version, source commit, document counts, stale count, and deployment time.", inputSchema: { type: "object", additionalProperties: false, properties: { dataset_channel: channelProperty } } },
  { name: "create_draft", description: "Authenticated write entrypoint that validates and checks a draft before creating a GitHub branch and pull request for human review.", inputSchema: { type: "object", required: ["action", "food", "evidence"], properties: { action: { enum: ["create_food", "correct_food", "new_revision", "report_outdated", "deprecate_food"] }, food: { type: "object" }, serving: { type: "object" }, nutrition: { type: "array" }, ingredients: { type: "array" }, allergens: { type: "array" }, evidence: { type: "array", minItems: 1 }, submitter_note: { type: "string", maxLength: 2000 } } } },
];

async function handleMcp(request: Request, env: Env) {
  if (request.method === "GET") return json({ name: "TWFoodMCP", protocol: "MCP Streamable HTTP", endpoint: "/mcp" });
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405, { allow: "GET, POST" });

  let rpc: unknown;
  try {
    rpc = await request.json();
  } catch {
    return rpcError(-32700, "Parse error");
  }
  if (!isRecord(rpc) || rpc.jsonrpc !== "2.0" || typeof rpc.method !== "string") return rpcError(-32600, "Invalid Request", isRecord(rpc) ? rpc.id : null);

  if (rpc.method === "initialize") {
    return json({
      jsonrpc: "2.0",
      id: rpc.id,
      result: {
        protocolVersion: "2025-06-18",
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "TWFoodMCP", version: "0.1.0" },
      },
    });
  }
  if (rpc.method === "notifications/initialized") return new Response(null, { status: 202 });
  if (rpc.method === "ping") return json({ jsonrpc: "2.0", id: rpc.id, result: {} });
  if (rpc.method === "tools/list") return json({ jsonrpc: "2.0", id: rpc.id, result: { tools: toolDefinitions } });
  if (rpc.method === "tools/call") {
    if (!isRecord(rpc.params) || typeof rpc.params.name !== "string") return rpcError(-32602, "Invalid params", rpc.id);
    try {
      const value = await callTool(rpc.params.name, isRecord(rpc.params.arguments) ? rpc.params.arguments : {}, env, request);
      return json({
        jsonrpc: "2.0",
        id: rpc.id,
        result: {
          content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
          structuredContent: value,
        },
      });
    } catch (caught) {
      return json({
        jsonrpc: "2.0",
        id: rpc.id,
        result: {
          isError: true,
          content: [{ type: "text", text: caught instanceof Error ? caught.message : "Unknown error" }],
        },
      });
    }
  }
  return rpcError(-32601, "Method not found", rpc.id);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") return json({ status: "ok", service: "TWFoodMCP", time: new Date().toISOString() });
    if (url.pathname === "/dataset") {
      try {
        const channel = url.searchParams.get("channel") === "preview" ? "preview" : "stable";
        return json(publicManifest(await loadManifest(env, channel), channel));
      } catch (caught) {
        return json({ status: "unavailable", error: caught instanceof Error ? caught.message : "unknown" }, 503);
      }
    }
    if (url.pathname === "/mcp") return handleMcp(request, env);
    return json({ name: "TWFoodMCP", endpoints: { mcp: "/mcp", health: "/health", dataset: "/dataset" } });
  },
};
