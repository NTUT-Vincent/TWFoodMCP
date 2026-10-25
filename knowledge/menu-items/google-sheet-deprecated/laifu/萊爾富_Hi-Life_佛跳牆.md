---
type: Food Product
title: 萊爾富 Hi-Life 佛跳牆
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1769857925.A.E0F.html
tags:
  - 萊爾富 Hi-Life
  - 湯品／熟食
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-02-27
sources:
  - id: sheet-source-e4e5b938d811
    resource: https://www.ptt.cc/bbs/CVS/M.1769857925.A.E0F.html
    title: "[商品] 萊爾富 佛跳牆"
    source_class: community_submission
    last_modified: 2026-01-31T00:00:00+08:00
    retrieved_at: 2026-08-27T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01256
  kind: menu_item
  market: TW
  brand: 萊爾富 Hi-Life
  name: 佛跳牆
  aliases:
    - 佛跳牆
    - 萊爾富 Hi-Life佛跳牆
    - 萊爾富 Hi-Life 佛跳牆
revision:
  revision_id: google-sheet-2026-10-25-nut-01256
serving:
  description: 1份567.5g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 501
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01256
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: forum_post
  source_publisher: PTT 批踢踢實業坊
  source_author: KuGinseng
  source_row:
    record_id: NUT-01256
    food_name: 佛跳牆
    brand_or_context: 萊爾富 Hi-Life
    category: 湯品／熟食
    serving_basis: 1份567.5g
    calories_kcal: 501
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 129
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: forum_post
    source_publisher: PTT 批踢踢實業坊
    source_author: KuGinseng
    source_title: "[商品] 萊爾富 佛跳牆"
    source_url: https://www.ptt.cc/bbs/CVS/M.1769857925.A.E0F.html
    article_updated_at: 2026-01-31
    accessed_at: 2026-08-27
    primary_source_url: null
    usage_note: 2026年PTT實購文明示567.5g／501大卡、原價129元；內文另提鈉含量2000但未清楚給出單位與標示上下文，因此sodium_mg保持空白，不自行判定，D級unverified。
source_observation:
  price_twd: 129
  usage_note: 2026年PTT實購文明示567.5g／501大卡、原價129元；內文另提鈉含量2000但未清楚給出單位與標示上下文，因此sodium_mg保持空白，不自行判定，D級unverified。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01256 的營養觀測。[^sheet-source-e4e5b938d811] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 佛跳牆 |
| 品牌／情境 | 萊爾富 Hi-Life |
| 分類 | 湯品／熟食 |
| 份量基準 | 1份567.5g |
| energy_kcal | 501 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-e4e5b938d811]: [商品] 萊爾富 佛跳牆
