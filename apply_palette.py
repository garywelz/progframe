#!/usr/bin/env python3
"""
Apply 5/6-color palette to axiomatic/dependency charts.

Maps Def/Lem/Thm/Cor/Ref to standard colors per NEXT_PASS_CHECKLIST.md.
Only modifies files that have classDef definition|lemma|theorem (axiomatic charts).
Algorithm charts (red/yellow/green/lightblue/violet/lavender) are left as-is.

Usage: python3 apply_palette.py [--dry-run]
"""
import argparse
import re
from pathlib import Path

PROCESSES = Path("/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database/processes")

# 5/6-color palette (GLMP) — (fill, stroke, text_color). Yellow uses dark text for contrast.
PALETTE = {
    "axiom": ("#ff6b6b", "#c0392b", "#fff"),
    "postulate": ("#ff6b6b", "#c0392b", "#fff"),
    "commonNotion": ("#ffd43b", "#f59f00", "#000"),
    "commonnotion": ("#ffd43b", "#f59f00", "#000"),
    "definition": ("#b197fc", "#9775fa", "#fff"),
    "lemma": ("#74c0fc", "#4dabf7", "#fff"),
    "theorem": ("#51cf66", "#40c057", "#fff"),
    "corollary": ("#1abc9c", "#16a085", "#fff"),
    "proposition": ("#51cf66", "#40c057", "#fff"),
    "ref": ("#bdc3c7", "#95a5a6", "#333"),
}


def needs_update(html: str) -> bool:
    """True if file uses axiomatic classDef (axiom/postulate/definition/lemma/theorem/etc)."""
    return bool(re.search(
        r"classDef (axiom|postulate|commonNotion|commonnotion|definition|lemma|theorem|corollary|proposition|ref)\b",
        html,
    ))


def apply_palette(html: str) -> str:
    """Replace axiomatic classDef colors with palette."""
    for name, (fill, stroke, text) in PALETTE.items():
        # Match: classDef X fill:#...,color:#...,stroke:#...
        pattern = rf'(classDef {re.escape(name)}\s+fill:)#[0-9a-fA-F]+(,color:)#[0-9a-fA-F]+(,stroke:)#[0-9a-fA-F]+'
        repl = rf'\g<1>{fill}\g<2>{text}\g<3>{stroke}'
        html = re.sub(pattern, repl, html)
        # Match without stroke (some files)
        pattern2 = rf'(classDef {re.escape(name)}\s+fill:)#[0-9a-fA-F]+(,color:)#[0-9a-fA-F]+'
        repl2 = rf'\g<1>{fill}\g<2>{text}'
        html = re.sub(pattern2, repl2, html)
    return html


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    updated = 0
    for path in PROCESSES.rglob("*.html"):
        html = path.read_text(encoding="utf-8")
        if not needs_update(html):
            continue
        new_html = apply_palette(html)
        if new_html != html:
            if args.dry_run:
                print(f"[dry-run] {path}")
            else:
                path.write_text(new_html, encoding="utf-8")
                print(f"[ok] {path}")
            updated += 1

    print(f"\nUpdated {updated} files")


if __name__ == "__main__":
    main()
