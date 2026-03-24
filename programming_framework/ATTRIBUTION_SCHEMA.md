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

## Implementation

Attribution is embedded in chart HTML via a "Cite" badge in the header-meta area. Hovering over the badge reveals a popover with the full attribution details. Charts using this schema include:

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
  "url": "https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems"
}
```
