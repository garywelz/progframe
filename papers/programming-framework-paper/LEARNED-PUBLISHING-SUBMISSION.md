# Learned Publishing Submission Package — Programming Framework Paper

**Paper:** The Programming Framework: A General Method for Process Analysis Using LLMs and Mermaid Visualisation  
**Author:** Gary Welz (sole author)  
**Target journal:** [*Learned Publishing*](https://onlinelibrary.wiley.com/journal/17414857) (Wiley / ALPSP) — **Original Article**  
**Preprint:** Zenodo concept DOI [10.5281/zenodo.18463441](https://doi.org/10.5281/zenodo.18463441) (v2, June 2026)  
**Companion paper:** Mathematics preprint [10.5281/zenodo.20510603](https://doi.org/10.5281/zenodo.20510603); submitted to *Journal of Logic and Computation*, 2 June 2026  
**Source:** `current-draft.md` · **Build:** `./build_programming_framework_outputs.sh` → `programming_framework.pdf`, `programming_framework.docx`

**Submitted:** June 2, 2026 — Wiley Authors ([submission.wiley.com](https://submission.wiley.com)), Original Article; submission ID `4ed3a6f7-c912-4abf-b573-5fb2f612da52`

**Outcome:** **Declined at desk, June 12, 2026** — manuscript 7995743 ruled outside journal scope (no peer review). *Learned Publishing* covers the scholarly publishing industry; the paper is a research-methods contribution. Next venue under consideration.

**Full guidelines:** `submission-target.md` (Wiley Author Guidelines, captured May 2026)

---

## 1. Submission portal

- **Portal:** [submission.wiley.com](https://submission.wiley.com) → **My Submissions** (Wiley Authors account required)
- **Article type:** Original article (3,000–6,000 words main text)
- **Format for review:** **Word (.docx)** with figures embedded — use `programming_framework.docx` after rebuild
- **Help:** submissionhelp@wiley.com · journal production: LEAP@wiley.com · editorial: learnedpublishing@wiley.com

**Not email-based** (unlike JLC). Free Format submission at initial review; journal reformats if accepted.

---

## 2. Readiness snapshot (June 2026)

| Requirement | Status | Notes |
|-------------|--------|--------|
| Word count (3,000–6,000 main text) | ✅ **~5,930** | Verified June 2026 via `count_prose_words.py` |
| Abstract (&lt;200 words) | ✅ **~172** | Findings-focused |
| Key points (2–6, ~140 chars each) | ✅ | Six bullets; all ≤120 characters (June 2026) |
| ORCID | ✅ | On manuscript |
| AI / LLM disclosure | ✅ | Acknowledgments |
| Preprint declare | ✅ | Zenodo; update cover letter to **concept DOI** |
| APA references | ⚠️ | Draft uses author–date block list; verify Wiley accepts as-is for Free Format or normalize |
| Oxford UK spelling | ✅ | Largely applied (`apply_oxford_prose.py`) |
| Cover letter | ✅ | `cover-letter-learned-publishing.md` — dated; concept DOI; companion JLC note |
| DOCX/PDF build | ✅ | Rebuilt June 2, 2026 — `programming_framework.docx`, `programming_framework.pdf` |
| APC awareness | ℹ️ | Gold OA from Jan 2025; APC on acceptance unless waiver (ALPSP member discount — see `submission-target.md`) |

---

## 3. Metadata for Wiley form

**Title**  
The Programming Framework: A General Method for Process Analysis Using LLMs and Mermaid Visualisation

**Author**  
Gary Welz — Researcher, New Media Lab, CUNY Graduate Center — gwelz@gc.cuny.edu — ORCID 0009-0005-7806-0892

**Abstract** — paste from `current-draft.md` § Abstract (~175 words)

**Key points** — paste from § Key Points after shortening to ~140 characters each (§7)

**Keywords** (if requested)  
process visualisation; large language models; Mermaid; scholarly communication; knowledge representation; scientific workflows; diagram generation

---

## 4. Cover letter

Use `cover-letter-learned-publishing.md`. Before sending via the portal (or as a separate upload if requested):

- Set **[Date]** to submission date
- Preprint: cite **concept DOI** `10.5281/zenodo.18463441` (not only the version-specific DOI)
- Optional sentence: companion mathematics paper on Zenodo and **under review at JLC** (not under consideration elsewhere as a duplicate of this manuscript)

---

## 5. Declarations (Wiley prompts)

- **Originality:** Not published elsewhere; not under consideration elsewhere ✔
- **Preprint:** Declare Zenodo preprint; link concept DOI
- **Competing interests:** None
- **Funding:** None (or CopernicusAI / institutional support — match manuscript)
- **Data availability:** Public Hugging Face spaces + GCS databases (URLs in Conclusion)
- **AI use:** Disclosed in Acknowledgments; methodology uses LLMs for diagram generation
- **Suggested reviewers:** Prepare ≥2 names (publishing + knowledge representation + computational methods) if the form asks

---

## 6. Files to upload

1. **Main document:** `programming_framework.docx` (figures embedded)
2. **Cover letter** (if separate field): from `cover-letter-learned-publishing.md`
3. **Optional:** `programming_framework.pdf` for your records — portal may prefer DOCX for review

Do **not** upload Appendix prompt template as main text unless Wiley classifies it as supplementary material — consider moving long Appendix A to supplementary files if word count is tight.

---

## 7. Pre-submit fixes — completed June 2, 2026

- Word count trimmed to **5,930** (Key Points shortened; light Conclusion edit)
- Key points all ≤120 characters
- `programming_framework.docx` / `.pdf` rebuilt
- Cover letter updated (concept DOI `10.5281/zenodo.18463441`; companion math paper + JLC note)

After submission: optional Zenodo record note “Under review at *Learned Publishing*” (new version, not required day one)

---

## 8. Submission checklist — completed June 2, 2026

- [x] `count_prose_words.py` → main text ≤6,000 (5,930)
- [x] Key points ≤140 characters each
- [x] Rebuild `programming_framework.docx` and spot-check figures
- [x] Cover letter submitted in portal
- [x] Wiley Authors — Original Article
- [x] ORCID linked
- [x] Ethics / COI / funding / preprint / data statements
- [x] Reviewer PDF checked
- [x] Submitted via [submission.wiley.com](https://submission.wiley.com)

---

## 9. After submission

- [x] Submitted to editorial office (June 2, 2026)
- [ ] Save Wiley confirmation email; track status in **My dashboard**
- [ ] Optional: Zenodo new version — description note “Under review at *Learned Publishing*”
- Do not submit this manuscript elsewhere while under review
- Mathematics paper at JLC is a **separate** submission (disclosed in cover letter and data statement)
