---
type: Food Product
title: 7-ELEVEN 魚卵龍蝦風味沙拉飯糰
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.7-11.com.tw/freshfoods/1_Ricerolls/index.aspx
tags:
  - 7-ELEVEN
  - 飯糰
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-20
sources:
  - id: sheet-source-fa50557cb1f4
    resource: https://www.7-11.com.tw/freshfoods/1_Ricerolls/index.aspx
    title: 7-ELEVEN 小七食堂｜御飯糰
    source_class: primary_official
    retrieved_at: 2026-08-20T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:7-eleven:魚卵龍蝦風味沙拉飯糰
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 魚卵龍蝦風味沙拉飯糰
  aliases:
    - 魚卵龍蝦風味沙拉飯糰
    - 7-ELEVEN魚卵龍蝦風味沙拉飯糰
    - 7-ELEVEN 魚卵龍蝦風味沙拉飯糰
revision:
  revision_id: google-sheet-2026-08-22-nut-01199
serving:
  description: 1個（官方商品頁）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 227
quality:
  data_quality: official_brand
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01199
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: official_product_page_summary
  source_type: brand_official_product_page
  source_publisher: 7-ELEVEN Taiwan
  source_author: null
  source_row:
    record_id: NUT-01199
    food_name: 魚卵龍蝦風味沙拉飯糰
    brand_or_context: 7-ELEVEN
    category: 飯糰
    serving_basis: 1個（官方商品頁）
    calories_kcal: 227
    protein_g: null
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
    source_publisher: 7-ELEVEN Taiwan
    source_author: null
    source_title: 7-ELEVEN 小七食堂｜御飯糰
    source_url: https://www.7-11.com.tw/freshfoods/1_Ricerolls/index.aspx
    article_updated_at: null
    accessed_at: 2026-08-20
    primary_source_url: null
    usage_note: 品牌官方商品頁僅提供整份熱量與價格，未列完整營養標示；其他營養素保持空白，B級待驗證。
source_observation:
  price_twd: 39
  usage_note: 品牌官方商品頁僅提供整份熱量與價格，未列完整營養標示；其他營養素保持空白，B級待驗證。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01199 的營養觀測。[^sheet-source-fa50557cb1f4] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 魚卵龍蝦風味沙拉飯糰 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 飯糰 |
| 份量基準 | 1個（官方商品頁） |
| energy_kcal | 227 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-fa50557cb1f4]: 7-ELEVEN 小七食堂｜御飯糰
