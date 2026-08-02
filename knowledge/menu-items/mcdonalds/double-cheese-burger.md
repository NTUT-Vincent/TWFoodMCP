---
type: Food Product
title: 麥當勞 雙層牛肉吉事堡
description: 麥當勞台灣官方品項「雙層牛肉吉事堡」的每份營養資料，來源為官方 itemDetails API。
resource: https://www.mcdonalds.com/tw/zh-tw/product/double-cheese-burger.html
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
    resource: https://www.mcdonalds.com/tw/zh-tw/product/double-cheese-burger.html
    api_resource: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200007&compType=core&returnType=json
    title: 麥當勞台灣官方營養資料
    author: mcdonalds-tw/2026-08-01
    source_class: primary_official
    retrieved_at: 2026-08-01T15:01:21.023Z
    snapshot: references/source-snapshots/mcdonalds-tw-nutrition-2026-08-01.json
access:
  classification: public
food:
  id: food:tw:menu:mcdonalds:double-cheese-burger
  kind: menu_item
  market: TW
  brand: 麥當勞
  name: 雙層牛肉吉事堡
  aliases:
    - 雙層牛肉吉事堡
    - 麥當勞雙層牛肉吉事堡
    - 麥當勞 雙層牛肉吉事堡
    - McDonald's 雙層牛肉吉事堡
    - double-cheese-burger
revision:
  revision_id: official-api-200007-2026-08-01
  source_product_id: "200007"
serving:
  description: 官方每份 167.15 公克
  amount: 167.15
  unit: g
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 475
      fat_g: 26
      saturated_fat_g: 14
      trans_fat_g: 0.9
      carbohydrate_g: 35
      sugar_g: 7.2
      dietary_fiber_g: 2.900955
      protein_g: 26
      sodium_mg: 855.3
allergens:
  declarations:
    - allergen: 牛奶
      status: contains
      source_id: mcdonalds-tw-nutrition-2026-08-01
    - allergen: 大豆
      status: contains
      source_id: mcdonalds-tw-nutrition-2026-08-01
    - allergen: 麩質
      status: contains
      source_id: mcdonalds-tw-nutrition-2026-08-01
    - allergen: 蛋
      status: may_contain
      source_id: mcdonalds-tw-nutrition-2026-08-01
    - allergen: 堅果
      status: may_contain
      source_id: mcdonalds-tw-nutrition-2026-08-01
    - allergen: 芝麻
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
