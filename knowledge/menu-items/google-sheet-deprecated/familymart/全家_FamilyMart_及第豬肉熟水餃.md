---
type: Food Product
title: 全家 FamilyMart 及第豬肉熟水餃
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/pork-boiled-dumplings
tags:
  - 全家 FamilyMart
  - 熱食／水餃
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-05
sources:
  - id: sheet-source-91ef1444ba4d
    resource: https://food.codecity.com.tw/b/family/pork-boiled-dumplings
    title: 全家便利商店及第豬肉熟水餃熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-05T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01293
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 及第豬肉熟水餃
  aliases:
    - 及第豬肉熟水餃
    - 全家 FamilyMart及第豬肉熟水餃
    - 全家 FamilyMart 及第豬肉熟水餃
revision:
  revision_id: google-sheet-2026-10-25-nut-01293
serving:
  description: 1份227g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 456
      protein_g: 15
      fat_g: 26.3
      carbohydrate_g: 39.7
      sugar_g: 4.1
      sodium_mg: 1471
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01293
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_nutrition_aggregator
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01293
    food_name: 及第豬肉熟水餃
    brand_or_context: 全家 FamilyMart
    category: 熱食／水餃
    serving_basis: 1份227g
    calories_kcal: 456
    protein_g: 15
    fat_g: 26.3
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 39.7
    sugar_g: 4.1
    sodium_mg: 1471
    price_twd: null
    value_method: transcribed_from_nutrition_aggregator
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店及第豬肉熟水餃熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/pork-boiled-dumplings
    article_updated_at: null
    accessed_at: 2026-09-05
    primary_source_url: null
    usage_note: 好食物頁面明示每份227g、456kcal、蛋白質15g、脂肪26.3g、碳水39.7g、糖4.1g、鈉1471mg，並稱依品牌官方產品標示轉錄；但頁面未提供可追溯的全家食在購安心原始單品URL，因此不稱為官方值、不填primary_source_url，D級unverified。
source_observation:
  usage_note: 好食物頁面明示每份227g、456kcal、蛋白質15g、脂肪26.3g、碳水39.7g、糖4.1g、鈉1471mg，並稱依品牌官方產品標示轉錄；但頁面未提供可追溯的全家食在購安心原始單品URL，因此不稱為官方值、不填primary_source_url，D級unverified。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01293 的營養觀測。[^sheet-source-91ef1444ba4d] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 及第豬肉熟水餃 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 熱食／水餃 |
| 份量基準 | 1份227g |
| energy_kcal | 456 |
| protein_g | 15 |
| fat_g | 26.3 |
| carbohydrate_g | 39.7 |
| sugar_g | 4.1 |
| sodium_mg | 1471 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-91ef1444ba4d]: 全家便利商店及第豬肉熟水餃熱量與營養標示｜好食物
