#!/usr/bin/env node
/**
 * Mermaid Subgraph Generator
 * Input: discourse JSON + optional filter (propMax for Euclid, or --full)
 * Output: Mermaid graph TD string
 *
 * Usage:
 *   node mermaid-from-json.js data/euclid-elements-book-i.json [propMax]
 *   node mermaid-from-json.js data/euclid-elements-book-i.json --full
 */

const fs = require('fs');
const path = require('path');

const jsonPath = process.argv[2];
const filterArg = process.argv[3];

if (!jsonPath) {
  console.error("Usage: node mermaid-from-json.js <discourse.json> [propMax|--full]");
  process.exit(1);
}

const discourse = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

function closure(propMax) {
  const needed = new Set();
  for (let i = 1; i <= propMax; i++) needed.add(`Prop${i}`);
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of discourse.edges) {
      if (needed.has(e.to) && !needed.has(e.from)) { needed.add(e.from); changed = true; }
    }
  }
  return n => n.type !== "proposition" || needed.has(n.id);
}

const filter = filterArg === "--full" || !filterArg
  ? () => true
  : closure(parseInt(filterArg, 10));

const nodes = discourse.nodes.filter(filter);
const nodeIds = new Set(nodes.map(n => n.id));
const edges = discourse.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));

const lines = ["graph TD"];
for (const n of nodes) {
  const desc = n.short || (n.label && n.label.length > 35 ? n.label.slice(0, 32) + "..." : n.label || n.id);
  const lbl = (n.shortLabel || n.id) + "\\n" + (desc || "");
  lines.push(`    ${n.id}["${String(lbl).replace(/"/g, '\\"')}"]`);
}
for (const e of edges) {
  lines.push(`    ${e.from} --> ${e.to}`);
}

const colorScheme = discourse.colorScheme || {};
const types = [...new Set(nodes.map(n => n.colorClass || n.type))];
for (const t of types) {
  const c = colorScheme[t] || { fill: "#1abc9c", stroke: "#16a085" };
  lines.push(`    classDef ${t} fill:${c.fill},color:#fff,stroke:${c.stroke}`);
}
for (const t of types) {
  const ids = nodes.filter(n => (n.colorClass || n.type) === t).map(n => n.id).join(",");
  if (ids) lines.push(`    class ${ids} ${t}`);
}

console.log(lines.join("\n"));
