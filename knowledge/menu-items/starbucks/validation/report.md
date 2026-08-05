---
type: Validation Report
title: Starbucks Taiwan OKF Validation Report
description: 本機建置後由 deterministic validator 產生的資料品質摘要。
tags:
- starbucks
- 台灣
- validation
status: stable
generated:
  by: process:starbucks-okf-validator
  at: '2026-08-05T03:18:00Z'
verified:
- by: process:starbucks-okf-validator
  at: '2026-08-05T03:18:00Z'
sources:
- id: starbucks-catalog
  resource: https://www.starbucks.com.tw/products/drinks.jspx
  title: 星巴克台灣官方飲品目錄
  author: organization:starbucks-taiwan
validation:
  okf_version: '0.2'
  drink_concepts: 198
  nutrition_ready: 7
  catalog_only: 191
  food_concepts: 0
  quarantined_food_ocr_rows: 79
  quality_gate_passed: true
---

# Validation Report

- OKF target: 0.2
- 飲品 concepts: 198
- 可用於營養計算: 7
- 僅目錄存在性: 191
- 食品 concepts: 0
- 隔離食品 OCR: 79
- Quality gate: PASS

## 發布規則

- `status` 只允許 `draft | stable | deprecated`。
- 只有 stable、具 machine verification、且有完整杯型營養資料者可計算。
- OCR 名稱或欄位位置未可靠確認時，不建立食品 concept。
