---
type: Food Product
title: 7-ELEVEN 芋頭牛奶霜淇淋
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.7-11.com.tw/freshfoods/24_dessert/index.aspx
tags:
  - 7-ELEVEN
  - 霜淇淋
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-08
sources:
  - id: sheet-source-2ef63d020c6d
    resource: https://www.7-11.com.tw/freshfoods/24_dessert/index.aspx
    title: 7-ELEVEN 小七食堂｜自助熱食與冰品
    source_class: primary_official
    retrieved_at: 2026-08-08T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:7-eleven:芋頭牛奶霜淇淋
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 芋頭牛奶霜淇淋
  aliases:
    - 芋頭牛奶霜淇淋
    - 7-ELEVEN芋頭牛奶霜淇淋
    - 7-ELEVEN 芋頭牛奶霜淇淋
revision:
  revision_id: google-sheet-2026-08-22-nut-00992
serving:
  description: 1份（官方頁）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 154.7
quality:
  data_quality: official_brand
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00992
  evidence_grade: A
  verification_status_as_reported: official_page
  value_method: official_product_page_summary
  source_type: brand_official_product_page
  source_publisher: 7-ELEVEN Taiwan
  source_author: null
  source_row:
    record_id: NUT-00992
    food_name: 芋頭牛奶霜淇淋
    brand_or_context: 7-ELEVEN
    category: 霜淇淋
    serving_basis: 1份（官方頁）
    calories_kcal: 154.7
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 49
    value_method: official_product_page_summary
    evidence_grade: A
    verification_status: official_page
    source_type: brand_official_product_page
    source_publisher: 7-ELEVEN Taiwan
    source_author: null
    source_title: 7-ELEVEN 小七食堂｜自助熱食與冰品
    source_url: https://www.7-11.com.tw/freshfoods/24_dessert/index.aspx
    article_updated_at: null
    accessed_at: 46242
    primary_source_url: null
    usage_note: 7-ELEVEN 品牌官方商品頁直接列出單件熱量與價格；頁面未提供的營養素保持空白，實際包裝／門市公告優先。
source_observation:
  price_twd: 49
  usage_note: 7-ELEVEN 品牌官方商品頁直接列出單件熱量與價格；頁面未提供的營養素保持空白，實際包裝／門市公告優先。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-00992 的營養觀測。[^sheet-source-2ef63d020c6d] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 芋頭牛奶霜淇淋 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 霜淇淋 |
| 份量基準 | 1份（官方頁） |
| energy_kcal | 154.7 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-2ef63d020c6d]: 7-ELEVEN 小七食堂｜自助熱食與冰品
