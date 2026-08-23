---
type: Food Product
title: 全家 FamilyMart 茄汁厚起司三明治
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.family.com.tw/Marketing/th/FreshFood/Product
tags:
  - 全家 FamilyMart
  - 三明治
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-07
sources:
  - id: sheet-source-ef98466ee646
    resource: https://www.family.com.tw/Marketing/th/FreshFood/Product
    title: FamilyMart 全家便利商店－最夯新品
    source_class: primary_official
    retrieved_at: 2026-08-07T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:familymart:familymart_茄汁厚起司三明治
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 茄汁厚起司三明治
  aliases:
    - 茄汁厚起司三明治
    - 全家 FamilyMart茄汁厚起司三明治
    - 全家 FamilyMart 茄汁厚起司三明治
revision:
  revision_id: google-sheet-2026-08-22-nut-00883
serving:
  description: 1個（官方頁）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 257
quality:
  data_quality: official_brand
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00883
  evidence_grade: A
  verification_status_as_reported: official_page
  value_method: official_product_page_summary
  source_type: brand_official_product_page
  source_publisher: 全家便利商店
  source_author: null
  source_row:
    record_id: NUT-00883
    food_name: 茄汁厚起司三明治
    brand_or_context: 全家 FamilyMart
    category: 三明治
    serving_basis: 1個（官方頁）
    calories_kcal: 257
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 45
    value_method: official_product_page_summary
    evidence_grade: A
    verification_status: official_page
    source_type: brand_official_product_page
    source_publisher: 全家便利商店
    source_author: null
    source_title: FamilyMart 全家便利商店－最夯新品
    source_url: https://www.family.com.tw/Marketing/th/FreshFood/Product
    article_updated_at: null
    accessed_at: 2026-08-07
    primary_source_url: null
    usage_note: 全家官方新品頁明列每個商品的熱量與價格；其餘營養素未提供，保持空白。動態頁商品可能上下架，實際包裝優先。
source_observation:
  price_twd: 45
  usage_note: 全家官方新品頁明列每個商品的熱量與價格；其餘營養素未提供，保持空白。動態頁商品可能上下架，實際包裝優先。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-00883 的營養觀測。[^sheet-source-ef98466ee646] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 茄汁厚起司三明治 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 三明治 |
| 份量基準 | 1個（官方頁） |
| energy_kcal | 257 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-ef98466ee646]: FamilyMart 全家便利商店－最夯新品
