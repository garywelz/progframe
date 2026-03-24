#!/usr/bin/env python3
"""
Standardize chart header and nav colors to database orange (#e67e22).

Phase 3: Header/nav consistency per NEXT_PASS_CHECKLIST.
"""
import argparse
import re
from pathlib import Path

PROCESSES = Path("/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database/processes")
HEADER_STD = "linear-gradient(135deg, #e67e22 0%, #e67e22dd 100%)"
NAV_COLOR = "#e67e22"


def standardize(html: str) -> tuple[str, bool]:
    """Return (new_html, changed)."""
    changed = False

    # Header background - match various gradient formats
    pattern = r"(\.header\s*\{\s*background:\s*)linear-gradient\([^)]+\)"
    repl = rf"\g<1>{HEADER_STD}"
    new_html, n = re.subn(pattern, repl, html, count=1)
    if n:
        changed = True
    html = new_html

    # Nav link color - .nav-links a { color: #XXX
    pattern = r"(\.nav-links\s+a\s*\{\s*color:\s*)#[0-9a-fA-F]+"
    repl = rf"\g<1>{NAV_COLOR}"
    new_html, n = re.subn(pattern, repl, html, count=1)
    if n:
        changed = True
    html = new_html

    return html, changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    updated = 0
    for path in sorted(PROCESSES.rglob("*.html")):
        html = path.read_text(encoding="utf-8")
        new_html, changed = standardize(html)
        if changed:
            if args.dry_run:
                print(f"[dry-run] {path}")
            else:
                path.write_text(new_html, encoding="utf-8")
                print(f"[ok] {path}")
            updated += 1

    print(f"\nUpdated {updated} files")


if __name__ == "__main__":
    main()
