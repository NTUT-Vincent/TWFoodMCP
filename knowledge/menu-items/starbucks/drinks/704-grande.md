---
type: Food Menu Item
title: 星巴克 冰摩卡（大杯）
description: 星巴克台灣官方商品頁所列「冰摩卡」大杯的熱量、糖與咖啡因資料。
resource: https://www.starbucks.com.tw/products/drinks/product.jspx?id=704&catId=117
tags:
  - 星巴克
  - Starbucks
  - 官方營養
  - 飲品
  - 大杯
generated:
  by: twfoodmcp-starbucks-importer/1.0.0
  at: 2026-08-05T15:30:00Z
verified:
  - by: process:twfoodmcp-schema-validator
    at: 2026-08-05T15:30:00Z
status: draft
stale_after: 2027-02-05
sources:
  - id: starbucks-drink-704-2026-08-05
    resource: https://www.starbucks.com.tw/products/drinks/product.jspx?id=704&catId=117
    title: 星巴克台灣官方商品頁：冰摩卡
    author: starbucks-taiwan/2026-08-05
    source_class: primary_official
    retrieved_at: 2026-08-05T15:30:00Z
access:
  classification: public
food:
  id: food:tw:menu:starbucks:drink-704-grande
  kind: menu_item
  market: TW
  brand: 星巴克
  name: 冰摩卡
  variant: 大杯
  aliases:
    - 冰摩卡
    - 星巴克冰摩卡
    - 星巴克 冰摩卡
    - Starbucks 冰摩卡
    - Iced Caffè Mocha
revision:
  revision_id: official-web-704-2026-08-05
  source_product_id: "704"
  source_category_id: "117"
serving:
  description: 大杯 Grande 16 oz（473 ml）
  amount: 473
  unit: ml
nutrition:
  - basis: per_serving
    values:
      caffeine_mg: 228
      energy_kcal: 514
      sugar_g: 51
menu:
  price_twd: 155
  size_label: 大杯
quality:
  data_quality: official_brand
  completeness: partial
  confidence: medium
  calculation_allowed: false
extraction:
  method: official_product_page_html
  source_product_id: "704"
  source_tab_label: 大杯
limitations:
  - 本文件由官方商品頁自動擷取為 draft，尚未經真人逐項審核，只進入 preview dataset。
  - 官方商品頁僅提供熱量、糖與部分品項的咖啡因；其他營養欄位保持未知。
  - 飲品客製化會改變營養數值；本資料僅代表官方頁面所示標準配方。
---

# Summary

官方商品頁提供大杯的 `caffeine_mg`、`energy_kcal`、`sugar_g`；本文件保留官方每份基準，不推測其他營養欄位。[^starbucks-drink-704-2026-08-05]

[^starbucks-drink-704-2026-08-05]: 星巴克台灣官方商品頁：冰摩卡
