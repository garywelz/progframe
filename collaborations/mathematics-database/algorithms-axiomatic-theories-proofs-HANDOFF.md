# Handoff Document: Algorithms, Axiomatic Theories, and Proofs
## Revised Draft — Claude Session Handoff to Cursor
**Date:** June 2026
**Prepared by:** Claude (Anthropic) on behalf of Gary Welz
**Receiving environment:** Cursor / garywelz/progframe repository

---

## 1. What This Document Is

This is a complete handoff from a Claude editing session in which the paper "Algorithms, Axiomatic Theories, and Proofs as Graphs: A Unified Diagrammatic Representation of Mathematical Structure" was revised from pre-submission draft to submission-ready state. The revised paper is in the accompanying file:

**`algorithms-axiomatic-theories-proofs-revised.md`**

This handoff document records every editorial decision made, every action item outstanding, and every verification performed, so that work can continue in Cursor without loss of context.

---

## 2. Summary of Changes Made

### 2.1 Abstract
- Rewritten to lead with findings rather than methodology
- Diagonalization family and algorithm capsule concept foregrounded in paragraph two
- Methodology positioned as enabler in paragraph three
- Long sentences broken up throughout for readability
- Vague pronoun reference ("these") corrected to "the three graph types"

### 2.2 Section 1 — Introduction
- §1.1: Final paragraph rewritten to vary sentence structure and sharpen the fragmentation consequences
- §1.2: New paragraph added directly addressing the "reveals vs. redescribes" question with phylogenetic tree analogy and forward reference to §6.1
- §1.3: Theoretical contribution bullet rewritten to replace GLMP parallel with the diagonalization family finding

### 2.3 Section 2 — Related Work
- §2.1: Tightened; Section 4.1 cross-reference updated
- §2.2: Expanded with full DAG definition (directed, acyclic explained explicitly); new paragraph on two-level proof-level DAG / capsule-level cycle structure; argument mapping paragraph extended to connect explicitly to §3.3
- §2.3: New closing sentence added distinguishing LLM reasoning claims from LLM diagram generation claims
- §2.4: Rewritten to frame paper as both applying and extending the Programming Framework; forward reference to §6 added
- §2.5: **NEW SUBSECTION** — Graph Generation Pipeline added (five steps: source selection, LLM prompting, human review, metadata construction, versioned storage)

### 2.4 Section 3 — The Three Graph Types
- §3.1: Figure 1 caption paragraph rewritten to explain why Euclidean Algorithm was chosen
- §3.2: Opening paragraph rewritten with full DAG definition and explanation of why acyclicity is a logical requirement not just a technical one; closing sentence added
- §3.3: Major rewrite — new acyclicity paragraph; eight-role vocabulary table retained; new mutual exclusivity paragraph added with decision rules; algorithm capsule concept expanded into two-part explanation; examples list updated with exact figures from manifest; closing transition sentence added to §4
- **Former §3.4 and §3.5 extracted into new §4**

### 2.5 Section 4 — NEW SECTION: Structural Properties of the Three Graph Types
- Absorbs former §3.4 (Lean comparison) and §3.5 (topologies)
- Reorganized under four explicit headings: §4.1 Lean comparison, §4.2 Loops and back-edges, §4.3 Merge and chain topologies, §4.4 Conjunctive premises
- §4.2: New general design principle added — represent iterative proof patterns as back-edges rather than self-loops
- §4.3: Topology comparison table added; cross-reference to §6.3 added
- §4.4: Reframed as open design question rather than solved problem

### 2.6 Section 5 — The Mathematics Database (formerly §4)
- Opening transition sentence added connecting §3/§4 to §5
- §5.1: Schema field name discrepancy resolved cleanly in one sentence
- §5.2: Named collections rewritten as one paragraph — correctly described as navigational/curatorial device, not formal structural category
- §5.3: **NEW SUBSECTION** — Corpus Overview with exact Table 1 (all eight proof graph entries, exact node/edge/capsule counts from live manifest)
- §5.4: Live database links confirmed active; v2 demo link correctly described as shape-and-palette demonstration

### 2.7 Section 6 — What the Representation Reveals (formerly §5)
- Opening paragraph added framing section as findings
- §6.1: Opens with corrected claim (all eight entries have at least one capsule); I.4/I.5 zero-capsule discussion added; GLMP parallel removed; diagonalization family argument strengthened; Gödel numbering capsule-twin observation retained
- §6.2: Approximate statistics replaced with exact figures from Table 1; three observations reformatted as explicit findings; corpus size caveat stated once, concisely
- §6.3: Cross-reference to §4.3 topological signatures added; final paragraph sharpened

### 2.8 Section 7 — Limitations
- Corpus size paragraph shortened (no longer repeats statistics)
- Mermaid expressivity paragraph shortened with cross-reference to §4.4
- **NEW paragraph** — DAG assumption and encapsulated cycles added
- Formal semantics paragraph reframed as complement rather than deficit
- Cross-reference updated to §2.5 for pipeline description

### 2.9 Section 8 — Future Directions
- **NEW direction** — Capsule-internal structure as subgraphs added
- Lean integration direction made more specific with §4.1 cross-reference
- **NEW direction** — Systematic corpus validation and metadata quality added
- Community extension direction shortened; validation pipeline noted as prerequisite
- Cross-domain comparison direction reframed around Programming Framework databases (GLMP not singled out)
- Shape grammar direction sharpened into concrete research agenda

### 2.10 Section 9 — Conclusion
- Rewritten to lead with findings
- Diagonalization family stated as central finding with full confidence
- Reveals vs. redescribes argument restated explicitly
- Two-level DAG/cycle structure stated prominently as core finding
- GLMP parallel removed entirely
- Final paragraph closes on paper's strongest claim

### 2.11 References
- **[1] UPDATED:** Now cites Zenodo preprint with version-independent DOI 10.5281/zenodo.18463441
- **[14] NOTE:** GLMP reference retained in list but all in-text citations removed; author to decide whether to keep or remove before submission

---

## 3. Outstanding Action Items

These must be completed before submission. They are listed in priority order.

### CRITICAL — Must complete before submission:

**A. Update Mathematics Database manifest**
- File: metadata.json (Google Cloud Storage)
- Entry: Euclid Book I bundle
- Field: `algorithm_capsules`
- Change: `0` → `1`
- Reason: I.1 contains one compass-and-straightedge construction capsule confirmed by metadata inspection. I.4 and I.5 have zero capsules (confirmed). I.2 and I.3 were never added to the pilot bundle.

**B. Decide on Reference [14] (GLMP)**
- All in-text citations to GLMP have been removed from the revised draft
- Reference [14] is retained in the reference list with a note
- Decision needed: remove entirely, or retain as background reference
- Recommendation: remove entirely for cleanliness, since no in-text citation remains

**C. Update draft status line**
- Current: "Pre-submission draft — May 2026"
- Update to reflect actual submission date when known

**D. Confirm word count against JLC guidelines**
- Target venue: Journal of Logic and Computation (Oxford University Press)
- Check current word count of revised draft against submission requirements
- Secondary venue: PLOS ONE (dataset/methods framing)

### IMPORTANT — Complete before or simultaneously with submission:

**E. Upload updated Programming Framework paper to Zenodo**
- A more recent version exists in Cursor workspace
- Upload before or simultaneously with mathematics paper deposit
- Ensure abstract and methodology description are consistent with how Paper 7 is characterized in the mathematics paper

**F. Upload mathematics paper to Zenodo as preprint**
- Establishes priority before journal submission
- Creates citable DOI
- Use same Zenodo account as Programming Framework preprint

---

## 4. Verified Facts and Data

These were verified during the session and should not be re-verified:

### Corpus statistics (exact, from live manifest May 2026):
| Entry | Nodes | Edges | Capsules | Temp. Assumptions | Frontier |
|-------|-------|-------|----------|-------------------|----------|
| Euclid Book I bundle | 41 | 48 | 1* | 0 | — |
| Pythagorean Theorem | 33 | 39 | 2 | 0 | — |
| Infinitely Many Primes | 14 | 17 | 1 | 1 | — |
| Fundamental Theorem of Arithmetic | 27 | 34 | 2 | 1 | — |
| Kirby–Paris / Goodstein | 10 | 9 | 1 | 0 | yes |
| Cantor Diagonal Proofs | 42 | 50 | 1 | 0 | — |
| Gödel Completeness | 15 | 15 | 1 | 0 | — |
| Gödel First Incompleteness | 14 | 13 | 1 | 0 | — |
| **Totals** | **196** | **225** | **10** | **2** | |
| **Averages** | **24.5** | **28.1** | **1.25** | **0.25** | |

*Euclid Book I bundle capsule count is 1 (manifest currently shows 0 — this is the correction in Action Item A above)

### Euclid Book I pilot proof bundle — individual entries confirmed:
- I.1: 12 nodes, 14 edges, 1 algorithm capsule (compass-and-straightedge)
- I.4: 13 nodes, 15 edges, 0 algorithm capsules (superposition proof)
- I.5: 16 nodes, 19 edges, 0 algorithm capsules (individual construction nodes, not capsules)
- I.2 and I.3: NOT in pilot bundle — never created
- Bundle totals: 41 nodes, 48 edges ✓ (internal consistency check passes)

### URLs confirmed active (June 2026):
- Main database table: https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html ✓
- HuggingFace viewer: https://huggingface.co/spaces/garywelz/programming_framework ✓
- V2 demo: https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/proof-graphs/infinitely-many-primes-v2-demo.html ✓

### Reference [1] — Programming Framework:
- Zenodo preprint confirmed published: February 3, 2026
- Version: 2026-02-03
- Version-specific DOI: 10.5281/zenodo.18463442
- Version-independent DOI (use this in citation): 10.5281/zenodo.18463441
- Views: 57, Downloads: 46 (as of session date)

---

## 5. Editorial Decisions Made — Do Not Reverse Without Reason

These decisions were made deliberately after discussion and should not be undone without good reason:

**Decision 0: Reference [14] GLMP removed entirely**
Reference [14] (Welz and Krampis, GLMP working paper) has been removed from the reference list entirely. References formerly numbered [15] and [16] are now [14] and [15]. The in-text citation of [15] in §2.4 has been updated to [14]. When a BioRxiv preprint from Krampis is available, add it back as [14] (shifting current [14] and [15] to [15] and [16]) with an in-text citation most likely in §8 cross-domain comparison direction.

**Decision 1: GLMP parallel removed**
Both instances of the GLMP parallel (formerly in §5.1 and §9) have been removed. The rationale: two projects by the same author citing each other as mutual validation is a reviewer vulnerability. The cross-domain comparison belongs in a planned future paper where it can be argued properly.

**Decision 2: Named collections treated as navigational device only**
Named collections are described as a curatorial grouping for discoverability purposes. They carry no analytical weight in the corpus metrics. This is accurate and avoids over-claiming.

**Decision 3: Schema field name discrepancy handled as design note**
The `title`/`name` and `category`/`processType` discrepancy is acknowledged in one sentence as an implementation compatibility decision. It is not treated as an error.

**Decision 4: No Colab empirical analysis added**
The decision was made to keep this as a methodology and proof-of-concept paper rather than adding a Colab-based counting study. The simple capsule count table (Table 1) is the right empirical addition — not a full corpus analysis. The Colab analysis is deferred to a future cross-domain comparative paper.

**Decision 5: I.5 constructions classified as individual nodes, not capsules**
The construction steps in Euclid I.5 are individual proof-specific auxiliary lines, not a self-contained reusable procedure. Zero capsules for I.5 is correct.

**Decision 6: Lean comparison retained in §4.1**
The Lean comparison was retained and moved to §4 (Structural Properties) rather than removed. It serves a clear purpose: positioning the paper relative to formal verification systems and pre-empting reviewer questions about the relationship to proof assistants.

---

## 6. Flags for Future Sessions

These are observations noted during the session that may warrant attention in future work:

**Flag 1: Two-level DAG/cycle structure is a core concept**
This concept — proof graphs are DAGs at the proof level but may contain cycles within algorithm capsule nodes — appears in §2.2, §3.3, §7, and §9. It was flagged multiple times as deserving prominent treatment. If the paper is extended or a follow-on paper is written, this should be developed further, possibly with a formal definition.

**Flag 2: I.2 and I.3 are natural additions to the Euclid pilot bundle**
Propositions I.2 (Place a line segment) and I.3 (Cut off from the greater line) were never added to the pilot. Both involve constructions that could contain algorithm capsules. They are recommended as the first corpus additions after submission.

**Flag 3: Capsule-internal subgraph expansion is a significant future direction**
The §8 future direction on exposing capsule-internal structure as subgraphs is technically ambitious but conceptually important. It would require a viewer with expand/collapse capability. This is the most significant architectural extension planned.

**Flag 4: Reference [14] GLMP decision pending**
See Action Item B above. Decision needed before submission.

**Flag 5: Programming Framework paper consistency check needed**
Before uploading the updated Programming Framework paper to Zenodo, verify that its abstract and methodology description are consistent with how it is characterized in §2.4 and §6 of this paper. Specifically check: the five-category color system description, the application domains listed, and the extension/application framing.

---

## 7. Paper Structure Map

For quick navigation in Cursor:

| Section | Title | Key content |
|---------|-------|-------------|
| Abstract | — | Findings-first; diagonalization family; algorithm capsules |
| §1.1 | Representation Problem | Three object types; fragmentation consequences |
| §1.2 | Proposed Approach | Three graph types; reveals vs. redescribes answer; phylogenetic analogy |
| §1.3 | Contributions | Four contributions; diagonalization family in Theoretical bullet |
| §2.1 | Mathematical Knowledge Representation | QED, Lean, Coq, Isabelle, Mizar, OpenMath |
| §2.2 | Graph-Based Proof Representation | DAG definition; two-level structure; argument mapping |
| §2.3 | LLM-Assisted Mathematical Reasoning | LLM reasoning vs. diagram generation distinction |
| §2.4 | The Programming Framework | Application and extension framing |
| §2.5 | Graph Generation Pipeline | **NEW** Five-step pipeline |
| §3.1 | Algorithmic Flowcharts | Standard flowchart; Figure 1 Euclidean Algorithm |
| §3.2 | Axiomatic Dependency Graphs | DAG; logical acyclicity; Figure 2 Euclid Elements |
| §3.3 | Proof Graphs | Eight-role vocabulary; mutual exclusivity; algorithm capsule concept; examples |
| §4.1 | Informal vs. Lean Proof Graphs | **MOVED FROM §3.4** Comparison table |
| §4.2 | Loops, Back-Edges, Iterative Structure | **MOVED FROM §3.5** Induction back-edge diagram |
| §4.3 | Merge and Chain Topologies | **MOVED FROM §3.5** Pythagorean theorem topologies |
| §4.4 | Conjunctive Premises and AND Structure | **MOVED FROM §3.5** Open design question |
| §5.1 | Database Architecture | JSON schema; field name note; corpus counts |
| §5.2 | Named Collections | Navigational device; 95 groupings |
| §5.3 | Corpus Overview | **NEW** Table 1 with exact figures |
| §5.4 | Live Database | Three confirmed URLs |
| §6.1 | Algorithm Capsules in Proofs | All eight entries; diagonalization family; Gödel capsule twin |
| §6.2 | Structural Complexity Comparison | Exact figures; three observations |
| §6.3 | Cross-Proof-Family Comparison | Pythagorean families; metric vs. aesthetic comparison |
| §7 | Limitations | Six limitations including new DAG/cycle limitation |
| §8 | Future Directions | Seven directions including two new ones |
| §9 | Conclusion | Findings-first; reveals vs. redescribes restated; two-level structure |
| Appendix | Reference Proof Graph | Infinitely Many Primes with full role styling |

---

*End of handoff document.*
*Session conducted: Claude chat "Algorithms, Axiomatic Theories and Proofs", June 2026*
