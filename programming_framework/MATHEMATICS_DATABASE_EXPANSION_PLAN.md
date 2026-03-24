# Mathematics Database Expansion Plan

## Overview

Expand the mathematics-database-table and processes to include:
- **Topic sections**: Complex analysis, complex analytic dynamics, landmark theorems (FLT, Poincaré, Riemann)
- **Named mathematicians**: Historical and modern figures with associated charts
- **Formal verification**: Lean proofs and proof assistants
- **AI mathematics**: Recent AI-assisted results
- **Overlapping collections**: Processes appear in multiple named sets (topic + mathematician + historical)

---

## 1. Metadata Schema Extension

### Add `namedCollections` Array to Each Process

```json
{
  "id": "number_theory-fermat-last-theorem",
  "name": "Fermat's Last Theorem",
  "subcategory": "number_theory",
  "namedCollections": ["fermat", "landmark_theorems", "wiles", "number_theory_milestones"]
}
```

**Rationale**: A process can belong to many collections. Examples:
- *Euclid's Elements* → `["euclid", "geometry_topology", "classical_geometry", "axiomatic_systems"]`
- *Galois Theory* → `["galois", "abstract_algebra", "field_theory", "landmark_theorems"]`
- *Sieve of Eratosthenes* → `["eratosthenes", "number_theory", "algorithms", "classical_algorithms"]`

### Optional: Add `collections` Index in metadata.json

```json
{
  "collections": {
    "archimedes": { "name": "Archimedes", "description": "…", "processIds": ["…"] },
    "fermat": { "name": "Pierre de Fermat", "description": "…", "processIds": ["…"] }
  }
}
```

Either derive from processes (scan `namedCollections`) or maintain explicitly.

---

## 2. New Subcategories

| Subcategory ID        | Display Name           | Notes                                      |
|-----------------------|------------------------|--------------------------------------------|
| `complex_analysis`    | Complex Analysis       | New; analytic functions, residues, etc.    |
| `landmark_theorems`   | Landmark Theorems      | FLT, Poincaré, Riemann, etc.              |
| `formal_verification` | Formal Verification    | Lean, Coq, Isabelle proofs                 |
| `ai_mathematics`      | AI Mathematics         | AlphaProof, AlphaGeometry, etc.           |

**Existing** (keep): `number_theory`, `geometry_topology`, `discrete_mathematics`, `linear_algebra`, `calculus_analysis`, `abstract_algebra`, `category_theory`, `foundations`, `bioinformatics`.

---

## 3. Topic Sections (New Charts)

### 3.1 Complex Analysis
- **Complex Analysis — Analytic Functions & Cauchy-Riemann**
- **Complex Analysis — Cauchy Integral Theorem & Residues**
- **Complex Analysis — Conformal Mappings & Riemann Surfaces**
- **Complex Analysis — Entire Functions & Picard Theorems**

*Collections*: `complex_analysis`, `calculus_analysis` (overlap)

### 3.2 Complex Analytic Dynamics (extend existing)
- Already have: Julia/Fatou, Sullivan, Hubbard-Douady, Devaney, etc.
- Add: **Complex Dynamics — Holomorphic Dynamics Overview** (hub/overview)
- Add: **Complex Dynamics — Parabolic Fixed Points & Écalle-Voronin**

*Collections*: `complex_dynamics`, `calculus_analysis`, `sullivan`, `hubbard_douady`, `devaney`

### 3.3 Landmark Theorems
| Chart                         | Subcategory        | Named Collections                    |
|------------------------------|--------------------|-------------------------------------|
| Fermat's Last Theorem        | `landmark_theorems`| `fermat`, `wiles`, `number_theory`  |
| Poincaré Conjecture          | `landmark_theorems`| `poincare`, `perelman`, `topology`   |
| Riemann Hypothesis           | `landmark_theorems`| `riemann`, `number_theory`, `analysis` |
| Four Color Theorem           | `landmark_theorems`| `appel_haken`, `graph_theory`        |
| Gödel Incompleteness         | (existing)         | `godel`, `foundations`              |

---

## 4. Named Mathematicians — Charts to Create

### 4.1 Classical (Ancient & Early Modern)
| Mathematician   | Charts to Create                                      | Overlaps With              |
|----------------|--------------------------------------------------------|----------------------------|
| **Archimedes** | Archimedes' Principle, Method of Exhaustion, Pi bounds | `geometry_topology`, `calculus` |
| **Eratosthenes** | Sieve (existing), Earth circumference, Prime counting | `number_theory`, `algorithms` |
| **Pythagoras** | Pythagorean Theorem, Pythagorean triples, Irrationals | `geometry_topology`, `number_theory` |
| **Euclid**    | Elements (existing), Euclidean algorithm              | `geometry_topology`        |

### 4.2 Early Modern
| Mathematician | Charts to Create                                      | Overlaps With        |
|---------------|--------------------------------------------------------|----------------------|
| **Fermat**    | Fermat's Last Theorem, Fermat's Little Theorem, Fermat primes | `number_theory`, `landmark_theorems` |
| **Euler**    | Euler's formula (e^(iπ)+1=0), Euler characteristic, Seven Bridges | `calculus_analysis`, `graph_theory`, `topology` |
| **Gauss**    | Fundamental Theorem of Algebra, Gaussian integers, Least squares | `number_theory`, `linear_algebra`, `calculus` |

### 4.3 19th–20th Century
| Mathematician      | Charts to Create                                      | Overlaps With        |
|-------------------|--------------------------------------------------------|----------------------|
| **Galois**        | Galois Theory (existing), Solvability by radicals      | `abstract_algebra`, `field_theory` |
| **Cayley**        | Cayley's theorem (groups), Cayley-Hamilton theorem     | `abstract_algebra`, `linear_algebra` |
| **Hamilton**     | Quaternions, Hamiltonian mechanics, Cayley-Hamilton     | `linear_algebra`, `physics` |
| **Noether**      | Noether's theorems, Noetherian rings, Abstract algebra | `abstract_algebra`, `physics` |
| **Hilbert**      | Hilbert's problems, Hilbert space, Basis theorem       | `foundations`, `linear_algebra`, `analysis` |
| **Riemann**      | Riemann Hypothesis, Riemann surfaces, Riemann integral | `number_theory`, `calculus_analysis`, `complex_analysis` |

### 4.4 Modern (20th–21st Century)
| Mathematician | Charts to Create                                      | Overlaps With        |
|--------------|--------------------------------------------------------|----------------------|
| **Thurston** | Geometrization conjecture, Hyperbolic 3-manifolds       | `geometry_topology`, `poincare` |
| **Milnor**   | Exotic spheres, Milnor's theorem, Morse theory         | `geometry_topology`, `differential_topology` |
| **Faltings** | Mordell conjecture, Faltings' theorem (FLT for n>4)    | `number_theory`, `fermat`, `algebraic_geometry` |
| **Atiyah**   | Atiyah-Singer index theorem, K-theory                 | `geometry_topology`, `analysis` |
| **Perelman** | Ricci flow, Poincaré proof                             | `landmark_theorems`, `poincare` |
| **Wiles**    | Modularity theorem, FLT proof                        | `landmark_theorems`, `fermat` |

### 4.5 Additional Candidates (for later)
- **Gödel** (existing via Peano)
- **Turing** (computability, halting problem)
- **Kolmogorov** (probability, complexity)
- **Grothendieck** (schemes, topos theory)
- **Serre** (algebraic geometry, number theory)
- **Deligne** (Weil conjectures)
- **Tao** (existing: Green-Tao)
- **Szemerédi** (existing)
- **Sullivan** (existing)
- **Hubbard, Douady, Devaney** (existing)

---

## 5. Formal Verification (Lean Proofs)

### 5.1 New Subcategory: `formal_verification`

| Chart                              | Description                                      |
|-----------------------------------|--------------------------------------------------|
| Lean 4 — Proof Assistant Overview | What Lean is, tactic language, type theory       |
| Mathlib — Library Structure       | Mathlib dependency graph, key namespaces         |
| Fermat's Last Theorem in Lean    | FLT statement and proof status in Lean          |
| Kepler Conjecture (Flyspeck)      | Hales' proof, formalization in HOL Light         |
| Four Color Theorem in Coq        | Gonthier's formalization                         |
| Odd Order Theorem (Feit-Thompson)| Gonthier et al. formalization                   |

*Collections*: `lean`, `formal_verification`, `landmark_theorems` (where applicable)

---

## 6. AI Mathematics

### 6.1 New Subcategory: `ai_mathematics`

| Chart                                  | Description                                      |
|----------------------------------------|--------------------------------------------------|
| AlphaProof (DeepMind 2024)             | IMO results, statement proving                  |
| AlphaGeometry (DeepMind 2024)          | Synthetic geometry, IMO-style problems          |
| AI-Assisted Proof Discovery            | Overview: GPT, Lean, collaboration               |
| Ramanujan Machine / Conjecture Generation | Automated conjecture generation              |
| Formalization Gaps (AI + Human)        | What remains to be formalized                    |

*Collections*: `ai_mathematics`, `formal_verification` (overlap)

---

## 7. Table Structure — Section Headers & Breaks

### 7.1 Proposed Table Sections (with breaks)

1. **Algorithms — Flowcharts** (existing)
2. **Axiomatic Theories — Dependency Graphs** (existing)
3. **Landmark Theorems** (new section)
4. **Complex Analysis & Dynamics** (new or merged into Calculus & Analysis)
5. **Formal Verification (Lean, Coq, etc.)** (new)
6. **AI Mathematics** (new)

### 7.2 Named Collections Panel (expand)

Current: Euclid, Tao, Peano, Gödel, Sullivan, Hubbard & Douady, Devaney, Smale, Bioinformatics

**Add**:
- Archimedes, Eratosthenes, Pythagoras
- Fermat, Euler, Gauss
- Galois, Cayley, Hamilton, Noether, Hilbert
- Riemann, Thurston, Milnor, Faltings, Atiyah
- Wiles, Perelman
- Lean / Formal Verification
- AI Mathematics

**Implementation**: Either (a) one link per collection → landing page listing all processes in that collection, or (b) first/representative process. Prefer (a) for multi-process collections.

---

## 8. Overlap Handling

### 8.1 Process in Multiple Collections

Example: **Fermat's Last Theorem**
- `subcategory`: `landmark_theorems`
- `namedCollections`: `["fermat", "wiles", "number_theory", "landmark_theorems"]`

Appears in:
- Landmark Theorems table section
- Fermat collection page
- Wiles collection page
- Number Theory subcategory filter

### 8.2 Collection Landing Pages

Create `processes/collections/` (or similar):
- `collections/fermat.html` — lists all processes with `namedCollections` containing `fermat`
- `collections/euler.html`
- `collections/landmark_theorems.html`
- etc.

These can be generated from metadata or static HTML with links derived from metadata.

### 8.3 Table Filtering (Optional)

Add filter dropdown: "Show by collection: All | Fermat | Euler | Landmark Theorems | …"

---

## 9. Implementation Phases

### Phase 1: Schema & Infrastructure
- Add `namedCollections` to metadata schema
- Add new subcategories to metadata
- Create collection landing page template
- Update table to support new sections and breaks

### Phase 2: Landmark Theorems
- Fermat's Last Theorem
- Poincaré Conjecture
- Riemann Hypothesis
- (Optional) Four Color, Gödel as landmark)

### Phase 3: Complex Analysis
- 3–4 complex analysis charts
- Ensure overlap with existing complex dynamics

### Phase 4: Named Mathematicians (Batch 1)
- Archimedes, Eratosthenes, Pythagoras
- Fermat, Euler, Gauss
- Tag existing processes (Euclid, Sieve, etc.) with `namedCollections`

### Phase 5: Named Mathematicians (Batch 2)
- Galois, Cayley, Hamilton, Noether, Hilbert
- Riemann, Thurston, Milnor, Faltings, Atiyah
- Wiles, Perelman

### Phase 6: Formal Verification
- Lean overview
- 2–3 key formalized results (FLT, Four Color, etc.)

### Phase 7: AI Mathematics
- AlphaProof, AlphaGeometry
- AI-assisted proof overview

---

## 10. File Naming Conventions

- `number_theory-fermat-last-theorem.html`
- `landmark_theorems-poincare-conjecture.html`
- `landmark_theorems-riemann-hypothesis.html`
- `complex_analysis-cauchy-integral-theorem.html`
- `formal_verification-lean-flt.html`
- `ai_mathematics-alphaproof.html`
- `collections/fermat.html` (collection index)

---

## 11. Summary: New Content Counts (Estimate)

| Category              | New Charts (approx) |
|-----------------------|---------------------|
| Complex Analysis      | 4                   |
| Landmark Theorems     | 3–5                 |
| Named Mathematicians  | 15–25 (many overlap)|
| Formal Verification   | 4–6                 |
| AI Mathematics        | 3–5                 |
| **Total new**         | **~30–45**          |

Many of these overlap (e.g., Fermat chart counts for Fermat, Wiles, Landmark Theorems, Number Theory). The `namedCollections` array is the key to supporting this overlap cleanly.
