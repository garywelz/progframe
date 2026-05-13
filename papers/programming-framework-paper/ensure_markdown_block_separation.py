#!/usr/bin/env python3
"""
Ensure blank lines before ATX headings and before top-level ordered lists that
follow a ':' line — Pandoc's markdown merges these into paragraphs otherwise.
See https://github.com/jgm/pandoc/issues adjacent behavior (no blank ⇒ no block break).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

HEAD_ATX = re.compile(r"^([ \t]*)(#{2,6})(\s+|$)")
ORDERED_TOP = re.compile(r"^([ \t]*)([0-9]{1,2})\.\s")
# `**Heading:**` immediately before `1. ...` merges into one paragraph in Pandoc (closing `**` after the colon).
BOLD_TITLE_BEFORE_ENUM = re.compile(r"^\*\*.+:\*\*\s*$")


def indent_cols(ws: str) -> int:
    return len(ws.expandtabs(4))


def main() -> None:
    path = Path(__file__).resolve().parent / "current-draft.md"
    if len(sys.argv) > 1:
        path = Path(sys.argv[1])
    raw = path.read_text(encoding="utf-8")
    ends_nl = raw.endswith("\n")
    lines = raw.split("\n")

    out: list[str] = []
    fenced = False

    for i, line in enumerate(lines):
        if line.lstrip().startswith("```"):
            fenced = not fenced
            out.append(line)
            continue
        if fenced:
            out.append(line)
            continue

        mh = HEAD_ATX.match(line)
        if mh:
            if out and out[-1].strip():
                out.append("")
            out.append(line)
            continue

        if (
            i + 1 < len(lines)
            and BOLD_TITLE_BEFORE_ENUM.match(line.strip())
        ):
            nxt_m = ORDERED_TOP.match(lines[i + 1])
            if nxt_m and indent_cols(nxt_m.group(1)) < 4:
                out.append(line)
                out.append("")
                continue

        om = ORDERED_TOP.match(line)
        if om and indent_cols(om.group(1)) < 4:

            prev_nonempty = ""
            for j in range(len(out) - 1, -1, -1):
                if out[j].strip():
                    prev_nonempty = out[j].strip()
                    break
            prev_om = ORDERED_TOP.match(prev_nonempty) if prev_nonempty else None

            blank_before = prev_nonempty.endswith(":") and not prev_om

            if blank_before and out and out[-1].strip():
                out.append("")
            out.append(line)
            continue

        out.append(line)

    body = "\n".join(out)
    path.write_text(body + ("\n" if ends_nl else ""), encoding="utf-8")


if __name__ == "__main__":
    main()
