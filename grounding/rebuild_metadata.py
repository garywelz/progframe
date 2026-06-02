#!/usr/bin/env python3
"""
Rebuild a discipline's metadata.json (the file the table page fetches) from the
per-process JSON files. The existing pipeline never regenerates this file, so we
own it here: top-level descriptive fields are preserved, while per-process
summaries and aggregate statistics are recomputed from the live JSON.

Usage:
  python3 rebuild_metadata.py biology
  python3 rebuild_metadata.py biology --root /home/gdubs/copernicus-web-public/huggingface-space
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

DEFAULT_ROOT = Path("/home/gdubs/copernicus-web-public/huggingface-space")
DB_DIR = {
    "biology": "biology-processes-database",
    "chemistry": "chemistry-processes-database",
    "computer-science": "computer-science-processes-database",
    "physics": "physics-processes-database",
}


def _gm(data: dict) -> dict:
    gm = data.get("graphMetrics") or {}
    cx = data.get("complexity") or {}
    lg = cx.get("logicGates") or {}
    return {
        "nodes": gm.get("nodes", cx.get("nodes", 0)),
        "edges": gm.get("edges", cx.get("edges", 0)),
        "conditionals": gm.get("conditionals", cx.get("conditionals", 0)),
        "orGates": gm.get("orGates", lg.get("orGates", 0)),
        "andGates": gm.get("andGates", lg.get("andGates", 0)),
        "notGates": gm.get("notGates", lg.get("notGates", 0)),
        "loops": gm.get("loops", cx.get("loops", 0)),
    }


def rebuild(discipline: str, root: Path) -> dict:
    base = root / DB_DIR[discipline]
    meta_path = base / "metadata.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}

    processes = []
    counts: dict[str, int] = {}
    totals = dict(totalNodes=0, totalEdges=0, totalConditionals=0,
                  totalOrGates=0, totalAndGates=0, totalNotGates=0, totalLoops=0)
    verified = 0

    for p in sorted((base / "processes").rglob("*.json")):
        if p.name.endswith(".backup"):
            continue
        d = json.loads(p.read_text(encoding="utf-8"))
        g = _gm(d)
        sub = d.get("subcategory", "")
        counts[sub] = counts.get(sub, 0) + 1
        verified += 1 if d.get("verified") else 0
        totals["totalNodes"] += g["nodes"]
        totals["totalEdges"] += g["edges"]
        totals["totalConditionals"] += g["conditionals"]
        totals["totalOrGates"] += g["orGates"]
        totals["totalAndGates"] += g["andGates"]
        totals["totalNotGates"] += g["notGates"]
        totals["totalLoops"] += g["loops"]
        entry = {
            "id": d.get("id", p.stem),
            "name": d.get("name", ""),
            "subcategory": sub,
            "subcategory_name": d.get("subcategory_name", ""),
            "complexity": (d.get("complexity") or {}).get("level", "medium"),
            "nodes": g["nodes"], "edges": g["edges"],
            "orGates": g["orGates"], "andGates": g["andGates"],
            "namedCollections": d.get("namedCollections", []),
            "conditionals": g["conditionals"], "notGates": g["notGates"],
            "loops": g["loops"], "totalGates": g["orGates"] + g["andGates"] + g["notGates"],
            "domainContext": d.get("domainContext", ""),
            "verified": bool(d.get("verified", False)),
            "curationStatus": (d.get("flowchartStandard") or {}).get("curationStatus", ""),
        }
        processes.append(entry)

    totals["totalGates"] = totals["totalOrGates"] + totals["totalAndGates"] + totals["totalNotGates"]
    meta.setdefault("category", discipline.replace("-", "_"))
    meta["totalProcesses"] = len(processes)
    meta["subcategories"] = len(counts)
    meta["statistics"] = totals
    meta["subcategoryCounts"] = counts
    meta["verifiedProcesses"] = verified
    meta["processes"] = processes
    meta["lastUpdated"] = __import__("datetime").date.today().isoformat()

    meta_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return {"discipline": discipline, "processes": len(processes), "verified": verified}


def main() -> int:
    ap = argparse.ArgumentParser(description="Rebuild metadata.json from per-process JSON")
    ap.add_argument("disciplines", nargs="*", default=list(DB_DIR))
    ap.add_argument("--root", type=Path, default=DEFAULT_ROOT)
    args = ap.parse_args()
    for d in args.disciplines:
        print(rebuild(d, args.root))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
