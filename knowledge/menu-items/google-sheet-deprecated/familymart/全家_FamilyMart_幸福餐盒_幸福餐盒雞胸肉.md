---
type: Food Product
title: 全家 FamilyMart／幸福餐盒 幸福餐盒雞胸肉
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.ptt.cc/bbs/CVS/M.1713172018.A.A65.html
tags:
  - 全家 FamilyMart／幸福餐盒
  - 便當
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-23
sources:
  - id: sheet-source-ba89cebd730f
    resource: https://www.ptt.cc/bbs/CVS/M.1713172018.A.A65.html
    title: "[商品] 全家幸福餐盒 雞胸肉與炸白帶魚"
    source_class: community_submission
    last_modified: 2024-04-15T00:00:00+08:00
    retrieved_at: 2026-10-23T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01680
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart／幸福餐盒
  name: 幸福餐盒雞胸肉
  aliases:
    - 幸福餐盒雞胸肉
    - 全家 FamilyMart／幸福餐盒幸福餐盒雞胸肉
    - 全家 FamilyMart／幸福餐盒 幸福餐盒雞胸肉
revision:
  revision_id: google-sheet-2026-10-25-nut-01680
serving:
  description: 1盒（重量未核實）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 555
quality:
  data_quality: community_report
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01680
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_article
  source_type: forum_post
  source_publisher: PTT CVS
  source_author: saur176
  source_row:
    record_id: NUT-01680
    food_name: 幸福餐盒雞胸肉
    brand_or_context: 全家 FamilyMart／幸福餐盒
    category: 便當
    serving_basis: 1盒（重量未核實）
    calories_kcal: 555
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 60
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: historical_unverified
    source_type: forum_post
    source_publisher: PTT CVS
    source_author: saur176
    source_title: "[商品] 全家幸福餐盒 雞胸肉與炸白帶魚"
    source_url: https://www.ptt.cc/bbs/CVS/M.1713172018.A.A65.html
    article_updated_at: 2024-04-15
    accessed_at: 2026-10-23
    primary_source_url: null
    usage_note: 2024年實購，文章同品項重量寫408g與454g，前後不一致；只記錄整盒熱量，歷史價格不代表現價。
source_observation:
  price_twd: 60
  usage_note: 2024年實購，文章同品項重量寫408g與454g，前後不一致；只記錄整盒熱量，歷史價格不代表現價。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01680 的營養觀測。[^sheet-source-ba89cebd730f] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 幸福餐盒雞胸肉 |
| 品牌／情境 | 全家 FamilyMart／幸福餐盒 |
| 分類 | 便當 |
| 份量基準 | 1盒（重量未核實） |
| energy_kcal | 555 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-ba89cebd730f]: [商品] 全家幸福餐盒 雞胸肉與炸白帶魚
