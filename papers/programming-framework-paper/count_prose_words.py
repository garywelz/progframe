#!/usr/bin/env python3
"""Wiley main-text prose estimate for Learned Publishing.

Excludes:
- Fenced code blocks (``` ... ```)
- ## Abstract through the next ## heading (abstract is counted separately by the journal)
- ## References through the next ## heading (reference list words)
- Lines starting with **Figure N:** (caption lead-ins)

Includes appendix and prior-work sections as body text — confirm against Wiley
if they should be excluded from the 3,000–6,000 word cap.
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

    t = strip_fenced_code(raw)
    t = strip_section(t, "## Abstract", r"^## ")
    t = strip_section(t, "## References", r"^## ")
    t = strip_figure_caption_lines(t)

    words = re.findall(r"[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*", t)
    print(f"Prose estimate (no fenced blocks, no abstract, no ## References block, no **Figure lines): {len(words)} words")
    print(f"Source: {path}")


if __name__ == "__main__":
    main()
