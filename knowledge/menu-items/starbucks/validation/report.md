---
type: Validation Report
title: 星巴克台灣營養資料擷取與驗證報告
description: 本次星巴克台灣官方食品與飲品營養資料 OKF 轉換結果。
resource: https://www.starbucks.com.tw/products/calories/calories.jspx
generated:
  by: twfoodmcp-starbucks-importer/1.0.0
  at: 2026-08-05T15:30:00Z
status: draft
sources:
  - id: starbucks-calories-page
    resource: https://www.starbucks.com.tw/products/calories/calories.jspx
    title: 星巴克台灣營養標示表
    author: starbucks-taiwan/2026-07-22
    source_class: primary_official
  - id: starbucks-drinks-page
    resource: https://www.starbucks.com.tw/products/drinks.jspx
    title: 星巴克台灣飲品
    author: starbucks-taiwan/2026-08-05
    source_class: primary_official
---

# 驗證結果

- 官方食品營養表圖片：4 張，SHA-256 全數符合鎖定版本。
- 食品品項：113 筆，9 個官方營養欄位逐列轉錄。
- 飲品分類／入口頁：12 頁。
- 發現官方飲品商品頁：202 頁。
- 產生飲品杯型／規格 concept：311 筆。
- 未提供熱量、糖或咖啡因而略過的商品頁：54 頁。

# 品質與限制

- 所有自動匯入 concept 均為 `draft`，只可進 preview，不可參與營養計算。
- 食品表為圖片來源，雖以 SHA-256 鎖定官方版本，仍需真人逐列核對後才可升為 stable。
- 飲品商品頁只提供熱量、糖與部分品項的咖啡因；未提供欄位維持 unknown。
- 客製化飲品、配方調整與門市實際製作可能改變數值。
- 未列出成分或過敏原不代表不含，本次不自行推測。

[^starbucks-calories-page]: 星巴克台灣營養標示表
[^starbucks-drinks-page]: 星巴克台灣飲品
