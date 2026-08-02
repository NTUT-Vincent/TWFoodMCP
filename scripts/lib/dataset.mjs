import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const LIFECYCLE = new Set(["draft", "stable", "deprecated"]);
const RESERVED_MARKDOWN = new Set(["index.md", "log.md"]);
const ACTOR_PATTERN = /^(?:(?:human|process):[A-Za-z0-9][A-Za-z0-9._-]*|[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*)$/u;
const FOOD_KINDS = new Set(["packaged_food", "menu_item", "generic_food"]);
const UNITS = new Set(["g", "ml", "piece", "package", "serving"]);
const NUTRITION_BASES = new Set(["per_serving", "per_100g", "per_100ml"]);
const ALLERGEN_STATUSES = new Set(["contains", "may_contain", "not_declared", "unknown"]);
const CONFIDENCE = new Set(["high", "medium", "low"]);
const COMPLETENESS = new Set(["minimal", "partial", "nutrition_complete", "full_label"]);
const DATA_QUALITY = new Set([
  "official_label",
  "official_brand",
  "government_database",
  "verified_community_label",
  "third_party_database",
  "community_report",
  "estimated",
]);
const SOURCE_CLASSES = new Set([
  "primary_label",
  "primary_government",
  "primary_official",
  "verifiable_secondary",
  "expert_interpretation",
  "third_party_dataset",
  "community_submission",
  "estimated_or_untraceable",
]);

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asVerificationList(value) {
  if (Array.isArray(value)) return value;
  return isRecord(value) ? [value] : [];
}

function isActor(value) {
  return nonEmptyString(value) && ACTOR_PATTERN.test(value);
}

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeTimestamp(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  if (!nonEmptyString(value)) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function normalizeDate(value) {
  const date = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  if (!nonEmptyString(date) || !/^\d{4}-\d{2}-\d{2}$/u.test(date)) return undefined;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date ? undefined : date;
}

function dateInTaipei(value) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function extractFrontmatter(markdown, filePath = "document") {
  const normalized = markdown.replace(/^\uFEFF/, "");
  const match = normalized.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/u);
  if (!match) throw new Error(`${filePath}: missing YAML frontmatter`);
  const data = parse(match[1]);
  if (!isRecord(data)) throw new Error(`${filePath}: frontmatter must be an object`);
  return data;
}

export async function listMarkdownFiles(rootDir) {
  const files = [];
  async function walk(current) {
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch (error) {
      if (error?.code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const resolved = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(resolved);
      else if (entry.isFile() && entry.name.endsWith(".md") && !RESERVED_MARKDOWN.has(entry.name)) files.push(resolved);
    }
  }
  await walk(rootDir);
  return files;
}

export async function loadAuthorizedReviewers(filePath = "config/authorized-reviewers.json") {
  const raw = JSON.parse(await readFile(filePath, "utf8"));
  const reviewers = asArray(raw.reviewers).filter(nonEmptyString);
  if (reviewers.length === 0) throw new Error(`${filePath}: reviewers must contain at least one human:* actor`);
  for (const reviewer of reviewers) {
    if (!reviewer.startsWith("human:")) throw new Error(`${filePath}: invalid reviewer actor ${reviewer}`);
  }
  return new Set(reviewers);
}

function deriveTrustTier(verified) {
  const actors = asVerificationList(verified)
    .map((entry) => (isRecord(entry) ? entry.by : undefined))
    .filter(nonEmptyString);
  if (actors.some((actor) => actor.startsWith("human:"))) return "human-reviewed";
  if (actors.length > 0) return "machine-confirmed";
  return "unverified";
}

function latestVerification(verified) {
  const timestamps = asVerificationList(verified)
    .map((entry) => (isRecord(entry) ? normalizeTimestamp(entry.at) : undefined))
    .filter(Boolean)
    .sort();
  return timestamps.at(-1);
}

function validateNutrition(nutrition, filePath, errors) {
  if (nutrition === undefined) return;
  assert(Array.isArray(nutrition), `${filePath}: nutrition must be an array`, errors);
  if (!Array.isArray(nutrition)) return;
  for (const [index, record] of nutrition.entries()) {
    const prefix = `${filePath}: nutrition[${index}]`;
    assert(isRecord(record), `${prefix} must be an object`, errors);
    if (!isRecord(record)) continue;
    assert(NUTRITION_BASES.has(record.basis), `${prefix}.basis is invalid`, errors);
    assert(isRecord(record.values), `${prefix}.values must be an object`, errors);
    if (!isRecord(record.values)) continue;
    for (const [key, value] of Object.entries(record.values)) {
      assert(typeof value === "number" && Number.isFinite(value) && value >= 0, `${prefix}.values.${key} must be finite and non-negative`, errors);
    }
  }
}

function validateDocument(data, filePath, authorizedReviewers) {
  const errors = [];
  assert(nonEmptyString(data.type), `${filePath}: type is required`, errors);
  assert(nonEmptyString(data.title), `${filePath}: title is required`, errors);
  assert(LIFECYCLE.has(data.status), `${filePath}: explicit status draft|stable|deprecated is required`, errors);
  assert(data.trust_tier === undefined, `${filePath}: trust_tier is derived and must not be authored`, errors);
  assert(isRecord(data.generated) && isActor(data.generated.by) && normalizeTimestamp(data.generated.at), `${filePath}: generated.by must follow the OKF actor convention and generated.at must be an ISO 8601 timestamp`, errors);
  assert(Array.isArray(data.sources) && data.sources.length > 0, `${filePath}: at least one source is required`, errors);

  for (const [index, source] of asArray(data.sources).entries()) {
    const prefix = `${filePath}: sources[${index}]`;
    assert(isRecord(source), `${prefix} must be an object`, errors);
    if (!isRecord(source)) continue;
    assert(nonEmptyString(source.id), `${prefix}.id is required`, errors);
    assert(nonEmptyString(source.resource), `${prefix}.resource is required`, errors);
    assert(SOURCE_CLASSES.has(source.source_class), `${prefix}.source_class is invalid`, errors);
    if (source.author !== undefined) assert(isActor(source.author), `${prefix}.author must follow the OKF actor convention`, errors);
  }

  assert(isRecord(data.food), `${filePath}: food is required`, errors);
  if (isRecord(data.food)) {
    assert(nonEmptyString(data.food.id), `${filePath}: food.id is required`, errors);
    assert(FOOD_KINDS.has(data.food.kind), `${filePath}: food.kind is invalid`, errors);
    assert(data.food.market === "TW", `${filePath}: food.market must be TW`, errors);
    assert(nonEmptyString(data.food.name), `${filePath}: food.name is required`, errors);
    if (data.food.barcode !== undefined) {
      assert(/^(?:\d{8}|\d{12,14})$/u.test(String(data.food.barcode)), `${filePath}: food.barcode must contain 8, 12, 13, or 14 digits`, errors);
    }
  }

  if (data.serving !== undefined) {
    assert(isRecord(data.serving), `${filePath}: serving must be an object`, errors);
    if (isRecord(data.serving)) {
      assert(typeof data.serving.amount === "number" && Number.isFinite(data.serving.amount) && data.serving.amount > 0, `${filePath}: serving.amount must be positive`, errors);
      assert(UNITS.has(data.serving.unit), `${filePath}: serving.unit is invalid`, errors);
      assert(nonEmptyString(data.serving.description), `${filePath}: serving.description is required`, errors);
    }
  }

  validateNutrition(data.nutrition, filePath, errors);

  if (data.allergens !== undefined) {
    assert(isRecord(data.allergens), `${filePath}: allergens must be an object`, errors);
    for (const [index, declaration] of asArray(data.allergens?.declarations).entries()) {
      const prefix = `${filePath}: allergens.declarations[${index}]`;
      assert(isRecord(declaration), `${prefix} must be an object`, errors);
      if (!isRecord(declaration)) continue;
      assert(nonEmptyString(declaration.allergen), `${prefix}.allergen is required`, errors);
      assert(ALLERGEN_STATUSES.has(declaration.status), `${prefix}.status is invalid`, errors);
    }
  }

  assert(isRecord(data.quality), `${filePath}: quality is required`, errors);
  if (isRecord(data.quality)) {
    assert(DATA_QUALITY.has(data.quality.data_quality), `${filePath}: quality.data_quality is invalid`, errors);
    assert(COMPLETENESS.has(data.quality.completeness), `${filePath}: quality.completeness is invalid`, errors);
    assert(CONFIDENCE.has(data.quality.confidence), `${filePath}: quality.confidence is invalid`, errors);
    assert(typeof data.quality.calculation_allowed === "boolean", `${filePath}: quality.calculation_allowed must be boolean`, errors);
  }

  if (data.stale_after !== undefined) {
    assert(Boolean(normalizeDate(data.stale_after)), `${filePath}: stale_after must be an absolute YYYY-MM-DD date`, errors);
  }

  const verified = asVerificationList(data.verified);
  for (const [index, verification] of verified.entries()) {
    const prefix = `${filePath}: verified[${index}]`;
    assert(isRecord(verification), `${prefix} must be an object`, errors);
    if (!isRecord(verification)) continue;
    assert(isActor(verification.by), `${prefix}.by must follow the OKF actor convention`, errors);
    assert(Boolean(normalizeTimestamp(verification.at)), `${prefix}.at must be a valid timestamp`, errors);
    if (nonEmptyString(verification.by) && verification.by.startsWith("human:")) {
      assert(authorizedReviewers.has(verification.by), `${prefix}.by is not an authorized reviewer`, errors);
    }
  }

  if (data.status === "stable") {
    assert(deriveTrustTier(verified) === "human-reviewed", `${filePath}: stable records require an authorized human review`, errors);
    assert(isRecord(data.access) && data.access.classification === "public", `${filePath}: stable public records require access.classification: public`, errors);
  }

  if (errors.length > 0) throw new Error(errors.join("\n"));
}

export async function loadOkfDocuments({
  knowledgeRoot = "knowledge",
  reviewersPath = "config/authorized-reviewers.json",
} = {}) {
  const authorizedReviewers = await loadAuthorizedReviewers(reviewersPath);
  const files = await listMarkdownFiles(knowledgeRoot);
  const documents = [];
  const errors = [];
  const ids = new Map();

  for (const filePath of files) {
    try {
      const markdown = await readFile(filePath, "utf8");
      const data = extractFrontmatter(markdown, filePath);
      validateDocument(data, filePath, authorizedReviewers);
      const id = data.food.id;
      if (ids.has(id)) throw new Error(`${filePath}: duplicate food.id ${id}; first declared in ${ids.get(id)}`);
      ids.set(id, filePath);
      documents.push({ filePath, data });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (errors.length > 0) throw new Error(`OKF validation failed:\n${errors.join("\n")}`);
  return documents.sort((a, b) => a.data.food.id.localeCompare(b.data.food.id));
}

export function toRuntimeFood(data, now = new Date()) {
  const staleAfter = normalizeDate(data.stale_after);
  const stale = Boolean(staleAfter && dateInTaipei(now) >= staleAfter);
  const verified = asVerificationList(data.verified);
  return {
    id: data.food.id,
    title: data.title,
    status: data.status,
    kind: data.food.kind,
    ...(nonEmptyString(data.food.brand) ? { brand: data.food.brand } : {}),
    name: data.food.name,
    ...(nonEmptyString(data.food.barcode) ? { barcode: String(data.food.barcode) } : {}),
    ...(nonEmptyString(data.food.variant) ? { variant: data.food.variant } : {}),
    aliases: asArray(data.food.aliases).filter(nonEmptyString),
    tags: asArray(data.tags).filter(nonEmptyString),
    ...(isRecord(data.serving) ? { serving: data.serving } : {}),
    nutrition: asArray(data.nutrition),
    ingredients: asArray(data.ingredients).filter(nonEmptyString),
    allergens: asArray(data.allergens?.declarations),
    quality: {
      data_quality: data.quality.data_quality,
      confidence: data.quality.confidence,
      calculation_allowed: data.quality.calculation_allowed,
    },
    trust_tier: deriveTrustTier(verified),
    stale,
    ...(staleAfter ? { stale_after: staleAfter } : {}),
    ...(latestVerification(verified) ? { last_verified: latestVerification(verified) } : {}),
    ...(isRecord(data.revision) ? { revision: data.revision } : {}),
    sources: asArray(data.sources),
    verification: verified,
  };
}

function currentGitCommit() {
  if (nonEmptyString(process.env.GITHUB_SHA)) return process.env.GITHUB_SHA;
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function datasetVersion(sourceCommit) {
  const explicit = process.env.DATASET_VERSION;
  if (nonEmptyString(explicit)) return explicit.replace(/[^A-Za-z0-9._-]/gu, "-").slice(0, 80);
  const short = sourceCommit === "unknown" ? "local" : sourceCommit.slice(0, 12);
  return `git-${short}`;
}

export async function buildDataset(options = {}) {
  const sourceCommit = options.sourceCommit ?? currentGitCommit();
  const version = options.version ?? datasetVersion(sourceCommit);
  const generatedAt = options.generatedAt ?? process.env.DATASET_TIMESTAMP ?? new Date().toISOString();
  const now = new Date(generatedAt);
  if (Number.isNaN(now.getTime())) throw new Error(`Invalid dataset timestamp: ${generatedAt}`);

  const sourceDocuments = await loadOkfDocuments(options);
  const runtimeFoods = sourceDocuments
    .filter(({ data }) => data.status === "stable" && data.access?.classification === "public")
    .map(({ data }) => toRuntimeFood(data, now))
    .sort((a, b) => a.id.localeCompare(b.id));

  const previewFoods = sourceDocuments
    .filter(({ data }) => data.status !== "deprecated" && data.access?.classification === "public")
    .map(({ data }) => toRuntimeFood(data, now))
    .sort((a, b) => a.id.localeCompare(b.id));

  const staleDocuments = runtimeFoods.filter((food) => food.stale).length;
  const previewStaleDocuments = previewFoods.filter((food) => food.stale).length;
  const draftDocuments = previewFoods.filter((food) => food.status === "draft").length;
  const manifest = {
    dataset_version: version,
    source_commit: sourceCommit,
    stable_documents: runtimeFoods.length,
    stale_documents: staleDocuments,
    last_deployment: now.toISOString(),
  };
  const previewManifest = {
    dataset_version: version,
    source_commit: sourceCommit,
    stable_documents: runtimeFoods.length,
    draft_documents: draftDocuments,
    preview_documents: previewFoods.length,
    stale_documents: previewStaleDocuments,
    last_deployment: now.toISOString(),
  };
  const stats = {
    ...manifest,
    source_documents: sourceDocuments.length,
    published_documents: runtimeFoods.length,
    preview_documents: previewFoods.length,
    draft_documents: draftDocuments,
    excluded_documents: sourceDocuments.length - runtimeFoods.length,
  };
  const versionedEntries = [
    ...runtimeFoods.map((food) => ({
      key: `doc:${version}:${food.id}`,
      value: JSON.stringify(food),
    })),
    ...previewFoods.map((food) => ({
      key: `preview-doc:${version}:${food.id}`,
      value: JSON.stringify(food),
    })),
    { key: `manifest:${version}`, value: JSON.stringify(manifest) },
    { key: `preview-manifest:${version}`, value: JSON.stringify(previewManifest) },
    { key: `stats:${version}`, value: JSON.stringify(stats) },
  ];

  return {
    version,
    sourceCommit,
    generatedAt: now.toISOString(),
    sourceDocuments,
    runtimeFoods,
    previewFoods,
    manifest,
    previewManifest,
    stats,
    versionedEntries,
  };
}
