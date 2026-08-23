---
type: Food Product
title: 7-ELEVEN 手撕嫩雞青醬麵沙拉
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.7-11.com.tw/freshfoods/hot.aspx
tags:
  - 7-ELEVEN
  - 麵沙拉／輕食
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-22
sources:
  - id: sheet-source-43e12c98986e
    resource: https://www.7-11.com.tw/freshfoods/hot.aspx
    title: 7-ELEVEN 鮮食新品
    source_class: primary_official
    retrieved_at: 2026-08-22T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01212
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 手撕嫩雞青醬麵沙拉
  aliases:
    - 手撕嫩雞青醬麵沙拉
    - 7-ELEVEN手撕嫩雞青醬麵沙拉
    - 7-ELEVEN 手撕嫩雞青醬麵沙拉
revision:
  revision_id: google-sheet-2026-08-22-nut-01212
serving:
  description: 1份（官方鮮食新品頁）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 170
quality:
  data_quality: official_brand
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01212
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: official_product_page_summary
  source_type: brand_official_product_page
  source_publisher: 7-ELEVEN Taiwan
  source_author: null
  source_row:
    record_id: NUT-01212
    food_name: 手撕嫩雞青醬麵沙拉
    brand_or_context: 7-ELEVEN
    category: 麵沙拉／輕食
    serving_basis: 1份（官方鮮食新品頁）
    calories_kcal: 170
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 79
    value_method: official_product_page_summary
    evidence_grade: B
    verification_status: needs_verification
    source_type: brand_official_product_page
    source_publisher: 7-ELEVEN Taiwan
    source_author: null
    source_title: 7-ELEVEN 鮮食新品
    source_url: https://www.7-11.com.tw/freshfoods/hot.aspx
    article_updated_at: null
    accessed_at: 2026-08-22
    primary_source_url: null
    usage_note: 品牌官方鮮食新品頁明示整份熱量170kcal與價格79元；未提供完整營養標示，其餘營養素保持空白。相同品項另有不同官方URL觀測，依不同source_url獨立保留。
source_observation:
  price_twd: 79
  usage_note: 品牌官方鮮食新品頁明示整份熱量170kcal與價格79元；未提供完整營養標示，其餘營養素保持空白。相同品項另有不同官方URL觀測，依不同source_url獨立保留。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01212 的營養觀測。[^sheet-source-43e12c98986e] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 手撕嫩雞青醬麵沙拉 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 麵沙拉／輕食 |
| 份量基準 | 1份（官方鮮食新品頁） |
| energy_kcal | 170 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-43e12c98986e]: 7-ELEVEN 鮮食新品
