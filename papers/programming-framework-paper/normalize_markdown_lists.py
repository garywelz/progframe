#!/usr/bin/env python3
"""
Normalize list-related Markdown in the Programming Framework draft for Pandoc.

- Joins spurious hard line breaks (PDF extract style) when a blank line sits between
  an unterminated line and a lowercase continuation.
- Converts leading U+2022 bullets to '- '.
- Converts en-dash pseudo-bullets (–) at line start to '- '.
- Indents block continuations under top-level ordered lists (lines between
  'N. ' markers at column 0) so wrapped text and sub-bullets stay in the list item.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

BULLET_CHAR = "\u2022"
EN_DASH = "\u2013"


def join_broken_prose(lines: list[str]) -> list[str]:
    out: list[str] = []
    i = 0
    while i < len(lines):
        cur = lines[i]
        if (
            i + 2 < len(lines)
            and lines[i + 1].strip() == ""
            and cur.strip()
            and lines[i + 2].strip()
        ):
            prev = cur.rstrip()
            nxt = lines[i + 2].strip()
            if prev and prev[-1] not in ".!?:\"'" and nxt and nxt[0].islower():
                out.append(prev + " " + nxt)
                i += 3
                continue
        out.append(cur)
        i += 1
    return out


def bullets_to_hyphen(lines: list[str]) -> list[str]:
    out: list[str] = []
    for line in lines:
        if line.startswith(BULLET_CHAR + " "):
            line = "- " + line[len(BULLET_CHAR) + 1 :]
        out.append(line)
    return out


def endash_bullets_to_hyphen(lines: list[str]) -> list[str]:
    out: list[str] = []
    for line in lines:
        stripped = line.lstrip(" \t")
        if stripped.startswith(EN_DASH + " "):
            pad = line[: len(line) - len(stripped)]
            line = pad + "- " + stripped[len(EN_DASH) + 1 :]
        out.append(line)
    return out


def _prev_nonempty_line(out: list[str], idx: int) -> str:
    for k in range(idx - 1, -1, -1):
        if out[k].strip():
            return out[k]
    return ""


def _sentence_ended(line: str) -> bool:
    t = line.rstrip()
    if not t:
        return False
    return t[-1] in ".!?"


def indent_ordered_list_continuations(lines: list[str]) -> list[str]:
    """Indent soft-wrapped rows that belong to a numbered item; stop before new headings or paragraphs."""
    out = list(lines)
    n = len(out)
    i = 0
    ol_marker = re.compile(r"^\d+\.\s")
    while i < n:
        line = out[i]
        if not ol_marker.match(line):
            i += 1
            continue
        j = i + 1
        saw_blank = False
        while j < n:
            L = out[j]
            if L.strip() == "":
                saw_blank = True
                j += 1
                continue
            lst = L.lstrip("\t ")
            if ol_marker.match(lst) and not (L.startswith("    ") or L.startswith("\t")):
                break
            if re.match(r"^#{1,6}\s", lst):
                break
            if lst.startswith("```"):
                break
            # Paragraph break: sentence ended and next margin line starts a new paragraph.
            prev = _prev_nonempty_line(out, j)
            if (
                not (L.startswith("    ") or L.startswith("\t"))
                and lst[0].isupper()
                and _sentence_ended(prev.rstrip())
            ):
                break
            # Blank line then margin prose (new paragraph starting the line after a list gap).
            if saw_blank and not (L.startswith("    ") or L.startswith("\t")) and lst[0].isupper():
                if not lst.startswith(("- ", "* ")) and not ol_marker.match(lst):
                    break

            saw_blank = False
            if not (L.startswith("    ") or L.startswith("\t")):
                out[j] = "    " + L.lstrip(" \t")
            j += 1
        i += 1
    return out


def main() -> None:
    path = Path(__file__).resolve().parent / "current-draft.md"
    if len(sys.argv) > 1:
        path = Path(sys.argv[1])
    text = path.read_text(encoding="utf-8")
    lines = text.split("\n")
    lines = join_broken_prose(lines)
    lines = bullets_to_hyphen(lines)
    lines = endash_bullets_to_hyphen(lines)
    lines = indent_ordered_list_continuations(lines)
    path.write_text("\n".join(lines) + ("\n" if text.endswith("\n") else ""), encoding="utf-8")
    print(f"Updated {path}", file=sys.stderr)


if __name__ == "__main__":
    main()
