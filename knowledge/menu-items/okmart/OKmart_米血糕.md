---
type: Food Product
title: OKmart 米血糕
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://foodtracer.health.ntpc.gov.tw/w/foodtracer/FoodPublicInfo?areaId=21120615314152601&infoId=35270
tags:
  - OKmart
  - 關東煮／熱食
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-16
sources:
  - id: sheet-source-b719131a429b
    resource: https://foodtracer.health.ntpc.gov.tw/w/foodtracer/FoodPublicInfo?areaId=21120615314152601&infoId=35270
    title: 米血糕食品揭露
    source_class: primary_government
    retrieved_at: 2026-08-16T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:okmart:米血糕
  kind: menu_item
  market: TW
  brand: OKmart
  name: 米血糕
  aliases:
    - 米血糕
    - OKmart米血糕
    - OKmart 米血糕
revision:
  revision_id: google-sheet-2026-08-22-nut-01146
serving:
  description: 1份（90g）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 184
      protein_g: 7.6
      fat_g: 1.1
      saturated_fat_g: 0.5
      trans_fat_g: 0
      carbohydrate_g: 36
      sugar_g: 0
      sodium_mg: 353
quality:
  data_quality: government_database
  completeness: nutrition_complete
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01146
  evidence_grade: A
  verification_status_as_reported: verified
  value_method: official_food_disclosure
  source_type: government_food_disclosure
  source_publisher: 新北市食材登錄平台
  source_author: 新北市政府衛生局／業者登錄
  source_row:
    record_id: NUT-01146
    food_name: 米血糕
    brand_or_context: OKmart
    category: 關東煮／熱食
    serving_basis: 1份（90g）
    calories_kcal: 184
    protein_g: 7.6
    fat_g: 1.1
    saturated_fat_g: 0.5
    trans_fat_g: 0
    carbohydrate_g: 36
    sugar_g: 0
    sodium_mg: 353
    price_twd: null
    value_method: official_food_disclosure
    evidence_grade: A
    verification_status: verified
    source_type: government_food_disclosure
    source_publisher: 新北市食材登錄平台
    source_author: 新北市政府衛生局／業者登錄
    source_title: 米血糕食品揭露
    source_url: https://foodtracer.health.ntpc.gov.tw/w/foodtracer/FoodPublicInfo?areaId=21120615314152601&infoId=35270
    article_updated_at: null
    accessed_at: 46250
    primary_source_url: https://foodtracer.health.ntpc.gov.tw/w/foodtracer/FoodPublicInfo?areaId=21120615314152601&infoId=35270
    usage_note: 政府食材登錄完整營養標示；以登錄規格90g為一份，門市實際批次仍以現場標示為準。
source_observation:
  usage_note: 政府食材登錄完整營養標示；以登錄規格90g為一份，門市實際批次仍以現場標示為準。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01146 的營養觀測。[^sheet-source-b719131a429b] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 米血糕 |
| 品牌／情境 | OKmart |
| 分類 | 關東煮／熱食 |
| 份量基準 | 1份（90g） |
| energy_kcal | 184 |
| protein_g | 7.6 |
| fat_g | 1.1 |
| saturated_fat_g | 0.5 |
| trans_fat_g | 0 |
| carbohydrate_g | 36 |
| sugar_g | 0 |
| sodium_mg | 353 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-b719131a429b]: 米血糕食品揭露
