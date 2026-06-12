#!/usr/bin/env python3
"""Post-process pandoc LaTeX: author affiliation block."""

from __future__ import annotations

import re
from pathlib import Path

TEX = Path(__file__).resolve().parent / "paper.tex"

AUTHOR = (
    r"Gary Welz \\[0.6em]"
    r"{\normalsize Researcher, New Media Lab, CUNY Graduate Center \\[0.35em]"
    r"Email: \texttt{gwelz@gc.cuny.edu} \\[0.35em]"
    r"ORCID: \url{https://orcid.org/0009-0005-7806-0892}}"
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
    TEX.write_text(patched, encoding="utf-8")
    print("Patched author affiliation in paper.tex")


if __name__ == "__main__":
    main()
