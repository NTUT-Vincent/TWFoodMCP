---
type: Food Product
title: 全家 FamilyMart 黃金翅包飯
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/stuffed-chicken-wing-rice
tags:
  - 全家 FamilyMart
  - 熱食
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-21
sources:
  - id: sheet-source-3f6338261d7d
    resource: https://food.codecity.com.tw/b/family/stuffed-chicken-wing-rice
    title: 全家便利商店黃金翅包飯熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-21T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01350
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 黃金翅包飯
  aliases:
    - 黃金翅包飯
    - 全家 FamilyMart黃金翅包飯
    - 全家 FamilyMart 黃金翅包飯
revision:
  revision_id: google-sheet-2026-10-25-nut-01350
serving:
  description: 120g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 219.4
      protein_g: 14.6
      fat_g: 6.6
      carbohydrate_g: 25.4
      sugar_g: 3.2
      sodium_mg: 650
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01350
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01350
    food_name: 黃金翅包飯
    brand_or_context: 全家 FamilyMart
    category: 熱食
    serving_basis: 120g
    calories_kcal: 219.4
    protein_g: 14.6
    fat_g: 6.6
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 25.4
    sugar_g: 3.2
    sodium_mg: 650
    price_twd: null
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店黃金翅包飯熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/stuffed-chicken-wing-rice
    article_updated_at: null
    accessed_at: 2026-09-21
    primary_source_url: null
    usage_note: 一般營養整理頁明示每份120g與六項營養值；頁面稱來源為官網但未提供可追溯全家食安單品原始URL，因此D級unverified、不稱為官方值。
source_observation:
  usage_note: 一般營養整理頁明示每份120g與六項營養值；頁面稱來源為官網但未提供可追溯全家食安單品原始URL，因此D級unverified、不稱為官方值。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01350 的營養觀測。[^sheet-source-3f6338261d7d] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 黃金翅包飯 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 熱食 |
| 份量基準 | 120g |
| energy_kcal | 219.4 |
| protein_g | 14.6 |
| fat_g | 6.6 |
| carbohydrate_g | 25.4 |
| sugar_g | 3.2 |
| sodium_mg | 650 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-3f6338261d7d]: 全家便利商店黃金翅包飯熱量與營養標示｜好食物
