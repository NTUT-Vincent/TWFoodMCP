---
type: Food Product
title: 全家 FamilyMart 鹹酥雞
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/salt-pepper-fried-chicken
tags:
  - 全家 FamilyMart
  - 熱食／雞肉
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-01
sources:
  - id: sheet-source-f35b81d64d96
    resource: https://food.codecity.com.tw/b/family/salt-pepper-fried-chicken
    title: 全家便利商店鹹酥雞熱量 270 kcal、蛋白質 16 g 與完整營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-10-01T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01368
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 鹹酥雞
  aliases:
    - 鹹酥雞
    - 全家 FamilyMart鹹酥雞
    - 全家 FamilyMart 鹹酥雞
revision:
  revision_id: google-sheet-2026-10-25-nut-01368
nutrition:
  - basis: per_100g
    values:
      energy_kcal: 270
      protein_g: 16
      fat_g: 14.8
      carbohydrate_g: 18.1
      sugar_g: 3.4
      sodium_mg: 727
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01368
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_nutrition_aggregator
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01368
    food_name: 鹹酥雞
    brand_or_context: 全家 FamilyMart
    category: 熱食／雞肉
    serving_basis: 每份100g
    calories_kcal: 270
    protein_g: 16
    fat_g: 14.8
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 18.1
    sugar_g: 3.4
    sodium_mg: 727
    price_twd: null
    value_method: transcribed_from_nutrition_aggregator
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店鹹酥雞熱量 270 kcal、蛋白質 16 g 與完整營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/salt-pepper-fried-chicken
    article_updated_at: null
    accessed_at: 2026-10-01
    primary_source_url: null
    usage_note: 好食物頁面明示每份100g、270kcal、蛋白質16g、脂肪14.8g、碳水18.1g、糖3.4g、鈉727mg；頁面稱依品牌官方產品標示轉錄，但未提供可直接追溯的全家食在購安心單品原始URL，因此D級unverified、不稱為官方值。
source_observation:
  usage_note: 好食物頁面明示每份100g、270kcal、蛋白質16g、脂肪14.8g、碳水18.1g、糖3.4g、鈉727mg；頁面稱依品牌官方產品標示轉錄，但未提供可直接追溯的全家食在購安心單品原始URL，因此D級unverified、不稱為官方值。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01368 的營養觀測。[^sheet-source-f35b81d64d96] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 鹹酥雞 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 熱食／雞肉 |
| 份量基準 | 每份100g |
| energy_kcal | 270 |
| protein_g | 16 |
| fat_g | 14.8 |
| carbohydrate_g | 18.1 |
| sugar_g | 3.4 |
| sodium_mg | 727 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-f35b81d64d96]: 全家便利商店鹹酥雞熱量 270 kcal、蛋白質 16 g 與完整營養標示｜好食物
