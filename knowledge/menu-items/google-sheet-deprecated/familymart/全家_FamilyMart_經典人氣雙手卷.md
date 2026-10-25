---
type: Food Product
title: 全家 FamilyMart 經典人氣雙手卷
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/classic-double-hand-roll
tags:
  - 全家 FamilyMart
  - 飯糰／手卷
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-01
sources:
  - id: sheet-source-8f02a93fa09f
    resource: https://food.codecity.com.tw/b/family/classic-double-hand-roll
    title: 全家便利商店經典人氣雙手卷熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-01T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01275
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 經典人氣雙手卷
  aliases:
    - 經典人氣雙手卷
    - 全家 FamilyMart經典人氣雙手卷
    - 全家 FamilyMart 經典人氣雙手卷
revision:
  revision_id: google-sheet-2026-10-25-nut-01275
serving:
  description: 1份170g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 315
      protein_g: 8.2
      fat_g: 6.1
      carbohydrate_g: 56.6
      sugar_g: 7
      sodium_mg: 1010
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01275
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_nutrition_aggregator
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01275
    food_name: 經典人氣雙手卷
    brand_or_context: 全家 FamilyMart
    category: 飯糰／手卷
    serving_basis: 1份170g
    calories_kcal: 315
    protein_g: 8.2
    fat_g: 6.1
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 56.6
    sugar_g: 7
    sodium_mg: 1010
    price_twd: null
    value_method: transcribed_from_nutrition_aggregator
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店經典人氣雙手卷熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/classic-double-hand-roll
    article_updated_at: null
    accessed_at: 2026-09-01
    primary_source_url: null
    usage_note: 整理站明示每份170g、315kcal、蛋白質8.2g、脂肪6.1g、碳水56.6g、糖7g、鈉1010mg，並稱資料來自全家官方產品標示；但頁面未提供可追溯的全家食在購安心單品URL，因此不填primary_source_url、不稱為官方值，D級unverified。
source_observation:
  usage_note: 整理站明示每份170g、315kcal、蛋白質8.2g、脂肪6.1g、碳水56.6g、糖7g、鈉1010mg，並稱資料來自全家官方產品標示；但頁面未提供可追溯的全家食在購安心單品URL，因此不填primary_source_url、不稱為官方值，D級unverified。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01275 的營養觀測。[^sheet-source-8f02a93fa09f] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 經典人氣雙手卷 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 飯糰／手卷 |
| 份量基準 | 1份170g |
| energy_kcal | 315 |
| protein_g | 8.2 |
| fat_g | 6.1 |
| carbohydrate_g | 56.6 |
| sugar_g | 7 |
| sodium_mg | 1010 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-8f02a93fa09f]: 全家便利商店經典人氣雙手卷熱量與營養標示｜好食物
