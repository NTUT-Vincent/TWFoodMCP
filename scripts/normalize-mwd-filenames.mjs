#!/usr/bin/env node
/**
 * Normalize MWD OKF concept filenames to the bundle convention:
 *
 *   麥味登_<product-name>.md
 *
 * The brand prefix mirrors every other official-brand directory
 * (McDonald's, Starbucks, Louisa, FamilyMart). Legacy forms handled:
 * `<product-name>-<official-id>.md`, `mwd-<official-id>.md`, and hash-named
 * files. If two products in the same category share a name, the official
 * product id disambiguates: 麥味登_<name>-<id>.md. Internal Markdown links
 * inside knowledge/menu-items/mwd are rewritten to follow the renames.
 */
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const MWD_ROOT = "knowledge/menu-items/mwd";
const BRAND_PREFIX = "麥味登_";
const RESERVED = new Set(["index.md", "log.md"]);

function splitFrontmatter(markdown, filePath) {
  const match = markdown.replace(/^\uFEFF/u, "").match(/^---\s*\r?\n([\s\S]*?)\r?\n---/u);
  if (!match) throw new Error(`${filePath}: missing YAML frontmatter`);
  const data = parse(match[1]);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${filePath}: invalid YAML frontmatter`);
  }
  return data;
}

function productName(data, filePath) {
  const name = data?.food?.name;
  if (typeof name !== "string" || !name.trim()) {
    throw new Error(`${filePath}: missing food.name`);
  }
  const normalized = name
    .normalize("NFKC")
    .trim()
    .replace(/[\u0000-\u001f<>:"/\\|?*#]/gu, "_")
    .replace(/\s+/gu, "_")
    .replace(/_+/gu, "_")
    .replace(/^[._]+|[._]+$/gu, "");
  if (!normalized) throw new Error(`${filePath}: food.name normalizes to an empty name`);
  return [...normalized].slice(0, 80).join("");
}

function sourceProductId(data, filePath) {
  const revisionId = data?.revision?.source_product_id;
  if (typeof revisionId === "string" && revisionId.trim()) return revisionId.trim();
  if (Number.isInteger(revisionId)) return String(revisionId);

  const foodId = data?.food?.id;
  if (typeof foodId === "string") {
    const id = foodId.split(":").at(-1)?.trim();
    if (id) return id;
  }

  const legacy = path.basename(filePath, ".md").match(/(?:mwd-)?(\d+)$/u)?.[1];
  if (legacy) return legacy;
  throw new Error(`${filePath}: missing revision.source_product_id`);
}

/** Strip a legacy brand prefix / id suffix so idempotent re-runs converge. */
function baseNameOf(fileName, data, filePath) {
  let stem = path.basename(fileName, ".md");
  if (stem.startsWith(BRAND_PREFIX)) stem = stem.slice(BRAND_PREFIX.length);
  stem = stem.replace(/-\d+$/u, "");
  if (!stem) return productName(data, filePath);
  return stem;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function listCategoryDirectories() {
  const entries = await readdir(MWD_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
}

const renames = new Map(); // old abs -> new abs
for (const category of await listCategoryDirectories()) {
  const categoryDir = path.join(MWD_ROOT, category.name);
  const files = (await readdir(categoryDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !RESERVED.has(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const planned = [];
  const claimed = new Set();
  const groups = new Map();
  for (const file of files) {
    const sourcePath = path.join(categoryDir, file.name);
    const data = splitFrontmatter(await readFile(sourcePath, "utf8"), sourcePath);
    const base = `${BRAND_PREFIX}${baseNameOf(file.name, data, sourcePath)}`;
    (groups.get(base.toLowerCase()) ?? groups.set(base.toLowerCase(), []).get(base.toLowerCase())).push({
      sourcePath,
      data,
      base,
    });
  }
  for (const group of groups.values()) {
    for (const entry of group) {
      const candidates = group.length === 1
        ? [`${entry.base}.md`]
        : [`${entry.base}-${sourceProductId(entry.data, entry.sourcePath)}.md`];
      let chosen = candidates.find((name) => !claimed.has(name.toLowerCase()));
      if (!chosen) {
        chosen = `${entry.base}-${sourceProductId(entry.data, entry.sourcePath)}.md`;
      }
      if (claimed.has(chosen.toLowerCase())) {
        throw new Error(`${categoryDir}: unresolvable filename collision -> ${chosen}`);
      }
      claimed.add(chosen.toLowerCase());
      planned.push([entry.sourcePath, path.join(categoryDir, chosen)]);
    }
  }
  for (const [sourcePath, targetPath] of planned) {
    if (sourcePath === targetPath) continue;
    renames.set(sourcePath, targetPath);
  }
}

let renamed = 0;
for (const [sourcePath, targetPath] of renames) {
  await rename(sourcePath, targetPath);
  renamed += 1;
  console.log(`${sourcePath} -> ${targetPath}`);
}

// Rewrite internal links inside the mwd tree to follow the renames.
let rewrites = 0;
for (const category of await listCategoryDirectories()) {
  const categoryDir = path.join(MWD_ROOT, category.name);
  for (const entry of await readdir(categoryDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const filePath = path.join(categoryDir, entry.name);
    const markdown = await readFile(filePath, "utf8");
    let output = "";
    let cursor = 0;
    for (let start = 0; start < markdown.length; start += 1) {
      const open = markdown.indexOf("](", start);
      if (open < 0) break;
      let depth = 1;
      let end = open + 2;
      let escaped = false;
      for (; end < markdown.length; end += 1) {
        const character = markdown[end];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (character === "\\") {
          escaped = true;
          continue;
        }
        if (character === "(") depth += 1;
        else if (character === ")") {
          depth -= 1;
          if (depth === 0) break;
        }
      }
      if (depth === 0) {
        const dest = markdown.slice(open + 2, end);
        const resolved = path.resolve(path.dirname(filePath), safeDecode(dest.split("#", 1)[0]));
        const target = renames.get(resolved);
        if (target) {
          output += markdown.slice(cursor, open + 2) + path.basename(target) + markdown.slice(end, end + 1);
          rewrites += 1;
          cursor = end + 1;
        }
      }
      start = end;
    }
    output += markdown.slice(cursor);
    if (output !== markdown) await writeFile(filePath, output, "utf8");
  }
}

console.log(`Normalized ${renamed} MWD concept filenames using 麥味登_<product-name>.md and rewrote ${rewrites} links.`);
