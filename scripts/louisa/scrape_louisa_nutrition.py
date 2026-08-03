#!/usr/bin/env python3
"""Archive Louisa Coffee's official nutrition-label images and OCR them locally.

No GitHub Actions or external LLM API is required. OCR output is intentionally kept
as reviewable raw text/TSV because the official source is image-based and table
layouts vary between drinks and foods.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

import cv2
import pytesseract
import requests
from bs4 import BeautifulSoup

PAGE_URL = "https://www.louisacoffee.co/allergenImg?CatlogID=2"
BASE_URL = "https://www.louisacoffee.co/"
HEADERS = {"User-Agent": "TWFoodMCP/1.0 (+nutrition-source-archiver)"}


def discover_image_urls() -> list[str]:
    response = requests.get(PAGE_URL, headers=HEADERS, timeout=30)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    urls: list[str] = []
    for img in soup.select("img"):
        src = img.get("src") or img.get("data-src")
        if not src or "/upload/allergenImg/" not in src:
            continue
        url = urljoin(BASE_URL, src)
        if url not in urls:
            urls.append(url)
    if not urls:
        raise RuntimeError("No official nutrition-label images were discovered")
    return urls


def download(url: str, destination: Path) -> None:
    response = requests.get(url, headers=HEADERS, timeout=60)
    response.raise_for_status()
    destination.write_bytes(response.content)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def preprocess(path: Path):
    image = cv2.imread(str(path))
    if image is None:
        raise ValueError(f"Cannot read image: {path}")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    scale = 2 if max(gray.shape) < 3500 else 1
    if scale > 1:
        gray = cv2.resize(gray, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    return cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]


def ocr_image(path: Path, output_dir: Path) -> dict[str, object]:
    processed = preprocess(path)
    stem = path.stem
    text = pytesseract.image_to_string(processed, lang="chi_tra+eng", config="--psm 6")
    (output_dir / f"{stem}.txt").write_text(text, encoding="utf-8")
    data = pytesseract.image_to_data(
        processed, lang="chi_tra+eng", config="--psm 6", output_type=pytesseract.Output.DICT
    )
    with (output_dir / f"{stem}.tsv").open("w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file, delimiter="\t")
        writer.writerow(["page", "block", "paragraph", "line", "word", "left", "top", "width", "height", "confidence", "text"])
        for index, token in enumerate(data["text"]):
            token = token.strip()
            if not token:
                continue
            writer.writerow([
                data["page_num"][index], data["block_num"][index], data["par_num"][index],
                data["line_num"][index], data["word_num"][index], data["left"][index],
                data["top"][index], data["width"][index], data["height"][index],
                data["conf"][index], token,
            ])
    return {
        "text_file": f"ocr/{stem}.txt",
        "tsv_file": f"ocr/{stem}.tsv",
        "numeric_token_count": len(re.findall(r"(?<!\\w)-?\\d+(?:\\.\\d+)?", text)),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("data/sources/louisa"))
    parser.add_argument("--input-dir", type=Path, help="Use pre-downloaded official images instead of network discovery")
    parser.add_argument("--skip-ocr", action="store_true")
    args = parser.parse_args()
    image_dir, ocr_dir = args.output / "images", args.output / "ocr"
    image_dir.mkdir(parents=True, exist_ok=True)
    ocr_dir.mkdir(parents=True, exist_ok=True)

    if args.input_dir:
        source_items = [(None, path) for path in sorted(args.input_dir.glob("*.jpg"))]
    else:
        source_items = []
        for url in discover_image_urls():
            destination = image_dir / Path(url).name
            download(url, destination)
            source_items.append((url, destination))

    records: list[dict[str, object]] = []
    for url, source_path in source_items:
        destination = image_dir / source_path.name
        if source_path.resolve() != destination.resolve():
            destination.write_bytes(source_path.read_bytes())
        item: dict[str, object] = {
            "file": f"images/{destination.name}",
            "source_url": url or f"https://www.louisacoffee.co/upload/allergenImg/{destination.name}",
            "sha256": sha256(destination),
            "bytes": destination.stat().st_size,
        }
        if not args.skip_ocr:
            item.update(ocr_image(destination, ocr_dir))
        records.append(item)

    manifest = {
        "brand": "路易莎咖啡 LOUISA COFFEE",
        "official_page": PAGE_URL,
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "source_format": "official nutrition-label images",
        "review_status": "raw_ocr_requires_human_review",
        "images": records,
    }
    (args.output / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"images": len(records), "output": str(args.output)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
