# Mathematics Database — arXiv Subject Areas To-Do

A prioritized list of arXiv mathematics subject areas to add for a more complete collection, aligned with [arXiv math taxonomy](https://arxiv.org/category_taxonomy).

---

## Current Coverage (What We Have)

| Domain | Subcategories | arXiv codes covered | Gaps |
|--------|---------------|---------------------|------|
| **Algebra** | abstract_algebra, linear_algebra, category_theory | math.GR, math.RA, math.CT, math.AC, math.AG, math.QA | Commutative algebra, Algebraic geometry, Representation theory, Quantum algebra |
| **Analysis** | calculus_analysis | math.CA, math.CV, math.DS, math.FA, math.AP, math.NA, math.SP | Complex analysis, Functional analysis, PDEs, Numerical analysis, Spectral theory |
| **Geometry & Topology** | geometry_topology | math.GT, math.AT, math.DG, math.GN, math.MG, math.SG | Metric geometry, Symplectic geometry (light) |
| **Number Theory** | number_theory | math.NT | ✓ Good |
| **Discrete & Logic** | discrete_mathematics, foundations | math.CO, math.LO | ✓ Good |
| **Applied & Other** | bioinformatics, statistics_probability | math.GM, math.ST | Statistics/Probability empty |

---

## To-Do List: Subject Areas to Add (Near Term)

### Priority 1 — High Impact, Partially Covered or Empty

| # | arXiv Code | Subject Area | Notes | Suggested Subcategory |
|---|------------|--------------|-------|------------------------|
| 1 | math.ST | **Statistics & Probability Theory** | 0 charts currently; foundational for applied math | `statistics_probability` (exists, populate) |
| 2 | math.PR | **Probability** | CLT, stochastic processes, SDEs; distinct from statistics | merge into `statistics_probability` or add `probability` |
| 3 | math.CV | **Complex Variables** | Holomorphic functions, residues, conformal maps; partially in calculus_analysis | add `complex_analysis` or extend calculus_analysis |
| 4 | math.FA | **Functional Analysis** | Banach spaces, Hilbert spaces, distributions | add to calculus_analysis or new `functional_analysis` |
| 5 | math.NA | **Numerical Analysis** | Newton-Raphson, bisection exist; add quadrature, linear solvers, ODE solvers | extend calculus_analysis or add `numerical_analysis` |
| 6 | math.AG | **Algebraic Geometry** | Varieties, schemes, moduli; major area | add `algebraic_geometry` or extend abstract_algebra |
| 7 | math.RT | **Representation Theory** | Representations of groups, Lie algebras | add `representation_theory` or extend abstract_algebra |

### Priority 2 — Core Pure Math Gaps

| # | arXiv Code | Subject Area | Notes | Suggested Subcategory |
|---|------------|--------------|-------|------------------------|
| 8 | math.AC | **Commutative Algebra** | Rings, ideals, Noetherian; differs from Ring Theory (noncommutative focus) | add `commutative_algebra` |
| 9 | math.AP | **Analysis of PDEs** | Existence, uniqueness, qualitative dynamics | add `partial_differential_equations` or extend analysis |
| 10 | math.DG | **Differential Geometry** | Curves, surfaces, Riemannian; some in geometry_topology | ensure distinct charts for differential geometry |
| 11 | math.SP | **Spectral Theory** | Schrödinger operators, spectral analysis | add to analysis or `spectral_theory` |
| 12 | math.SG | **Symplectic Geometry** | Hamiltonian systems, symplectic manifolds | extend geometry_topology |
| 13 | math.MG | **Metric Geometry** | Euclidean, hyperbolic, discrete geometry | extend geometry_topology |

### Priority 3 — Advanced / Specialized

| # | arXiv Code | Subject Area | Notes | Suggested Subcategory |
|---|------------|--------------|-------|------------------------|
| 14 | math.OA | **Operator Algebras** | C*-algebras, von Neumann algebras | add `operator_algebras` |
| 15 | math.KT | **K-Theory and Homology** | Algebraic/topological K-theory | add `k_theory` or extend algebraic topology |
| 16 | math.QA | **Quantum Algebra** | Quantum groups, operads | extend abstract_algebra |
| 17 | math.OC | **Optimization and Control** | Linear programming, optimal control | add `optimization` |
| 18 | math.IT | **Information Theory** | Coding, entropy, channel capacity | add `information_theory` |
| 19 | math.MP | **Mathematical Physics** | Rigorous formulations of physical theories | add `mathematical_physics` |
| 20 | math.HO | **History and Overview** | Biographies, education, philosophy | optional `history_overview` |

### Priority 4 — Already in Expansion Plan

These are in [MATHEMATICS_DATABASE_EXPANSION_PLAN.md](./MATHEMATICS_DATABASE_EXPANSION_PLAN.md):

- **Complex Analysis** (math.CV) — 4 charts planned
- **Landmark Theorems** — FLT, Poincaré, Riemann
- **Formal Verification** — Lean, Coq
- **AI Mathematics** — AlphaProof, AlphaGeometry

---

## Suggested Implementation Order

### Phase A (1–2 weeks): Fill Empty & High-Impact
1. **Statistics & Probability** — Kolmogorov axioms, Bayes, CLT (3–5 charts)
2. **Complex Analysis** — Cauchy, residues, conformal maps (4 charts per expansion plan)
3. **Functional Analysis** — Banach/Hilbert spaces basics (2–3 charts)

### Phase B (2–4 weeks): Algebra & Geometry Gaps
4. **Algebraic Geometry** — Varieties, schemes intro (2–3 charts)
5. **Representation Theory** — Group representations, characters (2–3 charts)
6. **Numerical Analysis** — Quadrature, solvers, ODE methods (3–4 charts)

### Phase C (4–6 weeks): PDEs, Operator Theory, Applied
7. **PDEs** — Heat, wave, Laplace; existence/uniqueness (2–3 charts)
8. **Operator Algebras** — C*-algebras intro (1–2 charts)
9. **Optimization** — Linear programming, simplex (2 charts)
10. **Mathematical Physics** — Lagrangian/Hamiltonian mechanics (2 charts)

---

## Metadata Updates Required

When adding new subcategories:

1. Add to `metadata.json` → `subcategoryCounts`
2. Add to `metadata.json` → `subcategoryToArxiv` 
3. Add to `metadata.json` → `domainHierarchy` (assign to algebra, analysis, geometry_topology, or applied)
4. Run `build-graph-data.js` to update Whole of Mathematics
5. Update upload script if new process directories are created

---

## Summary: arXiv Math Codes Not Yet Represented

| Code | Area | Priority |
|------|------|----------|
| math.ST | Statistics Theory | 1 |
| math.PR | Probability | 1 |
| math.CV | Complex Variables | 1 |
| math.FA | Functional Analysis | 1 |
| math.NA | Numerical Analysis | 1 |
| math.AG | Algebraic Geometry | 1 |
| math.RT | Representation Theory | 1 |
| math.AC | Commutative Algebra | 2 |
| math.AP | Analysis of PDEs | 2 |
| math.SP | Spectral Theory | 2 |
| math.OA | Operator Algebras | 3 |
| math.KT | K-Theory | 3 |
| math.QA | Quantum Algebra | 3 |
| math.OC | Optimization & Control | 3 |
| math.IT | Information Theory | 3 |
| math.MP | Mathematical Physics | 3 |
| math.HO | History & Overview | 4 |

**Well covered:** math.NT, math.CO, math.LO, math.GR, math.RA, math.CT, math.CA, math.GT, math.AT, math.DS (via complex dynamics)
