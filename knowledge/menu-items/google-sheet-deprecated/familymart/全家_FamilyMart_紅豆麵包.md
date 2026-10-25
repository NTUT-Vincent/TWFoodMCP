---
type: Food Product
title: 全家 FamilyMart 紅豆麵包
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/red-bean-bun
tags:
  - 全家 FamilyMart
  - 麵包
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-12
sources:
  - id: sheet-source-0f2da3a6efdf
    resource: https://food.codecity.com.tw/b/family/red-bean-bun
    title: 全家便利商店紅豆麵包熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-12T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01325
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 紅豆麵包
  aliases:
    - 紅豆麵包
    - 全家 FamilyMart紅豆麵包
    - 全家 FamilyMart 紅豆麵包
revision:
  revision_id: google-sheet-2026-10-25-nut-01325
nutrition:
  - basis: per_100g
    values:
      energy_kcal: 261
      protein_g: 8.4
      fat_g: 2.7
      carbohydrate_g: 50.8
      sugar_g: 16.7
      sodium_mg: 200
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01325
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01325
    food_name: 紅豆麵包
    brand_or_context: 全家 FamilyMart
    category: 麵包
    serving_basis: 每份100g
    calories_kcal: 261
    protein_g: 8.4
    fat_g: 2.7
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 50.8
    sugar_g: 16.7
    sodium_mg: 200
    price_twd: null
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店紅豆麵包熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/red-bean-bun
    article_updated_at: null
    accessed_at: 2026-09-12
    primary_source_url: null
    usage_note: 整理頁列每份100g：261kcal、蛋白質8.4g、脂肪2.7g、碳水50.8g、糖16.7g、鈉200mg；頁面稱依品牌官方產品標示轉錄，但未提供可追溯全家食在購安心單品URL，因此不視為官方值，D級unverified。
source_observation:
  usage_note: 整理頁列每份100g：261kcal、蛋白質8.4g、脂肪2.7g、碳水50.8g、糖16.7g、鈉200mg；頁面稱依品牌官方產品標示轉錄，但未提供可追溯全家食在購安心單品URL，因此不視為官方值，D級unverified。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01325 的營養觀測。[^sheet-source-0f2da3a6efdf] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 紅豆麵包 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 麵包 |
| 份量基準 | 每份100g |
| energy_kcal | 261 |
| protein_g | 8.4 |
| fat_g | 2.7 |
| carbohydrate_g | 50.8 |
| sugar_g | 16.7 |
| sodium_mg | 200 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-0f2da3a6efdf]: 全家便利商店紅豆麵包熱量與營養標示｜好食物
