---
type: Food Product
title: 全家 FamilyMart 經典肉鬆飯糰
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/classic-pork-floss-onigiri
tags:
  - 全家 FamilyMart
  - 飯糰
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-08
sources:
  - id: sheet-source-bdc64fbff54f
    resource: https://food.codecity.com.tw/b/family/classic-pork-floss-onigiri
    title: 全家便利商店經典肉鬆飯糰熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-08T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01307
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 經典肉鬆飯糰
  aliases:
    - 經典肉鬆飯糰
    - 全家 FamilyMart經典肉鬆飯糰
    - 全家 FamilyMart 經典肉鬆飯糰
revision:
  revision_id: google-sheet-2026-10-25-nut-01307
serving:
  description: 1份104g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 223
      protein_g: 6.4
      fat_g: 5.3
      carbohydrate_g: 37.2
      sugar_g: 2.3
      sodium_mg: 254
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01307
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_nutrition_aggregator
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01307
    food_name: 經典肉鬆飯糰
    brand_or_context: 全家 FamilyMart
    category: 飯糰
    serving_basis: 1份104g
    calories_kcal: 223
    protein_g: 6.4
    fat_g: 5.3
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 37.2
    sugar_g: 2.3
    sodium_mg: 254
    price_twd: null
    value_method: transcribed_from_nutrition_aggregator
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店經典肉鬆飯糰熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/classic-pork-floss-onigiri
    article_updated_at: null
    accessed_at: 2026-09-08
    primary_source_url: null
    usage_note: 好食物頁面明示每份104g、223kcal、蛋白質6.4g、脂肪5.3g、碳水37.2g、糖2.3g、鈉254mg；頁面未提供可追溯的全家食在購安心原始單品URL，因此D級unverified、不視為官方值。資料庫另有不同來源「食物營養倉庫」觀測為107g／239kcal（NUT-01219）；依不同來源各自保留、不平均，待實體包裝或官方食安頁核對版本差異。
source_observation:
  usage_note: 好食物頁面明示每份104g、223kcal、蛋白質6.4g、脂肪5.3g、碳水37.2g、糖2.3g、鈉254mg；頁面未提供可追溯的全家食在購安心原始單品URL，因此D級unverified、不視為官方值。資料庫另有不同來源「食物營養倉庫」觀測為107g／239kcal（NUT-01219）；依不同來源各自保留、不平均，待實體包裝或官方食安頁核對版本差異。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01307 的營養觀測。[^sheet-source-bdc64fbff54f] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 經典肉鬆飯糰 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 飯糰 |
| 份量基準 | 1份104g |
| energy_kcal | 223 |
| protein_g | 6.4 |
| fat_g | 5.3 |
| carbohydrate_g | 37.2 |
| sugar_g | 2.3 |
| sodium_mg | 254 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-bdc64fbff54f]: 全家便利商店經典肉鬆飯糰熱量與營養標示｜好食物
