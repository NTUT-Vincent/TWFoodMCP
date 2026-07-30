# TWFoodMCP

> 台灣食品營養、成分與過敏原的開放知識 MCP。

TWFoodMCP 將台灣包裝食品、官方連鎖餐飲品項與一般食品資料整理成可版本化、可追溯、可供 AI Agent 使用的 OKF 文件，並預計透過 Cloudflare Remote MCP 對外提供查詢、營養計算與投稿能力。

## Why

一般 AI 雖能搜尋食品資訊，但常遇到產品版本混淆、每份與每 100 g 基準不一致、估算值來源不明、過敏原資訊過期，以及缺值被誤當成 0 等問題。

TWFoodMCP 的目標是讓每一筆資料都能回答：

- 這是哪一個精確產品與版本？
- 數值的 serving basis 是什麼？
- 資料來自包裝、品牌、政府、第三方還是估算？
- 何時被驗證，現在是否可能過期？
- 哪些欄位未知，不能進一步推論？

## Architecture

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
 validation → comparison → review → commit │
           │                                │
           ▼                                │
      GitHub main                           │
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

## MVP Principles

- GitHub OKF 是 source of truth。
- Cloudflare KV / R2 是 runtime storage，不是正式資料來源。
- MCP runtime 不直接抓 GitHub。
- MVP 使用 deterministic keyword search，不使用 embedding。
- Runtime 與 pipeline 不依賴付費 LLM API。
- 公開寫入只提供 `create_draft`。
- Draft 建立後固定進入 validation、comparison、review、commit pipeline。
- Draft 不進正式搜尋，也不參與營養計算。
- 只有真人 reviewer 能標記 human-reviewed。
- MCP 是基礎設施；一般使用者仍會有 Web UI。

## Planned MCP Tools

### Read

- `search_food`
- `get_food`
- `calculate_nutrition`
- `compare_foods`
- `get_dataset_status`

### Write

- `create_draft`

下游驗證、比對、審核與發布步驟屬於固定內部 workflow，不各自暴露為公共 MCP tool。

## Specification

完整產品與技術規格：

- [MVP Technical Specification](docs/MVP_SPEC.md)

## Current Status

目前處於 specification / repository foundation 階段。下一步將依序建立：

1. Food OKF schema 與範例資料。
2. Validator 與 deterministic index builder。
3. Read-only Remote MCP。
4. Cloudflare KV versioned deployment。
5. `create_draft` 與 GitHub PR review pipeline。
6. Public Web UI。

## Safety Boundary

本專案提供食品標示與公開資料整理，不構成醫療、營養治療或疾病管理建議。產品配方與標示可能變動；過敏或特殊飲食需求請以最新實體包裝、品牌資訊與專業人員意見為準。
