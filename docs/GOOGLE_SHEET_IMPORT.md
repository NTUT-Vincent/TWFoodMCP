# TWFood Google Sheet Import

This import uses the authenticated Google Sheet `TWFood 台灣超商營養資料庫（持續更新）` as a source snapshot and converts every populated row in `Nutrition Data` into one OKF v0.2 food observation.

## Reproducible inputs

- Spreadsheet ID: `16f4_7C9pBo0d9XDhXyRmqIh-MRhSwnGWAT122H9mONY`
- Snapshot: `references/source-snapshots/google-sheet-2026-08-22.json`
- Importer: `scripts/import-google-sheet-okf.mjs`
- Report: `reports/google-sheet-import-2026-08-22.json`

The snapshot includes all four tabs: `Nutrition Data`, `Sources`, `README`, and `Search Runs`. Auxiliary tabs stay losslessly preserved in the snapshot; the 1,214 nutrition rows become OKF concepts.

## Safety and trust rules

- Imported concepts are always explicit `status: draft`.
- Spreadsheet verification labels are preserved under `extraction.verification_status_as_reported`; they never create OKF `verified` events.
- Missing nutrient cells stay absent and are never filled with zero.
- Per-100 g/ml bases are recognized only when the source text says so. Other rows retain the original serving description without weight or density conversion.
- `quality.calculation_allowed` is always `false` until authorized human review.
- Exact official matches and conflicts link to the existing OKF concept for review; observations do not silently overwrite canonical records.

## Run

```bash
npm run import:google-sheet
npm run format:okf
npm run validate:data
npm test
```
