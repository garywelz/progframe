# Research program overview — Gary Welz

**Affiliation:** New Media Lab, CUNY Graduate Center  
**Canonical author block:** Researcher, New Media Lab, CUNY Graduate Center · Email `gwelz@gc.cuny.edu` · ORCID https://orcid.org/0009-0005-7806-0892  

**Last updated:** May 2026  

**Canonical path (this document):** `papers/program-overview.md` in repo [garywelz/progframe](https://github.com/garywelz/progframe).

---

## Purpose

Single map of manuscripts and collaboration drafts **in active use**, with stable links and cross-paper guardrails.

**Use for:**

- Cross-paper consistency (claims, terminology, spelling).
- Briefing collaborators (e.g. Krampis lab) without resending every draft.
- Session context for tooling (Cursor, Claude, etc.) — read this first, then open the cited files.

---

## Repository map

| Artifact | Repo | Role |
|---------|------|------|
| Programming Framework manuscript, submission notes, cover letter | [progframe](https://github.com/garywelz/progframe) | Canonical MD for LP submission |
| Mathematics Database paper | [progframe](https://github.com/garywelz/progframe) | Methods + corpus paper |
| Krampis / virtual-cell collaboration drafts | [glmp](https://github.com/garywelz/glmp) | Working papers under `collaborations/krampis-virtual-cell/` |
| Knowledge Engine vision paper | [copernicus-web](https://github.com/garywelz/copernicus-web) | Vision / CopernicusAI framing |

---

## Shared terminology and claims

**Maintain this table when a term or global rule changes.**

| Term / rule | Canonical wording | Where it applies |
|-------------|-------------------|----------------|
| GLMP full name | **Genome Logic Modelling Project** (UK *Modelling*) | PF paper, math paper cross-references, GLMP-facing text |
| Mathematics programme name | **Algorithms, Axiomatic Theories, and Proofs** (not “Axioms” in the trilogy title) | Math paper title, PF paper, this overview |
| Process / diagram **counts** in prose | **Do not use** (“100+”, “70+”, etc.) in journal-bound PF prose | PF manuscript (counts may appear in tooling/vision docs elsewhere — avoid copying into PF) |
| GLMP validation claim | **Do not** claim GLMP is “under domain expert review” or name Hunter labs unless accurate and authorised | PF manuscript |
| Chemistry / physics / CS in PF | **Early-stage / illustrative range** — not parity with GLMP + math programme | PF manuscript |
| Author block | Gary Welz; Researcher, New Media Lab, CUNY Graduate Center; email; ORCID | All newly edited papers |
| PF Space | https://huggingface.co/spaces/garywelz/programming_framework | PF, citations |
| GLMP Space | https://huggingface.co/spaces/garywelz/glmp | PF, math, biology text |
| Math database table (public) | https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html | Math paper, PF |
| Zenodo PF preprint DOI | https://doi.org/10.5281/zenodo.18463442 | PF manuscript text, cover letter |

**Consistency debt (non-blocking):**

- **`copernicus-web` vision paper:** [knowledge_engine_vision.md](https://github.com/garywelz/copernicus-web/blob/main/papers/knowledge_engine_vision.md) still uses an older affiliation line and Gmail in the Markdown; it also cites operational counts (papers, processes) suited to an internal README, not PF submission rules — align author block when that file is next edited, and avoid porting stale counts into PF.
- **Math paper abstract** currently refers to **“Genome Logic Modeling Project”** (US *Modeling*) in one sentence — consider aligning to **Genome Logic Modelling Project** for consistency with PF and GLMP naming.

---

## Paper 1 — The Programming Framework

**Title:** *The Programming Framework: A General Method for Process Analysis Using LLMs and Mermaid Visualisation*  

**Source of truth:** [papers/programming-framework-paper/current-draft.md](https://github.com/garywelz/progframe/blob/main/papers/programming-framework-paper/current-draft.md)  

**Venue / type:** [*Learned Publishing*](https://onlinelibrary.wiley.com/journal/17414857) (Wiley / ALPSP) — Original Article  

**Supporting files in repo:**  

- Submission checklist / guidelines: [`papers/programming-framework-paper/submission-target.md`](https://github.com/garywelz/progframe/blob/main/papers/programming-framework-paper/submission-target.md)  
- Cover letter: [`papers/programming-framework-paper/cover-letter-learned-publishing.md`](https://github.com/garywelz/progframe/blob/main/papers/programming-framework-paper/cover-letter-learned-publishing.md)  

**Status:** Submission-ready contingent on author’s final read-through. Main-text prose for Wiley cap: rerun `papers/programming-framework-paper/count_prose_words.py` before submit (script excludes abstract, fenced code, references block; includes appendix prose). **`submission-target.md` still carries an outdated raw `wc` note** — ignore for limit; trust the prose script unless Wiley asks otherwise.  

**Preprint:** [Zenodo 18463442](https://doi.org/10.5281/zenodo.18463442) — update metadata/PDF after final revision.  

**Core claim (one sentence):** A repeatable methodology for extracting structured, versionable **Mermaid** diagrams (with JSON/metadata) from text using **LLMs**, with **biology (GLMP)** and **mathematics (Algorithms, Axiomatic Theories, and Proofs)** as the two grounded applications; chemistry / physics / computer science framed as illustrative.  

**Ties to other work:** Depends on math programme for extended graph types; depends on GLMP as biological application narrative; informs **Knowledge Engine** as downstream consumer of process artefacts.  

**Recent alignment pass:** APA references, Oxford UK including abstract, standardised author block, removed inflated domain claims and numeric process brags per submission discipline.  

---

## Paper 2 — Algorithms, Axiomatic Theories, and Proofs (Mathematics Database)

**Title:** *Algorithms, Axiomatic Theories, and Proofs as Graphs: A Unified Diagrammatic Representation of Mathematical Structure*  

**Source of truth:** [collaborations/mathematics-database/mathematics-paper-draft.md](https://github.com/garywelz/progframe/blob/main/collaborations/mathematics-database/mathematics-paper-draft.md)  

**Venue:** *Journal of Logic and Computation* (primary); *PLOS ONE* — secondary framing noted in draft header  

**Zenodo:** Not indicated in draft header — fill when deposited.  

**Core claim:** Algorithms, axiomatic theories, and proofs are unified as labelled directed graphs (**Mermaid** + JSON), with **three** `processType` families and **eight-role** proof-graph vocabulary (**source, assumption, construction, assertion, inference, algorithm capsule, contradiction, conclusion**); public table viewer supplies manifest-backed counts for ongoing corpus discussion.  

**Quantitative anchors (draft §5.2 — may evolve with manifest):** Small proof-graph corpus *N* = 8 bundles in the analysed manifest slice; pooled average order of magnitude **~25 nodes, ~28 edges** per proof graph (with cited range across entries). Treat as **manifest-documented**, not epidemiological inference.  

**Ties:** Methodological parent — **Programming Framework**; parallels **GLMP** as domain instantiation (regulatory/process logic vs mathematical justification structure).  

**Recent alignment:** Title uses **Axiomatic Theories**; figure set and references expanded per manuscript history.  

---

## Paper 3 — Knowledge Engine vision (CopernicusAI)

**Title:** *A Vision for AI-Powered Knowledge Engines: A Framework for Systematic Knowledge Discovery and Integration*  

**Source of truth:** [papers/knowledge_engine_vision.md](https://github.com/garywelz/copernicus-web/blob/main/papers/knowledge_engine_vision.md) in [garywelz/copernicus-web](https://github.com/garywelz/copernicus-web)  

**Nature:** Vision / taxonomy paper; operational stats in body will go stale quickly. Prefer **architecture and capability taxonomy** wording when briefing without locking numbers unless refreshed the same month. CopernicusAI Hugging Face entry point (if still accurate): https://huggingface.co/spaces/garywelz/copernicusai  

**Core claim:** “Knowledge engines” synthesise ingestion → communication through nine integrated capability classes; CopernicusAI is an existence proof instantiation, not final validation.  

**Ties:** References **Programming Framework** for diagram/process representation; complements GLMP/Math DB as content inside a larger knowledge system.  

**Action:** On next revision, unify **author block** with canonical ORCID/email/affiliation line used in progframe papers.  

---

## Papers 4–9 — GLMP × Krampis “Virtual Cell” collaboration drafts

**Folder (canonical Markdown):** [glmp/collaborations/krampis-virtual-cell](https://github.com/garywelz/glmp/tree/main/collaborations/krampis-virtual-cell)  

**Collaboration README:** Describes workflow (fork → PR), draft status expectations, and [file manifest](https://github.com/garywelz/glmp/blob/main/collaborations/krampis-virtual-cell/README.md).  

These are **six** linked working drafts (not merged into PF LP manuscript). Prefer linking here rather than pasting movable claims into PF until a single bioRxiv/journal manuscript is frozen.

| # | Draft (canonical link) | Stated thrust (from repo README filenames / titles) |
|---|-------------------------|------------------------------------------------------|
| 4 | [primitive-relations-genomic-computational-class.md](https://github.com/garywelz/glmp/blob/main/collaborations/krampis-virtual-cell/primitive-relations-genomic-computational-class.md) | Foundational typology: primitive relations / genomic computational class |
| 5 | [genome-as-computer.md](https://github.com/garywelz/glmp/blob/main/collaborations/krampis-virtual-cell/genome-as-computer.md) | Logical primitives / limits of biological prediction |
| 6 | [circuit-class-predicts-virtual-cell-model-accuracy.md](https://github.com/garywelz/glmp/blob/main/collaborations/krampis-virtual-cell/circuit-class-predicts-virtual-cell-model-accuracy.md) | Empirical framing: circuit class vs VC model accuracy |
| 7 | [glmp-genomic-complexity-synthesis.md](https://github.com/garywelz/glmp/blob/main/collaborations/krampis-virtual-cell/glmp-genomic-complexity-synthesis.md) | Biology-facing genomic regulatory complexity synthesis |
| 8 | [mermaid-flowcharts-smarter-perturbation-design.md](https://github.com/garywelz/glmp/blob/main/collaborations/krampis-virtual-cell/mermaid-flowcharts-smarter-perturbation-design.md) | Methods-facing: flowcharts × perturbation design |
| 9 | [teaching-deck-krampis-biochemical-process-modeling.md](https://github.com/garywelz/glmp/blob/main/collaborations/krampis-virtual-cell/teaching-deck-krampis-biochemical-process-modeling.md) | Teaching/proposal slide material (Markdown derivative) |

**Cross-discipline glue:** Konstantinos Krampis (Hunter / CUNY GC) collaboration; methodological upstream **Programming Framework** + GLMP artefacts; downstream virtual-cell / perturbation narratives. PF manuscript should cite **released** artefacts only unless a specific Krampis draft is jointly approved for citation.

---

## Suggested workflows

1. **Before LP submit:** Diff PF draft vs this overview; run `count_prose_words.py`; skim math paper §5.2 counts if corpus changed.  
2. **Before math submit:** Align GLMP spelling in abstract; reconcile any corpus table numbers with prose.  
3. **Before vision paper refresh:** Rewrite operational stats or date-stamp them; fix author strip.  
4. **Krampis folder:** Discuss in PR on `garywelz/glmp`; avoid silent claim drift back into progframe manuscripts.  

---

## Why this replaces a multi-step Claude “handoff”

This file is maintained **in-repo** next to PF sources: URLs are primary, placeholders are eliminated, contradictory template lines (obsolete math title, faux “Welz & Krampis Paper I”) are omitted, Krampis work is enumerated as six drafts, and divergence notes tie **copernicus-web** ↔ **progframe** without duplicating brittle stats. Extend by appending sections or bumping versions when new manuscripts appear.

