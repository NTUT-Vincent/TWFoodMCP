---
type: Food Product
title: 7-ELEVEN i預購／尚桌股份有限公司 最強雞高湯
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://711go.7-11.com.tw/Product/253108
tags:
  - 7-ELEVEN i預購／尚桌股份有限公司
  - 高湯／冷凍調理
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-02-28
sources:
  - id: sheet-source-b8f980719782
    resource: https://711go.7-11.com.tw/Product/253108
    title: 最強雞高湯 500g/包 | 7-ELEVEN i預購
    source_class: primary_official
    retrieved_at: 2026-08-28T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01260
  kind: menu_item
  market: TW
  brand: 7-ELEVEN i預購／尚桌股份有限公司
  name: 最強雞高湯
  aliases:
    - 最強雞高湯
    - 7-ELEVEN i預購／尚桌股份有限公司最強雞高湯
    - 7-ELEVEN i預購／尚桌股份有限公司 最強雞高湯
revision:
  revision_id: google-sheet-2026-10-25-nut-01260
serving:
  description: 1包500g（本包裝1份）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 52.5
      protein_g: 6
      fat_g: 2.5
      saturated_fat_g: 0
      trans_fat_g: 0
      carbohydrate_g: 1.5
      sugar_g: 0
      sodium_mg: 288
quality:
  data_quality: official_brand
  completeness: nutrition_complete
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01260
  evidence_grade: B
  verification_status_as_reported: needs_verification
  value_method: official_retailer_nutrition_label_transcription
  source_type: brand_official_ecommerce_nutrition_page
  source_publisher: 7-ELEVEN i預購
  source_author: 尚桌股份有限公司
  source_row:
    record_id: NUT-01260
    food_name: 最強雞高湯
    brand_or_context: 7-ELEVEN i預購／尚桌股份有限公司
    category: 高湯／冷凍調理
    serving_basis: 1包500g（本包裝1份）
    calories_kcal: 52.5
    protein_g: 6
    fat_g: 2.5
    saturated_fat_g: 0
    trans_fat_g: 0
    carbohydrate_g: 1.5
    sugar_g: 0
    sodium_mg: 288
    price_twd: 95
    value_method: official_retailer_nutrition_label_transcription
    evidence_grade: B
    verification_status: needs_verification
    source_type: brand_official_ecommerce_nutrition_page
    source_publisher: 7-ELEVEN i預購
    source_author: 尚桌股份有限公司
    source_title: 最強雞高湯 500g/包 | 7-ELEVEN i預購
    source_url: https://711go.7-11.com.tw/Product/253108
    article_updated_at: null
    accessed_at: 2026-08-28
    primary_source_url: null
    usage_note: 7-ELEVEN官方i預購頁明示500g/包、本包裝1份與完整營養標示，頁面售價95元；屬官方零售通路轉錄，未取得尚桌原廠對應營養頁，因此B級needs_verification。頁面原文將飽和脂肪誤植為「包和脂肪」，數值0g仍可由營養標示上下文辨識。
source_observation:
  price_twd: 95
  usage_note: 7-ELEVEN官方i預購頁明示500g/包、本包裝1份與完整營養標示，頁面售價95元；屬官方零售通路轉錄，未取得尚桌原廠對應營養頁，因此B級needs_verification。頁面原文將飽和脂肪誤植為「包和脂肪」，數值0g仍可由營養標示上下文辨識。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01260 的營養觀測。[^sheet-source-b8f980719782] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 最強雞高湯 |
| 品牌／情境 | 7-ELEVEN i預購／尚桌股份有限公司 |
| 分類 | 高湯／冷凍調理 |
| 份量基準 | 1包500g（本包裝1份） |
| energy_kcal | 52.5 |
| protein_g | 6 |
| fat_g | 2.5 |
| saturated_fat_g | 0 |
| trans_fat_g | 0 |
| carbohydrate_g | 1.5 |
| sugar_g | 0 |
| sodium_mg | 288 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-b8f980719782]: 最強雞高湯 500g/包 | 7-ELEVEN i預購
