---
type: Food Product
title: 全家 FamilyMart 一顆布丁捲蛋糕
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1775923616.A.21D.html
tags:
  - 全家 FamilyMart
  - 甜點
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-11
sources:
  - id: sheet-source-09e4b7acaa73
    resource: https://www.ptt.cc/bbs/CVS/M.1775923616.A.21D.html
    title: "[商品] 全家 一顆布丁捲蛋糕"
    source_class: community_submission
    last_modified: 2026-04-12T00:00:00+08:00
    retrieved_at: 2026-10-11T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01412
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 一顆布丁捲蛋糕
  aliases:
    - 一顆布丁捲蛋糕
    - 全家 FamilyMart一顆布丁捲蛋糕
    - 全家 FamilyMart 一顆布丁捲蛋糕
revision:
  revision_id: google-sheet-2026-10-25-nut-01412
serving:
  description: 1個85g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 162
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01412
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: y8321y
  source_row:
    record_id: NUT-01412
    food_name: 一顆布丁捲蛋糕
    brand_or_context: 全家 FamilyMart
    category: 甜點
    serving_basis: 1個85g
    calories_kcal: 162
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 49
    value_method: transcribed_from_forum_post
    evidence_grade: D
    verification_status: unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: y8321y
    source_title: "[商品] 全家 一顆布丁捲蛋糕"
    source_url: https://www.ptt.cc/bbs/CVS/M.1775923616.A.21D.html
    article_updated_at: 2026-04-12
    accessed_at: 2026-10-11
    primary_source_url: null
    usage_note: 2026年實購文記85g／162kcal；非官方核實。
source_observation:
  price_twd: 49
  usage_note: 2026年實購文記85g／162kcal；非官方核實。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01412 的營養觀測。[^sheet-source-09e4b7acaa73] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 一顆布丁捲蛋糕 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 甜點 |
| 份量基準 | 1個85g |
| energy_kcal | 162 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-09e4b7acaa73]: [商品] 全家 一顆布丁捲蛋糕
