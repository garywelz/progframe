#!/usr/bin/env python3
"""
Add attribution Cite badges to mathematics process charts.

Reads attributions.json (chart ID -> attribution data), finds matching HTML
files in processes/, and injects the Cite span + CSS into header-meta.
Skips charts that already have attribution-wrap.

Usage: python add_attributions.py [--dry-run]
"""
import argparse
import json
import re
from pathlib import Path

PROGFRAME = Path(__file__).resolve().parent
PROCESSES = Path("/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database/processes")
ATTRIBUTIONS_JSON = PROGFRAME / "attributions.json"

# CSS block to inject if not present (matches generate_p3_charts.py / godel-incompleteness-1)
ATTRIBUTION_CSS = """
        .attribution-wrap { position: relative; }
        .attribution-trigger { cursor: help; background: rgba(255,255,255,0.2) !important; }
        .attribution-popover { display: none; position: absolute; top: 100%; left: 0; margin-top: 4px; background: #2c3e50; color: #ecf0f1; padding: 14px 18px; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.25); min-width: 300px; z-index: 100; font-size: 0.85em; line-height: 1.5; }
        .attribution-popover::before { content: ''; position: absolute; bottom: 100%; left: 0; right: 0; height: 12px; }
        .attribution-popover strong { color: #fff; }
        .attribution-popover a { color: #3498db; }
        .attribution-wrap:hover .attribution-popover, .attribution-wrap:focus-within .attribution-popover { display: block; }"""


def build_attribution_html(att: dict, link_color: str = "#3498db") -> str:
    """Build the Cite span + popover HTML from attribution dict."""
    parts = []
    if att.get("primary"):
        parts.append(f'<strong>Primary:</strong> {att["primary"]}')
    if att.get("publication"):
        parts.append(f'<strong>Publication:</strong> {att["publication"]}')
    if att.get("year"):
        parts.append(f'<strong>Year:</strong> {att["year"]}')
    if att.get("doi"):
        parts.append(f'<strong>DOI:</strong> <a href="{att["doi"]}" target="_blank">{att["doi"].split("/")[-1]}</a>')
    if att.get("url"):
        text = att.get("url_text", "Link")
        parts.append(f'<strong>URL:</strong> <a href="{att["url"]}" target="_blank">{text}</a>')

    popover_html = "<br>".join(parts)
    return f'<span class="meta-item attribution-wrap"><span class="attribution-trigger meta-item" tabindex="0">Cite</span><div class="attribution-popover">{popover_html}</div></span>'


def find_html_path(chart_id: str) -> Path | None:
    """Find the HTML file for a chart ID (filename without .html)."""
    for p in PROCESSES.rglob("*.html"):
        if p.stem == chart_id:
            return p
    return None


def has_attribution(html: str) -> bool:
    return "attribution-wrap" in html


def has_header_meta(html: str) -> bool:
    return '<div class="header-meta"' in html


def inject_css(html: str) -> str:
    """Inject attribution CSS before </style> if not already present."""
    if "attribution-wrap" in html or "attribution-popover" in html:
        return html
    return html.replace("    </style>", ATTRIBUTION_CSS + "\n    </style>", 1)


def inject_attribution_span(html: str, span_html: str) -> str:
    """Insert attribution span before the closing </div> of the first header-meta."""
    pattern = r'(<div class="header-meta"[^>]*>)([\s\S]*?)(\s*</div>)'
    match = re.search(pattern, html)
    if not match:
        return html
    prefix, content, closing = match.groups()
    # Insert before the closing </div> of header-meta
    new_content = content.rstrip() + "\n                " + span_html + closing
    return html[: match.start()] + prefix + new_content + html[match.end() :]


def main():
    ap = argparse.ArgumentParser(description="Add attribution Cite badges to mathematics process charts")
    ap.add_argument("--dry-run", action="store_true", help="Print what would be done, don't write files")
    args = ap.parse_args()

    with open(ATTRIBUTIONS_JSON) as f:
        data = json.load(f)

    attributions = {k: v for k, v in data.items() if not k.startswith("_") and isinstance(v, dict) and v}
    stats = {"updated": 0, "skipped_no_file": 0, "skipped_no_header_meta": 0, "skipped_has_attribution": 0, "skipped_empty": 0}

    for chart_id, att in attributions.items():
        path = find_html_path(chart_id)
        if not path:
            stats["skipped_no_file"] += 1
            print(f"[skip] {chart_id}: no matching HTML file")
            continue

        html = path.read_text(encoding="utf-8")
        if has_attribution(html):
            stats["skipped_has_attribution"] += 1
            print(f"[skip] {chart_id}: already has attribution")
            continue
        if not has_header_meta(html):
            stats["skipped_no_header_meta"] += 1
            print(f"[skip] {chart_id}: no header-meta (index page?)")
            continue

        span_html = build_attribution_html(att)
        html = inject_css(html)
        html = inject_attribution_span(html, span_html)

        if args.dry_run:
            print(f"[dry-run] would update {path}")
            stats["updated"] += 1
        else:
            path.write_text(html, encoding="utf-8")
            print(f"[ok] {path}")
            stats["updated"] += 1

    print()
    print("Summary:", stats)


if __name__ == "__main__":
    main()
