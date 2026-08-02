import { readFile, writeFile } from 'node:fs/promises';

function replaceOnce(source, pattern, replacement, label) {
  if (typeof pattern === 'string') {
    const first = source.indexOf(pattern);
    const last = source.lastIndexOf(pattern);
    if (first < 0 || first !== last) throw new Error(`${label}: expected exactly one string match`);
    return source.slice(0, first) + replacement + source.slice(first + pattern.length);
  }
  const matches = source.match(pattern);
  if (!matches) throw new Error(`${label}: pattern not found`);
  return source.replace(pattern, replacement);
}

const indexPath = 'worker/src/index.ts';
let index = await readFile(indexPath, 'utf8');

index = replaceOnce(
  index,
  'type DatasetChannel = "stable" | "preview";\n',
  'type DatasetChannel = "stable" | "preview";\ntype DiscoveryStatus = "all" | "stable" | "draft";\n',
  'add DiscoveryStatus',
);

index = replaceOnce(
  index,
  `function datasetChannel(args: Record<string, unknown>): DatasetChannel {
  const value = args.dataset_channel ?? "stable";
  if (value !== "stable" && value !== "preview") throw new Error("dataset_channel must be stable or preview");
  return value;
}
`,
  `function datasetChannel(args: Record<string, unknown>): DatasetChannel {
  const value = args.dataset_channel ?? "stable";
  if (value !== "stable" && value !== "preview") throw new Error("dataset_channel must be stable or preview");
  return value;
}

function discoveryStatus(args: Record<string, unknown>): DiscoveryStatus {
  const explicit = args.status;
  if (explicit !== undefined) {
    if (explicit !== "all" && explicit !== "stable" && explicit !== "draft") {
      throw new Error("status must be all, stable, or draft");
    }
    return explicit;
  }

  const legacyChannel = args.dataset_channel;
  if (legacyChannel === undefined || legacyChannel === "preview") return "all";
  if (legacyChannel === "stable") return "stable";
  throw new Error("dataset_channel must be stable or preview");
}

function discoveryChannel(status: DiscoveryStatus): DatasetChannel {
  return status === "stable" ? "stable" : "preview";
}
`,
  'add discovery status helpers',
);

index = replaceOnce(
  index,
  /  if \(name === "search_food" \|\| name === "get_food"\) \{[\s\S]*?\n  \}\n\n  const \{ manifest, foods \} = await loadFoods\(env, "stable"\);/,
  `  if (name === "search_food" || name === "get_food") {
    const status = discoveryStatus(args);
    const channel = discoveryChannel(status);
    const { manifest, foods } = await loadFoods(env, channel);
    const readable = (food: RuntimeFood) =>
      food.status !== "deprecated" && (status === "all" || food.status === status);

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
          data_quality: food.quality.data_quality,
          confidence: food.quality.confidence,
          calculation_allowed: food.quality.calculation_allowed,
          last_verified: food.last_verified,
          stale: food.stale,
          dataset_channel: channel,
          dataset_version: manifest.dataset_version,
        }));
      const includesDraft = results.some((result) => result.status === "draft");
      return {
        results,
        status_filter: status,
        dataset_channel: channel,
        dataset_version: manifest.dataset_version,
        ...(includesDraft
          ? { warning: "Results include unreviewed draft records. Inspect status, trust_tier, data_quality, confidence, calculation_allowed, and sources before use." }
          : {}),
      };
    }

    const food = foods.find((candidate) => candidate.id === args.food_id && readable(candidate));
    if (!food) throw new Error(`food was not found for status filter ${status}`);
    return {
      ...food,
      freshness_warnings: [
        ...(food.stale ? ["資料可能已過期；若涉及過敏原，請核對最新實體包裝或品牌資訊。"] : []),
        ...(food.status === "draft" ? ["此為未經真人審核的 draft，不代表 stable publication。請依來源、品質與信任欄位自行判斷。"] : []),
      ],
      status_filter: status,
      dataset_channel: channel,
      dataset_version: manifest.dataset_version,
    };
  }

  const { manifest, foods } = await loadFoods(env, "stable");`,
  'replace search/get discovery behavior',
);

index = replaceOnce(
  index,
  /const channelProperty = \{ enum: \["stable", "preview"\] \};\nconst toolDefinitions = \[[\s\S]*?\n\];\n\nasync function handleMcp/,
  `const channelProperty = {
  enum: ["stable", "preview"],
  description: "Dataset publication channel. Stable is reviewed publication; preview also contains drafts.",
};
const statusProperty = {
  enum: ["all", "stable", "draft"],
  default: "all",
  description: "Discovery filter. all searches stable and draft records; stable or draft restricts results to that status.",
};
const toolDefinitions = [
  { name: "search_food", description: "Search all discoverable Taiwan food records by default, including clearly labeled drafts. Use status to restrict results.", inputSchema: { type: "object", additionalProperties: false, required: ["query"], properties: { query: { type: "string", minLength: 1, maxLength: 100 }, brand: { type: "string" }, kind: { enum: ["packaged_food", "menu_item", "generic_food"] }, limit: { type: "integer", minimum: 1, maximum: 25 }, status: statusProperty } } },
  { name: "get_food", description: "Get one complete food document regardless of draft or stable status by default. Drafts include explicit trust and warning fields.", inputSchema: { type: "object", additionalProperties: false, required: ["food_id"], properties: { food_id: { type: "string" }, status: statusProperty } } },
  { name: "calculate_nutrition", description: "Deterministically calculate nutrition from stable calculation-enabled records without treating unknown fields as zero.", inputSchema: { type: "object", additionalProperties: false, required: ["items"], properties: { items: { type: "array", minItems: 1, maxItems: 50, items: { type: "object", additionalProperties: false, required: ["food_id", "quantity", "unit"], properties: { food_id: { type: "string" }, quantity: { type: "number", exclusiveMinimum: 0 }, unit: { enum: ["g", "ml", "serving"] } } } } } } },
  { name: "compare_foods", description: "Compare 2-10 stable foods only when each has nutrition on the same requested or evidence-convertible basis.", inputSchema: { type: "object", additionalProperties: false, required: ["food_ids", "basis"], properties: { food_ids: { type: "array", minItems: 2, maxItems: 10, items: { type: "string" } }, basis: { enum: ["per_serving", "per_100g", "per_100ml"] } } } },
  { name: "get_dataset_status", description: "Return stable or preview dataset version, source commit, document counts, stale count, and deployment time.", inputSchema: { type: "object", additionalProperties: false, properties: { dataset_channel: channelProperty } } },
  { name: "create_draft", description: "Authenticated write entrypoint that validates and checks a draft before creating a GitHub branch and pull request for human review.", inputSchema: { type: "object", required: ["action", "food", "evidence"], properties: { action: { enum: ["create_food", "correct_food", "new_revision", "report_outdated", "deprecate_food"] }, food: { type: "object" }, serving: { type: "object" }, nutrition: { type: "array" }, ingredients: { type: "array" }, allergens: { type: "array" }, evidence: { type: "array", minItems: 1 }, submitter_note: { type: "string", maxLength: 2000 } } } },
];

async function handleMcp`,
  'replace MCP tool schemas',
);

index = replaceOnce(index, 'serverInfo: { name: "TWFoodMCP", version: "0.1.0" },', 'serverInfo: { name: "TWFoodMCP", version: "0.2.0" },', 'bump MCP server version');
await writeFile(indexPath, index, 'utf8');

const packagePath = 'package.json';
let packageJson = await readFile(packagePath, 'utf8');
packageJson = replaceOnce(packageJson, '"version": "0.1.0"', '"version": "0.2.0"', 'bump package version');
await writeFile(packagePath, packageJson, 'utf8');

const workflowPath = '.github/workflows/publish-dataset.yml';
let workflow = await readFile(workflowPath, 'utf8');
workflow = replaceOnce(
  workflow,
  '"query":"大麥克","brand":"McDonald\\u0027s","dataset_channel":"preview","limit":10',
  '"query":"大麥克","brand":"McDonald\\u0027s","limit":10',
  'verify default all-status search',
);
workflow = replaceOnce(
  workflow,
  'if (content?.dataset_channel !== "preview" || content?.dataset_version !== process.env.EXPECTED_VERSION) throw new Error("preview search returned the wrong dataset");',
  'if (content?.status_filter !== "all" || content?.dataset_channel !== "preview" || content?.dataset_version !== process.env.EXPECTED_VERSION) throw new Error("default discovery search returned the wrong dataset or status filter");',
  'verify default discovery metadata',
);
await writeFile(workflowPath, workflow, 'utf8');

console.log('Applied default all-status discovery patch.');
