# LaTeX source — Mathematics paper (PLOS ONE submission)

Rebuild from the canonical Markdown source:

```bash
./build_latex.sh
```

**Outputs**
- `paper.tex` — pandoc-generated LaTeX (standalone article)
- `figures/fig1.pdf` … `fig8.pdf` — vector Mermaid diagrams
- `paper.pdf` — compiled submission PDF (~29 pp.)

**Source of truth:** `../algorithms-axiomatic-theories-proofs-revised.md`

**Pipeline:** `prepare_source.py` injects YAML abstract, swaps Mermaid blocks for `figures/figN.pdf`, and `patch_paper_tex.py` adds the author affiliation block. Re-run `build_latex.sh` after any Markdown edits.

**Regenerate figures** (if Mermaid diagrams change): `FORCE_FIGURES=1 ./build_latex.sh` (requires `mmdc` + Chromium).

**Requirements:** `pandoc`, `pdflatex`, `mermaid-cli` (`mmdc`), Chromium (`PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`).
