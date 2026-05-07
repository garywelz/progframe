# Handoff for Claude — Proof graphs in manifest + paper alignment

**Paper:** `collaborations/mathematics-database/mathematics-paper-draft.md`  
(GitHub: `garywelz/progframe` → same path on `main`; if `main` lags local clone, compare that file on GitHub to ensure you have the May 2026 version with the §5.1 diagonalization block and the §5.2 manifest paragraph.)

**Note for Cursor / Claude:** The mathematics paper draft in-repo was read when authoring this handoff (§4.1–§5.2 in particular).

---

## What changed in the live Mathematics Database (infrastructure + corpus)

1. **`metadata.json` on GCS** now uses **`processType`**: `algorithm` | `axiomatic_theory` | **`proof_graph`** (225 processes: 194 / 23 / 8).

2. **Main table viewer** (`mathematics-database-table.html`) has a **third sortable table** for proof graphs, with **nodes, edges, algorithm_capsules, temporary_assumptions, frontier**, and correct links to **`proof-graphs/<file>.html`** (and unchanged `processes/...` for algorithms and axiomatic charts).

3. **Eight proof-graph rows** are in the manifest (pilots backfilled + new logic/independence): Euclid Book I bundle, infinitely many primes, Cantor bundle, FTA, Pythagorean comparison, **Gödel completeness**, **Gödel first incompleteness**, **Kirby–Paris / Goodstein frontier**.

4. **New pages:** three proof-graph HTML files under `proof-graphs/`, plus **`number_theory-godel-numbering-algorithm.html`** as the **paired algorithm** to incompleteness.

5. **Hygiene:** **`foundations-axiomatic-set-theory-ad`** no longer carries a bogus Gödel collection tag in metadata; collection generator scripts were updated so that chart is not marketed as Gödel-related.

Upload from the author’s machine completed successfully to the same GCS prefix; the public entry point remains the **mathematics-database-table** URL in §4.3 of the paper.

---

## How this should influence the paper (`mathematics-paper-draft.md`)

### Strengthens (already partly drafted in the repo copy)

- **§4.1:** Can honestly say the **deployed manifest** distinguishes the three kinds of objects; the viewer is **sortable tables** (not only “filterable” if that word appears elsewhere—worth a one-word consistency pass).

- **§5.1:** The **diagonalization family** paragraph is now **anchored in shipped artifacts** (Cantor proof-graph page + Gödel first incompleteness proof graph + optional Gödel numbering algorithm as the “capsule twin”). That supports a real **cross-proof structural claim**, not just a methodological promise.

- **§5.2:** The paragraph that cites **eight proof-graph entries** and **~25 nodes / ~28 edges on average** is tied to **exact public counts**—good for reviewers who click through to `metadata.json` or the table.

- **Empirical contribution (§1.3):** The bullet list of proof examples can explicitly add **Gödel completeness, first incompleteness, Kirby–Paris/Goodstein** so the abstract corpus description matches what the table shows.

- **Limits (§7 “corpus size”):** You can narrow the caveat: proof graphs are no longer “only in pilot HTML”; they are **first-class in the manifest**, but **N is still small** for statistics.

### Edits Claude might still suggest

1. **Abstract / §1.3:** One phrase naming **logic + independence** entries so the abstract matches the table (optional—keeps expectations aligned).

2. **§4.2 Named collections:** Optionally mention that **proof graphs can share `namedCollections` with axiomatic entries** (e.g. Gödel, Peano) even though URLs live under `proof-graphs/`.

3. **§5.2 prose polish:** In the repo text, the sentence *“A preliminary analysis of the current corpus reveals. The live…”* is **broken** (fragment after “reveals”); merge into one sentence or add “the following:”.

4. **Schema vs implementation:** §4.1 JSON schema still uses `title` / `category`; the live rows use **`name`** and **`processType`**. One clarifying sentence avoids pedantic reviewer complaints (“schema is normative; manifest field names follow implementation”).

---

## Suggested one-line message to paste to Claude

*“Progframe now ships `proof_graph` in `metadata.json`, a third table on the live DB page, eight proof-graph rows plus a Gödel-numbering algorithm, and the paper draft on `main` (path above) adds §5.1 diagonalization + manifest-grounded §5.2 stats—please review for abstract/§1.3 alignment, schema vs `processType` wording, and fix the §5.2 ‘reveals.’ sentence fragment.”*

---

*Companion to `CURSOR_HANDOFF-proof-graphs-and-metadata.md`.*
