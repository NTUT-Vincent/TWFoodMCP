---
type: Food Product
title: 麥當勞 豬肉蛋堡
description: 從日日營養文章表格逐列抽取的未驗證食品營養 draft。
resource: https://dailydietitian.com.tw/%e9%ba%a5%e7%95%b6%e5%8b%9e%e6%97%a9%e9%a4%90%e7%86%b1%e9%87%8f%e5%9c%96%e9%91%91-%e7%87%9f%e9%a4%8a%e5%b8%ab%e5%bb%ba%e8%ad%b0/
tags:
  - 麥當勞
  - 日日營養
  - 第三方資料
  - 待人工審核
  - 份量基準待確認
generated:
  by: twfoodmcp-dailydietitian-importer/2.0.0
  at: 2026-08-03T03:10:19.504Z
status: draft
stale_after: 2027-02-03
sources:
  - id: dailydietitian-d80097e5aa5c
    resource: https://dailydietitian.com.tw/%e9%ba%a5%e7%95%b6%e5%8b%9e%e6%97%a9%e9%a4%90%e7%86%b1%e9%87%8f%e5%9c%96%e9%91%91-%e7%87%9f%e9%a4%8a%e5%b8%ab%e5%bb%ba%e8%ad%b0/
    title: 2026 最新麥當勞早餐菜單｜熱量/蛋白質/脂肪/價格＋營養師飲控原則
    author: dailydietitian/website
    source_class: expert_interpretation
    last_modified: 2025-09-04
    retrieved_at: 2026-08-02T05:23:09.523Z
access:
  classification: public
food:
  id: food:tw:menu:dailydietitian:b99f0dfef70d93fe8a96
  kind: menu_item
  market: TW
  brand: 麥當勞
  name: 豬肉蛋堡
  aliases:
    - 豬肉蛋堡
    - 麥當勞豬肉蛋堡
    - 麥當勞 豬肉蛋堡
revision:
  revision_id: dailydietitian-2026-08-03-b99f0dfef70d
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 410.26
      protein_g: 21
      fat_g: 23
      saturated_fat_g: 7.5
      trans_fat_g: 0.1
      carbohydrate_g: 31
      sugar_g: 6
      sodium_mg: 719.5
quality:
  data_quality: third_party_database
  completeness: nutrition_complete
  confidence: low
  calculation_allowed: false
extraction:
  source_system: 日日營養 DailyDietitian
  candidate_id: dd:b99f0dfef70d93fe8a96
  snapshot_retrieved_at: 2026-08-02T05:23:09.523Z
  article_estimation_disclosure: false
  table_index: 1
  row_index: 5
  basis_inferred: true
  source_headers:
    - 項目
    - 價格（元）
    - 熱量 (Kcal)
    - 蛋白質 (g)
    - 脂肪 (g)
    - 飽和脂肪 (g)
    - 反式脂肪 (g)
    - 碳水化合物 (g)
    - 糖 (g)
    - 鈉 (mg)
  source_row:
    - 豬肉蛋堡
    - "66"
    - "410.26"
    - "21"
    - "23"
    - "7.5"
    - "0.1"
    - "31"
    - "6"
    - "719.5"
official_review_hint:
  status: conflict_existing
  existing_food_id: food:tw:menu:mcdonalds:egg-burger-with-sausage
  existing_title: 麥當勞 豬肉蛋堡
  existing_file_path: knowledge/menu-items/mcdonalds/egg-burger-with-sausage.md
  comparison:
    corroborated: false
    compared:
      - &a4
        field: energy_kcal
        candidate_value: 410.26
        official_value: 430.64
        delta: 20.379999999999995
        tolerance: 4.3064
      - &a1
        field: protein_g
        candidate_value: 21
        official_value: 21
        delta: 0
        tolerance: 0.42
      - &a5
        field: fat_g
        candidate_value: 23
        official_value: 24
        delta: 1
        tolerance: 0.48
      - &a6
        field: saturated_fat_g
        candidate_value: 7.5
        official_value: 7.7
        delta: 0.20000000000000018
        tolerance: 0.2
      - &a2
        field: trans_fat_g
        candidate_value: 0.1
        official_value: 0.1
        delta: 0
        tolerance: 0.2
      - &a7
        field: carbohydrate_g
        candidate_value: 31
        official_value: 32
        delta: 1
        tolerance: 0.64
      - &a8
        field: sugar_g
        candidate_value: 6
        official_value: 5.5
        delta: 0.5
        tolerance: 0.2
      - &a3
        field: sodium_mg
        candidate_value: 719.5
        official_value: 731.3
        delta: 11.799999999999955
        tolerance: 14.626
    matched:
      - *a1
      - *a2
      - *a3
    mismatched:
      - *a4
      - *a5
      - *a6
      - *a7
      - *a8
limitations:
  - 此文件只表示日日營養文章中曾出現這筆資料，不代表品牌、政府或 TWFoodMCP 已確認其正確性。
  - 此 draft 沒有 verified 欄位，依 OKF v0.2 應視為 unverified。
  - 在真人確認產品身分、份量基準與營養數值前，不得用於營養計算或升為 stable。
  - 來源表格沒有明示 per-serving 或 per-100 基準，目前 basis 是抽取器推定值。
  - 來源沒有可重現的 serving amount。
---

# Summary

此文件逐列保存日日營養文章中的食品名稱與營養表格數值。[^dailydietitian-d80097e5aa5c] 它是未驗證 draft，不代表官方標示或 TWFoodMCP 的正式判定。

# Source Row

| 項目 | 價格（元） | 熱量 (Kcal) | 蛋白質 (g) | 脂肪 (g) | 飽和脂肪 (g) | 反式脂肪 (g) | 碳水化合物 (g) | 糖 (g) | 鈉 (mg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 豬肉蛋堡 | 66 | 410.26 | 21 | 23 | 7.5 | 0.1 | 31 | 6 | 719.5 |

# Review Required

升為 stable 前，真人 reviewer 必須確認精確產品、規格、份量基準、營養欄位、文章版本及可追溯證據。此 draft 的 `quality.calculation_allowed` 固定為 `false`。

[^dailydietitian-d80097e5aa5c]: 2026 最新麥當勞早餐菜單｜熱量/蛋白質/脂肪/價格＋營養師飲控原則
