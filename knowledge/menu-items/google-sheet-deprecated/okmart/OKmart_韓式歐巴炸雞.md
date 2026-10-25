---
type: Food Product
title: OKmart 韓式歐巴炸雞
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1710928074.A.5A4.html
tags:
  - OKmart
  - 熱食／炸雞
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-02
sources:
  - id: sheet-source-8fcf1956c74f
    resource: https://www.ptt.cc/bbs/CVS/M.1710928074.A.5A4.html
    title: "[商品] Ok超商 歐巴炸雞/蒜味香酥雞/黑胡椒雞塊"
    source_class: community_submission
    last_modified: 2024-03-20T00:00:00+08:00
    retrieved_at: 2026-09-02T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01280
  kind: menu_item
  market: TW
  brand: OKmart
  name: 韓式歐巴炸雞
  aliases:
    - 韓式歐巴炸雞
    - OKmart韓式歐巴炸雞
    - OKmart 韓式歐巴炸雞
revision:
  revision_id: google-sheet-2026-10-25-nut-01280
serving:
  description: 1包（文章未列重量）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 195
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01280
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT 批踢踢實業坊
  source_author: SAINAI (我一直都在)
  source_row:
    record_id: NUT-01280
    food_name: 韓式歐巴炸雞
    brand_or_context: OKmart
    category: 熱食／炸雞
    serving_basis: 1包（文章未列重量）
    calories_kcal: 195
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
    verification_status: historical_unverified
    source_type: forum_post
    source_publisher: PTT 批踢踢實業坊
    source_author: SAINAI (我一直都在)
    source_title: "[商品] Ok超商 歐巴炸雞/蒜味香酥雞/黑胡椒雞塊"
    source_url: https://www.ptt.cc/bbs/CVS/M.1710928074.A.5A4.html
    article_updated_at: 2024-03-20
    accessed_at: 2026-09-02
    primary_source_url: null
    usage_note: 2024年PTT實購文明示OKmart韓式歐巴炸雞每包195大卡、49元；未列重量或完整營養標示，且現行販售／配方未知，因此D級historical_unverified，只供歷史查詢。
source_observation:
  price_twd: 49
  usage_note: 2024年PTT實購文明示OKmart韓式歐巴炸雞每包195大卡、49元；未列重量或完整營養標示，且現行販售／配方未知，因此D級historical_unverified，只供歷史查詢。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01280 的營養觀測。[^sheet-source-8fcf1956c74f] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 韓式歐巴炸雞 |
| 品牌／情境 | OKmart |
| 分類 | 熱食／炸雞 |
| 份量基準 | 1包（文章未列重量） |
| energy_kcal | 195 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-8fcf1956c74f]: [商品] Ok超商 歐巴炸雞/蒜味香酥雞/黑胡椒雞塊
