---
type: Food Menu Item
title: 星巴克 每日精選咖啡（小杯）
description: 星巴克台灣官方商品頁所列「每日精選咖啡」小杯的熱量、糖與咖啡因資料。
resource: https://www.starbucks.com.tw/products/drinks/product.jspx?id=710&catId=3
tags:
  - 星巴克
  - Starbucks
  - 官方營養
  - 飲品
  - 小杯
generated:
  by: twfoodmcp-starbucks-importer/1.0.0
  at: 2026-08-05T15:30:00Z
verified:
  - by: process:twfoodmcp-schema-validator
    at: 2026-08-05T15:30:00Z
status: draft
stale_after: 2027-02-05
sources:
  - id: starbucks-drink-710-2026-08-05
    resource: https://www.starbucks.com.tw/products/drinks/product.jspx?id=710&catId=3
    title: 星巴克台灣官方商品頁：每日精選咖啡
    author: starbucks-taiwan/2026-08-05
    source_class: primary_official
    retrieved_at: 2026-08-05T15:30:00Z
access:
  classification: public
food:
  id: food:tw:menu:starbucks:drink-710-short
  kind: menu_item
  market: TW
  brand: 星巴克
  name: 每日精選咖啡
  variant: 小杯
  aliases:
    - 每日精選咖啡
    - 星巴克每日精選咖啡
    - 星巴克 每日精選咖啡
    - Starbucks 每日精選咖啡
    - Brewed Coffee
revision:
  revision_id: official-web-710-2026-08-05
  source_product_id: "710"
  source_category_id: "3"
serving:
  description: 小杯 Short 8 oz（236 ml）
  amount: 236
  unit: ml
nutrition:
  - basis: per_serving
    values:
      caffeine_mg: 252
      energy_kcal: 14
      sugar_g: 0.2
menu:
  price_twd: 80
  size_label: 小杯
quality:
  data_quality: official_brand
  completeness: partial
  confidence: medium
  calculation_allowed: false
extraction:
  method: official_product_page_html
  source_product_id: "710"
  source_tab_label: 小杯
limitations:
  - 本文件由官方商品頁自動擷取為 draft，尚未經真人逐項審核，只進入 preview dataset。
  - 官方商品頁僅提供熱量、糖與部分品項的咖啡因；其他營養欄位保持未知。
  - 飲品客製化會改變營養數值；本資料僅代表官方頁面所示標準配方。
---

# Summary

官方商品頁提供小杯的 `caffeine_mg`、`energy_kcal`、`sugar_g`；本文件保留官方每份基準，不推測其他營養欄位。[^starbucks-drink-710-2026-08-05]

[^starbucks-drink-710-2026-08-05]: 星巴克台灣官方商品頁：每日精選咖啡
