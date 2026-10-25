---
type: Food Product
title: 7-ELEVEN 增雞蛋白餐
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1715182309.A.9D0.html
tags:
  - 7-ELEVEN
  - 餐盒／蛋白餐
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-18
sources:
  - id: sheet-source-aae3adb7fd5e
    resource: https://www.ptt.cc/bbs/CVS/M.1715182309.A.9D0.html
    title: "[商品] 7-11增雞蛋白餐"
    source_class: community_submission
    last_modified: 2024-05-14T00:00:00+08:00
    retrieved_at: 2026-10-18T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01584
  kind: menu_item
  market: TW
  brand: 7-ELEVEN
  name: 增雞蛋白餐
  aliases:
    - 增雞蛋白餐
    - 7-ELEVEN增雞蛋白餐
    - 7-ELEVEN 增雞蛋白餐
revision:
  revision_id: google-sheet-2026-10-25-nut-01584
serving:
  description: 1盒（文章未列重量）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 595
      sodium_mg: 1123
quality:
  data_quality: community_report
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01584
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_forum_post
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: HPLC
  source_row:
    record_id: NUT-01584
    food_name: 增雞蛋白餐
    brand_or_context: 7-ELEVEN
    category: 餐盒／蛋白餐
    serving_basis: 1盒（文章未列重量）
    calories_kcal: 595
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: 1123
    price_twd: 99
    value_method: transcribed_from_forum_post
    evidence_grade: D
    verification_status: historical_unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: HPLC
    source_title: "[商品] 7-11增雞蛋白餐"
    source_url: https://www.ptt.cc/bbs/CVS/M.1715182309.A.9D0.html
    article_updated_at: 2024-05-14
    accessed_at: 2026-10-18
    primary_source_url: null
    usage_note: 2024年實購；鈉來自文章描述的營養標示，重量不明；不同於既有『增雞蛋白餐＋海藻』組合觀測。
source_observation:
  price_twd: 99
  usage_note: 2024年實購；鈉來自文章描述的營養標示，重量不明；不同於既有『增雞蛋白餐＋海藻』組合觀測。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01584 的營養觀測。[^sheet-source-aae3adb7fd5e] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 增雞蛋白餐 |
| 品牌／情境 | 7-ELEVEN |
| 分類 | 餐盒／蛋白餐 |
| 份量基準 | 1盒（文章未列重量） |
| energy_kcal | 595 |
| sodium_mg | 1123 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-aae3adb7fd5e]: [商品] 7-11增雞蛋白餐
