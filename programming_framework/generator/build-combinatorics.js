#!/usr/bin/env node
/**
 * Build Combinatorics discourse JSON and Mermaid.
 * Counting principles, permutations, combinations, binomial theorem, pigeonhole.
 * Based on standard discrete math texts.
 */

const fs = require('fs');
const path = require('path');

const NODES = [
  { id: "DefFact", type: "definition", label: "Factorial: n! = n(n-1)...1, 0!=1", short: "Factorial", colorClass: "definition" },
  { id: "DefSum", type: "definition", label: "Sum principle: disjoint choices add (OR)", short: "Sum principle", colorClass: "definition" },
  { id: "DefProd", type: "definition", label: "Product principle: sequential choices multiply (AND)", short: "Product principle", colorClass: "definition" },
  { id: "PermNoRep", type: "theorem", label: "P(n,r) = n!/(n-r)! arrangements of r from n", short: "Permutations no rep", colorClass: "theorem" },
  { id: "PermRep", type: "theorem", label: "n^r arrangements of r from n with repetition", short: "Permutations with rep", colorClass: "theorem" },
  { id: "CombNoRep", type: "theorem", label: "C(n,r) = n!/(r!(n-r)!) = P(n,r)/r!", short: "Combinations", colorClass: "theorem" },
  { id: "CombRep", type: "theorem", label: "C(n+r-1,r) ways to choose r from n with rep", short: "Combinations with rep", colorClass: "theorem" },
  { id: "BinomThm", type: "theorem", label: "(a+b)^n = sum C(n,k) a^k b^(n-k)", short: "Binomial theorem", colorClass: "theorem" },
  { id: "Pascal", type: "theorem", label: "C(n,k) = C(n-1,k-1) + C(n-1,k)", short: "Pascal identity", colorClass: "theorem" },
  { id: "Pigeonhole", type: "theorem", label: "n+1 objects in n boxes implies one box has 2+", short: "Pigeonhole principle", colorClass: "theorem" },
  { id: "InclExcl", type: "theorem", label: "|A union B| = |A| + |B| - |A intersect B|", short: "Inclusion-exclusion", colorClass: "theorem" },
  { id: "InclExcl3", type: "theorem", label: "Inclusion-exclusion for 3 sets", short: "Incl-excl 3 sets", colorClass: "theorem" },
  { id: "Derange", type: "theorem", label: "D(n) = n! sum (-1)^k/k! derangements", short: "Derangements", colorClass: "theorem" },
  { id: "Stirling2", type: "theorem", label: "S(n,k) = partitions of n into k nonempty sets", short: "Stirling numbers", colorClass: "theorem" }
];

const DEPS = {
  PermNoRep: ["DefFact", "DefProd"],
  PermRep: ["DefProd"],
  CombNoRep: ["PermNoRep", "DefFact"],
  CombRep: ["CombNoRep"],
  BinomThm: ["CombNoRep"],
  Pascal: ["CombNoRep"],
  Pigeonhole: ["DefSum"],
  InclExcl: ["DefSum"],
  InclExcl3: ["InclExcl"],
  Derange: ["InclExcl", "PermNoRep"],
  Stirling2: ["DefSum", "DefProd"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "combinatorics",
    name: "Combinatorics",
    subject: "discrete_mathematics",
    variant: "classical",
    description: "Counting principles: sum and product rules, permutations (with/without repetition), combinations, binomial theorem, pigeonhole principle, inclusion-exclusion, derangements.",
    structure: { axioms: 0, definitions: 3, theorems: 11 }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Combinatorics Dependency Graph. Programming Framework.",
    keywords: ["combinatorics", "permutations", "combinations", "counting", "binomial theorem"]
  },
  sources: [
    { id: "dmoi", type: "primary", title: "Discrete Mathematics: An Open Introduction", url: "https://discrete.openmathbooks.org/dmoi4/sec_counting-combperm.html", notes: "Counting principles" },
    { id: "mathisfun", type: "digital", title: "Combinations and Permutations", url: "https://www.mathsisfun.com/combinatorics/combinations-permutations.html", notes: "Formulas" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    axiom: { fill: "#e74c3c", stroke: "#c0392b" },
    definition: { fill: "#3498db", stroke: "#2980b9" },
    theorem: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

for (const n of NODES) {
  discourse.nodes.push({
    id: n.id,
    type: n.type,
    label: n.label,
    shortLabel: n.id,
    short: n.short,
    colorClass: n.colorClass
  });
  for (const dep of DEPS[n.id] || []) {
    discourse.edges.push({ from: dep, to: n.id });
  }
}

const dataDir = path.join(__dirname, "..", "data");
const outPath = path.join(dataDir, "combinatorics.json");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote", outPath);

function sanitizeMermaidLabel(s) {
  return String(s)
    .replace(/→/g, "impl")
    .replace(/⊢/g, "|-")
    .replace(/∨/g, "or")
    .replace(/∧/g, "and")
    .replace(/↔/g, "iff")
    .replace(/\n/g, " ");
}

function toMermaid(filter) {
  const nodes = filter ? discourse.nodes.filter(filter) : discourse.nodes;
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = discourse.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  const lines = ["graph TD"];
  for (const n of nodes) {
    const desc = n.short || n.label;
    const raw = (n.shortLabel || n.id) + " " + (desc.length > 30 ? desc.slice(0, 27) + "..." : desc);
    const lbl = sanitizeMermaidLabel(raw).replace(/"/g, '\\"');
    lines.push(`    ${n.id}("${lbl}")`);
  }
  for (const e of edges) {
    lines.push(`    ${e.from} --> ${e.to}`);
  }
  lines.push("    classDef axiom fill:#e74c3c,color:#fff,stroke:#c0392b");
  lines.push("    classDef definition fill:#3498db,color:#fff,stroke:#2980b9");
  lines.push("    classDef theorem fill:#1abc9c,color:#fff,stroke:#16a085");
  const axiomIds = nodes.filter(n => n.type === "axiom").map(n => n.id).join(",");
  const defIds = nodes.filter(n => n.type === "definition").map(n => n.id).join(",");
  const thmIds = nodes.filter(n => n.type === "theorem").map(n => n.id).join(",");
  if (axiomIds) lines.push(`    class ${axiomIds} axiom`);
  if (defIds) lines.push(`    class ${defIds} definition`);
  if (thmIds) lines.push(`    class ${thmIds} theorem`);
  return lines.join("\n");
}

function closure(ids) {
  const needed = new Set(ids);
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of discourse.edges) {
      if (needed.has(e.to) && !needed.has(e.from)) { needed.add(e.from); changed = true; }
    }
  }
  return n => needed.has(n.id);
}

function toMermaidWithCounts(filter) {
  const nodes = filter ? discourse.nodes.filter(filter) : discourse.nodes;
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = discourse.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  return { mermaid: toMermaid(filter), nodes: nodes.length, edges: edges.length };
}

const sections = [
  { name: "principles-permutations", ids: ["DefFact", "DefSum", "DefProd", "PermNoRep", "PermRep", "CombNoRep"], title: "Principles and Permutations", desc: "Factorial, sum and product principles, permutations with and without repetition, combinations" },
  { name: "combinations-binomial", ids: ["CombRep", "BinomThm", "Pascal"], title: "Combinations and Binomial Theorem", desc: "Combinations with repetition, binomial theorem, Pascal identity" },
  { name: "advanced-counting", ids: ["Pigeonhole", "InclExcl", "InclExcl3", "Derange", "Stirling2"], title: "Pigeonhole and Inclusion-Exclusion", desc: "Pigeonhole principle, inclusion-exclusion, derangements, Stirling numbers" }
];

const subgraphData = [];
for (const s of sections) {
  const filter = closure(s.ids);
  const { mermaid: sub, nodes: n, edges: e } = toMermaidWithCounts(filter);
  subgraphData.push({ ...s, mermaid: sub, nodes: n, edges: e });
  fs.writeFileSync(path.join(dataDir, `combinatorics-${s.name}.mmd`), sub, "utf8");
  console.log("Wrote", path.join(dataDir, `combinatorics-${s.name}.mmd`));
}

fs.writeFileSync(path.join(dataDir, "combinatorics.mmd"), toMermaid(), "utf8");

const MATH_DB = process.env.MATH_DB || "/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database";
const GEO_DIR = path.join(MATH_DB, "processes", "geometry_topology");

function htmlTemplate(title, subtitle, mermaid, nodes, edges) {
  const mermaidEscaped = mermaid.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Mathematics Process</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1600px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; padding: 30px; }
        .header h1 { margin: 0 0 10px 0; font-size: 2em; font-weight: 300; }
        .header-meta { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; font-size: 0.9em; opacity: 0.9; }
        .meta-item { background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; }
        .nav-links { padding: 15px 30px; background: #f8f9fa; border-bottom: 1px solid #ecf0f1; }
        .nav-links a { color: #9b59b6; text-decoration: none; margin-right: 20px; font-weight: 500; }
        .nav-links a:hover { text-decoration: underline; }
        .content { padding: 30px; }
        .description { margin-bottom: 30px; }
        .flowchart-container { margin: 30px 0; }
        .flowchart-container h2 { color: #2c3e50; margin-bottom: 15px; }
        .mermaid { background: white; padding: 20px; border-radius: 10px; border: 1px solid #ecf0f1; overflow-x: hidden; overflow-y: auto; min-height: 500px; max-width: 100%; }
        .color-legend { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 30px 0; }
        .color-legend h3 { color: #2c3e50; margin-bottom: 15px; }
        .color-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .color-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: white; border-radius: 5px; }
        .color-box { width: 30px; height: 30px; border-radius: 4px; border: 1px solid #ddd; }
        .info-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 30px; }
        .info-card { background: #f8f9fa; padding: 20px; border-radius: 10px; }
        .info-card h3 { color: #2c3e50; margin-bottom: 15px; }
        .info-card ul { list-style: none; padding: 0; }
        .info-card li { padding: 8px 0; border-bottom: 1px solid #ecf0f1; }
        .info-card li:last-child { border-bottom: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <div class="header-meta">
                <span class="meta-item">Mathematics</span>
                <span class="meta-item">Geometry & Topology / Discrete</span>
                <span class="meta-item">Source: Standard discrete math texts</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="index-link" href="#">Combinatorics Index</a>
            <a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-combperm.html" target="_blank">Counting (Open Math)</a>
            <a href="https://huggingface.co/spaces/garywelz/programming_framework" target="_blank">Programming Framework</a>
        </div>
        <script>
            (function() {
                const hostname = window.location.hostname;
                const base = hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database'
                    : '../..';
                document.getElementById('back-link').href = base + '/mathematics-database-table.html';
                document.getElementById('index-link').href = base + '/processes/geometry_topology/geometry_topology-combinatorics.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-combperm.html" target="_blank">Discrete Mathematics: An Open Introduction</a>; standard combinatorics texts</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <p class="flowchart-note" style="font-size:0.9rem;color:#7f8c8d;margin-bottom:12px;"><strong>Note:</strong> Arrows mean &quot;depends on&quot; (tail to head).</p>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#e74c3c"></div><div><strong>Red</strong><br><small>Axioms</small></div></div>
                    <div class="color-item"><div class="color-box" style="background:#3498db"></div><div><strong>Blue</strong><br><small>Definitions</small></div></div>
                    <div class="color-item"><div class="color-box" style="background:#1abc9c"></div><div><strong>Teal</strong><br><small>Theorems</small></div></div>
                </div>
            </div>
            <div class="info-section">
                <div class="info-card">
                    <h3>Statistics</h3>
                    <ul>
                        <li><strong>Nodes:</strong> ${nodes}</li>
                        <li><strong>Edges:</strong> ${edges}</li>
                    </ul>
                </div>
                <div class="info-card">
                    <h3>Keywords</h3>
                    <ul>
                        <li>combinatorics</li><li>permutations</li><li>combinations</li><li>binomial theorem</li><li>counting</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default', flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'step', nodeSpacing: 25, rankSpacing: 90, padding: 20 }, themeVariables: { fontSize: '14px', fontFamily: 'Segoe UI, Arial, sans-serif' } });
    </script>
</body>
</html>`;
}

if (fs.existsSync(path.join(MATH_DB, "processes"))) {
  for (const d of subgraphData) {
    const html = htmlTemplate(
      `Combinatorics — ${d.title}`,
      d.desc + ". Shows how counting formulas depend on principles and prior results.",
      d.mermaid,
      d.nodes,
      d.edges
    );
    const fileName = "geometry_topology-combinatorics-" + d.name;
    fs.writeFileSync(path.join(GEO_DIR, fileName + ".html"), html, "utf8");
    console.log("Wrote", path.join(GEO_DIR, fileName + ".html"));
  }
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Combinatorics - Mathematics Process</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; padding: 30px; }
        h1 { color: #2c3e50; margin-bottom: 15px; }
        p { color: #555; margin-bottom: 25px; line-height: 1.6; }
        .nav-links { margin-bottom: 20px; }
        .nav-links a { color: #9b59b6; text-decoration: none; margin-right: 20px; font-weight: 500; }
        .nav-links a:hover { text-decoration: underline; }
        .sections { display: grid; gap: 15px; }
        .sections a { display: block; padding: 20px; background: #f8f9fa; border-radius: 10px; color: #2c3e50; text-decoration: none; font-weight: 500; border-left: 4px solid #9b59b6; }
        .sections a:hover { background: #ecf0f1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-combperm.html" target="_blank">Counting (Open Math)</a>
        </div>
        <script>
            (function() {
                const backLink = document.getElementById('back-link');
                backLink.href = window.location.hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html'
                    : '../../mathematics-database-table.html';
            })();
        </script>
        <h1>Combinatorics</h1>
        <p>Counting principles: sum and product rules, permutations, combinations, binomial theorem, pigeonhole principle, inclusion-exclusion, derangements. Split into three views.</p>
        <div class="sections">
            <a href="geometry_topology-combinatorics-principles-permutations.html">Chart 1 — Principles and Permutations</a>
            <a href="geometry_topology-combinatorics-combinations-binomial.html">Chart 2 — Combinations and Binomial Theorem</a>
            <a href="geometry_topology-combinatorics-advanced-counting.html">Chart 3 — Pigeonhole and Inclusion-Exclusion</a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEO_DIR, "geometry_topology-combinatorics.html"), indexHtml, "utf8");
  console.log("Wrote", path.join(GEO_DIR, "geometry_topology-combinatorics.html"));
} else {
  console.log("MATH_DB not found - skipping HTML generation.");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
