---
type: Food Product
title: OKmart 麻油豬飯糰
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1727782003.A.E2F.html
tags:
  - OKmart
  - 飯糰
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-13
sources:
  - id: sheet-source-6125282456a1
    resource: https://www.ptt.cc/bbs/CVS/M.1727782003.A.E2F.html
    title: "[商品] ok 爆炒台灣豚本丸&麻油豬飯糰"
    source_class: community_submission
    last_modified: 2024-10-01T00:00:00+08:00
    retrieved_at: 2026-10-13T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01478
  kind: menu_item
  market: TW
  brand: OKmart
  name: 麻油豬飯糰
  aliases:
    - 麻油豬飯糰
    - OKmart麻油豬飯糰
    - OKmart 麻油豬飯糰
revision:
  revision_id: google-sheet-2026-10-25-nut-01478
serving:
  description: 1個（文章未列重量）
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
  record_id: NUT-01478
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: xuxu
  source_row:
    record_id: NUT-01478
    food_name: 麻油豬飯糰
    brand_or_context: OKmart
    category: 飯糰
    serving_basis: 1個（文章未列重量）
    calories_kcal: 162
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
    source_author: xuxu
    source_title: "[商品] ok 爆炒台灣豚本丸&麻油豬飯糰"
    source_url: https://www.ptt.cc/bbs/CVS/M.1727782003.A.E2F.html
    article_updated_at: 2024-10-01
    accessed_at: 2026-10-13
    primary_source_url: null
    usage_note: 歷史實購觀測（2024-10-01），不代表現售或現行配方。 僅轉錄來源明示熱量與可辨識鈉；非品牌官方核實。 文章未列商品重量／完整份量，暫以一件或一份記錄，待核對包裝。 27元為即期折扣價，不當作一般售價。
source_observation:
  price_twd: 45
  usage_note: 歷史實購觀測（2024-10-01），不代表現售或現行配方。 僅轉錄來源明示熱量與可辨識鈉；非品牌官方核實。 文章未列商品重量／完整份量，暫以一件或一份記錄，待核對包裝。 27元為即期折扣價，不當作一般售價。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01478 的營養觀測。[^sheet-source-6125282456a1] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 麻油豬飯糰 |
| 品牌／情境 | OKmart |
| 分類 | 飯糰 |
| 份量基準 | 1個（文章未列重量） |
| energy_kcal | 162 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-6125282456a1]: [商品] ok 爆炒台灣豚本丸&麻油豬飯糰
