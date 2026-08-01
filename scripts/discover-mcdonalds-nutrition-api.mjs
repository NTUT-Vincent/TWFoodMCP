import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const PRODUCT_URL = 'https://www.mcdonalds.com/tw/zh-tw/product/big-mac.html';
const OUTPUT = process.argv[2] ?? 'artifacts/mcdonalds-nutrition-api-diagnostic.json';
const USER_AGENT =
  'TWFoodMCP/0.1 (+https://github.com/NTUT-Vincent/TWFoodMCP; public nutrition data research)';

async function curlText(url) {
  const { stdout } = await execFileAsync(
    'curl',
    [
      '--http1.1',
      '--location',
      '--compressed',
      '--silent',
      '--show-error',
      '--fail-with-body',
      '--retry',
      '3',
      '--retry-all-errors',
      '--connect-timeout',
      '20',
      '--max-time',
      '90',
      '--user-agent',
      USER_AGENT,
      '--header',
      'Accept-Language: zh-TW,zh;q=0.9,en;q=0.7',
      url,
    ],
    { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 },
  );
  return stdout;
}

function decodeEntities(value) {
  return String(value ?? '')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function normalizeUrl(raw, base) {
  try {
    return new URL(decodeEntities(raw), base).href;
  } catch {
    return null;
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function contexts(text, patterns, radius = 600, limit = 80) {
  const found = [];
  for (const pattern of patterns) {
    const regex = new RegExp(pattern, 'gi');
    for (const match of text.matchAll(regex)) {
      const start = Math.max(0, (match.index ?? 0) - radius);
      const end = Math.min(text.length, (match.index ?? 0) + match[0].length + radius);
      const value = text.slice(start, end);
      if (!found.includes(value)) found.push(value);
      if (found.length >= limit) return found;
    }
  }
  return found;
}

async function main() {
  const html = await curlText(PRODUCT_URL);
  const scriptUrls = unique(
    [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)].map((match) =>
      normalizeUrl(match[1], PRODUCT_URL),
    ),
  );
  const nutritionScripts = scriptUrls.filter((url) => /nutrition|nutrient|allergen/i.test(url));

  const scripts = [];
  for (const url of nutritionScripts) {
    try {
      const body = await curlText(url);
      scripts.push({
        url,
        byte_length: Buffer.byteLength(body),
        body,
        contexts: contexts(body, [
          'fetch\\(',
          '\\$\\.ajax',
          'XMLHttpRequest',
          'nutrition',
          'nutrient',
          'productId',
          'productCode',
          'api',
          '\\.json',
          'servlet',
          'graphql',
        ]),
        quoted_paths: unique(
          [...body.matchAll(/["']([^"']*(?:nutrition|nutrient|product|api|json|servlet)[^"']*)["']/gi)]
            .map((match) => match[1])
            .filter((value) => value.length < 500),
        ),
      });
    } catch (error) {
      scripts.push({ url, error: String(error) });
    }
  }

  const componentTags = [...html.matchAll(/<[^>]+data-component=["']nutrients-table["'][^>]*>/gi)].map(
    (match) => match[0],
  );

  const diagnostic = {
    retrieved_at: new Date().toISOString(),
    product_url: PRODUCT_URL,
    html_byte_length: Buffer.byteLength(html),
    script_urls: scriptUrls,
    nutrition_script_urls: nutritionScripts,
    component_tags: componentTags,
    html_contexts: contexts(html, [
      'data-component=["\\']nutrients-table',
      'data-nutrition-ids',
      'productId',
      'productCode',
      'nutrition',
      'nutrient',
      'api',
      '\\.json',
      'servlet',
    ], 1_500, 120),
    html_quoted_paths: unique(
      [...html.matchAll(/["']([^"']*(?:nutrition|nutrient|product|api|json|servlet)[^"']*)["']/gi)]
        .map((match) => decodeEntities(match[1]))
        .filter((value) => value.length < 800),
    ),
    scripts,
  };

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(diagnostic, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${OUTPUT}`);
  console.log(`Found ${nutritionScripts.length} nutrition-related scripts.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
