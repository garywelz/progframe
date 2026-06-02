#!/usr/bin/env python3
"""Prepare markdown for pandoc LaTeX conversion (journal submission)."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / "algorithms-axiomatic-theories-proofs-revised.md"
FIG_MD = ROOT / "paper-fig.md"
OUT = ROOT / "paper-latex.md"


def main() -> None:
    if FIG_MD.exists():
        text = FIG_MD.read_text(encoding="utf-8")
    else:
        text = SOURCE.read_text(encoding="utf-8")

    # Point figure references at figures/figN.pdf
    text = re.sub(
        r"!\[diagram\]\(\./paper-fig-(\d+)\.pdf\)",
        r"![Figure \1](figures/fig\1.pdf)",
        text,
    )

    lines = text.splitlines()
    out: list[str] = []
    skip_until_abstract = False
    in_abstract = False
    abstract_lines: list[str] = []

    for i, line in enumerate(lines):
        if line.startswith("# ") and i == 0:
            title = line[2:].strip()
            out.append("---")
            out.append(f'title: "{title}"')
            out.append('author: "Gary Welz"')
            out.append(
                'institute: "Researcher, New Media Lab, CUNY Graduate Center\\\\'
                'Email: gwelz@gc.cuny.edu\\\\'
                'ORCID: https://orcid.org/0009-0005-7806-0892"'
            )
            out.append("documentclass: article")
            out.append("classoption: 11pt")
            out.append("geometry: margin=22mm")
            out.append("linestretch: 1.15")
            skip_until_abstract = True
            continue

        if skip_until_abstract:
            if line.strip() == "## Abstract":
                in_abstract = True
                continue
            if in_abstract:
                if line.strip().startswith("**Keywords:"):
                    kw = line.split(":", 1)[1].strip().rstrip("*").strip()
                    if kw.startswith("*"):
                        kw = kw[1:]
                    out.append(f'keywords: "{kw}"')
                    out.append("---")
                    out.append("")
                    continue
                if line.strip() == "---":
                    if abstract_lines:
                        out.append("abstract: |")
                        for al in abstract_lines:
                            out.append(f"  {al}")
                    in_abstract = False
                    skip_until_abstract = False
                    continue
                if line.strip():
                    abstract_lines.append(line.strip())
            continue

        # Drop internal repo metadata lines if present in fig md
        if line.startswith("**Status:**") or line.startswith("**Repository:**") or line.startswith("**Path:**"):
            continue
        if line.strip() == "**Gary Welz**":
            continue
        if "Researcher, New Media Lab" in line or line.startswith("Email:") or line.startswith("ORCID:"):
            continue

        # Promote Abstract section to body start at Introduction
        if line.strip() == "## Abstract":
            continue
        if line.strip().startswith("**Keywords:"):
            continue

        out.append(line)

    OUT.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({len(out)} lines)")


if __name__ == "__main__":
    main()
