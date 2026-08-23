---
type: Food Product
title: 摩斯漢堡 MOS Burger 嫩雞豆腐麵沙拉
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.mos.com.tw/menu/Detail.aspx?id=M001245
tags:
  - 摩斯漢堡 MOS Burger
  - 沙拉
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-08-22T04:54:57.024Z
status: draft
stale_after: 2027-02-07
sources:
  - id: sheet-source-16448ddd95c1
    resource: https://www.mos.com.tw/menu/Detail.aspx?id=M001245
    title: 嫩雞豆腐麵沙拉｜官方營養標示
    source_class: primary_official
    retrieved_at: 2026-08-07T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:mos-burger:mos_burger_嫩雞豆腐麵沙拉
  kind: menu_item
  market: TW
  brand: 摩斯漢堡 MOS Burger
  name: 嫩雞豆腐麵沙拉
  aliases:
    - 嫩雞豆腐麵沙拉
    - 摩斯漢堡 MOS Burger嫩雞豆腐麵沙拉
    - 摩斯漢堡 MOS Burger 嫩雞豆腐麵沙拉
revision:
  revision_id: google-sheet-2026-08-22-nut-00922
serving:
  description: 單份
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 55.6
      protein_g: 6.8
      fat_g: 1.5
      saturated_fat_g: 0.2
      trans_fat_g: 0
      carbohydrate_g: 4.1
      sodium_mg: 112
quality:
  data_quality: official_brand
  completeness: partial
  confidence: medium
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-00922
  evidence_grade: A
  verification_status_as_reported: official_page
  value_method: official_product_page
  source_type: brand_official_nutrition_page
  source_publisher: 摩斯漢堡 MOS Burger
  source_author: null
  source_row:
    record_id: NUT-00922
    food_name: 嫩雞豆腐麵沙拉
    brand_or_context: 摩斯漢堡 MOS Burger
    category: 沙拉
    serving_basis: 單份
    calories_kcal: 55.6
    protein_g: 6.8
    fat_g: 1.5
    saturated_fat_g: 0.2
    trans_fat_g: 0
    carbohydrate_g: 4.1
    sugar_g: null
    sodium_mg: 112
    price_twd: null
    value_method: official_product_page
    evidence_grade: A
    verification_status: official_page
    source_type: brand_official_nutrition_page
    source_publisher: 摩斯漢堡 MOS Burger
    source_author: null
    source_title: 嫩雞豆腐麵沙拉｜官方營養標示
    source_url: https://www.mos.com.tw/menu/Detail.aspx?id=M001245
    article_updated_at: null
    accessed_at: 46241
    primary_source_url: null
    usage_note: 摩斯漢堡台灣官網單份營養標示；數值以本次抓取頁面為準，商品供應與配方可能調整，使用時應核對最新官網／實品。
source_observation:
  usage_note: 摩斯漢堡台灣官網單份營養標示；數值以本次抓取頁面為準，商品供應與配方可能調整，使用時應核對最新官網／實品。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-00922 的營養觀測。[^sheet-source-16448ddd95c1] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 嫩雞豆腐麵沙拉 |
| 品牌／情境 | 摩斯漢堡 MOS Burger |
| 分類 | 沙拉 |
| 份量基準 | 單份 |
| energy_kcal | 55.6 |
| protein_g | 6.8 |
| fat_g | 1.5 |
| saturated_fat_g | 0.2 |
| trans_fat_g | 0 |
| carbohydrate_g | 4.1 |
| sodium_mg | 112 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-16448ddd95c1]: 嫩雞豆腐麵沙拉｜官方營養標示
