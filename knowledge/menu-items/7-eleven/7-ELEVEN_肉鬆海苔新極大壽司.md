---
type: Food Product
title: 7-ELEVEN 肉鬆海苔新極大壽司
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.7-11.com.tw/freshfoods/1_Ricerolls/index.aspx
tags:
  - 7-ELEVEN
  - 壽司
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-05
sources:
  - id: sheet-source-fa50557cb1f4
    resource: https://www.7-11.com.tw/freshfoods/1_Ricerolls/index.aspx
    title: 7-ELEVEN 小七食堂｜御飯糰
    source_class: primary_official
    retrieved_at: 2026-08-05T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:7-eleven:肉鬆海苔新極大壽司
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 肉鬆海苔新極大壽司
  aliases:
    - 肉鬆海苔新極大壽司
    - 7-ELEVEN肉鬆海苔新極大壽司
    - 7-ELEVEN 肉鬆海苔新極大壽司
revision:
  revision_id: google-sheet-2026-08-22-nut-00197
serving:
  description: 1份（官網商品頁）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 440
quality:
  data_quality: official_brand
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00197
  evidence_grade: A
  verification_status_as_reported: official_page
  value_method: official_product_page_summary
  source_type: brand_official_product_page
  source_publisher: 7-ELEVEN Taiwan
  source_author: null
  source_row:
    record_id: NUT-00197
    food_name: 肉鬆海苔新極大壽司
    brand_or_context: 7-ELEVEN
    category: 壽司
    serving_basis: 1份（官網商品頁）
    calories_kcal: 440
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 65
    value_method: official_product_page_summary
    evidence_grade: A
    verification_status: official_page
    source_type: brand_official_product_page
    source_publisher: 7-ELEVEN Taiwan
    source_author: null
    source_title: 7-ELEVEN 小七食堂｜御飯糰
    source_url: https://www.7-11.com.tw/freshfoods/1_Ricerolls/index.aspx
    article_updated_at: null
    accessed_at: 46239
    primary_source_url: null
    usage_note: 品牌官方頁面摘要；目前僅頁面可見營養欄位，完整數值與現行販售狀態仍以實際包裝為準。
source_observation:
  price_twd: 65
  usage_note: 品牌官方頁面摘要；目前僅頁面可見營養欄位，完整數值與現行販售狀態仍以實際包裝為準。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-00197 的營養觀測。[^sheet-source-fa50557cb1f4] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 肉鬆海苔新極大壽司 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 壽司 |
| 份量基準 | 1份（官網商品頁） |
| energy_kcal | 440 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-fa50557cb1f4]: 7-ELEVEN 小七食堂｜御飯糰
