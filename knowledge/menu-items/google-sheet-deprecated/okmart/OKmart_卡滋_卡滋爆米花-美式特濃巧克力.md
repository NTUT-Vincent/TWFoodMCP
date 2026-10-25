---
type: Food Product
title: OKmart／卡滋 卡滋爆米花－美式特濃巧克力
description: 從 TWFood 共筆試算表匯入的可追溯營養觀測 draft。
resource: https://www.okmart.com.tw/userfiles/%E7%A6%8F%E6%B0%A3%E7%A6%AE%E7%9B%92%E6%95%B4%E6%9C%AC%E5%9E%8B%E9%8C%84.pdf
tags:
  - OKmart／卡滋
  - 爆米花
  - TWFood 共筆
  - 待人工審核
generated:
  by: twfoodmcp-google-sheet-importer/1.0.0
  at: 2026-10-25T00:00:00.000Z
status: draft
stale_after: 2027-04-22
sources:
  - id: sheet-source-ff180287ad32
    resource: https://www.okmart.com.tw/userfiles/%E7%A6%8F%E6%B0%A3%E7%A6%AE%E7%9B%92%E6%95%B4%E6%9C%AC%E5%9E%8B%E9%8C%84.pdf
    title: 福氣禮盒整本型錄
    source_class: primary_official
    retrieved_at: 2026-10-22T00:00:00+08:00
access:
  classification: public
food:
  id: food:tw:menu:google-sheet:nut-01671
  kind: menu_item
  market: TW
  brand: OKmart／卡滋
  name: 卡滋爆米花－美式特濃巧克力
  aliases:
    - 卡滋爆米花－美式特濃巧克力
    - OKmart／卡滋卡滋爆米花－美式特濃巧克力
    - OKmart／卡滋 卡滋爆米花－美式特濃巧克力
revision:
  revision_id: google-sheet-2026-10-25-nut-01671
nutrition:
  - basis: per_100g
    values:
      energy_kcal: 541
quality:
  data_quality: official_brand
  completeness: minimal
  confidence: low
  calculation_allowed: false
extraction:
  source_system: TWFood Google Sheet
  spreadsheet_id: 16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY
  sheet_name: Nutrition Data
  record_id: NUT-01671
  evidence_grade: D
  verification_status_as_reported: historical_unverified
  value_method: official_catalog_calorie
  source_type: official_catalog_pdf
  source_publisher: OKmart
  source_author: null
  source_row:
    record_id: NUT-01671
    food_name: 卡滋爆米花－美式特濃巧克力
    brand_or_context: OKmart／卡滋
    category: 爆米花
    serving_basis: 每100g（每桶170g）
    calories_kcal: 541
    protein_g: null
    fat_g: null
    saturated_fat_g: null
    trans_fat_g: null
    carbohydrate_g: null
    sugar_g: null
    sodium_mg: null
    price_twd: 99
    value_method: official_catalog_calorie
    evidence_grade: D
    verification_status: historical_unverified
    source_type: official_catalog_pdf
    source_publisher: OKmart
    source_author: null
    source_title: 福氣禮盒整本型錄
    source_url: https://www.okmart.com.tw/userfiles/%E7%A6%8F%E6%B0%A3%E7%A6%AE%E7%9B%92%E6%95%B4%E6%9C%AC%E5%9E%8B%E9%8C%84.pdf
    article_updated_at: null
    accessed_at: 2026-10-22
    primary_source_url: null
    usage_note: OKmart舊版官方禮盒型錄第16頁每100g熱量；型錄年代久遠、未明確標示更新日，99元為當時店取價；不代表現售，非完整營養標示。
source_observation:
  price_twd: 99
  usage_note: OKmart舊版官方禮盒型錄第16頁每100g熱量；型錄年代久遠、未明確標示更新日，99元為當時店取價；不代表現售，非完整營養標示。
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件保存試算表的一筆觀測，不表示品牌、政府或 TWFoodMCP 已人工確認其正確性。
  - 試算表中的 verification_status 只作為原始欄位保留，不會轉成 OKF verified 或 human-reviewed。
  - 此 draft 的 quality.calculation_allowed 固定為 false；缺少的營養欄位維持 unknown。
  - 份量描述依原始試算表保存，未據此推算重量、容量或每 100 g／ml 數值。
---

# Summary

此文件保存試算表記錄 NUT-01671 的營養觀測。[^sheet-source-ff180287ad32] 它是未驗證 draft，不能直接用於營養計算。

# Observation

| 欄位 | 值 |
| --- | --- |
| 食品 | 卡滋爆米花－美式特濃巧克力 |
| 品牌／情境 | OKmart／卡滋 |
| 分類 | 爆米花 |
| 份量基準 | 每100g（每桶170g） |
| energy_kcal | 541 |

# Review Required

升為 stable 前，真人 reviewer 必須確認產品身分、份量基準、來源版本、營養數值與重複／改版關係。

[^sheet-source-ff180287ad32]: 福氣禮盒整本型錄
