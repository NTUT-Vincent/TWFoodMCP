---
type: Food Product
title: 7-ELEVEN (蔬)酸辣湯
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1782770068.A.A46.html
tags:
  - 7-ELEVEN
  - 湯品
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-12
sources:
  - id: sheet-source-9860e24b8b2e
    resource: https://www.ptt.cc/bbs/CVS/M.1782770068.A.A46.html
    title: "[商品] 7-11 黑胡椒紅酒牛肉御飯糰/(蔬)酸辣湯"
    source_class: community_submission
    last_modified: 2026-06-30T00:00:00+08:00
    retrieved_at: 2026-10-12T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01437
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: (蔬)酸辣湯
  aliases:
    - (蔬)酸辣湯
    - 7-ELEVEN(蔬)酸辣湯
    - 7-ELEVEN (蔬)酸辣湯
revision:
  revision_id: google-sheet-2026-10-25-nut-01437
serving:
  description: 1份300g（固形物67g）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 78
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01437
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: snxk
  source_row:
    record_id: NUT-01437
    food_name: (蔬)酸辣湯
    brand_or_context: 7-ELEVEN
    category: 湯品
    serving_basis: 1份300g（固形物67g）
    calories_kcal: 78
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
    verification_status: unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: snxk
    source_title: "[商品] 7-11 黑胡椒紅酒牛肉御飯糰/(蔬)酸辣湯"
    source_url: https://www.ptt.cc/bbs/CVS/M.1782770068.A.A46.html
    article_updated_at: 2026-06-30
    accessed_at: 2026-10-12
    primary_source_url: null
    usage_note: 同品項已有其他官方頁來源觀測，本次是獨立論壇來源，不合併也不覆寫。 來源為2026年消費者實購文，僅轉錄明示數字；非官方核實，須核對商品包裝與現售配方。
source_observation:
  price_twd: 59
  usage_note: 同品項已有其他官方頁來源觀測，本次是獨立論壇來源，不合併也不覆寫。 來源為2026年消費者實購文，僅轉錄明示數字；非官方核實，須核對商品包裝與現售配方。
official_review_hint:
  status: identity_only
  existing_food_id: food:tw:menu:7-eleven:蔬酸辣湯
  existing_title: 7-ELEVEN (蔬)酸辣湯
  comparison:
    corroborated: false
    compared:
      - &a1
        field: energy_kcal
        candidate_value: 78
        official_value: 78
        delta: 0
        tolerance: 1
    matched:
      - *a1
    mismatched: []
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01437 的營養觀測。[^sheet-source-9860e24b8b2e] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | (蔬)酸辣湯 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 湯品 |
| 份量基準 | 1份300g（固形物67g） |
| energy_kcal | 78 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-9860e24b8b2e]: [商品] 7-11 黑胡椒紅酒牛肉御飯糰/(蔬)酸辣湯
