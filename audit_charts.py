#!/usr/bin/env python3
"""
Phase 0 audit for the source-grounded chart rebuild.

Scans the live process databases (chemistry, physics, computer science, biology)
and scores each chart for "genericness" so the rebuild can proceed worst-first.

Signals scored per chart:
  - shared topology: how many other charts share its flowchartStandard.topologySignature
  - banned template phrases in node labels / details / mermaid
  - source quality: number of sources, whether any has a DOI, whether sources look
    mismatched to the subcategory
  - curation flags: verified=false, curationStatus=source_grounded_draft

Outputs (default OUT_DIR = ./chart_audit/):
  - <discipline>_triage.csv   : one row per chart, ranked worst-first by genericness score
  - audit_summary.md          : per-discipline rollup + topology clusters

Usage:
  python3 audit_charts.py
  python3 audit_charts.py --root /home/gdubs/copernicus-web-public/huggingface-space --out chart_audit
"""
from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

DEFAULT_ROOT = Path("/home/gdubs/copernicus-web-public/huggingface-space")
DISCIPLINES = {
    "biology": "biology-processes-database",
    "chemistry": "chemistry-processes-database",
    "computer-science": "computer-science-processes-database",
    "physics": "physics-processes-database",
}

# Boilerplate that appeared in the template-derived rebuilds. Presence in node text
# is strong evidence the chart was not extracted from a real source.
BANNED_PHRASES = [
    "research question",
    "prediction/readout",
    "prediction / readout",
    "source-grounded check",
    "committed mechanistic step",
    "core biological components",
    "intermediate regulatory state",
    "recognition or activation step",
    "measured phenotype or product",
    "initiating condition",
    "feedback/checkpoint control",
    "feedback / checkpoint control",
    "analysis complete",
    "final result",
    "method selection",
    "calibration + qc",
    "instrument measurement",
    "signal processing",
    "reported concentration/result",
]
BANNED_RE = re.compile("|".join(re.escape(p) for p in BANNED_PHRASES), re.IGNORECASE)


def iter_chart_files(root: Path, db_dir: str):
    proc = root / db_dir / "processes"
    if not proc.is_dir():
        return
    for p in sorted(proc.rglob("*.json")):
        if p.name.endswith(".backup"):
            continue
        yield p


def load(p: Path) -> dict | None:
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return None


def chart_text(j: dict) -> str:
    parts = [j.get("mermaid", "")]
    for nd in j.get("nodeDetails", []) or []:
        parts.append(str(nd.get("label", "")))
        parts.append(str(nd.get("detail", "")))
    return "\n".join(parts)


def banned_hits(text: str) -> list[str]:
    return sorted({m.group(0).lower() for m in BANNED_RE.finditer(text)})


def source_quality(j: dict) -> tuple[int, bool]:
    srcs = j.get("sources", []) or []
    has_doi = any((s.get("doi") or "").strip() for s in srcs if isinstance(s, dict))
    return len(srcs), has_doi


def genericness_score(*, cluster_size: int, n_banned: int, n_sources: int,
                      has_doi: bool, verified: bool) -> int:
    score = 0
    # shared skeleton is the headline problem
    if cluster_size >= 2:
        score += 20 + 6 * (cluster_size - 1)
    score += 12 * n_banned
    if n_sources == 0:
        score += 15
    elif not has_doi:
        score += 5
    if not verified:
        score += 5
    return score


def audit_discipline(root: Path, name: str, db_dir: str) -> dict:
    rows = []
    sig_to_ids: dict[str, list[str]] = defaultdict(list)
    files = list(iter_chart_files(root, db_dir))

    parsed = []
    for f in files:
        j = load(f)
        if j is None:
            continue
        cid = j.get("id", f.stem)
        sig = (j.get("flowchartStandard", {}) or {}).get("topologySignature", "NONE")
        sig_to_ids[sig].append(cid)
        parsed.append((f, j, cid, sig))

    for f, j, cid, sig in parsed:
        cluster_size = len(sig_to_ids[sig])
        text = chart_text(j)
        hits = banned_hits(text)
        n_sources, has_doi = source_quality(j)
        verified = bool(j.get("verified"))
        score = genericness_score(
            cluster_size=cluster_size, n_banned=len(hits),
            n_sources=n_sources, has_doi=has_doi, verified=verified,
        )
        rows.append({
            "id": cid,
            "name": j.get("name", ""),
            "subcategory": j.get("subcategory", ""),
            "genericness_score": score,
            "topology_signature": sig,
            "topology_cluster_size": cluster_size,
            "banned_phrase_count": len(hits),
            "banned_phrases": "; ".join(hits),
            "n_sources": n_sources,
            "has_doi": has_doi,
            "verified": verified,
            "curation_status": (j.get("flowchartStandard", {}) or {}).get("curationStatus", ""),
            "graph_type": j.get("graphType", ""),
            "nodes": (j.get("graphMetrics", {}) or {}).get("nodes", ""),
            "path": str(f),
        })

    rows.sort(key=lambda r: (-r["genericness_score"], r["topology_signature"], r["id"]))
    sig_counts = Counter({s: len(ids) for s, ids in sig_to_ids.items()})
    return {"name": name, "rows": rows, "sig_counts": sig_counts, "sig_to_ids": sig_to_ids}


def write_csv(out_dir: Path, name: str, rows: list[dict]) -> Path:
    path = out_dir / f"{name}_triage.csv"
    if not rows:
        path.write_text("", encoding="utf-8")
        return path
    fields = list(rows[0].keys())
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    return path


def main() -> None:
    ap = argparse.ArgumentParser(description="Audit process-database charts for genericness")
    ap.add_argument("--root", type=Path, default=DEFAULT_ROOT)
    ap.add_argument("--out", type=Path, default=Path(__file__).resolve().parent / "chart_audit")
    args = ap.parse_args()

    args.out.mkdir(parents=True, exist_ok=True)
    summary_lines = ["# Chart Audit Summary", ""]
    summary_lines.append(f"Root: `{args.root}`\n")
    summary_lines.append("| Discipline | Charts | Distinct skeletons | Diversity | Charts w/ banned phrases | Charts w/o DOI | Verified |")
    summary_lines.append("|---|---|---|---|---|---|---|")

    grand = []
    details = []
    for name, db_dir in DISCIPLINES.items():
        res = audit_discipline(args.root, name, db_dir)
        rows = res["rows"]
        total = len(rows)
        if total == 0:
            continue
        distinct = len(res["sig_counts"])
        diversity = distinct / total
        n_banned = sum(1 for r in rows if r["banned_phrase_count"] > 0)
        n_nodoi = sum(1 for r in rows if not r["has_doi"])
        n_verified = sum(1 for r in rows if r["verified"])
        write_csv(args.out, name, rows)
        summary_lines.append(
            f"| {name} | {total} | {distinct} | {diversity:.2f} | {n_banned} | {n_nodoi} | {n_verified} |"
        )
        grand.append((name, total, distinct))

        details.append(f"\n## {name}\n")
        details.append("Largest shared skeletons (signature → chart count):\n")
        for sig, cnt in res["sig_counts"].most_common(5):
            if cnt < 2:
                continue
            ids = ", ".join(res["sig_to_ids"][sig][:6])
            more = "" if cnt <= 6 else f" … (+{cnt - 6})"
            details.append(f"- `{sig}` ×{cnt}: {ids}{more}")
        details.append("\nTop 10 worst-first (genericness score):\n")
        details.append("| Score | Chart | Subcat | Cluster | Banned | Sources |")
        details.append("|---|---|---|---|---|---|")
        for r in rows[:10]:
            details.append(
                f"| {r['genericness_score']} | {r['id']} | {r['subcategory']} | "
                f"{r['topology_cluster_size']} | {r['banned_phrase_count']} | {r['n_sources']} |"
            )

    summary_lines.append("")
    summary_lines.extend(details)
    (args.out / "audit_summary.md").write_text("\n".join(summary_lines) + "\n", encoding="utf-8")

    print("Audit complete. Outputs in", args.out)
    for name, total, distinct in grand:
        print(f"  {name}: {total} charts, {distinct} distinct skeletons -> {name}_triage.csv")
    print("  summary -> audit_summary.md")


if __name__ == "__main__":
    main()
