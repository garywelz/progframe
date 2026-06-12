# JLC Submission Package — Mathematics Paper

**Paper:** Algorithms, Axiomatic Theories, and Proofs as Graphs: A Unified Diagrammatic Representation of Mathematical Structure
**Author:** Gary Welz (sole author)
**Target journal:** *Journal of Logic and Computation* (Oxford University Press), ISSN 0955-792X
**Fallback:** *PLOS ONE* (dataset/methods framing)
**Preprint:** Zenodo, 2 June 2026 — DOI 10.5281/zenodo.20510603
**Submission file:** `algorithms-axiomatic-theories-proofs-welz-2026.pdf`
**Submitted:** June 2, 2026 — email to Jane Spurr (jane@janespurr.net), subject `JLC Submission`, from gwelz@gc.cuny.edu
**Outcome:** Desk rejection, June 2026 — JLC 26-093. Editors: "generic survey paper" (genre fit). No peer review. **Next venue:** PLOS ONE — see `algorithms-axiomatic-theories-proofs-PLOS-ONE-SUBMISSION.md`.

---

## 1. Submission system & mechanics

**JLC does not use ScholarOne.** The old portal (`mc.manuscriptcentral.com/jlc`) is inactive. Per the journal's current Author Guidelines:

- **Submit to:** Jane Spurr — **jane@janespurr.net**
- **Subject line:** `JLC Submission`
- **Attachment:** PDF of the manuscript
- **Covering message:** separate email body (cover letter) — see §3 below
- **Article type:** Regular submission (not a Corner — see note below)
- **No strict length limit** — paper is ~8,100 words main text + 8 figures + 2 tables; within normal range.

**What happens next:** Contributions are acknowledged; referees' comments and the Editorial Board decision are forwarded as soon as possible.

**Corners:** JLC also publishes topic-specific "Corners" (open-ended special-issue streams). This paper is a **regular submission**, not a Corner submission — do not name a Corner in the covering note.

**On acceptance:** Editable LaTeX source is typically required for production. A ready bundle is in `latex/` (see §6).

---

## 2. Required metadata (include in covering email)

**Title**
Algorithms, Axiomatic Theories, and Proofs as Graphs: A Unified Diagrammatic Representation of Mathematical Structure

**Author / corresponding author**
Gary Welz — Researcher, New Media Lab, CUNY Graduate Center
Email: gwelz@gc.cuny.edu
ORCID: 0009-0005-7806-0892
(Sole author.)

**Abstract** — included in the PDF; optionally paste into the email body as well.

**Keywords**
mathematical knowledge representation; proof graphs; axiomatic systems; LLM-generated diagrams; Mermaid; process visualization; graph-theoretic representation; Programming Framework

**MSC 2020 classification codes** (proposed)
- **Primary:** `03B70` — Logic in computer science
- `68T30` — Knowledge representation and reasoning
- `03F03` — Proof theory, general
- `03A05` — Philosophical and critical aspects of logic and foundations
- `03-04` — Software, source code, etc. for problems pertaining to mathematical logic and foundations

---

## 3. Covering email (draft — paste into email body)

**To:** jane@janespurr.net
**Subject:** JLC Submission
**Attachment:** `algorithms-axiomatic-theories-proofs-welz-2026.pdf`

---

Dear Ms. Spurr,

Please find attached my manuscript, "Algorithms, Axiomatic Theories, and Proofs as Graphs: A Unified Diagrammatic Representation of Mathematical Structure," for consideration as an original research article in the *Journal of Logic and Computation*.

The paper develops a single graph-theoretic representation for three object types usually treated as categorically separate — algorithms, axiomatic systems, and proofs — expressing each as a labeled directed graph in Mermaid Markdown. Its central technical contribution is a proof-graph formalism with an eight-role node vocabulary (source, assumption, construction, assertion, inference, algorithm capsule, contradiction, conclusion), together with the empirical identification of recurring algorithm capsules and a diagonalization family spanning Cantor's diagonal proofs, Gödel's First Incompleteness proof, and the Kirby–Paris/Goodstein independence result. These structural regularities are visible and measurable in the graph representation but not recoverable from prose alone. The representation is realized as a publicly accessible, machine-readable corpus (the Mathematics Database).

This work sits within the journal's scope — logic and computation, knowledge representation, proof structure, and the semantics of formal systems — and bridges logical structure with computational, LLM-assisted construction. The methodology is presented as a domain-specific extension of the Programming Framework (Welz, 2026), here applied to logical and justificatory structure rather than procedural processes.

**Keywords:** mathematical knowledge representation; proof graphs; axiomatic systems; LLM-generated diagrams; Mermaid; process visualization; graph-theoretic representation; Programming Framework

**MSC 2020:** 03B70 (primary); 68T30; 03F03; 03A05; 03-04

A preprint is available on Zenodo (DOI 10.5281/zenodo.20510603). The work is original, has not been published elsewhere, and is not under consideration by any other journal. There are no competing interests to declare. Large language models were used as a tool within the described methodology (diagram generation) and to assist with manuscript editing; all scholarly content, claims, and final wording are my own and my responsibility. AI use is also disclosed in the Acknowledgments of the attached PDF.

Thank you for considering this submission.

Sincerely,
Gary Welz
Researcher, New Media Lab, CUNY Graduate Center
gwelz@gc.cuny.edu
ORCID: 0009-0005-7806-0892

---

## 4. Declarations (stated in email and/or paper)

- **Originality / exclusivity:** Original; not published or under review elsewhere. ✔
- **Preprint:** Zenodo preprint exists (DOI above). ✔
- **Competing interests:** None.
- **Funding:** CopernicusAI Knowledge Engine project; institutional support from CUNY Graduate Center New Media Lab.
- **Data availability:** Mathematics Database URLs cited in paper §5.4.
- **AI-use disclosure:** In Acknowledgments of the PDF. ✔

---

## 5. LaTeX source (ready for acceptance)

Location: `collaborations/mathematics-database/latex/`

| File | Purpose |
|---|---|
| `paper.tex` | Standalone pandoc LaTeX |
| `header.tex` | Preamble |
| `figures/fig1.pdf` … `fig8.pdf` | Vector Mermaid diagrams |
| `build_latex.sh` | Rebuild pipeline |

Rebuild: `cd latex && ./build_latex.sh` → `paper.pdf` (~31 pp.)

Do **not** attach LaTeX source with the initial email submission unless requested — PDF only for review.

---

## 6. Suggested reviewers (optional — offer in email if desired)

- A researcher in **automated reasoning / formal proof representation**
- A researcher in **knowledge representation / diagrammatic reasoning**
- A researcher in **logic and the semantics of proof** or **proof theory**

Provide name, affiliation, email, and one-line rationale for each.

---

## 7. Submission checklist — completed June 2, 2026

- [x] PDF renders correctly, all 8 figures legible, 2 tables intact
- [x] AI-use disclosure present in Acknowledgments
- [x] Email to jane@janespurr.net with subject **JLC Submission**
- [x] PDF attached: `algorithms-axiomatic-theories-proofs-welz-2026.pdf`
- [x] Covering message sent (June 2, 2026)
- [x] Sent from gwelz@gc.cuny.edu

## 8. After submission

- [x] Submitted to editorial office (June 2, 2026)
- [x] Decision received: desk rejection (genre fit — survey), JLC 26-093
- [x] Retitled and restructured for PLOS ONE (`proof-graphs-diagonalization-corpus.md`)
- Companion **Programming Framework** paper submitted separately to *Learned Publishing* (same day)
