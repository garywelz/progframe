Handoff for Claude — Figure placement cleanup (Cursor verification)
===================================================================

**File:** `collaborations/mathematics-database/mathematics-paper-draft.md`  
**Repo:** `garywelz/progframe` on `main` (May 2026). Cursor applied your figure-placement spec; this note is the post-edit verification you can treat as ground truth for continuation.

---

## Copy-paste tip (for the author ↔ assistants)

Prefer **one** full instruction block (or this handoff) per round. Re-pasting the same spec is redundant and only adds tokens. For follow-ups, a **short delta** (“also adjust §X”) is enough.

When copying into a chat, select from the **first line of the title** (above the rule of equals signs) through the end of the file. Partial selections that start mid-title can merge fragments and look like a doubled heading.

---

## Sanity check: `mathematics-paper-draft.md`

**Total mermaid fences: 8** (seven in the body, one in the appendix) — matches the intended layout.

| Location | Content |
|----------|---------|
| **§3.1** | Euclidean algorithm flowchart (*Figure 1* caption); `flowchart TD` ~line 231 |
| **§3.2** | Euclid Book I axiomatic DAG (*Figure 2* caption); ~line 291 |
| **§3.3** | **No** mermaid (prose only; diagrams in §3.4 and Appendix) |
| **§3.4** | Informal proof graph: opens `A["Source: claim infinitely many primes"]`; Lean-schematic: opens `T["Theorem goal: primes are not contained in any finite set"]` |
| **§3.5** | Three blocks: induction back-edge + geometric Pythagoras + algebraic Pythagoras |
| **Appendix** | Heading **`## Appendix: Reference Proof Graph — Infinitely Many Primes (Euclid)`**; one short role/colour legend sentence; **one** fully styled primes mermaid (canonical reference graph) |

**Removed from Appendix:** Euclidean flowchart, Euclid Book I DAG, duplicate infinitely-many-primes block, duplicate Lean-schematic tree (those live in §§3.1–3.2 and §3.4 as specified).

**Cross-references:** Prose points readers to **Section 3.4** and the **Appendix reference** graph for the eight-role vocabulary / styled version where relevant.

---

## Figure 1 / Figure 2

Captions in §3.1 and §3.2 are **informal** (no global figure counter). Formal captions for *Journal of Logic and Computation* can wait for a submission formatting pass.

---

## Editorial pass (before Fall 2026 submission)

Completed in-repo:

- **Figure bridges:** §3.1 and §3.2 now each open with a sentence that points explicitly to Figure 1 / Figure 2 before the diagram.
- **§3.3 pointer:** A short paragraph before the corpus examples directs readers to **§3.4** (diagrammed informal + Lean-schematic primes graphs), **§3.5** (loops/merges), and the **Appendix** (reference graph with full role styling).

Still for the author at submission time:

- **Word count:** The markdown draft is about **6.5k words** (~6466 by `wc -w` on `mathematics-paper-draft.md`; counts markdown noise lightly; re-check after conversion to the journal’s house format). Compare to current limits in [OUP *Journal of Logic and Computation* author instructions](https://academic.oup.com/logcom/pages/General_Instructions).

---

## Bottom line

The figure-placement cleanup from your Cursor instructions is **done**; the **8-block** layout matches the intended structure. If a future grep shows more than eight fenced `mermaid` blocks, treat that as a regression to inspect.

---

## Repo / deploy notes (optional for Claude)

- **Paper:** version control is GitHub only; the GCS `mathematics-processes-database` upload script does **not** publish the markdown paper.
- **Small GCS refresh** (metadata, table, `proof-graphs/`, Gödel numbering HTML only): `./upload-mathematics-database-to-gcs.sh --quick` from `progframe`. Full corpus upload remains the no-flag path.

---

## Suggested one-line ping to Claude

*“Cursor verified `mathematics-paper-draft.md`: Euclidean + Euclid DAG moved to §3.1–3.2 with informal Figure 1/2; §3.4 keeps informal + Lean primes graphs; Appendix is only the reference styled primes graph; eight fenced mermaid blocks total—please take the next editorial pass from there.”*
