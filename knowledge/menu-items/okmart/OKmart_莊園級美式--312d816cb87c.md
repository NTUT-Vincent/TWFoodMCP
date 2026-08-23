---
type: Food Product
title: OKmart 莊園級美式
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=22853565&fid=98e445de-1314-4f3c-99bb-0abd8d7c5296&itemno=166&mid=e85a79c7-cd54-4aa5-9719-c8a9d0e575ce
tags:
  - OKmart
  - 咖啡／飲品
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-19
sources:
  - id: sheet-source-16ac28934a1e
    resource: https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=22853565&fid=98e445de-1314-4f3c-99bb-0abd8d7c5296&itemno=166&mid=e85a79c7-cd54-4aa5-9719-c8a9d0e575ce
    title: 莊園級美式產品揭露
    source_class: primary_government
    last_modified: 2026-07-25T00:00:00+08:00
    retrieved_at: 2026-08-19T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:okmart:莊園級美式-312d816cb87c
  kind: menu_item
  market: TW
  brand: OKmart
  name: 莊園級美式
  aliases:
    - 莊園級美式
    - OKmart莊園級美式
    - OKmart 莊園級美式
revision:
  revision_id: google-sheet-2026-08-22-nut-01198
serving:
  description: 特大杯熱（約650ml）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 27
quality:
  data_quality: government_database
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01198
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: official_product_page_summary
  source_type: government_food_disclosure
  source_publisher: 臺北市食材登錄平台
  source_author: 臺北市政府衛生局／業者登錄
  source_row:
    record_id: NUT-01198
    food_name: 莊園級美式
    brand_or_context: OKmart
    category: 咖啡／飲品
    serving_basis: 特大杯熱（約650ml）
    calories_kcal: 27
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: null
    value_method: official_product_page_summary
    evidence_grade: B
    verification_status: needs_verification
    source_type: government_food_disclosure
    source_publisher: 臺北市食材登錄平台
    source_author: 臺北市政府衛生局／業者登錄
    source_title: 莊園級美式產品揭露
    source_url: https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=22853565&fid=98e445de-1314-4f3c-99bb-0abd8d7c5296&itemno=166&mid=e85a79c7-cd54-4aa5-9719-c8a9d0e575ce
    article_updated_at: 46228
    accessed_at: 46253
    primary_source_url: https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=22853565&fid=98e445de-1314-4f3c-99bb-0abd8d7c5296&itemno=166&mid=e85a79c7-cd54-4aa5-9719-c8a9d0e575ce
    usage_note: 政府食材登錄頁提供現場調製品參考熱量；未提供其他營養素，故保持空白，門市當批標示優先。
source_observation:
  usage_note: 政府食材登錄頁提供現場調製品參考熱量；未提供其他營養素，故保持空白，門市當批標示優先。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01198 的營養觀測。[^sheet-source-16ac28934a1e] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 莊園級美式 |
| 品牌／情境 | OKmart |
| 分類 | 咖啡／飲品 |
| 份量基準 | 特大杯熱（約650ml） |
| energy_kcal | 27 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-16ac28934a1e]: 莊園級美式產品揭露
