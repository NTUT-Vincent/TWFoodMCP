#!/usr/bin/env node
/**
 * Normalize the knowledge OKF bundle toward best-practice OKF v0.2:
 *
 * 1. Rename concept files whose names carry no real-world meaning (pure hash
 *    stems, leading dashes, or hash suffixes) to names derived from their
 *    frontmatter `title`, disambiguating collisions with meaningful
 *    qualifiers (serving basis, source record id, stable id tail).
 * 2. Reorganize the deprecated import archives into meaningful directories:
 *    `dailydietitian-deprecated/<brand-or-article-slug>/` and
 *    `google-sheet-deprecated/<brand-slug>/` (record-range buckets dissolved).
 * 3. Rewrite every internal Markdown link affected by renames and moves.
 * 4. Repair pre-existing broken links by resolving targets through the
 *    food.id index and name matching.
 * 5. Generate index.md for directories that lack one (OKF progressive
 *    disclosure) and refresh the archive indexes.
 *
 * The pass is deterministic and idempotent: running it again changes nothing.
 * food.id values and all frontmatter content are preserved; only paths change.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { parse } from "yaml";

const KNOWLEDGE_ROOT = path.resolve("knowledge");
const MENU_ROOT = path.join(KNOWLEDGE_ROOT, "menu-items");
const DD_ROOT = path.join(MENU_ROOT, "dailydietitian-deprecated");
const GS_ROOT = path.join(MENU_ROOT, "google-sheet-deprecated");
const REPORT_PATH = "reports/okf-filename-normalization-2026-10-25.json";
const RESERVED = new Set(["index.md", "log.md"]);
const MAX_FILENAME_BYTES = 255;
const WINDOWS_RESERVED = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/iu;

/**
 * Depth-aware Markdown link scanner (same algorithm as scripts/check-okf-links.mjs).
 * Yields { destStart, destEnd, dest } spans for every `](destination)` occurrence,
 * handling nested parentheses and escapes that plain regexes truncate.
 */
function* linkSpans(markdown) {
  for (let start = 0; start < markdown.length; start += 1) {
    const open = markdown.indexOf("](", start);
    if (open < 0) return;
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
    if (depth === 0) {
      yield { destStart: open + 2, destEnd: cursor, dest: markdown.slice(open + 2, cursor) };
    }
    start = cursor;
  }
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function walkFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(resolved, acc);
    else if (entry.isFile() && entry.name.endsWith(".md")) acc.push(resolved);
  }
  return acc;
}

function walkDirs(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      acc.push(resolved);
      walkDirs(resolved, acc);
    }
  }
  return acc;
}

function splitFrontmatter(markdown) {
  const match = markdown.replace(/^\uFEFF/u, "").match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  if (!match) return null;
  try {
    const data = parse(match[1]);
    return data && typeof data === "object" && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

function truncateUtf8(text, maxBytes) {
  let out = "";
  let size = 0;
  for (const char of text) {
    const len = Buffer.byteLength(char, "utf8");
    if (size + len > maxBytes) break;
    out += char;
    size += len;
  }
  return out.replace(/[._\s-]+$/u, "");
}

function normalizeName(value) {
  let name = String(value ?? "").normalize("NFKC");
  name = name.replace(/[\u0000-\u001f<>:"/\\|?*#]/gu, "_");
  name = name.replace(/\s+/gu, "_");
  name = name.replace(/_+/gu, "_").replace(/^[._]+|[._]+$/gu, "");
  if (WINDOWS_RESERVED.test(name)) name = `food-${name}`;
  return name;
}

function sanitizeQualifier(value) {
  const cleaned = String(value ?? "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .trim();
  return truncateUtf8(cleaned, 24);
}

// ---------------------------------------------------------------------------
// Meaningful collision qualifiers derived from frontmatter
// ---------------------------------------------------------------------------

function primaryQualifier(data) {
  const serving = data?.extraction?.serving_basis;
  if (typeof serving === "string" && serving.trim()) {
    const q = sanitizeQualifier(serving);
    if (q) return q;
  }
  const record = data?.revision?.record_id ?? data?.extraction?.record_id;
  if (typeof record === "string" && record.trim()) {
    const q = sanitizeQualifier(record);
    if (q) return q;
  }
  const candidate = data?.extraction?.candidate_id;
  if (typeof candidate === "string" && candidate.includes(":")) {
    const tail = candidate.split(":").pop();
    if (tail && tail.length >= 8) return sanitizeQualifier(tail).toLowerCase();
  }
  return idTail(data);
}

function idTail(data) {
  const foodId = String(data?.food?.id ?? "");
  const tail = foodId.split(":").pop() ?? "";
  return sanitizeQualifier(tail).toLowerCase() || "doc";
}

/** Untruncated food.id tail for cases where the 24-char qualifier collides. */
function fullIdTail(data) {
  const foodId = String(data?.food?.id ?? "");
  const tail = (foodId.split(":").pop() ?? "").normalize("NFKC").replace(/[^\p{L}\p{N}-]+/gu, "");
  return truncateUtf8(tail.toLowerCase(), 80) || "doc";
}

/** Final uniqueness fallback: 12 stable hex chars derived from the food.id. */
function stableId12(data) {
  const foodId = String(data?.food?.id ?? "");
  return crypto.createHash("sha256").update(foodId).digest("hex").slice(0, 12);
}

/** Build a filename, truncating the base so the whole name fits the limit. */
function buildName(base, qualifiers) {
  const suffix = qualifiers.filter(Boolean).map((q) => `_${q}`).join("");
  const budget = MAX_FILENAME_BYTES - Buffer.byteLength(`${suffix}.md`, "utf8") - 10;
  const trimmedBase = truncateUtf8(base, Math.max(budget, 20));
  return `${trimmedBase}${suffix}.md`;
}

// ---------------------------------------------------------------------------
// Directory plans (meaningful, reviewed by hand)
// ---------------------------------------------------------------------------

const DD_DIR_RENAMES = {
  "10": "top10-nuts-calories",
  "21plus": "21st-century-flavor-factory",
  "3": "chunshuitang-diet-guide",
  "3------------and-----4": "mwd-diet-guide",
  "3--1": "lunar-new-year-feast",
  "5": "high-calorie-swaps",
  "50": "50lagu",
  "6": "high-fiber-fruits",
  "9-------------------------3": "bubble-tea-calorie-ranking",
  and: "dingguagua",
  "item-045fb152c655": "wutonghao",
  "item-2a77de5b7b85": "kebuke",
  "item-2b717800eea0": "laiya-burger",
  "item-471f7ead6925": "sanshang-qiaofu",
  "item-47dc1b17742b": "wanpo",
  "item-4ed4a7c329a6": "sihai-youlong",
  "item-500602f97225": "daming-tea",
  "item-5900ca840ce9": "dayuanzi",
  "item-676f2c5a5d6a": "chingshin-fuquan",
  "item-697dfe81a17e": "dragon-boat-festival",
  "item-7126918c678a": "laiya-burger-diet-guide",
  "item-721c6afba121": "mwd-calorie-chart",
  "item-7e805a1230c0": "laotsai-shuijianbao",
  "item-81aa6e097479": "alcohol-calories",
  "item-88ad954bd06a": "chunshuitang-menu",
  "item-8d2a71cbc7cb": "bafangyunji",
  "item-a8be64e70c23": "dezheng",
  "item-af49f0d2b127": "mid-autumn-bbq",
  "item-c57d0efc4237": "macuteafang",
  "item-c8ca0e724e7d": "dicos",
  "item-cfcffbbb93ba": "lunar-new-year-goods",
  "item-d4c1ab174b91": "teatop",
  "item-d9950c82423f": "wojia-steak",
  "item-f799986795ae": "yimuri",
  "burger-king": "burgerking",
  marugame: "marugame-seimen",
};

const GS_BRAND_SLUGS = {
  "7-ELEVEN": "7-eleven",
  "7-ELEVEN CITY TEA／CITY PEARL": "7-eleven",
  "7-ELEVEN CITY CAFE": "7-eleven",
  "全家 FamilyMart": "familymart",
  全家: "familymart",
  "50嵐": "50lagu",
  麻古茶坊: "macuteafang",
  "星巴克 Starbucks": "starbucks",
  得正: "dezheng",
  八方雲集: "bafangyunji",
  "摩斯漢堡 MOS Burger": "mos-burger",
  "必勝客 Pizza Hut": "pizza-hut",
  OKmart: "okmart",
  丸龜製麵: "marugame-seimen",
  "萊爾富 Hi-Life": "laifu",
  "萊爾富 Hi-Life／Hi Café": "laifu",
  "萊爾富 Hi-Life／KAARO": "laifu",
  "台灣麥當勞 McDonald's": "mcdonalds",
  "21世紀風味館": "21st-century-flavor-factory",
  早安美芝城: "morning-michishiki",
  麥味登: "mwd",
  拉亞漢堡: "laiya-burger",
  壽司郎: "sushiro",
  台灣熱門泡麵: "instant-noodles",
  呷尚寶: "kenshui",
  弘爺漢堡: "honger-burger",
  爭鮮: "zazengbao",
  藏壽司: "kura-sushi",
  非品牌食譜: "generic-recipes",
  一般壽司估算: "generic-sushi",
  "路易莎咖啡 LOUISA COFFEE": "louisa",
  SUBWAY: "subway",
  "漢堡王 Burger King": "burgerking",
  "肯德基 KFC": "kfc",
};

function gsBrandSlug(brand) {
  return GS_BRAND_SLUGS[String(brand ?? "").trim()] ?? "other";
}

// ---------------------------------------------------------------------------
// Load documents
// ---------------------------------------------------------------------------

const RESERVED_FILES = new Set(["index.md", "log.md"]);
const initialFiles = walkFiles(KNOWLEDGE_ROOT);
const docs = new Map(); // abs path -> { data, markdown }
for (const file of initialFiles) {
  const markdown = readFileSync(file, "utf8");
  const data = RESERVED_FILES.has(path.basename(file)) ? null : splitFrontmatter(markdown);
  docs.set(file, { data, markdown });
}

// ---------------------------------------------------------------------------
// Path key helper (case-insensitive on Windows)
// ---------------------------------------------------------------------------

const pathKey = (p) => (process.platform === "win32" ? path.resolve(p).toLowerCase() : path.resolve(p));

// ---------------------------------------------------------------------------
// Naming planner: keep meaningful names, rename meaningless ones, and
// disambiguate every collision with meaningful qualifiers.
// ---------------------------------------------------------------------------

const MEANINGLESS_STEM = /^[0-9a-f]{8,}$/i;
const LEADING_DASHES = /^-+/;
const HASH_SUFFIX = /--[0-9a-f]{8,}$/i;
const DASH_HEX_SUFFIX = /-[0-9a-f]{12}$/i;

function isMeaninglessName(fileName) {
  const stem = path.basename(fileName, ".md");
  return MEANINGLESS_STEM.test(stem) || LEADING_DASHES.test(stem) || HASH_SUFFIX.test(stem) || DASH_HEX_SUFFIX.test(stem);
}

function desiredBase(doc) {
  const title = doc.data?.title ?? doc.data?.food?.name ?? "";
  const base = normalizeName(title);
  return base ? truncateUtf8(base, 200) : null;
}

/**
 * Plan final names for `entries` (all destined for the same directory).
 * entries: [{ file, doc, keepName }] where keepName means the current name is
 * already meaningful and must not change unless it collides.
 */
function planNamesForDirectory(entries) {
  const finalNames = new Map(); // file -> final file name
  const claimed = new Set(); // lowercase final name

  const keepers = new Map(); // lowercase current name -> entries (usually 1)
  const renamers = [];
  for (const entry of entries) {
    if (entry.keepName) {
      const name = path.basename(entry.file);
      (keepers.get(name.toLowerCase()) ?? keepers.set(name.toLowerCase(), []).get(name.toLowerCase())).push(entry);
    } else {
      renamers.push(entry);
    }
  }

  // Keepers keep their name; if several land in the same directory with the
  // same name, every member gets a meaningful qualifier.
  for (const group of keepers.values()) {
    if (group.length === 1) {
      const keep = path.basename(group[0].file);
      claimed.add(keep.toLowerCase());
      finalNames.set(group[0].file, keep);
      continue;
    }
    for (const entry of group) {
      const q = primaryQualifier(entry.doc.data) || idTail(entry.doc.data);
      let name = buildName(path.basename(entry.file, ".md"), [q]);
      if (claimed.has(name.toLowerCase())) {
        name = buildName(path.basename(entry.file, ".md"), [q, stableId12(entry.doc.data)]);
      }
      if (claimed.has(name.toLowerCase())) throw new Error(`keeper collision: ${name}`);
      claimed.add(name.toLowerCase());
      finalNames.set(entry.file, name);
    }
  }

  // Renamers get title-derived names; collisions escalate through qualifiers.
  const groups = new Map();
  for (const entry of renamers) {
    const key = entry.base.toLowerCase();
    (groups.get(key) ?? groups.set(key, []).get(key)).push(entry);
  }
  for (const group of groups.values()) {
    const single = (entry, q) => {
      const pq = q || primaryQualifier(entry.doc.data) || idTail(entry.doc.data);
      const candidates = [
        q ? buildName(entry.base, [q]) : buildName(entry.base, []),
        buildName(entry.base, [pq]),
        buildName(entry.base, [pq, idTail(entry.doc.data)]),
        buildName(entry.base, [pq, stableId12(entry.doc.data)]),
      ];
      for (const name of candidates) {
        if (!claimed.has(name.toLowerCase())) {
          claimed.add(name.toLowerCase());
          finalNames.set(entry.file, name);
          return;
        }
      }
      throw new Error(`unresolvable filename collision: ${entry.base}`);
    };

    if (group.length === 1) {
      single(group[0], "");
      continue;
    }
    const subs = new Map();
    for (const entry of group) {
      let q = primaryQualifier(entry.doc.data) || idTail(entry.doc.data);
      // A qualifier that repeats the base's trailing segment adds nothing.
      const baseTail = entry.base.split("_").pop()?.toLowerCase();
      if (q.toLowerCase() === baseTail) q = "";
      // Two members whose id tails truncate identically are separated by the
      // full untruncated tail instead of a hash.
      if (!q || q === idTail(entry.doc.data)) q = fullIdTail(entry.doc.data);
      (subs.get(q) ?? subs.set(q, []).get(q)).push(entry);
    }
    for (const [q, sub] of subs) {
      if (sub.length === 1) {
        single(sub[0], q);
      } else {
        for (const entry of sub) {
          let name = buildName(entry.base, [q, idTail(entry.doc.data)]);
          if (claimed.has(name.toLowerCase())) {
            name = buildName(entry.base, [q, stableId12(entry.doc.data)]);
          }
          if (claimed.has(name.toLowerCase())) throw new Error(`unresolvable filename collision: ${name}`);
          claimed.add(name.toLowerCase());
          finalNames.set(entry.file, name);
        }
      }
    }
  }
  return finalNames;
}

// ---------------------------------------------------------------------------
// Compose the full old -> final path map
// ---------------------------------------------------------------------------

function composeFinalMap() {
  // google-sheet-deprecated: dissolve record-range buckets into brand dirs.
  const moves = new Map(); // old abs -> { dir, name }
  const bucketDirs = [];
  const perTargetDir = new Map();
  if (existsSync(GS_ROOT)) {
    for (const entry of readdirSync(GS_ROOT, { withFileTypes: true })) {
      // Only the original record-range buckets dissolve; brand dirs persist.
      if (!entry.isDirectory() || !/^\d{5}-\d{5}$/u.test(entry.name)) continue;
      const bucketDir = path.join(GS_ROOT, entry.name);
      bucketDirs.push(bucketDir);
      for (const file of walkFiles(bucketDir)) {
        if (RESERVED_FILES.has(path.basename(file))) continue;
        const doc = docs.get(file);
        const brand = doc?.data?.food?.brand ?? doc?.data?.brand;
        const targetDir = path.join(GS_ROOT, gsBrandSlug(brand));
        const base = desiredBase(doc) ?? path.basename(file, ".md");
        if (!perTargetDir.has(targetDir)) perTargetDir.set(targetDir, []);
        perTargetDir.get(targetDir).push({ file, doc, keepName: false, base });
      }
    }
  }
  for (const [targetDir, entries] of perTargetDir) {
    for (const [file, name] of planNamesForDirectory(entries)) {
      moves.set(file, { dir: targetDir, name });
    }
  }

  // In-place renames everywhere else.
  const byDir = new Map();
  for (const [file, doc] of docs) {
    if (!doc.data) continue; // reserved files
    if (moves.has(file)) continue;
    const dir = path.dirname(file);
    if (!byDir.has(dir)) byDir.set(dir, []);
    const meaningless = isMeaninglessName(path.basename(file));
    const base = desiredBase(doc) ?? path.basename(file, ".md");
    byDir.get(dir).push({ file, doc, keepName: !meaningless, base });
  }

  const finalPath = new Map(); // pathKey(old abs) -> final abs
  for (const [, entries] of byDir) {
    for (const [file, name] of planNamesForDirectory(entries)) {
      finalPath.set(pathKey(file), path.join(path.dirname(file), name));
    }
  }
  for (const [file, target] of moves) {
    finalPath.set(pathKey(file), path.join(target.dir, target.name));
  }

  // dailydietitian-deprecated directory renames.
  const dirRename = new Map(); // pathKey(old dir) -> new dir abs
  const dirRenamePaths = []; // original old dir paths, for cleanup
  for (const [oldName, newName] of Object.entries(DD_DIR_RENAMES)) {
    const oldDir = path.join(DD_ROOT, oldName);
    if (existsSync(oldDir)) {
      dirRename.set(pathKey(oldDir), path.join(DD_ROOT, newName));
      dirRenamePaths.push(oldDir);
      // The directory's index.md moves with it (links get rewritten later).
      const oldIndex = path.join(oldDir, "index.md");
      if (existsSync(oldIndex)) finalPath.set(pathKey(oldIndex), path.join(DD_ROOT, newName, "index.md"));
    }
  }

  // Apply directory renames to every mapped file beneath them.
  for (const [oldKey, mapped] of [...finalPath]) {
    const chain = [];
    let currentDir = path.dirname(mapped);
    let guard = 0;
    while (guard++ < 32) {
      const renamed = dirRename.get(pathKey(currentDir));
      if (renamed) {
        chain.push([currentDir, renamed]);
        currentDir = path.dirname(renamed);
      } else {
        const parent = path.dirname(currentDir);
        if (parent === currentDir) break;
        currentDir = parent;
      }
    }
    let final = mapped;
    for (const [from, to] of chain) final = to + final.slice(from.length);
    finalPath.set(oldKey, final);
  }

  return { finalPath, dirRename, dirRenamePaths, bucketDirs };
}

const { finalPath, dirRename, dirRenamePaths, bucketDirs } = composeFinalMap();
const oldByFinalKey = new Map(); // pathKey(final) -> original old abs
{
  const keyToOriginal = new Map();
  for (const file of docs.keys()) keyToOriginal.set(pathKey(file), file);
  for (const [oldKey, final] of finalPath) {
    const original = keyToOriginal.get(oldKey);
    if (original) oldByFinalKey.set(pathKey(final), original);
  }
}

// ---------------------------------------------------------------------------
// Apply renames and moves (two-phase, temp staged)
// ---------------------------------------------------------------------------

let appliedFileRenames = 0;
let appliedMoves = 0;
let appliedDirRenames = 0;

{
  const oldByKey = new Map();
  for (const file of docs.keys()) oldByKey.set(pathKey(file), file);

  // Phase 1: rename files within their current directories.
  const crossDir = [];
  for (const [oldKey, final] of finalPath) {
    const old = oldByKey.get(oldKey);
    if (!old) continue;
    if (pathKey(old) === pathKey(final)) continue;
    if (pathKey(path.dirname(old)) === pathKey(path.dirname(final))) {
      const temp = path.join(path.dirname(old), `.okf-move-${Math.random().toString(36).slice(2)}.tmp`);
      renameSync(old, temp);
      renameSync(temp, final);
      appliedFileRenames += 1;
    } else {
      crossDir.push([old, final]);
    }
  }

  // Phase 2: cross-directory moves (dd archive dirs + google-sheet buckets).
  // Directories themselves are not renamed; files move individually and the
  // emptied source directories are removed afterwards.
  for (const [old, final] of crossDir) {
    if (!existsSync(old)) throw new Error(`source disappeared before move: ${old}`);
    const temp = path.join(path.dirname(old), `.okf-move-${Math.random().toString(36).slice(2)}.tmp`);
    renameSync(old, temp);
    mkdirSync(path.dirname(final), { recursive: true });
    renameSync(temp, final);
    appliedFileRenames += 1;
    appliedMoves += 1;
  }

  // Phase 3: dissolve google-sheet bucket directories (their index files are
  // superseded by the generated brand-directory indexes).
let removedBucketIndexes = 0;
for (const bucketDir of bucketDirs) {
  if (!existsSync(bucketDir)) continue;
  for (const entry of readdirSync(bucketDir)) {
    const p = path.join(bucketDir, entry);
    if (entry === "index.md") {
      rmSync(p, { force: true });
      removedBucketIndexes += 1;
    } else {
      throw new Error(`unexpected leftover in bucket: ${p}`);
    }
  }
  rmSync(bucketDir, { recursive: true, force: true });
  appliedDirRenames += 1;
}

  // Phase 4: remove the emptied dailydietitian source directories.
  for (const dir of dirRenamePaths) {
    if (!existsSync(dir)) continue;
    const remaining = readdirSync(dir);
    if (remaining.length > 0) throw new Error(`expected empty directory: ${dir} (${remaining.length} entries)`);
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Rewrite links across all Markdown files (resolving against the OLD layout)
// ---------------------------------------------------------------------------

const filesNow = walkFiles(KNOWLEDGE_ROOT);
const contentNow = new Map();
for (const file of filesNow) contentNow.set(file, readFileSync(file, "utf8"));

function decodeHref(href) {
  try {
    return decodeURIComponent(href);
  } catch {
    return href;
  }
}

function oldDirOf(file) {
  const oldKey = oldByFinalKey.get(pathKey(file));
  return oldKey ? path.dirname(oldKey) : path.dirname(file);
}

function resolveOldTarget(sourceFile, href) {
  const cleaned = href.replace(/^<|>$/gu, "").split("#", 1)[0].split("?", 1)[0];
  if (!cleaned) return null;
  const decoded = decodeHref(cleaned);
  const target = decoded.startsWith("/")
    ? path.join(KNOWLEDGE_ROOT, decoded)
    : path.resolve(oldDirOf(sourceFile), decoded);
  const norm = (p) => (process.platform === "win32" ? p.toLowerCase() : p);
  if (!norm(target).startsWith(norm(KNOWLEDGE_ROOT))) return null;
  return { cleaned, decoded, target };
}

/** Old-layout target -> current absolute path, or null when unchanged/unknown. */
function mapOldTarget(oldAbs) {
  const final = finalPath.get(pathKey(oldAbs));
  if (final && pathKey(final) !== pathKey(oldAbs)) return final;
  const renamedDir = dirRename.get(pathKey(oldAbs));
  if (renamedDir) return renamedDir;
  if (existsSync(oldAbs)) return oldAbs; // unchanged
  return null;
}

function destForTarget(sourceFile, originalDest, targetAbs) {
  const originalMain = originalDest.split("#", 1)[0];
  const fragment = originalDest.slice(originalMain.length);
  const wasEncoded = originalMain.includes("%");
  const wasAbsolute = decodeHref(originalMain).startsWith("/");
  const isDir = existsSync(targetAbs) && !targetAbs.endsWith(".md");

  let destPath;
  if (wasAbsolute) {
    destPath = `/${toPosixAbs(path.relative(KNOWLEDGE_ROOT, targetAbs))}`;
  } else {
    destPath = toPosixAbs(path.relative(path.dirname(sourceFile), targetAbs));
    if (!destPath.startsWith(".")) destPath = `./${destPath}`;
  }
  const main = wasEncoded ? encodeURI(isDir ? `${destPath}/` : destPath) : isDir ? `${destPath}/` : destPath;
  return main + fragment;
}

function toPosixAbs(p) {
  return p.replaceAll(path.sep, "/");
}

// Indexes for repairing pre-existing broken links.
const foodIdIndex = new Map(); // id tail -> abs paths[]
const nameVariantIndex = new Map(); // "<dirKey>|<variant>" -> abs paths[]
for (const [file, markdown] of contentNow) {
  if (RESERVED_FILES.has(path.basename(file))) continue;
  const data = splitFrontmatter(markdown);
  if (!data) continue;
  const foodId = String(data.food?.id ?? "");
  const tail = foodId ? foodId.split(":").pop() : "";
  if (tail) {
    if (!foodIdIndex.has(tail)) foodIdIndex.set(tail, []);
    foodIdIndex.get(tail).push(file);
  }
  const stem = path.basename(file, ".md");
  const variants = new Set([stem.toLowerCase()]);
  let idx = stem.indexOf("_");
  while (idx > 0 && idx < stem.length - 1) {
    variants.add(stem.slice(idx + 1).toLowerCase());
    idx = stem.indexOf("_", idx + 1);
  }
  // Separator-insensitive variants so `brand-name` links match `brand_name.md`.
  for (const variant of [...variants]) {
    variants.add(variant.replace(/[-_]/gu, "_"));
  }
  for (const variant of variants) {
    const key = `${pathKey(path.dirname(file))}|${variant}`;
    if (!nameVariantIndex.has(key)) nameVariantIndex.set(key, []);
    nameVariantIndex.get(key).push(file);
  }
}

function stripLegacySuffix(stem) {
  return stem.replace(/-[0-9a-f]{12}$/iu, "").replace(/-\d+$/u, "").toLowerCase();
}

function repairBrokenTarget(oldTarget) {
  if (existsSync(path.join(oldTarget, "index.md"))) return "index-created";
  const stem = path.basename(oldTarget, ".md");
  const dirKey = pathKey(path.dirname(oldTarget));

  const idMatches = foodIdIndex.get(stem);
  if (idMatches && idMatches.length === 1) return idMatches[0];

  const cleaned = stripLegacySuffix(stem).replace(/[-_]/gu, "_");
  const matches = nameVariantIndex.get(`${dirKey}|${cleaned}`);
  if (matches && matches.length === 1) return matches[0];

  return null;
}

const unresolvedBroken = [];
let rewrittenLinks = 0;
let repairedLinks = 0;
{
  const edits = new Map(); // file -> [{ destStart, destEnd, newDest, kind }]
  for (const [file, markdown] of contentNow) {
    const found = [];
    for (const span of linkSpans(markdown)) {
      const dest = span.dest.trim();
      if (!dest || /^(https?:|mailto:|#)/i.test(dest)) continue;
      const resolved = resolveOldTarget(file, dest);
      if (!resolved) continue;
      const { target } = resolved;

      let newTarget = null;
      let kind = "rewrite";
      if (finalPath.has(pathKey(target))) {
        newTarget = mapOldTarget(target);
        if (!newTarget || pathKey(newTarget) === pathKey(target)) continue; // unchanged
      } else if (existsSync(target)) {
        continue; // unchanged target that was never renamed
      } else {
        const renamedDir = dirRename.get(pathKey(target));
        if (renamedDir) {
          newTarget = renamedDir;
        } else {
          newTarget = repairBrokenTarget(target);
          kind = "repair";
          if (!newTarget || newTarget === "index-created") {
            if (newTarget !== "index-created") unresolvedBroken.push({ source: toPosixAbs(file), dest });
            continue;
          }
        }
      }
      const newDest = destForTarget(file, dest, newTarget);
      if (!newDest || newDest === dest) continue;
      found.push({ destStart: span.destStart, destEnd: span.destEnd, newDest, kind });
    }
    if (found.length) edits.set(file, found);
  }

  for (const [file, spans] of edits) {
    let text = contentNow.get(file);
    // Apply from the end so earlier offsets stay valid.
    spans.sort((a, b) => b.destStart - a.destStart);
    for (const span of spans) {
      text = text.slice(0, span.destStart) + span.newDest + text.slice(span.destEnd);
      if (span.kind === "repair") repairedLinks += 1;
      else rewrittenLinks += 1;
    }
    writeFileSync(file, text, "utf8");
    contentNow.set(file, text);
  }
}

// ---------------------------------------------------------------------------
// Generate index.md files (OKF progressive disclosure)
// ---------------------------------------------------------------------------

function oneLine(value) {
  return String(value ?? "").replace(/\s+/gu, " ").trim();
}

function generateIndex(dir) {
  const conceptFiles = walkFiles(dir).filter((f) => path.dirname(f) === dir && !RESERVED_FILES.has(path.basename(f)));
  const subdirs = readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== ".git")
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hant"));

  const rel = toPosixAbs(path.relative(KNOWLEDGE_ROOT, dir));
  const lines = [];
  lines.push(`# ${path.basename(dir)}`, "");
  if (rel === "menu-items/dailydietitian-deprecated") {
    lines.push("日日營養熱量圖鑑候選與來源比對草稿，依品牌或來源文章分組，全部維持未驗證 draft。", "");
  } else if (rel === "menu-items/google-sheet-deprecated") {
    lines.push("TWFood Google Sheet 匯入的營養觀測 draft 封存，依品牌分組，全部維持未驗證 draft。", "");
  }

  if (subdirs.length) {
    lines.push("# Subdirectories", "");
    for (const sub of subdirs) {
      const count = walkFiles(path.join(dir, sub)).filter((f) => !RESERVED_FILES.has(path.basename(f))).length;
      lines.push(`* [${sub}](${encodeURI(sub)}/) - ${count} 份概念文件。`);
    }
    lines.push("");
  }
  if (conceptFiles.length) {
    lines.push("# Concepts", "");
    const meta = conceptFiles.map((file) => {
      const data = splitFrontmatter(readFileSync(file, "utf8"));
      return { file, title: oneLine(data?.title) || path.basename(file, ".md"), description: oneLine(data?.description) };
    });
    meta.sort((a, b) => a.title.localeCompare(b.title, "zh-Hant"));
    for (const { file, title, description } of meta) {
      lines.push(`* [${title}](${encodeURI(path.basename(file))})${description ? ` - ${description}` : ""}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

let createdIndexes = 0;
{
  for (const dir of walkDirs(KNOWLEDGE_ROOT)) {
    if (toPosixAbs(dir).endsWith("starbucks/raw")) continue; // raw assets only, no concepts
    const index = path.join(dir, "index.md");
    if (existsSync(index)) continue;
    const hasConcepts = walkFiles(dir).some((f) => path.dirname(f) === dir && !RESERVED_FILES.has(path.basename(f)));
    const hasSubdirs = readdirSync(dir, { withFileTypes: true }).some((e) => e.isDirectory());
    if (!hasConcepts && !hasSubdirs) continue;
    writeFileSync(index, generateIndex(dir), "utf8");
    createdIndexes += 1;
  }
  // Refresh the two archive indexes whose children were reorganized.
  for (const archive of [DD_ROOT, GS_ROOT]) {
    if (existsSync(archive)) writeFileSync(path.join(archive, "index.md"), generateIndex(archive), "utf8");
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const report = {
  generated_at: new Date().toISOString(),
  okf_version: "0.2",
  file_renames_applied: appliedFileRenames,
  file_moves_applied: appliedMoves,
  directory_renames_applied: appliedDirRenames,
  directories_dissolved: bucketDirs.length,
  links_rewritten: rewrittenLinks,
  broken_links_repaired: repairedLinks,
  unresolved_broken_links: unresolvedBroken,
  indexes_created: createdIndexes,
};
mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
