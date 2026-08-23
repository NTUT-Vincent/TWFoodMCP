---
type: Food Product
title: 全家 FamilyMart 炸醬麵(包)
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://foodsafety.family.com.tw/Web_FFD_2022/product/4350042
tags:
  - 全家 FamilyMart
  - 泡麵
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-09
sources:
  - id: sheet-source-c9c5decf3a97
    resource: https://foodsafety.family.com.tw/Web_FFD_2022/product/4350042
    title: 炸醬麵(包)－全家食在購安心
    source_class: primary_official
    retrieved_at: 2026-08-09T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:familymart:familymart_炸醬麵包
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 炸醬麵(包)
  aliases:
    - 炸醬麵(包)
    - 全家 FamilyMart炸醬麵(包)
    - 全家 FamilyMart 炸醬麵(包)
revision:
  revision_id: google-sheet-2026-08-22-nut-01041
serving:
  description: 90公克（本包裝含5份）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 418.4
      protein_g: 9.6
      fat_g: 20.4
      carbohydrate_g: 49.1
quality:
  data_quality: official_brand
  completeness: partial
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01041
  evidence_grade: A
  verification_status_as_reported: verified_official
  value_method: official_product_label
  source_type: brand_official_nutrition_page
  source_publisher: 全家便利商店
  source_author: null
  source_row:
    record_id: NUT-01041
    food_name: 炸醬麵(包)
    brand_or_context: 全家 FamilyMart
    category: 泡麵
    serving_basis: 90公克（本包裝含5份）
    calories_kcal: 418.4
    protein_g: 9.6
    fat_g: 20.4
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 49.1
    sugar_g: null
    sodium_mg: null
    price_twd: null
    value_method: official_product_label
    evidence_grade: A
    verification_status: verified_official
    source_type: brand_official_nutrition_page
    source_publisher: 全家便利商店
    source_author: null
    source_title: 炸醬麵(包)－全家食在購安心
    source_url: https://foodsafety.family.com.tw/Web_FFD_2022/product/4350042
    article_updated_at: null
    accessed_at: 46243
    primary_source_url: null
    usage_note: 全家食在購安心頁列出每份規格與營養數值；頁面註明資訊由供應商提供並以實際商品包裝標示為準，未顯示欄位保持空白。
source_observation:
  usage_note: 全家食在購安心頁列出每份規格與營養數值；頁面註明資訊由供應商提供並以實際商品包裝標示為準，未顯示欄位保持空白。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01041 的營養觀測。[^sheet-source-c9c5decf3a97] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 炸醬麵(包) |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 泡麵 |
| 份量基準 | 90公克（本包裝含5份） |
| energy_kcal | 418.4 |
| protein_g | 9.6 |
| fat_g | 20.4 |
| carbohydrate_g | 49.1 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-c9c5decf3a97]: 炸醬麵(包)－全家食在購安心
