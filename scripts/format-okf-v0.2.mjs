#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse, stringify } from "yaml";

const BUNDLE_ROOT = "knowledge";
const RESERVED = new Set(["index.md", "log.md"]);
const OFFICIAL_SPEC = "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md";

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
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

function normalizeGeneratedActor(actor) {
  const replacements = new Map([
    ["agent:chatgpt-mcdonalds-official-api-import", "twfoodmcp-mcdonalds-importer/1.0.0"],
    ["agent:chatgpt-official-page-import", "twfoodmcp-familymart-importer/1.0.0"],
  ]);
  return replacements.get(actor) ?? actor;
}

function normalizeSourceAuthor(author) {
  const replacements = new Map([
    ["organization:mcdonalds-tw", "mcdonalds-tw/2026-08-01"],
    ["organization:familymart-tw", "familymart-tw/2026-08-01"],
  ]);
  return replacements.get(author) ?? author;
}

function orderFrontmatter(data) {
  const ordered = {};
  const preferred = [
    "type",
    "title",
    "description",
    "resource",
    "tags",
    "generated",
    "verified",
    "status",
    "stale_after",
    "sources",
  ];
  for (const key of preferred) {
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
  let summaryHeading = lines.findIndex((line) => /^#\s+Summary\s*$/iu.test(line.trim()));
  if (summaryHeading < 0) {
    lines.push("", "# Summary", "", `本文件依據來源資料整理。${marker}`);
    summaryHeading = lines.length - 4;
  } else {
    let cited = false;
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
    if (!cited) lines.splice(summaryHeading + 1, 0, "", `本文件依據來源資料整理。${marker}`);
  }

  const label = nonEmptyString(source.title) ? source.title.trim() : source.resource;
  lines.push("", `${marker}: ${label}`);
  return lines.join("\n").trimEnd();
}

function normalizeConcept(data, body) {
  const normalized = { ...data };
  if (!nonEmptyString(normalized.type)) throw new Error("type is required");
  if (nonEmptyString(normalized.title) && !nonEmptyString(normalized.description)) {
    normalized.description = `${normalized.title.trim()} 的食品營養、成分與過敏原知識文件。`;
  }

  if (isRecord(normalized.generated) && nonEmptyString(normalized.generated.by)) {
    normalized.generated = {
      ...normalized.generated,
      by: normalizeGeneratedActor(normalized.generated.by),
    };
  }

  if (Array.isArray(normalized.sources)) {
    normalized.sources = normalized.sources.map((source) => {
      if (!isRecord(source)) return source;
      return {
        ...source,
        ...(nonEmptyString(source.author) ? { author: normalizeSourceAuthor(source.author) } : {}),
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

  const rootIndex = `---\nokf_version: "0.2"\n---\n\n# TWFoodMCP Knowledge Bundle\n\n* [Menu items](menu-items/) - 台灣包裝食品與連鎖餐飲品項的營養、成分及過敏原知識。\n\n本 bundle 依循 [Open Knowledge Format v0.2](${OFFICIAL_SPEC})。\n`;
  await writeFile(path.join(BUNDLE_ROOT, "index.md"), rootIndex, "utf8");

  const familymart = concepts
    .filter(({ filePath }) => path.dirname(filePath) === path.join(BUNDLE_ROOT, "menu-items"))
    .sort((a, b) => a.data.title.localeCompare(b.data.title, "zh-Hant"));
  const menuIndex = [
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
  ].join("\n");
  await writeFile(path.join(BUNDLE_ROOT, "menu-items", "index.md"), menuIndex, "utf8");

  const mcdonalds = concepts
    .filter(({ filePath }) => path.dirname(filePath) === path.join(BUNDLE_ROOT, "menu-items", "mcdonalds"))
    .sort((a, b) => a.data.title.localeCompare(b.data.title, "zh-Hant"));
  const mcdonaldsIndex = [
    "# McDonald's Taiwan Menu Items",
    "",
    ...mcdonalds.map(({ filePath, data }) => indexEntry(path.basename(filePath), data)),
    "",
  ].join("\n");
  await writeFile(path.join(BUNDLE_ROOT, "menu-items", "mcdonalds", "index.md"), mcdonaldsIndex, "utf8");

  const log = `# Knowledge Bundle Update Log\n\n## 2026-08-02\n\n* **Update**: Normalized all food concepts to the Open Knowledge Format v0.2 actor, provenance, lifecycle, and citation conventions.\n* **Creation**: Added progressive-disclosure index files and declared \`okf_version: "0.2"\` at the bundle root.\n`;
  await writeFile(path.join(BUNDLE_ROOT, "log.md"), log, "utf8");
}

async function patchDatasetLibrary() {
  const filePath = "scripts/lib/dataset.mjs";
  let content = await readFile(filePath, "utf8");

  const replaceOnce = (before, after) => {
    if (!content.includes(before)) throw new Error(`${filePath}: expected patch target not found: ${before.slice(0, 80)}`);
    content = content.replace(before, after);
  };

  replaceOnce(
    'const LIFECYCLE = new Set(["draft", "stable", "deprecated"]);',
    'const LIFECYCLE = new Set(["draft", "stable", "deprecated"]);\nconst RESERVED_MARKDOWN = new Set(["index.md", "log.md"]);\nconst ACTOR_PATTERN = /^(?:(?:human|process):[A-Za-z0-9][A-Za-z0-9._-]*|[A-Za-z0-9][A-Za-z0-9._-]*\\/[A-Za-z0-9][A-Za-z0-9._-]*)$/u;',
  );

  replaceOnce(
    'function asArray(value) {\n  return Array.isArray(value) ? value : [];\n}',
    'function asArray(value) {\n  return Array.isArray(value) ? value : [];\n}\n\nfunction asVerificationList(value) {\n  if (Array.isArray(value)) return value;\n  return isRecord(value) ? [value] : [];\n}\n\nfunction isActor(value) {\n  return nonEmptyString(value) && ACTOR_PATTERN.test(value);\n}',
  );

  replaceOnce(
    'function normalizeTimestamp(value) {\n  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();\n  if (!nonEmptyString(value)) return undefined;\n  const parsed = new Date(value);\n  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();\n}',
    'function normalizeTimestamp(value) {\n  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();\n  if (!nonEmptyString(value)) return undefined;\n  const parsed = new Date(value);\n  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();\n}\n\nfunction normalizeDate(value) {\n  const date = value instanceof Date ? value.toISOString().slice(0, 10) : value;\n  if (!nonEmptyString(date) || !/^\\d{4}-\\d{2}-\\d{2}$/u.test(date)) return undefined;\n  const parsed = new Date(`${date}T00:00:00Z`);\n  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date ? undefined : date;\n}\n\nfunction dateInTaipei(value) {\n  const parts = new Intl.DateTimeFormat("en-CA", {\n    timeZone: "Asia/Taipei",\n    year: "numeric",\n    month: "2-digit",\n    day: "2-digit",\n  }).formatToParts(value);\n  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));\n  return `${values.year}-${values.month}-${values.day}`;\n}',
  );

  replaceOnce(
    'else if (entry.isFile() && entry.name.endsWith(".md")) files.push(resolved);',
    'else if (entry.isFile() && entry.name.endsWith(".md") && !RESERVED_MARKDOWN.has(entry.name)) files.push(resolved);',
  );

  content = content.replaceAll('asArray(verified)', 'asVerificationList(verified)');
  content = content.replaceAll('const verified = asArray(data.verified);', 'const verified = asVerificationList(data.verified);');

  replaceOnce(
    'assert(isRecord(data.generated) && nonEmptyString(data.generated.by) && normalizeTimestamp(data.generated.at), `${filePath}: generated.by and generated.at are required`, errors);',
    'assert(isRecord(data.generated) && isActor(data.generated.by) && normalizeTimestamp(data.generated.at), `${filePath}: generated.by must follow the OKF actor convention and generated.at must be an ISO 8601 timestamp`, errors);',
  );

  replaceOnce(
    'assert(SOURCE_CLASSES.has(source.source_class), `${prefix}.source_class is invalid`, errors);',
    'assert(SOURCE_CLASSES.has(source.source_class), `${prefix}.source_class is invalid`, errors);\n    if (source.author !== undefined) assert(isActor(source.author), `${prefix}.author must follow the OKF actor convention`, errors);',
  );

  replaceOnce(
    'assert(Boolean(normalizeTimestamp(data.stale_after)), `${filePath}: stale_after must be a valid date`, errors);',
    'assert(Boolean(normalizeDate(data.stale_after)), `${filePath}: stale_after must be an absolute YYYY-MM-DD date`, errors);',
  );

  replaceOnce(
    'const staleAfter = normalizeTimestamp(data.stale_after);\n  const stale = Boolean(staleAfter && new Date(staleAfter).getTime() < now.getTime());',
    'const staleAfter = normalizeDate(data.stale_after);\n  const stale = Boolean(staleAfter && dateInTaipei(now) >= staleAfter);',
  );

  replaceOnce(
    '...(staleAfter ? { stale_after: staleAfter.slice(0, 10) } : {}),',
    '...(staleAfter ? { stale_after: staleAfter } : {}),',
  );

  await writeFile(filePath, content, "utf8");
}

async function patchImporter() {
  const filePath = "scripts/import-mcdonalds-okf.mjs";
  let content = await readFile(filePath, "utf8");

  const replaceOnce = (before, after) => {
    if (!content.includes(before)) throw new Error(`${filePath}: expected patch target not found: ${before.slice(0, 80)}`);
    content = content.replace(before, after);
  };

  replaceOnce(
    'description: `麥當勞台灣官方品項「${item.name}」的每份營養資料，來源為官方 itemDetails API。`,\n    status: "draft",',
    'description: `麥當勞台灣官方品項「${item.name}」的每份營養資料，來源為官方 itemDetails API。`,\n    resource: item.source_url,\n    status: "draft",',
  );
  replaceOnce('by: "agent:chatgpt-mcdonalds-official-api-import",', 'by: "twfoodmcp-mcdonalds-importer/1.0.0",');
  replaceOnce('author: "organization:mcdonalds-tw",', 'author: "mcdonalds-tw/2026-08-01",');

  replaceOnce(
    '  const markdown = `---\\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\\n---\\n\\n# Summary\\n\\n官方 API 提供每份重量與九項營養數值；本文件保留原始每份基準，未自行換算或補齊缺值。\\n`;',
    '  const source = frontmatter.sources[0];\n  const markdown = `---\\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\\n---\\n\\n# Summary\\n\\n官方 API 提供每份重量與九項營養數值；本文件保留原始每份基準，未自行換算或補齊缺值。[^${source.id}]\\n\\n[^${source.id}]: ${source.title}\\n`;',
  );

  await writeFile(filePath, content, "utf8");
}

async function patchPackageAndReadme() {
  const packagePath = "package.json";
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  packageJson.scripts = {
    ...packageJson.scripts,
    "format:okf": "node scripts/format-okf-v0.2.mjs",
  };
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");

  const readmePath = "README.md";
  let readme = await readFile(readmePath, "utf8");
  const anchor = "- [MVP Technical Specification](docs/MVP_SPEC.md)";
  const replacement = `${anchor}\n- [OKF v0.2 Conformance Profile](docs/OKF_CONFORMANCE.md)\n- [Official Open Knowledge Format v0.2](${OFFICIAL_SPEC})`;
  if (!readme.includes("OKF v0.2 Conformance Profile")) {
    if (!readme.includes(anchor)) throw new Error(`${readmePath}: specification anchor not found`);
    readme = readme.replace(anchor, replacement);
  }
  await writeFile(readmePath, readme, "utf8");
}

async function writeConformanceGuide() {
  const content = `# TWFoodMCP OKF v0.2 Conformance Profile\n\nChecked against the official Open Knowledge Format \`README.md\` and \`SPEC.md\` on 2026-08-02. The official specification version was **0.2**.\n\n## Bundle boundary\n\nThe OKF knowledge bundle is the \`knowledge/\` directory. Every non-reserved Markdown file below it is a concept document. \`index.md\` and \`log.md\` are reserved navigation and history files and are not parsed as concepts. The bundle-root \`knowledge/index.md\` declares \`okf_version: "0.2"\`.\n\n## Official core and domain profile\n\nOfficial OKF requires only a non-empty \`type\` for a concept. TWFoodMCP intentionally applies a stricter producer profile for publishable food records: title, lifecycle status, provenance, generation metadata, food identity, quality, and other nutrition-domain fields are required by the repository validator. These extra fields are OKF extensions and do not replace or redefine the official keys.\n\n## Identity, provenance, and trust\n\n- Agent/tool actors use \`<producer>/<version>\`; human reviewers use \`human:<id>\`; automated verification processes use \`process:<id>\`.\n- Each source contains a followable \`resource\`. A source \`id\` is used as the Markdown footnote label for claim attribution.\n- \`verified\` may be a list or one bare mapping; consumers normalize both forms to a list.\n- Trust tiers are derived from \`verified\`; \`trust_tier\` is never authored in source documents.\n\n## Lifecycle and freshness\n\n- TWFoodMCP authors explicit \`draft\`, \`stable\`, or \`deprecated\` status even though official OKF defaults an absent status to \`stable\`.\n- \`stale_after\` is an absolute \`YYYY-MM-DD\` date. For this Taiwan dataset, runtime staleness is evaluated using the Asia/Taipei calendar date and becomes true when \`today >= stale_after\`.\n- Only public, stable, human-reviewed records are published to the stable dataset. Drafts remain preview-only and cannot participate in nutrition calculations.\n\n## Maintenance rule\n\nBefore any future OKF format change, re-read the latest official [OKF README](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/README.md) and [OKF specification](${OFFICIAL_SPEC}). If the official version changes, update this profile, \`knowledge/index.md\`, formatter, validator, tests, and existing concepts together.\n`;
  await mkdir("docs", { recursive: true });
  await writeFile("docs/OKF_CONFORMANCE.md", content, "utf8");
}

async function writeTests() {
  const test = `import assert from "node:assert/strict";\nimport { mkdtemp, mkdir, writeFile } from "node:fs/promises";\nimport os from "node:os";\nimport path from "node:path";\nimport test from "node:test";\n\nimport { loadOkfDocuments, toRuntimeFood } from "../scripts/lib/dataset.mjs";\n\nconst baseRecord = {\n  type: "Food Product",\n  title: "Test Food",\n  description: "A test record.",\n  resource: "https://example.com/food",\n  status: "stable",\n  stale_after: "2026-08-02",\n  access: { classification: "public" },\n  generated: { by: "test-importer/1.0.0", at: "2026-08-01T00:00:00Z" },\n  verified: { by: "human:reviewer", at: "2026-08-01T01:00:00Z" },\n  sources: [{ id: "source", resource: "https://example.com/food", author: "example-source/1.0.0", source_class: "primary_official" }],\n  food: { id: "food:tw:menu:test:item", kind: "menu_item", market: "TW", name: "Test Food" },\n  serving: { description: "每份 100 公克", amount: 100, unit: "g" },\n  nutrition: [{ basis: "per_serving", values: { energy_kcal: 100 } }],\n  quality: { data_quality: "official_brand", completeness: "minimal", confidence: "high", calculation_allowed: true },\n};\n\nfunction render(record) {\n  return \`---\\n\${JSON.stringify(record)}\\n---\\n\\n# Summary\\n\\nTest.[^source]\\n\\n[^source]: Test source\\n\`;\n}\n\ntest("reserved index/log files are not parsed as concepts and bare verified mapping is accepted", async () => {\n  const root = await mkdtemp(path.join(os.tmpdir(), "twfood-okf-"));\n  const knowledgeRoot = path.join(root, "knowledge");\n  await mkdir(knowledgeRoot, { recursive: true });\n  await writeFile(path.join(knowledgeRoot, "index.md"), '---\\nokf_version: "0.2"\\n---\\n\\n# Index\\n', "utf8");\n  await writeFile(path.join(knowledgeRoot, "log.md"), "# Log\\n\\n## 2026-08-02\\n", "utf8");\n  await writeFile(path.join(knowledgeRoot, "test.md"), render(baseRecord), "utf8");\n  const reviewersPath = path.join(root, "reviewers.json");\n  await writeFile(reviewersPath, JSON.stringify({ reviewers: ["human:reviewer"] }), "utf8");\n\n  const documents = await loadOkfDocuments({ knowledgeRoot, reviewersPath });\n  assert.equal(documents.length, 1);\n  assert.equal(toRuntimeFood(documents[0].data, new Date("2026-08-01T16:00:00Z")).trust_tier, "human-reviewed");\n});\n\ntest("stale_after is stale on the boundary date in Asia/Taipei", () => {\n  const runtime = toRuntimeFood(baseRecord, new Date("2026-08-01T16:00:00Z"));\n  assert.equal(runtime.stale, true);\n  assert.equal(runtime.stale_after, "2026-08-02");\n});\n`;
  await writeFile("tests/okf-v0.2.test.mjs", test, "utf8");
}

const conceptFiles = await listConceptFiles(BUNDLE_ROOT);
const concepts = [];
for (const filePath of conceptFiles) {
  const markdown = await readFile(filePath, "utf8");
  const { data, body } = splitDocument(markdown, filePath);
  const normalized = normalizeConcept(data, body);
  await writeFile(filePath, renderConcept(normalized.data, normalized.body), "utf8");
  concepts.push({ filePath, data: normalized.data });
}

await writeIndexes(concepts);
await patchDatasetLibrary();
await patchImporter();
await patchPackageAndReadme();
await writeConformanceGuide();
await writeTests();

console.log(`Formatted ${concepts.length} OKF concepts for official OKF v0.2 conformance.`);
