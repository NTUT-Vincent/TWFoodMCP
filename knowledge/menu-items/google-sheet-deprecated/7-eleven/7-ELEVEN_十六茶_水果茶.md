---
type: Food Product
title: 7-ELEVEN 十六茶 水果茶
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1777525415.A.08A.html
tags:
  - 7-ELEVEN
  - 瓶裝飲品／水果茶
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-03
sources:
  - id: sheet-source-ad15034344d5
    resource: https://www.ptt.cc/bbs/CVS/M.1777525415.A.08A.html
    title: "[商品] 7-11 十六茶新品 水果茶"
    source_class: community_submission
    last_modified: 2026-04-30T00:00:00+08:00
    retrieved_at: 2026-09-03T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01281
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 十六茶 水果茶
  aliases:
    - 十六茶 水果茶
    - 7-ELEVEN十六茶 水果茶
    - 7-ELEVEN 十六茶 水果茶
revision:
  revision_id: google-sheet-2026-10-25-nut-01281
serving:
  description: 1瓶（文章未列容量）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 160
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01281
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT 批踢踢實業坊
  source_author: hoho080205 (hoho)
  source_row:
    record_id: NUT-01281
    food_name: 十六茶 水果茶
    brand_or_context: 7-ELEVEN
    category: 瓶裝飲品／水果茶
    serving_basis: 1瓶（文章未列容量）
    calories_kcal: 160
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 35
    value_method: transcribed_from_forum_post
    evidence_grade: D
    verification_status: unverified
    source_type: forum_post
    source_publisher: PTT 批踢踢實業坊
    source_author: hoho080205 (hoho)
    source_title: "[商品] 7-11 十六茶新品 水果茶"
    source_url: https://www.ptt.cc/bbs/CVS/M.1777525415.A.08A.html
    article_updated_at: 2026-04-30
    accessed_at: 2026-09-03
    primary_source_url: null
    usage_note: PTT實購文可明確對應7-ELEVEN與十六茶水果茶，整瓶160大卡、35元；文章未列容量與完整營養標示，也未連到品牌原始營養頁，因此D級unverified，其餘營養素保持空白。
source_observation:
  price_twd: 35
  usage_note: PTT實購文可明確對應7-ELEVEN與十六茶水果茶，整瓶160大卡、35元；文章未列容量與完整營養標示，也未連到品牌原始營養頁，因此D級unverified，其餘營養素保持空白。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01281 的營養觀測。[^sheet-source-ad15034344d5] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 十六茶 水果茶 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 瓶裝飲品／水果茶 |
| 份量基準 | 1瓶（文章未列容量） |
| energy_kcal | 160 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-ad15034344d5]: [商品] 7-11 十六茶新品 水果茶
