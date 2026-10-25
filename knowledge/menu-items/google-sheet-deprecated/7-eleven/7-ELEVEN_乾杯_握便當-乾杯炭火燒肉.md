---
type: Food Product
title: 7-ELEVEN／乾杯 握便當-乾杯炭火燒肉
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/7-11/kanpai-grilled-pork-nigiri-bento
tags:
  - 7-ELEVEN／乾杯
  - 飯糰／握便當
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-08
sources:
  - id: sheet-source-ff8f15465894
    resource: https://food.codecity.com.tw/b/7-11/kanpai-grilled-pork-nigiri-bento
    title: 7-ELEVEN握便當-乾杯炭火燒肉熱量、價格與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-08T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01305
  kind: menu_item
  market: TW
  brand: 7-ELEVEN／乾杯
  name: 握便當-乾杯炭火燒肉
  aliases:
    - 握便當-乾杯炭火燒肉
    - 7-ELEVEN／乾杯握便當-乾杯炭火燒肉
    - 7-ELEVEN／乾杯 握便當-乾杯炭火燒肉
revision:
  revision_id: google-sheet-2026-10-25-nut-01305
serving:
  description: 1入
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 525
quality:
  data_quality: third_party_database
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01305
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_nutrition_aggregator
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01305
    food_name: 握便當-乾杯炭火燒肉
    brand_or_context: 7-ELEVEN／乾杯
    category: 飯糰／握便當
    serving_basis: 1入
    calories_kcal: 525
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 69
    value_method: transcribed_from_nutrition_aggregator
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 7-ELEVEN握便當-乾杯炭火燒肉熱量、價格與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/7-11/kanpai-grilled-pork-nigiri-bento
    article_updated_at: null
    accessed_at: 2026-09-08
    primary_source_url: null
    usage_note: 好食物頁面明示1入、525kcal、69元，價格觀測標示為2026-07-17；頁面稱來源為官網但未提供可追溯的7-ELEVEN原始單品營養標示URL，因此不視為官方值、primary_source_url留空，D級unverified。其餘營養素未明示，保持空白。
source_observation:
  price_twd: 69
  usage_note: 好食物頁面明示1入、525kcal、69元，價格觀測標示為2026-07-17；頁面稱來源為官網但未提供可追溯的7-ELEVEN原始單品營養標示URL，因此不視為官方值、primary_source_url留空，D級unverified。其餘營養素未明示，保持空白。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01305 的營養觀測。[^sheet-source-ff8f15465894] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 握便當-乾杯炭火燒肉 |
| 品牌／情境 | 7-ELEVEN／乾杯 |
| 分類 | 飯糰／握便當 |
| 份量基準 | 1入 |
| energy_kcal | 525 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-ff8f15465894]: 7-ELEVEN握便當-乾杯炭火燒肉熱量、價格與營養標示｜好食物
