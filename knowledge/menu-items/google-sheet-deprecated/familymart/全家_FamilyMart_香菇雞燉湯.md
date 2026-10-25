---
type: Food Product
title: 全家 FamilyMart 香菇雞燉湯
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/mushroom-chicken-soup
tags:
  - 全家 FamilyMart
  - 湯品／熱食
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-26
sources:
  - id: sheet-source-ce5ad223fabd
    resource: https://food.codecity.com.tw/b/family/mushroom-chicken-soup
    title: 全家便利商店香菇雞燉湯熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-26T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01362
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 香菇雞燉湯
  aliases:
    - 香菇雞燉湯
    - 全家 FamilyMart香菇雞燉湯
    - 全家 FamilyMart 香菇雞燉湯
revision:
  revision_id: google-sheet-2026-10-25-nut-01362
serving:
  description: 1份320g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 131
      protein_g: 19.8
      fat_g: 5.4
      carbohydrate_g: 1
      sugar_g: 0
      sodium_mg: 1661
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01362
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_nutrition_aggregator
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01362
    food_name: 香菇雞燉湯
    brand_or_context: 全家 FamilyMart
    category: 湯品／熱食
    serving_basis: 1份320g
    calories_kcal: 131
    protein_g: 19.8
    fat_g: 5.4
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 1
    sugar_g: 0
    sodium_mg: 1661
    price_twd: null
    value_method: transcribed_from_nutrition_aggregator
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店香菇雞燉湯熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/mushroom-chicken-soup
    article_updated_at: null
    accessed_at: 2026-09-26
    primary_source_url: null
    usage_note: 好食物頁面明示每份320g、131kcal、蛋白質19.8g、脂肪5.4g、碳水1g、糖0g、鈉1661mg；頁面稱依品牌官方產品標示轉錄，但未提供可追溯的全家食在購安心單品原始URL，因此D級unverified、不稱為官方值。
source_observation:
  usage_note: 好食物頁面明示每份320g、131kcal、蛋白質19.8g、脂肪5.4g、碳水1g、糖0g、鈉1661mg；頁面稱依品牌官方產品標示轉錄，但未提供可追溯的全家食在購安心單品原始URL，因此D級unverified、不稱為官方值。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01362 的營養觀測。[^sheet-source-ce5ad223fabd] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 香菇雞燉湯 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 湯品／熱食 |
| 份量基準 | 1份320g |
| energy_kcal | 131 |
| protein_g | 19.8 |
| fat_g | 5.4 |
| carbohydrate_g | 1 |
| sugar_g | 0 |
| sodium_mg | 1661 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-ce5ad223fabd]: 全家便利商店香菇雞燉湯熱量與營養標示｜好食物
