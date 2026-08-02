#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { stringify } from "yaml";
import { loadOkfDocuments } from "./lib/dataset.mjs";
import {
  extractCategoryArticleUrls,
  extractModifiedDate,
  extractNutritionCandidates,
  extractTitle,
  inferBrand,
  matchAgainstOfficialDocuments,
  parseRobots,
  robotsAllows,
  slugify,
} from "./lib/dailydietitian.mjs";

const CATEGORY_URL = process.env.DAILYDIETITIAN_CATEGORY_URL ?? "https://dailydietitian.com.tw/category/calorie-guide/";
const MAX_CATEGORY_PAGES = positiveInteger(process.env.DAILYDIETITIAN_MAX_CATEGORY_PAGES, 8);
const MAX_ARTICLES = nonNegativeInteger(process.env.DAILYDIETITIAN_MAX_ARTICLES, 0);
const REQUEST_DELAY_MS = nonNegativeInteger(process.env.DAILYDIETITIAN_REQUEST_DELAY_MS, 850);
const CONFIG_PATH = process.env.DAILYDIETITIAN_CONFIG ?? "config/dailydietitian-sources.json";
const DISCOVERY_ROOT = process.env.DAILYDIETITIAN_DISCOVERY_ROOT ?? "references/discovery/dailydietitian";
const REPORT_ROOT = process.env.DAILYDIETITIAN_REPORT_ROOT ?? "reports/dailydietitian";
const OKF_ROOT = process.env.DAILYDIETITIAN_OKF_ROOT ?? "knowledge/menu-items/dailydietitian";
const USER_AGENT = process.env.DAILYDIETITIAN_USER_AGENT
  ?? "TWFoodMCP/0.1 (+https://github.com/NTUT-Vincent/TWFoodMCP; factual nutrition discovery crawler)";
const RUN_DATE = process.env.DAILYDIETITIAN_RUN_DATE ?? taipeiDate(new Date());
const RETRIEVED_AT = process.env.DAILYDIETITIAN_RETRIEVED_AT ?? new Date().toISOString();

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function nonNegativeInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function taipeiDate(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addMonths(dateString, months) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, day));
  return date.toISOString().slice(0, 10);
}

function sleep(milliseconds) {
  return milliseconds > 0 ? new Promise((resolve) => setTimeout(resolve, milliseconds)) : Promise.resolve();
}

async function fetchText(url, { retries = 2, allowNonHtml = false } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": USER_AGENT,
          accept: allowNonHtml ? "text/plain,text/html;q=0.9,*/*;q=0.5" : "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
          "accept-language": "zh-TW,zh;q=0.9,en;q=0.6",
        },
        redirect: "follow",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const text = await response.text();
      await sleep(REQUEST_DELAY_MS);
      return { text, finalUrl: response.url, contentType: response.headers.get("content-type") ?? "" };
    } catch (error) {
      lastError = error;
      if (attempt < retries) await sleep(500 * (attempt + 1));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`Failed to fetch ${url}: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function articleFileName(url) {
  const parsed = new URL(url);
  const finalSegment = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).at(-1) ?? "article");
  const safe = slugify(finalSegment).slice(0, 100);
  const digest = crypto.createHash("sha1").update(url).digest("hex").slice(0, 10);
  return `${safe || "article"}-${digest}.json`;
}

function sourceId(url) {
  return `dailydietitian-${crypto.createHash("sha1").update(url).digest("hex").slice(0, 12)}`;
}

function candidateDigest(candidate) {
  const fromId = String(candidate.id ?? "").replace(/^dd:/u, "");
  if (/^[a-f0-9]{12,64}$/u.test(fromId)) return fromId;
  return crypto.createHash("sha256")
    .update(`${candidate.article.url}\n${candidate.table_index}\n${candidate.row_index}\n${candidate.item_name}`)
    .digest("hex")
    .slice(0, 20);
}

function safeSegment(value, fallback = "unclassified") {
  const segment = slugify(value).replace(/[^A-Za-z0-9._-]/gu, "-").replace(/^-+|-+$/gu, "");
  return segment || fallback;
}

function completenessFor(candidate) {
  const count = Object.keys(candidate.nutrition ?? {}).length;
  if (count >= 5) return "nutrition_complete";
  if (count >= 2) return "partial";
  return "minimal";
}

function comparisonMetadata(existing) {
  if (!existing || existing.status === "no_match") return { status: "not_compared_or_no_match" };
  return {
    status: existing.status,
    ...(existing.food_id ? { existing_food_id: existing.food_id } : {}),
    ...(existing.title ? { existing_title: existing.title } : {}),
    ...(existing.file_path ? { existing_file_path: existing.file_path } : {}),
    ...(existing.comparison ? { comparison: existing.comparison } : {}),
  };
}

function draftFrontmatter(candidate, existing) {
  const digest = candidateDigest(candidate);
  const brandName = candidate.brand || "未分類";
  const source = sourceId(candidate.article.url);
  const aliases = [...new Set([
    candidate.item_name,
    `${brandName}${candidate.item_name}`,
    `${brandName} ${candidate.item_name}`,
  ].map((value) => value.trim()).filter(Boolean))];
  const estimated = Boolean(candidate.article.estimated);
  const basisUncertain = Boolean(candidate.basis_inferred);

  return {
    type: "Food Product",
    title: `${brandName} ${candidate.item_name}`.trim(),
    description: "從日日營養文章表格逐列抽取的未驗證食品營養 draft。",
    resource: candidate.article.url,
    tags: [...new Set([
      brandName,
      "日日營養",
      "第三方資料",
      "待人工審核",
      ...(estimated ? ["推估資料"] : []),
      ...(basisUncertain ? ["份量基準待確認"] : []),
    ].filter(Boolean))],
    generated: {
      by: "twfoodmcp-dailydietitian-importer/2.0.0",
      at: RETRIEVED_AT,
    },
    status: "draft",
    stale_after: addMonths(RUN_DATE, 6),
    sources: [
      {
        id: source,
        resource: candidate.article.url,
        title: candidate.article.title,
        author: "dailydietitian/website",
        source_class: estimated ? "estimated_or_untraceable" : "expert_interpretation",
        ...(candidate.article.modified_at ? { last_modified: candidate.article.modified_at } : {}),
        retrieved_at: RETRIEVED_AT,
      },
    ],
    access: { classification: "public" },
    food: {
      id: `food:tw:menu:dailydietitian:${digest}`,
      kind: "menu_item",
      market: "TW",
      brand: brandName,
      name: candidate.item_name,
      aliases,
    },
    revision: {
      revision_id: `dailydietitian-${RUN_DATE}-${digest.slice(0, 12)}`,
    },
    ...(candidate.serving ? { serving: candidate.serving } : {}),
    nutrition: [
      {
        basis: candidate.basis,
        values: candidate.nutrition,
      },
    ],
    quality: {
      data_quality: estimated ? "estimated" : "third_party_database",
      completeness: completenessFor(candidate),
      confidence: estimated || basisUncertain ? "low" : "medium",
      calculation_allowed: false,
    },
    extraction: {
      source_system: "日日營養 DailyDietitian",
      candidate_id: candidate.id,
      article_estimation_disclosure: estimated,
      table_index: candidate.table_index,
      row_index: candidate.row_index,
      basis_inferred: basisUncertain,
      source_headers: candidate.source_headers,
      source_row: candidate.source_row,
    },
    official_review_hint: comparisonMetadata(existing),
    limitations: [
      "此文件只表示日日營養文章中曾出現這筆資料，不代表品牌、政府或 TWFoodMCP 已確認其正確性。",
      "此 draft 沒有 verified 欄位，依 OKF v0.2 應視為 unverified。",
      "在真人確認產品身分、份量基準與營養數值前，不得用於營養計算或升為 stable。",
      ...(estimated ? ["來源文章含推估或估算聲明，營養值可能不是實驗或官方標示結果。"] : []),
      ...(basisUncertain ? ["來源表格沒有明示 per-serving 或 per-100 基準，目前 basis 是抽取器推定值。"] : []),
      ...(!candidate.serving ? ["來源沒有可重現的 serving amount。"] : []),
    ],
  };
}

function markdownCell(value) {
  return String(value ?? "")
    .replace(/\|/gu, "\\|")
    .replace(/\r?\n/gu, "<br>");
}

function renderOkf(frontmatter) {
  const source = frontmatter.sources[0];
  const headers = frontmatter.extraction.source_headers ?? [];
  const row = frontmatter.extraction.source_row ?? [];
  const table = headers.length > 0
    ? `\n# Source Row\n\n| ${headers.map(markdownCell).join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n| ${headers.map((_, index) => markdownCell(row[index])).join(" | ")} |\n`
    : "";
  return `---\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n# Summary\n\n此文件逐列保存日日營養文章中的食品名稱與營養表格數值。[^${source.id}] 它是未驗證 draft，不代表官方標示或 TWFoodMCP 的正式判定。\n${table}\n# Review Required\n\n升為 stable 前，真人 reviewer 必須確認精確產品、規格、份量基準、營養欄位、文章版本及可追溯證據。此 draft 的 \`quality.calculation_allowed\` 固定為 \`false\`。\n\n[^${source.id}]: ${source.title}\n`;
}

function reportCandidate(candidate, extra = {}) {
  return {
    candidate_id: candidate.id,
    brand: candidate.brand,
    item_name: candidate.item_name,
    basis: candidate.basis,
    basis_inferred: candidate.basis_inferred,
    nutrition: candidate.nutrition,
    ...(candidate.serving ? { serving: candidate.serving } : {}),
    article: candidate.article,
    ...extra,
  };
}

async function main() {
  const config = JSON.parse(await readFile(CONFIG_PATH, "utf8"));
  const brands = Array.isArray(config.brands) ? config.brands : [];
  const documents = await loadOkfDocuments();
  const robotsCache = new Map();

  async function rulesFor(url) {
    const origin = new URL(url).origin;
    if (robotsCache.has(origin)) return robotsCache.get(origin);
    const robotsUrl = new URL("/robots.txt", origin).href;
    try {
      const robots = await fetchText(robotsUrl, { retries: 1, allowNonHtml: true });
      const rules = parseRobots(robots.text, "*");
      robotsCache.set(origin, rules);
      return rules;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/\b40[134]\b/u.test(message)) {
        robotsCache.set(origin, []);
        return [];
      }
      throw new Error(`robots.txt unavailable for ${origin}; skipping that origin: ${message}`);
    }
  }

  const robotsRules = await rulesFor(CATEGORY_URL);
  if (!robotsAllows(CATEGORY_URL, robotsRules)) throw new Error(`robots.txt disallows ${CATEGORY_URL}`);

  const articleUrls = [];
  const articleSeen = new Set();
  const crawlErrors = [];
  for (let page = 1; page <= MAX_CATEGORY_PAGES; page += 1) {
    const pageUrl = page === 1 ? CATEGORY_URL : new URL(`page/${page}/`, CATEGORY_URL).href;
    if (!robotsAllows(pageUrl, robotsRules)) {
      crawlErrors.push({ url: pageUrl, stage: "category", error: "robots_disallowed" });
      continue;
    }
    try {
      const response = await fetchText(pageUrl);
      const found = extractCategoryArticleUrls(response.text, response.finalUrl);
      let added = 0;
      for (const url of found) {
        if (articleSeen.has(url)) continue;
        articleSeen.add(url);
        articleUrls.push(url);
        added += 1;
      }
      console.log(`Category page ${page}: ${found.length} links, ${added} new.`);
      if (page > 1 && added === 0) break;
    } catch (error) {
      crawlErrors.push({ url: pageUrl, stage: "category", error: error instanceof Error ? error.message : String(error) });
    }
  }

  const selectedArticleUrls = MAX_ARTICLES > 0 ? articleUrls.slice(0, MAX_ARTICLES) : articleUrls;
  await rm(path.join(DISCOVERY_ROOT, "articles"), { recursive: true, force: true });
  await rm(REPORT_ROOT, { recursive: true, force: true });
  await rm(OKF_ROOT, { recursive: true, force: true });
  await mkdir(path.join(DISCOVERY_ROOT, "articles"), { recursive: true });
  await mkdir(REPORT_ROOT, { recursive: true });
  await mkdir(OKF_ROOT, { recursive: true });

  const articleIndex = [];
  const allCandidates = [];

  for (const [index, articleUrl] of selectedArticleUrls.entries()) {
    if (!robotsAllows(articleUrl, robotsRules)) {
      crawlErrors.push({ url: articleUrl, stage: "article", error: "robots_disallowed" });
      continue;
    }
    try {
      const response = await fetchText(articleUrl);
      const title = extractTitle(response.text) || new URL(response.finalUrl).pathname;
      const modifiedAt = extractModifiedDate(response.text);
      const brand = inferBrand(title, brands);
      const candidates = extractNutritionCandidates({
        articleUrl: response.finalUrl,
        articleTitle: title,
        articleModifiedAt: modifiedAt,
        html: response.text,
        brand,
      });
      allCandidates.push(...candidates);
      const record = {
        url: response.finalUrl,
        title,
        ...(modifiedAt ? { modified_at: modifiedAt } : {}),
        retrieved_at: RETRIEVED_AT,
        brand,
        estimated: candidates.some((candidate) => candidate.article.estimated),
        candidate_count: candidates.length,
        candidates,
      };
      const file = `articles/${articleFileName(response.finalUrl)}`;
      await writeFile(path.join(DISCOVERY_ROOT, file), stableJson(record), "utf8");
      articleIndex.push({ file, url: response.finalUrl, title, candidate_count: candidates.length, estimated: record.estimated });
      console.log(`Article ${index + 1}/${selectedArticleUrls.length}: ${title} -> ${candidates.length} nutrition candidates.`);
    } catch (error) {
      crawlErrors.push({ url: articleUrl, stage: "article", error: error instanceof Error ? error.message : String(error) });
    }
  }

  const drafts = [];
  const existingMatches = [];
  const conflicts = [];
  const unmatched = [];
  const generatedIds = new Set();

  for (const candidate of allCandidates) {
    const existing = matchAgainstOfficialDocuments(candidate, documents);
    if (existing.status === "corroborated_existing") existingMatches.push(reportCandidate(candidate, { comparison: existing }));
    else if (existing.status === "conflict_existing") conflicts.push(reportCandidate(candidate, { comparison: existing }));
    else unmatched.push(reportCandidate(candidate, { comparison: existing }));

    const frontmatter = draftFrontmatter(candidate, existing);
    if (generatedIds.has(frontmatter.food.id)) throw new Error(`Duplicate generated food.id: ${frontmatter.food.id}`);
    generatedIds.add(frontmatter.food.id);

    const digest = candidateDigest(candidate);
    const brandDir = safeSegment(candidate.brand_slug || candidate.brand || "unclassified");
    await mkdir(path.join(OKF_ROOT, brandDir), { recursive: true });
    const filePath = path.join(OKF_ROOT, brandDir, `${digest}.md`);
    await writeFile(filePath, renderOkf(frontmatter), "utf8");
    drafts.push(reportCandidate(candidate, {
      result: "dailydietitian_source_draft",
      food_id: frontmatter.food.id,
      okf_path: filePath.replaceAll(path.sep, "/"),
      official_review_hint: frontmatter.official_review_hint,
    }));
  }

  const summary = {
    run_date: RUN_DATE,
    retrieved_at: RETRIEVED_AT,
    category_url: CATEGORY_URL,
    category_pages_requested: MAX_CATEGORY_PAGES,
    article_links_discovered: articleUrls.length,
    articles_processed: articleIndex.length,
    candidates_extracted: allCandidates.length,
    new_okf_drafts: drafts.length,
    existing_official_matches: existingMatches.length,
    conflicts: conflicts.length,
    unmatched_official: unmatched.length,
    pending_human_review: drafts.length,
    crawl_errors: crawlErrors.length,
    policy: {
      source_of_record_for_draft: "日日營養 DailyDietitian",
      draft_gate: "Every extracted nutrition candidate becomes an unverified OKF draft sourced from its DailyDietitian article.",
      verification_state: "No verified field is generated; trust tier is unverified under OKF v0.2.",
      stable_gate: "No human:* verification is generated. Drafts remain excluded from stable publication and nutrition calculation.",
      copyright_boundary: "Article prose and images are not stored; article metadata, factual table cells, and the exact extracted source row are retained.",
    },
  };

  articleIndex.sort((a, b) => a.url.localeCompare(b.url));
  await writeFile(path.join(DISCOVERY_ROOT, "index.json"), stableJson({ ...summary, articles: articleIndex }), "utf8");
  await writeFile(path.join(REPORT_ROOT, "summary.json"), stableJson(summary), "utf8");
  await writeFile(path.join(REPORT_ROOT, "generated-drafts.json"), stableJson(drafts), "utf8");
  await writeFile(path.join(REPORT_ROOT, "existing-official-matches.json"), stableJson(existingMatches), "utf8");
  await writeFile(path.join(REPORT_ROOT, "conflicts.json"), stableJson(conflicts), "utf8");
  await writeFile(path.join(REPORT_ROOT, "unmatched-official.json"), stableJson(unmatched), "utf8");
  await writeFile(path.join(REPORT_ROOT, "crawl-errors.json"), stableJson(crawlErrors), "utf8");

  console.log(JSON.stringify(summary, null, 2));
}

await main();
