---
type: Food Product
title: 全家 FamilyMart 炙烤醬香燒豚飯
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://food.codecity.com.tw/b/family/grilled-pork-rice-bento
tags:
  - 全家 FamilyMart
  - 便當
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-08
sources:
  - id: sheet-source-ae36a995574c
    resource: https://food.codecity.com.tw/b/family/grilled-pork-rice-bento
    title: 全家便利商店炙烤醬香燒豚飯熱量 645 kcal、蛋白質 17.5 g 與完整營養標示｜好食物
    source_class: third_party_dataset
    retrieved_at: 2026-10-08T00:00:00+08:00
  - id: sheet-primary-0eb2c63c96a6
    resource: https://foodsafety.family.com.tw/Web_FFD_2022/product/0468958
    title: 試算表列出的原始／官方來源
    source_class: primary_official
    retrieved_at: 2026-10-08T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01380
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 炙烤醬香燒豚飯
  aliases:
    - 炙烤醬香燒豚飯
    - 全家 FamilyMart炙烤醬香燒豚飯
    - 全家 FamilyMart 炙烤醬香燒豚飯
revision:
  revision_id: google-sheet-2026-10-25-nut-01380
serving:
  description: 每份336g
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 645
      protein_g: 17.5
      fat_g: 22.5
      carbohydrate_g: 93.4
      sugar_g: 5.4
      sodium_mg: 739
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01380
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: transcribed_from_nutrition_aggregator
  source_type: nutrition_aggregator
  source_publisher: 好食物
  source_author: null
  source_row:
    record_id: NUT-01380
    food_name: 炙烤醬香燒豚飯
    brand_or_context: 全家 FamilyMart
    category: 便當
    serving_basis: 每份336g
    calories_kcal: 645
    protein_g: 17.5
    fat_g: 22.5
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: 93.4
    sugar_g: 5.4
    sodium_mg: 739
    price_twd: null
    value_method: transcribed_from_nutrition_aggregator
    evidence_grade: B
    verification_status: needs_verification
    source_type: nutrition_aggregator
    source_publisher: 好食物
    source_author: null
    source_title: 全家便利商店炙烤醬香燒豚飯熱量 645 kcal、蛋白質 17.5 g 與完整營養標示｜好食物
    source_url: https://food.codecity.com.tw/b/family/grilled-pork-rice-bento
    article_updated_at: null
    accessed_at: 2026-10-08
    primary_source_url: https://foodsafety.family.com.tw/Web_FFD_2022/product/0468958
    usage_note: 好食物單品頁列每份336g、645kcal、蛋白質17.5g、脂肪22.5g、碳水93.4g、糖5.4g、鈉739mg，並直接連回全家食在購安心商品0468958；本輪官方頁無法取得可核對內容，故B級待驗證轉錄，不稱已核實官方數值；以現行包裝優先。
source_observation:
  usage_note: 好食物單品頁列每份336g、645kcal、蛋白質17.5g、脂肪22.5g、碳水93.4g、糖5.4g、鈉739mg，並直接連回全家食在購安心商品0468958；本輪官方頁無法取得可核對內容，故B級待驗證轉錄，不稱已核實官方數值；以現行包裝優先。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01380 的營養觀測。[^sheet-source-ae36a995574c] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 炙烤醬香燒豚飯 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 便當 |
| 份量基準 | 每份336g |
| energy_kcal | 645 |
| protein_g | 17.5 |
| fat_g | 22.5 |
| carbohydrate_g | 93.4 |
| sugar_g | 5.4 |
| sodium_mg | 739 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-ae36a995574c]: 全家便利商店炙烤醬香燒豚飯熱量 645 kcal、蛋白質 17.5 g 與完整營養標示｜好食物
