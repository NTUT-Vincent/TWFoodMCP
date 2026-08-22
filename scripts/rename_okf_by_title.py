#!/usr/bin/env python3
"""Rename menu-item OKF Markdown files from their frontmatter title.

Example:
    title: 星巴克 Starbucks 馬斯卡邦輕乳蛋糕
becomes:
    星巴克_Starbucks_馬斯卡邦輕乳蛋糕.md

The script also rewrites local Markdown links in index.md files and can validate
that filenames and index links are consistent. It has no third-party deps.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import unicodedata
import uuid
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import unquote

DEFAULT_ROOT = Path("knowledge/menu-items")
EXCLUDED_DIRS = {"raw", "sources", "validation", ".git", ".github", "__pycache__"}
EXCLUDED_FILES = {"index.md", "log.md"}
INVALID_FILENAME_CHARS = re.compile(r'[<>:"/\\|?*\x00-\x1f]')
WHITESPACE = re.compile(r"\s+")
UNDERSCORES = re.compile(r"_+")
MD_LINK = re.compile(r"(?<!!)\[([^\]]*)\]\(([^)]+)\)")


@dataclass(frozen=True)
class Rename:
    old: Path
    new: Path
    title: str


def _frontmatter(text: str) -> str | None:
    if not text.startswith("---\n") and not text.startswith("---\r\n"):
        return None
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "\n".join(lines[1:i])
    return None


def _yaml_scalar(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] == '"':
        try:
            parsed = json.loads(value)
            if isinstance(parsed, str):
                return parsed
        except json.JSONDecodeError:
            pass
    if len(value) >= 2 and value[0] == value[-1] == "'":
        return value[1:-1].replace("''", "'")
    value = re.sub(r"\s+#.*$", "", value).rstrip()
    return value


def read_title(path: Path) -> str | None:
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        raise RuntimeError(f"cannot read {path}: {exc}") from exc
    fm = _frontmatter(text)
    if fm is None:
        return None
    match = re.search(r"(?m)^title:\s*(.*?)\s*$", fm)
    if not match:
        return None
    title = _yaml_scalar(match.group(1)).strip()
    return title or None


def title_to_filename(title: str) -> str:
    name = unicodedata.normalize("NFKC", title).strip()
    name = WHITESPACE.sub("_", name)
    name = INVALID_FILENAME_CHARS.sub("_", name)
    name = UNDERSCORES.sub("_", name).strip(" ._")
    if not name:
        raise ValueError(f"title normalizes to an empty filename: {title!r}")
    filename = f"{name}.md"
    if len(filename.encode("utf-8")) > 255:
        raise ValueError(f"filename exceeds 255 UTF-8 bytes: {filename!r}")
    return filename


def is_candidate(path: Path, root: Path) -> bool:
    if path.suffix.lower() != ".md" or path.name in EXCLUDED_FILES:
        return False
    try:
        relative = path.relative_to(root)
    except ValueError:
        return False
    return not any(part in EXCLUDED_DIRS for part in relative.parts[:-1])


def collect_renames(root: Path) -> tuple[list[Rename], list[str]]:
    errors: list[str] = []
    renames: list[Rename] = []
    candidates: list[tuple[Path, str, Path]] = []

    for path in sorted(root.rglob("*.md")):
        if not is_candidate(path, root):
            continue
        try:
            title = read_title(path)
        except RuntimeError as exc:
            errors.append(str(exc))
            continue
        if title is None:
            continue
        try:
            target = path.with_name(title_to_filename(title))
        except ValueError as exc:
            errors.append(f"{path}: {exc}")
            continue
        candidates.append((path, title, target))

    seen: dict[str, Path] = {}
    source_paths = {p.resolve() for p, _, _ in candidates}
    for path, title, target in candidates:
        key = str(target.parent.resolve()) + "\0" + target.name.casefold()
        previous = seen.get(key)
        if previous and previous.resolve() != path.resolve():
            errors.append(f"filename collision: {previous} and {path} -> {target.name}")
        else:
            seen[key] = path

        if target.exists() and target.resolve() not in source_paths and target.resolve() != path.resolve():
            errors.append(f"target already exists and is not an OKF source: {target}")

        if path.name != target.name:
            renames.append(Rename(path, target, title))

    return renames, errors


def split_link_destination(raw: str) -> tuple[str, str]:
    """Return (destination, suffix) while preserving optional Markdown link title."""
    raw = raw.strip()
    if raw.startswith("<"):
        close = raw.find(">")
        if close != -1:
            return raw[1:close], raw[close + 1 :]
    match = re.match(r"(\S+)(.*)$", raw, re.S)
    if not match:
        return raw, ""
    return match.group(1), match.group(2)


def rewrite_indexes(root: Path, mapping: dict[Path, Path]) -> int:
    updated = 0
    resolved_mapping = {old.resolve(): new.resolve() for old, new in mapping.items()}

    for index in sorted(root.rglob("index.md")):
        text = index.read_text(encoding="utf-8")

        def replace(match: re.Match[str]) -> str:
            label, raw_dest = match.group(1), match.group(2)
            dest, suffix = split_link_destination(raw_dest)
            if not dest or dest.startswith(("http://", "https://", "mailto:", "#")):
                return match.group(0)

            fragment = ""
            path_part = dest
            if "#" in path_part:
                path_part, fragment = path_part.split("#", 1)
                fragment = "#" + fragment
            if not path_part.lower().endswith(".md"):
                return match.group(0)

            decoded = unquote(path_part)
            resolved = (index.parent / decoded).resolve()
            new_abs = resolved_mapping.get(resolved)
            if new_abs is None:
                return match.group(0)

            relative = Path(os.path.relpath(new_abs, index.parent.resolve())).as_posix()
            new_dest = relative + fragment
            return f"[{label}]({new_dest}{suffix})"

        new_text = MD_LINK.sub(replace, text)
        if new_text != text:
            index.write_text(new_text, encoding="utf-8")
            updated += 1
    return updated


def apply_renames(root: Path, renames: list[Rename]) -> tuple[int, int]:
    if not renames:
        return 0, 0

    mapping = {item.old: item.new for item in renames}
    staged: list[tuple[Path, Path]] = []

    for item in renames:
        temp = item.old.with_name(f".{item.old.name}.rename-okf-{uuid.uuid4().hex}.tmp")
        item.old.rename(temp)
        staged.append((temp, item.new))

    for temp, target in staged:
        temp.rename(target)

    indexes = rewrite_indexes(root, mapping)
    return len(renames), indexes


def iter_local_md_links(index: Path):
    text = index.read_text(encoding="utf-8")
    for match in MD_LINK.finditer(text):
        raw_dest = match.group(2)
        dest, _suffix = split_link_destination(raw_dest)
        if not dest or dest.startswith(("http://", "https://", "mailto:", "#")):
            continue
        path_part = dest.split("#", 1)[0]
        if not path_part.lower().endswith(".md"):
            continue
        yield dest, (index.parent / unquote(path_part)).resolve()


def validate(root: Path) -> list[str]:
    errors: list[str] = []
    _renames, collection_errors = collect_renames(root)
    errors.extend(collection_errors)

    for path in sorted(root.rglob("*.md")):
        if not is_candidate(path, root):
            continue
        title = read_title(path)
        if title is None:
            continue
        expected = title_to_filename(title)
        if path.name != expected:
            errors.append(f"filename mismatch: {path} (expected {expected})")

    for index in sorted(root.rglob("index.md")):
        for dest, resolved in iter_local_md_links(index):
            if not resolved.is_file():
                errors.append(f"broken index link: {index}: {dest}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=DEFAULT_ROOT)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true", help="rename files and rewrite indexes")
    mode.add_argument("--check", action="store_true", help="validate filenames and index links")
    mode.add_argument("--dry-run", action="store_true", help="print planned renames without changing files")
    args = parser.parse_args()

    root: Path = args.root
    if not root.is_dir():
        print(f"ERROR: root does not exist: {root}", file=sys.stderr)
        return 2

    renames, errors = collect_renames(root)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    if args.dry_run:
        for item in renames:
            print(f"RENAME {item.old} -> {item.new}")
        print(f"Planned renames: {len(renames)}")
        return 0

    if args.apply:
        renamed, indexes = apply_renames(root, renames)
        print(f"Renamed OKF files: {renamed}")
        print(f"Updated index files: {indexes}")
        post_errors = validate(root)
        if post_errors:
            for error in post_errors:
                print(f"ERROR: {error}", file=sys.stderr)
            return 1
        print("Post-apply validation: OK")
        return 0

    check_errors = validate(root)
    if check_errors:
        for error in check_errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("Validation: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
