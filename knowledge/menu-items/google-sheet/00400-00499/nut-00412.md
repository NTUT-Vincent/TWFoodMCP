---
type: Food Product
title: 台灣麥當勞 McDonald's 嫩煎鷄腿堡
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.womenshealthmag.com/tw/food-nutrition/diet/g35307515/fast-food-recommend/
tags:
  - 台灣麥當勞 McDonald's
  - 漢堡
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-05
sources:
  - id: sheet-source-874192fb5eb8
    resource: https://www.womenshealthmag.com/tw/food-nutrition/diet/g35307515/fast-food-recommend/
    title: 速食店漢堡怎麼選？麥當勞、肯德基、漢堡王、SUBWAY這樣點最健康
    source_class: expert_interpretation
    last_modified: 2021-01-27T00:00:00+08:00
    retrieved_at: 2026-08-05T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-00412
  kind: menu_item
  market: TW
  brand: 台灣麥當勞 McDonald's
  name: 嫩煎鷄腿堡
  aliases:
    - 嫩煎鷄腿堡
    - 台灣麥當勞 McDonald's嫩煎鷄腿堡
    - 台灣麥當勞 McDonald's 嫩煎鷄腿堡
revision:
  revision_id: google-sheet-2026-08-22-nut-00412
serving:
  description: 1個
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 363
      protein_g: 24
      fat_g: 12
      saturated_fat_g: 3.7
      trans_fat_g: 0
      carbohydrate_g: 40
      sugar_g: 11
      sodium_mg: 690.9
quality:
  data_quality: third_party_database
  completeness: nutrition_complete
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00412
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_article
  source_type: nutrition_article
  source_publisher: Women's Health Taiwan
  source_author: Women's Health 美力圈
  source_row:
    record_id: NUT-00412
    food_name: 嫩煎鷄腿堡
    brand_or_context: 台灣麥當勞 McDonald's
    category: 漢堡
    serving_basis: 1個
    calories_kcal: 363
    protein_g: 24
    fat_g: 12
    saturated_fat_g: 3.7
    trans_fat_g: 0
    carbohydrate_g: 40
    sugar_g: 11
    sodium_mg: 690.9
    price_twd: null
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: historical_unverified
    source_type: nutrition_article
    source_publisher: Women's Health Taiwan
    source_author: Women's Health 美力圈
    source_title: 速食店漢堡怎麼選？麥當勞、肯德基、漢堡王、SUBWAY這樣點最健康
    source_url: https://www.womenshealthmag.com/tw/food-nutrition/diet/g35307515/fast-food-recommend/
    article_updated_at: 44223
    accessed_at: 46239
    primary_source_url: null
    usage_note: 2021 年文章轉錄；品項可能已改版或停產，僅作歷史觀測，使用前須核對現行官方標示。
source_observation:
  usage_note: 2021 年文章轉錄；品項可能已改版或停產，僅作歷史觀測，使用前須核對現行官方標示。
official_review_hint:
  status: conflict_existing
  existing_food_id: food:tw:menu:mcdonalds:grilled-bbq-chicken-burger
  existing_title: 麥當勞 嫩煎鷄腿堡
  existing_concept: /menu-items/mcdonalds/grilled-bbq-chicken-burger.md
  comparison:
    corroborated: false
    compared:
      - &a3
        field: energy_kcal
        candidate_value: 363
        official_value: 391.17
        delta: 28.170000000000016
        tolerance: 3.9117
      - &a4
        field: protein_g
        candidate_value: 24
        official_value: 25
        delta: 1
        tolerance: 0.5
      - &a5
        field: fat_g
        candidate_value: 12
        official_value: 13
        delta: 1
        tolerance: 0.26
      - &a1
        field: saturated_fat_g
        candidate_value: 3.7
        official_value: 3.8
        delta: 0.09999999999999964
        tolerance: 0.2
      - &a2
        field: trans_fat_g
        candidate_value: 0
        official_value: 0
        delta: 0
        tolerance: 0.2
      - &a6
        field: carbohydrate_g
        candidate_value: 40
        official_value: 43
        delta: 3
        tolerance: 0.86
      - &a7
        field: sugar_g
        candidate_value: 11
        official_value: 13
        delta: 2
        tolerance: 0.26
      - &a8
        field: sodium_mg
        candidate_value: 690.9
        official_value: 738.2
        delta: 47.30000000000007
        tolerance: 14.764000000000001
    matched:
      - *a1
      - *a2
    mismatched:
      - *a3
      - *a4
      - *a5
      - *a6
      - *a7
      - *a8
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
  - 此觀測與既有官方 OKF 的一項或多項營養數值不一致，必須人工判讀版本與來源日期。
---

# Summary

此文件保存試算表記錄 NUT-00412 的營養觀測。[^sheet-source-874192fb5eb8] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 嫩煎鷄腿堡 |
| 品牌／情境 | 台灣麥當勞 McDonald's |
| 分類 | 漢堡 |
| 份量基準 | 1個 |
| energy_kcal | 363 |
| protein_g | 24 |
| fat_g | 12 |
| saturated_fat_g | 3.7 |
| trans_fat_g | 0 |
| carbohydrate_g | 40 |
| sugar_g | 11 |
| sodium_mg | 690.9 |

# Related Existing Concept

數值需要衝突審查：[麥當勞 嫩煎鷄腿堡](/menu-items/mcdonalds/grilled-bbq-chicken-burger.md)。

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-874192fb5eb8]: 速食店漢堡怎麼選？麥當勞、肯德基、漢堡王、SUBWAY這樣點最健康
