---
type: Food Product
title: 7-ELEVEN 統一純喫茶綠茶（原版）
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1744814270.A.791.html
tags:
  - 7-ELEVEN
  - 瓶裝飲品／綠茶
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-17
sources:
  - id: sheet-source-aa12868eea72
    resource: https://www.ptt.cc/bbs/CVS/M.1744814270.A.791.html
    title: "[商品] 7-11 統一純喫茶綠茶 新改款"
    source_class: community_submission
    last_modified: 2025-04-16T00:00:00+08:00
    retrieved_at: 2026-10-17T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01573
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 統一純喫茶綠茶（原版）
  aliases:
    - 統一純喫茶綠茶（原版）
    - 7-ELEVEN統一純喫茶綠茶（原版）
    - 7-ELEVEN 統一純喫茶綠茶（原版）
revision:
  revision_id: google-sheet-2026-10-25-nut-01573
nutrition:
  - basis: per_100ml
    values:
      energy_kcal: 20.8
      carbohydrate_g: 5.2
      sugar_g: 4.8
quality:
  data_quality: community_report
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01573
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: Lomax
  source_row:
    record_id: NUT-01573
    food_name: 統一純喫茶綠茶（原版）
    brand_or_context: 7-ELEVEN
    category: 瓶裝飲品／綠茶
    serving_basis: 每100mL（650mL瓶裝）
    calories_kcal: 20.8
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 5.2
    sugar_g: 4.8
    sodium_mg: null
    price_twd: null
    value_method: transcribed_from_forum_post
    evidence_grade: D
    verification_status: historical_unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: Lomax
    source_title: "[商品] 7-11 統一純喫茶綠茶 新改款"
    source_url: https://www.ptt.cc/bbs/CVS/M.1744814270.A.791.html
    article_updated_at: 2025-04-16
    accessed_at: 2026-10-17
    primary_source_url: null
    usage_note: 2025-04-16 PTT比較新舊版；此為舊版每100mL，不代表現售。
source_observation:
  usage_note: 2025-04-16 PTT比較新舊版；此為舊版每100mL，不代表現售。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01573 的營養觀測。[^sheet-source-aa12868eea72] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 統一純喫茶綠茶（原版） |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 瓶裝飲品／綠茶 |
| 份量基準 | 每100mL（650mL瓶裝） |
| energy_kcal | 20.8 |
| carbohydrate_g | 5.2 |
| sugar_g | 4.8 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-aa12868eea72]: [商品] 7-11 統一純喫茶綠茶 新改款
