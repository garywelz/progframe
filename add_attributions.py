#!/usr/bin/env python3
"""
Add attribution Cite badges and optional Frontier links to mathematics process charts.

Reads attributions.json (chart ID -> attribution data), finds matching HTML
files in processes/, and injects into header-meta:
  - Cite (attribution-wrap + popover) when primary/publication/year/doi/url present
  - Frontier (external link) when frontier_url / frontierUrl present

Charts that already have Cite are not re-injected; Frontier is added if missing.
Skips entries with nothing to add.

Usage: python3 add_attributions.py [--dry-run]
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
    """Build the Cite span + popover HTML from attribution dict. Empty if no fields."""
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

    if not parts:
        return ""

    popover_html = "<br>".join(parts)
    return f'<span class="meta-item attribution-wrap"><span class="attribution-trigger meta-item" tabindex="0">Cite</span><div class="attribution-popover">{popover_html}</div></span>'


def build_frontier_span(att: dict) -> str:
    """Optional literature-hub link (arXiv recent, etc.). Uses frontier_url or frontierUrl."""
    url = att.get("frontier_url") or att.get("frontierUrl")
    if not url:
        return ""
    label = att.get("frontier_label") or att.get("frontierLabel") or "Frontier"
    return f'<span class="meta-item frontier-meta-link"><a href="{url}" target="_blank" rel="noopener noreferrer">{label}</a></span>'


def find_html_path(chart_id: str) -> Path | None:
    """Find the HTML file for a chart ID (filename without .html)."""
    for p in PROCESSES.rglob("*.html"):
        if p.stem == chart_id:
            return p
    return None


def has_attribution(html: str) -> bool:
    return "attribution-wrap" in html


def has_frontier_meta(html: str) -> bool:
    return "frontier-meta-link" in html


def has_header_meta(html: str) -> bool:
    return '<div class="header-meta"' in html


def inject_css(html: str) -> str:
    """Inject attribution CSS before </style> if not already present."""
    if "attribution-wrap" in html or "attribution-popover" in html:
        return html
    return html.replace("    </style>", ATTRIBUTION_CSS + "\n    </style>", 1)


def inject_attribution_span(html: str, span_html: str) -> str:
    """Append span before the closing </div> of the first header-meta."""
    if not span_html:
        return html
    pattern = r'(<div class="header-meta"[^>]*>)([\s\S]*?)(\s*</div>)'
    match = re.search(pattern, html)
    if not match:
        return html
    prefix, content, closing = match.groups()
    new_content = content.rstrip() + "\n                " + span_html + closing
    return html[: match.start()] + prefix + new_content + html[match.end() :]


def main():
    ap = argparse.ArgumentParser(description="Add Cite + optional Frontier to mathematics process charts")
    ap.add_argument("--dry-run", action="store_true", help="Print what would be done, don't write files")
    args = ap.parse_args()

    with open(ATTRIBUTIONS_JSON) as f:
        data = json.load(f)

    attributions = {k: v for k, v in data.items() if not k.startswith("_") and isinstance(v, dict) and v}
    stats = {
        "updated": 0,
        "skipped_no_file": 0,
        "skipped_no_header_meta": 0,
        "skipped_nothing_to_do": 0,
    }

    for chart_id, att in attributions.items():
        path = find_html_path(chart_id)
        if not path:
            stats["skipped_no_file"] += 1
            print(f"[skip] {chart_id}: no matching HTML file")
            continue

        html = path.read_text(encoding="utf-8")
        if not has_header_meta(html):
            stats["skipped_no_header_meta"] += 1
            print(f"[skip] {chart_id}: no header-meta (index page?)")
            continue

        cite_span = build_attribution_html(att)
        frontier_span = build_frontier_span(att)

        effective_cite = cite_span if cite_span and not has_attribution(html) else ""
        effective_frontier = frontier_span if frontier_span and not has_frontier_meta(html) else ""

        if not effective_cite and not effective_frontier:
            stats["skipped_nothing_to_do"] += 1
            print(f"[skip] {chart_id}: nothing to add (already has cite/frontier or JSON empty)")
            continue

        if effective_cite:
            html = inject_css(html)
            html = inject_attribution_span(html, effective_cite)
        if effective_frontier:
            html = inject_attribution_span(html, effective_frontier)

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
