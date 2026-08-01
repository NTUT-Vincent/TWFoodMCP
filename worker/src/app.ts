import worker from "./index";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function emptySearchResults(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value.result) || !isRecord(value.result.structuredContent)) return false;
  const results = value.result.structuredContent.results;
  return Array.isArray(results) && results.length === 0;
}

function withoutBrandFilter(rpc: Record<string, unknown>): Record<string, unknown> | null {
  if (rpc.method !== "tools/call" || !isRecord(rpc.params) || rpc.params.name !== "search_food") return null;
  if (!isRecord(rpc.params.arguments) || typeof rpc.params.arguments.brand !== "string" || !rpc.params.arguments.brand.trim()) return null;

  const argumentsWithoutBrand = { ...rpc.params.arguments };
  delete argumentsWithoutBrand.brand;

  return {
    ...rpc,
    params: {
      ...rpc.params,
      arguments: argumentsWithoutBrand,
    },
  };
}

export default {
  async fetch(request: Request, env: Parameters<typeof worker.fetch>[1]): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/mcp") return worker.fetch(request, env);

    let rpc: unknown;
    try {
      rpc = await request.clone().json();
    } catch {
      return worker.fetch(request, env);
    }
    if (!isRecord(rpc)) return worker.fetch(request, env);

    const retryRpc = withoutBrandFilter(rpc);
    if (!retryRpc) return worker.fetch(request, env);

    const firstResponse = await worker.fetch(request, env);
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
    return worker.fetch(retryRequest, env);
  },
};
