# Programming Framework Paper — Revision Notes
**Repository:** garywelz/progframe  
**Folder:** papers/programming-framework-paper/  
**File:** revision-notes.md  
**Last updated:** May 2026  
**Status:** Pre-submission revision pass — ready for Cursor implementation

---

## Context

This document captures all agreed revisions to the Programming Framework paper
prior to submission to *Learned Publishing* (Wiley/ALPSP). It was produced
in a Claude.ai strategy session in May 2026 and is intended as a complete
Cursor handoff document. Execute changes in the order listed.

The current draft is the PDF version on Zenodo. It should be converted to
markdown and placed at:
`papers/programming-framework-paper/current-draft.md`

All revisions below are surgical — this is not a rewrite. Estimated Cursor
work: half a day.

---

## Target Venue

**Primary:** *Learned Publishing* (Wiley, published for ALPSP)  
- Scopus-indexed  
- Covers tools and methods for scholarly communication  
- Regularly publishes papers on AI-assisted research workflows  
- Word limit: 6,000–8,000 words (current draft is within range)  
- Accepts structured methodology papers with figures  
- Submission portal: https://onlinelibrary.wiley.com/journal/17414857

**Second choice if declined:** *F1000Research*  
- Fast publication, Scopus-indexed, open peer review  
- Good for methodology/framework papers proposing rather than reporting

---

## Revision 1 — Abstract (HIGH PRIORITY)

**Replace the entire abstract with the following:**

> Scientific and technical fields rely heavily on textual process descriptions
> that are difficult to compare, analyze, or reuse computationally. We introduce
> the Programming Framework, a methodology for transforming textual process
> descriptions into structured, computable diagrams using large language models
> (LLMs) and Mermaid diagram syntax. Node colors, shapes, and edge types serve
> as lightweight semantic markers, providing flexible visual encoding that can
> be adapted to domain-specific conventions. We demonstrate the feasibility and
> cross-domain transferability of the methodology through application across
> biology (100+ processes via the Genome Logic Modeling Project, currently
> undergoing domain expert review), chemistry (70+ processes), and mathematics
> — where the framework extends naturally from algorithmic flowcharts to
> axiomatic dependency graphs and proof graphs, enabling unified structural
> comparison across procedural and logical forms. Applications in physics and
> computer science further demonstrate domain-agnostic transferability. The
> methodology is designed to lower the barrier to process visualization for
> researchers, educators, and AI systems, enabling structured comparison and
> analysis across scientific disciplines without requiring specialized software
> or domain-specific diagramming expertise. The Programming Framework is
> proposed as reusable, open infrastructure — a starting point that others can
> adopt, extend, and critique — with all methodology, tools, and examples
> publicly available.

**Rationale:**  
- Removes five-color enumeration from abstract (too granular for this level)  
- Replaces "demonstrate effectiveness" with "demonstrate feasibility and
  cross-domain transferability" — accurate to what the paper shows without
  inviting reviewer objection that no formal evaluation was conducted  
- Elevates mathematics section to showcase the three graph types  
- Adds Krampis collaboration sentence ("currently undergoing domain expert
  review") — transforms the validation story without overclaiming results  
- Foregrounds infrastructure framing in closing sentence

---

## Revision 2 — Affiliation Line (HIGH PRIORITY)

**Find:**
```
Gary Welz  
Retired Faculty Member  
John Jay College, CUNY (Department of Mathematics and Computer Science)  
Borough of Manhattan Community College, CUNY  
CUNY Graduate Center (New Media Lab)  
Email: garywelz@gmail.com
```

**Replace with:**
```
Gary Welz  
Independent Researcher  
Affiliate, New Media Lab, CUNY Graduate Center  
Creator, CopernicusAI Knowledge Engine  
Email: gwelz@gc.cuny.edu
```

**Rationale:**  
"Retired Faculty Member" is accurate but undersells the current positioning.
"Independent Researcher; Affiliate, New Media Lab" is consistent with all
outreach emails and the Krampis collaboration framing. Use the CUNY email,
not Gmail, for submission.

---

## Revision 3 — Introduction: Reframe Effectiveness Claim (HIGH PRIORITY)

**Find** (Section 1.2 or wherever "demonstrate effectiveness" appears in the
introduction):  
Any language claiming the framework has been shown to be *effective* or
*validated*.

**Replace with** language framing the contribution as a *feasibility
demonstration* and *methodology proposal*:

> "We demonstrate the feasibility and cross-domain transferability of the
> Programming Framework through application across five scientific disciplines.
> The framework is proposed as infrastructure for further development, not
> as a validated system with formal accuracy metrics — those remain important
> directions for future work."

**Rationale:**  
The paper has no systematic quantitative evaluation. Claiming "effectiveness"
invites the reviewer objection that no formal study was conducted. "Feasibility
and transferability" is accurate and defensible. The limitations section already
acknowledges this honestly — the introduction and abstract should match that
honesty.

---

## Revision 4 — Section 4.1 (GLMP): Add Krampis Collaboration Sentence

**Find** the end of the GLMP section opening paragraph (Section 4.1), after
the description of the GLMP scope.

**Add the following sentence:**

> "The GLMP flowcharts are currently undergoing domain expert review in
> collaboration with the Computational Genomics Laboratory at Hunter College,
> CUNY, providing an ongoing validation pathway for the biological process
> diagrams."

**Rationale:**  
Transforms GLMP from a solo project into an active validated collaboration.
Does not overclaim results — "undergoing review" is accurate. Significantly
strengthens the paper's empirical credibility for reviewers.

---

## Revision 5 — Section 4.3 (Mathematics): Elevate and Expand

**Current state:** Mathematics section is brief (Euclidean Algorithm example
only, described as "5+ processes").

**Changes required:**

**5a.** Update the process count to reflect the actual database scope. Replace
"5+ processes" with a description that captures the three graph types:

> "The framework has been applied to mathematics across three structural
> categories: algorithmic flowcharts (e.g., Sieve of Eratosthenes, Merge Sort,
> Dijkstra's Algorithm, Euclidean Algorithm), axiomatic dependency graphs
> (e.g., Euclid's Elements, Peano Arithmetic, ZFC Set Theory, Group Theory,
> Category Theory), and proof graphs — hybrid dependency graphs with node
> colors encoding proof roles including source, assumption, construction,
> assertion, inference, algorithm capsule, contradiction, and conclusion
> (e.g., Euclid Book I pilot proofs, Infinitely Many Primes, Pythagorean
> Theorem proof comparison, Cantor Diagonal proofs)."

**5b.** Add a sentence noting the database URL:

> "The full mathematics database, including interactive viewers for all three
> graph types, is available at: [GCS URL]"

Replace [GCS URL] with:  
https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html

**5c.** Add a note about the proof graph color scheme as a domain-specific
extension:

> "The proof graph representation uses a domain-specific eight-role color
> scheme (source, assumption, construction, assertion, inference, algorithm
> capsule, contradiction, conclusion) rather than the standard five-category
> system — an instance of the domain-specific customization the Programming
> Framework explicitly supports."

**Rationale:**  
The mathematics database is the strongest example of the framework's extension
beyond simple flowcharts. The three-graph-type generalization (algorithms →
axiomatic systems → proofs) is a genuine intellectual contribution that the
current paper undersells. The proof graph color scheme is a perfect concrete
illustration of the framework's customization principle.

---

## Revision 6 — Section 5.1 (Results): Update Process Counts

**Find** the process coverage list in Section 5.1.

**Update mathematics entry from:**
> "Mathematics: 5+ processes demonstrating proof methods, algorithms, and
> computational workflows"

**Replace with:**
> "Mathematics: algorithms, axiomatic systems, and proof graphs across
> multiple structural categories — see Section 4.3 and the live database"

**Rationale:** The "5+" count is now significantly undercounting and may
confuse reviewers given the expanded description in Section 4.3.

---

## Revision 7 — Section 6 (Future Directions): Add Database Development Sentence

**Find** the opening of the Future Directions section (Section 6).

**Add the following as a new short paragraph before the numbered list:**

> "Discipline-specific process databases for biology, chemistry, physics, and
> computer science are under active development as part of the broader
> Programming Framework infrastructure, with the mathematics database already
> demonstrating the framework's extension from algorithmic flowcharts to
> axiomatic dependency graphs and proof graphs. These databases are intended
> as open, versioned corpora that others can query, extend, and contribute to."

**Rationale:**  
Transforms what looks like a limitation ("only a few examples per domain") into
a forward-looking development program. Signals to reviewers and readers that
this is generative infrastructure, not a one-off demonstration.

---

## Revision 8 — References: Fix or Remove Weak Citations (MEDIUM PRIORITY)

**8a.** Reference [22] — Schulman et al. 2022 (ChatGPT blog post):  
This points to the OpenAI blog, not a peer-reviewed paper. For a methodology
submission to *Learned Publishing* this will look weak.

**Options (choose one):**  
- Replace with: Ouyang, L., et al. (2022). Training language models to follow
  instructions with human feedback. *NeurIPS 35*. (The InstructGPT paper —
  the actual peer-reviewed source for RLHF/dialogue optimization)  
- Or simply drop the citation if the claim it supports can stand without it.

**8b.** References [3] and [4] — TechCrunch and LifeHacker:  
These are fine as informal context but should be demoted to footnotes rather
than numbered bibliography entries in a journal submission. Move them to
footnotes with URLs only, no formal citation formatting.

---

## Revision 9 — Author Note: Move to Acknowledgments (LOW PRIORITY)

**Find** the Author Note at the end of the paper (after the Appendix):

> "This work is part of the CopernicusAI Knowledge Engine project..."

**Move this text** to a properly formatted Acknowledgments section placed
before the References, and expand slightly:

> "**Acknowledgments**  
> This work is part of the CopernicusAI Knowledge Engine project, which aims
> to create AI-powered tools for scientific research synthesis and knowledge
> discovery. The Programming Framework serves as a foundational methodological
> component enabling structured representation of processes across scientific
> disciplines. The author thanks the CUNY Graduate Center New Media Lab for
> institutional support."

**Rationale:**  
An "Author Note" appended after the appendix signals to editors that this is
a preprint rather than a polished journal submission. Moving it to a proper
Acknowledgments section is a small change that has an outsized effect on
perceived professionalism.

---

## Revision 10 — Zenodo Preprint: Update After Revision Pass

After all above changes are implemented and the revised draft is finalized:

1. Update the Zenodo preprint to match the revised version
2. Bump the version number
3. Ensure the Zenodo record description notes "Revised May 2026 — under review
   at *Learned Publishing*" once submission is made
4. The 2026 date on Zenodo is fine — the timestamp issue Catherine raised is
   irrelevant now that we are not submitting to Mason journals

---

## Figure Caption Bug

**Note:** Figure captions in the current PDF render as double-labeled
(e.g., "Figure 1: Figure 1: Basic Programming Framework Structure"). This
is a LaTeX/rendering artifact. Ensure the markdown version has clean single
captions:

- "Figure 1: Basic Programming Framework Structure"  
- "Figure 2: Beta-Galactosidase Regulation System in E. coli"  
- "Figure 3: Catalytic Hydrogenation Reaction"  
- "Figure 4: Euclidean Algorithm"

---

## Repo Housekeeping (Do Before Sharing Repo Externally)

The following tasks are separate from the paper revision but should be
completed in the same Cursor session:

1. **Move misplaced GLMP files** from progframe repo to the GLMP repo
   (`garywelz/glmp`). Identify all files in progframe that belong to GLMP
   by checking for GLMP-specific content (lac operon, regulatory circuits,
   genomic complexity, etc.).

2. **Create folder structure:**
   ```
   progframe/
     papers/
       programming-framework-paper/
         current-draft.md
         revision-notes.md          ← this file
         submission-target.md       ← to be created
     collaborations/
       mathematics-database/
         mathematics-paper-synthesis.md  ← already drafted
     databases/
       README.md                    ← links to GCS databases
   ```

3. **Create `submission-target.md`** — a short file containing the *Learned
   Publishing* author guidelines, word limit, formatting requirements, and
   submission checklist. Fetch from:
   https://onlinelibrary.wiley.com/journal/17414857

---

## Summary Checklist

| # | Revision | Priority | Status |
|---|----------|----------|--------|
| 1 | Replace abstract | HIGH | Drafted — paste in |
| 2 | Fix affiliation | HIGH | Ready |
| 3 | Reframe effectiveness claim in intro | HIGH | Ready |
| 4 | Add Krampis sentence to Section 4.1 | HIGH | Ready |
| 5 | Expand mathematics section (3 graph types) | HIGH | Ready |
| 6 | Update process counts in Section 5.1 | MEDIUM | Ready |
| 7 | Add database development sentence to Section 6 | MEDIUM | Ready |
| 8 | Fix weak references [3], [4], [22] | MEDIUM | Ready |
| 9 | Move author note to Acknowledgments | LOW | Ready |
| 10 | Update Zenodo after revision | LOW | Post-submission |
| — | Fix double figure caption bug | LOW | Ready |
| — | Repo housekeeping (GLMP files, folder structure) | MEDIUM | Ready |
