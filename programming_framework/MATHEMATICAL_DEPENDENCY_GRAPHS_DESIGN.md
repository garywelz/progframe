# Mathematical Dependency Graphs — Design Document

## Overview

A hybrid architecture for representing and visualizing axiomatic dependency structures across multiple mathematical subjects. Supports both static Mermaid subgraphs and interactive full-graph exploration.

---

## Scope: Target Subjects

| Subject | Foundations | Derived Items | Notes |
|---------|-------------|---------------|-------|
| **Euclid's Elements** | Postulates, Common Notions, Definitions | 464 Propositions (13 books) | Geometric constructions |
| **Peano Arithmetic** | 5 axioms, definitions | Theorems | Successor, induction |
| **Other number systems** | Axioms (integers, rationals, reals) | Theorems | Construction sequences |
| **Number theory** | Definitions, lemmas | Theorems | Divisibility, primes |
| **Algebra** | Group/ring/field axioms | Theorems | Abstract structures |
| **Contemporary geometry** | Modern axiom systems | Theorems | Metric, affine |
| **Hilbert's geometry** | 5 groups of axioms (incidence, order, congruence, etc.) | Theorems | *Grundlagen der Geometrie* |
| **Tarski's geometry** | Betweenness, congruence relations | Theorems | First-order, decidable |
| **Analysis** | Completeness, continuity axioms | Theorems | Real analysis, limits |

---

## Core JSON Schema

### Discourse (per subject)

```json
{
  "schemaVersion": "1.0",
  "discourse": {
    "id": "euclid-elements",
    "name": "Euclid's Elements",
    "subject": "geometry",
    "variant": "classical",
    "description": "The thirteen books of Euclidean geometry",
    "structure": {
      "books": 13,
      "chapters": "varies",
      "foundationTypes": ["postulate", "commonNotion", "definition"]
    }
  },
  "metadata": {
    "created": "2026-03-15",
    "lastUpdated": "2026-03-15",
    "version": "1.0.0",
    "license": "CC BY 4.0",
    "authors": ["Welz, G."],
    "methodology": "Programming Framework",
    "citation": "Welz, G. (2026). Euclid's Elements Dependency Graph. Programming Framework."
  },
  "sources": [
    {
      "id": "euclid-heath",
      "type": "primary",
      "authors": "Heath, T.L.",
      "title": "The Thirteen Books of Euclid's Elements",
      "year": "1908",
      "edition": "2nd",
      "publisher": "Cambridge University Press",
      "url": "https://archive.org/details/euclidheath00heatiala",
      "notes": "Standard English translation with commentary"
    },
    {
      "id": "perseus",
      "type": "digital",
      "title": "Euclid, Elements",
      "url": "http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0086",
      "notes": "Perseus Digital Library, Greek text with English"
    }
  ],
  "nodes": [
    {
      "id": "P1",
      "type": "postulate",
      "label": "Draw a straight line between two points",
      "shortLabel": "Post. 1",
      "book": 1,
      "number": 1,
      "colorClass": "postulate",
      "sourceRef": "euclid-heath, Book I, Postulate 1",
      "notes": "Also: Postulate 1 in most editions"
    },
    {
      "id": "Prop1",
      "type": "proposition",
      "label": "Construct an equilateral triangle on a given line",
      "shortLabel": "Prop. I.1",
      "book": 1,
      "number": 1,
      "colorClass": "proposition",
      "sourceRef": "euclid-heath, Book I, Proposition 1",
      "notes": "First proposition; depends only on P1, P3"
    }
  ],
  "edges": [
    {"from": "P1", "to": "Prop1"},
    {"from": "P3", "to": "Prop1"}
  ],
  "colorScheme": {
    "postulate": {"fill": "#e74c3c", "stroke": "#c0392b"},
    "commonNotion": {"fill": "#9b59b6", "stroke": "#8e44ad"},
    "proposition": {"fill": "#1abc9c", "stroke": "#16a085"},
    "definition": {"fill": "#3498db", "stroke": "#2980b9"},
    "theorem": {"fill": "#1abc9c", "stroke": "#16a085"}
  }
}
```

### Node Types (extensible)

| Type | Use Case |
|------|----------|
| `axiom` | Peano, Hilbert, Tarski |
| `postulate` | Euclid |
| `commonNotion` | Euclid |
| `definition` | All subjects |
| `proposition` | Euclid |
| `theorem` | Most subjects |
| `lemma` | Supporting results |
| `corollary` | Direct consequences |

### Cross-Discourse Links (future)

```json
{
  "from": "Prop_I_47",
  "to": "peano-theorem-42",
  "discourseFrom": "euclid-elements",
  "discourseTo": "peano-arithmetic",
  "relation": "constructive_correspondence"
}
```

---

## Hybrid Architecture

### 1. Canonical JSON (Source of Truth)

- One JSON file per discourse: `euclid-elements.json`, `peano-arithmetic.json`, etc.
- Stored in GCS or repo
- Human-editable, version-controlled
- Can be validated against schema

### 2. Mermaid Subgraph Generator

- **Input:** JSON + filter (e.g., `book=1`, `props=1-15`)
- **Output:** Mermaid `graph TD` string
- **Use:** Static HTML pages, PDF export, small-scope viewing
- **Limit:** ~50–80 nodes per diagram for readability

**Filter options:**
- `book`, `chapter`, `numberRange`
- `depth`: dependencies only, dependents only, or both
- `focus`: node ID + N-hop neighborhood

### 3. Interactive Viewer

- **Input:** Full JSON (or lazy-loaded by book)
- **Tech:** Cytoscape.js, vis.js, or Sigma.js
- **Features:**
  - Zoom, pan, minimap
  - Search by ID or label
  - Click node → highlight upstream/downstream
  - Filter by type, book, chapter
  - Cluster by book/chapter
  - Export subgraph as Mermaid
- **Deployment:** Single HTML + JS, fetches JSON from GCS

### 4. Index / Registry

```json
{
  "schemaVersion": "1.0",
  "lastUpdated": "2026-03-15",
  "discourses": [
    {
      "id": "euclid-elements",
      "name": "Euclid's Elements",
      "url": "https://.../euclid-elements.json",
      "nodeCount": 480,
      "edgeCount": 1200,
      "subjects": ["geometry"],
      "keywords": ["Euclid", "Elements", "plane geometry", "constructions"],
      "sources": [
        {"id": "euclid-heath", "authors": "Heath, T.L.", "title": "The Thirteen Books of Euclid's Elements", "year": "1908"}
      ],
      "metadata": {"version": "1.0.0", "lastUpdated": "2026-03-15"}
    },
    {
      "id": "peano-arithmetic",
      "name": "Peano Arithmetic",
      "url": "https://.../peano-arithmetic.json",
      "nodeCount": 85,
      "edgeCount": 120,
      "subjects": ["arithmetic", "foundations"],
      "keywords": ["Peano", "axioms", "induction", "successor"],
      "sources": [
        {"id": "peano-1889", "authors": "Peano, G.", "title": "Arithmetices principia", "year": "1889"}
      ],
      "metadata": {"version": "1.0.0", "lastUpdated": "2026-03-15"}
    }
  ]
}
```

---

## File Structure (Proposed)

```
mathematics-dependency-graphs/
├── schema/
│   └── discourse-schema.json          # JSON Schema for validation
├── data/
│   ├── index.json                     # Registry of all discourses
│   ├── euclid-elements.json
│   ├── peano-arithmetic.json
│   ├── hilbert-geometry.json
│   └── tarski-geometry.json
├── generator/
│   └── mermaid-from-json.js           # Subgraph → Mermaid
├── viewer/
│   ├── interactive-viewer.html        # Full interactive graph
│   └── viewer.js
└── static/                            # Pre-generated Mermaid pages
    ├── euclid/
    │   ├── book1-props-1-15.html
    │   ├── book1-props-16-30.html
    │   └── ...
    └── peano/
        └── ...
```

---

## Integration with Existing Systems

- **Mathematics Processes Database (GCS):** Static Mermaid pages can live in `processes/geometry_topology/` or a new `dependency-graphs/` folder
- **Programming Framework:** Same 5/6-color scheme; extend with subject-specific palettes (e.g., Tarski uses relation types)
- **GLMP-style collections:** Each discourse is a "collection"; index.json is the catalog

---

## Implementation Phases

| Phase | Deliverable |
|-------|-------------|
| **1** | Schema + Euclid Props 1–6 JSON; Mermaid generator script |
| **2** | Euclid Book I full JSON; static pages for Books I–IV |
| **3** | Interactive viewer (single discourse) |
| **4** | Peano Arithmetic, Hilbert Geometry JSON |
| **5** | Multi-discourse index; cross-discourse navigation |
| **6** | Tarski, Analysis, other subjects |

---

## Color Scheme Consistency

Use GLMP 6-color for *process* flowcharts (algorithms). For *dependency* graphs, allow subject-specific schemes:

- **Euclid:** Postulates (red), Common Notions (purple), Propositions (teal)
- **Peano:** Axioms (red), Definitions (yellow), Theorems (teal)
- **Hilbert:** Axiom groups (distinct colors), Theorems (teal)
- **Tarski:** Primitive relations (red), Defined relations (blue), Theorems (teal)

Schema supports `colorScheme` per discourse.

---

## Metadata & Sources

### Discourse-Level Metadata

| Field | Purpose |
|-------|---------|
| `metadata.created` | ISO date of initial creation |
| `metadata.lastUpdated` | ISO date of last edit |
| `metadata.version` | Semantic version (e.g., 1.0.0) |
| `metadata.license` | License (e.g., CC BY 4.0) |
| `metadata.authors` | Contributors to the dependency graph |
| `metadata.methodology` | e.g., Programming Framework |
| `metadata.citation` | How to cite this graph |

### Discourse-Level Sources

| Field | Purpose |
|-------|---------|
| `sources[].id` | Reference ID for node-level `sourceRef` |
| `sources[].type` | `primary`, `secondary`, `digital`, `commentary` |
| `sources[].authors` | Author(s) |
| `sources[].title` | Title of work |
| `sources[].year` | Publication year |
| `sources[].url` | Link to digital copy |
| `sources[].doi` | DOI if available |
| `sources[].notes` | Clarifications |

### Node-Level Metadata

| Field | Purpose |
|-------|---------|
| `sourceRef` | Reference to `sources[].id` + location (e.g., "euclid-heath, Book I, Prop 1") |
| `notes` | Editorial notes, variants, clarifications |
| `keywords` | Tags for search/filter |
| `relatedNodes` | IDs of conceptually related nodes (same discourse or cross-discourse) |

### Index / Registry Metadata

The index should include per-discourse: `sources`, `metadata`, `lastUpdated`, `nodeCount`, `edgeCount`, `subjects`, `keywords`.

---

## References

- Euclid's Elements: [Perseus Digital Library](http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0086)
- Heath, T.L. *The Thirteen Books of Euclid's Elements* (1908, 2nd ed.)
- Hilbert: *Grundlagen der Geometrie* (1899)
- Tarski: *What is Elementary Geometry?* (1959)
- Peano: *Arithmetices principia* (1889)
