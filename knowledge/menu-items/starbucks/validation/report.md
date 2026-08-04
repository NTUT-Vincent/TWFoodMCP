---
type: Validation Report
title: 擷取與驗證報告
description: 星巴克台灣營養資料 OKF 轉換狀態。
status: draft
generated:
  by: process:starbucks-taiwan-nutrition-import
  at: 2026-08-04T13:20:00Z
---

# 驗證狀態

## 已完成

- 讀取官方 OKF README.md 與 SPEC.md（v0.2）。
- 保存星巴克台灣 2026-07-22 食品營養表 4 張官方原圖。
- 執行第一輪繁體中文 OCR，保存未校正文字。
- 建立符合 OKF 目錄、frontmatter 與 provenance 要求的 bundle 骨架。

## 尚未完成

- 食品 OCR 逐列與原圖核對。
- 食品個別 concept 生成。
- 飲品分類頁完整商品清單。
- 飲品各杯型營養資料擷取。
- 重複、缺值、欄位型別與總筆數驗證。

## 品質規則

OCR 內容不得直接標記為 verified。只有與官方頁面或官方營養表逐列核對後，才可寫入結構化營養欄位。
