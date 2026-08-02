# DailyDietitian source-draft import

This pipeline converts every nutrition row extracted from the DailyDietitian calorie-guide category into an **unverified OKF draft**.

Before this policy was implemented, the latest official Open Knowledge Format `okf/README.md` and `okf/SPEC.md` were re-read on 2026-08-02. The official version remained **OKF v0.2**.

## Draft policy

Every extracted row becomes one OKF concept under:

```text
knowledge/menu-items/dailydietitian/<brand>/<candidate-id>.md
```

The concept uses:

- `status: draft`
- one `sources` entry pointing to the exact DailyDietitian article
- no `verified` field, so the OKF v0.2 trust tier is `unverified`
- `quality.data_quality: third_party_database` for published third-party tables
- `quality.data_quality: estimated` when the article contains an estimation disclosure
- `quality.calculation_allowed: false` for every generated draft
- the extracted table headers and source row in producer-defined frontmatter fields
- a stable source candidate ID in `food.id`

The importer does not claim that DailyDietitian values are official. Official or existing OKF comparisons are retained only as review hints and reports; they do not block draft creation.

## Stable publication boundary

Generated drafts remain excluded from the stable dataset, `calculate_nutrition`, and `compare_foods`.

Promotion to `stable` still requires an authorized `human:*` reviewer to confirm:

- exact product identity and market version
- serving size and nutrition basis
- nutrition values and source context
- freshness and revision information
- whether the record is suitable for calculations

The importer never creates `human:*` verification.

## Copyright and crawl boundary

- The crawler follows DailyDietitian `robots.txt`.
- Requests are sequential and delayed by default.
- It does not download or retain images.
- It does not retain complete article prose.
- It retains article metadata, factual nutrition table cells, and the exact extracted source row needed to reproduce the draft.

## Outputs

```text
references/discovery/dailydietitian/
  index.json
  articles/*.json

reports/dailydietitian/
  summary.json
  generated-drafts.json
  existing-official-matches.json
  conflicts.json
  unmatched-official.json
  crawl-errors.json

knowledge/menu-items/dailydietitian/
  <brand>/<candidate-id>.md
```

The GitHub pull request commits `summary.json` and all generated OKF drafts. Complete discovery records and review reports are also uploaded as a GitHub Actions artifact.

## Run

```bash
npm run import:dailydietitian
npm run format:okf
npm run validate:data
npm test
```

Optional environment variables:

```text
DAILYDIETITIAN_MAX_CATEGORY_PAGES=8
DAILYDIETITIAN_MAX_ARTICLES=0
DAILYDIETITIAN_REQUEST_DELAY_MS=850
DAILYDIETITIAN_RUN_DATE=YYYY-MM-DD
```

`DAILYDIETITIAN_MAX_ARTICLES=0` means all discovered articles.
