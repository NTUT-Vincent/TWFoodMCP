---
type: Food Product
title: 7-ELEVEN 握便當－黑胡椒烤雞
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1758204270.A.009.html
tags:
  - 7-ELEVEN
  - 飯糰／握便當
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-21
sources:
  - id: sheet-source-78294a7d8aa9
    resource: https://www.ptt.cc/bbs/CVS/M.1758204270.A.009.html
    title: "[商品] 7-11 握便當-黑胡椒烤雞"
    source_class: community_submission
    last_modified: 2025-09-18T00:00:00+08:00
    retrieved_at: 2026-10-21T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01645
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 握便當－黑胡椒烤雞
  aliases:
    - 握便當－黑胡椒烤雞
    - 7-ELEVEN握便當－黑胡椒烤雞
    - 7-ELEVEN 握便當－黑胡椒烤雞
revision:
  revision_id: google-sheet-2026-10-25-nut-01645
serving:
  description: 1份（文章未列重量）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 423
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01645
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: HPLC
  source_row:
    record_id: NUT-01645
    food_name: 握便當－黑胡椒烤雞
    brand_or_context: 7-ELEVEN
    category: 飯糰／握便當
    serving_basis: 1份（文章未列重量）
    calories_kcal: 423
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 59
    value_method: transcribed_from_forum_post
    evidence_grade: D
    verification_status: historical_unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: HPLC
    source_title: "[商品] 7-11 握便當-黑胡椒烤雞"
    source_url: https://www.ptt.cc/bbs/CVS/M.1758204270.A.009.html
    article_updated_at: 2025-09-18
    accessed_at: 2026-10-21
    primary_source_url: null
    usage_note: 2025論壇實購；未提供重量，現售與新版營養標示待確認。
source_observation:
  price_twd: 59
  usage_note: 2025論壇實購；未提供重量，現售與新版營養標示待確認。
official_review_hint:
  status: conflict_existing
  existing_food_id: food:tw:menu:7-eleven:握便當-黑胡椒烤雞
  existing_title: 7-ELEVEN 握便當-黑胡椒烤雞
  existing_concept: /menu-items/7-eleven/7-ELEVEN_握便當-黑胡椒烤雞.md
  comparison:
    corroborated: false
    compared:
      - &a1
        field: energy_kcal
        candidate_value: 423
        official_value: 334
        delta: 89
        tolerance: 3.34
    matched: []
    mismatched:
      - *a1
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
  - 此觀測與既有官方 OKF 的一項或多項營養數值不一致，必須人工判讀版本與來源日期。
---

# Summary

此文件保存試算表記錄 NUT-01645 的營養觀測。[^sheet-source-78294a7d8aa9] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 握便當－黑胡椒烤雞 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 飯糰／握便當 |
| 份量基準 | 1份（文章未列重量） |
| energy_kcal | 423 |

# Related Existing Concept

數值需要衝突審查：[7-ELEVEN 握便當-黑胡椒烤雞](/menu-items/7-eleven/7-ELEVEN_握便當-黑胡椒烤雞.md)。

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-78294a7d8aa9]: [商品] 7-11 握便當-黑胡椒烤雞
