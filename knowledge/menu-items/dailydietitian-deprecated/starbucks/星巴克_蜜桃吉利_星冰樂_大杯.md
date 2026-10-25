---
type: Food Product
title: |-
  星巴克 蜜桃吉利
  星冰樂
  大杯
description: 從日日營養文章表格逐列抽取的未驗證食品營養 draft。
resource: https://dailydietitian.com.tw/%e6%9c%80%e6%96%b0%e6%98%9f%e5%b7%b4%e5%85%8b%e9%a3%b2%e5%93%81%e8%8f%9c%e5%96%ae-%e7%86%b1%e9%87%8f-%e5%83%b9%e6%a0%bc-%e7%87%9f%e9%a4%8a%e6%88%90%e5%88%86/
tags:
  - 星巴克
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
  - id: dailydietitian-1022ef5c8731
    resource: https://dailydietitian.com.tw/%e6%9c%80%e6%96%b0%e6%98%9f%e5%b7%b4%e5%85%8b%e9%a3%b2%e5%93%81%e8%8f%9c%e5%96%ae-%e7%86%b1%e9%87%8f-%e5%83%b9%e6%a0%bc-%e7%87%9f%e9%a4%8a%e6%88%90%e5%88%86/
    title: 【2026/7 更新】星巴克飲品：熱量/咖啡因/糖量，哈密瓜風味星冰樂登場(即時更新)
    author: dailydietitian/website
    source_class: expert_interpretation
    last_modified: 2025-07-03
    retrieved_at: 2026-08-02T05:23:09.523Z
access:
  classification: public
food:
  id: food:tw:menu:dailydietitian:0cb8e296efcf7854f4ae
  kind: menu_item
  market: TW
  brand: 星巴克
  name: |-
    蜜桃吉利
    星冰樂
    大杯
  aliases:
    - |-
      蜜桃吉利
      星冰樂
      大杯
    - |-
      星巴克蜜桃吉利
      星冰樂
      大杯
    - |-
      星巴克 蜜桃吉利
      星冰樂
      大杯
revision:
  revision_id: dailydietitian-2026-08-02-0cb8e296efcf
nutrition:
  - basis: per_serving
    values:
      energy_kcal: 412
      caffeine_mg: 0
      sugar_g: 76
quality:
  data_quality: third_party_database
  completeness: partial
  confidence: low
  calculation_allowed: false
extraction:
  source_system: 日日營養 DailyDietitian
  candidate_id: dd:0cb8e296efcf7854f4ae
  snapshot_retrieved_at: 2026-08-02T05:23:09.523Z
  article_estimation_disclosure: false
  table_index: 0
  row_index: 1
  basis_inferred: true
  source_headers:
    - 品項名稱
    - |-
      熱量
      kcal
    - |-
      咖啡因
      mg
    - |-
      糖
      g
  source_row:
    - |-
      蜜桃吉利
      星冰樂
      大杯
    - "412"
    - "0"
    - "76"
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

此文件逐列保存日日營養文章中的食品名稱與營養表格數值。[^dailydietitian-1022ef5c8731] 它是未驗證 draft，不代表官方標示或 TWFoodMCP 的正式判定。

# Source Row

| 品項名稱 | 熱量<br>kcal | 咖啡因<br>mg | 糖<br>g |
| --- | --- | --- | --- |
| 蜜桃吉利<br>星冰樂<br>大杯 | 412 | 0 | 76 |

# Review Required

升為 stable 前，真人 reviewer 必須確認精確產品、規格、份量基準、營養欄位、文章版本及可追溯證據。此 draft 的 `quality.calculation_allowed` 固定為 `false`。

[^dailydietitian-1022ef5c8731]: 【2026/7 更新】星巴克飲品：熱量/咖啡因/糖量，哈密瓜風味星冰樂登場(即時更新)
