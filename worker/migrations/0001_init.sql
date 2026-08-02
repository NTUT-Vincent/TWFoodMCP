CREATE TABLE IF NOT EXISTS dataset_meta (
  singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
  dataset_version TEXT NOT NULL,
  source_commit TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  stable_documents INTEGER NOT NULL,
  preview_documents INTEGER NOT NULL,
  draft_documents INTEGER NOT NULL,
  stable_stale_documents INTEGER NOT NULL,
  preview_stale_documents INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS foods (
  dataset_version TEXT NOT NULL,
  id TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  source_path TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'stable', 'deprecated')),
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  brand TEXT,
  brand_norm TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  barcode TEXT,
  search_text TEXT NOT NULL,
  document_json TEXT NOT NULL,
  PRIMARY KEY (dataset_version, id)
);

CREATE INDEX IF NOT EXISTS idx_foods_dataset_status
  ON foods(dataset_version, status);
