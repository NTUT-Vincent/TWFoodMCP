# 麥味登官方營養資料匯入政策

## Scope

本管線只接受下列官方來源：

- `https://www.mwd.com.tw/` 的產品分類與產品詳情頁。
- 由產品詳情頁直接連出的 `https://www.superqin.com.tw/` 官方營養標示圖片。

第三方菜單、部落格、外送平台與搜尋摘要不會成為正式數值來源。

## Extraction

1. 逐一讀取麥味登官方產品分類頁並取得產品名稱、分類、官方詳情頁與產品 `article_id`。
2. 若官方列表標題直接提供單一熱量，保留為每份 `energy_kcal`。
3. 若詳情頁提供官方營養標示圖片，以繁體中文 Tesseract OCR 擷取每份熱量、蛋白質、脂肪與碳水化合物。
4. 完整 OCR 結果必須同時通過：四欄完整、合理範圍、三大營養素推算熱量一致性，以及列表熱量交叉檢查（來源有提供時）。
5. 原始產品頁、標示圖片 URL、OCR 原文、驗證結果與擷取時間保存於 `references/source-snapshots/`。

## Publication boundary

- 自動匯入一律建立 `status: draft` 的 OKF v0.2 concept。
- Draft 可進 D1 preview dataset，不能參與正式營養計算或食品比較。
- 完整 OCR 通過自動檢查，也不等同真人驗證。
- 只有授權真人 reviewer 對照官方來源後，才能標記 human-reviewed 並升為 stable。
- 只有官方列表熱量、沒有完整營養標示的品項，`calculation_allowed` 必須為 `false`，避免把缺值當成 0。

## Serving and limitations

麥味登官網多數品項未提供公克重量，因此只記錄「官方菜單一份」，不得自行換算每 100 公克。官方營養圖亦聲明數值依標準製程估算，實際結果可能因原料大小、配方與門市製作而不同。

## Maintenance

每次修改 OKF 輸出格式前，必須重新閱讀 Google 官方 OKF `README.md` 與 `SPEC.md`。目前管線依據 OKF v0.2，並遵守來源、生成者、生命週期與 freshness frontmatter conventions。
