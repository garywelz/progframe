# Generic Processes Needing Real Content

These processes use the generic template ("This X process visualization demonstrates... The flowchart shows...") and need to be replaced. **Use different approaches for different process types.**

## Strategy by Process Type

### 1. Algorithm flowcharts (like Binary Search)
**Examples:** Binary Search (done), Cryptographic Algorithms, Numerical Methods

**Approach:** Process-like flowcharts with:
- Inputs (sorted array, search key)
- Steps (initialize interval, compute middle, compare)
- Decision diamonds (interval empty? key == A[mid]? key < A[mid]?)
- Outputs (found index, not found)
- Chart title: **"Algorithm Flowchart"** (do not use "GLMP 6-Color Scheme" in the title)

**Reference:** [Binary Search](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/processes/discrete_mathematics/discrete_mathematics-binary-search.html) – O(log n) complexity

**Candidates:** Add specific algorithms – e.g. RSA, Newton-Raphson, Sieve of Eratosthenes, Dijkstra – each as its own process flowchart.

### 2. Axiom-theorem dependency graphs (like Euclid, Peano, Propositional Logic, Aristotle)
**Examples:** Euclid Book I (done), Peano Arithmetic (done), Propositional Logic (done), Aristotle Syllogistic (done)

**Approach:** Real mathematical development:
- Axioms / definitions at the base
- Theorems with explicit dependencies (arrows = "depends on")
- Split into subgraphs for clarity (like Euclid Book I's 5 views)

**Reference:** [Euclid Book I](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/processes/geometry_topology/geometry_topology-euclid-elements-book-i.html)

**Candidates:**
- **Group Theory** – done (43 nodes, 69 edges across 3 subcharts; Euclid-style layered dependencies)
- **Ring Theory** – ring axioms → integral domain, polynomial rings
- **Field Theory** – field axioms → extensions, algebraic closure
- **Limit / Derivative / Integral** – ε-δ, limit laws, FTC, etc.
- **Modular Arithmetic** – congruence, Fermat's little theorem, etc.
- **Topology** – open sets, continuity, compactness
- **Differential Geometry** – manifold, metric, curvature

### 3. Axiomatic combinatorics (like Euclid Book I for counting)
**Example:** Combinatorics (done)

**Approach:** Axiomatic theory of combinatorics – definitions (factorial, sum/product principles) and theorems (permutations, combinations, binomial, pigeonhole, inclusion-exclusion) with dependency graph. Can be expanded to be more comprehensive like Euclid Book I.

**Reference:** [Combinatorics](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/processes/geometry_topology/geometry_topology-combinatorics.html)

---

## Updated (with real content)
- **Combinatorics** – Axiomatic counting theory (14 nodes, 15 edges)
- **Binary Search** – Algorithm flowchart (already had real content)
- **Sieve of Eratosthenes** – Prime Number Generation (10 nodes, 14 edges) ✓ Batch 1
- **Newton-Raphson Method** – Numerical Methods (9 nodes, 11 edges) ✓ Batch 1
- **Bisection Method** – Limit Calculation (8 nodes, 10 edges) ✓ Batch 2
- **Extended Euclidean Algorithm** – Modular Arithmetic (6 nodes, 6 edges) ✓ Batch 2
- **Dijkstra's Algorithm** – Graph Theory Algorithms (7 nodes, 8 edges) ✓ Batch 2
- **RSA Algorithm** – Cryptographic Algorithms (7 nodes, 7 edges) ✓ Batch 3
- **Simpson's Rule** – Integral Calculation (6 nodes, 5 edges) ✓ Batch 3
- **Kruskal's Algorithm** – new (9 nodes, 12 edges) ✓ Batch 3
- **AES Algorithm** – new (8 nodes, 8 edges) ✓ Batch 4
- **Merge Sort** – new (7 nodes, 7 edges) ✓ Batch 4
- **Prim's Algorithm** – new (9 nodes, 12 edges) ✓ Batch 4
- **Quicksort** – new (6 nodes, 6 edges) ✓ Batch 5
- **Breadth-First Search** – new (7 nodes, 8 edges) ✓ Batch 5
- **Binary Search Tree Insert** – new (8 nodes, 9 edges) ✓ Batch 5
- **Group Theory** – Axiom-theorem dependency graph (21 nodes, 29 edges across 3 subcharts) ✓

## Need Updates (by type)

### Algorithm flowcharts to create
- DFS, Heap sort, etc.
- Graph Theory Algorithms → Dijkstra, Kruskal, etc.

### Axiom-theorem graphs to create (placeholders removed)
- Field Theory, Ring Theory
- Derivative, Integral, Limit Calculation
- Modular Arithmetic, Diophantine Equations
- Topology, Differential Geometry, Euclidean Geometry
- Logic & Set Theory (or point to Propositional Logic)
- Statistical Analysis (probability axioms → theorems)

### Removed (generic placeholders deleted ✓)
- Field Theory, Ring Theory, Derivative Calculation, Statistical Analysis, Logic & Set Theory
- Differential Geometry, Euclidean Geometry, Topology, Diophantine Equations
- Integral Calculation, Limit Calculation, Modular Arithmetic, Cryptographic Algorithms, Graph Theory Algorithms
- Run `delete-generic-charts-from-gcs.sh` to remove from GCS; then `upload-mathematics-database-to-gcs.sh` for updated metadata

### Duplicates (resolved ✓)
- statistics_probability-aristotles-syllogism → removed (canonical: discrete_mathematics-aristotle-syllogistic)
- statistics_probability-euclids-geometry → removed (canonical: geometry_topology-euclid-elements-*)
