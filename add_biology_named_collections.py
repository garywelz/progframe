#!/usr/bin/env python3
"""
Add namedCollections (theme slugs) to biology metadata.json processes.
Run from progframe root after generate_biology_collections.py.
"""
import json
from pathlib import Path

METADATA = Path("/home/gdubs/copernicus-web-public/huggingface-space/biology-processes-database/metadata.json")

# process_id -> list of theme slugs (must match generate_biology_collections.py)
PROC_TO_THEMES = {}

def add(pid: str, themes: list):
    PROC_TO_THEMES[pid] = list(set(PROC_TO_THEMES.get(pid, []) + themes))

for slug, items in [
    ("metabolism", ["pathways-glycolysis", "pathways-krebs-cycle", "pathways-oxidative-phosphorylation", "pathways-calvin-cycle"]),
    ("signaling-cell-fate", ["pathways-mapk-signaling", "pathways-insulin-signaling", "pathways-apoptosis", "pathways-cell-cycle"]),
    ("gene-expression", ["mechanisms-central-dogma", "mechanisms-trp-operon", "mechanisms-riboswitch-regulation",
                         "mechanisms-feedback-inhibition", "mechanisms-dna-replication", "mechanisms-crispr-cas9"]),
    ("lab-protocols", ["assay_protocols-pcr", "assay_protocols-agarose-gel", "assay_protocols-western-blot",
                       "assay_protocols-elisa", "assay_protocols-bacterial-transformation", "assay_protocols-dna-extraction"]),
]:
    for pid in items:
        add(pid, [slug])


def main():
    data = json.loads(METADATA.read_text(encoding="utf-8"))
    updated = 0
    for proc in data.get("processes", []):
        pid = proc.get("id", "")
        if pid in PROC_TO_THEMES:
            proc["namedCollections"] = sorted(PROC_TO_THEMES[pid])
            updated += 1
    themes = 4
    data["collectionStats"] = {
        "themes": themes,
        "total": themes,
    }
    METADATA.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Updated {updated} processes with namedCollections; collectionStats.themes={themes}")


if __name__ == "__main__":
    main()
