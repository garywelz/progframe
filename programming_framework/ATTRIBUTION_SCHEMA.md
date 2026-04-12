# Mathematics Database — Attribution Schema

Charts in the Mathematics Processes Database may include optional attribution metadata for academic transparency and citation.

## Schema

| Field | Type | Description |
|-------|------|-------------|
| `primary` | string | Primary author(s) or source (e.g., "Kurt Gödel", "Claude Shannon") |
| `contributors` | string[] | Additional contributors (optional) |
| `publication` | string | Title of publication or paper |
| `year` | string | Year of publication |
| `doi` | string | DOI URL (e.g., "https://doi.org/...") |
| `url` | string | External URL (Wikipedia, arXiv, etc.) |
| `frontier_url` | string | Optional “recent literature” hub (e.g. `https://arxiv.org/list/math.DG/recent`, ChemRxiv, PubMed search) |
| `frontier_label` | string | Short label shown on the chart (e.g. `arXiv math.DG`). Defaults to `Frontier` if omitted |

CamelCase `frontierUrl` / `frontierLabel` are also accepted for parity with JSON used elsewhere.

## Implementation

Attribution is embedded in chart HTML via a "Cite" badge in the header-meta area. Hovering over the badge reveals a popover with the full attribution details. Optional **Frontier** appears as a separate link in the same header row (`add_attributions.py`). Charts using this schema include:

- Gödel Incompleteness Theorems
- Schemes & Sheaves (Grothendieck)
- Group Representations (Frobenius, Maschke)
- Riemannian Geometry
- ZFC Axioms
- Shannon Entropy
- C*-Algebras (Gelfand–Naimark)

## Example JSON

```json
{
  "primary": "Kurt Gödel",
  "contributors": [],
  "publication": "Über formal unentscheidbare Sätze der Principia Mathematica und verwandter Systeme I",
  "year": "1931",
  "doi": "https://doi.org/10.1007/BF01700692",
  "url": "https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems",
  "frontier_url": "https://arxiv.org/list/math.LO/recent",
  "frontier_label": "arXiv math.LO"
}
```

## Mathematics `metadata.json` (GCS)

For the **database table** (not individual chart HTML), add optional per-process fields so the table can show a Frontier column without opening each chart:

- `frontierUrl` — same idea as `frontier_url` above  
- `frontierLabel` — short label for the column  

You can also maintain a top-level map (e.g. `subcategoryToArxiv` / `frontierBySubcategory`) and merge into rows in a small build script.
