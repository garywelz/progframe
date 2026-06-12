# PLOS ONE Submission Package — Mathematics Paper

**Paper:** Proof Graphs and Algorithm Capsules: A Corpus Study of Diagonalization Proofs from Cantor to Gödel to Goodstein
**Author:** Gary Welz (sole author)
**Target journal:** [*PLOS ONE*](https://journals.plos.org/plosone/)
**Preprint:** Zenodo — DOI [10.5281/zenodo.20510603](https://doi.org/10.5281/zenodo.20510603)
**Source:** `proof-graphs-diagonalization-corpus.md`
**Submission PDF:** `latex/paper.pdf` (rebuild: `cd latex && ./build_latex.sh`)

**Prior submission:** Declined at desk review, *Journal of Logic and Computation*, June 2026 (JLC 26-093; genre fit — editors classified as survey).

---

## 1. Article type & scope fit

- **Article type:** Research Article
- **Framing:** Methods + open dataset + empirical corpus study (eight proof graphs)
- **Central claim:** Proof graphs with algorithm capsules reveal a diagonalization family spanning Cantor, Gödel, and Goodstein — a structural signature visible in graphs but not in prose
- **Data availability:** Mathematics Database URLs in §5.4; JSON schema in §5.1

---

## 2. Submission system

Submit via [PLOS ONE Editorial Manager](https://www.editorialmanager.com/pone/default.aspx).

Typical requirements:
- Main manuscript (PDF or DOCX; LaTeX source optional at submission)
- Cover letter (paste §3)
- Abstract and keywords (in manuscript)
- Author contributions, competing interests, funding (forms + statements in manuscript)
- Data availability statement
- Optional: suggested reviewers

---

## 3. Cover letter (draft)

**Subject / upload:** Cover letter

---

Dear Editors,

Please consider the attached manuscript, "Proof Graphs and Algorithm Capsules: A Corpus Study of Diagonalization Proofs from Cantor to Gödel to Goodstein," for publication as a research article in *PLOS ONE*.

The paper introduces a proof-graph formalism with an eight-role node vocabulary and the algorithm capsule as a representational device for embedded procedural substructures within mathematical proofs. Its central empirical contribution is a corpus study of eight proof graphs identifying a **diagonalization family**: Cantor's diagonal arguments, Gödel's First Incompleteness Theorem, and the Kirby–Paris/Goodstein independence result share a common topological signature in the graph representation — in each case an algorithm capsule is the structural core of the proof. This family resemblance is visible and measurable in the graphs but not recoverable from prose alone.

The work contributes (1) a reusable proof-graph vocabulary and generation pipeline (human-in-the-loop LLM diagram generation, as an extension of the Programming Framework), (2) a publicly accessible Mathematics Database with machine-readable metadata, and (3) pilot corpus findings grounded in exact node, edge, and capsule counts. It will be of interest to researchers in mathematical knowledge representation, proof structure, diagrammatic reasoning, and LLM-assisted scholarly workflows.

A preprint is available on Zenodo (DOI 10.5281/zenodo.20510603). The manuscript is original and is not under consideration elsewhere. There are no competing interests. Funding and AI-use disclosures are included in the manuscript Acknowledgments.

Thank you for your consideration.

Sincerely,
Gary Welz
Researcher, New Media Lab, CUNY Graduate Center
gwelz@gc.cuny.edu
ORCID: 0009-0005-7806-0892

---

## 4. Declarations checklist

- [ ] Originality / not under review elsewhere
- [ ] Preprint disclosed (Zenodo)
- [ ] Competing interests: none
- [ ] Funding: CopernicusAI Knowledge Engine; CUNY Graduate Center New Media Lab
- [ ] Data availability statement (database URLs + schema)
- [ ] AI use disclosed in Acknowledgments
- [ ] Author contributions (sole author)

---

## 5. Data availability statement (draft — for form or manuscript)

The Mathematics Database corpus, interactive viewers, and JSON metadata are publicly accessible at the URLs cited in §5.4 of the manuscript. The normative JSON schema is given in §5.1. Source Markdown for the manuscript and rebuild scripts are in the `garywelz/progframe` repository (`collaborations/mathematics-database/`).

---

## 6. Submission checklist

- [ ] Rebuild PDF after final edits: `cd latex && ./build_latex.sh`
- [ ] Verify all 8 figures and 2 tables render correctly
- [ ] Upload manuscript PDF
- [ ] Paste cover letter
- [ ] Complete PLOS declaration forms
- [ ] Optional: upload LaTeX source from `latex/`

---

## 7. After submission

- [ ] Save PLOS acknowledgment email
- [ ] Update `papers/SUBMISSION-STATUS.md`
- [ ] Optional: new Zenodo version noting "under review at PLOS ONE" (concept DOI unchanged)
