# DailyDietitian discovery and official-source verification

This pipeline uses the DailyDietitian calorie-guide category as a **candidate discovery source**. It does not treat a third-party article, a dietitian estimate, or an AI estimate as authoritative nutrition evidence.

Before this implementation was written, the latest official Open Knowledge Format `okf/README.md` and `okf/SPEC.md` were re-read on 2026-08-02. The official version remained **OKF v0.2**.

## Trust boundary

A discovered row can have one of four outcomes:

1. `corroborated_existing`: the item name, serving basis, and published nutrients match an existing official-label, official-brand, or government OKF record. No duplicate OKF document is created.
2. `new_okf_draft`: an allowlisted official brand page contains the normalized item name and every extracted nutrient value. A `status: draft` OKF document is generated with `verified.by: process:official-source-matcher`.
3. `conflict`: an official record has the same identity but materially different nutrition values. The discrepancy is written to a report and no draft is generated.
4. `pending`: no sufficiently strong official corroboration was found, the article declares estimated values, the serving basis is uncertain, or the identity is ambiguous.

The importer never writes `human:*` verification. A human reviewer must open the official source and confirm product version, serving basis, context, and freshness before promotion to stable.

## Copyright and crawl boundary

- The crawler follows `robots.txt` independently for DailyDietitian and each official origin.
- Requests are sequential and delayed by default.
- It does not download or retain images.
- It does not retain complete article prose.
- It retains article metadata and factual table cells needed for identity and nutrition comparison.
- DailyDietitian remains cited as the discovery source; the official page is the nutrition evidence for any generated draft.

## Outputs

```text
references/discovery/dailydietitian/
  index.json
  articles/*.json

reports/dailydietitian/
  summary.json
  existing-official-matches.json
  verified-new-drafts.json
  conflicts.json
  pending-verification.json
  crawl-errors.json

knowledge/menu-items/dailydietitian-verified/
  <brand>/<item>.md
```

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
