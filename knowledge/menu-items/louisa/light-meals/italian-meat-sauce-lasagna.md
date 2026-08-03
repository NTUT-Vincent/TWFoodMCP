---
type: Food Menu Item
title: 路易莎 義式肉醬千層麵
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
  id: louisa-menu-italian-meat-sauce-lasagna-2025-08
  kind: menu_item
  market: TW
  brand: 路易莎咖啡 Louisa Coffee
  name: 義式肉醬千層麵
  aliases:
  - 義式肉醬千層麵
  variant: 2025.08 官方營養標示版本
serving:
  amount: 1
  unit: serving
  description: 每一份；官方圖片未在該列提供重量
nutrition:
- basis: per_serving
  values:
    energy_kcal: 481.7
    protein_g: 24.4
    fat_g: 22.8
    saturated_fat_g: 14.1
    trans_fat_g: 0.3
    carbohydrate_g: 44.9
    sugar_g: 11.2
    sodium_mg: 1195.8
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
| Energy | 481.7 kcal |
| Protein | 24.4 g |
| Total fat | 22.8 g |
| Saturated fat | 14.1 g |
| Trans fat | 0.3 g |
| Carbohydrate | 44.9 g |
| Sugar | 11.2 g |
| Sodium | 1195.8 mg |

# OCR Evidence

```text
義式肉醬千層麵           481.7     24.4    22.8       14.1          0.3          449       11.2       1195.8
```

# Review Notes

- OCR rendered carbohydrate as `449`; interpreted as `44.9` from column formatting. Human verification is still required.
- `status: draft`, `quality.confidence: low`, and `calculation_allowed: false` are intentional until a human compares the row against the official image.

[^louisa-official-nutrition-2025-08]: 路易莎 2025.08 官方輕食類營養標示彙整表
