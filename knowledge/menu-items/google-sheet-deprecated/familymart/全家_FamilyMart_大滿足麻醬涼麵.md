---
type: Food Product
title: 全家 FamilyMart 大滿足麻醬涼麵
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1686220386.A.E80.html
tags:
  - 全家 FamilyMart
  - 涼麵
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-20
sources:
  - id: sheet-source-50822bf124b4
    resource: https://www.ptt.cc/bbs/CVS/M.1686220386.A.E80.html
    title: "[商品] 全家 大滿足麻醬涼麵"
    source_class: community_submission
    last_modified: 2023-06-08T00:00:00+08:00
    retrieved_at: 2026-10-20T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01631
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 大滿足麻醬涼麵
  aliases:
    - 大滿足麻醬涼麵
    - 全家 FamilyMart大滿足麻醬涼麵
    - 全家 FamilyMart 大滿足麻醬涼麵
revision:
  revision_id: google-sheet-2026-10-25-nut-01631
serving:
  description: 1盒（文章未列重量）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 696
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01631
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: jasonsinica
  source_row:
    record_id: NUT-01631
    food_name: 大滿足麻醬涼麵
    brand_or_context: 全家 FamilyMart
    category: 涼麵
    serving_basis: 1盒（文章未列重量）
    calories_kcal: 696
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: null
    value_method: transcribed_from_forum_post
    evidence_grade: D
    verification_status: historical_unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: jasonsinica
    source_title: "[商品] 全家 大滿足麻醬涼麵"
    source_url: https://www.ptt.cc/bbs/CVS/M.1686220386.A.E80.html
    article_updated_at: 2023-06-08
    accessed_at: 2026-10-20
    primary_source_url: null
    usage_note: 2023論壇實購；與飲品合購85元非單盒價格；現售未確認。
source_observation:
  usage_note: 2023論壇實購；與飲品合購85元非單盒價格；現售未確認。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01631 的營養觀測。[^sheet-source-50822bf124b4] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 大滿足麻醬涼麵 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 涼麵 |
| 份量基準 | 1盒（文章未列重量） |
| energy_kcal | 696 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-50822bf124b4]: [商品] 全家 大滿足麻醬涼麵
