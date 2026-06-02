#!/usr/bin/env python3
"""Recompute topology-based logic-gate metrics for every chart JSON.

Definition (matches grounding/engine.compute_metrics):
  conditionals = number of decision nodes (diamond `{...}` in mermaid)
  OR gate      = a split  (node with out-degree >= 2)
  AND gate     = a join   (node with in-degree  >= 2)
  NOT gate     = 0 (no topological signal)

Edges and node shapes are parsed from the chart's `mermaid` field, which is the
visual source of truth, so the printed statistics agree with the diagram.
"""
import json
import re
import sys
from pathlib import Path

BASE = Path("/home/gdubs/copernicus-web-public/huggingface-space")
DISCIPLINE_DIRS = {
    "biology": "biology-processes-database/processes",
    "chemistry": "chemistry-processes-database/processes",
    "physics": "physics-processes-database/processes",
    "computer-science": "computer-science-processes-database/processes",
}

EDGE_RE = re.compile(r"(N\d+)\s*-->\s*(?:\|[^|]*\|\s*)?(N\d+)")
DECISION_RE = re.compile(r"(N\d+)\s*\{")


def gates_from_mermaid(mermaid: str):
    edges = EDGE_RE.findall(mermaid)
    out_deg, in_deg = {}, {}
    for s, t in edges:
        out_deg[s] = out_deg.get(s, 0) + 1
        in_deg[t] = in_deg.get(t, 0) + 1
    or_gates = sum(1 for d in out_deg.values() if d >= 2)
    and_gates = sum(1 for d in in_deg.values() if d >= 2)
    conditionals = len(set(DECISION_RE.findall(mermaid)))
    return conditionals, or_gates, and_gates, len(edges)


def main(write: bool):
    disciplines = sys.argv[2:] if len(sys.argv) > 2 else list(DISCIPLINE_DIRS)
    grand = 0
    changed = 0
    for disc in disciplines:
        proc_dir = BASE / DISCIPLINE_DIRS[disc]
        for path in sorted(proc_dir.rglob("*.json")):
            if path.name.endswith(".backup"):
                continue
            data = json.loads(path.read_text(encoding="utf-8"))
            mermaid = data.get("mermaid", "")
            if not mermaid:
                continue
            grand += 1
            cond, org, andg, _ = gates_from_mermaid(mermaid)
            total = org + andg
            comp = data.setdefault("complexity", {})
            lg = comp.get("logicGates") if isinstance(comp.get("logicGates"), dict) else {}
            gm = data.get("graphMetrics") if isinstance(data.get("graphMetrics"), dict) else {}
            before = (comp.get("conditionals"), lg.get("orGates"), lg.get("andGates"), lg.get("total"))
            after = (cond, org, andg, total)
            if before != after:
                changed += 1
            comp["conditionals"] = cond
            comp["logicGates"] = {"orGates": org, "andGates": andg, "notGates": 0, "total": total}
            if isinstance(gm, dict):
                gm["conditionals"] = cond
                gm["orGates"] = org
                gm["andGates"] = andg
                gm["notGates"] = 0
                data["graphMetrics"] = gm
            if write:
                path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"scanned {grand} charts, {changed} updated, write={write}")


if __name__ == "__main__":
    main(write="--write" in sys.argv)
