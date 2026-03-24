# Mathematics Database — Next Pass Checklist

A prioritized checklist for the next major revision: Cite links, Frontier sections, and uniform color scheme.

---

## Phase 0: Database Table Page (Intro & Start Here) — DONE ✓

- [x] Concise introduction at top (conceptual-framing)
- [x] Move search box into "Start Here" section
- [x] Remove "Named Collections" (avoids who-is-named complaints)
- [x] Start Here: search field + link to Whole of Mathematics
- [x] Describe Whole of Mathematics as "Interactive UI" in link text

---

## Reference: 5/6-Color Scheme (GLMP)

Use this palette across all charts for consistency:

| Role | Hex | Semantic |
|------|-----|----------|
| Red | `#ff6b6b` | Triggers, inputs, postulates |
| Yellow | `#ffd43b` | Structures, objects |
| Green | `#51cf66` | Processing, operations, propositions |
| Light blue | `#74c0fc` | Intermediates, states |
| Violet | `#b197fc` | Products, outputs |
| Lavender | `#e6e6fa` | Decision diamonds (algorithms only) |

**Axiomatic/dependency chart mapping:**
| Node type    | Hex        | Role                    |
|--------------|------------|--------------------------|
| Axiom        | `#ff6b6b`  | Red — inputs, postulates |
| Postulate    | `#ff6b6b`  | Red — same as axiom      |
| CommonNotion | `#ffd43b`  | Yellow — structures      |
| Definition   | `#b197fc`  | Violet — products        |
| Lemma        | `#74c0fc`  | Light blue — intermediates|
| Theorem      | `#51cf66`  | Green — propositions     |
| Corollary    | `#1abc9c`  | Teal                     |
| Proposition  | `#51cf66`  | Green — same as theorem  |
| Reference    | `#bdc3c7`  | Gray                     |

---

## Phase 1: Cite Links

Add attribution (Cite badge + popover) to charts with identifiable primary sources.

### Already have Cite (7)
- [x] Gödel First Incompleteness
- [x] Schemes & Sheaves (Grothendieck)
- [x] Group Representations
- [x] Riemannian Geometry
- [x] ZFC Axioms
- [x] Shannon Entropy
- [x] C*-Algebras

### High priority (add Cite)
- [ ] Euclid's Elements charts
- [ ] Peano Arithmetic (Landau, Kirby–Paris)
- [ ] Szemerédi Theorem
- [ ] Green–Tao Theorem
- [ ] Galois Theory (Field Theory charts)
- [ ] Cauchy / Complex Analysis charts
- [ ] Sullivan collection charts
- [ ] Hubbard–Douady collection
- [ ] Devaney collection
- [ ] Kolmogorov axioms, Bayes, CLT (Statistics)
- [ ] NIST DADS algorithms (Binary Search, etc.)

### Medium priority
- [ ] PDE charts (Laplace, Heat, Wave)
- [ ] Functional analysis (Banach, Hilbert)
- [ ] Spectral theory charts
- [ ] Representation theory (remaining)
- [ ] Commutative algebra charts

### Schema
See `ATTRIBUTION_SCHEMA.md`. Fields: `primary`, `contributors`, `publication`, `year`, `doi`, `url`.

---

## Phase 2: Frontier of Research Links

Add or expand "Recent & Frontier" sections on index pages. Each section: proved results, open conjectures, links to charts, links to arXiv/external.

### Already have Recent & Frontier (3)
- [x] Number Theory
- [x] Algebraic Geometry
- [x] Representation Theory

### Add Frontier section
- [x] Differential Geometry
- [x] Complex Analysis
- [x] Statistics & Probability
- [x] Partial Differential Equations
- [x] Foundations (set theory, logic)
- [x] Calculus / Real Analysis
- [x] Functional Analysis
- [x] Topology (geometry_topology index)
- [x] Operator Algebras
- [x] K-Theory

### Template
Use the pattern from `algebraic_geometry.html`: `.frontier-item.proved` (green border), `.frontier-item.conjecture` (orange border), with `.name`, `.meta`, and chart/external links.

---

## Phase 3: Uniform Color Scheme

Apply the 5/6-color palette to all charts. Replace per-subcategory accent colors with the standard palette.

### Algorithm flowcharts (already mostly correct)
- [x] Sieve, Extended Euclidean, Dijkstra, Prim, Kruskal, BFS
- [x] Binary Search, RSA, AES, Merge Sort, Quicksort, BST
- [x] Bisection, Simpson's Rule
- [x] Bioinformatics (BLAST, sequence alignment)
- [x] Verify any outliers use standard colors

### Axiomatic / dependency charts
- [x] Gödel / Peano charts — map Def/Lem/Thm/Cor to palette
- [x] Euclid's Elements — align postulate/common notion/proposition colors
- [x] ZFC / Foundations
- [x] Abstract algebra, algebraic geometry, representation theory, differential geometry, spectral theory, symplectic, metric geometry

### P3 charts (operator algebras, K-theory, quantum algebra, optimization, information theory, mathematical physics)
- [x] Replace subcategory-specific header/node colors with 5-color palette
- [x] Header: database orange #e67e22
- [x] Mermaid nodes: Def → Violet, Thm → Green

### Header / nav consistency
- [x] Standardize header to database orange #e67e22
- [x] Nav link colors: #e67e22

---

## Phase 4: Optional Enhancements (if time)

### Content
- [x] Landmark theorem charts: FLT, Riemann Hypothesis (high-level)
- [x] Modular arithmetic: CRT (Chinese Remainder Theorem)
- [ ] Primality tests (future)
- [ ] `namedCollections` metadata for cross-linking (Euclid, Gödel, Galois, etc.)

### Infrastructure
- [x] Formal verification links (Lean, Coq)
- [x] AI mathematics (AlphaProof, AlphaGeometry)
- [x] math.HO (History & Overview) — added to Number Theory, Foundations

---

## Execution Order

1. **Phase 3 (Color)** — Do first; it's a bulk replace across many files. Establishes visual consistency before adding content.
2. **Phase 1 (Cite)** — Add attribution to charts that have clear sources. Can be done incrementally.
3. **Phase 2 (Frontier)** — Add Recent & Frontier sections to remaining index pages. Lower effort, high value.
4. **Phase 4** — As capacity allows.

---

## Files to Modify

### Color scheme
- All `processes/**/*.html` with Mermaid `classDef` blocks
- Generator templates: `generate_p3_charts.py` (P3 charts)
- Possibly: shared CSS or build step for future automation

### Cite
- Add attribution HTML + CSS to each chart; or extend generator/template for batch charts
- Update `ATTRIBUTION_SCHEMA.md` if schema changes

### Frontier
- Index pages: `processes/<subcategory>/<subcategory>.html` (e.g. `processes/differential_geometry/differential_geometry.html`)

---

## Completion Criteria

- [ ] All charts with identifiable sources have Cite badge
- [ ] All major index pages have Recent & Frontier section
- [ ] All charts use the 5/6-color palette (no stray per-chart accent colors in node fills)
- [ ] Header/nav colors are consistent (or explicitly documented as domain accents)
