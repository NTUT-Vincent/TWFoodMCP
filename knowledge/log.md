# Knowledge Bundle Update Log

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
