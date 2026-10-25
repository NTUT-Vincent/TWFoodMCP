---
type: Food Product
title: 全家 FamilyMart 拿坡里蕃茄纖脆片刻
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.family.com.tw/Marketing/zh/FreshFood/Product
tags:
  - 全家 FamilyMart
  - 零食／穀物脆片
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
  id: food:tw:menu:google-sheet:nut-01234
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 拿坡里蕃茄纖脆片刻
  aliases:
    - 拿坡里蕃茄纖脆片刻
    - 全家 FamilyMart拿坡里蕃茄纖脆片刻
    - 全家 FamilyMart 拿坡里蕃茄纖脆片刻
revision:
  revision_id: google-sheet-2026-10-25-nut-01234
serving:
  description: 1包（官方新品頁描述）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 122.4
      sugar_g: 3.5
quality:
  data_quality: official_brand
  completeness: partial
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01234
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: official_product_page_summary
  source_type: brand_official_product_page
  source_publisher: 全家便利商店
  source_author: null
  source_row:
    record_id: NUT-01234
    food_name: 拿坡里蕃茄纖脆片刻
    brand_or_context: 全家 FamilyMart
    category: 零食／穀物脆片
    serving_basis: 1包（官方新品頁描述）
    calories_kcal: 122.4
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: 3.5
    sodium_mg: null
    price_twd: null
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
    usage_note: 品牌官方新品頁明示每包122.4大卡、糖3.5g，另有膳食纖維3.4g但目前schema無膳食纖維欄，記於usage_note；其餘未明示營養素不推算。
source_observation:
  usage_note: 品牌官方新品頁明示每包122.4大卡、糖3.5g，另有膳食纖維3.4g但目前schema無膳食纖維欄，記於usage_note；其餘未明示營養素不推算。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01234 的營養觀測。[^sheet-source-f3c4c0f927c8] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 拿坡里蕃茄纖脆片刻 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 零食／穀物脆片 |
| 份量基準 | 1包（官方新品頁描述） |
| energy_kcal | 122.4 |
| sugar_g | 3.5 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-f3c4c0f927c8]: FamilyMart 全家便利商店-最夯新品
