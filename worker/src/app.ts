import worker from "./index.js";

interface AppEnv {
  DB?: D1Database;
  DATASET?: KVNamespace;
  GITHUB_TOKEN?: string;
  DRAFT_API_TOKEN?: string;
  GITHUB_REPOSITORY: string;
  GITHUB_DEFAULT_BRANCH: string;
}

interface DatasetMetaRow {
  dataset_version: string;
  source_commit: string;
  generated_at: string;
  stable_documents: number;
  preview_documents: number;
  draft_documents: number;
  stable_stale_documents: number;
  preview_stale_documents: number;
}

interface FoodRow {
  document_json: string;
}

type DatasetChannel = "stable" | "preview";
type CoreEnv = Parameters<typeof worker.fetch>[1];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalize = (value: string) =>
  value.normalize("NFKC").toLocaleLowerCase("zh-TW").replace(/[\s\p{P}\p{S}]+/gu, "");

const BRAND_ALIASES = new Map<string, string>([
  ["全家", "全家便利商店 Fami!ce"],
  ["全家便利商店", "全家便利商店 Fami!ce"],
  ["familymart", "全家便利商店 Fami!ce"],
  ["fami", "全家便利商店 Fami!ce"],
  ["famice", "全家便利商店 Fami!ce"],
  ["mcdonalds", "麥當勞"],
  ["台灣麥當勞", "麥當勞"],
  ["麥當勞餐廳", "麥當勞"],
]);

class D1DatasetAdapter {
  constructor(
    private readonly db: D1Database,
    private readonly includeDocuments: boolean,
  ) {}

  private async currentMeta(version?: string): Promise<DatasetMetaRow | null> {
    const statement = version
      ? this.db.prepare(`
          SELECT dataset_version, source_commit, generated_at,
                 stable_documents, preview_documents, draft_documents,
                 stable_stale_documents, preview_stale_documents
          FROM dataset_meta
          WHERE singleton = 1 AND dataset_version = ?1
          LIMIT 1
        `).bind(version)
      : this.db.prepare(`
          SELECT dataset_version, source_commit, generated_at,
                 stable_documents, preview_documents, draft_documents,
                 stable_stale_documents, preview_stale_documents
          FROM dataset_meta
          WHERE singleton = 1
          LIMIT 1
        `);
    return statement.first<DatasetMetaRow>();
  }

  private async manifest(channel: DatasetChannel, version: string) {
    const meta = await this.currentMeta(version);
    if (!meta) return null;

    let documents: unknown[] | undefined;
    if (this.includeDocuments) {
      const statement = channel === "preview"
        ? this.db.prepare(`
            SELECT document_json
            FROM foods
            WHERE dataset_version = ?1 AND status IN ('stable', 'draft')
            ORDER BY id
          `).bind(version)
        : this.db.prepare(`
            SELECT document_json
            FROM foods
            WHERE dataset_version = ?1 AND status = 'stable'
            ORDER BY id
          `).bind(version);
      const rows = await statement.all<FoodRow>();
      documents = rows.results.map(({ document_json }) => JSON.parse(document_json));
    }

    return {
      dataset_version: meta.dataset_version,
      source_commit: meta.source_commit,
      stable_documents: meta.stable_documents,
      ...(channel === "preview"
        ? {
            preview_documents: meta.preview_documents,
            draft_documents: meta.draft_documents,
          }
        : {}),
      stale_documents: channel === "preview"
        ? meta.preview_stale_documents
        : meta.stable_stale_documents,
      last_deployment: meta.generated_at,
      ...(documents ? { documents } : {}),
    };
  }

  async get<T = unknown>(key: string, type?: "text" | "json"): Promise<T | string | null> {
    if (key === "dataset:current" || key === "dataset:preview") {
      const meta = await this.currentMeta();
      return (meta?.dataset_version ?? null) as T | string | null;
    }

    const previewMatch = key.match(/^preview-manifest:(.+)$/u);
    const stableMatch = key.match(/^manifest:(.+)$/u);
    const match = previewMatch ?? stableMatch;
    if (!match) return null;

    const value = await this.manifest(previewMatch ? "preview" : "stable", match[1]);
    if (!value) return null;
    return (type === "json" ? value : JSON.stringify(value)) as T | string;
  }

  async list(): Promise<{ keys: []; list_complete: true }> {
    return { keys: [], list_complete: true };
  }
}

function needsDocuments(rpc: unknown): boolean {
  if (!isRecord(rpc) || rpc.method !== "tools/call" || !isRecord(rpc.params)) return false;
  return rpc.params.name !== "get_dataset_status";
}

function coreEnv(env: AppEnv, includeDocuments: boolean): CoreEnv {
  if (env.DATASET || !env.DB) return env as unknown as CoreEnv;
  return {
    ...env,
    DATASET: new D1DatasetAdapter(env.DB, includeDocuments),
  } as unknown as CoreEnv;
}

function emptySearchResults(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value.result) || !isRecord(value.result.structuredContent)) return false;
  const results = value.result.structuredContent.results;
  return Array.isArray(results) && results.length === 0;
}

function withCanonicalBrand(rpc: Record<string, unknown>): Record<string, unknown> | null {
  if (rpc.method !== "tools/call" || !isRecord(rpc.params) || rpc.params.name !== "search_food") return null;
  if (!isRecord(rpc.params.arguments) || typeof rpc.params.arguments.brand !== "string" || !rpc.params.arguments.brand.trim()) return null;

  const requestedBrand = normalize(rpc.params.arguments.brand);
  const canonicalBrand = BRAND_ALIASES.get(requestedBrand);
  if (!canonicalBrand || normalize(canonicalBrand) === requestedBrand) return null;

  return {
    ...rpc,
    params: {
      ...rpc.params,
      arguments: {
        ...rpc.params.arguments,
        brand: canonicalBrand,
      },
    },
  };
}

export default {
  async fetch(request: Request, env: AppEnv): Promise<Response> {
    const url = new URL(request.url);
    let rpc: unknown;
    if (request.method === "POST" && url.pathname === "/mcp") {
      try {
        rpc = await request.clone().json();
      } catch {
        rpc = undefined;
      }
    }

    const adaptedEnv = coreEnv(env, needsDocuments(rpc));
    if (request.method !== "POST" || url.pathname !== "/mcp" || !isRecord(rpc)) {
      return worker.fetch(request, adaptedEnv);
    }

    const retryRpc = withCanonicalBrand(rpc);
    if (!retryRpc) return worker.fetch(request, adaptedEnv);

    const firstResponse = await worker.fetch(request, adaptedEnv);
    let firstBody: unknown;
    try {
      firstBody = await firstResponse.clone().json();
    } catch {
      return firstResponse;
    }
    if (!emptySearchResults(firstBody)) return firstResponse;

    const retryRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(retryRpc),
    });
    return worker.fetch(retryRequest, adaptedEnv);
  },
};
