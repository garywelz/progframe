# JLC Submission Package — Mathematics Paper

**Paper:** Algorithms, Axiomatic Theories, and Proofs as Graphs: A Unified Diagrammatic Representation of Mathematical Structure
**Author:** Gary Welz (sole author)
**Target journal:** *Journal of Logic and Computation* (Oxford University Press), ISSN 0955-792X
**Fallback:** *PLOS ONE* (dataset/methods framing)
**Preprint:** Zenodo, 2 June 2026 — DOI 10.5281/zenodo.20510603
**Submission file:** `algorithms-axiomatic-theories-proofs-welz-2026.pdf`

---

## 1. Submission system & mechanics

- **System:** ScholarOne Manuscripts — `https://mc.manuscriptcentral.com/jlc` (linked from the OUP "Submit" / Author Guidelines page). Create/sign in to a ScholarOne account (separate from any OUP reader account).
- **Article type:** Research paper / Original article.
- **File for review:** A single **PDF** is accepted for peer review. (JLC prefers LaTeX; the editable **LaTeX source is required only on acceptance** — see §6 below.)
- **No strict length limit** — paper is ~8,100 words main text + 8 figures + 2 tables; within normal range.

---

## 2. Required metadata (copy/paste fields)

**Title**
Algorithms, Axiomatic Theories, and Proofs as Graphs: A Unified Diagrammatic Representation of Mathematical Structure

**Author / corresponding author**
Gary Welz — Researcher, New Media Lab, CUNY Graduate Center
Email: gwelz@gc.cuny.edu
ORCID: 0009-0005-7806-0892
(Sole author.)

**Abstract** — use the abstract from the paper (~275 words), verbatim.

**Keywords**
mathematical knowledge representation; proof graphs; axiomatic systems; LLM-generated diagrams; Mermaid; process visualization; graph-theoretic representation; Programming Framework

**MSC 2020 classification codes** (proposed)
- **Primary:** `03B70` — Logic in computer science
- `68T30` — Knowledge representation and reasoning
- `03F03` — Proof theory, general
- `03A05` — Philosophical and critical aspects of logic and foundations
- `03-04` — Software, source code, etc. for problems pertaining to mathematical logic and foundations

(ACM CCS, if requested: *Theory of computation → Logic*; *Computing methodologies → Knowledge representation and reasoning*.)

---

## 3. Cover letter (draft — paste into the "Cover Letter" field)

> Dear Editors-in-Chief,
>
> I am pleased to submit the enclosed manuscript, "Algorithms, Axiomatic Theories, and Proofs as Graphs: A Unified Diagrammatic Representation of Mathematical Structure," for consideration as an original research article in the *Journal of Logic and Computation*.
>
> The paper develops a single graph-theoretic representation for three object types usually treated as categorically separate — algorithms, axiomatic systems, and proofs — expressing each as a labeled directed graph in Mermaid Markdown. Its central technical contribution is a **proof-graph formalism** with an eight-role node vocabulary (source, assumption, construction, assertion, inference, algorithm capsule, contradiction, conclusion), together with the empirical identification of recurring **algorithm capsules** and a **diagonalization family** spanning Cantor's diagonal proofs, Gödel's First Incompleteness proof, and the Kirby–Paris/Goodstein independence result. These structural regularities are visible and measurable in the graph representation but not recoverable from prose alone. The representation is realized as a publicly accessible, machine-readable corpus (the Mathematics Database).
>
> This work sits squarely within the journal's scope — logic and computation, knowledge representation, proof structure, and the semantics of formal systems — and bridges logical structure with computational, LLM-assisted construction. The methodology is presented as a domain-specific extension of the Programming Framework (Welz, 2026), here applied to logical and justificatory structure rather than procedural processes.
>
> A preprint of this manuscript is available on Zenodo (DOI 10.5281/zenodo.20510603). The work is original, has not been published elsewhere, and is not under consideration by any other journal. There are no competing interests to declare, and as sole author I am the corresponding author. Large language models were used as a tool within the described methodology (diagram generation) and to assist with manuscript editing; all scholarly content, claims, and final wording are my own and my responsibility.
>
> Thank you for considering this submission. I would be glad to provide any additional materials the editors require.
>
> Sincerely,
> Gary Welz
> New Media Lab, CUNY Graduate Center — gwelz@gc.cuny.edu

---

## 4. Declarations to have ready

- **Originality / exclusivity:** Original; not published or under review elsewhere. ✔ (stated in cover letter)
- **Preprint policy:** Zenodo preprint exists (DOI above). OUP permits preprint deposition; declare it on the form if asked. ✔
- **Competing interests:** None.
- **Funding:** Part of the CopernicusAI Knowledge Engine project; institutional support from CUNY Graduate Center New Media Lab. (No grant numbers — confirm if any apply.)
- **Data availability:** Mathematics Database is publicly accessible; include the live URLs (already cited in §5.4 of the paper) as the data-availability statement.
- **AI-use disclosure:** See §5 — recommend adding one sentence to Acknowledgments.

---

## 5. ACTION — recommended AI-use disclosure

OUP requires disclosure of AI tools used in manuscript preparation (AI cannot be an author). The cover letter discloses it, but the manuscript itself should too. Suggested addition to the **Acknowledgments**:

> *The diagrams in this paper were generated with large-language-model assistance as part of the Programming Framework methodology described herein; LLM tools were also used to assist with copy-editing and revision. All scholarly content, analysis, and conclusions are the author's own.*

(Decide before submitting; this is an editorial/ethics call for the author.)

---

## 6. On acceptance (not now)

JLC requires the editable **LaTeX source** of the final accepted version. The paper is currently authored in Markdown → PDF. Plan: convert `algorithms-axiomatic-theories-proofs-revised.md` to LaTeX (e.g., via pandoc to the OUP `logcom`/standard article class), re-render the 8 Mermaid figures as vector PDF/EPS, and supply figures as separate files. This is a post-acceptance task; the PDF is sufficient for initial submission.

---

## 7. Suggested reviewers (author to fill in)

JLC may ask for 2–4 suggested reviewers. Good profiles to target (no conflicts of interest, not recent co-authors):
- A researcher in **automated reasoning / formal proof representation**.
- A researcher in **knowledge representation / diagrammatic reasoning**.
- A researcher in **logic and the semantics of proof** or **proof theory**.

Provide name, affiliation, email, and a one-line rationale for each.

---

## 8. Pre-submission checklist

- [ ] PDF renders correctly, all 8 figures legible, 2 tables intact.
- [ ] Abstract, keywords, MSC codes entered.
- [ ] ORCID linked in ScholarOne profile.
- [ ] Cover letter pasted/uploaded.
- [ ] AI-use disclosure decision made (see §5).
- [ ] Data-availability statement (Mathematics Database URLs) ready.
- [ ] Competing-interests and funding statements ready.
- [ ] Suggested reviewers prepared (optional but helpful).
- [ ] Confirm corresponding-author details.
