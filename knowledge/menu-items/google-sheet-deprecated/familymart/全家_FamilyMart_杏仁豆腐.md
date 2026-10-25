---
type: Food Product
title: 全家 FamilyMart 杏仁豆腐
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/almond-tofu-pudding
tags:
  - 全家 FamilyMart
  - 甜點
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-03-11
sources:
  - id: sheet-source-958d255482d4
    resource: https://food.codecity.com.tw/b/family/almond-tofu-pudding
    title: 全家便利商店杏仁豆腐熱量與營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-09-11T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01323
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 杏仁豆腐
  aliases:
    - 杏仁豆腐
    - 全家 FamilyMart杏仁豆腐
    - 全家 FamilyMart 杏仁豆腐
revision:
  revision_id: google-sheet-2026-10-25-nut-01323
serving:
  description: 每份115g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 125
      protein_g: 1.4
      fat_g: 3.7
      carbohydrate_g: 21.5
      sugar_g: 13.5
      sodium_mg: 7
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01323
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01323
    food_name: 杏仁豆腐
    brand_or_context: 全家 FamilyMart
    category: 甜點
    serving_basis: 每份115g
    calories_kcal: 125
    protein_g: 1.4
    fat_g: 3.7
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 21.5
    sugar_g: 13.5
    sodium_mg: 7
    price_twd: null
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店杏仁豆腐熱量與營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/almond-tofu-pudding
    article_updated_at: null
    accessed_at: 2026-09-11
    primary_source_url: null
    usage_note: 整理頁列每份115g：125kcal、蛋白質1.4g、脂肪3.7g、碳水21.5g、糖13.5g、鈉7mg；頁面稱轉錄官網但未提供可追溯全家食安原始URL，故D級unverified。
source_observation:
  usage_note: 整理頁列每份115g：125kcal、蛋白質1.4g、脂肪3.7g、碳水21.5g、糖13.5g、鈉7mg；頁面稱轉錄官網但未提供可追溯全家食安原始URL，故D級unverified。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01323 的營養觀測。[^sheet-source-958d255482d4] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 杏仁豆腐 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 甜點 |
| 份量基準 | 每份115g |
| energy_kcal | 125 |
| protein_g | 1.4 |
| fat_g | 3.7 |
| carbohydrate_g | 21.5 |
| sugar_g | 13.5 |
| sodium_mg | 7 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-958d255482d4]: 全家便利商店杏仁豆腐熱量與營養標示｜好食物
