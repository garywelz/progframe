#!/usr/bin/env python3
"""Apply Oxford UK spellings to prose in current-draft.md only (not abstract, not fences)."""

from __future__ import annotations

import re
from pathlib import Path

PATH = Path(__file__).resolve().parent / "current-draft.md"


def main() -> None:
    lines = PATH.read_text(encoding="utf-8").splitlines()
    out: list[str] = []
    in_fence = False
    in_abstract = False
    for line in lines:
        s = line.strip()
        if s.startswith("```"):
            in_fence = not in_fence
            out.append(line)
            continue
        if s == "## Abstract":
            in_abstract = True
            out.append(line)
            continue
        if in_abstract and s.startswith("## ") and "Abstract" not in s:
            in_abstract = False
        if in_fence or in_abstract:
            out.append(line)
            continue
        if "fill:#" in line or re.search(r"#ff[0-9a-fA-F]{4}\b", line):
            out.append(line)
            continue
        if re.search(r'"color"\s*:', line) or re.search(r"'color'\s*:", line):
            out.append(line)
            continue

        new = line
        pairs = [
            ("visualization", "visualisation"),
            ("Visualization", "Visualisation"),
            ("visualize", "visualise"),
            ("Visualize", "Visualise"),
            ("organize", "organise"),
            ("Organize", "Organise"),
            ("organization", "organisation"),
            ("Organization", "Organisation"),
            ("organizational", "organisational"),
            ("Organizational", "Organisational"),
            ("recognize", "recognise"),
            ("Recognize", "Recognise"),
            ("analyze", "analyse"),
            ("Analyze", "Analyse"),
            ("behavior", "behaviour"),
            ("Behavior", "Behaviour"),
            ("behavioral", "behavioural"),
            ("Behavioral", "Behavioural"),
            ("customizable", "customisable"),
            ("Customizable", "Customisable"),
            ("customization", "customisation"),
            ("Customization", "Customisation"),
            ("modeling", "modelling"),
            ("Modeling", "Modelling"),
            ("standardization", "standardisation"),
            ("Standardization", "Standardisation"),
            ("standardize", "standardise"),
            ("Standardize", "Standardise"),
            ("specialized", "specialised"),
            ("Specialized", "Specialised"),
            ("specialization", "specialisation"),
            ("Specialization", "Specialisation"),
            ("optimize", "optimise"),
            ("Optimize", "Optimise"),
            ("optimization", "optimisation"),
            ("Optimization", "Optimisation"),
            ("formalize", "formalise"),
            ("Formalize", "Formalise"),
            ("emphasize", "emphasise"),
            ("Emphasize", "Emphasise"),
            ("generalize", "generalise"),
            ("Generalize", "Generalise"),
            ("utilization", "utilisation"),
            ("Utilization", "Utilisation"),
        ]
        for a, b in pairs:
            new = new.replace(a, b)

        def colour_word(match: re.Match[str]) -> str:
            word = match.group(0)
            if word == "color":
                return "colour"
            if word == "Color":
                return "Colour"
            if word == "colors":
                return "colours"
            return "Colours"

        new = re.sub(r"\b[Cc]olors?\b", colour_word, new)

        out.append(new)

    PATH.write_text("\n".join(out) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
