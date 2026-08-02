import crypto from "node:crypto";

const ENTITY_MAP = new Map([
  ["amp", "&"],
  ["lt", "<"],
  ["gt", ">"],
  ["quot", '"'],
  ["apos", "'"],
  ["nbsp", " "],
  ["ensp", " "],
  ["emsp", " "],
  ["hellip", "…"],
  ["ndash", "–"],
  ["mdash", "—"],
]);

const NUTRIENT_COLUMNS = [
  ["energy_kcal", [/熱量/u, /energy/u, /kcal/u]],
  ["protein_g", [/蛋白質/u, /protein/u]],
  ["saturated_fat_g", [/飽和脂肪/u, /saturatedfat/u]],
  ["trans_fat_g", [/反式脂肪/u, /transfat/u]],
  ["fat_g", [/脂肪/u, /總脂肪/u, /fat/u]],
  ["carbohydrate_g", [/碳水/u, /碳水化合物/u, /carbohydrate/u, /carbs/u]],
  ["sugar_g", [/糖量/u, /糖/u, /sugar/u]],
  ["dietary_fiber_g", [/膳食纖維/u, /纖維/u, /fiber/u]],
  ["sodium_mg", [/鈉/u, /sodium/u]],
  ["caffeine_mg", [/咖啡因/u, /caffeine/u]],
];

const ITEM_PATTERNS = [/餐點/u, /品項/u, /商品/u, /飲品/u, /產品/u, /名稱/u, /口味/u, /food/u, /item/u, /name/u];
const SERVING_PATTERNS = [/份量/u, /重量/u, /容量/u, /規格/u, /尺寸/u, /每份/u, /serving/u, /size/u, /weight/u, /volume/u];

function unique(values) {
  return [...new Set(values)];
}

export function decodeHtmlEntities(value) {
  return String(value ?? "").replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]+);/giu, (match, entity) => {
    const lower = entity.toLowerCase();
    if (lower.startsWith("#x")) {
      const code = Number.parseInt(lower.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (lower.startsWith("#")) {
      const code = Number.parseInt(lower.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITY_MAP.get(lower) ?? match;
  });
}

export function stripHtml(value) {
  return decodeHtmlEntities(
    String(value ?? "")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, " ")
      .replace(/<(?:br|\/p|\/div|\/li|\/tr|\/h[1-6])\b[^>]*>/giu, "\n")
      .replace(/<[^>]+>/gu, " "),
  )
    .replace(/[\t\f\v ]+/gu, " ")
    .replace(/\s*\n\s*/gu, "\n")
    .trim();
}

export function normalizeText(value) {
  return stripHtml(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

export function slugify(value) {
  const normalized = String(value ?? "").normalize("NFKC").toLowerCase().trim();
  const ascii = normalized
    .replace(/&/gu, " and ")
    .replace(/[^a-z0-9\u3400-\u9fff]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  if (ascii && /[a-z0-9]/u.test(ascii)) return ascii;
  const digest = crypto.createHash("sha1").update(normalized).digest("hex").slice(0, 12);
  return `item-${digest}`;
}

export function extractLinks(html, baseUrl) {
  const output = [];
  const seen = new Set();
  const regex = /<a\b([^>]*)>([\s\S]*?)<\/a>/giu;
  for (const match of String(html ?? "").matchAll(regex)) {
    const attrs = match[1];
    const hrefMatch = attrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/iu);
    const href = hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    let url;
    try {
      url = new URL(decodeHtmlEntities(href), baseUrl).href;
    } catch {
      continue;
    }
    if (seen.has(url)) continue;
    seen.add(url);
    output.push({ url, text: stripHtml(match[2]) });
  }
  return output;
}

export function extractCategoryArticleUrls(html, baseUrl) {
  const urls = [];
  const seen = new Set();
  const titleRegex = /<(?:h2|h3)\b[^>]*class=(?:"[^"]*(?:entry-title|elementor-post__title)[^"]*"|'[^']*(?:entry-title|elementor-post__title)[^']*')[^>]*>[\s\S]*?<a\b[^>]*href\s*=\s*(?:"([^"]+)"|'([^']+)')[^>]*>/giu;
  for (const match of String(html ?? "").matchAll(titleRegex)) {
    const href = match[1] ?? match[2];
    try {
      const url = new URL(decodeHtmlEntities(href), baseUrl);
      if (!seen.has(url.href)) {
        seen.add(url.href);
        urls.push(url.href);
      }
    } catch {
      // Ignore malformed links.
    }
  }
  if (urls.length > 0) return urls;

  const base = new URL(baseUrl);
  for (const link of extractLinks(html, baseUrl)) {
    const url = new URL(link.url);
    if (url.origin !== base.origin) continue;
    if (!url.pathname.endsWith("/")) continue;
    if (/\/(?:category|tag|author|page|feed|wp-content|wp-json)\//u.test(url.pathname)) continue;
    if (url.pathname === "/" || url.pathname === base.pathname) continue;
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length !== 1) continue;
    if (!seen.has(url.href)) {
      seen.add(url.href);
      urls.push(url.href);
    }
  }
  return urls;
}

export function extractTitle(html) {
  const source = String(html ?? "");
  const meta = source.match(/<meta\b[^>]*(?:property|name)\s*=\s*["'](?:og:title|twitter:title)["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/iu)
    ?? source.match(/<meta\b[^>]*content\s*=\s*["']([^"']+)["'][^>]*(?:property|name)\s*=\s*["'](?:og:title|twitter:title)["'][^>]*>/iu);
  if (meta) return stripHtml(meta[1]).replace(/\s+[–—-]\s+日日營養.*$/u, "").trim();
  const h1 = source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/iu);
  return h1 ? stripHtml(h1[1]) : "";
}

export function extractModifiedDate(html) {
  const source = String(html ?? "");
  const meta = source.match(/<meta\b[^>]*(?:property|name)\s*=\s*["']article:(?:modified_time|published_time)["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/iu)
    ?? source.match(/<meta\b[^>]*content\s*=\s*["']([^"']+)["'][^>]*(?:property|name)\s*=\s*["']article:(?:modified_time|published_time)["'][^>]*>/iu);
  if (meta) {
    const parsed = new Date(meta[1]);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  const text = stripHtml(source);
  const zh = text.match(/(?:最後更新日期|更新日期|發布日期)\s*[：:]?\s*(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/u);
  if (zh) return `${zh[1]}-${zh[2].padStart(2, "0")}-${zh[3].padStart(2, "0")}`;
  return undefined;
}

function parseRows(tableHtml) {
  const rows = [];
  const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/giu;
  for (const rowMatch of tableHtml.matchAll(rowRegex)) {
    const cells = [];
    const cellRegex = /<(th|td)\b[^>]*>([\s\S]*?)<\/\1>/giu;
    for (const cellMatch of rowMatch[1].matchAll(cellRegex)) {
      cells.push({ kind: cellMatch[1].toLowerCase(), text: stripHtml(cellMatch[2]) });
    }
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}

export function extractTables(html) {
  const output = [];
  const tableRegex = /<table\b[^>]*>([\s\S]*?)<\/table>/giu;
  let index = 0;
  for (const match of String(html ?? "").matchAll(tableRegex)) {
    const rows = parseRows(match[1]);
    if (rows.length === 0) continue;
    let headerIndex = rows.findIndex((row) => row.some((cell) => cell.kind === "th"));
    if (headerIndex < 0) headerIndex = 0;
    const headers = rows[headerIndex].map((cell) => cell.text.trim());
    const dataRows = rows.slice(headerIndex + 1)
      .map((row) => row.map((cell) => cell.text.trim()))
      .filter((row) => row.some(Boolean));
    if (headers.length > 0 && dataRows.length > 0) output.push({ index, headers, rows: dataRows });
    index += 1;
  }
  return output;
}

export function parseNumber(value) {
  const text = String(value ?? "").normalize("NFKC").replace(/,/gu, "");
  const match = text.match(/(?:^|[^\d-])(-?\d+(?:\.\d+)?)(?=$|[^\d])/u) ?? text.match(/^-?\d+(?:\.\d+)?/u);
  if (!match) return undefined;
  const number = Number(match[1]);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

function columnForHeader(header) {
  const normalized = normalizeText(header);
  for (const [field, patterns] of NUTRIENT_COLUMNS) {
    if (field === "fat_g" && (/飽和/u.test(normalized) || /反式/u.test(normalized))) continue;
    if (patterns.some((pattern) => pattern.test(normalized))) return field;
  }
  return undefined;
}

export function detectBasis(headers) {
  const text = normalizeText(headers.join(" "));
  if (/(?:每)?100(?:公克|克|g)/iu.test(text)) return "per_100g";
  if (/(?:每)?100(?:毫升|ml)/iu.test(text)) return "per_100ml";
  return "per_serving";
}

export function parseServing(value) {
  const text = String(value ?? "").normalize("NFKC");
  const match = text.match(/(\d+(?:\.\d+)?)\s*(公克|克|g|毫升|ml|份|個|顆|片|包|杯)/iu);
  if (!match) return undefined;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;
  const unitText = match[2].toLowerCase();
  let unit;
  if (["公克", "克", "g"].includes(unitText)) unit = "g";
  else if (["毫升", "ml"].includes(unitText)) unit = "ml";
  else if (["包"].includes(unitText)) unit = "package";
  else if (["份", "杯"].includes(unitText)) unit = "serving";
  else unit = "piece";
  return { amount, unit, description: text.trim() };
}

export function isEstimatedArticle(htmlOrText) {
  const text = stripHtml(htmlOrText).normalize("NFKC");
  return [
    /AI\s*推估/iu,
    /營養(?:成分)?推估/u,
    /熱量推估/u,
    /估算(?:數值|資料|結果|熱量|營養)/u,
    /僅供(?:參考|估算)/u,
  ].some((pattern) => pattern.test(text));
}

function chooseItemColumn(headers) {
  for (const [index, header] of headers.entries()) {
    const normalized = normalizeText(header);
    if (ITEM_PATTERNS.some((pattern) => pattern.test(normalized))) return index;
  }
  return 0;
}

function chooseServingColumn(headers) {
  for (const [index, header] of headers.entries()) {
    const normalized = normalizeText(header);
    if (SERVING_PATTERNS.some((pattern) => pattern.test(normalized))) return index;
  }
  return -1;
}

export function extractNutritionCandidates({ articleUrl, articleTitle, articleModifiedAt, html, brand }) {
  const estimated = isEstimatedArticle(html);
  const tables = extractTables(html);
  const candidates = [];
  for (const table of tables) {
    const itemColumn = chooseItemColumn(table.headers);
    const servingColumn = chooseServingColumn(table.headers);
    const nutrientColumns = table.headers.map(columnForHeader);
    const recognized = nutrientColumns.filter(Boolean);
    if (recognized.length === 0 || !recognized.includes("energy_kcal")) continue;
    const basis = detectBasis(table.headers);
    const basisInferred = !table.headers.some((header) => /(?:每份|每\s*100|per\s*(?:serving|100))/iu.test(header));

    for (const [rowIndex, row] of table.rows.entries()) {
      const itemName = String(row[itemColumn] ?? "").trim();
      if (!itemName || /^(?:合計|總計|備註|說明|餐點)$/u.test(itemName)) continue;
      const nutrition = {};
      for (const [columnIndex, field] of nutrientColumns.entries()) {
        if (!field) continue;
        const value = parseNumber(row[columnIndex]);
        if (value !== undefined) nutrition[field] = value;
      }
      if (nutrition.energy_kcal === undefined) continue;
      const serving = servingColumn >= 0 ? parseServing(row[servingColumn]) : parseServing(itemName);
      candidates.push({
        id: candidateId(articleUrl, table.index, rowIndex, itemName),
        article: {
          url: articleUrl,
          title: articleTitle,
          ...(articleModifiedAt ? { modified_at: articleModifiedAt } : {}),
          estimated,
        },
        brand: brand?.name ?? brand?.slug ?? undefined,
        brand_slug: brand?.slug ?? undefined,
        item_name: itemName,
        table_index: table.index,
        row_index: rowIndex,
        basis,
        basis_inferred: basisInferred,
        ...(serving ? { serving } : {}),
        nutrition,
        source_row: row,
        source_headers: table.headers,
      });
    }
  }
  return candidates;
}

export function inferBrand(articleTitle, brands = []) {
  const title = normalizeText(articleTitle);
  let best;
  for (const brand of brands) {
    for (const alias of unique([brand.name, ...(brand.aliases ?? [])].filter(Boolean))) {
      const normalized = normalizeText(alias);
      if (!normalized || !title.includes(normalized)) continue;
      if (!best || normalized.length > best.aliasLength) best = { ...brand, aliasLength: normalized.length };
    }
  }
  if (best) {
    const { aliasLength: _ignored, ...brand } = best;
    return brand;
  }
  const fallback = stripHtml(articleTitle)
    .replace(/^\s*(?:【|〖)?\d{4}\s*(?:最新)?(?:】|〗)?\s*/u, "")
    .split(/[：:》｜|／/]/u)[0]
    .trim();
  return fallback ? { name: fallback, slug: slugify(fallback), aliases: [fallback], official_hosts: [] } : undefined;
}

export function candidateId(articleUrl, tableIndex, rowIndex, itemName) {
  const digest = crypto.createHash("sha256")
    .update(`${articleUrl}\n${tableIndex}\n${rowIndex}\n${normalizeText(itemName)}`)
    .digest("hex")
    .slice(0, 20);
  return `dd:${digest}`;
}

function stripVariant(value) {
  return normalizeText(value)
    .replace(/(?:大|中|小|熱|冰|冷|單點|套餐|份|杯|顆|個|片)$/gu, "")
    .replace(/(?:大杯|中杯|小杯|大份|中份|小份)/gu, "");
}

export function nameScore(candidateName, names) {
  const candidate = stripVariant(candidateName);
  let best = 0;
  for (const rawName of names) {
    const name = stripVariant(rawName);
    if (!candidate || !name) continue;
    if (candidate === name) best = Math.max(best, 1);
    else if (candidate.includes(name) || name.includes(candidate)) {
      const ratio = Math.min(candidate.length, name.length) / Math.max(candidate.length, name.length);
      best = Math.max(best, 0.75 + 0.2 * ratio);
    }
  }
  return best;
}

function toleranceFor(field, expected) {
  if (field === "energy_kcal") return Math.max(1, Math.abs(expected) * 0.01);
  if (field === "sodium_mg" || field === "caffeine_mg") return Math.max(5, Math.abs(expected) * 0.02);
  return Math.max(0.2, Math.abs(expected) * 0.02);
}

export function compareNutrition(candidateNutrition, officialNutrition) {
  const compared = [];
  const matched = [];
  const mismatched = [];
  for (const [field, candidateValue] of Object.entries(candidateNutrition ?? {})) {
    if (field === "caffeine_mg" && officialNutrition?.[field] === undefined) continue;
    const officialValue = officialNutrition?.[field];
    if (typeof candidateValue !== "number" || typeof officialValue !== "number") continue;
    const delta = Math.abs(candidateValue - officialValue);
    const tolerance = toleranceFor(field, officialValue);
    const record = { field, candidate_value: candidateValue, official_value: officialValue, delta, tolerance };
    compared.push(record);
    if (delta <= tolerance) matched.push(record);
    else mismatched.push(record);
  }
  const energyCompared = compared.some(({ field }) => field === "energy_kcal");
  const corroborated = mismatched.length === 0 && matched.length >= 2 && energyCompared;
  return { corroborated, compared, matched, mismatched };
}

function officialNames(data) {
  return unique([
    data?.title,
    data?.food?.name,
    data?.food?.variant,
    ...(Array.isArray(data?.food?.aliases) ? data.food.aliases : []),
  ].filter(Boolean));
}

function brandMatches(candidate, data) {
  if (!candidate.brand) return true;
  const candidateBrand = normalizeText(candidate.brand);
  const officialBrand = normalizeText(data?.food?.brand ?? data?.title ?? "");
  if (!candidateBrand || !officialBrand) return true;
  return candidateBrand.includes(officialBrand) || officialBrand.includes(candidateBrand);
}

export function matchAgainstOfficialDocuments(candidate, documents) {
  const possible = [];
  for (const document of documents) {
    const data = document.data ?? document;
    if (!brandMatches(candidate, data)) continue;
    if (!["official_label", "official_brand", "government_database"].includes(data?.quality?.data_quality)) continue;
    const score = nameScore(candidate.item_name, officialNames(data));
    if (score < 0.8) continue;
    for (const record of Array.isArray(data.nutrition) ? data.nutrition : []) {
      if (record?.basis !== candidate.basis) continue;
      const comparison = compareNutrition(candidate.nutrition, record.values);
      possible.push({ data, score, comparison, file_path: document.filePath });
    }
  }
  possible.sort((a, b) => {
    if (a.comparison.corroborated !== b.comparison.corroborated) return a.comparison.corroborated ? -1 : 1;
    if (b.score !== a.score) return b.score - a.score;
    return b.comparison.matched.length - a.comparison.matched.length;
  });
  const best = possible[0];
  if (!best) return { status: "no_match" };
  if (best.comparison.corroborated) {
    return {
      status: "corroborated_existing",
      food_id: best.data.food.id,
      title: best.data.title,
      source: best.data.sources?.[0],
      comparison: best.comparison,
      file_path: best.file_path,
    };
  }
  if (best.comparison.mismatched.length > 0) {
    return {
      status: "conflict_existing",
      food_id: best.data.food.id,
      title: best.data.title,
      comparison: best.comparison,
      file_path: best.file_path,
    };
  }
  return { status: "identity_only", food_id: best.data.food.id, title: best.data.title, comparison: best.comparison };
}

function numericTokens(value) {
  const result = new Set();
  if (typeof value !== "number" || !Number.isFinite(value)) return result;
  result.add(String(value));
  result.add(value.toFixed(1).replace(/\.0$/u, ""));
  result.add(value.toFixed(2).replace(/0+$/u, "").replace(/\.$/u, ""));
  return result;
}

export function corroborateWithOfficialPage(candidate, officialPageText) {
  const plain = stripHtml(officialPageText).normalize("NFKC");
  const normalized = normalizeText(plain);
  const names = unique([candidate.item_name, candidate.item_name.replace(/[（(][^）)]*[）)]/gu, "")]);
  const matchedName = names.find((name) => {
    const needle = normalizeText(name);
    return needle.length >= 2 && normalized.includes(needle);
  });
  if (!matchedName) return { corroborated: false, reason: "item_name_not_found", matched_fields: [] };

  const matchedFields = [];
  const missingFields = [];
  for (const [field, value] of Object.entries(candidate.nutrition ?? {})) {
    if (field === "caffeine_mg") continue;
    const tokens = [...numericTokens(value)];
    if (tokens.some((token) => plain.includes(token))) matchedFields.push(field);
    else missingFields.push(field);
  }
  const corroborated = matchedFields.includes("energy_kcal") && matchedFields.length >= 2 && missingFields.length === 0;
  return {
    corroborated,
    matched_name: matchedName,
    matched_fields: matchedFields,
    missing_fields: missingFields,
    reason: corroborated ? undefined : "not_all_values_found",
  };
}

export function officialLinksForArticle(html, articleUrl, brand, derivedHosts = []) {
  const hosts = unique([...(brand?.official_hosts ?? []), ...derivedHosts])
    .map((host) => String(host).toLowerCase().replace(/^www\./u, ""));
  if (hosts.length === 0) return [];
  const articleHost = new URL(articleUrl).hostname.toLowerCase().replace(/^www\./u, "");
  return extractLinks(html, articleUrl)
    .filter(({ url }) => {
      const host = new URL(url).hostname.toLowerCase().replace(/^www\./u, "");
      if (host === articleHost) return false;
      return hosts.some((officialHost) => host === officialHost || host.endsWith(`.${officialHost}`));
    });
}

export function parseRobots(text, userAgent = "*") {
  const lines = String(text ?? "").split(/\r?\n/u).map((line) => line.replace(/#.*$/u, "").trim()).filter(Boolean);
  const groups = [];
  let current;
  for (const line of lines) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (key === "user-agent") {
      if (!current || current.rules.length > 0) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && current) {
      current.rules.push({ type: key, path: value });
    }
  }
  const agent = userAgent.toLowerCase();
  const matching = groups.filter((group) => group.agents.includes(agent));
  const fallback = groups.filter((group) => group.agents.includes("*"));
  return (matching.length > 0 ? matching : fallback).flatMap((group) => group.rules);
}

export function robotsAllows(url, rules) {
  const pathname = new URL(url).pathname;
  const matches = rules
    .filter(({ path }) => path && pathname.startsWith(path.replace(/\*.*$/u, "")))
    .sort((a, b) => b.path.length - a.path.length);
  if (matches.length === 0) return true;
  return matches[0].type === "allow";
}
