---
type: Food Product
title: 全家 FamilyMart 鮪魚飯糰
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://foods.toptako.com/brands/FamilyMart?categoryId=2
tags:
  - 全家 FamilyMart
  - 飯糰
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-02-23
sources:
  - id: sheet-source-1d6dd7e971b0
    resource: https://foods.toptako.com/brands/FamilyMart?categoryId=2
    title: 全家 - 食物營養倉庫
    source_class: third_party_dataset
    retrieved_at: 2026-08-23T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01220
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 鮪魚飯糰
  aliases:
    - 鮪魚飯糰
    - 全家 FamilyMart鮪魚飯糰
    - 全家 FamilyMart 鮪魚飯糰
revision:
  revision_id: google-sheet-2026-10-25-nut-01220
serving:
  description: 1個（106g）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 188
quality:
  data_quality: third_party_database
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01220
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: nutrition_aggregator
  source_publisher: 食物營養倉庫
  source_author: null
  source_row:
    record_id: NUT-01220
    food_name: 鮪魚飯糰
    brand_or_context: 全家 FamilyMart
    category: 飯糰
    serving_basis: 1個（106g）
    calories_kcal: 188
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: null
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 食物營養倉庫
    source_author: null
    source_title: 全家 - 食物營養倉庫
    source_url: https://foods.toptako.com/brands/FamilyMart?categoryId=2
    article_updated_at: null
    accessed_at: 2026-08-23
    primary_source_url: null
    usage_note: 一般營養整理網站表格明示106g與188kcal；未提供此單品可追溯全家食安單品URL，D級未驗證。
source_observation:
  usage_note: 一般營養整理網站表格明示106g與188kcal；未提供此單品可追溯全家食安單品URL，D級未驗證。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01220 的營養觀測。[^sheet-source-1d6dd7e971b0] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 鮪魚飯糰 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 飯糰 |
| 份量基準 | 1個（106g） |
| energy_kcal | 188 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-1d6dd7e971b0]: 全家 - 食物營養倉庫
