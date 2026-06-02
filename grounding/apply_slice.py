#!/usr/bin/env python3
"""
Apply a slice of source-grounded chart specs to the live per-process JSON.

A slice file is a JSON object: {"discipline": "...", "charts": [ <spec>, ... ]}.
Each spec must include an "id" that resolves to processes/<subcat>/<id>.json.

Usage:
  python3 apply_slice.py slices/biology_assay_protocols.json
  python3 apply_slice.py slices/biology_assay_protocols.json --dry-run
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import engine

DEFAULT_ROOT = Path("/home/gdubs/copernicus-web-public/huggingface-space")
DB_DIR = {
    "biology": "biology-processes-database",
    "chemistry": "chemistry-processes-database",
    "computer-science": "computer-science-processes-database",
    "physics": "physics-processes-database",
}


def find_target(processes_dir: Path, chart_id: str) -> Path | None:
    for p in processes_dir.rglob(f"{chart_id}.json"):
        if not p.name.endswith(".backup"):
            return p
    return None


def main() -> int:
    ap = argparse.ArgumentParser(description="Apply source-grounded chart specs")
    ap.add_argument("slice_file", type=Path)
    ap.add_argument("--root", type=Path, default=DEFAULT_ROOT)
    ap.add_argument("--dry-run", action="store_true", help="Validate only, do not write")
    ap.add_argument("--reviewer", default="")
    args = ap.parse_args()

    slice_data = json.loads(args.slice_file.read_text(encoding="utf-8"))
    discipline = slice_data["discipline"]
    processes_dir = args.root / DB_DIR[discipline] / "processes"

    ok, failed = 0, 0
    for spec in slice_data["charts"]:
        cid = spec["id"]
        target = find_target(processes_dir, cid)
        if target is None:
            print(f"[MISS] {cid}: no target JSON found")
            failed += 1
            continue
        try:
            if args.dry_run:
                others = engine.collect_signatures(processes_dir, exclude_id=cid)
                sig = engine.validate_spec(spec, other_signatures=others)
                edges = [(e["from"], e["to"], e.get("label", "")) for e in spec["edges"]]
                loops = engine.count_loops(spec["nodes"], edges)
                print(f"[OK*] {cid}: sig {sig}  nodes={len(spec['nodes'])} edges={len(edges)} loops={loops} (dry-run)")
            else:
                rep = engine.apply_spec(spec, target, processes_dir=processes_dir,
                                        reviewer=args.reviewer)
                print(f"[OK ] {rep['id']}: sig {rep['signature']}  "
                      f"nodes={rep['nodes']} edges={rep['edges']} loops={rep['loops']} "
                      f"conditionals={rep['conditionals']}")
            ok += 1
        except engine.SpecError as e:
            print(f"[FAIL] {cid}: {e}")
            failed += 1

    print(f"\n{ok} ok, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
