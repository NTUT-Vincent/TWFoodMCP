---
type: Food Product
title: 7-ELEVEN 巧克力司康
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1735571076.A.AB1.html
tags:
  - 7-ELEVEN
  - 烘焙／司康
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-15
sources:
  - id: sheet-source-1365efeee689
    resource: https://www.ptt.cc/bbs/CVS/M.1735571076.A.AB1.html
    title: "[商品] 7-11 巧克力司康"
    source_class: community_submission
    last_modified: 2024-12-30T00:00:00+08:00
    retrieved_at: 2026-10-15T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01521
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 巧克力司康
  aliases:
    - 巧克力司康
    - 7-ELEVEN巧克力司康
    - 7-ELEVEN 巧克力司康
revision:
  revision_id: google-sheet-2026-10-25-nut-01521
serving:
  description: 1個80g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 344
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01521
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: misky1990
  source_row:
    record_id: NUT-01521
    food_name: 巧克力司康
    brand_or_context: 7-ELEVEN
    category: 烘焙／司康
    serving_basis: 1個80g
    calories_kcal: 344
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
    verification_status: historical_unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: misky1990
    source_title: "[商品] 7-11 巧克力司康"
    source_url: https://www.ptt.cc/bbs/CVS/M.1735571076.A.AB1.html
    article_updated_at: 2024-12-30
    accessed_at: 2026-10-15
    primary_source_url: null
    usage_note: 歷史實購觀測，不代表目前仍有販售或配方相同。 非官方標示；只填文章明示營養數值，缺失營養素不推算。文章日期採發文日。
source_observation:
  price_twd: 45
  usage_note: 歷史實購觀測，不代表目前仍有販售或配方相同。 非官方標示；只填文章明示營養數值，缺失營養素不推算。文章日期採發文日。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01521 的營養觀測。[^sheet-source-1365efeee689] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 巧克力司康 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 烘焙／司康 |
| 份量基準 | 1個80g |
| energy_kcal | 344 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-1365efeee689]: [商品] 7-11 巧克力司康
