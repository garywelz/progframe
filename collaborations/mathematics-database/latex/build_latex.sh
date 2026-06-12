#!/usr/bin/env bash
# Build LaTeX PDF from algorithms-axiomatic-theories-proofs-revised.md
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

SOURCE="$ROOT/../algorithms-axiomatic-theories-proofs-revised.md"
ZENODO="$ROOT/../zenodo_build"
export PUPPETEER_EXECUTABLE_PATH="${PUPPETEER_EXECUTABLE_PATH:-/usr/bin/chromium-browser}"
PUPPETEER_JSON="$ZENODO/puppeteer.json"
MERMAID_CONFIG="$ZENODO/mermaid-config.json"
MERMAID_CSS="$ZENODO/mermaid-figures.css"
MMDC_SCALE="${MMDC_SCALE:-3}"
MMDC_WIDTH="${MMDC_WIDTH:-1400}"

needs_figures() {
  [[ ! -f figures/fig8.pdf ]] && return 0
  [[ "$SOURCE" -nt figures/fig8.pdf ]] && return 0
  [[ "$MERMAID_CONFIG" -nt figures/fig8.pdf ]] && return 0
  [[ "$MERMAID_CSS" -nt figures/fig8.pdf ]] && return 0
  [[ "${FORCE_FIGURES:-}" == "1" ]] && return 0
  return 1
}

render_figures() {
  echo "==> Render Mermaid figures (scale=${MMDC_SCALE}, width=${MMDC_WIDTH})"
  cp "$SOURCE" paper.md
  mmdc -i paper.md -o paper-fig.md -e pdf -b white \
    -p "$PUPPETEER_JSON" \
    -c "$MERMAID_CONFIG" \
    -C "$MERMAID_CSS" \
    -s "$MMDC_SCALE" \
    -w "$MMDC_WIDTH" \
    -f
  mkdir -p figures
  for f in paper-fig-*.pdf; do
    num="${f#paper-fig-}"
    num="${num%.pdf}"
    mv -f "$f" "figures/fig${num}.pdf"
  done
}

if needs_figures; then
  render_figures
else
  echo "==> Figures up to date (set FORCE_FIGURES=1 to regenerate)"
fi

echo "==> Prepare pandoc source"
python3 prepare_source.py

echo "==> Pandoc -> LaTeX"
pandoc paper-latex.md \
  -f gfm+yaml_metadata_block \
  -t latex \
  --standalone \
  --pdf-engine=pdflatex \
  --include-in-header=header.tex \
  -V lang=en-GB \
  -o paper.tex

echo "==> Patch author affiliation"
python3 patch_paper_tex.py

echo "==> Compile (pdflatex x2)"
pdflatex -interaction=nonstopmode paper.tex >/dev/null
pdflatex -interaction=nonstopmode paper.tex >/dev/null

echo "==> Done: $ROOT/paper.pdf"
ls -la paper.pdf
