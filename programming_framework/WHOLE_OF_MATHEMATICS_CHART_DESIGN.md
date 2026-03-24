# Whole of Mathematics — Interactive Zoomable Chart Design

## Vision

A single, high-level interactive visualization that shows the **entire landscape of mathematics** as our collection understands it—with the ability to **zoom in** from broad domains down to individual processes, and to **click through** to the actual flowchart or dependency graph for any process.

Think of it as a "map of mathematics" that is:
- **Data-driven** — built from `metadata.json` and our hierarchy
- **Zoomable** — pan and zoom like a geographic map or Prezi
- **Drillable** — click a region to focus on it and see its children
- **Linked** — deepest level opens the existing process HTML page

---

## Domain Grouping: arXiv Math Taxonomy

Use the **arXiv Mathematics** taxonomy (math.XX) as the canonical domain structure. arXiv is widely recognized, stable, and aligns with how mathematicians categorize research.

### arXiv Math Categories (math.XX)

| Code | Name |
|------|------|
| math.AC | Commutative Algebra |
| math.AG | Algebraic Geometry |
| math.AP | Analysis of PDEs |
| math.AT | Algebraic Topology |
| math.CA | Classical Analysis and ODEs |
| math.CO | Combinatorics |
| math.CT | Category Theory |
| math.CV | Complex Variables |
| math.DG | Differential Geometry |
| math.DS | Dynamical Systems |
| math.FA | Functional Analysis |
| math.GM | General Mathematics |
| math.GN | General Topology |
| math.GR | Group Theory |
| math.GT | Geometric Topology |
| math.HO | History and Overview |
| math.IT | Information Theory |
| math.KT | K-Theory and Homology |
| math.LO | Logic |
| math.MG | Metric Geometry |
| math.MP | Mathematical Physics |
| math.NA | Numerical Analysis |
| math.NT | Number Theory |
| math.OA | Operator Algebras |
| math.OC | Optimization and Control |
| math.PR | Probability |
| math.QA | Quantum Algebra |
| math.RA | Rings and Algebras |
| math.RT | Representation Theory |
| math.SG | Symplectic Geometry |
| math.SP | Spectral Theory |
| math.ST | Statistics Theory |

### Mapping Our Subcategories → arXiv

| Our subcategory | arXiv code(s) |
|-----------------|---------------|
| abstract_algebra | math.GR, math.RA, math.AC |
| linear_algebra | math.RA |
| category_theory | math.CT |
| calculus_analysis | math.CA, math.CV, math.DS |
| geometry_topology | math.GN, math.GT, math.AT, math.DG, math.MG |
| number_theory | math.NT |
| discrete_mathematics | math.CO, math.LO |
| foundations | math.LO |
| bioinformatics | (applied; no direct math.XX; use math.GM or separate) |

*Wikipedia* math portal uses a flatter structure (Algebra, Analysis, Geometry, etc.)—can serve as a secondary grouping if we want a simpler top level.

---

## Hierarchy: What We're Mapping

### Level 0 — Whole of Mathematics (root)
The entire collection. One view.

### Level 1 — arXiv Math Domains (or grouped)
Either use arXiv codes directly (math.NT, math.AG, …) or group into ~6–8 broader areas for a simpler top level:

| Domain | arXiv codes | Our subcategories |
|--------|-------------|-------------------|
| **Algebra** | AC, AG, CT, GR, RA, RT, QA | abstract_algebra, linear_algebra, category_theory |
| **Analysis** | AP, CA, CV, FA, NA, SP | calculus_analysis, complex_analysis |
| **Geometry & Topology** | AT, DG, GN, GT, MG, SG | geometry_topology |
| **Number Theory** | NT | number_theory |
| **Discrete & Logic** | CO, LO | discrete_mathematics, foundations |
| **Dynamical Systems** | DS | (part of calculus_analysis) |
| **Probability & Statistics** | PR, ST | (future) |
| **Applied / Other** | GM, MP, OC, IT | bioinformatics |

### Level 2 — Subcategories
e.g., within **Analysis**: Real Analysis, Complex Analysis, Complex Dynamics, Symbolic Dynamics.

### Level 3 — Processes
Individual charts. Click → open process page.

---

## Force-Directed Graph: Deep Dive

### Why It Aligns With Our Current Metaphor

Our existing process charts are **node–link diagrams**:
- **Axiomatic theories**: nodes = axioms, definitions, theorems; edges = "depends on"
- **Algorithms**: nodes = steps; edges = control flow

A force-directed graph is the same visual language at a higher level: **nodes and edges**. It extends the dependency-graph metaphor from *within* a process to *between* processes and domains.

### Force-Directed vs. Treemap: Core Difference

| Aspect | Treemap | Force-Directed Graph |
|--------|---------|----------------------|
| **Structure** | Containment (parent *contains* children) | Links (nodes *connected* by edges) |
| **Relationships** | Implicit (nesting) | Explicit (edges) |
| **Hierarchy** | Strict tree; one parent per node | Can be tree, DAG, or general graph |
| **Cross-links** | Hard to show (a node lives in one place) | Natural (Galois ↔ Field Theory ↔ Group Theory) |
| **Layout** | Rectangles, area = weight | Organic; forces pull/push nodes |
| **Zoom** | Zoom into a region (geometric) | Pan/zoom canvas; click node to focus |

### Force-Directed *Can* Be Hierarchical

You can use a force-directed layout with **hierarchical constraints**:
- **Parent–child links**: domain → subcategory → process (tree edges)
- **Cross-links**: `namedCollections` overlap, or explicit "related to" (e.g., Galois Theory ↔ Field Theory)
- **Collision / clustering**: Give nodes of the same domain a "gravity" toward each other so they cluster
- **Level-based y-position**: Fix y by depth (root at top, processes at bottom) for a tree-like flow

So you get: **hierarchy + relationships** in one view.

### Zoom and Pan

Force-directed graphs support zoom and pan the same way as treemaps:
- Wrap the graph in an SVG `<g>` (group)
- Apply `d3.zoom()` to the SVG; transform the group on zoom/pan events
- **Geometric zoom**: scale + translate the whole canvas (simple)
- **Semantic zoom** (optional): at different zoom levels, show different detail (e.g., zoomed out = domains only; zoomed in = subcategories; further in = processes)

### Ease of Use With Our Collection

**Data we have:**
- `subcategory` per process → gives hierarchy (domain → subcategory → process)
- `processType` (algorithm vs axiomatic_theory) → can style nodes differently
- Process IDs and names → node labels and links

**Data we can add:**
- `namedCollections` → cross-links: two processes in "fermat" get an edge
- Optional `dependsOn` or `relatedTo` → explicit edges between processes

**Graph structure:**
```
Nodes:  [Mathematics (root)] + [~8 domains] + [~10 subcategories] + [~98 processes]
Edges:  Tree edges (parent→child) + optional cross-edges (namedCollections, relatedTo)
```

~120 nodes, ~100+ edges is well within D3 force layout comfort zone. No performance concerns.

### Relationship to Other Types

- **Treemap**: Force-directed shows *links*; treemap shows *containment*. Different metaphors. Treemap is "zoom into a region"; force-directed is "follow the edges."
- **Sunburst**: Both can show hierarchy. Sunburst is radial containment; force-directed is node-link. Sunburst is more compact; force-directed shows relationships.
- **Map metaphor**: Could use force-directed *for layout* (position nodes), then draw "regions" (Voronoi, convex hulls) around domain clusters—hybrid approach.

---

## Technical Approaches (Summary)

### Option A: D3 Zoomable Treemap
- Containment metaphor; area = count; no explicit edges.
- **Fit**: Pure hierarchy, no cross-links.

### Option B: D3 Sunburst
- Radial containment; compact.
- **Fit**: Hierarchy; explore later.

### Option C: Force-Directed Graph with Zoom ← **Primary choice**
- Node–link; explicit edges; aligns with our dependency-graph metaphor.
- **Fit**: Hierarchy + cross-links; zoom/pan; works with our collection.

### Option D: Map Metaphor
- Geographic feel; Voronoi or custom.
- **Fit**: Explore later.

### Option E: Hybrid
- Treemap + graph overlay.
- **Fit**: Explore later.

---

## Recommended: Force-Directed Graph (Option C) + Zoom + Breadcrumbs

**Why**: Aligns with our existing node–link dependency metaphor. Shows both hierarchy (domain → subcategory → process) and cross-links (e.g., via `namedCollections`). Zoom and pan are standard (D3 zoom on SVG group). ~120 nodes is trivial for D3 force. Breadcrumbs solve "where am I?" when zoomed.

**Data shape** (nodes + links for force-directed):

```json
{
  "nodes": [
    { "id": "root", "name": "Mathematics", "level": 0 },
    { "id": "algebra", "name": "Algebra", "level": 1 },
    { "id": "analysis", "name": "Analysis", "level": 1 },
    { "id": "abstract_algebra", "name": "Abstract Algebra", "level": 2 },
    { "id": "abstract_algebra-group-theory", "name": "Group Theory", "level": 3, "processId": "abstract_algebra-group-theory",
      "subcategory": "abstract_algebra", "url": "processes/abstract_algebra/abstract_algebra-group-theory.html" }
  ],
  "links": [
    { "source": "root", "target": "algebra" },
    { "source": "algebra", "target": "abstract_algebra" },
    { "source": "abstract_algebra", "target": "abstract_algebra-group-theory" },
    { "source": "abstract_algebra-field-theory", "target": "abstract_algebra-group-theory" }
  ]
}
```

`level` drives hierarchy. `links` include tree edges (parent→child) and optional cross-edges (e.g., Field Theory → Group Theory). `processId` and `url` at leaves for linking.

---

## Metadata Extensions for the Chart

### 1. Domain Mapping (arXiv-Based)

Add to `metadata.json`:

```json
{
  "domainHierarchy": {
    "algebra": {
      "name": "Algebra",
      "arxiv": ["math.AC", "math.AG", "math.CT", "math.GR", "math.RA", "math.RT", "math.QA"],
      "subcategories": ["abstract_algebra", "linear_algebra", "category_theory"]
    },
    "analysis": {
      "name": "Analysis",
      "arxiv": ["math.AP", "math.CA", "math.CV", "math.FA", "math.NA", "math.SP"],
      "subcategories": ["calculus_analysis", "complex_analysis"]
    },
    "geometry_topology": {
      "name": "Geometry & Topology",
      "arxiv": ["math.AT", "math.DG", "math.GN", "math.GT", "math.MG", "math.SG"],
      "subcategories": ["geometry_topology"]
    },
    "number_theory": {
      "name": "Number Theory",
      "arxiv": ["math.NT"],
      "subcategories": ["number_theory"]
    },
    "discrete_logic": {
      "name": "Discrete & Logic",
      "arxiv": ["math.CO", "math.LO"],
      "subcategories": ["discrete_mathematics", "foundations"]
    },
    "dynamical_systems": {
      "name": "Dynamical Systems",
      "arxiv": ["math.DS"],
      "subcategories": []
    },
    "applied": {
      "name": "Applied & Other",
      "arxiv": ["math.GM", "math.MP", "math.OC", "math.PR", "math.ST"],
      "subcategories": ["bioinformatics"]
    }
  },
  "subcategoryToArxiv": {
    "abstract_algebra": "math.GR",
    "calculus_analysis": "math.CA",
    "geometry_topology": "math.GT"
  }
}
```

### 2. Optional: Process-Level "Domain" Override

For processes that span domains (e.g., Category Theory), allow:

```json
{ "id": "...", "domain": "algebra", "subcategory": "category_theory" }
```

Default: derive domain from subcategory via `domainHierarchy`.

---

## Interaction Design

### Zoom & Pan
- **Scroll** or **pinch**: zoom in/out
- **Drag**: pan
- **Double-click** a region: zoom to fit that region (focus)
- **Breadcrumb click**: jump back to that level

### Click Behavior
- **Level 1–2** (domain, subcategory): zoom in to show children
- **Level 3** (process): open process page in new tab (or same tab with back)

### Visual Feedback
- **Hover**: highlight region, show tooltip (name + count)
- **Focus**: breadcrumb updates; optional sidebar with list of processes in current view
- **Cross-links**: if we add graph overlay, dim non-adjacent regions when hovering a node with many connections

---

## Responsive & Accessibility

- **Mobile**: Touch pan/zoom; larger hit targets for small regions; consider "list view" fallback when zoomed to a subcategory
- **Keyboard**: Tab through regions, Enter to zoom/select
- **Screen readers**: Breadcrumb + list of current level's items as text

---

## Implementation Phases

### Phase 1: Static Hierarchy + Force-Directed Graph
- Add `domainHierarchy` (arXiv-based) to metadata
- Build nodes + links from processes (domain → subcategory → process)
- Single HTML page with D3 force-directed graph + zoom/pan
- **Deliverable**: Working "Whole of Mathematics" graph with our current 98 processes

### Phase 2: Process Links
- Leaf nodes (processes) link to process HTML (using existing URL pattern)
- Breadcrumb navigation
- **Deliverable**: Full drill-down from root to process page

### Phase 3: Polish
- Tooltips, legend (colors = domains or arXiv codes)
- Optional "list view" toggle for current level
- **Deliverable**: Production-ready interactive chart

### Phase 4: Cross-Links (Optional)
- Use `namedCollections` to draw edges between related processes
- Or: "Related" panel when hovering a process
- **Deliverable**: Relationship-aware exploration

---

## Growing With the Collection

As we add:
- **New subcategories** (complex_analysis, landmark_theorems, formal_verification, ai_mathematics): extend `domainHierarchy` and subcategory→arXiv mapping
- **New processes**: they appear automatically (nodes + links derived from metadata)
- **Named mathematicians** (`namedCollections`): cross-edges between processes in the same collection; or a *second* view—"By Mathematician"—same graph structure but nodes grouped by collection. Toggle: "By Topic" | "By Mathematician"
- **New arXiv codes**: add to `domainHierarchy`; graph reflows

The chart is **always generated from metadata**—no manual diagram maintenance.

---

## Alternative: "Map" Metaphor (Future Enhancement)

For a more geographic feel:
- **Continents** = domains (irregular shapes, not rectangles)
- **Countries** = subcategories
- **Cities** = processes (dots or small regions)
- Layout: Voronoi tessellation or force-directed placement with "gravity" to keep siblings near each other
- Could use **MapLibre** or **Leaflet** with a custom "projection" that maps our hierarchy to 2D—playful and memorable

---

## Summary

| Aspect | Choice |
|--------|--------|
| **Visualization** | D3 force-directed graph (primary) |
| **Domain taxonomy** | arXiv math.XX (math.AC, math.NT, etc.) |
| **Data** | Nodes + links derived from metadata + `domainHierarchy` |
| **Levels** | 3: Domain → Subcategory → Process |
| **Edges** | Tree (parent→child) + optional cross-links (`namedCollections`) |
| **Interaction** | Zoom, pan, click-to-focus, breadcrumbs |
| **Leaf action** | Open process HTML page |
| **Growth** | Add to metadata; chart updates automatically |
| **Future** | Sunburst, map metaphor—explore later |

The "Whole of Mathematics" chart becomes the **entry point** to the database—a node–link visual index that matches our dependency-graph metaphor and scales with the collection.
