#!/usr/bin/env bash
# Strip editor-only meta lines from current-draft.md, extract Mermaid → .mmd + HTML viewer,
# then Pandoc PDF/DOCX (diagrams remain fenced ```mermaid in the Markdown passed to Pandoc).
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

STRIPPED="_build_stripped.md"
WITH_IMAGES="_build_for_pandoc.md"
HTML_OUT="html-manuscript"

sed -e '3,6d' current-draft.md > "$STRIPPED"
python3 ensure_markdown_block_separation.py "$STRIPPED"
python3 build_manuscript_html.py "$STRIPPED" "$HTML_OUT" empirical_sequel_class3_vhl_hif.json
cp "$STRIPPED" "$WITH_IMAGES"

PANDOC_RES=".:$DIR"
PDF_FLAGS=(
  "$WITH_IMAGES" -o programming_framework.pdf --pdf-engine=pdflatex
  -f markdown-smart
  -H pandoc-latex-preamble.tex
  --resource-path="$PANDOC_RES"
  -V geometry:margin=1in
  --metadata title=""
)

pandoc "${PDF_FLAGS[@]}"
pandoc "$WITH_IMAGES" -o programming_framework.docx \
  -f markdown-smart \
  --toc --toc-depth=3 \
  --resource-path="$PANDOC_RES"

echo "Outputs: programming_framework.pdf programming_framework.docx"
echo "HTML + .mmd: ${HTML_OUT}/index.html and ${HTML_OUT}/diagrams/*.mmd"
