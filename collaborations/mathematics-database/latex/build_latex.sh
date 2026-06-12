#!/usr/bin/env bash
# Build LaTeX PDF from algorithms-axiomatic-theories-proofs-revised.md
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

SOURCE="$ROOT/../algorithms-axiomatic-theories-proofs-revised.md"
export PUPPETEER_EXECUTABLE_PATH="${PUPPETEER_EXECUTABLE_PATH:-/usr/bin/chromium-browser}"
PUPPETEER_JSON="$ROOT/../zenodo_build/puppeteer.json"

echo "==> Render Mermaid figures (PDF) if missing"
if [[ ! -f figures/fig8.pdf ]]; then
  cp "$SOURCE" paper.md
  mmdc -i paper.md -o paper-fig.md -e pdf -b white -p "$PUPPETEER_JSON" -s 2
  mkdir -p figures
  for f in paper-fig-*.pdf; do
    num="${f#paper-fig-}"
    num="${num%.pdf}"
    mv "$f" "figures/fig${num}.pdf"
  done
elif [[ "$SOURCE" -nt figures/fig8.pdf ]]; then
  echo "    Note: source newer than figures/ — existing fig1–fig8.pdf reused (set FORCE_FIGURES=1 to regenerate)"
fi
if [[ "${FORCE_FIGURES:-}" == "1" ]] && [[ -f figures/fig8.pdf ]]; then
  echo "==> FORCE_FIGURES=1 — regenerating Mermaid figures"
  cp "$SOURCE" paper.md
  mmdc -i paper.md -o paper-fig.md -e pdf -b white -p "$PUPPETEER_JSON" -s 2
  for f in paper-fig-*.pdf; do
    num="${f#paper-fig-}"
    num="${num%.pdf}"
    mv -f "$f" "figures/fig${num}.pdf"
  done
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
