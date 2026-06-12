# LaTeX source — Mathematics paper (PLOS ONE submission)

Rebuild from the canonical Markdown source:

```bash
./build_latex.sh
```

**Outputs**
- `paper.tex` — pandoc-generated LaTeX (standalone article)
- `figures/fig1.pdf` … `fig8.pdf` — vector Mermaid diagrams
- `paper.pdf` — compiled submission PDF (~29 pp.)

**Source of truth:** `../proof-graphs-diagonalization-corpus.md`

**Pipeline:** `prepare_source.py` injects YAML abstract, swaps Mermaid blocks for `figures/figN.pdf`, and `patch_paper_tex.py` adds the author affiliation block. Re-run `build_latex.sh` after any Markdown edits.

**Figure styling:** `../zenodo_build/mermaid-config.json` and `mermaid-figures.css` (font size, contrast). Figures auto-regenerate when source or config is newer than `figures/fig8.pdf`.

**Regenerate figures manually:** `FORCE_FIGURES=1 ./build_latex.sh` (requires `mmdc` + Chromium). Optional: `MMDC_SCALE=4 MMDC_WIDTH=1600 ./build_latex.sh`.

**Requirements:** `pandoc`, `pdflatex`, `mermaid-cli` (`mmdc`), Chromium (`PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`).
