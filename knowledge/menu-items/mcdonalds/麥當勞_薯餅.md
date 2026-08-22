---
type: Food Product
title: 麥當勞 薯餅
description: 麥當勞台灣官方品項「薯餅」的每份營養資料，來源為官方 itemDetails API。
resource: https://www.mcdonalds.com/tw/zh-tw/product/hash-browns.html
tags:
  - 麥當勞
  - McDonald's
  - 官方營養
  - 飲料與點心
generated:
  by: twfoodmcp-mcdonalds-importer/1.0.0
  at: 2026-08-01T15:01:21.023Z
status: draft
stale_after: 2027-02-01
sources:
  - id: mcdonalds-tw-nutrition-2026-08-01
    resource: https://www.mcdonalds.com/tw/zh-tw/product/hash-browns.html
    api_resource: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200037&compType=core&returnType=json
    title: 麥當勞台灣官方營養資料
    author: mcdonalds-tw/2026-08-01
    source_class: primary_official
    retrieved_at: 2026-08-01T15:01:21.023Z
    snapshot: references/source-snapshots/mcdonalds-tw-nutrition-2026-08-01.json
access:
  classification: public
food:
  id: food:tw:menu:mcdonalds:hash-browns
  kind: menu_item
  market: TW
  brand: 麥當勞
  name: 薯餅
  aliases:
    - 薯餅
    - 麥當勞薯餅
    - 麥當勞 薯餅
    - McDonald's 薯餅
    - hash-browns
revision:
  revision_id: official-api-200037-2026-08-01
  source_product_id: "200037"
serving:
  description: 官方每份 58 公克
  amount: 58
  unit: g
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 177.42
      fat_g: 13
      saturated_fat_g: 1.2
      trans_fat_g: 0
      carbohydrate_g: 14
      sugar_g: 0
      dietary_fiber_g: 1.798
      protein_g: 1.9
      sodium_mg: 320.2
allergens:
  declarations:
    - allergen: 大豆
      status: may_contain
      source_id: mcdonalds-tw-nutrition-2026-08-01
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
