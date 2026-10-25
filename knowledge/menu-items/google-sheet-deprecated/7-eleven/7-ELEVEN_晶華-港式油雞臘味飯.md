---
type: Food Product
title: 7-ELEVEN 晶華-港式油雞臘味飯
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://7-11.com.tw/7app/index.aspx
tags:
  - 7-ELEVEN
  - 便當／主食
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-24
sources:
  - id: sheet-source-1bc8021b9d42
    resource: https://7-11.com.tw/7app/index.aspx
    title: 7-ELEVEN APP｜鮮食新品
    source_class: primary_official
    retrieved_at: 2026-10-24T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01699
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 晶華-港式油雞臘味飯
  aliases:
    - 晶華-港式油雞臘味飯
    - 7-ELEVEN晶華-港式油雞臘味飯
    - 7-ELEVEN 晶華-港式油雞臘味飯
revision:
  revision_id: google-sheet-2026-10-25-nut-01699
serving:
  description: 1份（官方鮮食新品摘要，未列重量）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 541
quality:
  data_quality: official_brand
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01699
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: official_product_page_summary
  source_type: brand_official_product_page
  source_publisher: 7-ELEVEN Taiwan
  source_author: null
  source_row:
    record_id: NUT-01699
    food_name: 晶華-港式油雞臘味飯
    brand_or_context: 7-ELEVEN
    category: 便當／主食
    serving_basis: 1份（官方鮮食新品摘要，未列重量）
    calories_kcal: 541
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 99
    value_method: official_product_page_summary
    evidence_grade: B
    verification_status: needs_verification
    source_type: brand_official_product_page
    source_publisher: 7-ELEVEN Taiwan
    source_author: null
    source_title: 7-ELEVEN APP｜鮮食新品
    source_url: https://7-11.com.tw/7app/index.aspx
    article_updated_at: null
    accessed_at: 2026-10-24
    primary_source_url: null
    usage_note: 品牌官方鮮食新品頁搜尋摘要僅列整份熱量與售價；動態頁本輪無法直接回讀完整標示，B級待核對；不得推算其他營養素，現售依門市為準。
source_observation:
  price_twd: 99
  usage_note: 品牌官方鮮食新品頁搜尋摘要僅列整份熱量與售價；動態頁本輪無法直接回讀完整標示，B級待核對；不得推算其他營養素，現售依門市為準。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01699 的營養觀測。[^sheet-source-1bc8021b9d42] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 晶華-港式油雞臘味飯 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 便當／主食 |
| 份量基準 | 1份（官方鮮食新品摘要，未列重量） |
| energy_kcal | 541 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-1bc8021b9d42]: 7-ELEVEN APP｜鮮食新品
