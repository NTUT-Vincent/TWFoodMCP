---
type: Food Product
title: 全家 FamilyMart 台式麻醬涼麵
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/taiwanese-sesame-cold-noodle
tags:
  - 全家 FamilyMart
  - 麵食／涼麵
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-21
sources:
  - id: sheet-source-b29675721e4b
    resource: https://food.codecity.com.tw/b/family/taiwanese-sesame-cold-noodle
    title: 全家便利商店台式麻醬涼麵熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-21T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01349
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 台式麻醬涼麵
  aliases:
    - 台式麻醬涼麵
    - 全家 FamilyMart台式麻醬涼麵
    - 全家 FamilyMart 台式麻醬涼麵
revision:
  revision_id: google-sheet-2026-10-25-nut-01349
serving:
  description: 293g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 510
      protein_g: 15.2
      fat_g: 22.6
      carbohydrate_g: 61.2
      sugar_g: 4.7
      sodium_mg: 604
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01349
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01349
    food_name: 台式麻醬涼麵
    brand_or_context: 全家 FamilyMart
    category: 麵食／涼麵
    serving_basis: 293g
    calories_kcal: 510
    protein_g: 15.2
    fat_g: 22.6
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 61.2
    sugar_g: 4.7
    sodium_mg: 604
    price_twd: null
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店台式麻醬涼麵熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/taiwanese-sesame-cold-noodle
    article_updated_at: null
    accessed_at: 2026-09-21
    primary_source_url: null
    usage_note: 一般營養整理頁明示每份293g與熱量、蛋白質、脂肪、碳水、糖、鈉；頁面稱來源為官網但未提供可追溯全家食安單品原始URL，因此D級unverified、不稱為官方值。
source_observation:
  usage_note: 一般營養整理頁明示每份293g與熱量、蛋白質、脂肪、碳水、糖、鈉；頁面稱來源為官網但未提供可追溯全家食安單品原始URL，因此D級unverified、不稱為官方值。
official_review_hint:
  status: corroborated_existing
  existing_food_id: food:tw:menu:familymart:familymart_台式麻醬涼麵
  existing_title: 全家 FamilyMart 台式麻醬涼麵
  existing_concept: /menu-items/familymart/全家_FamilyMart_台式麻醬涼麵.md
  comparison:
    corroborated: true
    compared:
      - &a1
        field: energy_kcal
        candidate_value: 510
        official_value: 510
        delta: 0
        tolerance: 5.1000000000000005
      - &a2
        field: protein_g
        candidate_value: 15.2
        official_value: 15.2
        delta: 0
        tolerance: 0.304
      - &a3
        field: fat_g
        candidate_value: 22.6
        official_value: 22.6
        delta: 0
        tolerance: 0.452
      - &a4
        field: carbohydrate_g
        candidate_value: 61.2
        official_value: 61.2
        delta: 0
        tolerance: 1.224
    matched:
      - *a1
      - *a2
      - *a3
      - *a4
    mismatched: []
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01349 的營養觀測。[^sheet-source-b29675721e4b] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 台式麻醬涼麵 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 麵食／涼麵 |
| 份量基準 | 293g |
| energy_kcal | 510 |
| protein_g | 15.2 |
| fat_g | 22.6 |
| carbohydrate_g | 61.2 |
| sugar_g | 4.7 |
| sodium_mg | 604 |

# Related Existing Concept

數值可交叉支持：[全家 FamilyMart 台式麻醬涼麵](/menu-items/familymart/全家_FamilyMart_台式麻醬涼麵.md)。

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-b29675721e4b]: 全家便利商店台式麻醬涼麵熱量與營養標示｜好食物
