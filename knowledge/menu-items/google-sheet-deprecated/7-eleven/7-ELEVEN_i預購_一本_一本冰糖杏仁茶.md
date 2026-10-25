---
type: Food Product
title: 7-ELEVEN i預購／一本 一本冰糖杏仁茶
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://711go.7-11.com.tw/Product/258866
tags:
  - 7-ELEVEN i預購／一本
  - 沖泡飲品
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-24
sources:
  - id: sheet-source-3ab7b30a65d5
    resource: https://711go.7-11.com.tw/Product/258866
    title: "[6盒/箱] 一本冰糖杏仁茶30g (5入/盒)"
    source_class: primary_official
    retrieved_at: 2026-10-24T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01704
  kind: menu_item
  market: TW
  brand: 7-ELEVEN i預購／一本
  name: 一本冰糖杏仁茶
  aliases:
    - 一本冰糖杏仁茶
    - 7-ELEVEN i預購／一本一本冰糖杏仁茶
    - 7-ELEVEN i預購／一本 一本冰糖杏仁茶
revision:
  revision_id: google-sheet-2026-10-25-nut-01704
serving:
  description: 每包30g（每盒5包；營養標示每份30g）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 134
      protein_g: 1.7
      fat_g: 4.2
      saturated_fat_g: 2
      trans_fat_g: 0
      carbohydrate_g: 22.3
      sugar_g: 8
      sodium_mg: 30
quality:
  data_quality: official_brand
  completeness: nutrition_complete
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01704
  evidence_grade: A
  verification_status_as_reported: verified
  value_method: official_product_label
  source_type: official_product_page
  source_publisher: 7-ELEVEN i預購
  source_author: null
  source_row:
    record_id: NUT-01704
    food_name: 一本冰糖杏仁茶
    brand_or_context: 7-ELEVEN i預購／一本
    category: 沖泡飲品
    serving_basis: 每包30g（每盒5包；營養標示每份30g）
    calories_kcal: 134
    protein_g: 1.7
    fat_g: 4.2
    saturated_fat_g: 2
    trans_fat_g: 0
    carbohydrate_g: 22.3
    sugar_g: 8
    sodium_mg: 30
    price_twd: null
    value_method: official_product_label
    evidence_grade: A
    verification_status: verified
    source_type: official_product_page
    source_publisher: 7-ELEVEN i預購
    source_author: null
    source_title: "[6盒/箱] 一本冰糖杏仁茶30g (5入/盒)"
    source_url: https://711go.7-11.com.tw/Product/258866
    article_updated_at: null
    accessed_at: 2026-10-24
    primary_source_url: https://711go.7-11.com.tw/Product/258866
    usage_note: 官方i預購頁完整每份標示；售價450元為6盒整箱，未換算單包價格；i預購不代表一般門市現售。
source_observation:
  usage_note: 官方i預購頁完整每份標示；售價450元為6盒整箱，未換算單包價格；i預購不代表一般門市現售。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01704 的營養觀測。[^sheet-source-3ab7b30a65d5] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 一本冰糖杏仁茶 |
| 品牌／情境 | 7-ELEVEN i預購／一本 |
| 分類 | 沖泡飲品 |
| 份量基準 | 每包30g（每盒5包；營養標示每份30g） |
| energy_kcal | 134 |
| protein_g | 1.7 |
| fat_g | 4.2 |
| saturated_fat_g | 2 |
| trans_fat_g | 0 |
| carbohydrate_g | 22.3 |
| sugar_g | 8 |
| sodium_mg | 30 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-3ab7b30a65d5]: [6盒/箱] 一本冰糖杏仁茶30g (5入/盒)
