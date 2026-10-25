---
type: Food Product
title: 全家 FamilyMart 草莓大福
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1767858756.A.41B.html
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
  - id: sheet-source-56f02ff00955
    resource: https://www.ptt.cc/bbs/CVS/M.1767858756.A.41B.html
    title: "[商品] 全家草莓優格x比利時巧克力霜淇淋"
    source_class: community_submission
    last_modified: 2026-01-08T00:00:00+08:00
    retrieved_at: 2026-10-11T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01413
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 草莓大福
  aliases:
    - 草莓大福
    - 全家 FamilyMart草莓大福
    - 全家 FamilyMart 草莓大福
revision:
  revision_id: google-sheet-2026-10-25-nut-01413
serving:
  description: 1顆（文章未列重量）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 145.7
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01413
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: byechu5566
  source_row:
    record_id: NUT-01413
    food_name: 草莓大福
    brand_or_context: 全家 FamilyMart
    category: 甜點
    serving_basis: 1顆（文章未列重量）
    calories_kcal: 145.7
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 45
    value_method: transcribed_from_forum_post
    evidence_grade: D
    verification_status: unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: byechu5566
    source_title: "[商品] 全家草莓優格x比利時巧克力霜淇淋"
    source_url: https://www.ptt.cc/bbs/CVS/M.1767858756.A.41B.html
    article_updated_at: 2026-01-08
    accessed_at: 2026-10-11
    primary_source_url: null
    usage_note: 文章同時介紹霜淇淋，但145.7kcal是草莓大福，不是霜淇淋；未列重量。
source_observation:
  price_twd: 45
  usage_note: 文章同時介紹霜淇淋，但145.7kcal是草莓大福，不是霜淇淋；未列重量。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01413 的營養觀測。[^sheet-source-56f02ff00955] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 草莓大福 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 甜點 |
| 份量基準 | 1顆（文章未列重量） |
| energy_kcal | 145.7 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-56f02ff00955]: [商品] 全家草莓優格x比利時巧克力霜淇淋
