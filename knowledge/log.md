# Knowledge Bundle Update Log

## 2026-10-26 — Taiwan food composition database

* **Import**: Added 2,213 generic-food concepts under a new `knowledge/generic-foods/` bundle from the Taiwan FDA Food Composition Database (台灣地區食品營養成分資料庫) snapshot `imports/20_2.csv` — one concept per 整合編號 (2,116 樣品基本資料 + 97 樣品平均值), grouped into 18 food-category directories. This matches the `knowledge/generic-foods/` layout anticipated by `docs/MVP_SPEC.md` §6.
* **Identity**: New `food:tw:generic:<code>` ids (`kind: generic_food`), distinct from the `food:tw:menu:*` namespaces.
* **Nutrition**: Values are captured verbatim on the explicit `per_100g` basis. Only the canonical schema fields (`energy_kcal`, `protein_g`, `fat_g`, `saturated_fat_g`, `trans_fat_g`, `carbohydrate_g`, `sugar_g`, `dietary_fiber_g`, `sodium_mg`) are structured; the complete per-100 g analysis (amino acids, fatty acids, vitamins, minerals) is preserved in each concept body. Source `trans fat` is reported in mg and converted to g (exact same-dimension conversion).
* **Trust**: Government deterministic import → `source_class: primary_government`, `data_quality: government_database`, `confidence: medium`, and a single `process:tfnd-composition-importer` verification (machine-confirmed). Every concept is an explicit `status: draft`; `quality.calculation_allowed` is `false` per policy §5.4. Missing analysis items remain unknown (never 0); explicit source 0 values are preserved. `stale_after` uses the 24-month government-generic-food default.
* **Tooling**: Added `scripts/import-tfnd-composition-okf.mjs` (`npm run import:tfnd`), an additive, idempotent pass that pivots the long-format CSV into concepts and regenerates the category and root indexes; audit report at `reports/tfnd-composition-import-2026-10-26.json`.
* **Validation**: `npm run validate:data` parses 13,175 documents (7 stable, 13,168 draft); `npm run check:links` resolves 12,267 internal links with zero broken.

## 2026-10-25 — CSV convergence

* **Import**: Converged the bundle with the current `TWFood 台灣超商營養資料庫（持續更新） - Nutrition Data.csv` export. Added 506 new nutrition-observation drafts (`NUT-01216`–`NUT-01721`); the 1,214 rows already present were left untouched, so the archive now holds one concept per CSV row (1,720 total). New concepts land under `knowledge/menu-items/google-sheet-deprecated/<brand>/` using the same brand grouping as the 2026-08 import.
* **Organization**: Composite brand strings (`7-ELEVEN i預購／…`, `7-ELEVEN／…`, `全家 FamilyMart／…`, `萊爾富 Hi-Life／…`, `OKmart／…`) fold into their parent brand directory; no new top-level directory was needed.
* **Trust**: Every added row stays an explicit `status: draft` with `quality.calculation_allowed: false`, no `verified` events, the CSV `verification_status` preserved only under `extraction.verification_status_as_reported`, and missing nutrient cells left unknown. Rows are never replaced once present.
* **Linking**: New rows were compared against the pre-existing official concepts: 1 corroborated and 5 conflicting observations link to the canonical concept for review, and 6 matched identity only. No draft overwrites a canonical record.
* **Tooling**: Added `scripts/import-google-sheet-csv-okf.mjs` (`npm run import:google-sheet-csv`), an idempotent, non-destructive pass that adds only missing `food:tw:menu:google-sheet:<record_id>` concepts and refreshes the affected brand indexes and the archive index; audit report at `reports/google-sheet-csv-import-2026-10-25.json`.
* **Validation**: `npm run validate:data` parses 10,962 documents (7 stable, 10,955 draft); `npm run check:links` resolves 10,036 internal links with zero broken; the full test suite passes (52/52).

## 2026-10-25

* **Naming**: Renamed 6,503 concept files whose filenames carried no real-world meaning (hash-only stems such as `---2097cdc89fb4.md`, or hash suffixes such as `50嵐_8冰綠--12ec84073395.md`) to meaningful names derived from their frontmatter `title`. Colliding names are disambiguated with real-world qualifiers (serving basis like `中杯全糖`, source record ids like `NUT-00944`, official API slugs), with a stable id-hash only as the last resort. Every `food.id`, and all frontmatter content, is unchanged.
* **Organization**: Dissolved the 13 arbitrary record-range buckets in `google-sheet-deprecated/` (`00000-00099` … `01200-01299`) into per-brand directories, and renamed 35 meaningless `dailydietitian-deprecated/` directories (hash-named `item-*` and garbled article-title directories) to meaningful brand or article slugs (for example `item-676f2c5a5d6a` → `chingshin-fuquan`, `50` → `50lagu`). 3,029 files were moved in total (3,019 in the brand reorganization, 10 Sukiya drafts to their own directory); 13 superseded bucket index files were removed.
* **Linking**: Rewrote or repaired 3,626 internal Markdown links — 3,440 rewritten for the renames and moves, 181 pre-existing broken links repaired by resolving targets through the food.id index and product-name matching, plus the follow-up polish renames above. `scripts/check-okf-links.mjs` now validates 9,524 internal links with zero broken.
* **Indexing**: Generated index files for the 53 directories that lacked one (OKF progressive disclosure), refreshed the two archive indexes and 36 archive sub-index headers; every directory in the bundle now has an `index.md`.
* **Identity**: Moved 10 DailyDietitian Sukiya drafts that an earlier import mis-slotted under `mwd/` into a new `menu-items/sukiya/` brand directory. `food.id` values are preserved, so dataset keys and traceability are unaffected.
* **Validation**: `scripts/validate-okf.mjs` parses 10,456 OKF documents (7 stable, 10,449 draft); the full test suite passes (52/52). A full audit trail is in `reports/okf-filename-normalization-2026-10-25.json`, and the reusable pass lives in `scripts/normalize-okf-filenames.mjs` (idempotent on re-run).

## 2026-08-22

* **Import**: Added 1,214 traceable nutrition observation drafts from the TWFood Google Sheet and preserved all four source tabs in a reproducible snapshot.
* **Linking**: Linked 66 corroborating observations and 17 conflicting observations to their existing official OKF concepts without overwriting either source.
* **Validation**: Validated all 6,505 food documents and 6,686 internal Markdown links; missing nutrient values remain unknown and every imported observation remains non-calculable draft data.
* **Conformance**: Re-read the canonical Open Knowledge Format `README.md` and `SPEC.md`; the official version remains 0.2 and the canonical repository is now `GoogleCloudPlatform/open-knowledge-format`.

## 2026-08-05

* **Import**: Added 113 Starbucks Taiwan official food nutrition drafts and 311 drink size/variant drafts from 202 official product pages.
* **Validation**: Pinned all four official food-table images by SHA-256 and retained skipped drink pages without nutrition fields in an audit manifest.
* **Conformance**: Rechecked the latest official OKF `README.md` and `SPEC.md`; version remains 0.2.

## 2026-08-02

* **Update**: Normalized all food concepts to the Open Knowledge Format v0.2 actor, provenance, lifecycle, and citation conventions.
* **Creation**: Added progressive-disclosure index files and declared `okf_version: "0.2"` at the bundle root.

## 2026-08-02 — FamilyMart hierarchy

* **Reorganization**: Moved FamilyMart Fami!ce concepts from the generic `menu-items/` level into `menu-items/familymart/softcream/` and added progressive-disclosure indexes for the brand and category.
* **Identity**: Preserved every `food.id`; only the OKF concept paths changed.
