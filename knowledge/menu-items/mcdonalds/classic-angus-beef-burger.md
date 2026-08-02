---
type: Food Product
title: 麥當勞 四盎司牛肉堡
description: 麥當勞台灣官方品項「四盎司牛肉堡」的每份營養資料，來源為官方 itemDetails API。
resource: https://www.mcdonalds.com/tw/zh-tw/product/classic-angus-beef-burger.html
tags:
  - 麥當勞
  - McDonald's
  - 官方營養
  - 超值全餐
generated:
  by: twfoodmcp-mcdonalds-importer/1.0.0
  at: 2026-08-01T15:01:21.023Z
status: draft
stale_after: 2027-02-01
sources:
  - id: mcdonalds-tw-nutrition-2026-08-01
    resource: https://www.mcdonalds.com/tw/zh-tw/product/classic-angus-beef-burger.html
    api_resource: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200302&compType=core&returnType=json
    title: 麥當勞台灣官方營養資料
    author: mcdonalds-tw/2026-08-01
    source_class: primary_official
    retrieved_at: 2026-08-01T15:01:21.023Z
    snapshot: references/source-snapshots/mcdonalds-tw-nutrition-2026-08-01.json
access:
  classification: public
food:
  id: food:tw:menu:mcdonalds:classic-angus-beef-burger
  kind: menu_item
  market: TW
  brand: 麥當勞
  name: 四盎司牛肉堡
  aliases:
    - 四盎司牛肉堡
    - 麥當勞四盎司牛肉堡
    - 麥當勞 四盎司牛肉堡
    - McDonald's 四盎司牛肉堡
    - classic-angus-beef-burger
revision:
  revision_id: official-api-200302-2026-08-01
  source_product_id: "200302"
serving:
  description: 官方每份 204.92 公克
  amount: 204.92
  unit: g
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 541.29
      fat_g: 28
      saturated_fat_g: 15
      trans_fat_g: 0.7
      carbohydrate_g: 40
      sugar_g: 9.7
      dietary_fiber_g: 3.001635
      protein_g: 32
      sodium_mg: 1001.6
allergens:
  declarations: []
quality:
  data_quality: official_brand
  completeness: nutrition_complete
  confidence: high
  calculation_allowed: true
limitations:
  - 此文件由官方 API 自動轉換為 draft，尚未經真人逐項審核，不進正式 stable dataset。
  - 官方營養數值為每份平均資料，實際產品可能因配方、食材與門市操作而變動。
  - 未列出過敏原不代表不含；本次僅保留官方 API 已提供的 allergen 與 additional_allergen 欄位。
---

# Summary

官方 API 提供每份重量與九項營養數值；本文件保留原始每份基準，未自行換算或補齊缺值。[^mcdonalds-tw-nutrition-2026-08-01]

[^mcdonalds-tw-nutrition-2026-08-01]: 麥當勞台灣官方營養資料
