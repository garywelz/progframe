#!/usr/bin/env python3
"""Post-process pandoc LaTeX: author affiliation block."""

from __future__ import annotations

import re
from pathlib import Path

TEX = Path(__file__).resolve().parent / "paper.tex"

# \maketitle sets the author inside a tabular, so a brace group cannot span
# a \\ row break; each line gets its own \normalsize group.
AUTHOR = (
    r"Gary Welz \\[0.6em]"
    r"{\normalsize Researcher, New Media Lab, CUNY Graduate Center} \\[0.35em]"
    r"{\normalsize Email: \texttt{gwelz@gc.cuny.edu}} \\[0.35em]"
    r"{\normalsize ORCID: \url{https://orcid.org/0009-0005-7806-0892}}"
)


# Comparison chart pairs set side by side: (informal vs Lean-schematic in
# section 4.1, merge vs chain topology in section 4.3). Each pair is a bold
# label paragraph followed by an includegraphics, twice in a row.
SIDE_BY_SIDE_PAIRS = [(3, 4), (6, 7)]

MINIPAGE = (
    "\\noindent\\begin{{minipage}}[t]{{0.48\\linewidth}}\n"
    "\\centering\n"
    "\\textbf{{{label}}}\\\\[0.6em]\n"
    "\\includegraphics[width=\\linewidth,height=0.78\\textheight,keepaspectratio]"
    "{{figures/fig{num}.pdf}}\n"
    "\\end{{minipage}}"
)


def pair_side_by_side(text: str, left: int, right: int) -> str:
    pattern = (
        r"\\textbf\{(?P<l1>[^\n]*?)\}\n\n"
        r"\\includegraphics\{figures/fig" + str(left) + r"\.pdf\}\n\n"
        r"\\textbf\{(?P<l2>[^\n]*?)\}\n\n"
        r"\\includegraphics\{figures/fig" + str(right) + r"\.pdf\}"
    )

    def replacer(m: re.Match[str]) -> str:
        return (
            MINIPAGE.format(label=m.group("l1"), num=left)
            + "\\hfill\n"
            + MINIPAGE.format(label=m.group("l2"), num=right)
        )

    patched, n = re.subn(pattern, replacer, text, count=1)
    if n != 1:
        raise SystemExit(
            f"patch_paper_tex: could not pair fig{left}/fig{right} side by side"
        )
    return patched


# Pandoc emits gfm pipe tables with natural-width `l` columns, which overflow
# the text block when cells are long. Wrap three-column tables in fixed-width
# raggedright columns instead.
THREE_COL_SPEC = (
    "{@{}"
    ">{\\raggedright\\arraybackslash}p{0.16\\linewidth}"
    ">{\\raggedright\\arraybackslash}p{0.38\\linewidth}"
    ">{\\raggedright\\arraybackslash}p{0.36\\linewidth}"
    "@{}}"
)


def wrap_three_col_tables(text: str) -> str:
    return text.replace(
        "\\begin{longtable}[]{@{}lll@{}}",
        "\\begin{longtable}[]" + THREE_COL_SPEC,
    )


def main() -> None:
    text = TEX.read_text(encoding="utf-8")
    def replace_author(_match: re.Match[str]) -> str:
        return f"\\author{{{AUTHOR}}}"

    patched, n = re.subn(
        r"\\author\{.*?\}",
        replace_author,
        text,
        count=1,
        flags=re.DOTALL,
    )
    if n != 1:
        raise SystemExit(f"patch_paper_tex: expected 1 \\author{{}} match, got {n}")
    for left, right in SIDE_BY_SIDE_PAIRS:
        patched = pair_side_by_side(patched, left, right)
    patched = wrap_three_col_tables(patched)
    TEX.write_text(patched, encoding="utf-8")
    print("Patched author, side-by-side figure pairs, and table widths in paper.tex")


if __name__ == "__main__":
    main()
