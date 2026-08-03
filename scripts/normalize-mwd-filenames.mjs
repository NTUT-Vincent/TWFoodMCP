#!/usr/bin/env node
import { readdir, readFile, rename } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const MWD_ROOT = "knowledge/menu-items/mwd";
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

function descriptiveSlug(value) {
  const normalized = String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/[\u0000-\u001f<>:"/\\|?*]/gu, "-")
    .replace(/\s+/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^[.-]+|[.-]+$/gu, "");

  if (!normalized) throw new Error("MWD concept is missing a usable product name");
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

function desiredFilename(data, filePath) {
  const name = data?.food?.name;
  if (typeof name !== "string" || !name.trim()) {
    throw new Error(`${filePath}: missing food.name`);
  }
  return `${descriptiveSlug(name)}-${sourceProductId(data, filePath)}.md`;
}

async function listCategoryDirectories() {
  const entries = await readdir(MWD_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
}

let renamed = 0;
for (const category of await listCategoryDirectories()) {
  const categoryDir = path.join(MWD_ROOT, category.name);
  const files = (await readdir(categoryDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !RESERVED.has(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const targets = new Map();
  for (const file of files) {
    const sourcePath = path.join(categoryDir, file.name);
    const data = splitFrontmatter(await readFile(sourcePath, "utf8"), sourcePath);
    const targetName = desiredFilename(data, sourcePath);
    const previous = targets.get(targetName);
    if (previous && previous !== file.name) {
      throw new Error(`${categoryDir}: filename collision between ${previous} and ${file.name} -> ${targetName}`);
    }
    targets.set(targetName, file.name);
  }

  for (const file of files) {
    const sourcePath = path.join(categoryDir, file.name);
    const data = splitFrontmatter(await readFile(sourcePath, "utf8"), sourcePath);
    const targetName = desiredFilename(data, sourcePath);
    if (targetName === file.name) continue;
    const targetPath = path.join(categoryDir, targetName);
    await rename(sourcePath, targetPath);
    renamed += 1;
    console.log(`${sourcePath} -> ${targetPath}`);
  }
}

console.log(`Normalized ${renamed} MWD concept filenames using <product-name>-<official-id>.md.`);
