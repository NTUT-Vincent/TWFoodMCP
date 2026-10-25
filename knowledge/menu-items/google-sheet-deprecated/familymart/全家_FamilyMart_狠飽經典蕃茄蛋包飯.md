---
type: Food Product
title: 全家 FamilyMart 狠飽經典蕃茄蛋包飯
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.cna.com.tw/news/firstnews/201710200163.aspx
tags:
  - 全家 FamilyMart
  - 便當／主食
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-23
sources:
  - id: sheet-source-e6e5c0cfd45f
    resource: https://www.cna.com.tw/news/firstnews/201710200163.aspx
    title: 超商微波便當多鈉 3／4超過一餐建議量
    source_class: third_party_dataset
    last_modified: 2017-10-20T00:00:00+08:00
    retrieved_at: 2026-10-23T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01687
  kind: menu_item
  market: TW
  brand: 全家 FamilyMart
  name: 狠飽經典蕃茄蛋包飯
  aliases:
    - 狠飽經典蕃茄蛋包飯
    - 全家 FamilyMart狠飽經典蕃茄蛋包飯
    - 全家 FamilyMart 狠飽經典蕃茄蛋包飯
revision:
  revision_id: google-sheet-2026-10-25-nut-01687
serving:
  description: 1盒（2017年抽查；未列重量）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      sodium_mg: 1671
quality:
  data_quality: third_party_database
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01687
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: transcribed_from_news_report
  source_type: news_article
  source_publisher: 中央社 CNA
  source_author: 楊淑閔
  source_row:
    record_id: NUT-01687
    food_name: 狠飽經典蕃茄蛋包飯
    brand_or_context: 全家 FamilyMart
    category: 便當／主食
    serving_basis: 1盒（2017年抽查；未列重量）
    calories_kcal: null
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: 1671
    price_twd: null
    value_method: transcribed_from_news_report
    evidence_grade: D
    verification_status: historical_unverified
    source_type: news_article
    source_publisher: 中央社 CNA
    source_author: 楊淑閔
    source_title: 超商微波便當多鈉 3／4超過一餐建議量
    source_url: https://www.cna.com.tw/news/firstnews/201710200163.aspx
    article_updated_at: 2017-10-20
    accessed_at: 2026-10-23
    primary_source_url: null
    usage_note: 中央社2017-10-20報導消基會當年購樣檢視標示的鈉含量；歷史數值、重量未列，不能代表2026年配方或現售；原始消基會標示網址未取得，不填primary_source_url。
source_observation:
  usage_note: 中央社2017-10-20報導消基會當年購樣檢視標示的鈉含量；歷史數值、重量未列，不能代表2026年配方或現售；原始消基會標示網址未取得，不填primary_source_url。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01687 的營養觀測。[^sheet-source-e6e5c0cfd45f] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 狠飽經典蕃茄蛋包飯 |
| 品牌／情境 | 全家 FamilyMart |
| 分類 | 便當／主食 |
| 份量基準 | 1盒（2017年抽查；未列重量） |
| sodium_mg | 1671 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-e6e5c0cfd45f]: 超商微波便當多鈉 3／4超過一餐建議量
