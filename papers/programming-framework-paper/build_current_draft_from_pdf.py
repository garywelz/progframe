#!/usr/bin/env python3
"""Build current-draft.md from programming_framework.pdf + revision-note replacements."""
from __future__ import annotations

import re
import sys
from pathlib import Path

from pypdf import PdfReader

REPO = Path(__file__).resolve().parents[2]
VENV_PY = REPO / ".venv-pdf" / "bin" / "python3"


def pdf_path() -> Path:
    win = Path("/mnt/c/Users/garyw/Downloads/programming_framework.pdf")
    if win.is_file():
        return win
    p = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if p and p.is_file():
        return p
    raise SystemExit("Pass path to programming_framework.pdf or place file at Windows Downloads path")


def extract_clean_body(reader: PdfReader) -> str:
    chunks: list[str] = []
    for page in reader.pages:
        t = page.extract_text() or ""
        t = re.sub(r"-\n([a-z])", r"\1", t)
        lines = t.split("\n")
        while lines and lines[-1].strip().isdigit() and len(lines[-1].strip()) <= 3:
            lines.pop()
        chunks.append("\n".join(lines))
    return "\n\n".join(chunks)


MAJOR_NUM_TITLES: tuple[tuple[str, str], ...] = (
    ("1", "Introduction"),
    ("2", "Related Work"),
    ("3", "Methodology"),
    ("4", "Applications Across Disciplines"),
    ("5", "Results and Discussion"),
    ("6", "Future Directions"),
    ("7", "Conclusion"),
)


def lines_to_markdown(body: str) -> str:
    out: list[str] = []
    for line in body.split("\n"):
        s = line.rstrip()
        if not s:
            out.append("")
            continue
        if re.match(r"^\d+\.\d+\.\d+\s+\S", s):
            out.append("#### " + s.strip())
            continue
        msec = re.match(r"^(\d+\.\d+)\s+(.+)$", s)
        if msec:
            out.append("### " + msec.group(1) + " " + msec.group(2).strip())
            continue
        mj = re.match(r"^(\d+)\.\s+(.+)$", s)
        if mj:
            num, title = mj.group(1), mj.group(2).strip()
            if (num, title) in MAJOR_NUM_TITLES:
                out.append(f"## {num}. {title}")
                continue
        if re.match(r"^References\s*$", s):
            out.append("## References")
            continue
        if re.match(r"^Prior Work and Related Artifacts\s*$", s):
            out.append("## Prior Work and Related Artifacts")
            continue
        if re.match(r"^Appendix A:\s*", s):
            out.append("## " + s.strip())
            continue
        out.append(s)
    return "\n".join(out)


def fix_figure_double_labels(md: str) -> str:
    md = re.sub(
        r"\*\*Figure (\d+):\*\*\s*Figure \1:\s*",
        r"**Figure \1:** ",
        md,
    )
    md = re.sub(
        r"Figure (\d+): Figure \1:\s*",
        r"**Figure \1:** ",
        md,
    )
    md = re.sub(
        r"(?<!\*)\bFigure (\d+):\s+(?!\*\*)",
        r"**Figure \1:** ",
        md,
    )
    md = re.sub(r"(Structure)(\d+)(\s|$)", r"\1\3", md)
    md = re.sub(r"(System)(\d+)(\s|$)", r"\1\3", md)
    md = re.sub(r"(Reaction)(\d+)(\s|$)", r"\1\3", md)
    return md


def split_front_matter(body: str) -> tuple[str, str]:
    """Return (keywords_block including trailing newline, rest from '1. Introduction')."""
    m = re.search(
        r"^(Keywords:[\s\S]+?)(?=\n1\.\s+Introduction\s*$)",
        body,
        re.MULTILINE,
    )
    if not m:
        return "", body
    kw = m.group(1).strip() + "\n\n"
    rest = body[m.end() :].lstrip("\n")
    return kw, rest


def strip_pdf_title_block(body: str) -> str:
    body = re.sub(
        r"^The Programming Framework: A General Method for Process Analysis Using\s*\n"
        r"LLMs and Mermaid Visualization\s*\n"
        r"Gary Welz\s*\n[\s\S]*?(?=^Keywords:)",
        "",
        body,
        count=1,
        flags=re.MULTILINE,
    )
    return body


KRAMPIS_PARA = (
    "The GLMP flowcharts are currently undergoing domain expert review in "
    "collaboration with the Computational Genomics Laboratory at Hunter College, "
    "CUNY, providing an ongoing validation pathway for the biological process diagrams."
)

NEW_ABSTRACT = """## Abstract

Scientific and technical fields rely heavily on textual process descriptions that are difficult to compare, analyze, or reuse computationally. We introduce the Programming Framework, a methodology for transforming textual process descriptions into structured, computable diagrams using large language models (LLMs) and Mermaid diagram syntax. Node colors, shapes, and edge types serve as lightweight semantic markers, providing flexible visual encoding that can be adapted to domain-specific conventions. We demonstrate the feasibility and cross-domain transferability of the methodology through application across biology (100+ processes via the Genome Logic Modeling Project, currently undergoing domain expert review), chemistry (70+ processes), and mathematics — where the framework extends naturally from algorithmic flowcharts to axiomatic dependency graphs and proof graphs, enabling unified structural comparison across procedural and logical forms. Applications in physics and computer science further demonstrate domain-agnostic transferability. The methodology is designed to lower the barrier to process visualization for researchers, educators, and AI systems, enabling structured comparison and analysis across scientific disciplines without requiring specialized software or domain-specific diagramming expertise. The Programming Framework is proposed as reusable, open infrastructure — a starting point that others can adopt, extend, and critique — with all methodology, tools, and examples publicly available."""

NEW_AUTHOR = """**Gary Welz**

Independent Researcher  
Affiliate, New Media Lab, CUNY Graduate Center  
Creator, CopernicusAI Knowledge Engine  
Email: gwelz@gc.cuny.edu"""

FEASIBILITY_P = """We demonstrate the feasibility and cross-domain transferability of the Programming Framework through application across five scientific disciplines. The framework is proposed as infrastructure for further development, not as a validated system with formal accuracy metrics — those remain important directions for future work."""

MATH_43 = """### 4.3 Mathematical Processes

The framework has been applied to mathematics across three structural categories: algorithmic flowcharts (e.g., Sieve of Eratosthenes, Merge Sort, Dijkstra's Algorithm, Euclidean Algorithm), axiomatic dependency graphs (e.g., Euclid's Elements, Peano Arithmetic, ZFC Set Theory, Group Theory, Category Theory), and proof graphs — hybrid dependency graphs with node colors encoding proof roles including source, assumption, construction, assertion, inference, algorithm capsule, contradiction, and conclusion (e.g., Euclid Book I pilot proofs, Infinitely Many Primes, Pythagorean Theorem proof comparison, Cantor Diagonal proofs).

The full mathematics database, including interactive viewers for all three graph types, is available at: https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html

The proof graph representation uses a domain-specific eight-role color scheme (source, assumption, construction, assertion, inference, algorithm capsule, contradiction, conclusion) rather than the standard five-category system — an instance of the domain-specific customization the Programming Framework explicitly supports.

The Euclidean algorithm example below (adapted from the PDF) illustrates an algorithmic flowchart with inputs (Red), decision and intermediate states (Blue), operations (Green), and final output (Violet).

```mermaid
flowchart TD
A[Input: a, b] --> B{Is b = 0?}
B -->|Yes| C[GCD = a]
B -->|No| D[Calculate r = a mod b]
D --> E[Set a = b]
E --> F[Set b = r]
F --> B
C --> G[Return GCD]
style A fill:#ff6b6b,color:#fff
style B fill:#74c0fc,color:#fff
style C fill:#74c0fc,color:#fff
style D fill:#51cf66,color:#fff
style E fill:#51cf66,color:#fff
style F fill:#51cf66,color:#fff
style G fill:#b197fc,color:#fff
```

**Figure 4:** Euclidean Algorithm Process Flow. Integer GCD workflow using the five-category palette; more detailed variants (extended Euclidean, complexity annotations) can be generated with richer prompts.
"""

DB_DEV = """Discipline-specific process databases for biology, chemistry, physics, and computer science are under active development as part of the broader Programming Framework infrastructure, with the mathematics database already demonstrating the framework's extension from algorithmic flowcharts to axiomatic dependency graphs and proof graphs. These databases are intended as open, versioned corpora that others can query, extend, and contribute to.

"""

ACK = """## Acknowledgments

This work is part of the CopernicusAI Knowledge Engine project, which aims to create AI-powered tools for scientific research synthesis and knowledge discovery. The Programming Framework serves as a foundational methodological component enabling structured representation of processes across scientific disciplines. The author thanks the CUNY Graduate Center New Media Lab for institutional support.

"""


def ensure_github_mermaid_fences(md: str) -> str:
    """GitHub markdown preview only renders Mermaid inside fenced ```mermaid blocks.

    PDF extraction emits 'Mermaid Markdown Code:' (and similar) followed by a raw
    flowchart body. Wrap those bodies automatically so the generated current-draft.md
    preview works on github.com without manual editing.
    """
    # Diagram is followed by either (a) one or more newlines then a heading/figure line, or
    # (b) a blank paragraph then prose (PDF uses inconsistent newline counts around ### headings).
    end = r"(?=\n+(?:### |## |\*\*Figure )|\n\n(?:The |This |Availability:|Note on |Discipline-specific |Keywords:|\[\^[a-z]))"

    # Paper figures / appendix-style "Mermaid Markdown Code:" sections
    md = re.sub(
        rf"(Mermaid Markdown Code:\n+)(?!\s*```)(flowchart TD[\s\S]*?){end}",
        r"\1```mermaid\n\2\n```\n",
        md,
    )
    # Accessibility example in §3.2 (PDF line breaks may use one newline, not a blank line)
    md = re.sub(
        r"(Example Mermaid code using shape-based encoding:\n+)(?!\s*```)(flowchart TD[\s\S]*?)(?=\n+This shape-based)",
        r"\1```mermaid\n\2\n```\n",
        md,
    )
    # If PDF used graph TD instead of flowchart TD (future-proof)
    md = re.sub(
        rf"(Mermaid Markdown Code:\n+)(?!\s*```)(graph TD[\s\S]*?){end}",
        r"\1```mermaid\n\2\n```\n",
        md,
    )
    return md


def apply_revisions(md: str) -> str:
    md = md.replace(
        "Empirical: - Demonstrated application across biology (GLMP with 100+ processes), mathematics, physics,\n"
        "chemistry, and computer science - Working systems and live artifacts demonstrating cross-domain transfer-\n"
        "ability",
        "Empirical: - Feasibility demonstrations across biology (GLMP with 100+ processes), mathematics, physics,\n"
        "chemistry, and computer science - Working systems and live artifacts illustrating cross-domain transferability",
    )
    # If hyphenation differed:
    md = re.sub(
        r"Empirical:\s*-\s*Demonstrated application across biology.*?transferability",
        "Empirical: - Feasibility demonstrations across biology (GLMP with 100+ processes), mathematics, physics, chemistry, and computer science - Working systems and live artifacts illustrating cross-domain transferability",
        md,
        count=1,
        flags=re.DOTALL,
    )

    # Insert feasibility paragraph after ### 1.2 block — after first paragraph of 1.2 that ends with "optimization."
    ins_point = "enabling cross-disciplinary comparison\nand optimization."
    if ins_point in md and FEASIBILITY_P not in md:
        md = md.replace(ins_point, ins_point + "\n\n" + FEASIBILITY_P)

    outcomes_join = (
        "Outcomes: - A coherent collection of biological process diagrams with consistent style - A living "
        "demonstration of the Framework’s applicability in a complex scientific domain"
    )
    if outcomes_join in md and "Hunter College" not in md:
        md = md.replace(
            outcomes_join,
            "Outcomes: - A coherent collection of biological process diagrams with consistent style\n\n"
            + KRAMPIS_PARA
            + "\n\n- A living demonstration of the Framework’s applicability in a complex scientific domain",
        )

    # Replace PDF §4.3 with expanded revision text (preserve following §4.4)
    md = re.sub(
        r"### 4\.3 Mathematical Processes.*?(?=### 4\.4|## 4\.4)",
        MATH_43 + "\n",
        md,
        count=1,
        flags=re.DOTALL,
    )

    # 5.1 mathematics bullet
    md = re.sub(
        r"3\. Mathematics: 5\+ processes demonstrating proof methods, algorithms, and computational workflows",
        "3. Mathematics: algorithms, axiomatic systems, and proof graphs across multiple structural categories — see Section 4.3 and the live database",
        md,
    )

    # Section 6 opening
    if "## 6. Future Directions" in md and DB_DEV.strip() not in md:
        md = md.replace(
            "## 6. Future Directions\nSeveral directions extend",
            "## 6. Future Directions\n\n" + DB_DEV + "Several directions extend",
            1,
        )

    # Conclusion 7 - soften "successfully"
    md = re.sub(
        r"It has been successfully applied to",
        "It has been applied to",
        md,
    )
    md = re.sub(
        r"## 4\. Applications Across Disciplines\nThe Programming Framework has been successfully applied",
        "## 4. Applications Across Disciplines\nThe Programming Framework has been applied",
        md,
    )

    # References: remove [3][4] entries; replace [22] with Ouyang
    md = re.sub(
        r"\n\[3\] Lardinois,.*?(?=\n\[5\]|\n\[6\]|\Z)",
        "\n",
        md,
        count=1,
        flags=re.DOTALL,
    )
    md = re.sub(
        r"\n\[4\] Pot,.*?(?=\n\[5\]|\n\[6\]|\Z)",
        "\n",
        md,
        count=1,
        flags=re.DOTALL,
    )
    md = re.sub(
        r"\[22\] Schulman,.*?(?=\n\[23\]|\n\[24\]|\Z)",
        "[22] Ouyang, L., et al. (2022). Training language models to follow instructions with human feedback. "
        "*Advances in Neural Information Processing Systems*, *35*, 27730–27744.",
        md,
        count=1,
        flags=re.DOTALL,
    )

    # In-text Schulman -> Ouyang
    md = md.replace("(Schulman\net al., 2022)", "(Ouyang et al., 2022)")
    md = md.replace("(Schulman et al., 2022)", "(Ouyang et al., 2022)")

    # Author note -> strip from end, we'll add Ack before References
    md = re.sub(
        r"\nAuthor Note:.*?$",
        "",
        md,
        count=1,
        flags=re.DOTALL,
    )

    if "## References" in md and "## Acknowledgments" not in md:
        md = md.replace("## References", ACK + "## References", 1)

    if "## References" in md and "[^mermaid-press]:" not in md:
        md = md.replace(
            "## References",
            "[^mermaid-press]: Informal technology press (e.g., coverage of Mermaid Chart) may be cited in running text with URL only; the TechCrunch and Lifehacker bibliography entries from an earlier draft were removed in favor of peer-reviewed sources in the numbered list.\n\n## References",
            1,
        )

    md = re.sub(
        r"\n\*\*Figure 1:\*\* Basic Programming Framework Structure\n\n(?=C -->)",
        "\n",
        md,
        count=1,
    )
    md = re.sub(
        r"\n\*\*Figure 2:\*\* Beta-Galactosidase Regulation System\n\n(?=I -->)",
        "\n",
        md,
        count=1,
    )
    md = re.sub(
        r"\n\*\*Figure 3:\*\* Catalytic Hydrogenation Reaction\n\n(?=style B)",
        "\n",
        md,
        count=1,
    )
    md = re.sub(
        r"\(Blue\), and final products \(Violet\)\.\n\n\*\*Figure 4:\*\* Euclidean Algorithm\n\n",
        "(Blue), and final products (Violet).\n\n",
        md,
        count=1,
    )

    return md


def main() -> None:
    pdf = pdf_path()
    reader = PdfReader(str(pdf))
    body = extract_clean_body(reader)
    body = strip_pdf_title_block(body)
    keywords, rest = split_front_matter(body)
    md = lines_to_markdown(rest)
    md = fix_figure_double_labels(md)
    md = apply_revisions(md)
    md = ensure_github_mermaid_fences(md)
    header = (
        "# The Programming Framework: A General Method for Process Analysis Using LLMs and Mermaid Visualization\n\n"
        "> **Source:** Converted May 2026 from `programming_framework.pdf`. "
        "Readable from WSL as `/mnt/c/Users/garyw/Downloads/programming_framework.pdf` when the file is in Windows Downloads.\n\n"
        "Rebuild with: `progframe/.venv-pdf/bin/python3 papers/programming-framework-paper/build_current_draft_from_pdf.py`\n\n"
    )
    full = header + NEW_AUTHOR + "\n\n" + NEW_ABSTRACT + "\n\n" + keywords + md
    out = Path(__file__).with_name("current-draft.md")
    out.write_text(full, encoding="utf-8")
    print("Wrote", out, "chars", len(full))


if __name__ == "__main__":
    main()
