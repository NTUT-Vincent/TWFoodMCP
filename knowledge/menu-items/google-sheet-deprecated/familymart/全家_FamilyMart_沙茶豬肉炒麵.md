---
type: Food Product
title: 全家 FamilyMart 沙茶豬肉炒麵
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/satay-pork-fried-noodles
tags:
  - 全家 FamilyMart
  - 麵食
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-11
sources:
  - id: sheet-source-97536cbb7bfc
    resource: https://food.codecity.com.tw/b/family/satay-pork-fried-noodles
    title: 全家便利商店沙茶豬肉炒麵熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-11T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01322
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 沙茶豬肉炒麵
  aliases:
    - 沙茶豬肉炒麵
    - 全家 FamilyMart沙茶豬肉炒麵
    - 全家 FamilyMart 沙茶豬肉炒麵
revision:
  revision_id: google-sheet-2026-10-25-nut-01322
serving:
  description: 每份339g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 556
      protein_g: 22
      fat_g: 19.3
      carbohydrate_g: 73.2
      sugar_g: 6.8
      sodium_mg: 1570
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01322
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01322
    food_name: 沙茶豬肉炒麵
    brand_or_context: 全家 FamilyMart
    category: 麵食
    serving_basis: 每份339g
    calories_kcal: 556
    protein_g: 22
    fat_g: 19.3
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 73.2
    sugar_g: 6.8
    sodium_mg: 1570
    price_twd: null
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店沙茶豬肉炒麵熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/satay-pork-fried-noodles
    article_updated_at: null
    accessed_at: 2026-09-11
    primary_source_url: null
    usage_note: 整理頁列每份339g：556kcal、蛋白質22g、脂肪19.3g、碳水73.2g、糖6.8g、鈉1570mg；頁面稱轉錄官網但未提供可追溯全家食安原始URL，故D級unverified。
source_observation:
  usage_note: 整理頁列每份339g：556kcal、蛋白質22g、脂肪19.3g、碳水73.2g、糖6.8g、鈉1570mg；頁面稱轉錄官網但未提供可追溯全家食安原始URL，故D級unverified。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01322 的營養觀測。[^sheet-source-97536cbb7bfc] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 沙茶豬肉炒麵 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 麵食 |
| 份量基準 | 每份339g |
| energy_kcal | 556 |
| protein_g | 22 |
| fat_g | 19.3 |
| carbohydrate_g | 73.2 |
| sugar_g | 6.8 |
| sodium_mg | 1570 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-97536cbb7bfc]: 全家便利商店沙茶豬肉炒麵熱量與營養標示｜好食物
