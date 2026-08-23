---
type: Food Product
title: 星巴克 Starbucks 烤雞生吐司三明治
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://dailydietitian.com.tw/%E6%98%9F%E5%B7%B4%E5%85%8B%E9%A4%90%E9%BB%9E%E7%86%B1%E9%87%8F-%E7%87%9F%E9%A4%8A%E6%88%90%E5%88%86-%E5%83%B9%E6%A0%BC/
tags:
  - 星巴克 Starbucks
  - 堡／三明治
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-05
sources:
  - id: sheet-source-6d43b0dddc8f
    resource: https://dailydietitian.com.tw/%E6%98%9F%E5%B7%B4%E5%85%8B%E9%A4%90%E9%BB%9E%E7%86%B1%E9%87%8F-%E7%87%9F%E9%A4%8A%E6%88%90%E5%88%86-%E5%83%B9%E6%A0%BC/
    title: 2026 星巴克餐點菜單：熱量／蛋白質／脂肪／價格＋營養師建議
    source_class: expert_interpretation
    last_modified: 2026-05-13T00:00:00+08:00
    retrieved_at: 2026-08-05T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:starbucks:starbucks_烤雞生吐司三明治
  kind: menu_item
  market: TW
  brand: 星巴克 Starbucks
  name: 烤雞生吐司三明治
  aliases:
    - 烤雞生吐司三明治
    - 星巴克 Starbucks烤雞生吐司三明治
    - 星巴克 Starbucks 烤雞生吐司三明治
revision:
  revision_id: google-sheet-2026-08-22-nut-00126
serving:
  description: 1份（依文章表格）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 342
      protein_g: 21
      fat_g: 13.4
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00126
  evidence_grade: C
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: dietitian_article
  source_publisher: 日日營養 DailyDietitian
  source_author: 日日營養團隊
  source_row:
    record_id: NUT-00126
    food_name: 烤雞生吐司三明治
    brand_or_context: 星巴克 Starbucks
    category: 堡／三明治
    serving_basis: 1份（依文章表格）
    calories_kcal: 342
    protein_g: 21
    fat_g: 13.4
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 90
    value_method: transcribed_from_article
    evidence_grade: C
    verification_status: unverified
    source_type: dietitian_article
    source_publisher: 日日營養 DailyDietitian
    source_author: 日日營養團隊
    source_title: 2026 星巴克餐點菜單：熱量／蛋白質／脂肪／價格＋營養師建議
    source_url: https://dailydietitian.com.tw/%E6%98%9F%E5%B7%B4%E5%85%8B%E9%A4%90%E9%BB%9E%E7%86%B1%E9%87%8F-%E7%87%9F%E9%A4%8A%E6%88%90%E5%88%86-%E5%83%B9%E6%A0%BC/
    article_updated_at: 46155
    accessed_at: 46239
    primary_source_url: null
    usage_note: 次級來源；使用前應查看文章日期並優先核對品牌／產品最新官方營養標示。
source_observation:
  price_twd: 90
  usage_note: 次級來源；使用前應查看文章日期並優先核對品牌／產品最新官方營養標示。
official_review_hint:
  status: corroborated_existing
  existing_food_id: food:tw:menu:starbucks:e531d9d75c18
  existing_title: 星巴克 烤雞生吐司三明治
  existing_concept: /menu-items/starbucks/foods/烤雞生吐司三明治-e531d9d75c18.md
  comparison:
    corroborated: true
    compared:
      - &a1
        field: energy_kcal
        candidate_value: 342
        official_value: 342
        delta: 0
        tolerance: 3.42
      - &a2
        field: protein_g
        candidate_value: 21
        official_value: 21
        delta: 0
        tolerance: 0.42
      - &a3
        field: fat_g
        candidate_value: 13.4
        official_value: 13.4
        delta: 0
        tolerance: 0.268
    matched:
      - *a1
      - *a2
      - *a3
    mismatched: []
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-00126 的營養觀測。[^sheet-source-6d43b0dddc8f] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 烤雞生吐司三明治 |
| 品牌／情境 | 星巴克 Starbucks |
| 分類 | 堡／三明治 |
| 份量基準 | 1份（依文章表格） |
| energy_kcal | 342 |
| protein_g | 21 |
| fat_g | 13.4 |

# Related Existing Concept

數值可交叉支持：[星巴克 烤雞生吐司三明治](/menu-items/starbucks/foods/烤雞生吐司三明治-e531d9d75c18.md)。

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-6d43b0dddc8f]: 2026 星巴克餐點菜單：熱量／蛋白質／脂肪／價格＋營養師建議
