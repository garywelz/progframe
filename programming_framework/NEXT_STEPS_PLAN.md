# Mathematics Database — Next Steps Plan

Three initiatives: **Search** (near-term), **Comprehensive Collection** (mid-term), and **Research Frontier** (long-term).

---

## 1. Search the Collection

**Goal**: Place a search bar near the top of the table page. Users can search by theorem name, mathematician name, subcategory, or keyword and get links to individual charts or collection pages.

### 1.1 Search UI Placement
- Add a search box immediately after the header (before or alongside "Start Here")
- Design: Single input, optional filters (All / Algorithms / Axiomatic / Collection)
- Live/filter-as-you-type or "Search" button — both viable

### 1.2 Search Data Source
- **Client-side**: Load `metadata.json` (already fetched for the table); search in memory
- **Indexable fields** (extend metadata if needed):
  - `name` (process title) — e.g. "Fermat's Last Theorem", "Sieve of Eratosthenes"
  - `subcategory` / `subcategory_name` — e.g. "Number Theory", "Calculus & Analysis"
  - `namedCollections` (when added) — e.g. "euclid", "fermat", "sullivan"
  - Optional: add `keywords` or `searchTerms` array for aliases ("FLT", "Poincaré", "ZFC")

### 1.3 Search Algorithm
- **Simple**: Case-insensitive substring match on `name`, `subcategory_name`
- **Better**: Tokenize query, match against name + subcategory + collections
- **Fuzzy** (optional): Use a small library (e.g. Fuse.js) for typo tolerance

### 1.4 Results Display
- **Single process match** → link directly to process page
- **Collection match** (e.g. "Euclid") → link to collection landing page (or list of processes in that collection)
- **Multiple matches** → show dropdown or results panel with:
  - Process name + subcategory
  - Link to process page
  - "Part of: Euclid, Geometry & Topology" (when namedCollections exists)

### 1.5 Metadata Enhancements for Search
- Add `namedCollections` to processes (per expansion plan)
- Optional: `keywords: ["FLT", "Fermat", "Wiles"]` for common aliases
- Optional: `theorems: ["Modularity Theorem", "Fermat's Last Theorem"]` for axiomatic theories

### 1.6 Implementation Scope
| Task | Effort |
|------|--------|
| Add search input + results dropdown | Small |
| Client-side search over `metadata.json` | Small |
| Add `namedCollections` to metadata (partial) | Medium |
| Collection landing pages for multi-result | Medium |

---

## 2. Plan to Fill Out the Collection (Comprehensive)

Build on [MATHEMATICS_DATABASE_EXPANSION_PLAN.md](./MATHEMATICS_DATABASE_EXPANSION_PLAN.md). Aim for a representative, well-structured set across major areas.

### 2.1 Coverage Goals by Domain

| Domain | Current | Target | Priority Additions |
|--------|---------|--------|-------------------|
| **Algebra** | Strong | Maintain + expand | Cayley-Hamilton, Noether, Representation theory |
| **Analysis** | Good | Expand | Complex analysis (4 charts), Functional analysis basics |
| **Geometry & Topology** | Good | Expand | Milnor exotic spheres, Thurston geometrization |
| **Number Theory** | Good | Expand | Landmark theorems (FLT, Riemann), Fermat's Little Theorem |
| **Discrete & Logic** | Strong | Maintain | Add combinatorics algorithms (inclusion-exclusion, generating functions) |
| **Applied** | Bioinformatics only | Expand | Statistics/probability, optimization basics |

### 2.2 Landmark Theorems (High Impact)
- Fermat's Last Theorem (Wiles, modularity)
- Poincaré Conjecture (Perelman, Ricci flow)
- Riemann Hypothesis (statement, equivalent forms)
- Four Color Theorem (Appel–Haken, formalization)
- Gödel Incompleteness (already present via Peano)

### 2.3 Gaps to Fill
- **Complex Analysis**: Cauchy, residues, conformal maps
- **Statistics & Probability**: Kolmogorov axioms, Central Limit Theorem, Bayes
- **Numerical Methods**: More algorithms (Newton, Euler methods, quadrature)
- **Representation Theory**: Basics (groups, characters)
- **Differential Geometry**: Curves, surfaces, Riemannian basics

### 2.4 Phased Rollout (from expansion plan, refined)

| Phase | Focus | Charts (approx) |
|-------|-------|-----------------|
| **1** | Schema + search + `namedCollections` | 0 new charts |
| **2** | Landmark theorems (FLT, Poincaré, Riemann) | 3–5 |
| **3** | Complex analysis | 4 |
| **4** | Named mathematicians (batch 1: Fermat, Euler, Gauss, Euclid tag) | 5–8 |
| **5** | Named mathematicians (batch 2: Galois, Noether, Hilbert, Riemann) | 5–8 |
| **6** | Statistics & probability | 3–5 |
| **7** | Formal verification (Lean, Four Color in Coq) | 3–4 |
| **8** | AI mathematics (AlphaProof, AlphaGeometry) | 2–3 |

### 2.5 Definition of "Fairly Comprehensive"
- All 6 domains have ≥5 distinct charts
- Every subcategory has at least 1 chart
- Landmark theorems (FLT, Poincaré, Riemann) represented
- Major figures (Euclid, Euler, Gauss, Fermat, Gödel, Galois) have at least one chart
- ~150–200 total processes as a stretch goal

---

## 3. Long-Term: Research Frontier & Conjectures

**Goal**: Update axiomatic theory trees to show recent theorems, open conjectures, and the frontier of research — making the dependency graphs reflect the state of the field, not just classic textbook material.

### 3.1 What "Frontier" Means
- **Recent theorems**: Results from the last 20–30 years (e.g. Perelman/geometrization, Taylor–Wiles modularity)
- **Conjectures**: Stated but unproven (Riemann, Birch–Swinnerton-Dyer, Hodge, P vs NP)
- **Formalization status**: What is in Mathlib/Lean, what remains to be formalized

### 3.2 Data Sources for Frontier Content
- **arXiv**: Recent math.NT, math.GT, math.AG, etc. — identify major theorems
- **Mathlib / formalization**: Lean 4, Coq, Isabelle — which theorems are proved
- **Surveys & encyclopedias**: Wikipedia, Encyclopaedia of Mathematics, Scholarpedia
- **Clay Institute, Hilbert problems**: Lists of major open problems

### 3.3 Schema Extensions
- **Node metadata** in dependency graphs:
  - `status`: `proved` | `conjecture` | `open_problem` | `formalized`
  - `year`: publication or proof year
  - `prover`: e.g. "Wiles", "Perelman", "Gonthier et al."
  - `formalization`: e.g. `{ "tool": "Lean", "status": "in_progress" }`
- **Process-level**:
  - `frontierLevel`: `classical` | `modern` | `recent` | `conjecture`
  - `openProblems`: array of conjecture names

### 3.4 Visualization Ideas
- **Color coding**: Green (proved), yellow (recent), orange (conjecture), grey (formalized)
- **"Expand to frontier"** control: Toggle to show/hide conjectures and recent theorems
- **Year annotations**: Small labels on nodes (e.g. "1995", "2003")
- **Separate "Conjectures" section**: Page listing open problems with links to related axiom–theorem trees

### 3.5 Implementation Phases (Long-Term)
| Phase | Focus |
|-------|-------|
| **A** | Add `status`, `year` to process metadata (manual curation) |
| **B** | Extend Mermaid/diagram format to support status annotations |
| **C** | Curate 5–10 landmark theorems with frontier metadata |
| **D** | Build "Open Problems" index page |
| **E** | Integrate formalization status (Mathlib, etc.) where available |

### 3.6 Challenges
- **Curation effort**: Requires domain expertise to classify and annotate
- **Currency**: Frontier changes; need update process (annual review?)
- **Formalization**: Mathlib evolves; linking to specific commits or versions
- **Scope creep**: Easy to expand; need clear criteria for "frontier"

### 3.7 Sample Implemented: Number Theory Research Frontier
- **Page**: `number-theory-research-frontier.html` — static view of proved vs conjecture
- **Metadata**: `frontierStatus`, `year`, `prover` added to Sieve, Szemerédi, Green–Tao in `metadata.json`
- **Linked** from database table "Start Here" section
- **Contents**: Classical (Sieve, Extended Euclidean, Gödel), recent (Szemerédi 1975, Green–Tao 2004, Fermat 1995, Mordell 1983), conjectures (Riemann, BSD, Goldbach, Twin Primes)

---

## Summary: Immediate Next Steps

1. **Search** (1–2 days): Add search input, client-side search over metadata, results dropdown with links.
2. **Expansion plan** (ongoing): Execute phases from MATHEMATICS_DATABASE_EXPANSION_PLAN.md; use this doc for prioritization.
3. **Frontier** (quarterly/yearly): Start with schema additions and manual curation of a few landmark results; build out as capacity allows.
