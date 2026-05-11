#!/usr/bin/env python3
"""Wiley main-text prose estimate for Learned Publishing.

Excludes:
- Fenced code blocks (``` ... ```)
- ## Abstract until the next ## heading (count abstract separately for the journal)
- ## References until the next ## heading (the reference list)
- Lines starting with **Figure N:** (caption lead-ins)

Prints two totals (confirm with the journal which one matches the word cap):
- **Main article:** narrative from Key Points through Acknowledgments (everything before ## Prior Work).
- **Including post-references:** also ## Prior Work and ## Appendix A (still no abstract, references list,
  fenced code, or **Figure caption lines).

Many limits apply to “main article” only; if so, use the first number.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


def strip_fenced_code(text: str) -> str:
    return re.sub(r"```[\s\S]*?```", " ", text)


def strip_section(text: str, start_heading: str, until_pattern: str) -> str:
    """Remove from start_heading line through line before first match of until_pattern."""
    lines = text.splitlines()
    out: list[str] = []
    skip = False
    start_re = re.compile(re.escape(start_heading) + r"\s*$")
    until_re = re.compile(until_pattern)
    for line in lines:
        if not skip and start_re.match(line.strip()):
            skip = True
            continue
        if skip:
            s = line.strip()
            if s.startswith("## ") and until_re.match(s):
                skip = False
                out.append(line)
            continue
        out.append(line)
    return "\n".join(out)


def strip_figure_caption_lines(text: str) -> str:
    lines = [ln for ln in text.splitlines() if not re.match(r"^\*\*Figure \d+:\*\*", ln.strip())]
    return "\n".join(lines)


def main() -> None:
    path = Path(__file__).resolve().parent / "current-draft.md"
    if len(sys.argv) > 1:
        path = Path(sys.argv[1])
    raw = path.read_text(encoding="utf-8")

    abstract = re.search(r"^## Abstract\s*\n+([\s\S]*?)(?=^## )", raw, re.MULTILINE)
    if abstract:
        ab_words = re.findall(
            r"[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*", abstract.group(1).strip()
        )
        print(f"Abstract (approximately): {len(ab_words)} words")

    t = strip_fenced_code(raw)
    t = strip_section(t, "## Abstract", r"^## ")
    t = strip_section(t, "## References", r"^## ")
    t = strip_figure_caption_lines(t)

    words = re.findall(r"[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*", t)
    main = t.split("## Prior Work and Related Artifacts", 1)[0].strip()
    words_main = re.findall(r"[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*", main)
    print(
        f"Main article prose (through Acknowledgments; no Prior Work/Appendix; "
        f"no fenced blocks, no abstract, no reference list, no **Figure lines): {len(words_main)} words"
    )
    print(
        f"With Prior Work + Appendix prose (same exclusions otherwise): {len(words)} words"
    )
    print(f"Source: {path}")


if __name__ == "__main__":
    main()
