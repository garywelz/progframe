# Source-Grounded Chart Rebuild Plan (Chemistry, Physics, Computer Science, Biology)

**Goal:** Replace the generic, template-derived flowcharts in the four non-mathematics, non-GLMP
process databases with charts whose nodes, edges, decisions, and feedback loops are extracted from
**specific, cited, readable sources** — so each diagram reflects the actual mechanism / algorithm /
process rather than a reused skeleton with the topic name pasted in.

Scope decisions (agreed):

- **Coverage:** rebuild **all** current draft charts (~249).
- **Fidelity:** **strict** — every node/edge claim must be traceable to a readable, verifiable source
  section (open-access, arXiv/PMC, or a cited textbook section).
- **Sign-off:** LLM extraction **+ automated second-source cross-check**, with human (Gary) spot-checks
  before a chart is marked `verified: true`.

---

## 1. Where things live

- **Live source of truth (served to GCS):** `/home/gdubs/copernicus-web-public/huggingface-space/<discipline>-processes-database/`
  - `processes/<subcategory>/<id>.json` — data: `mermaid`, `nodeDetails`, `sources`, `complexity`, `flowchartStandard`.
  - `processes/<subcategory>/<id>.html` — rendered viewer (generated from the JSON).
  - `metadata.json`, `collections.json`, `process-index.json`, `discipline-profile.json`, `whole-of-X-graph-data.json` + `whole-of-X.html`, `<discipline>-database-table.html`.
- **GCS bucket:** `gs://regal-scholar-453620-r7-podcast-storage/<discipline>-processes-database/`.
- **Tooling lives in:** `/home/gdubs/progframe/` (e.g. `add_attributions.py`, `build_chemistry_database.py`, audit tool below).
- **Quality model to emulate:** the mathematics database (real axiom/theorem dependency graphs, Cite badges, frontier links) and GLMP biology charts.

> Note: `programming_framework/chemistry_batch_*.html` etc. are the **legacy generic** source the originals came from. They are not the live data and should not be re-promoted.

## 2. Diagnosis (audit evidence)

| Discipline | Charts | Distinct skeletons | Worst reuse | Status |
|---|---|---|---|---|
| Biology | 56 | 9 | 1 skeleton = 32 charts, another = 17 (49/56 are 2 shapes) | all `verified: false` |
| Chemistry | 124 | 39 | 1 skeleton = 14 charts | all `verified: false` |
| Computer science | 51 | 31 | skeletons of 8 and 7 | all `verified: false` |
| Physics | 22 | 18 | skeleton of 3 | all `verified: false` |

Every chart is `curationStatus: source_grounded_draft`, `verified: false`. The prior
`source_grounded_rebuild_v1` (2026-04-30) swapped one template for another: node labels are still
title-filled scaffolds (e.g. autophagy: `research question → initiating condition → Core biological
components → recognition/activation → intermediate regulatory state → committed mechanistic step →
feedback/checkpoint → measured phenotype → source-grounded check → readout`). `sources` are real
DOIs but node content was never extracted from them, and some sources are mismatched to the process.

## 3. Quality bar (definition of done, per chart)

A chart is `verified: true` only when:

1. Node labels name **domain-specific entities** (molecules, equations, genes, data structures,
   instruments, named steps) — never generic stage names.
2. The topology reflects the **real** structure of that process (correct branches, decisions, loops),
   not a reused skeleton. Its `topologySignature` does not collide with another chart unless it is
   genuinely the same process.
3. The diagram uses the **right graph type** (algorithm flowchart, reaction mechanism,
   state-transition, influence network, or dependency graph).
4. **Per-node provenance:** each node/edge claim carries a `sourceRef` to a specific cited source
   (and ideally section), and a second independent source corroborates the overall structure.
5. All cited `sources` resolve (DOI/URL reachable) and genuinely match the process.
6. No banned template phrases anywhere in labels/details.

## 4. Schema additions

Extend each process JSON:

- `nodeDetails[].sourceRef` — id/index into `sources` (+ optional `section`/`quote`) for that node.
- `curationStatus` ladder: `draft` → `source_grounded` → `verified` (replaces blanket `source_grounded_draft`).
- `extractionModel`, `extractionDate`, `reviewer`, `crossCheckSource`.
- Keep `topologySignature` for dedup; add `graphType` consistently (reuse the `graph_type_pilots` field).

Reuse existing attribution infra (`add_attributions.py`, Cite badge, frontier links).

## 4a. Confirmed pipeline (Phase 0 result)

The live databases regenerate from per-process JSON via these scripts (run from
`copernicus-web-public/huggingface-space/`). Canonical loop after editing any chart JSON:

1. **Per-process HTML:** `python3 scripts/create_generic_viewers.py <discipline> <discipline>-processes-database/processes`
   - Reads JSON (`mermaid`, `description`, `sources`, `complexity`, `keywords`) → writes `<id>.html`.
   - Note: live pages were built with the chemistry-flavored `create_process_viewers.py` (hardcoded `⚗️`); use the **generic** viewer.
   - The viewer does **not** surface `nodeDetails` / per-node provenance yet — a later enhancement.
2. **`metadata.json`** (the file the table page fetches): **no existing script rebuilds it** — `enhanced_database_table.py`
   reads it and deliberately leaves it untouched. We own `grounding/rebuild_metadata.py` to regenerate per-process
   summaries + `statistics` totals from per-process JSON while preserving top-level descriptive fields.
3. **`process-index.json`:** `python3 scripts/processes/discipline_databases/normalize_graph_metrics.py <discipline> --write`
4. **`collections.json` + `discipline-profile.json` + table HTML:** `python3 scripts/processes/discipline_databases/enhanced_database_table.py <discipline>`
5. **whole-of-X map:** `python3 scripts/processes/discipline_databases/generate_whole_discipline_maps.py <discipline>`
6. **Upload:** `progframe/upload-biology-database-to-gcs.sh` (+ cache-bust headers already set; bump `?v=` on table URL).

Discipline keys for these scripts use underscores (`computer_science`); folder names use hyphens (`computer-science-processes-database`).

**`topologySignature` algorithm (live):** `sha1` of `node count | edge count | sorted("<srcRole:srcShape>-><tgtRole:tgtShape>:<edgeLabel>")`.
It is computed from **roles/shapes and edge labels only — not node text** — which is why prior renaming never changed the
skeleton. Our grounding engine recomputes signatures the same way for all charts in a discipline so uniqueness checks are apples-to-apples.

**Grounding tooling (this repo, `progframe/grounding/`):**
- `engine.py` — spec → Mermaid + `nodeDetails` (with `sourceRef`) + metrics + signature; enforces guardrails (banned phrases,
  per-node provenance, source DOI/URL present, topology uniqueness).
- `rebuild_metadata.py` — regenerate a discipline's `metadata.json` from per-process JSON.
- `apply_slice.py` + `slices/*.json` — author charts as data, validate, and write into the live JSON.

## 5. Phases

### Phase 0 — Infrastructure & ground truth (no chart content yet)
- Confirm/assemble the one-command rebuild+preview loop for a single chart (JSON → HTML render →
  metadata/collections/process-index/whole-of-X regen → optional GCS upload + cache-bust + `?v=` bump).
- **Audit tool** (`audit_charts.py`, this repo): ranked triage CSV per discipline flagging shared
  topology clusters, banned template phrases, and source quality. Produces the worklist + the progress metric.
- Quality rubric + schema additions (section 3–4).
- Hand-build one gold-standard exemplar per discipline as the target.

### Phase 1 — Per-discipline source corpora
- Map each subcategory to authoritative, **readable** sources (textbooks + reviews + open-access):
  - Physics: Goldstein, Jackson, Griffiths, Landau–Lifshitz, arXiv.
  - Computer science: CLRS, Sipser, Kleinberg–Tardos, foundational papers (arXiv/ACM).
  - Chemistry: Clayden, Atkins, IUPAC, ChemRxiv/PubChem/RSC.
  - Biology: Alberts *Molecular Biology of the Cell*, reviews, PMC/PubMed.
- Validate or replace each chart's existing `sources` so citations match the specific process.

### Phase 2 — Extraction methodology (core, repeatable per chart)
Per chart: (a) pull the actual text of that process from its cited source(s); (b) extract real
steps/decisions/branches/feedback specific to it; (c) map to color roles; (d) emit Mermaid +
`nodeDetails` with per-node provenance; (e) cross-check vs. a second source; (f) human spot-check → verified.

**Anti-template guardrails (auto-enforced):**
- Reject banned boilerplate phrases.
- Require domain-specific entity tokens in labels.
- Reject topology collisions with existing charts (unless same process).
- Enforce correct graph type per process.

### Phase 3 — Execution in worst-first waves
- Order: **biology** (most degenerate) → **chemistry** (largest) → **CS** → **physics**.
- Optionally first prove the pipeline on one fully-verified vertical slice (a single subcategory).
- PR-sized waves of ~10–15 charts: extract → render → visual QA → cross-check → verified →
  rebuild metadata → upload. Parallelize independent subcategories with subagents.

### Phase 4 — QA, dedup, publish
- Gates (precommit/CI): no banned phrases, topology-diversity threshold per discipline, every node
  has provenance, every source resolves.
- Regenerate metadata/collections/process-index/whole-of-X; bust GCS cache; bump `?v=` on table pages.
- Update the paper: describe the real extraction methodology; report new diversity metrics
  (distinct-topology ratio, % verified).

## 6. Tooling to build

- `audit_charts.py` — triage + metrics (Phase 0). ✅ first deliverable.
- `extract_chart.py` — LLM extraction harness (chart id + sources → proposed JSON + provenance).
- JSON → HTML renderer (confirm/extend existing).
- `rebuild_and_upload.sh` per discipline (metadata + collections + GCS + cache-bust).
- Progress dashboard (verified count, distinct-topology ratio over time).

## 7. Metrics to track

- % charts `verified: true` per discipline.
- Distinct-topology ratio (distinct signatures / charts) — target ≥ 0.9.
- Banned-phrase occurrences — target 0.
- % nodes with `sourceRef` — target 100%.
- % sources resolving (DOI/URL reachable) — target 100%.
