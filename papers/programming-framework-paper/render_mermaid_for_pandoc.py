#!/usr/bin/env python3
"""
Legacy: replace ```mermaid ... ``` blocks with PNG via @mermaid-js/mermaid-cli (mmdc).

The default manuscript build uses ``build_manuscript_html.py`` (browser-rendered Mermaid + ``.mmd``
extracts) instead of raster diagrams. Keep this script only if you explicitly want Pandoc PDFs with
embedded PNG figures and have Chromium + ``mmdc`` available.

Requires Chromium for Puppeteer. Set PUPPETE_EXECUTABLE_PATH if auto-detection fails.
"""
from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

# Canvas (width px, height px, puppeteer scale) — preset 1 (Figure 1) kept compact to avoid orphaned pages.
MERMAID_RENDER_PRESETS = [
    (980, 720, 1.85),
    (3600, 5200, 1.2),
    (2000, 3200, 2.0),
]
DEFAULT_PRESET = (1600, 2000, 1.75)

MERMAID_BLOCK = re.compile(
    r"(?:^[ \t]*Mermaid Markdown Code:\s*\n)?^[ \t]*```mermaid\s*\n(?P<body>.*?)^[ \t]*```",
    re.MULTILINE | re.DOTALL,
)


def find_chromium() -> str | None:
    env = (
        os.environ.get("PUPPETEER_EXECUTABLE_PATH")
        or os.environ.get("PUPPETE_EXECUTABLE_PATH")
        or os.environ.get("CHROMIUM_PATH")
    )
    if env and Path(env).is_file():
        return env
    for p in (
        "/snap/bin/chromium",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
    ):
        if Path(p).is_file():
            return p
    return shutil.which("chromium") or shutil.which("google-chrome-stable")


def render_one(
    mmdc: str,
    chromium: str,
    body: str,
    outfile: Path,
    width: int,
    height: int,
    scale: float,
) -> None:
    tmp = outfile.with_suffix(".mmd")
    tmp.write_text(body.strip() + "\n", encoding="utf-8")
    cmd = [
        mmdc,
        "-q",
        "-i",
        str(tmp),
        "-o",
        str(outfile),
        "-w",
        str(width),
        "-H",
        str(height),
        "-s",
        str(scale),
        "-b",
        "white",
    ]
    env = {**os.environ, "PUPPETEER_EXECUTABLE_PATH": chromium}
    subprocess.run(cmd, check=True, env=env, timeout=300)
    tmp.unlink(missing_ok=True)


def main() -> None:
    if len(sys.argv) != 3:
        sys.stderr.write("Usage: render_mermaid_for_pandoc.py INPUT.md OUTPUT.md\n")
        sys.exit(2)
    in_path = Path(sys.argv[1])
    out_path = Path(sys.argv[2])

    chromium = find_chromium()
    if not chromium:
        sys.stderr.write(
            "No Chromium/Chrome found. Install Chromium or set PUPPETEER_EXECUTABLE_PATH.\n"
        )
        sys.exit(1)

    mmdc_path = shutil.which("mmdc")
    if not mmdc_path:
        sys.stderr.write("mmdc (@mermaid-js/mermaid-cli) not on PATH.\n")
        sys.exit(1)

    md = in_path.read_text(encoding="utf-8")
    fig_dir = out_path.parent / ".pdf-build" / "mermaid-png"
    fig_dir.mkdir(parents=True, exist_ok=True)

    counter = {"i": 0}

    def repl(match: re.Match[str]) -> str:
        idx = counter["i"]
        counter["i"] += 1
        body = match.group("body")
        outfile = fig_dir / f"mermaid-{idx + 1:02d}.png"
        width, height, scale = (
            MERMAID_RENDER_PRESETS[idx]
            if idx < len(MERMAID_RENDER_PRESETS)
            else DEFAULT_PRESET
        )
        render_one(mmdc_path, chromium, body, outfile, width, height, scale)
        rel = os.path.relpath(outfile, start=out_path.parent).replace("\\", "/")
        w = "72%" if idx == 0 else "92%"
        return f"\n![]({rel}){{ width={w} }}\n\n"

    new_md = MERMAID_BLOCK.sub(repl, md)
    if counter["i"] == 0:
        sys.stderr.write("Warning: no ```mermaid blocks found; copy-through.\n")
    out_path.write_text(new_md, encoding="utf-8")
    print(
        f"Wrote {out_path} ({counter['i']} diagrams → {fig_dir.relative_to(out_path.parent)}/)",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
