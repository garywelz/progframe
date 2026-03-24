#!/usr/bin/env python3
"""
Generate biology theme collection pages (pathways / mechanisms / protocols groupings).
Output: biology-processes-database/collections/*.html
"""
from pathlib import Path

DB_ROOT = Path("/home/gdubs/copernicus-web-public/huggingface-space/biology-processes-database")
COLLECTIONS = DB_ROOT / "collections"
PROC_BASE = "processes"

# Theme slug -> (title, blurb, list of (subcategory_folder, process_id without path))
# process file: processes/{subcat}/{id}.html
THEMES = [
    ("metabolism", "Metabolism & Bioenergetics",
     "Core catabolic and anabolic pathways: glycolysis, citric acid cycle, oxidative phosphorylation, and the Calvin cycle.",
     [("pathways", "pathways-glycolysis"),
      ("pathways", "pathways-krebs-cycle"),
      ("pathways", "pathways-oxidative-phosphorylation"),
      ("pathways", "pathways-calvin-cycle")]),
    ("signaling-cell-fate", "Signaling & Cell Fate",
     "Signal transduction cascades and decisions controlling proliferation and death.",
     [("pathways", "pathways-mapk-signaling"),
      ("pathways", "pathways-insulin-signaling"),
      ("pathways", "pathways-apoptosis"),
      ("pathways", "pathways-cell-cycle")]),
    ("gene-expression", "Gene Expression & Regulation",
     "Central dogma, operons, riboswitches, feedback control, and programmable genome editing.",
     [("mechanisms", "mechanisms-central-dogma"),
      ("mechanisms", "mechanisms-trp-operon"),
      ("mechanisms", "mechanisms-riboswitch-regulation"),
      ("mechanisms", "mechanisms-feedback-inhibition"),
      ("mechanisms", "mechanisms-dna-replication"),
      ("mechanisms", "mechanisms-crispr-cas9")]),
    ("lab-protocols", "Molecular Biology Lab Protocols",
     "Standard experimental workflows from amplification to detection and cloning.",
     [("assay_protocols", "assay_protocols-pcr"),
      ("assay_protocols", "assay_protocols-agarose-gel"),
      ("assay_protocols", "assay_protocols-western-blot"),
      ("assay_protocols", "assay_protocols-elisa"),
      ("assay_protocols", "assay_protocols-bacterial-transformation"),
      ("assay_protocols", "assay_protocols-dna-extraction")]),
]


def chart_href(subfolder: str, pid: str) -> str:
    return f"../{PROC_BASE}/{subfolder}/{pid}.html"


def label_from_id(pid: str) -> str:
    return pid.split("-", 1)[-1].replace("-", " ").title()


def make_page(slug: str, title: str, blurb: str, items: list) -> str:
    nav_gcs = "https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/biology-processes-database"
    links = "\n".join(
        f'            <a href="{chart_href(sc, pid)}">{label_from_id(pid)}</a>'
        for sc, pid in items
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — Biology Theme</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e8449 0%, #27ae60 100%); min-height: 100vh; padding: 20px; }}
        .container {{ max-width: 900px; margin: 0 auto; background: white; border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; padding: 30px; }}
        h1 {{ color: #1e4620; margin-bottom: 10px; }}
        p {{ color: #555; margin-bottom: 25px; line-height: 1.6; }}
        .nav-links {{ margin-bottom: 20px; }}
        .nav-links a {{ color: #27ae60; text-decoration: none; margin-right: 20px; font-weight: 500; }}
        .nav-links a:hover {{ text-decoration: underline; }}
        .section-label {{ font-size: 0.9em; color: #7f8c8d; margin-bottom: 8px;
            text-transform: uppercase; letter-spacing: 0.5px; }}
        .sections {{ display: grid; gap: 12px; }}
        .sections a {{ display: block; padding: 16px; background: #f0fdf4; border-radius: 10px;
            color: #1e4620; text-decoration: none; font-weight: 500; border-left: 4px solid #27ae60; }}
        .sections a:hover {{ background: #dcfce7; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Biology Database</a>
            <a id="themes-link" href="index.html">All Themes</a>
        </div>
        <script>
            (function() {{
                const isGCS = window.location.hostname.includes('storage.googleapis.com');
                const base = isGCS ? '{nav_gcs}' : '..';
                document.getElementById('back-link').href = base + '/biology-database-table.html';
                document.getElementById('themes-link').href = isGCS ? base + '/collections/index.html' : 'index.html';
            }})();
        </script>
        <h1>{title}</h1>
        <p>{blurb}</p>
        <div class="section-label">Processes</div>
        <div class="sections">
{links}
        </div>
    </div>
</body>
</html>
"""


def main():
    COLLECTIONS.mkdir(parents=True, exist_ok=True)
    pages = []
    for slug, title, blurb, items in THEMES:
        html = make_page(slug, title, blurb, items)
        out = COLLECTIONS / f"{slug}.html"
        out.write_text(html, encoding="utf-8")
        print(f"Wrote {out}")
        pages.append((slug, title, len(items)))

    nav_gcs = "https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/biology-processes-database"
    rows = "\n".join(
        f'            <a href="{s}.html"><span>{t}</span><span class="meta">{n} processes</span></a>'
        for s, t, n in pages
    )
    index = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Theme Collections — Biology Database</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e8449 0%, #27ae60 100%); min-height: 100vh; padding: 20px; }}
        .container {{ max-width: 900px; margin: 0 auto; background: white; border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; padding: 30px; }}
        h1 {{ color: #1e4620; margin-bottom: 10px; }}
        p {{ color: #555; margin-bottom: 25px; line-height: 1.6; }}
        .nav-links {{ margin-bottom: 20px; }}
        .nav-links a {{ color: #27ae60; text-decoration: none; margin-right: 20px; font-weight: 500; }}
        .section-label {{ font-size: 0.9em; color: #7f8c8d; margin-bottom: 12px;
            text-transform: uppercase; letter-spacing: 0.5px; }}
        .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }}
        .grid a {{ display: block; padding: 16px; background: #f0fdf4; border-radius: 10px;
            color: #1e4620; text-decoration: none; font-weight: 500; border-left: 4px solid #27ae60; }}
        .grid a:hover {{ background: #dcfce7; }}
        .grid a .meta {{ font-size: 0.8em; color: #6b7280; margin-top: 4px; display: block; }}
        .filter-bar {{ margin-bottom: 16px; display: flex; gap: 10px; flex-wrap: wrap; }}
        .filter-btn {{ padding: 8px 16px; border: 2px solid #27ae60; background: white; color: #1e8449;
            border-radius: 8px; cursor: pointer; font-weight: 500; }}
        .filter-btn.active {{ background: #27ae60; color: white; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Biology Database</a>
        </div>
        <script>
            (function() {{
                const isGCS = window.location.hostname.includes('storage.googleapis.com');
                const base = isGCS ? '{nav_gcs}' : '..';
                document.getElementById('back-link').href = base + '/biology-database-table.html';
            }})();
        </script>
        <h1>Theme Collections</h1>
        <p>Browse processes by biological theme: metabolism, signaling, gene expression, and core lab protocols.</p>
        <div class="section-label">Themes</div>
        <div class="grid" id="theme-grid">
{rows}
        </div>
    </div>
</body>
</html>
"""
    (COLLECTIONS / "index.html").write_text(index, encoding="utf-8")
    print(f"Wrote {COLLECTIONS / 'index.html'}")
    print(f"Done: {len(THEMES)} theme collections")


if __name__ == "__main__":
    main()
