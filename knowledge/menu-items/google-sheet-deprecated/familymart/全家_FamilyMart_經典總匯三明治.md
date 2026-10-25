---
type: Food Product
title: 全家 FamilyMart 經典總匯三明治
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family
tags:
  - 全家 FamilyMart
  - 三明治／漢堡
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-17
sources:
  - id: sheet-source-e52692ec309e
    resource: https://food.codecity.com.tw/b/family
    title: 全家便利商店菜單熱量表：60 個品項的熱量與糖含量（官方未公布價格）｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-17T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01339
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 經典總匯三明治
  aliases:
    - 經典總匯三明治
    - 全家 FamilyMart經典總匯三明治
    - 全家 FamilyMart 經典總匯三明治
revision:
  revision_id: google-sheet-2026-10-25-nut-01339
serving:
  description: 1入
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 209
      sugar_g: 3.1
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01339
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01339
    food_name: 經典總匯三明治
    brand_or_context: 全家 FamilyMart
    category: 三明治／漢堡
    serving_basis: 1入
    calories_kcal: 209
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: 3.1
    sodium_mg: null
    price_twd: null
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店菜單熱量表：60 個品項的熱量與糖含量（官方未公布價格）｜好食物
    source_url: https://food.codecity.com.tw/b/family
    article_updated_at: null
    accessed_at: 2026-09-17
    primary_source_url: null
    usage_note: 彙總頁明示經典總匯三明治1入、209kcal、糖3.1g；未提供可追溯全家食安單品原始URL，D級unverified；其他營養素與價格不推算。
source_observation:
  usage_note: 彙總頁明示經典總匯三明治1入、209kcal、糖3.1g；未提供可追溯全家食安單品原始URL，D級unverified；其他營養素與價格不推算。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01339 的營養觀測。[^sheet-source-e52692ec309e] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 經典總匯三明治 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 三明治／漢堡 |
| 份量基準 | 1入 |
| energy_kcal | 209 |
| sugar_g | 3.1 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-e52692ec309e]: 全家便利商店菜單熱量表：60 個品項的熱量與糖含量（官方未公布價格）｜好食物
