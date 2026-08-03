# 路易莎官方營養資料擷取

此工具直接讀取路易莎官方「營養標示資訊」頁面，下載其中 `/upload/allergenImg/` 的官方營養標示圖片，計算 SHA-256，並在本機使用 Tesseract 產生可人工校對的純文字與 TSV 座標資料。

## 執行方式

```bash
python -m pip install -r scripts/louisa/requirements.txt
# 系統需安裝 tesseract，並提供 chi_tra 與 eng 語言資料
python scripts/louisa/scrape_louisa_nutrition.py \
  --output data/sources/louisa
```

不使用 GitHub Actions，也不需要 LLM API。輸出包含：

- `images/*.jpg`：官方原始營養標示圖片
- `ocr/*.txt`：OCR 原始文字
- `ocr/*.tsv`：含座標與信心分數的 OCR token
- `manifest.json`：來源網址、抓取時間、檔案雜湊與審核狀態

## 資料品質邊界

路易莎官方資料以圖片表格發布，飲品與餐點的欄位及版面並不一致。OCR 結果只能作為 draft ingestion 的輸入，不得直接標記為 stable 或 human-reviewed。轉成 OKF 前仍須以原圖逐列校對品名、份量、冰熱、尺寸、熱量、糖、咖啡因及各項營養素。
