import test from "node:test";
import assert from "node:assert/strict";
import {
  corroborateWithOfficialPage,
  extractCategoryArticleUrls,
  extractNutritionCandidates,
  inferBrand,
  isEstimatedArticle,
  matchAgainstOfficialDocuments,
  parseRobots,
  robotsAllows,
} from "../scripts/lib/dailydietitian.mjs";

const brands = [
  { slug: "marugame", name: "丸龜製麵", aliases: ["丸龜"], official_hosts: [] },
  { slug: "mcdonalds", name: "麥當勞", aliases: ["McDonald's"], official_hosts: ["mcdonalds.com"] },
];

test("extracts article links from WordPress category titles", () => {
  const html = `
    <h2 class="entry-title"><a href="https://dailydietitian.com.tw/a/">A</a></h2>
    <h2 class="elementor-post__title"><a href='/b/'>B</a></h2>
  `;
  assert.deepEqual(extractCategoryArticleUrls(html, "https://dailydietitian.com.tw/category/calorie-guide/"), [
    "https://dailydietitian.com.tw/a/",
    "https://dailydietitian.com.tw/b/",
  ]);
});

test("extracts nutrition table rows and marks inferred serving basis", () => {
  const html = `
    <h1>2026 丸龜製麵最新菜單</h1>
    <p>本文中的營養數值為 AI 推估和營養師審查修正</p>
    <table>
      <tr><th>餐點</th><th>熱量 (kcal)</th><th>蛋白質 (g)</th><th>脂肪 (g)</th><th>碳水 (g)</th></tr>
      <tr><td>釜揚烏龍麵（中）</td><td>380</td><td>9</td><td>1.5</td><td>78</td></tr>
    </table>
  `;
  const brand = inferBrand("2026 丸龜製麵最新菜單", brands);
  const candidates = extractNutritionCandidates({
    articleUrl: "https://dailydietitian.com.tw/marugame/",
    articleTitle: "2026 丸龜製麵最新菜單",
    articleModifiedAt: "2026-07-23",
    html,
    brand,
  });
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].brand_slug, "marugame");
  assert.equal(candidates[0].basis, "per_serving");
  assert.equal(candidates[0].basis_inferred, true);
  assert.equal(candidates[0].article.estimated, true);
  assert.deepEqual(candidates[0].nutrition, {
    energy_kcal: 380,
    protein_g: 9,
    fat_g: 1.5,
    carbohydrate_g: 78,
  });
});

test("recognizes estimation disclosures", () => {
  assert.equal(isEstimatedArticle("熱量、蛋白質為 AI 推估和營養師審查修正"), true);
  assert.equal(isEstimatedArticle("資料來自品牌官方營養標示"), false);
});

test("matches an existing official OKF document only when identity and nutrients agree", () => {
  const candidate = {
    brand: "麥當勞",
    item_name: "大麥克",
    basis: "per_serving",
    nutrition: { energy_kcal: 503.2, protein_g: 26, fat_g: 25 },
  };
  const documents = [{
    filePath: "knowledge/menu-items/mcdonalds/big-mac.md",
    data: {
      title: "麥當勞 大麥克",
      food: { id: "food:tw:menu:mcdonalds:big-mac", brand: "麥當勞", name: "大麥克", aliases: ["Big Mac"] },
      nutrition: [{ basis: "per_serving", values: { energy_kcal: 503.17, protein_g: 26, fat_g: 25 } }],
      quality: { data_quality: "official_brand" },
      sources: [{ resource: "https://www.mcdonalds.com/tw/", source_class: "primary_official" }],
    },
  }];
  const result = matchAgainstOfficialDocuments(candidate, documents);
  assert.equal(result.status, "corroborated_existing");
  assert.equal(result.food_id, "food:tw:menu:mcdonalds:big-mac");
});

test("official page corroboration requires item name and every nutrient value", () => {
  const candidate = {
    item_name: "測試堡",
    nutrition: { energy_kcal: 300, protein_g: 20, fat_g: 10 },
  };
  const match = corroborateWithOfficialPage(candidate, "測試堡 每份熱量 300 kcal，蛋白質 20 g，脂肪 10 g");
  assert.equal(match.corroborated, true);
  const partial = corroborateWithOfficialPage(candidate, "測試堡 每份熱量 300 kcal，蛋白質 20 g");
  assert.equal(partial.corroborated, false);
});

test("robots parser honors the most specific matching rule", () => {
  const rules = parseRobots(`
    User-agent: *
    Disallow: /private/
    Allow: /private/public/
  `);
  assert.equal(robotsAllows("https://example.com/private/a", rules), false);
  assert.equal(robotsAllows("https://example.com/private/public/a", rules), true);
  assert.equal(robotsAllows("https://example.com/open", rules), true);
});
