# Cursor handoff: proof graphs, metadata, Gödel & Paris–Kirby

**Purpose.** Single document to resume work on the mathematics database and the companion paper (`mathematics-paper-draft.md`). It merges the live-metadata audit, corpus gaps, and a concrete execution plan.

**Last verified (agent):** 2026-05-06 — local repo `metadata.json` compared to GCS-hosted `metadata.json`; spot-check of Gödel completeness HTML and **`proof-graphs/index.html`** on GCS (HTTP 200). This workspace snapshot does **not** currently include a local `proof-graphs/` tree; treat the bucket (or a full clone) as source of truth for existing proof HTML until synced into git.

---

## 1. Verified facts: hosted vs local `metadata.json`

- **GCS URL:** `https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/metadata.json`
- **Counts match** repo file `programming_framework/mathematics-processes-database/metadata.json`:
  - **`totalProcesses`:** 217
  - **`processType` distribution:** `axiomatic_theory` 194, `algorithm` 22
- **There is no `proof_graph` (or equivalent) `processType`** in this manifest. The main database table UI (`mathematics-database-table.html`) only splits rows into algorithms vs axiomatic theories.

**Root cause (proof graphs vs main table).** Pilot **proof graphs** live as **standalone HTML under** `mathematics-processes-database/proof-graphs/` **on GCS** (with an index page) but are **not wired into `metadata.json`**. That is why there is **no proof-graph row in the manifest** and no proof section in the main table—notwithstanding that **algorithms and axiomatic** rows **do** exist in JSON (216 typed processes). If someone sees **empty algorithm or axiomatic** tables specifically, that is **unlikely** to be stale JSON; debug **fetch/CORS**, **wrong `METADATA_URL`**, or **JS errors**. If they mean the **proof corpus** is invisible from the table view, **manifest + UI** is the fix.

**Implication for the paper.** Section 5 claims about a **proof graph corpus** need **first-class `processType: "proof_graph"`** entries (or an equivalent merged manifest) aligned with the same paths as the `proof-graphs/` pages.

---

## 2. Proof graphs vs current metadata

- The paper describes a **five-family proof graph pilot** (e.g. Euclid Book I 41/48 nodes/edges, infinitely many primes, Pythagorean comparison, FTA, Cantor diagonal). Those **counts and titles are not present** as dedicated rows in the current `processes` array.
- **Deployment:** Gödel-related **axiomatic** pages under `processes/` exist on GCS. **Proof** pages are expected under **`proof-graphs/`** on the same bucket prefix; sync that directory into the repo if you want Cursor to edit templates offline.

---

## 3. Gödel named collection (`namedCollections` contains `"godel"`)

There are **seven** such processes. All are currently **`axiomatic_theory`** except where noted by structure:

| Process id | Short description |
|------------|-------------------|
| `number_theory-peano-arithmetic-godel-fol` | Peano & Gödel — Part 4: First-order logic |
| `number_theory-peano-arithmetic-godel-formalization` | Part 5: Formalization & Gödel numbering |
| `number_theory-peano-arithmetic-godel-completeness` | Part 6: **Completeness theorem** |
| `number_theory-peano-arithmetic-godel-incompleteness-1` | Part 7: **First incompleteness** |
| `number_theory-peano-arithmetic-godel-incompleteness-2` | Part 8: **Second incompleteness** |
| `discrete_mathematics-model-theory-compactness` | Model theory — compactness (also tagged `godel`) |
| `foundations-axiomatic-set-theory-ad` | **Metadata shows `nodes: 0`, `edges: 0`** — fix, regenerate, or remove from collection before submission |

**User goal:** Add **proof graphs** (eight-role vocabulary from the paper) for **completeness** and **first incompleteness**, complementing—not replacing—the existing axiomatic “Parts 4–8” charts.

**Second incompleteness (scope decision).** Keep **second incompleteness axiomatic-only** for this round. A proof graph would be **more complex** than first (consistency statement formalized **inside** the system). **Add a sentence in the paper** that second incompleteness remains represented as an **axiomatic** chart in the current corpus and is **flagged for a future proof-graph extension** once first incompleteness is stable.

---

## 4. Paris–Kirby / independence material already in metadata

Peano–Paris sequence entries (also **`axiomatic_theory`**) appear after the Gödel parts, for example:

- `number_theory-peano-arithmetic-paris-harrington` — Paris–Harrington theorem  
- `number_theory-peano-arithmetic-paris-goodstein` — Goodstein & Kirby–Paris indicators  
- `number_theory-peano-arithmetic-paris-hydra` — Hydra game  

These are **dependency-style charts**, not proof graphs. A **proof graph** for a Goodstein / Kirby–Paris / independence narrative would be **new** content (likely flagged as high complexity or “frontier” for two-level structure).

---

## 5. Proof graph artifacts (conventions for new entries)

For consistency with the **existing five proof families**, each new proof graph should include:

1. **Standalone HTML** at  
   `programming_framework/mathematics-processes-database/proof-graphs/[id].html`  
   (mirror the deployed path on GCS under the same prefix).

2. **`metadata.json` row** with `processType: "proof_graph"`, plus **proof-oriented fields** aligned with the paper’s schema (e.g. **`temporary_assumptions`**, **`algorithm_capsules`**—exact names must match Section 4.x of `mathematics-paper-draft.md`).

3. **Index wiring:** add a link from **`proof-graphs/index.html`** for every new page.

4. **Templates:** Before authoring Gödel material, **read the existing corpus**—especially **`infinitely-many-primes.html`** and **`cantor-diagonal-proofs.html`** under `proof-graphs/`—so **node colors, eight-role vocabulary, and Mermaid syntax** match. Corpus consistency supports Section 5 claims about **shared topology patterns** (e.g. contradiction hubs). If those files are only on GCS, **fetch them first** into the session (or sync repo).

---

## 6. Recommended work phases (for a Cursor session)

Phase ordering: **A before B**—no new graphs without manifest + UI surfacing.

### Phase A — Schema + UI + manifest

1. Introduce **`processType: "proof_graph"`** (or the name you standardize in the paper’s JSON schema).
2. Extend **`mathematics-database-table.html`**: third section/table (or filter) so proof graphs are browsable; columns as needed (nodes, edges; optional **contradiction** / **capsule** counts if computable from metadata).
3. Add **`metadata.json`** rows for each proof graph (ids, subcategory, **URL to `proof-graphs/[id].html`**, stats, `namedCollections` including `godel` where appropriate).
4. **Backfill** the five pilot families from the paper into the manifest if not already present, so Section 5 has **one source of truth**.

### Phase B — New graph content (priority order)

1. **Gödel completeness** — Henkin / semantic completeness line; algorithm capsule = model construction. Medium scale (~20–30 nodes; adjust to the real diagram).
2. **Gödel first incompleteness** — diagonal lemma / numbering as algorithm capsule; structurally comparable to **Cantor diagonal** in the corpus.
3. **Gödel numbering** — standalone **`algorithm`** flowchart (paired with the incompleteness proof graph for Observation 1). Keep as explicit Phase B deliverable, not only “optional.”
4. **Paris–Kirby / Goodstein frontier** — proof graph with meta-level + Goodstein-step capsule; mark frontier if schema supports it.

### Phase C — Hygiene

- Fix **`foundations-axiomatic-set-theory-ad`** (or untag from `godel`).
- Re-run **GCS upload** for `metadata.json`, `proof-graphs/*`, and table HTML so prod matches repo.

### Phase D — Paper (`mathematics-paper-draft.md`)

- Replace Section 5 **preliminary** language with **numbers from metadata** (means/ranges where the sample allows).
- Add a **dedicated paragraph in §5.1** on the **diagonalization family**: **Cantor diagonal** (set theory) and **Gödel diagonal lemma** (logic) as the same **recurring structural pattern** made visible/measurable in proof graphs—this is a **substantive finding**, not a mere head-count update. Extend to Paris-branch material only if that proof graph is actually shipped and supports the claim.

---

## 7. Session output checklist (definition of done)

- [ ] `metadata.json` includes **`proof_graph`** rows (including pilot families + new entries as scoped).
- [ ] Main table UI lists proof graphs in their own section.
- [ ] Four content deliverables: **Completeness** proof graph, **First incompleteness** proof graph, **Gödel numbering** algorithm, **Paris–Kirby** (frontier) proof graph—each with HTML + index link + manifest row.
- [ ] `mathematics-paper-draft.md`: Section 5 numbers + **§5.1 diagonalization family** paragraph + **second incompleteness** scope note (axiomatic-only for now).

---

## 8. Key file paths

| Path | Role |
|------|------|
| `programming_framework/mathematics-processes-database/metadata.json` | Process manifest |
| `programming_framework/mathematics-processes-database/mathematics-database-table.html` | Main table UI |
| `programming_framework/mathematics-processes-database/proof-graphs/` | Proof HTML + `index.html` (on GCS; sync into repo as needed) |
| `upload-mathematics-database-to-gcs.sh` | Deploy to GCS |
| `generate_collections.py` / `add_named_collections.py` | Named collection wiring |
| `collaborations/mathematics-database/mathematics-paper-draft.md` | Paper draft |

---

## 9. Remaining implementer notes

- Exact **JSON field names** for proof graphs must **match the paper’s Section 4.x schema** (`temporary_assumptions`, `algorithm_capsules`, etc.).
- If **`proof-graphs/`** is missing locally, download from GCS or expand upload scripts so templates live in git and reviews stay reproducible.

---

*End of handoff.*
