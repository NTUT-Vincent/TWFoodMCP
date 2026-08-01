---
type: Food Product
title: 麥當勞 焦糖冰奶茶
description: 麥當勞台灣官方品項「焦糖冰奶茶」的每份營養資料，來源為官方 itemDetails API。
status: draft
stale_after: '2027-02-01'
access:
  classification: public
tags:
- 麥當勞
- McDonald's
- 官方營養
generated:
  by: agent:chatgpt-mcdonalds-official-api-import
  at: '2026-08-01T15:01:21.023Z'
sources:
- id: mcdonalds-tw-nutrition-2026-08-01
  resource: https://www.mcdonalds.com/tw/zh-tw/product/caramel-milk-tea-iced.html
  api_resource: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200321&compType=core&returnType=json
  title: 麥當勞台灣官方營養資料
  author: organization:mcdonalds-tw
  source_class: primary_official
  retrieved_at: '2026-08-01T15:01:21.023Z'
  snapshot: references/source-snapshots/mcdonalds-tw-nutrition-2026-08-01.json
food:
  id: food:tw:menu:mcdonalds:caramel-milk-tea-iced
  kind: menu_item
  market: TW
  brand: 麥當勞
  name: 焦糖冰奶茶
  aliases:
  - 焦糖冰奶茶
  - 麥當勞焦糖冰奶茶
  - 麥當勞 焦糖冰奶茶
  - McDonald's 焦糖冰奶茶
  - caramel-milk-tea-iced
revision:
  revision_id: official-api-200321-2026-08-01
  source_product_id: '200321'
serving:
  description: 官方每份 591 公克
  amount: 591
  unit: g
nutrition:
- basis: per_serving
  values:
    energy_kcal: 187.99
    fat_g: 4.4
    saturated_fat_g: 3
    trans_fat_g: 0.1
    carbohydrate_g: 34
    sugar_g: 30
    dietary_fiber_g: 0
    protein_g: 2.8
    sodium_mg: 58
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

官方 API 提供每份重量與九項營養數值；本文件保留原始每份基準，未自行換算或補齊缺值。
