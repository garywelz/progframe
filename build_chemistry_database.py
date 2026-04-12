#!/usr/bin/env python3
"""
Build chemistry-processes-database for GCS: metadata.json, chemistry-database-table.html,
and batches/*.html (anchor IDs + navigation for paths under .../batches/).

Source of truth: programming_framework/chemistry_batch_01.html … _14.html (unchanged).
Run from repo root: python3 build_chemistry_database.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PF = ROOT / "programming_framework"
OUT = PF / "chemistry-processes-database"
BATCHES_OUT = OUT / "batches"

GCS_BASE = "https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/chemistry-processes-database"
HF_SPACE = "https://huggingface.co/spaces/garywelz/programming_framework"

# Batch number -> (slug, display category)
BATCH_INFO = {
    1: ("organic_chemistry", "Organic Chemistry"),
    2: ("physical_chemistry", "Physical Chemistry"),
    3: ("analytical_chemistry", "Analytical Chemistry"),
    4: ("inorganic_chemistry", "Inorganic Chemistry"),
    5: ("biochemistry", "Biochemistry"),
    6: ("materials_chemistry", "Materials Chemistry"),
    7: ("environmental_chemistry", "Environmental Chemistry"),
    8: ("electrochemical", "Electrochemical Processes"),
    9: ("surface_catalysis", "Surface Chemistry & Catalysis"),
    10: ("thermodynamics", "Thermodynamic Processes"),
    11: ("kinetics", "Kinetic Processes"),
    12: ("spectroscopy", "Spectroscopy & Analysis"),
    13: ("quantum_chemistry", "Quantum Chemistry"),
    14: ("materials_solids", "Materials Chemistry (solids)"),
}

# categorySlug -> (label, URL) for “recent literature” hubs (arXiv recent, ChemRxiv, PubMed, etc.)
FRONTIER_BY_SLUG: dict[str, tuple[str, str]] = {
    "organic_chemistry": ("ChemRxiv", "https://chemrxiv.org/"),
    "physical_chemistry": ("arXiv physics.chem-ph", "https://arxiv.org/list/physics.chem-ph/recent"),
    "analytical_chemistry": ("PubMed — analytical chemistry", "https://pubmed.ncbi.nlm.nih.gov/?term=analytical+chemistry"),
    "inorganic_chemistry": ("ChemRxiv", "https://chemrxiv.org/"),
    "biochemistry": ("PubMed — biochemistry", "https://pubmed.ncbi.nlm.nih.gov/?term=biochemistry"),
    "materials_chemistry": ("ChemRxiv", "https://chemrxiv.org/"),
    "environmental_chemistry": ("PubMed — environmental", "https://pubmed.ncbi.nlm.nih.gov/?term=environmental+chemistry"),
    "electrochemical": ("ChemRxiv", "https://chemrxiv.org/"),
    "surface_catalysis": ("ChemRxiv", "https://chemrxiv.org/"),
    "thermodynamics": ("arXiv cond-mat.stat-mech", "https://arxiv.org/list/cond-mat.stat-mech/recent"),
    "kinetics": ("arXiv physics.chem-ph", "https://arxiv.org/list/physics.chem-ph/recent"),
    "spectroscopy": ("PubMed — spectroscopy", "https://pubmed.ncbi.nlm.nih.gov/?term=spectroscopy"),
    "quantum_chemistry": ("arXiv physics.chem-ph", "https://arxiv.org/list/physics.chem-ph/recent"),
    "materials_solids": ("arXiv cond-mat.mtrl-sci", "https://arxiv.org/list/cond-mat.mtrl-sci/recent"),
}


def is_process_title_style(batch_num: int) -> bool:
    return batch_num >= 8


def extract_processes_h2(content: str, batch_num: int) -> list[tuple[str, str]]:
    """Return [(process_id, title), ...] from <h2>N. Title</h2>."""
    out = []
    for m in re.finditer(r"<h2>(\d+)\.\s*([^<]+)</h2>", content):
        n = int(m.group(1))
        pid = f"chem-b{batch_num:02d}-p{n:02d}"
        title = m.group(2).strip()
        out.append((pid, title))
    return out


def extract_processes_div(content: str, batch_num: int) -> list[tuple[str, str]]:
    """Return [(process_id, title), ...] from process-title divs."""
    out = []
    for m in re.finditer(
        r'<div class="process-title">Process (\d+):\s*([^<]+)</div>', content
    ):
        n = int(m.group(1))
        pid = f"chem-b{batch_num:02d}-p{n:02d}"
        title = m.group(2).strip()
        out.append((pid, title))
    return out


def add_h2_ids(content: str, batch_num: int) -> str:
    def repl(m: re.Match) -> str:
        n = int(m.group(1))
        pid = f"chem-b{batch_num:02d}-p{n:02d}"
        return f'<h2 id="{pid}">{m.group(1)}. {m.group(2)}</h2>'

    return re.sub(r"<h2>(\d+)\.\s*([^<]+)</h2>", repl, content)


def add_process_title_ids(content: str, batch_num: int) -> str:
    def repl(m: re.Match) -> str:
        n = int(m.group(1))
        pid = f"chem-b{batch_num:02d}-p{n:02d}"
        return f'<div class="process-title" id="{pid}">Process {m.group(1)}: {m.group(2)}</div>'

    return re.sub(
        r'<div class="process-title">Process (\d+):\s*([^<]+)</div>',
        repl,
        content,
    )


def strip_nav_h2_style(content: str) -> str:
    pat = r'<div class="navigation">\s*<h3>Navigation</h3>\s*<div class="nav-links">[\s\S]*?</div>\s*</div>'
    return re.sub(pat, "", content, flags=re.MULTILINE)


def strip_nav_simple(content: str) -> str:
    pat = r'<div class="navigation">\s*<a href="index\.html">[^<]*</a>\s*<a href="chemistry_index\.html">[^<]*</a>\s*</div>'
    return re.sub(pat, "", content, flags=re.MULTILINE)


def gcs_navigation(batch_num: int, h2_style: bool) -> str:
    lines: list[str] = ['        <div class="navigation">']
    indent = "                " if h2_style else "            "
    cls_attr = ' class="nav-link"' if h2_style else ""

    def link(href: str, text: str, *, external: bool = False) -> str:
        extra = ' target="_blank" rel="noopener noreferrer"' if external else ""
        return f'{indent}<a href="{href}"{cls_attr}{extra}>{text}</a>'

    if h2_style:
        lines.append("            <h3>Navigation</h3>")
        lines.append('            <div class="nav-links">')

    lines.append(link("../chemistry-database-table.html", "← Chemistry database table"))
    if batch_num > 1:
        prev_name = BATCH_INFO[batch_num - 1][1]
        lines.append(
            link(
                f"chemistry_batch_{batch_num - 1:02d}.html",
                f"← Previous: {prev_name}",
            )
        )
    if batch_num < 14:
        next_name = BATCH_INFO[batch_num + 1][1]
        lines.append(
            link(
                f"chemistry_batch_{batch_num + 1:02d}.html",
                f"Next: {next_name} →",
            )
        )
    lines.append(link(HF_SPACE, "Programming Framework Space", external=True))

    if h2_style:
        lines.append("            </div>")
        lines.append("        </div>")
    else:
        lines.append("        </div>")
    return "\n".join(lines) + "\n"


def insert_nav_before_footer_h2(content: str, nav: str) -> str:
    marker = '        <div class="footer">'
    if marker not in content:
        raise ValueError("Expected footer marker not found (h2-style batch)")
    return content.replace(marker, nav + "\n\n" + marker, 1)


def insert_nav_before_author_block(content: str, nav: str) -> str:
    # Include leading indent so replace does not leave orphan spaces on the same line as nav.
    marker = '        <p style="margin-bottom: 0.5rem;"><strong>Gary Welz</strong></p>'
    if marker not in content:
        raise ValueError("Expected author marker not found (process-title batch)")
    return content.replace(marker, nav + "\n\n" + marker, 1)


def build_batch_file(batch_num: int) -> tuple[str, list[dict]]:
    path = PF / f"chemistry_batch_{batch_num:02d}.html"
    raw = path.read_text(encoding="utf-8")
    h2_style = not is_process_title_style(batch_num)

    if h2_style:
        processes = extract_processes_h2(raw, batch_num)
        body = add_h2_ids(raw, batch_num)
        body = strip_nav_h2_style(body)
        nav = gcs_navigation(batch_num, True)
        body = insert_nav_before_footer_h2(body, nav)
    else:
        processes = extract_processes_div(raw, batch_num)
        body = add_process_title_ids(raw, batch_num)
        body = strip_nav_simple(body)
        while re.search(
            r'<div class="navigation">\s*<a href="index\.html">',
            body,
        ):
            body = strip_nav_simple(body)
        nav = gcs_navigation(batch_num, False)
        body = insert_nav_before_author_block(body, nav)

    slug, category = BATCH_INFO[batch_num]
    fname = f"chemistry_batch_{batch_num:02d}.html"
    flabel, furl = FRONTIER_BY_SLUG.get(slug, ("", ""))
    meta_rows = []
    for pid, title in processes:
        row: dict = {
            "id": pid,
            "title": title,
            "category": category,
            "categorySlug": slug,
            "batch": batch_num,
            "batchFile": f"batches/{fname}",
            "href": f"batches/{fname}#{pid}",
        }
        if furl:
            row["frontierLabel"] = flabel
            row["frontierUrl"] = furl
        meta_rows.append(row)
    return body, meta_rows


def write_table_html(process_count: int) -> None:
    table_path = OUT / "chemistry-database-table.html"
    table_path.write_text(
        f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Chemistry Processes Database</title>
  <style>
    * {{ box-sizing: border-box; }}
    body {{
      font-family: 'Segoe UI', system-ui, sans-serif;
      margin: 0;
      background: linear-gradient(145deg, #0f766e 0%, #134e4a 50%, #042f2e 100%);
      min-height: 100vh;
      color: #0f172a;
    }}
    .wrap {{ max-width: 1280px; margin: 0 auto; padding: 24px 16px 48px; }}
    .card {{
      background: #f8fafc;
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0,0,0,.25);
      overflow: hidden;
    }}
    header {{
      padding: 24px 28px;
      background: linear-gradient(90deg, #0d9488, #14b8a6);
      color: #fff;
    }}
    header h1 {{ margin: 0 0 8px; font-size: 1.5rem; }}
    header p {{ margin: 0; opacity: .95; font-size: .95rem; }}
    .toolbar {{
      padding: 16px 24px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }}
    .toolbar label {{ font-size: .85rem; color: #64748b; }}
    input[type="search"] {{
      flex: 1;
      min-width: 200px;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 1rem;
    }}
    select {{
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: .95rem;
    }}
    .meta {{ font-size: .85rem; color: #64748b; margin-left: auto; }}
    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: .92rem;
    }}
    th, td {{ padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }}
    th {{
      background: #f1f5f9;
      font-weight: 600;
      color: #334155;
      position: sticky;
      top: 0;
    }}
    tr:hover td {{ background: #f0fdfa; }}
    a.row-link {{ color: #0f766e; font-weight: 600; text-decoration: none; }}
    a.row-link:hover {{ text-decoration: underline; }}
    .slug {{ font-size: .8rem; color: #94a3b8; }}
    td.frontier a {{ color: #0d9488; font-weight: 500; text-decoration: none; font-size: .88rem; }}
    td.frontier a:hover {{ text-decoration: underline; }}
    td.frontier .na {{ color: #94a3b8; font-size: .85rem; }}
    footer {{
      padding: 16px 24px;
      font-size: .8rem;
      color: #64748b;
      background: #f8fafc;
    }}
    footer a {{ color: #0d9488; }}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <header>
        <h1>⚗️ Chemistry processes</h1>
        <p>Programming Framework flowcharts — filter by branch or search titles. <strong>Frontier</strong> links go to recent literature hubs (arXiv, ChemRxiv, PubMed) by branch.</p>
      </header>
      <div class="toolbar">
        <label for="q">Search</label>
        <input type="search" id="q" placeholder="Title, category, id…" autocomplete="off" />
        <label for="cat">Branch</label>
        <select id="cat"><option value="">All branches</option></select>
        <span class="meta" id="count"></span>
      </div>
      <div style="overflow:auto; max-height: min(70vh, 640px);">
        <table>
          <thead>
            <tr>
              <th>Process</th>
              <th>Branch</th>
              <th>Batch</th>
              <th>Frontier</th>
            </tr>
          </thead>
          <tbody id="tbody"></tbody>
        </table>
      </div>
      <footer>
        Static host: <a href="{GCS_BASE}/chemistry-database-table.html">GCS</a> ·
        Space: <a href="{HF_SPACE}" target="_blank" rel="noopener">Hugging Face</a> ·
        <span id="gen"></span>
      </footer>
    </div>
  </div>
  <script>
(function () {{
  const META_URL = './metadata.json';
  const tbody = document.getElementById('tbody');
  const q = document.getElementById('q');
  const cat = document.getElementById('cat');
  const countEl = document.getElementById('count');
  const gen = document.getElementById('gen');

  function row(p) {{
    const tr = document.createElement('tr');
    const a = document.createElement('a');
    a.className = 'row-link';
    a.href = p.href;
    a.textContent = p.title;
    const td1 = document.createElement('td');
    td1.appendChild(a);
    const sub = document.createElement('div');
    sub.className = 'slug';
    sub.textContent = p.id;
    td1.appendChild(sub);
    const td2 = document.createElement('td');
    td2.textContent = p.category;
    const td3 = document.createElement('td');
    td3.textContent = 'Batch ' + String(p.batch).padStart(2, '0');
    const td4 = document.createElement('td');
    td4.className = 'frontier';
    if (p.frontierUrl) {{
      const fa = document.createElement('a');
      fa.href = p.frontierUrl;
      fa.target = '_blank';
      fa.rel = 'noopener noreferrer';
      fa.textContent = p.frontierLabel || 'Frontier';
      td4.appendChild(fa);
    }} else {{
      const em = document.createElement('span');
      em.className = 'na';
      em.textContent = '—';
      td4.appendChild(em);
    }}
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    return tr;
  }}

  fetch(META_URL)
    .then((r) => r.json())
    .then((data) => {{
      gen.textContent = 'Processes: ' + data.totalProcesses + ' · v' + (data.version || '1');
      const processes = data.processes || [];
      const cats = [...new Set(processes.map((p) => p.category))].sort();
      cats.forEach((c) => {{
        const o = document.createElement('option');
        o.value = c;
        o.textContent = c;
        cat.appendChild(o);
      }});

      function render() {{
        const qq = (q.value || '').toLowerCase().trim();
        const cf = cat.value;
        const filtered = processes.filter((p) => {{
          if (cf && p.category !== cf) return false;
          if (!qq) return true;
          const hay = (p.title + ' ' + p.category + ' ' + p.id + ' ' + (p.categorySlug || '') + ' ' + (p.frontierLabel || '')).toLowerCase();
          return hay.includes(qq);
        }});
        tbody.innerHTML = '';
        filtered.forEach((p) => tbody.appendChild(row(p)));
        countEl.textContent = filtered.length + ' shown';
      }}

      q.addEventListener('input', render);
      cat.addEventListener('change', render);
      render();
    }})
    .catch((e) => {{
      tbody.innerHTML = '<tr><td colspan="4">Could not load metadata.json (' + e + ')</td></tr>';
    }});
}})();
  </script>
</body>
</html>
""",
        encoding="utf-8",
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    BATCHES_OUT.mkdir(parents=True, exist_ok=True)

    all_processes: list[dict] = []
    for n in range(1, 15):
        body, rows = build_batch_file(n)
        out_file = BATCHES_OUT / f"chemistry_batch_{n:02d}.html"
        out_file.write_text(body, encoding="utf-8")
        all_processes.extend(rows)
        print(f"Wrote {out_file} ({len(rows)} processes)")

    meta = {
        "discipline": "chemistry",
        "version": "1",
        "totalProcesses": len(all_processes),
        "generatedBy": "build_chemistry_database.py",
        "frontierByCategory": [
            {"categorySlug": s, "frontierLabel": v[0], "frontierUrl": v[1]}
            for s, v in sorted(FRONTIER_BY_SLUG.items())
        ],
        "processes": all_processes,
    }
    (OUT / "metadata.json").write_text(
        json.dumps(meta, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT / 'metadata.json'} ({len(all_processes)} processes)")

    write_table_html(len(all_processes))
    print(f"Wrote {OUT / 'chemistry-database-table.html'}")


if __name__ == "__main__":
    main()
