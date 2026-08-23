---
type: Food Product
title: 全家 FamilyMart 香滷蛋白棒
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.family.com.tw/Marketing/zh/FreshFood/Product
tags:
  - 全家 FamilyMart
  - 蛋白質點心
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-22
sources:
  - id: sheet-source-f3c4c0f927c8
    resource: https://www.family.com.tw/Marketing/zh/FreshFood/Product
    title: FamilyMart 全家便利商店-最夯新品
    source_class: primary_official
    retrieved_at: 2026-08-22T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:familymart:familymart_香滷蛋白棒
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 香滷蛋白棒
  aliases:
    - 香滷蛋白棒
    - 全家 FamilyMart香滷蛋白棒
    - 全家 FamilyMart 香滷蛋白棒
revision:
  revision_id: google-sheet-2026-08-22-nut-01213
nutrition:
  - basis: per_100g
    values:
      protein_g: 10
quality:
  data_quality: official_brand
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01213
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: official_product_page_summary
  source_type: brand_official_product_page
  source_publisher: 全家便利商店
  source_author: null
  source_row:
    record_id: NUT-01213
    food_name: 香滷蛋白棒
    brand_or_context: 全家 FamilyMart
    category: 蛋白質點心
    serving_basis: 100g（官方新品頁描述）
    calories_kcal: null
    protein_g: 10
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 39
    value_method: official_product_page_summary
    evidence_grade: B
    verification_status: needs_verification
    source_type: brand_official_product_page
    source_publisher: 全家便利商店
    source_author: null
    source_title: FamilyMart 全家便利商店-最夯新品
    source_url: https://www.family.com.tw/Marketing/zh/FreshFood/Product
    article_updated_at: null
    accessed_at: 2026-08-22
    primary_source_url: null
    usage_note: 品牌官方新品頁描述每100g約含10g蛋白質；屬約值，未提供熱量與其他營養素，故不推算並以B級待驗證收錄。
source_observation:
  price_twd: 39
  usage_note: 品牌官方新品頁描述每100g約含10g蛋白質；屬約值，未提供熱量與其他營養素，故不推算並以B級待驗證收錄。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01213 的營養觀測。[^sheet-source-f3c4c0f927c8] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 香滷蛋白棒 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 蛋白質點心 |
| 份量基準 | 100g（官方新品頁描述） |
| protein_g | 10 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-f3c4c0f927c8]: FamilyMart 全家便利商店-最夯新品
