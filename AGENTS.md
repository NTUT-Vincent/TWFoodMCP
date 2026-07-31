# TWFoodMCP Agent Instructions

These rules apply to every AI agent, coding assistant, crawler, importer, CI job, and automation working in this repository.

Before changing OKF schemas, ingestion, validation, publishing, search ranking, MCP tools, or runtime data, read:

- `docs/MVP_SPEC.md`
- `docs/TRUST_AND_CLASSIFICATION_POLICY.md`

The trust and classification policy is normative. Do not implement shortcuts that contradict it.

## Non-negotiable rules

1. **Use separate classification axes.** Lifecycle, verification trust, source authority, food data quality, freshness, and access classification are independent.
2. **Require explicit lifecycle status.** Every OKF food document must declare `draft`, `stable`, or `deprecated`.
3. **Never accept authored `trust_tier` as source truth.** Derive runtime trust from `verified`:
   - no verification → `unverified`
   - process/agent verification only → `machine-confirmed`
   - authorized `human:*` verification of the exact revision → `human-reviewed`
4. **Machines cannot impersonate humans.** Crawlers, LLMs, agents, scripts, CI, scheduled jobs, and anonymous contributors must never write `human:*` verification entries.
5. **Human review does not imply completeness.** A human-reviewed document may still be partial, stale, low-confidence, or unsuitable for calculation.
6. **Crawled/imported records begin as drafts.** Official-source crawling increases source authority but does not make data stable or human-reviewed.
7. **Nutritionist/social-media content is expert interpretation.** It cannot independently replace package labels, official nutrition data, or government sources; preserve links and original summaries rather than copying whole posts.
8. **Missing nutrition values remain unknown.** Never convert missing values to zero.
9. **No unsupported unit conversion.** Never convert ml and g without explicit density or official conversion evidence.
10. **Calculation is deterministic and evidence-bound.** `calculation_allowed` applies only to explicitly present values with a clear basis and resolved identity.
11. **Only reviewed stable public records enter the public KV dataset.** Drafts and deprecated records are excluded from the default public index.
12. **GitHub OKF is source of truth.** `trust_tier` and other runtime fields may be materialized in KV only as derived build outputs.
13. **Publish KV atomically by version.** Write versioned documents and manifest first; update `dataset:current` last.
14. **Preserve traceability.** Keep source class, URL or evidence reference, retrieval/verification timestamps, revision, freshness, quality, and limitations.
15. **Do not store private health or identity data in the public dataset.** Metadata labels do not replace real authorization controls.

## Canonical policy fields

- Lifecycle: `status`
- Generation provenance: `generated`
- Verification provenance: `verified`
- Per-source authority: `sources[].source_class`
- Food data quality: `quality.data_quality`, `quality.completeness`, `quality.confidence`, `quality.calculation_allowed`
- Freshness: `stale_after` and derived stale state
- Access: `access.classification`
- Runtime-only derived trust: `trust_tier`

Do not introduce a generic `level`, manually authored trust score, or a new enum without updating the normative policy, migration notes, validators, tests, and runtime build behavior.