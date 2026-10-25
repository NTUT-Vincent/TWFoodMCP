---
type: Food Product
title: 7-ELEVEN 野生藍莓貝果
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/7-11/wild-blueberry-bagel
tags:
  - 7-ELEVEN
  - 麵包／貝果
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-11
sources:
  - id: sheet-source-584274f186ad
    resource: https://food.codecity.com.tw/b/7-11/wild-blueberry-bagel
    title: 7-ELEVEN野生藍莓貝果熱量 290 kcal、價格 NT$ 35 與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-11T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01319
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 野生藍莓貝果
  aliases:
    - 野生藍莓貝果
    - 7-ELEVEN野生藍莓貝果
    - 7-ELEVEN 野生藍莓貝果
revision:
  revision_id: google-sheet-2026-10-25-nut-01319
serving:
  description: 1入
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 290
quality:
  data_quality: third_party_database
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01319
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01319
    food_name: 野生藍莓貝果
    brand_or_context: 7-ELEVEN
    category: 麵包／貝果
    serving_basis: 1入
    calories_kcal: 290
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 35
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 7-ELEVEN野生藍莓貝果熱量 290 kcal、價格 NT$ 35 與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/7-11/wild-blueberry-bagel
    article_updated_at: null
    accessed_at: 2026-09-11
    primary_source_url: null
    usage_note: 整理頁明示1入、290kcal與35元，並稱來源為官網；但未提供可追溯的7-ELEVEN原始單品營養標示URL，因此不視為官方值，D級unverified；其餘營養素保持空白。
source_observation:
  price_twd: 35
  usage_note: 整理頁明示1入、290kcal與35元，並稱來源為官網；但未提供可追溯的7-ELEVEN原始單品營養標示URL，因此不視為官方值，D級unverified；其餘營養素保持空白。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01319 的營養觀測。[^sheet-source-584274f186ad] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 野生藍莓貝果 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 麵包／貝果 |
| 份量基準 | 1入 |
| energy_kcal | 290 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-584274f186ad]: 7-ELEVEN野生藍莓貝果熱量 290 kcal、價格 NT$ 35 與營養標示｜好食物
