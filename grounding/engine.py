#!/usr/bin/env python3
"""
Source-grounded chart engine.

Turns a compact, human-authored chart *spec* into the live process-JSON fields
(`mermaid`, `nodeDetails` with per-node provenance, `complexity`, `graphMetrics`,
`flowchartStandard`) and enforces anti-template guardrails so a chart cannot be
written unless its node content is specific and traceable to cited sources.

A spec (see slices/*.json) looks like:

{
  "id": "assay_protocols-pcr",
  "description": "...",
  "graphType": "algorithm_flowchart",
  "domainContext": "Molecular biology assay",
  "namedCollections": ["lab-protocols"],
  "sources": [ {title, authors, journal, year, doi|url, pubmed?}, ... ],
  "nodes": [ {"id":"N1","label":"...","role":"red","shape":"process",
              "detail":"...","sourceRef":0,"section":"..."} , ... ],
  "edges": [ {"from":"N1","to":"N2","label":""}, ... ]
}

Roles map to the 5-color scheme. Shapes: "process" | "decision".
"""
from __future__ import annotations

import hashlib
import json
import re
from datetime import date
from pathlib import Path
from typing import Any

COLOR_SCHEME = {
    "red": {"hex": "#ff6b6b", "category": "Triggers & Inputs"},
    "yellow": {"hex": "#ffd43b", "category": "Structures & Objects"},
    "green": {"hex": "#51cf66", "category": "Processing & Operations"},
    "blue": {"hex": "#74c0fc", "category": "Intermediates & States"},
    "violet": {"hex": "#b197fc", "category": "Products & Outputs"},
}
VALID_ROLES = set(COLOR_SCHEME)
VALID_SHAPES = {"process", "decision"}

# Boilerplate that marks a chart as template-derived rather than source-extracted.
BANNED_PHRASES = [
    "research question", "prediction/readout", "prediction / readout",
    "source-grounded check", "committed mechanistic step", "core biological components",
    "intermediate regulatory state", "recognition or activation step",
    "measured phenotype or product", "initiating condition", "feedback/checkpoint control",
    "feedback / checkpoint control", "analysis complete", "final result",
    "method selection", "calibration + qc", "instrument measurement",
    "reported concentration/result",
]
BANNED_RE = re.compile("|".join(re.escape(p) for p in BANNED_PHRASES), re.IGNORECASE)

EDGE_RE = re.compile(r"^\s*(\w+)\s*-->(?:\|([^|]*)\|)?\s*(\w+)\s*$")


class SpecError(ValueError):
    """Raised when a chart spec violates the grounding guardrails."""


def compact(label: str, limit: int = 34) -> str:
    label = label.strip()
    return label if len(label) <= limit else label[: limit - 1].rstrip() + "…"


def _signature_from_pairs(node_kinds: dict[str, str], edges: list[tuple[str, str, str]]) -> str:
    """role:shape topology signature, matching the live algorithm."""
    edge_parts = sorted(
        f"{node_kinds.get(s)}->{node_kinds.get(t)}:{lbl or ''}" for s, t, lbl in edges
    )
    payload = "|".join([str(len(node_kinds)), str(len(edges)), *edge_parts])
    return hashlib.sha1(payload.encode()).hexdigest()[:16]


def signature_from_spec(nodes: list[dict], edges: list[tuple[str, str, str]]) -> str:
    kinds = {n["id"]: f"{n['role']}:{n['shape']}" for n in nodes}
    return _signature_from_pairs(kinds, edges)


def signature_from_json(data: dict) -> str:
    """Recompute a comparable signature from an existing live chart JSON."""
    cat_to_role = {v["category"]: k for k, v in COLOR_SCHEME.items()}
    kinds: dict[str, str] = {}
    for nd in data.get("nodeDetails", []) or []:
        role = cat_to_role.get(nd.get("role", ""), "green")
        shape = "decision" if nd.get("type") == "decision" else "process"
        kinds[nd["id"]] = f"{role}:{shape}"
    edges = parse_edges(data.get("mermaid", ""))
    if not kinds:  # fall back: derive node ids from mermaid
        ids = {s for s, _, _ in edges} | {t for _, t, _ in edges}
        kinds = {i: "green:process" for i in ids}
    return _signature_from_pairs(kinds, edges)


def parse_edges(mermaid: str) -> list[tuple[str, str, str]]:
    edges: list[tuple[str, str, str]] = []
    for line in mermaid.splitlines():
        m = EDGE_RE.match(line)
        if m:
            src, lbl, tgt = m.group(1), (m.group(2) or "").strip(), m.group(3)
            edges.append((src, tgt, lbl))
    return edges


def build_mermaid(nodes: list[dict], edges: list[tuple[str, str, str]]) -> str:
    lines = ["graph TD"]
    for n in nodes:
        label = compact(n["label"])
        if n["shape"] == "decision":
            lines.append(f'    {n["id"]}{{"{label}"}}')
        else:
            lines.append(f'    {n["id"]}["{label}"]')
    lines.append("")
    for s, t, lbl in edges:
        lines.append(f"    {s} -->|{compact(lbl, 16)}| {t}" if lbl else f"    {s} --> {t}")
    lines.append("")
    for n in nodes:
        color = COLOR_SCHEME[n["role"]]["hex"]
        text = "#000" if n["role"] == "yellow" else "#fff"
        lines.append(f"    style {n['id']} fill:{color},color:{text}")
    return "\n".join(lines)


def build_node_details(nodes: list[dict]) -> list[dict]:
    out = []
    for n in nodes:
        entry = {
            "id": n["id"],
            "label": compact(n["label"]),
            "detail": n.get("detail", n["label"]),
            "type": "decision" if n["shape"] == "decision" else "process",
            "role": COLOR_SCHEME[n["role"]]["category"],
            "sourceRef": n["sourceRef"],
        }
        if n.get("section"):
            entry["section"] = n["section"]
        out.append(entry)
    return out


def compute_metrics(nodes: list[dict], edges: list[tuple[str, str, str]], loops: int) -> tuple[dict, dict]:
    conditionals = sum(1 for n in nodes if n["shape"] == "decision")
    # Topology-based logic gates so the statistics match what is drawn:
    #   OR gate  = a split  (a node whose flow diverges to >=2 successors)
    #   AND gate = a join   (a node where >=2 paths converge)
    out_degree: dict[str, int] = {}
    in_degree: dict[str, int] = {}
    for s, t, _lbl in edges:
        out_degree[s] = out_degree.get(s, 0) + 1
        in_degree[t] = in_degree.get(t, 0) + 1
    or_gates = sum(1 for d in out_degree.values() if d >= 2)
    and_gates = sum(1 for d in in_degree.values() if d >= 2)
    not_gates = 0
    complexity = {
        "nodes": len(nodes),
        "edges": len(edges),
        "conditionals": conditionals,
        "logicGates": {
            "orGates": or_gates, "andGates": and_gates,
            "notGates": not_gates, "total": or_gates + and_gates + not_gates,
        },
        "level": "high" if len(nodes) >= 10 else "medium",
        "detailLevel": "source_grounded",
        "loops": loops,
    }
    flat = {
        "nodes": len(nodes), "edges": len(edges), "conditionals": conditionals,
        "andGates": and_gates, "orGates": or_gates, "notGates": not_gates, "loops": loops,
    }
    return complexity, flat


def count_loops(nodes: list[dict], edges: list[tuple[str, str, str]]) -> int:
    """Count back-edges (target index < source index) as loops."""
    order = {n["id"]: i for i, n in enumerate(nodes)}
    return sum(1 for s, t, _ in edges if order.get(t, 0) < order.get(s, 0))


def validate_spec(spec: dict, *, other_signatures: dict[str, str] | None = None) -> str:
    """Validate a spec against the guardrails. Returns the topology signature."""
    errors: list[str] = []
    nodes = spec.get("nodes") or []
    edges_raw = spec.get("edges") or []
    sources = spec.get("sources") or []

    ids = [n.get("id") for n in nodes]
    if len(ids) != len(set(ids)):
        errors.append("duplicate node ids")
    idset = set(ids)

    for n in nodes:
        if n.get("role") not in VALID_ROLES:
            errors.append(f"{n.get('id')}: invalid role {n.get('role')!r}")
        if n.get("shape") not in VALID_SHAPES:
            errors.append(f"{n.get('id')}: invalid shape {n.get('shape')!r}")
        ref = n.get("sourceRef")
        if not isinstance(ref, int) or not (0 <= ref < len(sources)):
            errors.append(f"{n.get('id')}: sourceRef must index into sources (0..{len(sources)-1})")
        text = f"{n.get('label','')} {n.get('detail','')}"
        hit = BANNED_RE.search(text)
        if hit:
            errors.append(f"{n.get('id')}: banned template phrase {hit.group(0)!r}")
        # require some domain specificity: a label that is only generic stage words is suspect
        if len(re.sub(r"[^A-Za-z0-9]", "", n.get("label", ""))) < 3:
            errors.append(f"{n.get('id')}: label too short / non-specific")

    edges: list[tuple[str, str, str]] = []
    for e in edges_raw:
        s, t, lbl = e.get("from"), e.get("to"), e.get("label", "")
        if s not in idset or t not in idset:
            errors.append(f"edge {s}->{t} references unknown node")
        edges.append((s, t, lbl))

    if not sources:
        errors.append("no sources")
    for i, src in enumerate(sources):
        if not (src.get("doi") or src.get("url") or src.get("pubmed")):
            errors.append(f"source[{i}] has no doi/url/pubmed")

    sig = signature_from_spec(nodes, edges)
    if other_signatures and sig in other_signatures:
        errors.append(f"topology collides with existing chart {other_signatures[sig]} (sig {sig})")

    if errors:
        raise SpecError("; ".join(errors))
    return sig


def collect_signatures(processes_dir: Path, exclude_id: str | None = None) -> dict[str, str]:
    sigs: dict[str, str] = {}
    for p in processes_dir.rglob("*.json"):
        if p.name.endswith(".backup"):
            continue
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            continue
        if data.get("id") == exclude_id:
            continue
        sig = signature_from_json(data)
        sigs.setdefault(sig, data.get("id", p.stem))
    return sigs


def apply_spec(spec: dict, target_json: Path, *, processes_dir: Path,
               check_uniqueness: bool = True, extraction_model: str = "manual",
               reviewer: str = "") -> dict:
    """Validate the spec and write it into the live process JSON. Returns a report."""
    others = collect_signatures(processes_dir, exclude_id=spec["id"]) if check_uniqueness else {}
    sig = validate_spec(spec, other_signatures=others)

    nodes = spec["nodes"]
    edges = [(e["from"], e["to"], e.get("label", "")) for e in spec["edges"]]
    loops = count_loops(nodes, edges)
    complexity, flat = compute_metrics(nodes, edges, loops)

    data = json.loads(target_json.read_text(encoding="utf-8"))
    if spec.get("name"):
        data["name"] = spec["name"]
    data["description"] = spec.get("description", data.get("description", ""))
    if spec.get("graphType"):
        data["graphType"] = spec["graphType"]
    if spec.get("domainContext"):
        data["domainContext"] = spec["domainContext"]
    if spec.get("namedCollections") is not None:
        data["namedCollections"] = spec["namedCollections"]
    if spec.get("keywords"):
        data["keywords"] = spec["keywords"]
    data["sources"] = spec["sources"]
    data["colorScheme"] = COLOR_SCHEME
    data["mermaid"] = build_mermaid(nodes, edges)
    data["nodeDetails"] = build_node_details(nodes)
    data["complexity"] = complexity
    data["graphMetrics"] = flat
    data["lastUpdated"] = date.today().isoformat()
    data["verified"] = False
    data["flowchartStandard"] = {
        "name": "source_grounded_extraction_v2",
        "applied": date.today().isoformat(),
        "curationStatus": "source_grounded",
        "basis": spec.get("basis", "source_extraction"),
        "graphType": spec.get("graphType", "flowchart"),
        "topologySignature": sig,
        "extractionModel": extraction_model,
        "extractionDate": date.today().isoformat(),
        "reviewer": reviewer,
        "sourceGrounding": (
            "Nodes, decisions, branches, and loops were extracted from the cited "
            "sources; each node carries a sourceRef to its supporting citation. "
            "Awaiting human spot-check before verified=true."
        ),
    }
    data["notes"] = (
        "Source-grounded extraction (v2): node content derived from cited protocol "
        "literature with per-node provenance; topology reflects the actual procedure."
    )
    target_json.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return {
        "id": spec["id"], "signature": sig,
        "nodes": len(nodes), "edges": len(edges), "loops": loops,
        "conditionals": complexity["conditionals"],
    }
