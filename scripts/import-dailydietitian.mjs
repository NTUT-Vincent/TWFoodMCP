#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { stringify } from "yaml";
import { loadOkfDocuments } from "./lib/dataset.mjs";
import {
  corroborateWithOfficialPage,
  extractCategoryArticleUrls,
  extractModifiedDate,
  extractNutritionCandidates,
  extractTitle,
  inferBrand,
  matchAgainstOfficialDocuments,
  normalizeText,
  officialLinksForArticle,
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
const OKF_ROOT = process.env.DAILYDIETITIAN_OKF_ROOT ?? "knowledge/menu-items/dailydietitian-verified";
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

function sourceId(prefix, url) {
  return `${prefix}-${crypto.createHash("sha1").update(url).digest("hex").slice(0, 12)}`;
}

function sourceIsPrimary(source) {
  return ["primary_label", "primary_government", "primary_official"].includes(source?.source_class);
}

function deriveOfficialHosts(documents, brand) {
  const brandNames = [brand?.name, ...(brand?.aliases ?? [])].filter(Boolean).map(normalizeText);
  const hosts = new Set();
  for (const document of documents) {
    const data = document.data;
    const officialBrand = normalizeText(data?.food?.brand ?? data?.title ?? "");
    if (brandNames.length > 0 && !brandNames.some((name) => name && (officialBrand.includes(name) || name.includes(officialBrand)))) continue;
    for (const source of data?.sources ?? []) {
      if (!sourceIsPrimary(source) || typeof source.resource !== "string") continue;
      try {
        const host = new URL(source.resource).hostname.toLowerCase().replace(/^www\./u, "");
        hosts.add(host);
      } catch {
        // Bundle-relative sources do not contribute web hosts.
      }
    }
  }
  return [...hosts];
}

function officialAuthor(brand) {
  const candidate = String(brand?.slug ?? "official-source").replace(/[^A-Za-z0-9._-]/gu, "-").replace(/^-+|-+$/gu, "");
  return `${candidate || "official-source"}/website`;
}

function okfFrontmatter(candidate, officialUrl, brand, match) {
  const brandSlug = String(brand?.slug ?? slugify(brand?.name ?? candidate.brand ?? "brand"))
    .replace(/[^A-Za-z0-9._-]/gu, "-")
    .replace(/^-+|-+$/gu, "") || "brand";
  const itemSlug = slugify(candidate.item_name).replace(/[^A-Za-z0-9._-]/gu, "-").replace(/^-+|-+$/gu, "")
    || crypto.createHash("sha1").update(candidate.item_name).digest("hex").slice(0, 12);
  const officialSourceId = sourceId("official", officialUrl);
  const discoverySourceId = sourceId("dailydietitian", candidate.article.url);
  const nutrientCount = Object.keys(candidate.nutrition).filter((key) => key !== "caffeine_mg").length;
  const completeness = nutrientCount >= 5 ? "nutrition_complete" : nutrientCount >= 2 ? "partial" : "minimal";
  const calculationAllowed = !candidate.basis_inferred && Boolean(candidate.serving);
  const aliases = [...new Set([
    candidate.item_name,
    `${brand?.name ?? candidate.brand ?? ""}${candidate.item_name}`,
    `${brand?.name ?? candidate.brand ?? ""} ${candidate.item_name}`,
  ].map((value) => value.trim()).filter(Boolean))];

  return {
    type: "Food Product",
    title: `${brand?.name ?? candidate.brand ?? ""} ${candidate.item_name}`.trim(),
    description: "由日日營養發現，並以品牌官方頁面逐欄比對成功的台灣食品營養 draft。",
    resource: officialUrl,
    tags: [...new Set([brand?.name, "日日營養", "官方來源佐證", "待人工審核"].filter(Boolean))],
    generated: {
      by: "twfoodmcp-dailydietitian-importer/1.0.0",
      at: RETRIEVED_AT,
    },
    verified: [
      {
        by: "process:official-source-matcher",
        at: RETRIEVED_AT,
      },
    ],
    status: "draft",
    stale_after: addMonths(RUN_DATE, 6),
    sources: [
      {
        id: officialSourceId,
        resource: officialUrl,
        title: `${brand?.name ?? candidate.brand ?? "品牌"}官方頁面`,
        author: officialAuthor(brand),
        source_class: "primary_official",
        retrieved_at: RETRIEVED_AT,
      },
      {
        id: discoverySourceId,
        resource: candidate.article.url,
        title: candidate.article.title,
        author: "dailydietitian/website",
        source_class: "expert_interpretation",
        ...(candidate.article.modified_at ? { last_modified: candidate.article.modified_at } : {}),
        retrieved_at: RETRIEVED_AT,
      },
    ],
    access: { classification: "public" },
    food: {
      id: `food:tw:menu:${brandSlug}:${itemSlug}`,
      kind: "menu_item",
      market: "TW",
      ...(brand?.name || candidate.brand ? { brand: brand?.name ?? candidate.brand } : {}),
      name: candidate.item_name,
      aliases,
    },
    revision: {
      revision_id: `official-web-${RUN_DATE}`,
    },
    ...(candidate.serving ? { serving: candidate.serving } : {}),
    nutrition: [
      {
        basis: candidate.basis,
        values: candidate.nutrition,
      },
    ],
    quality: {
      data_quality: "official_brand",
      completeness,
      confidence: "high",
      calculation_allowed: calculationAllowed,
    },
    discovery: {
      via: "日日營養 DailyDietitian",
      source_url: candidate.article.url,
      candidate_id: candidate.id,
      article_estimation_disclosure: candidate.article.estimated,
      table_index: candidate.table_index,
      row_index: candidate.row_index,
    },
    machine_comparison: {
      method: "normalized-item-name-and-all-published-nutrition-values-present-on-official-page",
      matched_name: match.matched_name,
      matched_fields: match.matched_fields,
    },
    limitations: [
      "此文件由程式進行官方頁面文字比對後產生，仍須真人確認產品版本、份量基準及官方頁面上下文。",
      "日日營養僅作為候選食品的發現來源；正式營養證據指向品牌官方頁面。",
      ...(candidate.basis_inferred ? ["來源表格未明示 per-serving 或 per-100 基準，本文件暫以 per_serving 保存且禁止計算。"] : []),
      ...(!candidate.serving ? ["來源未提供可重現的 serving amount；人工審核前不得用於營養計算。"] : []),
      ...(candidate.article.estimated ? ["發現文章標示含推估資料；本 draft 只因所有數值亦可在官方頁面找到而建立。"] : []),
    ],
  };
}

function renderOkf(frontmatter) {
  const official = frontmatter.sources[0];
  const discovery = frontmatter.sources[1];
  return `---\n${stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n# Summary\n\n此食品由日日營養文章發現，營養數值已由自動流程在品牌官方頁面找到相同品名與全部已發布數值。[^${official.id}] 發現文章只作為候選來源，不取代官方證據。[^${discovery.id}]\n\n# Review Required\n\n合併至 stable 前，真人 reviewer 必須重新開啟官方來源，確認產品版本、份量基準、營養欄位上下文與是否存在改版。\n\n[^${official.id}]: ${official.title}\n[^${discovery.id}]: ${discovery.title}\n`;
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
  const articleContexts = new Map();

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
      const derivedHosts = deriveOfficialHosts(documents, brand);
      const officialLinks = officialLinksForArticle(response.text, response.finalUrl, brand, derivedHosts);
      articleContexts.set(response.finalUrl, { brand, officialLinks });
      allCandidates.push(...candidates);
      const record = {
        url: response.finalUrl,
        title,
        ...(modifiedAt ? { modified_at: modifiedAt } : {}),
        retrieved_at: RETRIEVED_AT,
        brand,
        estimated: candidates.some((candidate) => candidate.article.estimated),
        candidate_count: candidates.length,
        official_links: officialLinks,
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

  const verified = [];
  const conflicts = [];
  const pending = [];
  const existingMatches = [];
  const officialPageCache = new Map();
  const generatedIds = new Set();

  for (const candidate of allCandidates) {
    const existing = matchAgainstOfficialDocuments(candidate, documents);
    if (existing.status === "corroborated_existing") {
      existingMatches.push(reportCandidate(candidate, { verification: existing }));
      continue;
    }
    if (existing.status === "conflict_existing") {
      conflicts.push(reportCandidate(candidate, { verification: existing, reason: "official_record_conflict" }));
      continue;
    }

    const context = articleContexts.get(candidate.article.url);
    let pageMatch;
    let matchedOfficialUrl;
    for (const link of context?.officialLinks ?? []) {
      try {
        const officialRobots = await rulesFor(link.url);
        if (!robotsAllows(link.url, officialRobots)) continue;
        let officialPage = officialPageCache.get(link.url);
        if (!officialPage) {
          officialPage = await fetchText(link.url, { retries: 1 });
          officialPageCache.set(link.url, officialPage);
        }
        const result = corroborateWithOfficialPage(candidate, officialPage.text);
        if (result.corroborated) {
          pageMatch = result;
          matchedOfficialUrl = officialPage.finalUrl;
          break;
        }
      } catch (error) {
        crawlErrors.push({ url: link.url, stage: "official", candidate_id: candidate.id, error: error instanceof Error ? error.message : String(error) });
      }
    }

    if (!pageMatch || !matchedOfficialUrl) {
      pending.push(reportCandidate(candidate, {
        reason: candidate.article.estimated ? "estimated_article_without_official_corroboration" : "no_official_corroboration",
        identity_match: existing.status,
        official_links_checked: (context?.officialLinks ?? []).map(({ url }) => url),
      }));
      continue;
    }

    const frontmatter = okfFrontmatter(candidate, matchedOfficialUrl, context?.brand, pageMatch);
    if (documents.some(({ data }) => data.food.id === frontmatter.food.id) || generatedIds.has(frontmatter.food.id)) {
      pending.push(reportCandidate(candidate, { reason: "duplicate_food_id", proposed_food_id: frontmatter.food.id }));
      continue;
    }
    generatedIds.add(frontmatter.food.id);
    const brandDir = frontmatter.food.id.split(":").at(-2);
    const itemFile = `${frontmatter.food.id.split(":").at(-1)}.md`;
    await mkdir(path.join(OKF_ROOT, brandDir), { recursive: true });
    const filePath = path.join(OKF_ROOT, brandDir, itemFile);
    await writeFile(filePath, renderOkf(frontmatter), "utf8");
    verified.push(reportCandidate(candidate, {
      result: "new_okf_draft",
      food_id: frontmatter.food.id,
      okf_path: filePath.replaceAll(path.sep, "/"),
      official_url: matchedOfficialUrl,
      machine_comparison: pageMatch,
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
    existing_official_matches: existingMatches.length,
    new_okf_drafts: verified.length,
    conflicts: conflicts.length,
    pending_verification: pending.length,
    crawl_errors: crawlErrors.length,
    policy: {
      discovery_source: "日日營養 DailyDietitian",
      draft_gate: "A draft is generated only when an existing primary official OKF record corroborates it or an allowlisted official page contains the normalized item name and every extracted nutrient value.",
      stable_gate: "No human:* verification is generated. All newly generated OKF documents remain draft.",
      copyright_boundary: "Article prose and images are not stored; only article metadata and factual table cells needed for source comparison are retained.",
    },
  };

  articleIndex.sort((a, b) => a.url.localeCompare(b.url));
  await writeFile(path.join(DISCOVERY_ROOT, "index.json"), stableJson({ ...summary, articles: articleIndex }), "utf8");
  await writeFile(path.join(REPORT_ROOT, "summary.json"), stableJson(summary), "utf8");
  await writeFile(path.join(REPORT_ROOT, "existing-official-matches.json"), stableJson(existingMatches), "utf8");
  await writeFile(path.join(REPORT_ROOT, "verified-new-drafts.json"), stableJson(verified), "utf8");
  await writeFile(path.join(REPORT_ROOT, "conflicts.json"), stableJson(conflicts), "utf8");
  await writeFile(path.join(REPORT_ROOT, "pending-verification.json"), stableJson(pending), "utf8");
  await writeFile(path.join(REPORT_ROOT, "crawl-errors.json"), stableJson(crawlErrors), "utf8");

  console.log(JSON.stringify(summary, null, 2));
}

await main();
