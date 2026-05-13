#!/usr/bin/env python3
"""
Extract ```mermaid blocks from manuscript Markdown, write sibling .mmd files,
and emit html-manuscript/index.html that renders diagrams with Mermaid in-browser.

No PNG/mmdc/Chromium — diagrams stay text-first (.mmd + JSON ``mermaid`` field).

Opening index.html via file:// works: diagram sources are embedded in a JSON script
blob (with </script> guarded). Serving the folder over HTTP also exposes diagrams/*.mmd
for reuse by other viewers.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

MERMAID_BLOCK = re.compile(
    r"(?:^[ \t]*Mermaid Markdown Code:\s*\n)?^[ \t]*```mermaid\s*\n(?P<body>.*?)^[ \t]*```",
    re.MULTILINE | re.DOTALL,
)

# Order matches occurrence in current-draft.md / stripped build (three figures).
FIGURE_SLUGS_AND_TITLES: list[tuple[str, str]] = [
    ("figure-01-basic-framework", "Figure 1 — Basic Programming Framework Structure"),
    ("figure-02-vhl-hif-class3", "Figure 2 — Class III VHL–HIF oxygen sensing (empirical sequel palette)"),
    ("figure-03-lac-operon", "Figure 3 — lac operon / beta-galactosidase regulation (Programming Framework palette)"),
    ("figure-04-merge-sort", "Figure 4 — Merge Sort"),
]

HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Programming Framework — manuscript figures (Mermaid)</title>
  <style>
    :root {{
      color-scheme: light dark;
      --bg: #f8fafc;
      --panel: #ffffff;
      --text: #111827;
      --muted: #64748b;
      --border: #e2e8f0;
      --accent: #2563eb;
    }}
    @media (prefers-color-scheme: dark) {{
      :root {{
        --bg: #0f172a;
        --panel: #111827;
        --text: #e5e7eb;
        --muted: #94a3b8;
        --border: #334155;
        --accent: #60a5fa;
      }}
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.55;
    }}
    main {{ max-width: 1120px; margin: 0 auto; padding: 28px 18px 56px; }}
    header {{
      border-bottom: 1px solid var(--border);
      padding-bottom: 18px;
      margin-bottom: 28px;
    }}
    h1 {{ margin: 0 0 8px; font-size: 1.65rem; }}
    .meta {{ color: var(--muted); font-size: 0.95rem; }}
    section {{
      margin-bottom: 42px;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 22px;
      background: var(--panel);
    }}
    section h2 {{
      margin: 0 0 6px;
      font-size: 1.15rem;
      border-bottom: 0;
      padding-top: 0;
    }}
    .mmd-path {{
      font-size: 0.88rem;
      color: var(--muted);
      margin-bottom: 14px;
      font-family: ui-monospace, monospace;
    }}
    .mmd-path code {{ background: color-mix(in srgb, var(--panel) 70%, var(--border)); padding: 2px 6px; border-radius: 4px; }}
    pre.mermaid {{
      margin: 0;
      padding: 18px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: #ffffff;
      color: #111827;
      overflow-x: auto;
    }}
    pre.mermaid svg {{ max-width: 100%; height: auto; }}
    .legend {{
      margin-top: 36px;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid var(--border);
      font-size: 0.92rem;
      color: var(--muted);
    }}
    .legend strong {{ color: var(--text); }}
    a {{ color: var(--accent); }}
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Programming Framework — figures</h1>
      <p class="meta">Rendered in-browser via Mermaid from extracted <code>.mmd</code> sources (no raster PNG step).</p>
    </header>
    <div id="diagram-sections"></div>
    <div class="legend">
      <strong>Colour conventions:</strong> Figures 1, 3, and 4 use the suggested five-category §3.2 palette (Red through Violet).
      Figure 2 uses the empirical sequel companion illustration palette (signal / gene / outcome + degradation-edge emphasis)—see §4.1.
      Raw sources: <code>diagrams/&lt;slug&gt;.mmd</code> next to this file.
    </div>
  </main>
  <script type="application/json" id="figure-json-data">__FIGURE_JSON__</script>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

    const raw = document.getElementById('figure-json-data').textContent;
    const figures = JSON.parse(raw);

    mermaid.initialize({{
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {{ htmlLabels: true, curve: 'basis', useMaxWidth: true }},
    }});

    const host = document.getElementById('diagram-sections');
    for (const fig of figures) {{
      const sec = document.createElement('section');
      sec.id = fig.slug;
      const h2 = document.createElement('h2');
      h2.textContent = fig.title;
      sec.appendChild(h2);
      const pathLine = document.createElement('p');
      pathLine.className = 'mmd-path';
      pathLine.innerHTML = 'Source file: <code>diagrams/' + fig.slug + '.mmd</code>';
      sec.appendChild(pathLine);
      const pre = document.createElement('pre');
      pre.className = 'mermaid';
      pre.textContent = fig.source;
      sec.appendChild(pre);
      host.appendChild(sec);
    }}

    await mermaid.run({{ querySelector: 'pre.mermaid' }});
  </script>
</body>
</html>
"""


def sync_process_json_mmd(json_path: Path) -> None:
    """Write sibling ``<stem>.mmd`` from ``mermaid`` when ``mermaid_file`` matches."""
    data = json.loads(json_path.read_text(encoding="utf-8"))
    if "mermaid" not in data:
        return
    mf = data.get("mermaid_file")
    expected = json_path.with_suffix(".mmd").name
    if mf and mf != expected:
        sys.stderr.write(
            f"Warning: {json_path.name} mermaid_file={mf!r} != {expected!r}; writing {expected} anyway.\n"
        )
    out_mmd = json_path.with_suffix(".mmd")
    body = data["mermaid"].replace("\r\n", "\n").strip() + "\n"
    out_mmd.write_text(body, encoding="utf-8")


def main() -> None:
    if len(sys.argv) < 3:
        sys.stderr.write(
            "Usage: build_manuscript_html.py INPUT_STRIPPED.md OUTPUT_DIR [PROCESS.json ...]\n"
            "Optional JSON paths: write sibling ``<id>.mmd`` from each file's ``mermaid`` field.\n"
        )
        sys.exit(2)
    in_path = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    extra_json = []
    for p in sys.argv[3:]:
        pp = Path(p)
        if pp.is_file() and pp.suffix.lower() == ".json":
            extra_json.append(pp)

    md = in_path.read_text(encoding="utf-8")
    bodies = [m.group("body").strip() + "\n" for m in MERMAID_BLOCK.finditer(md)]

    if len(bodies) != len(FIGURE_SLUGS_AND_TITLES):
        sys.stderr.write(
            f"Expected {len(FIGURE_SLUGS_AND_TITLES)} mermaid blocks, found {len(bodies)}.\n"
        )
        sys.exit(1)

    diag_dir = out_dir / "diagrams"
    diag_dir.mkdir(parents=True, exist_ok=True)

    figures = []
    for (slug, title), body in zip(FIGURE_SLUGS_AND_TITLES, bodies, strict=True):
        (diag_dir / f"{slug}.mmd").write_text(body, encoding="utf-8")
        figures.append({"slug": slug, "title": title, "source": body.rstrip("\n")})

    dumped = json.dumps(figures, ensure_ascii=False)
    dumped = dumped.replace("</script>", "<\\/script>")
    html_out = HTML_TEMPLATE.replace("__FIGURE_JSON__", dumped)
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(html_out, encoding="utf-8")

    for jp in extra_json:
        if jp.is_file():
            sync_process_json_mmd(jp)

    rel_d = diag_dir.relative_to(out_dir)
    print(
        f"Wrote {out_dir / 'index.html'} and {len(figures)} files under {rel_d}/",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
