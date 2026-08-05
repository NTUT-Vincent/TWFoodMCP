---
type: Food Menu Item
title: 星巴克 濃縮咖啡（Doppio）
description: 星巴克台灣官方商品頁所列「濃縮咖啡」Doppio的熱量、糖與咖啡因資料。
resource: https://www.starbucks.com.tw/products/drinks/product.jspx?id=695&catId=116
tags:
  - 星巴克
  - Starbucks
  - 官方營養
  - 飲品
  - Doppio
generated:
  by: twfoodmcp-starbucks-importer/1.0.0
  at: 2026-08-05T15:30:00Z
verified:
  - by: process:twfoodmcp-schema-validator
    at: 2026-08-05T15:30:00Z
status: draft
stale_after: 2027-02-05
sources:
  - id: starbucks-drink-695-2026-08-05
    resource: https://www.starbucks.com.tw/products/drinks/product.jspx?id=695&catId=116
    title: 星巴克台灣官方商品頁：濃縮咖啡
    author: starbucks-taiwan/2026-08-05
    source_class: primary_official
    retrieved_at: 2026-08-05T15:30:00Z
access:
  classification: public
food:
  id: food:tw:menu:starbucks:drink-695-doppio
  kind: menu_item
  market: TW
  brand: 星巴克
  name: 濃縮咖啡
  variant: Doppio
  aliases:
    - 濃縮咖啡
    - 星巴克濃縮咖啡
    - 星巴克 濃縮咖啡
    - Starbucks 濃縮咖啡
    - Espresso
revision:
  revision_id: official-web-695-2026-08-05
  source_product_id: "695"
  source_category_id: "116"
serving:
  description: 官方規格：Doppio
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      caffeine_mg: 195
      energy_kcal: 16
      sugar_g: 0.2
menu:
  price_twd: 100
  size_label: Doppio
quality:
  data_quality: official_brand
  completeness: partial
  confidence: medium
  calculation_allowed: false
extraction:
  method: official_product_page_html
  source_product_id: "695"
  source_tab_label: Doppio
limitations:
  - 本文件由官方商品頁自動擷取為 draft，尚未經真人逐項審核，只進入 preview dataset。
  - 官方商品頁僅提供熱量、糖與部分品項的咖啡因；其他營養欄位保持未知。
  - 飲品客製化會改變營養數值；本資料僅代表官方頁面所示標準配方。
---

# Summary

官方商品頁提供Doppio的 `caffeine_mg`、`energy_kcal`、`sugar_g`；本文件保留官方每份基準，不推測其他營養欄位。[^starbucks-drink-695-2026-08-05]

[^starbucks-drink-695-2026-08-05]: 星巴克台灣官方商品頁：濃縮咖啡
