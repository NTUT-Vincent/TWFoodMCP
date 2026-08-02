# TWFoodMCP

> 台灣食品營養、成分與過敏原的開放知識 MCP。

TWFoodMCP 將台灣包裝食品、官方連鎖餐飲品項與一般食品資料整理成可版本化、可追溯、可供 AI Agent 使用的 OKF 文件，並透過 Cloudflare Remote MCP 對外提供查詢、營養計算與投稿能力。

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

## MCP Tools

### Read

- `search_food`
- `get_food`
- `calculate_nutrition`
- `compare_foods`
- `get_dataset_status`

### Write

- `create_draft`

下游驗證、比對、審核與發布步驟屬於固定內部 workflow，不各自暴露為公共 MCP tool。

## Dataset Channels

- `stable`：只包含 `stable + public + human-reviewed` 文件，可用於搜尋、查詢、計算與比較。
- `preview`：包含 stable 與尚未人工審核的 public draft，僅供 `search_food`、`get_food` 與 `get_dataset_status` 明確指定 `dataset_channel: "preview"` 時檢視。
- Draft 即使出現在 preview，也不會參與 `calculate_nutrition` 或 `compare_foods`。
- Cloudflare KV 以 `dataset:current` 與 `dataset:preview` 兩個指標切換同一版本的 stable / preview 資料。

## Specification

完整產品與技術規格：

- [MVP Technical Specification](docs/MVP_SPEC.md)
- [OKF v0.2 Conformance Profile](docs/OKF_CONFORMANCE.md)
- [Official Open Knowledge Format v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)

## Current Status

目前已具備：

- OKF frontmatter validator 與 human-review publication gate。
- deterministic keyword search、單筆查詢、營養計算、食品比較與 dataset status MCP tools。
- Cloudflare KV versioned stable / preview dataset 發布。
- 7 筆已人工審核的全家 Fami!ce stable records。
- 99 筆由麥當勞台灣官方 API 轉換的 draft OKF records，可在 preview channel 搜尋與查詢。
- `create_draft` GitHub branch / PR workflow。

麥當勞資料仍需真人逐項或批次審核後，才能加入 stable dataset 與營養計算。

## Safety Boundary

本專案提供食品標示與公開資料整理，不構成醫療、營養治療或疾病管理建議。產品配方與標示可能變動；過敏或特殊飲食需求請以最新實體包裝、品牌資訊與專業人員意見為準。
