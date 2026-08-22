# Knowledge Bundle Update Log

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
