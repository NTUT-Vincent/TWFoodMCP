---
type: Food Product
title: 台灣麥當勞 McDonald's 麥克鷄塊(4塊)
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.mcdonalds.com/tw/zh-tw/product/chicken-mcnuggets-4-pieces.html
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
  - id: sheet-source-25416a50e0db
    resource: https://www.mcdonalds.com/tw/zh-tw/product/chicken-mcnuggets-4-pieces.html
    title: 麥當勞台灣官方營養資料
    source_class: primary_official
    retrieved_at: 2026-08-07T00:00:00+08:00
  - id: sheet-primary-e486c644e22e
    resource: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200016&compType=core&returnType=json
    title: 試算表列出的原始／官方來源
    source_class: primary_official
    retrieved_at: 2026-08-07T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-00945
  kind: menu_item
  market: TW
  brand: 台灣麥當勞 McDonald's
  name: 麥克鷄塊(4塊)
  aliases:
    - 麥克鷄塊(4塊)
    - 台灣麥當勞 McDonald's麥克鷄塊(4塊)
    - 台灣麥當勞 McDonald's 麥克鷄塊(4塊)
revision:
  revision_id: google-sheet-2026-08-22-nut-00945
serving:
  description: 每份68公克
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 174.28
      protein_g: 10
      fat_g: 11
      saturated_fat_g: 1.9
      trans_fat_g: 0
      carbohydrate_g: 9.7
      sugar_g: 0
      sodium_mg: 370.3
quality:
  data_quality: official_brand
  completeness: nutrition_complete
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00945
  evidence_grade: A
  verification_status_as_reported: official_api_unreviewed
  value_method: official_api
  source_type: brand_official_api
  source_publisher: 台灣麥當勞 McDonald's
  source_author: null
  source_row:
    record_id: NUT-00945
    food_name: 麥克鷄塊(4塊)
    brand_or_context: 台灣麥當勞 McDonald's
    category: 雞塊
    serving_basis: 每份68公克
    calories_kcal: 174.28
    protein_g: 10
    fat_g: 11
    saturated_fat_g: 1.9
    trans_fat_g: 0
    carbohydrate_g: 9.7
    sugar_g: 0
    sodium_mg: 370.3
    price_twd: null
    value_method: official_api
    evidence_grade: A
    verification_status: official_api_unreviewed
    source_type: brand_official_api
    source_publisher: 台灣麥當勞 McDonald's
    source_author: null
    source_title: 麥當勞台灣官方營養資料
    source_url: https://www.mcdonalds.com/tw/zh-tw/product/chicken-mcnuggets-4-pieces.html
    article_updated_at: null
    accessed_at: 46241
    primary_source_url: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200016&compType=core&returnType=json
    usage_note: 2026-08-01 抓取的麥當勞台灣官方 itemDetails API；每份 68g。官方來源 A 級，但此列由程式轉錄、尚未真人逐項複核；與其他來源衝突時並列保留。
source_observation:
  usage_note: 2026-08-01 抓取的麥當勞台灣官方 itemDetails API；每份 68g。官方來源 A 級，但此列由程式轉錄、尚未真人逐項複核；與其他來源衝突時並列保留。
official_review_hint:
  status: corroborated_existing
  existing_food_id: food:tw:menu:mcdonalds:chicken-mcnuggets-4-pieces
  existing_title: 麥當勞 麥克鷄塊(4塊)
  existing_concept: /menu-items/mcdonalds/chicken-mcnuggets-4-pieces.md
  comparison:
    corroborated: true
    compared:
      - &a1
        field: energy_kcal
        candidate_value: 174.28
        official_value: 174.28
        delta: 0
        tolerance: 1.7428000000000001
      - &a2
        field: protein_g
        candidate_value: 10
        official_value: 10
        delta: 0
        tolerance: 0.2
      - &a3
        field: fat_g
        candidate_value: 11
        official_value: 11
        delta: 0
        tolerance: 0.22
      - &a4
        field: saturated_fat_g
        candidate_value: 1.9
        official_value: 1.9
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
        candidate_value: 9.7
        official_value: 9.7
        delta: 0
        tolerance: 0.2
      - &a7
        field: sugar_g
        candidate_value: 0
        official_value: 0
        delta: 0
        tolerance: 0.2
      - &a8
        field: sodium_mg
        candidate_value: 370.3
        official_value: 370.3
        delta: 0
        tolerance: 7.406000000000001
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

此文件保存試算表記錄 NUT-00945 的營養觀測。[^sheet-source-25416a50e0db] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 麥克鷄塊(4塊) |
| 品牌／情境 | 台灣麥當勞 McDonald's |
| 分類 | 雞塊 |
| 份量基準 | 每份68公克 |
| energy_kcal | 174.28 |
| protein_g | 10 |
| fat_g | 11 |
| saturated_fat_g | 1.9 |
| trans_fat_g | 0 |
| carbohydrate_g | 9.7 |
| sugar_g | 0 |
| sodium_mg | 370.3 |

# Related Existing Concept

數值可交叉支持：[麥當勞 麥克鷄塊(4塊)](/menu-items/mcdonalds/chicken-mcnuggets-4-pieces.md)。

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-25416a50e0db]: 麥當勞台灣官方營養資料
