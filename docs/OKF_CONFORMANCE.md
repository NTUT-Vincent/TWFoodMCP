# TWFoodMCP OKF v0.2 Conformance Profile

Checked against the official Open Knowledge Format `README.md` and `SPEC.md` on 2026-08-02. The official specification version was **0.2**.

## Bundle boundary

The OKF knowledge bundle is the `knowledge/` directory. Every non-reserved Markdown file below it is a concept document. `index.md` and `log.md` are reserved navigation and history files and are not parsed as concepts. The bundle-root `knowledge/index.md` declares `okf_version: "0.2"`.

## Official core and domain profile

Official OKF requires only a non-empty `type` for a concept. TWFoodMCP intentionally applies a stricter producer profile for publishable food records: title, lifecycle status, provenance, generation metadata, food identity, quality, and other nutrition-domain fields are required by the repository validator. These extra fields are OKF extensions and do not replace or redefine the official keys.

## Identity, provenance, and trust

- Agent/tool actors use `<producer>/<version>`; human reviewers use `human:<id>`; automated verification processes use `process:<id>`.
- Each source contains a followable `resource`. A source `id` is used as the Markdown footnote label for claim attribution.
- `verified` may be a list or one bare mapping; consumers normalize both forms to a list.
- Trust tiers are derived from `verified`; `trust_tier` is never authored in source documents.

## Lifecycle and freshness

- TWFoodMCP authors explicit `draft`, `stable`, or `deprecated` status even though official OKF defaults an absent status to `stable`.
- `stale_after` is an absolute `YYYY-MM-DD` date. For this Taiwan dataset, runtime staleness is evaluated using the Asia/Taipei calendar date and becomes true when `today >= stale_after`.
- Only public, stable, human-reviewed records are published to the stable dataset. Drafts remain preview-only and cannot participate in nutrition calculations.

## Maintenance rule

Before any future OKF format change, re-read the latest official [OKF README](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/README.md) and [OKF specification](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md). If the official version changes, update this profile, `knowledge/index.md`, formatter, validator, tests, and existing concepts together.
