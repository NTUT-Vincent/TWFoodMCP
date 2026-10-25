---
type: Food Product
title: 全家 FamilyMart 祝肌力營養牛乳
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.family.com.tw/Marketing/zh/FreshFood/Product
tags:
  - 全家 FamilyMart
  - 乳飲／營養牛乳
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-02-25
sources:
  - id: sheet-source-f3c4c0f927c8
    resource: https://www.family.com.tw/Marketing/zh/FreshFood/Product
    title: FamilyMart 全家便利商店-最夯新品
    source_class: primary_official
    retrieved_at: 2026-08-25T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01235
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 祝肌力營養牛乳
  aliases:
    - 祝肌力營養牛乳
    - 全家 FamilyMart祝肌力營養牛乳
    - 全家 FamilyMart 祝肌力營養牛乳
revision:
  revision_id: google-sheet-2026-10-25-nut-01235
serving:
  description: 1份（瓶裝；官方新品頁）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      protein_g: 5.6
quality:
  data_quality: official_brand
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01235
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: official_product_page_summary
  source_type: brand_official_product_page
  source_publisher: 全家便利商店
  source_author: null
  source_row:
    record_id: NUT-01235
    food_name: 祝肌力營養牛乳
    brand_or_context: 全家 FamilyMart
    category: 乳飲／營養牛乳
    serving_basis: 1份（瓶裝；官方新品頁）
    calories_kcal: null
    protein_g: 5.6
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 49
    value_method: official_product_page_summary
    evidence_grade: B
    verification_status: needs_verification
    source_type: brand_official_product_page
    source_publisher: 全家便利商店
    source_author: null
    source_title: FamilyMart 全家便利商店-最夯新品
    source_url: https://www.family.com.tw/Marketing/zh/FreshFood/Product
    article_updated_at: null
    accessed_at: 2026-08-25
    primary_source_url: null
    usage_note: 品牌官方新品頁明示每份含5.6g蛋白質與售價49元；僅稱每瓶熱量不到110大卡，非精確值，因此calories_kcal保持空白，不推算其他營養素。
source_observation:
  price_twd: 49
  usage_note: 品牌官方新品頁明示每份含5.6g蛋白質與售價49元；僅稱每瓶熱量不到110大卡，非精確值，因此calories_kcal保持空白，不推算其他營養素。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01235 的營養觀測。[^sheet-source-f3c4c0f927c8] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 祝肌力營養牛乳 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 乳飲／營養牛乳 |
| 份量基準 | 1份（瓶裝；官方新品頁） |
| protein_g | 5.6 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-f3c4c0f927c8]: FamilyMart 全家便利商店-最夯新品
