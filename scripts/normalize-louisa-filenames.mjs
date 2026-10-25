#!/usr/bin/env node
/**
 * Normalize Louisa OKF concept filenames to the bundle convention:
 *
 *   路易莎_<food-name>.md
 *
 * The brand prefix mirrors every other official-brand directory
 * (McDonald's, Starbucks, MWD, FamilyMart). Legacy hash-named files
 * (`<12-hex>.md`, `<name>-<12-hex>.md`) are renamed to the brand-prefixed
 * form; when two concepts in the same category share a food name, the
 * stable source identity suffix disambiguates:
 * 路易莎_<name>-<identity>.md. Internal Markdown links inside
 * knowledge/menu-items/louisa are rewritten to follow the renames.
 */
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const LOUISA_ROOT = "knowledge/menu-items/louisa";
const BRAND_PREFIX = "路易莎_";
const RESERVED = new Set(["index.md", "log.md"]);
const HASH_FILE = /^[a-f0-9]{12}\.md$/u;
const HASH_SUFFIX_FILE = /-([a-f0-9]{12})\.md$/u;

function splitFrontmatter(markdown, filePath) {
  const match = markdown.replace(/^\uFEFF/u, "").match(/^---\s*\r?\n([\s\S]*?)\r?\n---/u);
  if (!match) throw new Error(`${filePath}: missing YAML frontmatter`);
  const data = parse(match[1]);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${filePath}: invalid YAML frontmatter`);
  }
  return data;
}

function descriptiveSlug(value) {
  const normalized = String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/[\u0000-\u001f<>:"/\\|?*#]/gu, "_")
    .replace(/\s+/gu, "_")
    .replace(/_+/gu, "_")
    .replace(/^[._]+|[._]+$/gu, "");

  if (!normalized) throw new Error("Louisa concept is missing a usable food.name");
  return [...normalized].slice(0, 80).join("");
}

function identitySuffix(data, fileName) {
  if (HASH_FILE.test(fileName)) return path.basename(fileName, ".md");
  const existingHashSuffix = fileName.match(HASH_SUFFIX_FILE)?.[1];
  if (existingHashSuffix) return existingHashSuffix;

  const sourceProductId = data?.revision?.source_product_id;
  if (typeof sourceProductId === "string" && sourceProductId.trim()) {
    return descriptiveSlug(sourceProductId);
  }

  const sourceVersion = data?.revision?.source_version;
  if (typeof sourceVersion === "string" && sourceVersion.trim()) {
    return descriptiveSlug(sourceVersion);
  }

  const foodId = data?.food?.id;
  if (typeof foodId === "string" && foodId.trim()) {
    const suffix = foodId.replace(/^louisa-menu-/u, "").trim();
    if (suffix) return descriptiveSlug(suffix);
  }

  throw new Error(`${fileName}: cannot derive a stable filename identity suffix`);
}

/** Strip the legacy brand prefix and trailing identity suffixes. */
function baseNameOf(fileName, data) {
  let stem = path.basename(fileName, ".md");
  if (stem.startsWith(BRAND_PREFIX)) stem = stem.slice(BRAND_PREFIX.length);
  stem = stem.replace(/-[0-9a-f]{12}$/iu, "").replace(/-louisa-menu-[0-9a-f]+$/iu, "");
  if (!stem) return descriptiveSlug(data?.food?.name);
  return stem;
}

function desiredFilename(data, fileName) {
  if (!HASH_FILE.test(fileName) && !HASH_SUFFIX_FILE.test(fileName)) return fileName;
  const name = data?.food?.name;
  if (typeof name !== "string" || !name.trim()) {
    throw new Error(`${fileName}: missing food.name`);
  }
  return `${BRAND_PREFIX}${descriptiveSlug(name)}-${identitySuffix(data, fileName)}.md`;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function listCategoryDirectories() {
  const entries = await readdir(LOUISA_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
}

const renames = new Map(); // old abs -> new abs
for (const category of await listCategoryDirectories()) {
  const categoryDir = path.join(LOUISA_ROOT, category.name);
  const files = (await readdir(categoryDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !RESERVED.has(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const groups = new Map();
  for (const file of files) {
    const sourcePath = path.join(categoryDir, file.name);
    const data = splitFrontmatter(await readFile(sourcePath, "utf8"), sourcePath);
    const base = `${BRAND_PREFIX}${baseNameOf(file.name, data)}`;
    (groups.get(base.toLowerCase()) ?? groups.set(base.toLowerCase(), []).get(base.toLowerCase())).push({
      sourcePath,
      data,
      base,
      fileName: file.name,
    });
  }

  const claimed = new Set();
  for (const group of groups.values()) {
    for (const entry of group) {
      let targetName;
      if (group.length === 1) {
        targetName = `${entry.base}.md`;
      } else {
        const suffix = identitySuffix(entry.data, entry.fileName);
        targetName = `${entry.base}-${suffix}.md`;
      }
      if (claimed.has(targetName.toLowerCase())) {
        targetName = desiredFilename(entry.data, entry.fileName);
      }
      if (claimed.has(targetName.toLowerCase())) {
        throw new Error(`${categoryDir}: unresolvable filename collision -> ${targetName}`);
      }
      claimed.add(targetName.toLowerCase());
      if (entry.fileName !== targetName) renames.set(entry.sourcePath, path.join(categoryDir, targetName));
    }
  }
}

let renamed = 0;
for (const [sourcePath, targetPath] of renames) {
  await rename(sourcePath, targetPath);
  renamed += 1;
  console.log(`${sourcePath} -> ${targetPath}`);
}

// Rewrite internal links inside the louisa tree to follow the renames.
let rewrites = 0;
for (const category of await listCategoryDirectories()) {
  const categoryDir = path.join(LOUISA_ROOT, category.name);
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

console.log(`Normalized ${renamed} Louisa filenames using 路易莎_<food-name>.md and rewrote ${rewrites} links.`);
