---
type: Food Menu Item
title: 星巴克 美式咖啡
description: 星巴克台灣官方網站列出的飲品商品。
resource: https://www.starbucks.com.tw/products/drinks.jspx
tags:
- starbucks
- 台灣
- 飲品
- 咖啡飲品
status: stable
generated:
  by: process:starbucks-local-okf-builder
  at: '2026-08-05T03:18:00Z'
sources:
- id: starbucks-official-drinks
  resource: https://www.starbucks.com.tw/products/drinks.jspx
  title: 星巴克台灣飲品目錄
  author: organization:starbucks-taiwan
food:
  id: starbucks-e3e5ccbc3372
  kind: menu_item
  market: TW
  brand: 星巴克 Starbucks
  name: 美式咖啡
  variant: 咖啡飲品
quality:
  data_quality: official_brand
  completeness: partial_nutrition
  confidence: high
  calculation_allowed: true
access:
  classification: public
revision:
  source_version: '2026-08-04'
nutrition:
  basis: official_product_page
  servings:
  - size: 小杯
    calories_kcal: 6
    sugar_g: 0
    caffeine_mg: 98
  - size: 中杯
    calories_kcal: 12
    sugar_g: 0
    caffeine_mg: 195
  - size: 大杯
    calories_kcal: 18
    sugar_g: 0
    caffeine_mg: 293
  - size: 特大杯
    calories_kcal: 24
    sugar_g: 0
    caffeine_mg: 390
verified:
- by: process:starbucks-nutrition-validator
  at: '2026-08-05T03:18:00Z'
stale_after: '2026-09-05'
extraction:
  retrieved_at: '2026-08-04T15:45:00Z'
  builder: starbucks-local-okf-builder/v0.2.0
  source_scope: official-starbucks-taiwan-catalog
---

# 美式咖啡

- 分類：咖啡飲品
- 商品目前列於星巴克台灣官方飲品目錄。

## 官方營養資訊

| 杯型 | 熱量 kcal | 糖 g | 咖啡因 mg |
|---|---:|---:|---:|
| 小杯 | 6 | 0 | 98 |
| 中杯 | 12 | 0 | 195 |
| 大杯 | 18 | 0 | 293 |
| 特大杯 | 24 | 0 | 390 |
