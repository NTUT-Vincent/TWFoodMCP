# Starbucks Taiwan Official Nutrition Import

## Scope

The importer reads only official Starbucks Taiwan pages:

- Food nutrition table: <https://www.starbucks.com.tw/products/calories/calories.jspx>
- Drink catalogue: <https://www.starbucks.com.tw/products/drinks.jspx>
- Drink product pages discovered from the official catalogue and category pages

The 2026-08-05 import produced 113 food concepts and 311 drink size/variant concepts. All crawler output remains `draft` and preview-only until a human reviewer confirms the exact OKF revision.

## Food table handling

Starbucks publishes food nutrition as four PNG tables rather than machine-readable HTML. `scripts/starbucks/food-nutrition-2026-07-22.json` contains a structured transcription of the nine official columns:

1. weight
2. energy
3. protein
4. fat
5. saturated fat
6. trans fat
7. carbohydrate
8. sugar
9. sodium

Each source image has a pinned SHA-256. The importer downloads the current official image and aborts before writing any OKF file if a hash differs. A changed image therefore requires explicit re-transcription and review; old row coordinates or values are never silently applied to a new table.

## Drink handling

The importer recursively discovers official drink category pages, de-duplicates product pages by Starbucks product ID, and reads every size tab. It captures only fields explicitly present in the product table:

- `energy_kcal`
- `sugar_g`
- `caffeine_mg`
- `price_twd` as menu metadata, not nutrition

Standard cup labels are mapped to the official capacities stated on Starbucks product pages: Short 236 ml, Tall 354 ml, Grande 473 ml, and Venti 591 ml. Explicit labels such as `460mL` are preserved as stated. Other labels use one `serving`; the importer never invents a weight or volume.

Product pages with no energy, sugar, or caffeine value do not create empty food concepts. Their URLs remain in `knowledge/menu-items/starbucks/raw/import-manifest.json` so coverage is auditable.

## Run

```bash
npm run import:starbucks
npm run validate:data
npm test
```

For a reproducible retrieval timestamp:

```bash
STARBUCKS_RETRIEVED_AT=2026-08-05T15:30:00Z npm run import:starbucks
```

## Trust and calculation policy

- Source authority is `primary_official`.
- Importer generation uses `twfoodmcp-starbucks-importer/1.0.0`.
- Deterministic schema confirmation uses `process:twfoodmcp-schema-validator`; it is not human review.
- Every imported record is `draft`, has `calculation_allowed: false`, and is excluded from stable calculations.
- Missing nutrition, ingredients, and allergens remain unknown rather than zero or inferred.
- A human reviewer must compare the generated revision with the official source before promotion to `stable`.

## OKF conformance

The import follows official OKF v0.2 provenance, actor, lifecycle, and source conventions. Only the bundle-root `knowledge/index.md` carries `okf_version`; Starbucks `index.md` and `log.md` files are reserved navigation/history files without frontmatter.
