---
type: Food Menu Item
title: 星巴克 藍莓果粒貝果
description: 星巴克台灣官方 2026-07-22 食品營養表所列「藍莓果粒貝果」每份營養資料。
resource: https://www.starbucks.com.tw/products/objects/images/calories/260722/food-01.png
tags:
  - 星巴克
  - Starbucks
  - 官方營養
  - 食品
  - 麵包
generated:
  by: twfoodmcp-starbucks-importer/1.0.0
  at: 2026-08-05T15:30:00Z
verified:
  - by: process:twfoodmcp-schema-validator
    at: 2026-08-05T15:30:00Z
status: draft
stale_after: 2027-01-22
sources:
  - id: starbucks-food-2026-07-22
    resource: https://www.starbucks.com.tw/products/objects/images/calories/260722/food-01.png
    title: 星巴克台灣官方食品營養標示表 food-01.png
    author: starbucks-taiwan/2026-07-22
    last_modified: 2026-07-22
    source_class: primary_official
    retrieved_at: 2026-08-05T15:30:00Z
    sha256: 541bf36f9c82fbc1547b1651b0f3faa004099250a8498d92829780d50caf0bef
  - id: starbucks-calories-page
    resource: https://www.starbucks.com.tw/products/calories/calories.jspx
    title: 星巴克台灣營養標示表
    author: starbucks-taiwan/2026-07-22
    source_class: primary_official
    retrieved_at: 2026-08-05T15:30:00Z
access:
  classification: public
food:
  id: food:tw:menu:starbucks:ffd9fb1fdc9e
  kind: menu_item
  market: TW
  brand: 星巴克
  name: 藍莓果粒貝果
  variant: 麵包
  aliases:
    - 藍莓果粒貝果
    - 星巴克藍莓果粒貝果
    - 星巴克 藍莓果粒貝果
    - Starbucks 藍莓果粒貝果
revision:
  revision_id: official-table-2026-07-22-ffd9fb1fdc9e
  source_version: 2026-07-22
  source_image: food-01.png
serving:
  description: 官方表格所列一份（90 公克）
  amount: 90
  unit: g
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 248
      protein_g: 7.7
      fat_g: 0.8
      saturated_fat_g: 0.2
      trans_fat_g: 0
      carbohydrate_g: 52.6
      sugar_g: 14.5
      sodium_mg: 263
quality:
  data_quality: official_brand
  completeness: nutrition_complete
  confidence: medium
  calculation_allowed: false
extraction:
  method: structured_transcription_official_table
  source_image_sha256: 541bf36f9c82fbc1547b1651b0f3faa004099250a8498d92829780d50caf0bef
limitations:
  - 本文件由官方營養表自動轉換為 draft，尚未經真人逐列審核，只進入 preview dataset。
  - 官方數值為參考均值，可能因原物料、配方、產品版本與門市供應而變動。
  - 官方表格未提供成分與過敏原；未列出不代表不含，本次不自行推測。
---

# Summary

官方營養表提供一份 90 公克的熱量與八項營養數值；本文件保留官方每份基準，不補齊未提供欄位。[^starbucks-food-2026-07-22]

[^starbucks-food-2026-07-22]: 星巴克台灣官方食品營養標示表
