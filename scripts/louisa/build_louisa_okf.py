#!/usr/bin/env python3
"""Convert reviewed Louisa OCR candidates into TWFoodMCP OKF v0.2 drafts.

This script runs locally. It does not invoke GitHub Actions or external LLM APIs.
Only explicitly curated rows are emitted because OCR from the official image tables
is not reliable enough for automatic publication.
"""
from __future__ import annotations

import argparse
import hashlib
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

import yaml

OFFICIAL_PAGE = "https://www.louisacoffee.co/allergenImg?CatlogID=2"
OFFICIAL_IMAGE = "https://www.louisacoffee.co/upload/allergenImg/20250811_033319.jpg"
SOURCE_DATE = "2025-08"

@dataclass(frozen=True)
class Candidate:
    slug: str
    name: str
    raw_line: str
    energy_kcal: float
    protein_g: float
    fat_g: float
    saturated_fat_g: float
    trans_fat_g: float
    carbohydrate_g: float
    sugar_g: float
    sodium_mg: float
    notes: tuple[str, ...] = ()

CANDIDATES: tuple[Candidate, ...] = (
    Candidate(
        slug="cai-duo-hao-xian-xi-taigeng-rice",
        name="菜多好纖細－台梗米",
        raw_line="菜多好纖細-台梗米        418.2     13.8     44        1.3           0           80.8        4         917.3",
        energy_kcal=418.2, protein_g=13.8, fat_g=4.4, saturated_fat_g=1.3,
        trans_fat_g=0.0, carbohydrate_g=80.8, sugar_g=4.0, sodium_mg=917.3,
        notes=("OCR rendered total fat as `44`; interpreted as `4.4` from column formatting. Human verification is still required.",),
    ),
    Candidate(
        slug="cai-duo-hao-xian-xi-multigrain-rice",
        name="菜多好纖細－多穀米",
        raw_line="菜多好纖細-多穀米        508.4      12      5.8        0.9           0           102.1        4         916.9",
        energy_kcal=508.4, protein_g=12.0, fat_g=5.8, saturated_fat_g=0.9,
        trans_fat_g=0.0, carbohydrate_g=102.1, sugar_g=4.0, sodium_mg=916.9,
    ),
    Candidate(
        slug="italian-meat-sauce-lasagna",
        name="義式肉醬千層麵",
        raw_line="義式肉醬千層麵           481.7     24.4    22.8       14.1          0.3          449       11.2       1195.8",
        energy_kcal=481.7, protein_g=24.4, fat_g=22.8, saturated_fat_g=14.1,
        trans_fat_g=0.3, carbohydrate_g=44.9, sugar_g=11.2, sodium_mg=1195.8,
        notes=("OCR rendered carbohydrate as `449`; interpreted as `44.9` from column formatting. Human verification is still required.",),
    ),
)

def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

def food_id(slug: str) -> str:
    return f"louisa-menu-{slug}-2025-08"

def render(candidate: Candidate, generated_at: str) -> str:
    frontmatter = {
        "type": "Food Menu Item",
        "title": f"路易莎 {candidate.name}",
        "description": "路易莎官方營養標示圖片經本地 OCR 與保守欄位整理產生的待人工審核草稿。",
        "resource": OFFICIAL_IMAGE,
        "tags": ["louisa", "路易莎", "menu-item", "light-meal", "nutrition", "ocr-draft"],
        "status": "draft",
        "stale_after": "2026-08-01",
        "generated": {"by": "louisa-okf-importer/1.0.0", "at": generated_at},
        "sources": [
            {
                "id": "louisa-official-nutrition-2025-08",
                "resource": OFFICIAL_IMAGE,
                "title": "路易莎 2025.08 官方輕食類營養標示彙整表",
                "author": "process:louisa-official-site",
                "last_modified": "2025-08-11",
                "source_class": "primary_official",
            },
            {
                "id": "louisa-official-nutrition-page",
                "resource": OFFICIAL_PAGE,
                "title": "路易莎官方營養與過敏原資訊頁",
                "author": "process:louisa-official-site",
                "source_class": "primary_official",
            },
        ],
        "food": {
            "id": food_id(candidate.slug),
            "kind": "menu_item",
            "market": "TW",
            "brand": "路易莎咖啡 Louisa Coffee",
            "name": candidate.name,
            "aliases": [candidate.name.replace("－", "-")],
            "variant": "2025.08 官方營養標示版本",
        },
        "serving": {"amount": 1, "unit": "serving", "description": "每一份；官方圖片未在該列提供重量"},
        "nutrition": [{
            "basis": "per_serving",
            "values": {
                "energy_kcal": candidate.energy_kcal,
                "protein_g": candidate.protein_g,
                "fat_g": candidate.fat_g,
                "saturated_fat_g": candidate.saturated_fat_g,
                "trans_fat_g": candidate.trans_fat_g,
                "carbohydrate_g": candidate.carbohydrate_g,
                "sugar_g": candidate.sugar_g,
                "sodium_mg": candidate.sodium_mg,
            },
        }],
        "quality": {
            "data_quality": "official_brand",
            "completeness": "nutrition_complete",
            "confidence": "low",
            "calculation_allowed": False,
        },
        "access": {"classification": "public"},
        "revision": {"source_version": SOURCE_DATE, "review_status": "ocr_requires_human_review"},
    }
    yaml_text = yaml.safe_dump(frontmatter, allow_unicode=True, sort_keys=False, width=1000).strip()
    notes = "\n".join(f"- {note}" for note in candidate.notes) or "- No automatic correction note beyond OCR transcription."
    body = f"""# Nutrition

The numeric values below were transcribed from the official Louisa image and remain a draft.[^louisa-official-nutrition-2025-08]

| Nutrient | Value per serving |
|---|---:|
| Energy | {candidate.energy_kcal} kcal |
| Protein | {candidate.protein_g} g |
| Total fat | {candidate.fat_g} g |
| Saturated fat | {candidate.saturated_fat_g} g |
| Trans fat | {candidate.trans_fat_g} g |
| Carbohydrate | {candidate.carbohydrate_g} g |
| Sugar | {candidate.sugar_g} g |
| Sodium | {candidate.sodium_mg} mg |

# OCR Evidence

```text
{candidate.raw_line}
```

# Review Notes

{notes}
- `status: draft`, `quality.confidence: low`, and `calculation_allowed: false` are intentional until a human compares the row against the official image.

[^louisa-official-nutrition-2025-08]: 路易莎 2025.08 官方輕食類營養標示彙整表
"""
    return f"---\n{yaml_text}\n---\n\n{body}"

def validate_text(text: str, path: Path) -> None:
    if not text.startswith("---\n"):
        raise ValueError(f"{path}: missing frontmatter")
    _, raw, _ = text.split("---", 2)
    data = yaml.safe_load(raw)
    required = ["type", "title", "status", "generated", "sources", "food", "quality"]
    missing = [key for key in required if not data.get(key)]
    if missing:
        raise ValueError(f"{path}: missing {missing}")
    if data["status"] != "draft":
        raise ValueError(f"{path}: OCR imports must remain draft")
    if data["quality"]["calculation_allowed"] is not False:
        raise ValueError(f"{path}: OCR imports must not be calculation enabled")
    values = data["nutrition"][0]["values"]
    if any(not isinstance(v, (int, float)) or v < 0 for v in values.values()):
        raise ValueError(f"{path}: invalid nutrient value")

def build(out_dir: Path) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    generated_at = now_iso()
    paths = []
    for candidate in CANDIDATES:
        path = out_dir / f"{candidate.slug}.md"
        text = render(candidate, generated_at)
        validate_text(text, path)
        path.write_text(text, encoding="utf-8")
        paths.append(path)
    manifest = out_dir / "louisa-import-manifest.json"
    manifest.write_text(yaml.safe_dump({
        "generated_at": generated_at,
        "records": [{"path": p.name, "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in paths],
    }, sort_keys=False), encoding="utf-8")
    return paths

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, default=Path("knowledge/menu-items/louisa/light-meals"))
    args = parser.parse_args()
    paths = build(args.out)
    print(f"Generated and locally validated {len(paths)} Louisa OKF draft records.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
