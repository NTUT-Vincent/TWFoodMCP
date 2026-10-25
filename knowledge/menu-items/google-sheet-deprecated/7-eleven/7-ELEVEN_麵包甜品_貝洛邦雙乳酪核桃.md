---
type: Food Product
title: 7-ELEVEN／麵包甜品 貝洛邦雙乳酪核桃
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://baliman.tw/blog/post/711%E9%BA%B5%E5%8C%85%E7%A8%AE%E9%A1%9E
tags:
  - 7-ELEVEN／麵包甜品
  - 麵包／烘焙
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-19
sources:
  - id: sheet-source-521744f65935
    resource: https://baliman.tw/blog/post/711%E9%BA%B5%E5%8C%85%E7%A8%AE%E9%A1%9E
    title: 〖7-11麵包種類〗60款價格熱量＋10月新品（2026最新）
    source_class: third_party_dataset
    last_modified: 2026-10-17T00:00:00+08:00
    retrieved_at: 2026-10-19T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01608
  kind: menu_item
  market: TW
  brand: 7-ELEVEN／麵包甜品
  name: 貝洛邦雙乳酪核桃
  aliases:
    - 貝洛邦雙乳酪核桃
    - 7-ELEVEN／麵包甜品貝洛邦雙乳酪核桃
    - 7-ELEVEN／麵包甜品 貝洛邦雙乳酪核桃
revision:
  revision_id: google-sheet-2026-10-25-nut-01608
serving:
  description: 1個（文章未列重量）
  amount: 1
  unit: serving
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 439
quality:
  data_quality: third_party_database
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01608
  evidence_grade: D
  verification_status_as_reported: unverified
  value_method: transcribed_from_article
  source_type: blog_article
  source_publisher: BALIMAN情報局
  source_author: null
  source_row:
    record_id: NUT-01608
    food_name: 貝洛邦雙乳酪核桃
    brand_or_context: 7-ELEVEN／麵包甜品
    category: 麵包／烘焙
    serving_basis: 1個（文章未列重量）
    calories_kcal: 439
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 50
    value_method: transcribed_from_article
    evidence_grade: D
    verification_status: unverified
    source_type: blog_article
    source_publisher: BALIMAN情報局
    source_author: null
    source_title: 〖7-11麵包種類〗60款價格熱量＋10月新品（2026最新）
    source_url: https://baliman.tw/blog/post/711%E9%BA%B5%E5%8C%85%E7%A8%AE%E9%A1%9E
    article_updated_at: 2026-10-17
    accessed_at: 2026-10-19
    primary_source_url: null
    usage_note: 2026-10-17部落格表格轉錄；聲稱參考官網但未獨立核對逐項原始標示；份量重量未列，非官方數值。
source_observation:
  price_twd: 50
  usage_note: 2026-10-17部落格表格轉錄；聲稱參考官網但未獨立核對逐項原始標示；份量重量未列，非官方數值。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01608 的營養觀測。[^sheet-source-521744f65935] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 貝洛邦雙乳酪核桃 |
| 品牌／情境 | 7-ELEVEN／麵包甜品 |
| 分類 | 麵包／烘焙 |
| 份量基準 | 1個（文章未列重量） |
| energy_kcal | 439 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-521744f65935]: 〖7-11麵包種類〗60款價格熱量＋10月新品（2026最新）
