---
type: Food Product
title: 台灣麥當勞 McDonald's 大麥克
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.mcdonalds.com/tw/zh-tw/product/big-mac.html
tags:
  - 台灣麥當勞 McDonald's
  - 漢堡
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-07
sources:
  - id: sheet-source-642154a57f1e
    resource: https://www.mcdonalds.com/tw/zh-tw/product/big-mac.html
    title: 麥當勞台灣官方營養資料
    source_class: primary_official
    retrieved_at: 2026-08-07T00:00:00+08:00
  - id: sheet-primary-688d2b9d9419
    resource: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200008&compType=core&returnType=json
    title: 試算表列出的原始／官方來源
    source_class: primary_official
    retrieved_at: 2026-08-07T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-00944
  kind: menu_item
  market: TW
  brand: 台灣麥當勞 McDonald's
  name: 大麥克
  aliases:
    - 大麥克
    - 台灣麥當勞 McDonald's大麥克
    - 台灣麥當勞 McDonald's 大麥克
revision:
  revision_id: google-sheet-2026-08-22-nut-00944
serving:
  description: 每份211.64公克
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 503.17
      protein_g: 26
      fat_g: 25
      saturated_fat_g: 11
      trans_fat_g: 0.6
      carbohydrate_g: 43
      sugar_g: 6.1
      sodium_mg: 1092.5
quality:
  data_quality: official_brand
  completeness: nutrition_complete
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00944
  evidence_grade: A
  verification_status_as_reported: official_api_unreviewed
  value_method: official_api
  source_type: brand_official_api
  source_publisher: 台灣麥當勞 McDonald's
  source_author: null
  source_row:
    record_id: NUT-00944
    food_name: 大麥克
    brand_or_context: 台灣麥當勞 McDonald's
    category: 漢堡
    serving_basis: 每份211.64公克
    calories_kcal: 503.17
    protein_g: 26
    fat_g: 25
    saturated_fat_g: 11
    trans_fat_g: 0.6
    carbohydrate_g: 43
    sugar_g: 6.1
    sodium_mg: 1092.5
    price_twd: null
    value_method: official_api
    evidence_grade: A
    verification_status: official_api_unreviewed
    source_type: brand_official_api
    source_publisher: 台灣麥當勞 McDonald's
    source_author: null
    source_title: 麥當勞台灣官方營養資料
    source_url: https://www.mcdonalds.com/tw/zh-tw/product/big-mac.html
    article_updated_at: null
    accessed_at: 46241
    primary_source_url: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200008&compType=core&returnType=json
    usage_note: 2026-08-01 抓取的麥當勞台灣官方 itemDetails API；每份 211.64g。官方來源 A 級，但此列由程式轉錄、尚未真人逐項複核；與其他來源衝突時並列保留。
source_observation:
  usage_note: 2026-08-01 抓取的麥當勞台灣官方 itemDetails API；每份 211.64g。官方來源 A 級，但此列由程式轉錄、尚未真人逐項複核；與其他來源衝突時並列保留。
official_review_hint:
  status: corroborated_existing
  existing_food_id: food:tw:menu:mcdonalds:big-mac
  existing_title: 麥當勞 大麥克
  existing_concept: /menu-items/mcdonalds/big-mac.md
  comparison:
    corroborated: true
    compared:
      - &a1
        field: energy_kcal
        candidate_value: 503.17
        official_value: 503.17
        delta: 0
        tolerance: 5.0317
      - &a2
        field: protein_g
        candidate_value: 26
        official_value: 26
        delta: 0
        tolerance: 0.52
      - &a3
        field: fat_g
        candidate_value: 25
        official_value: 25
        delta: 0
        tolerance: 0.5
      - &a4
        field: saturated_fat_g
        candidate_value: 11
        official_value: 11
        delta: 0
        tolerance: 0.22
      - &a5
        field: trans_fat_g
        candidate_value: 0.6
        official_value: 0.6
        delta: 0
        tolerance: 0.2
      - &a6
        field: carbohydrate_g
        candidate_value: 43
        official_value: 43
        delta: 0
        tolerance: 0.86
      - &a7
        field: sugar_g
        candidate_value: 6.1
        official_value: 6.1
        delta: 0
        tolerance: 0.2
      - &a8
        field: sodium_mg
        candidate_value: 1092.5
        official_value: 1092.5
        delta: 0
        tolerance: 21.85
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

此文件保存試算表記錄 NUT-00944 的營養觀測。[^sheet-source-642154a57f1e] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 大麥克 |
| 品牌／情境 | 台灣麥當勞 McDonald's |
| 分類 | 漢堡 |
| 份量基準 | 每份211.64公克 |
| energy_kcal | 503.17 |
| protein_g | 26 |
| fat_g | 25 |
| saturated_fat_g | 11 |
| trans_fat_g | 0.6 |
| carbohydrate_g | 43 |
| sugar_g | 6.1 |
| sodium_mg | 1092.5 |

# Related Existing Concept

數值可交叉支持：[麥當勞 大麥克](/menu-items/mcdonalds/big-mac.md)。

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-642154a57f1e]: 麥當勞台灣官方營養資料
