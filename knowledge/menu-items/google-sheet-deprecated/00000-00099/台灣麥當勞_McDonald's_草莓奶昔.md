---
type: Food Product
title: 台灣麥當勞 McDonald's 草莓奶昔
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://dailydietitian.com.tw/%E9%BA%A5%E7%95%B6%E5%8B%9E%E8%8F%9C%E5%96%AE%E5%83%B9%E6%A0%BC-%E7%86%B1%E9%87%8F-%E8%9B%8B%E7%99%BD%E8%B3%AA-%E8%84%82%E8%82%AA-%E7%87%9F%E9%A4%8A%E5%B8%AB/
tags:
  - 台灣麥當勞 McDonald's
  - 飲品
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-05
sources:
  - id: sheet-source-170fcc78d889
    resource: https://dailydietitian.com.tw/%E9%BA%A5%E7%95%B6%E5%8B%9E%E8%8F%9C%E5%96%AE%E5%83%B9%E6%A0%BC-%E7%86%B1%E9%87%8F-%E8%9B%8B%E7%99%BD%E8%B3%AA-%E8%84%82%E8%82%AA-%E7%87%9F%E9%A4%8A%E5%B8%AB/
    title: 2026 麥當勞熱量/蛋白質/脂肪/碳水/糖&鈉含量總整理
    source_class: expert_interpretation
    last_modified: 2026-07-29T00:00:00+08:00
    retrieved_at: 2026-08-05T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-00037
  kind: menu_item
  market: TW
  brand: 台灣麥當勞 McDonald's
  name: 草莓奶昔
  aliases:
    - 草莓奶昔
    - 台灣麥當勞 McDonald's草莓奶昔
    - 台灣麥當勞 McDonald's 草莓奶昔
revision:
  revision_id: google-sheet-2026-08-22-nut-00037
serving:
  description: 1份（依文章表格）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 422.8
      protein_g: 12.6
      fat_g: 11.2
      saturated_fat_g: 7.9
      trans_fat_g: 0.2
      carbohydrate_g: 67.9
      sugar_g: 50.6
      sodium_mg: 241.9
quality:
  data_quality: third_party_database
  completeness: nutrition_complete
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00037
  evidence_grade: C
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: dietitian_article
  source_publisher: 日日營養 DailyDietitian
  source_author: 日日營養團隊
  source_row:
    record_id: NUT-00037
    food_name: 草莓奶昔
    brand_or_context: 台灣麥當勞 McDonald's
    category: 飲品
    serving_basis: 1份（依文章表格）
    calories_kcal: 422.8
    protein_g: 12.6
    fat_g: 11.2
    saturated_fat_g: 7.9
    trans_fat_g: 0.2
    carbohydrate_g: 67.9
    sugar_g: 50.6
    sodium_mg: 241.9
    price_twd: 69
    value_method: transcribed_from_article
    evidence_grade: C
    verification_status: unverified
    source_type: dietitian_article
    source_publisher: 日日營養 DailyDietitian
    source_author: 日日營養團隊
    source_title: 2026 麥當勞熱量/蛋白質/脂肪/碳水/糖&鈉含量總整理
    source_url: https://dailydietitian.com.tw/%E9%BA%A5%E7%95%B6%E5%8B%9E%E8%8F%9C%E5%96%AE%E5%83%B9%E6%A0%BC-%E7%86%B1%E9%87%8F-%E8%9B%8B%E7%99%BD%E8%B3%AA-%E8%84%82%E8%82%AA-%E7%87%9F%E9%A4%8A%E5%B8%AB/
    article_updated_at: 46232
    accessed_at: 46239
    primary_source_url: null
    usage_note: 次級來源；使用前應查看文章日期並優先核對品牌／產品最新官方營養標示。
source_observation:
  price_twd: 69
  usage_note: 次級來源；使用前應查看文章日期並優先核對品牌／產品最新官方營養標示。
official_review_hint:
  status: conflict_existing
  existing_food_id: food:tw:menu:mcdonalds:200338
  existing_title: 麥當勞 草莓奶昔
  existing_concept: /menu-items/mcdonalds/200338.md
  comparison:
    corroborated: false
    compared:
      - &a2
        field: energy_kcal
        candidate_value: 422.8
        official_value: 427.13
        delta: 4.329999999999984
        tolerance: 4.2713
      - &a3
        field: protein_g
        candidate_value: 12.6
        official_value: 3.6
        delta: 9
        tolerance: 0.2
      - &a4
        field: fat_g
        candidate_value: 11.2
        official_value: 3
        delta: 8.2
        tolerance: 0.2
      - &a5
        field: saturated_fat_g
        candidate_value: 7.9
        official_value: 2
        delta: 5.9
        tolerance: 0.2
      - &a1
        field: trans_fat_g
        candidate_value: 0.2
        official_value: 0.2
        delta: 0
        tolerance: 0.2
      - &a6
        field: carbohydrate_g
        candidate_value: 67.9
        official_value: 20
        delta: 47.900000000000006
        tolerance: 0.4
      - &a7
        field: sugar_g
        candidate_value: 50.6
        official_value: 16
        delta: 34.6
        tolerance: 0.32
      - &a8
        field: sodium_mg
        candidate_value: 241.9
        official_value: 75.1
        delta: 166.8
        tolerance: 5
    matched:
      - *a1
    mismatched:
      - *a2
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

此文件保存試算表記錄 NUT-00037 的營養觀測。[^sheet-source-170fcc78d889] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 草莓奶昔 |
| 品牌／情境 | 台灣麥當勞 McDonald's |
| 分類 | 飲品 |
| 份量基準 | 1份（依文章表格） |
| energy_kcal | 422.8 |
| protein_g | 12.6 |
| fat_g | 11.2 |
| saturated_fat_g | 7.9 |
| trans_fat_g | 0.2 |
| carbohydrate_g | 67.9 |
| sugar_g | 50.6 |
| sodium_mg | 241.9 |

# Related Existing Concept

數值需要衝突審查：[麥當勞 草莓奶昔](/menu-items/mcdonalds/200338.md)。

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-170fcc78d889]: 2026 麥當勞熱量/蛋白質/脂肪/碳水/糖&鈉含量總整理
