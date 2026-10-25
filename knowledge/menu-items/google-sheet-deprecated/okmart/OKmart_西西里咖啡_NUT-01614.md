---
type: Food Product
title: OKmart 西西里咖啡
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1652230333.A.544.html
tags:
  - OKmart
  - 咖啡／飲品
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-19
sources:
  - id: sheet-source-bf95f1d7354c
    resource: https://www.ptt.cc/bbs/CVS/M.1652230333.A.544.html
    title: "[商品] OK 西西里咖啡"
    source_class: community_submission
    last_modified: 2022-05-11T00:00:00+08:00
    retrieved_at: 2026-10-19T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01614
  kind: menu_item
  market: TW
  brand: OKmart
  name: 西西里咖啡
  aliases:
    - 西西里咖啡
    - OKmart西西里咖啡
    - OKmart 西西里咖啡
revision:
  revision_id: google-sheet-2026-10-25-nut-01614
serving:
  description: 大杯（1杯，2022年配方）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 230
      sugar_g: 56
quality:
  data_quality: community_report
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01614
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: black1x2y3z
  source_row:
    record_id: NUT-01614
    food_name: 西西里咖啡
    brand_or_context: OKmart
    category: 咖啡／飲品
    serving_basis: 大杯（1杯，2022年配方）
    calories_kcal: 230
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: 56
    sodium_mg: null
    price_twd: 65
    value_method: transcribed_from_forum_post
    evidence_grade: D
    verification_status: historical_unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: black1x2y3z
    source_title: "[商品] OK 西西里咖啡"
    source_url: https://www.ptt.cc/bbs/CVS/M.1652230333.A.544.html
    article_updated_at: 2022-05-11
    accessed_at: 2026-10-19
    primary_source_url: null
    usage_note: 2022年論壇實購，大杯230kcal、糖56g、咖啡因191.7mg；65元當年原價、50元促銷價；不代表現售。
source_observation:
  price_twd: 65
  usage_note: 2022年論壇實購，大杯230kcal、糖56g、咖啡因191.7mg；65元當年原價、50元促銷價；不代表現售。
official_review_hint:
  status: conflict_existing
  existing_food_id: food:tw:menu:okmart:西西里咖啡
  existing_title: OKmart 西西里咖啡
  existing_concept: /menu-items/okmart/OKmart_西西里咖啡.md
  comparison:
    corroborated: false
    compared:
      - &a1
        field: energy_kcal
        candidate_value: 230
        official_value: 258
        delta: 28
        tolerance: 2.58
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

此文件保存試算表記錄 NUT-01614 的營養觀測。[^sheet-source-bf95f1d7354c] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 西西里咖啡 |
| 品牌／情境 | OKmart |
| 分類 | 咖啡／飲品 |
| 份量基準 | 大杯（1杯，2022年配方） |
| energy_kcal | 230 |
| sugar_g | 56 |

# Related Existing Concept

數值需要衝突審查：[OKmart 西西里咖啡](/menu-items/okmart/OKmart_西西里咖啡.md)。

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-bf95f1d7354c]: [商品] OK 西西里咖啡
