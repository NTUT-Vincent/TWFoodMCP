#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse, stringify } from "yaml";

const BUNDLE_ROOT = "knowledge";
const RESERVED = new Set(["index.md", "log.md"]);
const ACTOR_PATTERN = /^(?:(?:human|process):[A-Za-z0-9][A-Za-z0-9._-]*|[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*)$/u;
const OFFICIAL_SPEC = "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md";

const GENERATED_ACTOR_REPLACEMENTS = new Map([
  ["agent:chatgpt-mcdonalds-official-api-import", "twfoodmcp-mcdonalds-importer/1.0.0"],
  ["agent:chatgpt-official-page-import", "twfoodmcp-familymart-importer/1.0.0"],
]);
const SOURCE_AUTHOR_REPLACEMENTS = new Map([
  ["organization:mcdonalds-tw", "mcdonalds-tw/2026-08-01"],
  ["organization:familymart-tw", "familymart-tw/2026-08-01"],
]);

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeActor(actor, replacements, field) {
  if (!nonEmptyString(actor)) return actor;
  const normalized = replacements.get(actor) ?? actor;
  if (!ACTOR_PATTERN.test(normalized)) throw new Error(`${field}: invalid OKF actor ${normalized}`);
  return normalized;
}

async function listConceptFiles(rootDir) {
  const files = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const resolved = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(resolved);
      else if (entry.isFile() && entry.name.endsWith(".md") && !RESERVED.has(entry.name)) files.push(resolved);
    }
  }
  await walk(rootDir);
  return files;
}

function splitDocument(markdown, filePath) {
  const normalized = markdown.replace(/^\uFEFF/u, "");
  const match = normalized.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)([\s\S]*)$/u);
  if (!match) throw new Error(`${filePath}: missing YAML frontmatter`);
  const data = parse(match[1]);
  if (!isRecord(data)) throw new Error(`${filePath}: frontmatter must be an object`);
  return { data, body: match[2] };
}

function orderFrontmatter(data) {
  const ordered = {};
  for (const key of ["type", "title", "description", "resource", "tags", "generated", "verified", "status", "stale_after", "sources"]) {
    if (data[key] !== undefined) ordered[key] = data[key];
  }
  for (const [key, value] of Object.entries(data)) {
    if (!(key in ordered)) ordered[key] = value;
  }
  return ordered;
}

function citeSummary(body, source) {
  if (!nonEmptyString(source?.id)) return body.trimEnd();
  const marker = `[^${source.id}]`;
  if (body.includes(marker)) return body.trimEnd();

  const lines = body.trim().split(/\r?\n/u);
  const summaryHeading = lines.findIndex((line) => /^#\s+Summary\s*$/iu.test(line.trim()));
  let cited = false;
  if (summaryHeading >= 0) {
    for (let index = summaryHeading + 1; index < lines.length; index += 1) {
      const line = lines[index].trim();
      if (!line) continue;
      if (/^#/u.test(line)) break;
      if (!/^(?:[-*+]\s|\d+\.\s|```|~~~|>)/u.test(line)) {
        lines[index] = `${lines[index].trimEnd()}${marker}`;
        cited = true;
        break;
      }
    }
  }
  if (!cited) lines.push("", "# Summary", "", `本文件依據來源資料整理。${marker}`);

  const label = nonEmptyString(source.title) ? source.title.trim() : source.resource;
  lines.push("", `${marker}: ${label}`);
  return lines.join("\n").trimEnd();
}

function normalizeConcept(data, body, filePath) {
  const normalized = { ...data };
  if (!nonEmptyString(normalized.type)) throw new Error(`${filePath}: type is required`);
  if (nonEmptyString(normalized.title) && !nonEmptyString(normalized.description)) {
    normalized.description = `${normalized.title.trim()} 的食品營養、成分與過敏原知識文件。`;
  }

  if (isRecord(normalized.generated)) {
    normalized.generated = {
      ...normalized.generated,
      by: normalizeActor(normalized.generated.by, GENERATED_ACTOR_REPLACEMENTS, `${filePath}: generated.by`),
    };
  }

  const verified = Array.isArray(normalized.verified)
    ? normalized.verified
    : isRecord(normalized.verified)
      ? [normalized.verified]
      : [];
  for (const [index, event] of verified.entries()) {
    if (isRecord(event)) normalizeActor(event.by, new Map(), `${filePath}: verified[${index}].by`);
  }

  if (Array.isArray(normalized.sources)) {
    normalized.sources = normalized.sources.map((source, index) => {
      if (!isRecord(source)) return source;
      return {
        ...source,
        ...(nonEmptyString(source.author)
          ? { author: normalizeActor(source.author, SOURCE_AUTHOR_REPLACEMENTS, `${filePath}: sources[${index}].author`) }
          : {}),
      };
    });
  }

  const primarySource = Array.isArray(normalized.sources)
    ? normalized.sources.find((source) => isRecord(source) && nonEmptyString(source.resource))
    : undefined;
  if (!nonEmptyString(normalized.resource) && primarySource) normalized.resource = primarySource.resource;

  return {
    data: orderFrontmatter(normalized),
    body: citeSummary(body, primarySource),
  };
}

function renderConcept(data, body) {
  return `---\n${stringify(data, { lineWidth: 0 }).trimEnd()}\n---\n\n${body.trim()}\n`;
}

function indexEntry(relativePath, data) {
  const title = nonEmptyString(data.title) ? data.title.trim() : path.basename(relativePath, ".md");
  const description = nonEmptyString(data.description) ? ` - ${data.description.trim()}` : "";
  return `* [${title}](${relativePath.replaceAll(path.sep, "/")})${description}`;
}

async function writeIndexes(concepts) {
  await mkdir(path.join(BUNDLE_ROOT, "menu-items", "mcdonalds"), { recursive: true });

  await writeFile(
    path.join(BUNDLE_ROOT, "index.md"),
    `---\nokf_version: "0.2"\n---\n\n# TWFoodMCP Knowledge Bundle\n\n* [Menu items](menu-items/) - 台灣包裝食品與連鎖餐飲品項的營養、成分及過敏原知識。\n\n本 bundle 依循 [Open Knowledge Format v0.2](${OFFICIAL_SPEC})。\n`,
    "utf8",
  );

  const familymart = concepts
    .filter(({ filePath }) => path.dirname(filePath) === path.join(BUNDLE_ROOT, "menu-items"))
    .sort((a, b) => a.data.title.localeCompare(b.data.title, "zh-Hant"));
  await writeFile(
    path.join(BUNDLE_ROOT, "menu-items", "index.md"),
    [
      "# Menu Items",
      "",
      "## Brands",
      "",
      "* [McDonald's](mcdonalds/) - 麥當勞台灣官方營養資料轉換的餐點概念。",
      "",
      "## FamilyMart Fami!ce",
      "",
      ...familymart.map(({ filePath, data }) => indexEntry(path.basename(filePath), data)),
      "",
    ].join("\n"),
    "utf8",
  );

  const mcdonalds = concepts
    .filter(({ filePath }) => path.dirname(filePath) === path.join(BUNDLE_ROOT, "menu-items", "mcdonalds"))
    .sort((a, b) => a.data.title.localeCompare(b.data.title, "zh-Hant"));
  await writeFile(
    path.join(BUNDLE_ROOT, "menu-items", "mcdonalds", "index.md"),
    ["# McDonald's Taiwan Menu Items", "", ...mcdonalds.map(({ filePath, data }) => indexEntry(path.basename(filePath), data)), ""].join("\n"),
    "utf8",
  );
}

async function ensureLog() {
  const logPath = path.join(BUNDLE_ROOT, "log.md");
  try {
    await readFile(logPath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    await writeFile(
      logPath,
      "# Knowledge Bundle Update Log\n\n## 2026-08-02\n\n* **Update**: Normalized all food concepts to the Open Knowledge Format v0.2 actor, provenance, lifecycle, and citation conventions.\n* **Creation**: Added progressive-disclosure index files and declared `okf_version: \"0.2\"` at the bundle root.\n",
      "utf8",
    );
  }
}

async function ensureValidatorConformance() {
  const filePath = "scripts/lib/dataset.mjs";
  const content = await readFile(filePath, "utf8");
  const oldCheck = 'assert(nonEmptyString(verification.by), `${prefix}.by is required`, errors);';
  const newCheck = 'assert(isActor(verification.by), `${prefix}.by must follow the OKF actor convention`, errors);';
  if (content.includes(newCheck)) return;
  if (!content.includes(oldCheck)) throw new Error(`${filePath}: verifier actor validation target not found`);
  await writeFile(filePath, content.replace(oldCheck, newCheck), "utf8");
}

const conceptFiles = await listConceptFiles(BUNDLE_ROOT);
const concepts = [];
for (const filePath of conceptFiles) {
  const markdown = await readFile(filePath, "utf8");
  const { data, body } = splitDocument(markdown, filePath);
  const normalized = normalizeConcept(data, body, filePath);
  await writeFile(filePath, renderConcept(normalized.data, normalized.body), "utf8");
  concepts.push({ filePath, data: normalized.data });
}

await writeIndexes(concepts);
await ensureLog();
await ensureValidatorConformance();

console.log(`Formatted ${concepts.length} OKF concepts for official OKF v0.2 conformance.`);
