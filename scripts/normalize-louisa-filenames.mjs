#!/usr/bin/env node
import { readdir, readFile, rename } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const LOUISA_ROOT = "knowledge/menu-items/louisa";
const RESERVED = new Set(["index.md", "log.md"]);
const HASH_FILE = /^[a-f0-9]{12}\.md$/u;

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
    .replace(/[\u0000-\u001f<>:"/\\|?*]/gu, "-")
    .replace(/\s+/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^[.-]+|[.-]+$/gu, "");

  if (!normalized) throw new Error("Louisa concept is missing a usable food.name");
  return [...normalized].slice(0, 80).join("");
}

function identitySuffix(data, fileName) {
  if (HASH_FILE.test(fileName)) return path.basename(fileName, ".md");

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

function desiredFilename(data, fileName) {
  const name = data?.food?.name;
  if (typeof name !== "string" || !name.trim()) {
    throw new Error(`${fileName}: missing food.name`);
  }
  return `${descriptiveSlug(name)}-${identitySuffix(data, fileName)}.md`;
}

async function listConceptFiles(root) {
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
      else if (entry.isFile() && entry.name.endsWith(".md") && !RESERVED.has(entry.name)) files.push(resolved);
    }
  }
  await walk(root);
  return files;
}

const files = await listConceptFiles(LOUISA_ROOT);
const targets = new Map();
const planned = [];

for (const filePath of files) {
  const data = splitFrontmatter(await readFile(filePath, "utf8"), filePath);
  const targetName = desiredFilename(data, path.basename(filePath));
  const targetPath = path.join(path.dirname(filePath), targetName);
  const previous = targets.get(targetPath);
  if (previous && previous !== filePath) {
    throw new Error(`Louisa filename collision: ${previous} and ${filePath} -> ${targetPath}`);
  }
  targets.set(targetPath, filePath);
  planned.push({ filePath, targetPath });
}

let renamed = 0;
for (const { filePath, targetPath } of planned) {
  if (filePath === targetPath) continue;
  await rename(filePath, targetPath);
  renamed += 1;
  console.log(`${filePath} -> ${targetPath}`);
}

console.log(`Normalized ${renamed} Louisa filenames using <food-name>-<stable-source-key>.md.`);
