#!/usr/bin/env node
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const BUNDLE_ROOT = path.resolve(process.env.OKF_BUNDLE_ROOT ?? "knowledge");

async function markdownFiles(root) {
  const files = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const resolved = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(resolved);
      else if (entry.isFile() && entry.name.endsWith(".md")) files.push(resolved);
    }
  }
  await walk(root);
  return files.sort();
}

function linkDestinations(markdown) {
  const destinations = [];
  for (let start = 0; start < markdown.length; start += 1) {
    const open = markdown.indexOf("](", start);
    if (open < 0) break;
    let depth = 1;
    let cursor = open + 2;
    let escaped = false;
    for (; cursor < markdown.length; cursor += 1) {
      const character = markdown[cursor];
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
    if (depth === 0) destinations.push(markdown.slice(open + 2, cursor).trim());
    start = cursor;
  }
  return destinations;
}

function decodePath(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function resolveInternalLink(filePath, destination) {
  let href = destination.replace(/^<|>$/gu, "").split("#", 1)[0].split("?", 1)[0];
  if (!href || /^[a-z][a-z0-9+.-]*:/iu.test(href)) return undefined;
  href = decodePath(href);
  const target = href.startsWith("/")
    ? path.join(BUNDLE_ROOT, href)
    : path.resolve(path.dirname(filePath), href);
  if (target !== BUNDLE_ROOT && !target.startsWith(`${BUNDLE_ROOT}${path.sep}`)) {
    return { href: destination, target, problem: "escapes bundle root" };
  }
  try {
    const targetStat = await stat(target);
    const resolved = targetStat.isDirectory() ? path.join(target, "index.md") : target;
    await access(resolved);
    return { href: destination, target: resolved };
  } catch {
    return { href: destination, target, problem: "target does not exist" };
  }
}

const files = await markdownFiles(BUNDLE_ROOT);
const broken = [];
let internalLinks = 0;
for (const filePath of files) {
  const markdown = await readFile(filePath, "utf8");
  for (const destination of linkDestinations(markdown)) {
    const result = await resolveInternalLink(filePath, destination);
    if (!result) continue;
    internalLinks += 1;
    if (result.problem) {
      broken.push({
        source: path.relative(BUNDLE_ROOT, filePath).replaceAll(path.sep, "/"),
        destination,
        resolved: path.relative(BUNDLE_ROOT, result.target).replaceAll(path.sep, "/"),
        problem: result.problem,
      });
    }
  }
}

if (broken.length > 0) {
  console.error(JSON.stringify({ markdown_files: files.length, internal_links: internalLinks, broken }, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Validated ${internalLinks} internal Markdown links across ${files.length} OKF Markdown files.`);
}
