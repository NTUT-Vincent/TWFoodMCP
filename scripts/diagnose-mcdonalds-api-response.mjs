import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const PAGE_URL = 'https://www.mcdonalds.com/tw/zh-tw/product/big-mac.html';
const OUTPUT = 'artifacts/mcdonalds-api-response.sample.json';

function decode(value) {
  return String(value ?? '')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)) {
    result[match[1]] = decode(match[2]);
  }
  return result;
}

async function curl(url, accept, referer) {
  const args = [
    '--http1.1', '--location', '--compressed', '--silent', '--show-error', '--fail-with-body',
    '--retry', '3', '--retry-all-errors', '--connect-timeout', '20', '--max-time', '90',
    '--header', `Accept: ${accept}`,
    '--header', 'Accept-Language: zh-TW,zh;q=0.9',
  ];
  if (referer) args.push('--referer', referer);
  args.push(url);
  const { stdout } = await execFileAsync('curl', args, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  return stdout;
}

const html = await curl(PAGE_URL, 'text/html');
const tag = html.match(/<[^>]+data-component=["']pdp["'][^>]*>/i)?.[0];
if (!tag) throw new Error('PDP component not found');
const attrs = attributes(tag);
const apiUrl = new URL(attrs['data-product-api-url'], PAGE_URL);
apiUrl.searchParams.set('country', attrs['data-country'] || 'tw');
apiUrl.searchParams.set('language', attrs['data-language'] || 'zh-tw');
apiUrl.searchParams.set('showLiveData', attrs['data-show-live-data'] || 'true');
apiUrl.searchParams.set('item', attrs['data-product-id']);
if (attrs['data-daypart-id']) apiUrl.searchParams.set('daypartId', attrs['data-daypart-id']);
apiUrl.searchParams.set('compType', 'core');
apiUrl.searchParams.set('returnType', 'json');

const raw = await curl(apiUrl.href, 'application/json', PAGE_URL);
let parsed = null;
let parseError = null;
try {
  parsed = JSON.parse(raw);
} catch (error) {
  parseError = String(error);
}

await mkdir('artifacts', { recursive: true });
await writeFile(
  OUTPUT,
  `${JSON.stringify({ page_url: PAGE_URL, component_attributes: attrs, api_url: apiUrl.href, parse_error: parseError, raw_body: raw, parsed }, null, 2)}\n`,
  'utf8',
);
console.log(`Wrote ${OUTPUT}; ${raw.length} bytes.`);
