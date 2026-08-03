#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const MENU_ROOT = "knowledge/menu-items";
const MWD_ROOT = path.join(MENU_ROOT, "mwd");
const RESERVED = new Set(["index.md", "log.md"]);
const MENU_LINK = "* [My Warm Day](mwd/) - 麥味登官方產品頁與營養標示轉換的餐點概念。";
const CATEGORY_NAMES = new Map([
  ["limited-time", "期間限定"],
  ["brunch", "早午餐"],
  ["rice", "飯食"],
  ["noodles", "麵食"],
  ["chinese", "中式餐點"],
  ["sides", "點心"],
  ["salads-soups", "沙拉湯品"],
  ["burgers", "漢堡"],
  ["toast", "湯種吐司"],
  ["muffin-burgers", "滿分堡"],
  ["pancake-burgers", "鬆餅堡"],
  ["danish", "丹麥堡"],
  ["croissants", "可頌"],
  ["coffee", "咖啡飲品"],
  ["ceylon-tea", "錫蘭茶品"],
  ["flavored-drinks", "風味飲品"],
  ["seasonal-drinks", "季節限定飲品"],
]);

function splitFrontmatter(markdown, filePath) {
  const match = markdown.replace(/^\uFEFF/u, "").match(/^---\s*\r?\n([\s\S]*?)\r?\n---/u);
  if (!match) throw new Error(`${filePath}: missing YAML frontmatter`);
  const data = parse(match[1]);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(`${filePath}: invalid YAML frontmatter`);
  return data;
}

async function listConcepts() {
  const concepts = [];
  let categories;
  try {
    categories = await readdir(MWD_ROOT, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return concepts;
    throw error;
  }
  for (const categoryEntry of categories.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!categoryEntry.isDirectory()) continue;
    const categoryDir = path.join(MWD_ROOT, categoryEntry.name);
    const files = await readdir(categoryDir, { withFileTypes: true });
    for (const file of files.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!file.isFile() || !file.name.endsWith(".md") || RESERVED.has(file.name)) continue;
      const filePath = path.join(categoryDir, file.name);
      const data = splitFrontmatter(await readFile(filePath, "utf8"), filePath);
      concepts.push({ category: categoryEntry.name, fileName: file.name, data });
    }
  }
  return concepts;
}

function entry(fileName, data) {
  const title = typeof data.title === "string" && data.title.trim() ? data.title.trim() : path.basename(fileName, ".md");
  const description = typeof data.description === "string" && data.description.trim() ? ` - ${data.description.trim()}` : "";
  return `* [${title}](${fileName})${description}`;
}

async function updateMenuRootIndex() {
  const indexPath = path.join(MENU_ROOT, "index.md");
  let content;
  try {
    content = await readFile(indexPath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    content = "# Menu Items\n";
  }
  const lines = content.trimEnd().split(/\r?\n/u).filter((line) => line !== MENU_LINK);
  let insertAt = -1;
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].startsWith("* [")) insertAt = index;
  }
  lines.splice(insertAt + 1, 0, MENU_LINK);
  await mkdir(MENU_ROOT, { recursive: true });
  await writeFile(indexPath, `${lines.join("\n")}\n`, "utf8");
}

const concepts = await listConcepts();
if (concepts.length === 0) {
  console.log("No MWD concepts found; MWD indexes were not changed.");
  process.exit(0);
}

await updateMenuRootIndex();
const grouped = Map.groupBy(concepts, ({ category }) => category);
const categoryLinks = [];
for (const [category, items] of [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const categoryDir = path.join(MWD_ROOT, category);
  const displayName = CATEGORY_NAMES.get(category) ?? category;
  const sorted = items.sort((a, b) => String(a.data.title ?? "").localeCompare(String(b.data.title ?? ""), "zh-Hant"));
  await writeFile(
    path.join(categoryDir, "index.md"),
    [`# 麥味登 ${displayName}`, "", ...sorted.map(({ fileName, data }) => entry(fileName, data)), ""].join("\n"),
    "utf8",
  );
  categoryLinks.push(`* [${displayName}](${category}/) - ${sorted.length} 筆官方營養資料 draft。`);
}

await mkdir(MWD_ROOT, { recursive: true });
await writeFile(
  path.join(MWD_ROOT, "index.md"),
  [
    "# 麥味登官方營養資料",
    "",
    "以下概念由麥味登官方產品頁與官方營養標示圖片自動轉換；未經真人審核者維持 draft。",
    "",
    ...categoryLinks,
    "",
  ].join("\n"),
  "utf8",
);

console.log(`Updated MWD indexes for ${concepts.length} concepts across ${grouped.size} categories.`);
