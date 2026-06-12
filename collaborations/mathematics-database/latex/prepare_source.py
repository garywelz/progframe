#!/usr/bin/env python3
"""Prepare markdown for pandoc LaTeX conversion (journal submission)."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / "proof-graphs-diagonalization-corpus.md"
FIG_MD = ROOT / "paper-fig.md"
OUT = ROOT / "paper-latex.md"



def replace_mermaid_with_figures(text: str) -> str:
    """Swap ```mermaid blocks for pre-rendered figures/figN.pdf (mmdc output)."""
    counter = 0

    def replacer(_match: re.Match[str]) -> str:
        nonlocal counter
        counter += 1
        return f"![Figure {counter}](figures/fig{counter}.pdf)"

    return re.sub(r"```mermaid\n.*?```", replacer, text, flags=re.DOTALL)


def main() -> None:
    if FIG_MD.exists():
        text = FIG_MD.read_text(encoding="utf-8")
        text = re.sub(
            r"!\[diagram\]\(\./paper-fig-(\d+)\.pdf\)",
            r"![Figure \1](figures/fig\1.pdf)",
            text,
        )
    else:
        text = SOURCE.read_text(encoding="utf-8")
        text = replace_mermaid_with_figures(text)

    lines = text.splitlines()
    out: list[str] = []
    skip_until_body = False
    in_abstract = False
    abstract_lines: list[str] = []
    keywords = ""

    for i, line in enumerate(lines):
        if line.startswith("# ") and i == 0:
            title = line[2:].strip()
            out.append("---")
            out.append(f'title: "{title}"')
            out.append('author: "Gary Welz"')
            out.append("documentclass: article")
            out.append("classoption: 11pt")
            out.append("geometry: margin=22mm")
            out.append("linestretch: 1.15")
            skip_until_body = True
            continue

        if skip_until_body:
            if line.strip() == "## Abstract":
                in_abstract = True
                continue
            if in_abstract:
                if line.strip().startswith("**Keywords:"):
                    keywords = line.split(":", 1)[1].strip().rstrip("*").strip()
                    if keywords.startswith("*"):
                        keywords = keywords[1:].strip()
                    continue
                if line.strip() == "---":
                    out.append("abstract: |")
                    for al in abstract_lines:
                        out.append(f"  {al}")
                    out.append(f'keywords: "{keywords}"')
                    out.append("---")
                    out.append("")
                    in_abstract = False
                    skip_until_body = False
                    continue
                if line.strip():
                    abstract_lines.append(line.strip())
            continue

        if line.startswith("**Status:**") or line.startswith("**Repository:**") or line.startswith("**Path:**"):
            continue
        if line.strip() == "**Gary Welz**":
            continue
        if "Researcher, New Media Lab" in line or line.startswith("Email:") or line.startswith("ORCID:"):
            continue
        if line.strip() == "## Abstract":
            continue
        if line.strip().startswith("**Keywords:"):
            continue

        out.append(line)

    OUT.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({len(out)} lines)")


if __name__ == "__main__":
    main()
