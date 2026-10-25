---
type: Food Product
title: 7-ELEVEN 韓式泡菜冷烏龍麵
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/7-11
tags:
  - 7-ELEVEN
  - 涼麵
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-08
sources:
  - id: sheet-source-befd4947726f
    resource: https://food.codecity.com.tw/b/7-11
    title: 7-ELEVEN菜單價格表2026（2026-07-17 更新）｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-10-08T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01379
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 韓式泡菜冷烏龍麵
  aliases:
    - 韓式泡菜冷烏龍麵
    - 7-ELEVEN韓式泡菜冷烏龍麵
    - 7-ELEVEN 韓式泡菜冷烏龍麵
revision:
  revision_id: google-sheet-2026-10-25-nut-01379
serving:
  description: 1入
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 360
quality:
  data_quality: third_party_database
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01379
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_nutrition_aggregator
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01379
    food_name: 韓式泡菜冷烏龍麵
    brand_or_context: 7-ELEVEN
    category: 涼麵
    serving_basis: 1入
    calories_kcal: 360
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 89
    value_method: transcribed_from_nutrition_aggregator
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 7-ELEVEN菜單價格表2026（2026-07-17 更新）｜好食物
    source_url: https://food.codecity.com.tw/b/7-11
    article_updated_at: null
    accessed_at: 2026-10-08
    primary_source_url: null
    usage_note: 好食物7-ELEVEN菜單表列1入360kcal、89元；2026-07-17為價格查證日，非營養更新日。未直接核對官方單品營養標示；其餘營養素未提供，留空。
source_observation:
  price_twd: 89
  usage_note: 好食物7-ELEVEN菜單表列1入360kcal、89元；2026-07-17為價格查證日，非營養更新日。未直接核對官方單品營養標示；其餘營養素未提供，留空。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01379 的營養觀測。[^sheet-source-befd4947726f] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 韓式泡菜冷烏龍麵 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 涼麵 |
| 份量基準 | 1入 |
| energy_kcal | 360 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-befd4947726f]: 7-ELEVEN菜單價格表2026（2026-07-17 更新）｜好食物
