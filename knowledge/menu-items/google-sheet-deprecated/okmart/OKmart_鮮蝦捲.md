---
type: Food Product
title: OKmart 鮮蝦捲
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=22853565&fid=7d8d07ae-7307-430e-acbe-0bf1684340da&itemno=117&mid=be949bfc-f6cd-4171-89e9-ff209524557d
tags:
  - OKmart
  - 關東煮／熱食
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-18
sources:
  - id: sheet-source-9982fb7eb7ef
    resource: https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=22853565&fid=7d8d07ae-7307-430e-acbe-0bf1684340da&itemno=117&mid=be949bfc-f6cd-4171-89e9-ff209524557d
    title: 鮮蝦捲產品揭露
    source_class: primary_government
    retrieved_at: 2026-08-18T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01170
  kind: menu_item
  market: TW
  brand: OKmart
  name: 鮮蝦捲
  aliases:
    - 鮮蝦捲
    - OKmart鮮蝦捲
    - OKmart 鮮蝦捲
revision:
  revision_id: google-sheet-2026-08-22-nut-01170
serving:
  description: 1份（40g）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 95.6
quality:
  data_quality: government_database
  completeness: minimal
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01170
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: official_product_page_summary
  source_type: government_food_disclosure
  source_publisher: 臺北市食材登錄平台
  source_author: 臺北市政府衛生局／業者登錄
  source_row:
    record_id: NUT-01170
    food_name: 鮮蝦捲
    brand_or_context: OKmart
    category: 關東煮／熱食
    serving_basis: 1份（40g）
    calories_kcal: 95.6
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
    source_title: 鮮蝦捲產品揭露
    source_url: https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=22853565&fid=7d8d07ae-7307-430e-acbe-0bf1684340da&itemno=117&mid=be949bfc-f6cd-4171-89e9-ff209524557d
    article_updated_at: null
    accessed_at: 46252
    primary_source_url: https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=22853565&fid=7d8d07ae-7307-430e-acbe-0bf1684340da&itemno=117&mid=be949bfc-f6cd-4171-89e9-ff209524557d
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

此文件保存試算表記錄 NUT-01170 的營養觀測。[^sheet-source-9982fb7eb7ef] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 鮮蝦捲 |
| 品牌／情境 | OKmart |
| 分類 | 關東煮／熱食 |
| 份量基準 | 1份（40g） |
| energy_kcal | 95.6 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-9982fb7eb7ef]: 鮮蝦捲產品揭露
