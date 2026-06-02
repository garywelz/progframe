# LaTeX source — Mathematics paper (JLC submission)

Rebuild from the canonical Markdown source:

```bash
./build_latex.sh
```

**Outputs**
- `paper.tex` — pandoc-generated LaTeX (standalone article)
- `figures/fig1.pdf` … `fig8.pdf` — vector Mermaid diagrams
- `paper.pdf` — compiled submission PDF (~31 pp.)

**Source of truth:** `../algorithms-axiomatic-theories-proofs-revised.md`

**On acceptance:** Upload `paper.tex`, `header.tex`, and all files in `figures/` to OUP/JLC as the editable source bundle. Re-run `build_latex.sh` after any Markdown edits.

**Requirements:** `pandoc`, `pdflatex`, `mermaid-cli` (`mmdc`), Chromium (`PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`).
