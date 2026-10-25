---
type: Food Product
title: 7-ELEVEN 醬燒里肌鮮蔬三明治
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/7-11/pork-loin-veg-sandwich
tags:
  - 7-ELEVEN
  - 三明治
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-04
sources:
  - id: sheet-source-cf2ef6768226
    resource: https://food.codecity.com.tw/b/7-11/pork-loin-veg-sandwich
    title: 7-ELEVEN醬燒里肌鮮蔬三明治熱量、價格與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-04T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01286
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 醬燒里肌鮮蔬三明治
  aliases:
    - 醬燒里肌鮮蔬三明治
    - 7-ELEVEN醬燒里肌鮮蔬三明治
    - 7-ELEVEN 醬燒里肌鮮蔬三明治
revision:
  revision_id: google-sheet-2026-10-25-nut-01286
serving:
  description: 1入
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 268
quality:
  data_quality: third_party_database
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01286
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_nutrition_aggregator
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01286
    food_name: 醬燒里肌鮮蔬三明治
    brand_or_context: 7-ELEVEN
    category: 三明治
    serving_basis: 1入
    calories_kcal: 268
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
    source_title: 7-ELEVEN醬燒里肌鮮蔬三明治熱量、價格與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/7-11/pork-loin-veg-sandwich
    article_updated_at: null
    accessed_at: 2026-09-04
    primary_source_url: null
    usage_note: 好食物頁面明示1入、268kcal、69元，並稱整理自官方頁；但未提供可追溯的7-ELEVEN原始單品營養標示URL，因此不視為官方值，D級unverified，其餘營養素保持空白。
source_observation:
  price_twd: 69
  usage_note: 好食物頁面明示1入、268kcal、69元，並稱整理自官方頁；但未提供可追溯的7-ELEVEN原始單品營養標示URL，因此不視為官方值，D級unverified，其餘營養素保持空白。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01286 的營養觀測。[^sheet-source-cf2ef6768226] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 醬燒里肌鮮蔬三明治 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 三明治 |
| 份量基準 | 1入 |
| energy_kcal | 268 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-cf2ef6768226]: 7-ELEVEN醬燒里肌鮮蔬三明治熱量、價格與營養標示｜好食物
