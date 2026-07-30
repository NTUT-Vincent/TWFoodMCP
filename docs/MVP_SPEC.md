# TWFoodMCP — MVP Technical Specification

**Version:** 0.1.0-draft  
**Date:** 2026-07-31  
**Status:** Draft  
**Primary language:** Traditional Chinese  
**Code license:** Apache-2.0（建議）  
**Dataset license:** 依各來源授權逐筆標示，不預設取得原始資料再授權權利

---

## 1. Executive Summary

TWFoodMCP 是一套面向台灣食品的開放知識基礎設施，將食品營養、份量、成分、過敏原、產品版本與來源證據整理成可版本化、可驗證、可供 AI Agent 使用的 OKF 文件，並透過 Remote MCP 對外提供查詢、計算與投稿能力。

本專案不是另一個只會估算熱量的聊天機器人。核心價值是讓每一筆食品資料都能回答：

1. 資料描述的是哪一個精確產品或餐點版本？
2. 數值是每份、每 100 g，還是每 100 ml？
3. 資料來自實體標示、品牌官方頁、政府資料、第三方資料，還是估算？
4. 何時被驗證？目前是否已過期？
5. 有哪些已知限制、缺值與不可推論事項？

### 1.1 系統總覽

```text
Human / Agent
   │
   ├── query ───────────────────────────────┐
   │                                        │
   └── create_draft                         │
           │                                │
           ▼                                │
      Draft OKF                             │
           │                                │
   Fixed downstream pipeline                │
 validation → comparison → review → commit │
           │                                │
           ▼                                │
      GitHub main                           │
   source of truth                          │
           │                                │
           ▼                                │
 GitHub Actions build/index/sync            │
           │                                │
           ▼                                │
    Cloudflare KV / R2                      │
           │                                │
           ▼                                │
 Cloudflare Remote MCP ◄────────────────────┘
```

### 1.2 核心架構決策

| 項目 | 決策 |
|---|---|
| Knowledge source of truth | GitHub repository 中的 OKF 文件 |
| Runtime storage | Cloudflare KV；大型 evidence 或 snapshots 可使用 R2 |
| MCP transport | Streamable HTTP |
| Runtime GitHub access | 禁止；查詢只讀 Cloudflare runtime dataset |
| Search | Deterministic keyword ranking；MVP 不使用 embedding |
| LLM API | Runtime 與 pipeline 不依賴付費 LLM API |
| Public write entrypoint | 僅 `create_draft` |
| Downstream write workflow | 固定執行 validation、comparison、review、commit |
| Draft publication | Draft 不進正式搜尋、不參與營養計算 |
| Human verification | 只有真人 reviewer 可標記 human-reviewed |
| Public user product | Web UI + MCP；不可只發布 MCP |

---

## 2. Problem Statement

一般 AI 雖可搜尋食品資訊，但台灣食品資料仍有下列缺口：

- 食品資料分散在包裝、品牌官網、通路頁、政府資料與群眾資料庫。
- 同品牌同品名可能存在容量、口味、配方與包裝版本差異。
- 網路答案常混淆每份與每 100 g / 100 ml。
- 缺少數值有時被錯誤當作 0。
- 「未標示過敏原」可能被誤解為「保證不含」。
- 外食或台灣在地品項經常只有估算，卻沒有清楚標示估算依據。
- AI 每次重新搜尋與理解，結果不穩定且難以稽核。
- 第三方開發者缺少可直接被 Agent 使用的台灣食品知識介面。

TWFoodMCP 將 raw information 轉為 curated、versioned、traceable knowledge，提供資料品質與使用限制，而非只提供一個看似精確的數字。

---

## 3. Goals and Non-goals

### 3.1 MVP Goals

MVP 必須支援：

- 依品名、品牌、條碼、別名與關鍵字搜尋食品。
- 查詢食品 identity、serving、nutrition、ingredients、allergens、sources、verification 與 revision。
- 使用已驗證且可計算的資料，計算多項食品營養總量。
- 將可換算資料統一到每份或每 100 g / 100 ml 比較。
- 接收新增、修正、改版、過期回報與停用要求。
- 所有寫入先建立 Draft OKF，再進固定審核流程。
- GitHub PR 提供 diff、來源與審核紀錄。
- 合併後自動產生 search index 並同步到 Cloudflare。
- 對外提供 Remote MCP endpoint 與一般使用者 Web UI。

### 3.2 Social-impact Goals

- 建立台灣食品的公共、可追溯知識層。
- 降低飲食資訊取得與理解門檻。
- 降低 AI 把估算值、缺值或過期資料當成事實的風險。
- 讓健身、飲食紀錄、營養教育、過敏原提醒與第三方 Agent 可共用可信資料。
- 建立可擴展到其他公共知識領域的 contribution framework。

### 3.3 Non-goals

MVP 不提供：

- 醫療診斷、營養治療或疾病管理建議。
- 個人化減重、增肌、糖尿病、腎臟病或過敏治療方案。
- 從餐點照片直接推斷精確重量或完整營養。
- 對沒有官方或可驗證來源的外食提供假精確數值。
- 儲存個人飲食紀錄、體重、疾病、用藥或其他健康資料。
- 自動爬取所有網站。
- 向量資料庫、embedding 或 RAG 作為 MVP 必要依賴。
- 匿名投稿直接發布為 stable knowledge。
- 將 `not_declared` 解釋為 allergen-free。

---

## 4. Target Users

### 4.1 General Consumers

- 查包裝食品或連鎖餐飲營養。
- 查成分與已標示過敏原。
- 比較食品營養基準。
- 回報錯誤、改版或過期資訊。

### 4.2 Fitness and Food-tracking Users

- 查熱量、蛋白質、脂肪、碳水、糖、纖維與鈉。
- 依實際攝取份量換算。
- 區分官方數值、第三方資料與估算值。

### 4.3 Developers and AI Agents

- 透過 MCP 取得結構化食品資料。
- 使用穩定 food ID 與 dataset version。
- 得知資料來源、trust tier、staleness 與計算限制。

### 4.4 Contributors and Reviewers

- 提交新品、營養標示、修正或改版。
- 附上來源與 evidence。
- 查看既有 stable 與 proposed draft 的差異。
- 透過 GitHub PR 審核、討論與合併。

---

## 5. MVP Scope

### 5.1 Included Data Types

#### Packaged foods

優先收錄：

- 超商食品
- 飲料、豆漿、乳品
- 雞胸肉與高蛋白食品
- 飯糰、包裝便當、即食食品
- 冷凍食品
- 零食與穀物食品

#### Official chain menu items

僅收錄可確認以下資料的固定品項：

- 官方營養頁或官方菜單
- 官方份量或可重現 serving
- 官方成分或過敏原資訊

#### Generic foods

可收錄政府食品營養資料中的一般食物，例如白飯、蛋、肉類與蔬菜，作為 meal calculation 的基礎資料。

### 5.2 Deferred to Later Releases

- 任意早餐店、自助餐與便當店估算
- 手搖飲甜度、冰量與配料組合
- 圖片 OCR 自動填表
- 使用者實際秤重統計
- 食品價格與縮水變化
- 食品召回與停售
- 個人化收藏與飲食日誌

### 5.3 Data That Cannot Become Stable Directly

- 無明確份量的餐點
- 僅憑照片推估的營養
- 使用者記憶中的數值
- 無法識別品牌、條碼或店家的資料
- AI 自行推測的 ingredients 或 allergens
- 無法追溯原始來源的文章數字

---

## 6. Repository Layout

```text
TWFoodMCP/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── DATA_POLICY.md
├── PRIVACY.md
├── docs/
│   └── MVP_SPEC.md
├── knowledge/
│   ├── packaged-foods/
│   ├── menu-items/
│   └── generic-foods/
├── references/
│   ├── source-snapshots/
│   └── evidence/
├── schemas/
│   ├── food-okf.schema.json
│   ├── create-draft.schema.json
│   └── runtime-document.schema.json
├── scripts/
│   ├── validate-okf.ts
│   ├── build-index.ts
│   ├── compare-version.ts
│   ├── check-links.ts
│   └── sync-cloudflare.ts
├── worker/
│   ├── src/
│   │   ├── index.ts
│   │   ├── mcp.ts
│   │   ├── tools/
│   │   ├── search/
│   │   ├── github/
│   │   └── security/
│   └── wrangler.jsonc
├── web/
└── .github/
    ├── workflows/
    │   ├── validate-pr.yml
    │   ├── deploy-main.yml
    │   └── scheduled-review.yml
    └── PULL_REQUEST_TEMPLATE.md
```

Draft 預設存在 feature branch 與 PR，不長期放在 `main/submissions`。若需要 retention，使用 GitHub Issue 或獨立 archive branch。

---

## 7. Domain Model

### 7.1 Food Identity

```ts
type FoodKind = "packaged_food" | "menu_item" | "generic_food";

interface FoodIdentity {
  id: string;
  kind: FoodKind;
  market: "TW";
  name: string;
  brand?: string;
  barcode?: string;
  variant?: string;
  aliases?: string[];
}
```

ID 規則：

```text
packaged: food:tw:barcode:<barcode>
menu:     food:tw:menu:<brand-slug>:<item-slug>
generic:  food:tw:generic:<food-slug>
```

同條碼若發生配方或營養改版，保留同一 logical food identity，但建立新的 revision。若條碼不同，原則上建立不同 food ID。

### 7.2 Serving

```ts
interface Serving {
  description: string;
  amount: number;
  unit: "g" | "ml" | "piece" | "package" | "serving";
  servings_per_container?: number;
}
```

### 7.3 Nutrition

```ts
interface NutritionValues {
  energy_kcal?: number;
  protein_g?: number;
  fat_g?: number;
  saturated_fat_g?: number;
  trans_fat_g?: number;
  carbohydrate_g?: number;
  sugar_g?: number;
  dietary_fiber_g?: number;
  sodium_mg?: number;
}

interface NutritionRecord {
  basis: "per_serving" | "per_100g" | "per_100ml";
  values: NutritionValues;
}
```

規則：

- 每筆 nutrition 必須有明確 basis。
- 缺少欄位代表 unknown，不可視為 0。
- 數值必須非負且通過合理範圍檢查。
- ml 不可任意轉 g；除非有密度或官方換算依據。

### 7.4 Allergens

```ts
type AllergenStatus =
  | "contains"
  | "may_contain"
  | "not_declared"
  | "unknown";

interface AllergenDeclaration {
  allergen: string;
  status: AllergenStatus;
  source_id?: string;
}
```

`not_declared` 不等於 `allergen_free`。MVP 不提供「安全可食」保證。

### 7.5 Data Quality

```ts
type DataQuality =
  | "official_label"
  | "official_brand"
  | "government_database"
  | "verified_community_label"
  | "third_party_database"
  | "community_report"
  | "estimated";

type Confidence = "high" | "medium" | "low";
```

### 7.6 Product Revision

```ts
interface ProductRevision {
  revision_id: string;
  effective_from?: string;
  effective_to?: string;
  packaging_description?: string;
  supersedes?: string;
}
```

重大營養、成分、過敏原或 serving 變動必須建立新 revision，不可無痕覆蓋。

---

## 8. OKF Document Contract

### 8.1 Example

```yaml
---
type: Food Product
title: 範例品牌無糖豆漿 400 ml
description: 台灣市場販售之包裝無糖豆漿。
status: stable
stale_after: 2027-01-31

tags:
  - 豆漿
  - 無糖
  - 植物性蛋白

generated:
  by: process:community-draft-pipeline
  at: 2026-07-31T01:00:00+08:00

verified:
  - by: human:github-reviewer
    at: 2026-07-31T02:00:00+08:00

sources:
  - id: package-label
    resource: references/source-snapshots/4710000000001-label.md
    title: 包裝營養標示
    author: organization:example-brand
    last_modified: 2026-07-01

food:
  id: food:tw:barcode:4710000000001
  kind: packaged_food
  market: TW
  brand: 範例品牌
  name: 無糖豆漿
  barcode: "4710000000001"
  variant: 400 ml

revision:
  revision_id: "2026-07"
  effective_from: 2026-07-01

serving:
  description: 每份 400 ml
  amount: 400
  unit: ml
  servings_per_container: 1

nutrition:
  - basis: per_serving
    values:
      energy_kcal: 180
      protein_g: 15
      fat_g: 8
      saturated_fat_g: 1.2
      trans_fat_g: 0
      carbohydrate_g: 14
      sugar_g: 0
      sodium_mg: 120

ingredients:
  - 水
  - 黃豆

allergens:
  declarations:
    - allergen: 大豆
      status: contains
      source_id: package-label

quality:
  data_quality: official_label
  confidence: high
  calculation_allowed: true
---

# Summary

台灣市場販售的包裝無糖豆漿。

# Usage Notes

營養、成分與過敏原可能因改版而變動，使用前仍應核對實際包裝。
```

### 8.2 Required Fields

所有文件：

- `type`
- `title`
- `status`
- `generated`
- `sources`
- `food.id`
- `food.kind`
- `food.market`
- `food.name`
- `quality.data_quality`
- `quality.confidence`

Stable 額外要求：

- 至少一筆 `verified`
- 至少一筆有效 `sources`
- serving 或可獨立解釋的 nutrition basis
- `quality.calculation_allowed` 明確值

### 8.3 Lifecycle

```text
draft       尚未完成審核，不進正式 runtime dataset
stable      可公開查詢與依規則使用
deprecated  保留歷史，但不是目前建議版本
```

### 8.4 Trust Tier

```text
unverified         沒有 verified
machine-confirmed  verified 僅含 process:* actor
human-reviewed     verified 至少含一位 human:* actor
```

只有真人 reviewer 可加入 `human:*`。排程 Agent 或驗證 script 不可冒充 human verifier。

### 8.5 Freshness Defaults

| Data type | Default stale period |
|---|---:|
| Packaged official label | 12 months |
| Chain menu item | 6 months |
| Government generic food | 24 months |
| Community package photo | 6 months |
| Suspected revision | 3 months |

Stale 資料仍可回傳，但必須降權並附警告。若牽涉過敏原，stale warning 必須醒目。

---

## 9. Source and Verification Policy

### 9.1 Source Levels

#### Level A — Primary / Official

- 實體包裝營養標示
- 品牌官方網站或官方菜單
- 政府資料庫
- 品牌正式書面回覆

#### Level B — Verifiable Secondary

- 通路頁完整標示
- 官方經銷商頁
- 可辨識產品、條碼與日期的包裝照片

#### Level C — Third-party Dataset

- Open Food Facts 或其他第三方資料庫
- 飲食紀錄、營養或健身應用公開資料

#### Level D — Unverified Input

- 使用者純文字描述
- AI 估算
- 無法追溯來源的網頁內容

### 9.2 Promotion to Stable

符合以下任一條件才可 stable：

1. Level A 來源 + human review。
2. 清晰包裝標示照片 + human review。
3. 兩個互相獨立的 Level B 來源 + human review。
4. 政府資料 deterministic import + schema validation + human review。

Level C 或 D 不得單獨提升為 stable。

### 9.3 Confidence

- `high`: 官方標示或政府資料，且已 human-reviewed。
- `medium`: 清晰包裝照片或多來源交叉驗證，且已 human-reviewed。
- `low`: 第三方、估算或尚未充分驗證。

---

## 10. Submission and Validation Workflow

### 10.1 Only One Public Write Tool

對外只暴露：

```text
create_draft
```

以下步驟是內部固定流程，不一定各自暴露為 MCP tool：

```text
create_draft
   ↓
schema validation
   ↓
identity resolution
   ↓
normalization
   ↓
duplicate detection
   ↓
comparison with stable knowledge
   ↓
source and risk checks
   ↓
branch / pull request creation
   ↓
human review
   ↓
commit / merge
   ↓
index build
   ↓
Cloudflare publish
```

Draft creation 不是流程終點；成功建立 Draft 後必須立即啟動 downstream pipeline。

### 10.2 Draft Actions

```ts
type DraftAction =
  | "create_food"
  | "correct_food"
  | "new_revision"
  | "report_outdated"
  | "deprecate_food";
```

### 10.3 Identity and Duplicate Resolution

依序檢查：

1. 完整條碼
2. `food.id`
3. 品牌 + 品名 + 容量
4. 品牌 + 品名 + variant
5. normalized title
6. aliases

偵測到既有產品時，應轉為 correction 或 new revision，而非平行建立重複 stable document。

### 10.4 Comparison Output

PR 必須顯示 existing stable 與 proposed draft 的差異：

- identity 與條碼
- serving
- energy 與主要 macro
- sugar、fiber、sodium
- ingredients
- allergens
- source
- revision
- quality 與 freshness

### 10.5 Review Outcomes

```text
needs_changes
rejected
approved
merged
```

審核者必須可指出：缺少來源、產品 identity 不確定、basis 不一致、數值不合理、過敏原風險、重複資料或版本判定錯誤。

---

## 11. MCP Tool Contract

### 11.1 `search_food`

用途：搜尋 stable food documents。

Input：

```json
{
  "query": "無糖豆漿 高蛋白",
  "brand": "optional",
  "kind": "packaged_food",
  "limit": 10
}
```

Requirements：

- 預設只搜尋 stable。
- 完整 barcode 與 food ID 必須優先。
- 回傳 trust tier、last verified、stale 與 dataset version。
- Draft 永不出現在預設結果。

### 11.2 `get_food`

Input：`food_id`。

Output 包含：

- identity
- revision
- serving
- nutrition
- ingredients
- allergens
- quality
- sources
- verification
- freshness warnings

### 11.3 `calculate_nutrition`

Input：

```json
{
  "items": [
    {
      "food_id": "food:tw:barcode:4710000000001",
      "quantity": 1,
      "unit": "serving"
    },
    {
      "food_id": "food:tw:generic:cooked-rice",
      "quantity": 150,
      "unit": "g"
    }
  ]
}
```

Rules：

- 僅使用 stable 且 `calculation_allowed: true` 的資料。
- 缺值不可補 0。
- 不可在無依據時將 ml 轉 g。
- 必須回傳每個 item 的 calculation basis。
- 不提供「健康／不健康」判定。

### 11.4 `compare_foods`

- 只有資料可轉換至相同基準時才比較。
- 無法比較時回傳具體原因。
- 不自動宣稱哪個更健康。

### 11.5 `get_dataset_status`

Output：

```json
{
  "dataset_version": "2026-07-31T02:15:00Z",
  "source_commit": "abcdef1",
  "stable_documents": 100,
  "stale_documents": 2,
  "last_deployment": "2026-07-31T02:16:10Z"
}
```

### 11.6 `create_draft`

唯一公開寫入工具，必須 authentication。

Input fields：

- `action`
- `food`
- `serving`
- `nutrition`
- `ingredients`
- `allergens`
- `evidence`
- `submitter_note`

Output：

```json
{
  "draft_id": "draft_01J...",
  "status": "pull_request_opened",
  "detected_action": "new_revision",
  "duplicate_candidates": [],
  "pull_request_url": "https://github.com/.../pull/123",
  "warnings": [],
  "next_step": "human_review"
}
```

禁止行為：

- 直接寫 main
- 直接設定 stable
- 自行加入 `human:*` verification
- 因 URL 可連線就判定內容正確
- 接受可執行 HTML / JavaScript
- 接受私人健康資料

---

## 12. Deterministic Search

MVP 不使用 embedding。

### 12.1 Search Index Fields

```ts
interface SearchDocument {
  id: string;
  title: string;
  normalized_title: string;
  brand?: string;
  barcode?: string;
  aliases: string[];
  tags: string[];
  ingredients: string[];
  allergens: string[];
  tokens: string[];
  confidence: "high" | "medium" | "low";
  trust_tier: "unverified" | "machine-confirmed" | "human-reviewed";
  stale: boolean;
  runtime_key: string;
}
```

### 12.2 Chinese Normalization

Build-time 產生：

- 英文小寫
- 全形／半形正規化
- 空白與標點正規化
- `Intl.Segmenter("zh-TW")`
- 中文 2-gram
- 品牌別名
- 容量正規化，如 `400 ml`、`400ml`
- barcode token

### 12.3 Ranking

| Match | Score |
|---|---:|
| Exact barcode | 100 |
| Exact food ID | 100 |
| Exact title | 50 |
| Brand + title | 40 |
| Alias | 12 |
| Title token | 8 |
| Brand | 7 |
| Tag | 5 |
| Ingredient / allergen | 2 |
| Body content | 1 |

Modifiers：

```text
human-reviewed × 1.20
machine-confirmed × 1.05
stale × 0.70
```

---

## 13. GitHub CI/CD and Runtime Publishing

### 13.1 Pull Request Validation

每個 PR 執行：

```text
YAML parse
→ OKF project schema
→ required fields
→ duplicate ID / barcode
→ nutrition numeric validation
→ serving validation
→ source URL policy
→ markdown sanitization
→ index build dry-run
```

失敗則禁止 merge。

### 13.2 Main Deployment

```text
main push
→ validate all stable OKF
→ build runtime documents
→ build search index
→ generate manifest
→ upload versioned dataset
→ verify counts and checksums
→ atomically update dataset:current
```

### 13.3 Versioned KV Layout

```text
dataset:current → <version>
manifest:<version>
doc:<version>:<food-id>
index:<version>:000
stats:<version>
```

`dataset:current` 必須最後才更新，避免 runtime 讀到部分部署。

### 13.4 R2 Usage

R2 僅用於：

- 大型 source snapshots
- 圖片 evidence
- 完整 dataset archive

搜尋 index 與常用 runtime documents 優先放 KV。

### 13.5 Rollback

Rollback 只需將 `dataset:current` 指向上一個完整版本。所有 runtime response 應回傳 dataset version，以利除錯。

---

## 14. Cloudflare Worker

### 14.1 Endpoints

```text
POST /mcp
GET  /mcp
GET  /health
GET  /dataset
```

### 14.2 Runtime Principles

- MCP query 不直接呼叫 GitHub。
- Worker 不依賴持久本機 filesystem。
- 搜尋與計算均 deterministic。
- manifest 與 index 可在 isolate memory 短暫快取。
- 寫入功能與讀取功能必須分權。

### 14.3 Authentication

Public read：

- 無登入
- 全域 rate limit
- 限制 query size 與 limit

`create_draft`：

- GitHub OAuth、Cloudflare Access 或 MCP OAuth
- 使用者識別
- 更嚴格 rate limit
- Turnstile 可供 Web UI 投稿使用

---

## 15. Public Web Product

MCP 是 infrastructure，不是唯一產品入口。

### 15.1 Search Page

使用者可輸入：

- 品名
- 品牌
- 條碼
- 關鍵字

### 15.2 Food Detail Page

必須顯示：

- 品牌、名稱、容量、條碼
- serving 與 nutrition basis
- 每份與可換算的每 100 g / 100 ml
- ingredients 與 allergens
- official / community / estimate 標記
- trust tier
- last verified 與 stale 狀態
- sources
- report correction 按鈕

### 15.3 Trust Labels

```text
✅ 官方來源／人工驗證
🟡 第三方或有限驗證
⚠️ 資料可能過期
🧪 估算資料
```

不得只以顏色表達狀態。

### 15.4 Submission Page

```text
barcode lookup
→ existing candidate check
→ create or correct
→ structured nutrition form
→ evidence
→ Draft preview
→ submit
→ PR status
```

MVP 不要求 server-side OCR；OCR 結果若由外部 AI 產生，仍必須由使用者確認後才能提交。

---

## 16. Security, Privacy, and Safety

### 16.1 Data Not Collected

- 體重、身高
- 疾病、用藥
- 飲食日誌
- 地址、電話、身分證
- 精確位置

### 16.2 Input Security

`create_draft` 必須防止：

- Spam 與重複提交
- XSS、HTML / Markdown injection
- YAML injection
- GitHub mention spam
- SSRF
- 惡意 URL
- 品牌誹謗或無證據安全指控
- 個資與私人健康資料上傳

Controls：

```text
authentication
rate limiting
Turnstile
JSON Schema validation
content length limits
URL allow/deny policy
private IP blocking
sanitization
duplicate hash
human review
audit log
```

### 16.3 Allergen Safety

- 不推測未標示過敏原。
- 不保證無交叉污染。
- stale allergen data 必須強警告。
- estimated data 不可產生肯定式安全結論。

### 16.4 Health Disclaimer

> 本服務提供食品標示與公開資料整理，不構成醫療、營養治療或疾病管理建議。產品配方與標示可能變動；過敏或特殊飲食需求請以最新實體包裝、品牌資訊與專業人員意見為準。

---

## 17. Observability

記錄：

- MCP tool name
- request ID
- status 與 duration
- dataset version
- search result count
- validation error type
- draft / PR creation status
- GitHub 與 Cloudflare error

不得記錄：

- authentication token
- evidence 的敏感內容
- 未遮蔽個資
- 完整私人輸入

Core metrics：

```text
search_requests_total
search_zero_result_rate
get_food_requests_total
calculation_requests_total
drafts_created_total
drafts_merged_total
draft_rejection_rate
stale_document_count
deployment_success_rate
mcp_error_rate
p95_latency
```

---

## 18. Testing

### 18.1 Unit Tests

- barcode validation
- title normalization
- Chinese tokenization
- serving conversion
- per-100 conversion
- missing nutrients
- allergen status
- search ranking
- stale detection
- trust tier
- draft sanitization

### 18.2 Schema Tests

- missing required fields
- invalid lifecycle
- negative values
- zero serving
- duplicated barcode
- stable without source
- stable without verifier
- draft pretending to be human-reviewed
- malformed allergen declaration

### 18.3 Integration Tests

```text
OKF files
→ validate
→ build index
→ publish versioned runtime data
→ Worker search
→ MCP response
```

### 18.4 End-to-End Tests

- 中文關鍵字搜尋命中正確食品。
- barcode 精確命中。
- meal calculation deterministic。
- `create_draft` 建立 PR 而非寫 main。
- Draft 不出現在公開搜尋。
- PR merge 後 dataset version 更新。
- deployment failure 不更新 current pointer。
- rollback 後 query 使用前一版 dataset。

---

## 19. Implementation Phases

### Phase 0 — Repository Foundation

- schemas
- OKF template
- 10 sample foods
- validator
- deterministic index builder
- basic CI

Exit criteria：`validate` 與 `build:index` 全部成功。

### Phase 1 — Read-only MCP

- `search_food`
- `get_food`
- `calculate_nutrition`
- `compare_foods`
- `get_dataset_status`

Exit criteria：MCP Inspector 可完整呼叫，barcode 與中文搜尋正常。

### Phase 2 — Cloudflare Runtime

- Worker
- KV versioned dataset
- `/mcp`、`/health`、`/dataset`
- GitHub Actions sync
- rollback

Exit criteria：runtime 不需 GitHub fetch，所有 query 只讀 Cloudflare。

### Phase 3 — Submission Pipeline

- authenticated `create_draft`
- normalization
- duplicate detection
- stable comparison
- PR creation
- validation checks

Exit criteria：任何投稿都不直接改 main，且 PR 有完整 diff 與 evidence。

### Phase 4 — Public Web

- search UI
- food detail
- calculator
- contribution form
- trust labels

Exit criteria：一般民眾不需要 AI 平台也可使用。

### Phase 5 — Public Release

- privacy / data policy
- contribution guide
- MCP client setup
- public endpoint
- registry metadata
- initial 100 stable documents

---

## 20. MVP Acceptance Criteria

### Dataset

- 至少 100 份 stable documents。
- 至少 50 份台灣包裝食品。
- 至少 20 份 generic foods。
- 至少 10 份官方連鎖餐飲品項。
- 100% stable documents 有 source 與 verified。
- 100% nutrition values 有 basis。

### MCP

- `/mcp` 可公開連線。
- 5 個 read tools 正常。
- `create_draft` 需要 authentication。
- search P95 小於 1 秒。
- exact barcode hit rate 100%。
- Draft 永不進預設搜尋。

### Pipeline

- main push 自動 build 與 publish。
- runtime dataset 包含 source commit。
- failed deployment 不更新 current pointer。
- 可快速切回上一完整版本。

### Security

- 所有 input 通過 schema validation。
- Worker 禁止 private-network fetch。
- secrets 不進 log。
- Markdown / YAML user content 已 sanitization。

---

## 21. Major Risks and Mitigation

### Cold-start dataset problem

Mitigation：先人工建立 100 筆高頻台灣食品，優先超商、豆漿、乳品、雞胸、飯糰與包裝便當；提供 Web UI 而非只提供 MCP。

### Stale product data

Mitigation：`stale_after`、revision、scheduled review、report outdated 與醒目 warning。

### Unreliable community submissions

Mitigation：Draft isolation、source levels、human review、Git history 與 PR audit trail。

### Low MCP adoption

Mitigation：同時提供 public Web、簡單 JSON API 與未來 LINE Bot；MCP 是共用 infrastructure，不是唯一入口。

### Nutrition values being misused

Mitigation：缺值不補 0、estimated 清楚標示、避免健康結論、過敏原保守敘述。

### Licensing ambiguity

Mitigation：每筆 source 記錄授權與可再利用範圍；無法確認授權時只保存必要 metadata、引用與轉換後 facts，不鏡像受限制內容。

---

## 22. Future Extensions

### v0.2

- Evidence image upload
- OCR-assisted draft form
- Open Food Facts adapter
- Government dataset adapter
- barcode scanner
- LINE Bot

### v0.3

- Taiwan external meal data
- real serving-weight community observations
- brand ownership claim
- reviewer consensus

### v0.4

- recall and discontinuation
- formulation change notifications
- allergen change notifications
- package-size change history
- public analytics dashboard

### v1.0 Generic Framework

抽象成可套用其他領域的 Open Knowledge Contribution Framework：

```text
search
get
create_draft
validate
compare
review
publish
version
deprecate
```

可擴充至：無障礙設施、回收分類、維修知識、公共設施與其他社會知識領域。

---

## 23. Product Positioning

> TWFoodMCP 是由社群共同維護、可驗證、可追溯，並能讓任何 AI Agent 使用的台灣食品營養、成分與過敏原開放知識層。

MVP 的成功不是宣稱資料量最大，而是每一筆回答都能明確說明：

- 是哪一個產品與版本
- 以什麼份量為基準
- 資料從哪裡來
- 何時驗證
- 是否過期
- 哪些內容未知或不可推論
