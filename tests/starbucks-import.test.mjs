import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseProductPage } from "../scripts/starbucks/scrape-starbucks-tw.mjs";

test("Starbucks food transcription pins four source images and 113 unique rows", async () => {
  const fixture = JSON.parse(await readFile("scripts/starbucks/food-nutrition-2026-07-22.json", "utf8"));
  const rows = fixture.images.flatMap(({ items }) => items);

  assert.equal(fixture.images.length, 4);
  assert.equal(rows.length, 113);
  assert.equal(new Set(rows.map(([name]) => name)).size, 113);
  assert.equal(fixture.images.every(({ sha256 }) => /^[a-f0-9]{64}$/u.test(sha256)), true);
  assert.deepEqual(rows.find(([name]) => name === "莓果燕麥優格"), ["莓果燕麥優格", "水果／沙拉", 220, 286, 8.8, 9.7, 3.5, 0, 40.9, 20.5, 103]);
});

test("Starbucks drink parser preserves explicit fields and leaves missing values unknown", () => {
  const html = `
    <h1 class="title_cn">那堤</h1>
    <h3 class="title_en">Caff&egrave; Latte</h3>
    <li><a href="#tabs-1">大杯</a></li>
    <div id="tabs-1"><table>
      <tr><th>價格</th><td>$140</td></tr>
      <tr><th>咖啡因含量 (毫克)</th><td>182</td></tr>
      <tr><th>熱量(大卡)</th><td>295</td></tr>
      <tr><th class="sub">糖(公克)</th><td>23</td></tr>
    </table></div>
    <li><a href="#tabs-2">盒</a></li>
    <div id="tabs-2"><table><tr><th>價格</th><td>$500</td></tr></table></div>
  `;

  const parsed = parseProductPage(html, "fixture");
  assert.equal(parsed.title, "那堤");
  assert.equal(parsed.titleEn, "Caffè Latte");
  assert.deepEqual(parsed.variants, [{
    index: 0,
    label: "大杯",
    nutrition: { caffeine_mg: 182, energy_kcal: 295, sugar_g: 23 },
    price_twd: 140,
  }]);
  assert.equal("protein_g" in parsed.variants[0].nutrition, false);
});
