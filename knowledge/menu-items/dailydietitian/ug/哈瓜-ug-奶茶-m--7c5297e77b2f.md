---
type: Food Product
title: |-
  UG 熱量 哈瓜 UG 奶茶
  (M)
description: 從日日營養文章表格逐列抽取的未驗證食品營養 draft。
resource: https://dailydietitian.com.tw/ug%e8%8f%9c%e5%96%ae-%e5%83%b9%e6%a0%bc-%e7%86%b1%e9%87%8f-%e7%87%9f%e9%a4%8a%e5%b8%ab%e6%8e%a8%e8%96%a6/
tags:
  - UG 熱量
  - 日日營養
  - 第三方資料
  - 待人工審核
  - 份量基準待確認
generated:
  by: twfoodmcp-dailydietitian-importer/2.0.0
  at: 2026-08-02T06:39:27.145Z
status: draft
stale_after: 2027-02-02
sources:
  - id: dailydietitian-263d2dcbd33b
    resource: https://dailydietitian.com.tw/ug%e8%8f%9c%e5%96%ae-%e5%83%b9%e6%a0%bc-%e7%86%b1%e9%87%8f-%e7%87%9f%e9%a4%8a%e5%b8%ab%e6%8e%a8%e8%96%a6/
    title: 2026 UG 熱量：營養師推薦&建議/咖啡因/糖量/價目表
    author: dailydietitian/website
    source_class: expert_interpretation
    last_modified: 2025-12-06
    retrieved_at: 2026-08-02T05:23:09.523Z
access:
  classification: public
food:
  id: food:tw:menu:dailydietitian:7c5297e77b2ffb00927b
  kind: menu_item
  market: TW
  brand: UG 熱量
  name: |-
    哈瓜 UG 奶茶
    (M)
  aliases:
    - |-
      哈瓜 UG 奶茶
      (M)
    - |-
      UG 熱量哈瓜 UG 奶茶
      (M)
    - |-
      UG 熱量 哈瓜 UG 奶茶
      (M)
revision:
  revision_id: dailydietitian-2026-08-02-7c5297e77b2f
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 203
      sugar_g: 28.8
      caffeine_mg: 110
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: 日日營養 DailyDietitian
  candidate_id: dd:7c5297e77b2ffb00927b
  snapshot_retrieved_at: 2026-08-02T05:23:09.523Z
  article_estimation_disclosure: false
  table_index: 0
  row_index: 1
  basis_inferred: true
  source_headers:
    - 品項
    - |-
      價格
      元
    - |-
      熱量
      kcal
    - |-
      糖量
      g
    - |-
      咖啡因
      mg
  source_row:
    - |-
      哈瓜 UG 奶茶
      (M)
    - "75"
    - "203"
    - "28.8"
    - "110"
official_review_hint:
  status: not_compared_or_no_match
limitations:
  - 此文件只表示日日營養文章中曾出現這筆資料，不代表品牌、政府或 TWFoodMCP 已確認其正確性。
  - 此 draft 沒有 verified 欄位，依 OKF v0.2 應視為 unverified。
  - 在真人確認產品身分、份量基準與營養數值前，不得用於營養計算或升為 stable。
  - 來源表格沒有明示 per-serving 或 per-100 基準，目前 basis 是抽取器推定值。
  - 來源沒有可重現的 serving amount。
---

# Summary

此文件逐列保存日日營養文章中的食品名稱與營養表格數值。[^dailydietitian-263d2dcbd33b] 它是未驗證 draft，不代表官方標示或 TWFoodMCP 的正式判定。

# Source Row

| 品項 | 價格<br>元 | 熱量<br>kcal | 糖量<br>g | 咖啡因<br>mg |
| --- | --- | --- | --- | --- |
| 哈瓜 UG 奶茶<br>(M) | 75 | 203 | 28.8 | 110 |

# Review Required

升為 stable 前，真人 reviewer 必須確認精確產品、規格、份量基準、營養欄位、文章版本及可追溯證據。此 draft 的 `quality.calculation_allowed` 固定為 `false`。

[^dailydietitian-263d2dcbd33b]: 2026 UG 熱量：營養師推薦&建議/咖啡因/糖量/價目表
