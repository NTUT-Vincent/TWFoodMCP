---
type: Food Product
title: 台灣麥當勞 McDonald's 麥克鷄塊(10塊)
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.mcdonalds.com/tw/zh-tw/product/chicken-mcnuggets-10-pieces.html
tags:
  - 台灣麥當勞 McDonald's
  - 雞塊
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-07
sources:
  - id: sheet-source-8b3853e46cee
    resource: https://www.mcdonalds.com/tw/zh-tw/product/chicken-mcnuggets-10-pieces.html
    title: 麥當勞台灣官方營養資料
    source_class: primary_official
    retrieved_at: 2026-08-07T00:00:00+08:00
  - id: sheet-primary-dfd234cee65b
    resource: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200170&compType=core&returnType=json
    title: 試算表列出的原始／官方來源
    source_class: primary_official
    retrieved_at: 2026-08-07T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-00947
  kind: menu_item
  market: TW
  brand: 台灣麥當勞 McDonald's
  name: 麥克鷄塊(10塊)
  aliases:
    - 麥克鷄塊(10塊)
    - 台灣麥當勞 McDonald's麥克鷄塊(10塊)
    - 台灣麥當勞 McDonald's 麥克鷄塊(10塊)
revision:
  revision_id: google-sheet-2026-08-22-nut-00947
serving:
  description: 每份170公克
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 435.71
      protein_g: 26
      fat_g: 26
      saturated_fat_g: 4.8
      trans_fat_g: 0
      carbohydrate_g: 24
      sugar_g: 0
      sodium_mg: 925.7
quality:
  data_quality: official_brand
  completeness: nutrition_complete
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00947
  evidence_grade: A
  verification_status_as_reported: official_api_unreviewed
  value_method: official_api
  source_type: brand_official_api
  source_publisher: 台灣麥當勞 McDonald's
  source_author: null
  source_row:
    record_id: NUT-00947
    food_name: 麥克鷄塊(10塊)
    brand_or_context: 台灣麥當勞 McDonald's
    category: 雞塊
    serving_basis: 每份170公克
    calories_kcal: 435.71
    protein_g: 26
    fat_g: 26
    saturated_fat_g: 4.8
    trans_fat_g: 0
    carbohydrate_g: 24
    sugar_g: 0
    sodium_mg: 925.7
    price_twd: null
    value_method: official_api
    evidence_grade: A
    verification_status: official_api_unreviewed
    source_type: brand_official_api
    source_publisher: 台灣麥當勞 McDonald's
    source_author: null
    source_title: 麥當勞台灣官方營養資料
    source_url: https://www.mcdonalds.com/tw/zh-tw/product/chicken-mcnuggets-10-pieces.html
    article_updated_at: null
    accessed_at: 46241
    primary_source_url: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200170&compType=core&returnType=json
    usage_note: 2026-08-01 抓取的麥當勞台灣官方 itemDetails API；每份 170g。官方來源 A 級，但此列由程式轉錄、尚未真人逐項複核；與其他來源衝突時並列保留。
source_observation:
  usage_note: 2026-08-01 抓取的麥當勞台灣官方 itemDetails API；每份 170g。官方來源 A 級，但此列由程式轉錄、尚未真人逐項複核；與其他來源衝突時並列保留。
official_review_hint:
  status: corroborated_existing
  existing_food_id: food:tw:menu:mcdonalds:chicken-mcnuggets-10-pieces
  existing_title: 麥當勞 麥克鷄塊(10塊)
  existing_concept: /menu-items/mcdonalds/chicken-mcnuggets-10-pieces.md
  comparison:
    corroborated: true
    compared:
      - &a1
        field: energy_kcal
        candidate_value: 435.71
        official_value: 435.71
        delta: 0
        tolerance: 4.3571
      - &a2
        field: protein_g
        candidate_value: 26
        official_value: 26
        delta: 0
        tolerance: 0.52
      - &a3
        field: fat_g
        candidate_value: 26
        official_value: 26
        delta: 0
        tolerance: 0.52
      - &a4
        field: saturated_fat_g
        candidate_value: 4.8
        official_value: 4.8
        delta: 0
        tolerance: 0.2
      - &a5
        field: trans_fat_g
        candidate_value: 0
        official_value: 0
        delta: 0
        tolerance: 0.2
      - &a6
        field: carbohydrate_g
        candidate_value: 24
        official_value: 24
        delta: 0
        tolerance: 0.48
      - &a7
        field: sugar_g
        candidate_value: 0
        official_value: 0
        delta: 0
        tolerance: 0.2
      - &a8
        field: sodium_mg
        candidate_value: 925.7
        official_value: 925.7
        delta: 0
        tolerance: 18.514000000000003
    matched:
      - *a1
      - *a2
      - *a3
      - *a4
      - *a5
      - *a6
      - *a7
      - *a8
    mismatched: []
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-00947 的營養觀測。[^sheet-source-8b3853e46cee] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 麥克鷄塊(10塊) |
| 品牌／情境 | 台灣麥當勞 McDonald's |
| 分類 | 雞塊 |
| 份量基準 | 每份170公克 |
| energy_kcal | 435.71 |
| protein_g | 26 |
| fat_g | 26 |
| saturated_fat_g | 4.8 |
| trans_fat_g | 0 |
| carbohydrate_g | 24 |
| sugar_g | 0 |
| sodium_mg | 925.7 |

# Related Existing Concept

數值可交叉支持：[麥當勞 麥克鷄塊(10塊)](/menu-items/mcdonalds/chicken-mcnuggets-10-pieces.md)。

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-8b3853e46cee]: 麥當勞台灣官方營養資料
