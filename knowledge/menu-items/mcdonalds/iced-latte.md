---
type: Food Product
title: 麥當勞 經典那堤(冰)
description: 麥當勞台灣官方品項「經典那堤(冰)」的每份營養資料，來源為官方 itemDetails API。
resource: https://www.mcdonalds.com/tw/zh-tw/product/iced-latte.html
tags:
  - 麥當勞
  - McDonald's
  - 官方營養
  - McCafe
generated:
  by: twfoodmcp-mcdonalds-importer/1.0.0
  at: 2026-08-01T15:01:21.023Z
status: draft
stale_after: 2027-02-01
sources:
  - id: mcdonalds-tw-nutrition-2026-08-01
    resource: https://www.mcdonalds.com/tw/zh-tw/product/iced-latte.html
    api_resource: https://www.mcdonalds.com/dnaapp/itemDetails?country=TW&language=zh&showLiveData=true&item=200108&compType=core&returnType=json
    title: 麥當勞台灣官方營養資料
    author: mcdonalds-tw/2026-08-01
    source_class: primary_official
    retrieved_at: 2026-08-01T15:01:21.023Z
    snapshot: references/source-snapshots/mcdonalds-tw-nutrition-2026-08-01.json
access:
  classification: public
food:
  id: food:tw:menu:mcdonalds:iced-latte
  kind: menu_item
  market: TW
  brand: 麥當勞
  name: 經典那堤(冰)
  aliases:
    - 經典那堤(冰)
    - 麥當勞經典那堤(冰)
    - 麥當勞 經典那堤(冰)
    - McDonald's 經典那堤(冰)
    - iced-latte
revision:
  revision_id: official-api-200108-2026-08-01
  source_product_id: "200108"
serving:
  description: 官方每份 350 公克
  amount: 350
  unit: g
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 117.45
      fat_g: 6.1
      saturated_fat_g: 3.7
      trans_fat_g: 0.1
      carbohydrate_g: 9.5
      sugar_g: 7.6
      dietary_fiber_g: 0.558
      protein_g: 6.1
      sodium_mg: 62.4
allergens:
  declarations:
    - allergen: 牛奶
      status: contains
      source_id: mcdonalds-tw-nutrition-2026-08-01
    - allergen: 芒果
      status: may_contain
      source_id: mcdonalds-tw-nutrition-2026-08-01
    - allergen: 花生
      status: may_contain
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
    - allergen: 麩質
      status: may_contain
      source_id: mcdonalds-tw-nutrition-2026-08-01
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
