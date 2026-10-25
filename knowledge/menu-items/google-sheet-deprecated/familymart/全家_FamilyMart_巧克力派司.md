---
type: Food Product
title: 全家 FamilyMart 巧克力派司
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/chocolate-pastry
tags:
  - 全家 FamilyMart
  - 麵包
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-11
sources:
  - id: sheet-source-b4470310b64b
    resource: https://food.codecity.com.tw/b/family/chocolate-pastry
    title: 全家便利商店巧克力派司熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-11T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01321
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 巧克力派司
  aliases:
    - 巧克力派司
    - 全家 FamilyMart巧克力派司
    - 全家 FamilyMart 巧克力派司
revision:
  revision_id: google-sheet-2026-10-25-nut-01321
serving:
  description: 每份75g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 405
      protein_g: 5.9
      fat_g: 25.9
      carbohydrate_g: 37
      sugar_g: 9.4
      sodium_mg: 265
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01321
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01321
    food_name: 巧克力派司
    brand_or_context: 全家 FamilyMart
    category: 麵包
    serving_basis: 每份75g
    calories_kcal: 405
    protein_g: 5.9
    fat_g: 25.9
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 37
    sugar_g: 9.4
    sodium_mg: 265
    price_twd: null
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店巧克力派司熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/chocolate-pastry
    article_updated_at: null
    accessed_at: 2026-09-11
    primary_source_url: null
    usage_note: 整理頁列每份75g：405kcal、蛋白質5.9g、脂肪25.9g、碳水37g、糖9.4g、鈉265mg；頁面稱轉錄官網但沒有可追溯全家食安單品URL，因此D級unverified，不稱為官方值。
source_observation:
  usage_note: 整理頁列每份75g：405kcal、蛋白質5.9g、脂肪25.9g、碳水37g、糖9.4g、鈉265mg；頁面稱轉錄官網但沒有可追溯全家食安單品URL，因此D級unverified，不稱為官方值。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01321 的營養觀測。[^sheet-source-b4470310b64b] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 巧克力派司 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 麵包 |
| 份量基準 | 每份75g |
| energy_kcal | 405 |
| protein_g | 5.9 |
| fat_g | 25.9 |
| carbohydrate_g | 37 |
| sugar_g | 9.4 |
| sodium_mg | 265 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-b4470310b64b]: 全家便利商店巧克力派司熱量與營養標示｜好食物
