---
type: Food Menu Item
title: 路易莎 菜多好纖細－台梗米
description: 路易莎官方營養標示圖片經本地 OCR 與保守欄位整理產生的待人工審核草稿。
resource: https://www.louisacoffee.co/upload/allergenImg/20250811_033319.jpg
tags:
- louisa
- 路易莎
- menu-item
- light-meal
- nutrition
- ocr-draft
status: draft
stale_after: '2026-08-01'
generated:
  by: louisa-okf-importer/1.0.0
  at: '2026-08-03T15:47:50Z'
sources:
- id: louisa-official-nutrition-2025-08
  resource: https://www.louisacoffee.co/upload/allergenImg/20250811_033319.jpg
  title: 路易莎 2025.08 官方輕食類營養標示彙整表
  author: process:louisa-official-site
  last_modified: '2025-08-11'
  source_class: primary_official
- id: louisa-official-nutrition-page
  resource: https://www.louisacoffee.co/allergenImg?CatlogID=2
  title: 路易莎官方營養與過敏原資訊頁
  author: process:louisa-official-site
  source_class: primary_official
food:
  id: louisa-menu-cai-duo-hao-xian-xi-taigeng-rice-2025-08
  kind: menu_item
  market: TW
  brand: 路易莎咖啡 Louisa Coffee
  name: 菜多好纖細－台梗米
  aliases:
  - 菜多好纖細-台梗米
  variant: 2025.08 官方營養標示版本
serving:
  amount: 1
  unit: serving
  description: 每一份；官方圖片未在該列提供重量
nutrition:
- basis: per_serving
  values:
    energy_kcal: 418.2
    protein_g: 13.8
    fat_g: 4.4
    saturated_fat_g: 1.3
    trans_fat_g: 0.0
    carbohydrate_g: 80.8
    sugar_g: 4.0
    sodium_mg: 917.3
quality:
  data_quality: official_brand
  completeness: nutrition_complete
  confidence: low
  calculation_allowed: false
access:
  classification: public
revision:
  source_version: 2025-08
  review_status: ocr_requires_human_review
---

# Nutrition

The numeric values below were transcribed from the official Louisa image and remain a draft.[^louisa-official-nutrition-2025-08]

| Nutrient | Value per serving |
|---|---:|
| Energy | 418.2 kcal |
| Protein | 13.8 g |
| Total fat | 4.4 g |
| Saturated fat | 1.3 g |
| Trans fat | 0.0 g |
| Carbohydrate | 80.8 g |
| Sugar | 4.0 g |
| Sodium | 917.3 mg |

# OCR Evidence

```text
菜多好纖細-台梗米        418.2     13.8     44        1.3           0           80.8        4         917.3
```

# Review Notes

- OCR rendered total fat as `44`; interpreted as `4.4` from column formatting. Human verification is still required.
- `status: draft`, `quality.confidence: low`, and `calculation_allowed: false` are intentional until a human compares the row against the official image.

[^louisa-official-nutrition-2025-08]: 路易莎 2025.08 官方輕食類營養標示彙整表
