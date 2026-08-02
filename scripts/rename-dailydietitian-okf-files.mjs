#!/usr/bin/env node
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { extractFrontmatter, listMarkdownFiles } from "./lib/dataset.mjs";

const OKF_ROOT = process.env.DAILYDIETITIAN_OKF_ROOT ?? "knowledge/menu-items/dailydietitian";
const REPORT_PATH = process.env.DAILYDIETITIAN_DRAFT_REPORT ?? "reports/dailydietitian/generated-drafts.json";
const SHORT_ID_LENGTH = 12;
const MAX_STEM_LENGTH = 80;
const WINDOWS_RESERVED = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$/iu;

function readableStem(value) {
  let stem = String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^-+|-+$/gu, "");

  stem = [...stem].slice(0, MAX_STEM_LENGTH).join("").replace(/-+$/gu, "");
  if (!stem) stem = "food";
  if (WINDOWS_RESERVED.test(stem)) stem = `food-${stem}`;
  return stem;
}

function shortStableId(data) {
  const foodId = String(data?.food?.id ?? "");
  const tail = foodId.split(":").at(-1) ?? "";
  if (/^[a-f0-9]{12,}$/iu.test(tail)) return tail.toLowerCase().slice(0, SHORT_ID_LENGTH);
  return crypto.createHash("sha256").update(foodId).digest("hex").slice(0, SHORT_ID_LENGTH);
}

function normalizedRepoPath(filePath) {
  return filePath.replaceAll(path.sep, "/");
}

async function updateDraftReport(pathByFoodId) {
  let drafts;
  try {
    drafts = JSON.parse(await readFile(REPORT_PATH, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
  if (!Array.isArray(drafts)) throw new Error(`${REPORT_PATH}: expected an array`);

  const updated = drafts.map((draft) => {
    const nextPath = pathByFoodId.get(draft.food_id);
    return nextPath ? { ...draft, okf_path: nextPath } : draft;
  });
  await writeFile(REPORT_PATH, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
}

async function main() {
  const files = await listMarkdownFiles(OKF_ROOT);
  const targets = new Set();
  const pathByFoodId = new Map();
  let renamed = 0;

  for (const filePath of files) {
    const markdown = await readFile(filePath, "utf8");
    const data = extractFrontmatter(markdown, filePath);
    const foodId = String(data?.food?.id ?? "");
    if (!foodId.startsWith("food:tw:menu:dailydietitian:")) {
      throw new Error(`${filePath}: unexpected food.id ${foodId}`);
    }

    const fileName = `${readableStem(data?.food?.name ?? data?.title)}--${shortStableId(data)}.md`;
    const targetPath = path.join(path.dirname(filePath), fileName);
    const targetKey = normalizedRepoPath(targetPath).normalize("NFC");
    if (targets.has(targetKey)) throw new Error(`Readable filename collision: ${targetPath}`);
    targets.add(targetKey);

    if (filePath !== targetPath) {
      await rename(filePath, targetPath);
      renamed += 1;
    }
    pathByFoodId.set(foodId, normalizedRepoPath(targetPath));
  }

  await updateDraftReport(pathByFoodId);
  console.log(`Normalized ${files.length} DailyDietitian concept filenames; renamed ${renamed}.`);
}

await main();
