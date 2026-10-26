# Taiwan Food Composition Database (TFND) Import

This import converts the Taiwan FDA Food Composition Database
(台灣地區食品營養成分資料庫, published by 衛生福利部食品藥物管理署) into OKF v0.2
generic-food drafts under `knowledge/generic-foods/`.

## Reproducible inputs

- Source snapshot: `imports/20_2.csv`
- Official dataset landing page: https://data.gov.tw/dataset/8543
- FDA query site: https://consumer.fda.gov.tw/Food/TFND.aspx?nodeID=178
- Importer: `scripts/import-tfnd-composition-okf.mjs`
- Report: `reports/tfnd-composition-import-2026-10-26.json`

The CSV is long-format: one row per `(整合編號, 分析項)` with the per-100 g value
in `每100克含量`. The importer pivots those rows into one concept per `整合編號`.

## Concept shape

- `type: Food Product`, `food.kind: generic_food`, `food.id: food:tw:generic:<code>`.
- One nutrition record on the explicit `per_100g` basis.
- Only the canonical schema fields are structured:
  `energy_kcal`, `protein_g`, `fat_g`, `saturated_fat_g`, `trans_fat_g`,
  `carbohydrate_g`, `sugar_g`, `dietary_fiber_g`, `sodium_mg`.
- The complete per-100 g analysis (moisture, ash, cholesterol, sugars, amino
  acids, fatty acids, vitamins, minerals, …) is preserved in the concept body's
  `# Composition (per 100 g)` table for traceability and search.
- Concepts are grouped into `knowledge/generic-foods/<category>/` by `食品分類`.

## Safety and trust rules

- Government deterministic import: `source_class: primary_government`,
  `data_quality: government_database`, `confidence: medium`.
- Machine confirmation only: a single `verified` entry by
  `process:tfnd-composition-importer`. No `human:*` actor is ever written.
- Every concept is an explicit `status: draft`; nothing is promoted to stable.
- `quality.calculation_allowed` is `false` because the record is a draft
  (policy §5.4).
- Missing analysis items stay absent and are never filled with zero; explicit
  source `0` values are preserved as `0`.
- `trans fat` is reported in mg by the source and converted to g (an exact
  same-dimension conversion); no ml↔g conversion is performed.
- `stale_after` uses the 24-month default for government generic foods
  (`docs/MVP_SPEC.md` §8.5).
- `樣品平均值` records are retained and tagged; they represent within-sample
  averages and are noted in `limitations`.

## Run

```bash
npm run import:tfnd
npm run validate:data
npm run check:links
npm test
```

The pass is additive and idempotent: concepts whose `food:tw:generic:<code>` id
already exists are skipped, so re-running it is a no-op.
