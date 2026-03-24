#!/usr/bin/env node
/**
 * Build Peano Arithmetic discourse JSON and Mermaid.
 * Based on Landau, Foundations of Analysis (1930) and standard Peano development.
 * Structure: 5 axioms → definitions (addition, multiplication) → theorems.
 */

const fs = require('fs');
const path = require('path');

const NODES = [
  { id: "A1", type: "axiom", label: "0 is a natural number", short: "0 ∈ N", colorClass: "axiom" },
  { id: "A2", type: "axiom", label: "No predecessor of 0: S(x) ≠ 0", short: "0 not a successor", colorClass: "axiom" },
  { id: "A3", type: "axiom", label: "Successor injective: S(x)=S(y) ⇒ x=y", short: "S injective", colorClass: "axiom" },
  { id: "A4", type: "axiom", label: "Closure: S(x) ∈ N for all x ∈ N", short: "N closed under S", colorClass: "axiom" },
  { id: "A5", type: "axiom", label: "Induction: if 0∈K and (x∈K⇒S(x)∈K) then K=N", short: "Induction", colorClass: "axiom" },
  { id: "T1", type: "theorem", label: "x≠y ⇒ S(x)≠S(y)", short: "Contrapositive of A3", colorClass: "theorem" },
  { id: "T2", type: "theorem", label: "S(x)≠x for all x", short: "Successor ≠ identity", colorClass: "theorem" },
  { id: "T3", type: "theorem", label: "If x≠0 then x=S(u) for some u", short: "Every nonzero is successor", colorClass: "theorem" },
  { id: "DefAdd", type: "definition", label: "Addition: x+0=x, x+S(y)=S(x+y)", short: "Definition of +", colorClass: "definition" },
  { id: "T4", type: "theorem", label: "Addition is well-defined for all x,y", short: "Add well-defined", colorClass: "theorem" },
  { id: "T5", type: "theorem", label: "(x+y)+z = x+(y+z)", short: "Associativity of +", colorClass: "theorem" },
  { id: "T6", type: "theorem", label: "0+x = x", short: "Left identity", colorClass: "theorem" },
  { id: "T7", type: "theorem", label: "S(x)+y = S(x+y)", short: "Successor and add", colorClass: "theorem" },
  { id: "T8", type: "theorem", label: "x+y = y+x", short: "Commutativity of +", colorClass: "theorem" },
  { id: "T9", type: "theorem", label: "x+y=x+z ⇒ y=z", short: "Cancellation for +", colorClass: "theorem" },
  { id: "DefMul", type: "definition", label: "Multiplication: x·0=0, x·S(y)=x·y+x", short: "Definition of ·", colorClass: "definition" },
  { id: "T10", type: "theorem", label: "Multiplication is well-defined for all x,y", short: "Mul well-defined", colorClass: "theorem" },
  { id: "T11", type: "theorem", label: "x·0 = 0", short: "Zero times", colorClass: "theorem" },
  { id: "T12", type: "theorem", label: "0·x = 0", short: "Zero from left", colorClass: "theorem" },
  { id: "T13", type: "theorem", label: "S(x)·y = x·y + y", short: "Successor and mul", colorClass: "theorem" },
  { id: "T14", type: "theorem", label: "x·y = y·x", short: "Commutativity of ·", colorClass: "theorem" },
  { id: "T15", type: "theorem", label: "(x·y)·z = x·(y·z)", short: "Associativity of ·", colorClass: "theorem" },
  { id: "T16", type: "theorem", label: "x·(y+z) = x·y + x·z", short: "Distributivity", colorClass: "theorem" },
  { id: "T17", type: "theorem", label: "(x+y)·z = x·z + y·z", short: "Distributivity (right)", colorClass: "theorem" },
  { id: "T18", type: "theorem", label: "x≤y iff ∃z x+z=y", short: "Order definition", colorClass: "theorem" },
  { id: "T19", type: "theorem", label: "Trichotomy: exactly one of x<y, x=y, y<x", short: "Trichotomy", colorClass: "theorem" },
  { id: "T20", type: "theorem", label: "x≤y ⇒ x+z≤y+z", short: "Order + add", colorClass: "theorem" },
  { id: "T21", type: "theorem", label: "x≤y and z>0 ⇒ x·z≤y·z", short: "Order + mul", colorClass: "theorem" },
  { id: "T22", type: "theorem", label: "1·x = x (where 1=S(0))", short: "Multiplicative identity", colorClass: "theorem" },
  { id: "T23", type: "theorem", label: "x·1 = x", short: "Right identity", colorClass: "theorem" },
  { id: "T24", type: "theorem", label: "Well-ordering: every nonempty subset has least element", short: "Well-ordering", colorClass: "theorem" },
  { id: "T25", type: "theorem", label: "Strong induction principle", short: "Strong induction", colorClass: "theorem" }
];

// Dependencies (from → to). Based on Landau's development.
const DEPS = {
  T1: ["A3"],
  T2: ["A1", "A2", "A3", "T1", "A5"],
  T3: ["A5"],
  DefAdd: ["A5"],
  T4: ["DefAdd", "A5"],
  T5: ["DefAdd", "A5"],
  T6: ["DefAdd", "A5"],
  T7: ["DefAdd", "T6", "A5"],
  T8: ["DefAdd", "T5", "T6", "T7", "A5"],
  T9: ["DefAdd", "T8", "A5"],
  DefMul: ["DefAdd", "A5"],
  T10: ["DefMul", "A5"],
  T11: ["DefMul"],
  T12: ["DefMul", "T6", "A5"],
  T13: ["DefMul", "T8", "A5"],
  T14: ["DefMul", "T12", "T13", "A5"],
  T15: ["DefMul", "T5", "T8", "A5"],
  T16: ["DefMul", "T5", "T8", "T15", "A5"],
  T17: ["T16", "T8"],
  T18: ["DefAdd", "T8", "T9"],
  T19: ["T18", "T9"],
  T20: ["T18", "T8"],
  T21: ["T18", "T16", "T14"],
  T22: ["DefMul", "T6", "A5"],
  T23: ["T14", "T22"],
  T24: ["T18", "T19", "A5"],
  T25: ["T18", "T24", "A5"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "peano-arithmetic",
    name: "Peano Arithmetic",
    subject: "arithmetic",
    variant: "classical",
    description: "Axiomatic development of natural number arithmetic. Five axioms, definitions of addition and multiplication, and key theorems (associativity, commutativity, distributivity, order). Based on Landau, Foundations of Analysis.",
    structure: { axioms: 5, definitions: 2, theorems: 25 }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Peano Arithmetic Dependency Graph. Programming Framework.",
    keywords: ["Peano", "arithmetic", "natural numbers", "induction", "foundations"]
  },
  sources: [
    { id: "landau", type: "primary", authors: "Landau, E.", title: "Foundations of Analysis", year: "1930", publisher: "Chelsea", edition: "1951", notes: "Canonical development" },
    { id: "wikipedia", type: "digital", title: "Peano axioms", url: "https://en.wikipedia.org/wiki/Peano_axioms", notes: "Overview and definitions" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    axiom: { fill: "#e74c3c", stroke: "#c0392b" },
    definition: { fill: "#3498db", stroke: "#2980b9" },
    theorem: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

// Add nodes
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

// Write JSON
const dataDir = path.join(__dirname, "..", "data");
const outPath = path.join(dataDir, "peano-arithmetic.json");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote", outPath);

// Generate Mermaid
function toMermaid(filter) {
  const nodes = filter ? discourse.nodes.filter(filter) : discourse.nodes;
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = discourse.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  const lines = ["graph TD"];
  for (const n of nodes) {
    const desc = n.short || n.label;
    const lbl = (n.shortLabel || n.id) + "\\n" + (desc.length > 30 ? desc.slice(0, 27) + "..." : desc);
    lines.push(`    ${n.id}["${String(lbl).replace(/"/g, '\\"')}"]`);
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
  lines.push(`    class ${axiomIds} axiom`);
  lines.push(`    class ${defIds} definition`);
  lines.push(`    class ${thmIds} theorem`);
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

// 3 sections: ~10 each
const sections = [
  { name: "axioms-foundations", ids: ["A1","A2","A3","A4","A5","T1","T2","T3","DefAdd","T4","T5","T6"], title: "Axioms & Addition Foundations", desc: "Five Peano axioms, basic successor theorems, definition of addition, associativity and left identity" },
  { name: "addition-multiplication", ids: ["T7","T8","T9","DefMul","T10","T11","T12","T13","T14","T15","T16","T17"], title: "Commutativity, Multiplication, Distributivity", desc: "Commutativity and cancellation of addition, definition of multiplication, commutativity and associativity of multiplication, distributivity" },
  { name: "order-induction", ids: ["T18","T19","T20","T21","T22","T23","T24","T25"], title: "Order & Induction", desc: "Order relation, trichotomy, compatibility with operations, well-ordering, strong induction" }
];

const subgraphData = [];
for (const s of sections) {
  const filter = closure(s.ids);
  const { mermaid: sub, nodes: n, edges: e } = toMermaidWithCounts(filter);
  subgraphData.push({ ...s, mermaid: sub, nodes: n, edges: e });
  fs.writeFileSync(path.join(dataDir, `peano-arithmetic-${s.name}.mmd`), sub, "utf8");
  console.log("Wrote", path.join(dataDir, `peano-arithmetic-${s.name}.mmd`));
}

// Full graph
fs.writeFileSync(path.join(dataDir, "peano-arithmetic.mmd"), toMermaid(), "utf8");

// Generate HTML
const MATH_DB = process.env.MATH_DB || "/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database";
const NUM_DIR = path.join(MATH_DB, "processes", "number_theory");

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
        .header { background: linear-gradient(135deg, #27ae60 0%, #27ae60dd 100%); color: white; padding: 30px; }
        .header h1 { margin: 0 0 10px 0; font-size: 2em; font-weight: 300; }
        .header-meta { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; font-size: 0.9em; opacity: 0.9; }
        .meta-item { background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; }
        .nav-links { padding: 15px 30px; background: #f8f9fa; border-bottom: 1px solid #ecf0f1; }
        .nav-links a { color: #27ae60; text-decoration: none; margin-right: 20px; font-weight: 500; }
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
                <span class="meta-item">Foundations / Arithmetic</span>
                <span class="meta-item">Source: Landau, Peano</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="index-link" href="#">Peano Arithmetic Index</a>
            <a href="https://en.wikipedia.org/wiki/Peano_axioms" target="_blank">Peano Axioms (Wikipedia)</a>
            <a href="https://huggingface.co/spaces/garywelz/programming_framework" target="_blank">Programming Framework</a>
        </div>
        <script>
            (function() {
                const hostname = window.location.hostname;
                const base = hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database'
                    : '../..';
                document.getElementById('back-link').href = base + '/mathematics-database-table.html';
                document.getElementById('index-link').href = base + '/processes/number_theory/number_theory-peano-arithmetic.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: Landau, E. <a href="https://en.wikipedia.org/wiki/Peano_axioms" target="_blank">Foundations of Analysis</a> (1930); Peano, G. Arithmetices principia (1889)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <p class="flowchart-note" style="font-size:0.9rem;color:#7f8c8d;margin-bottom:12px;"><strong>Note:</strong> Arrows mean &quot;depends on&quot; (tail → head).</p>
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
                        <li>Peano</li><li>arithmetic</li><li>natural numbers</li><li>induction</li><li>successor</li><li>foundations</li>
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
      `Peano Arithmetic — ${d.title}`,
      d.desc + ". Shows how theorems depend on axioms, definitions, and prior theorems.",
      d.mermaid,
      d.nodes,
      d.edges
    );
    const fileName = "number_theory-peano-arithmetic-" + d.name;
    fs.writeFileSync(path.join(NUM_DIR, fileName + ".html"), html, "utf8");
    console.log("Wrote", path.join(NUM_DIR, fileName + ".html"));
  }
  // Index page
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Peano Arithmetic - Mathematics Process</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; padding: 30px; }
        h1 { color: #2c3e50; margin-bottom: 15px; }
        p { color: #555; margin-bottom: 25px; line-height: 1.6; }
        .nav-links { margin-bottom: 20px; }
        .nav-links a { color: #27ae60; text-decoration: none; margin-right: 20px; font-weight: 500; }
        .nav-links a:hover { text-decoration: underline; }
        .sections { display: grid; gap: 15px; }
        .sections a { display: block; padding: 20px; background: #f8f9fa; border-radius: 10px; color: #2c3e50; text-decoration: none; font-weight: 500; border-left: 4px solid #27ae60; }
        .sections a:hover { background: #ecf0f1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a href="https://en.wikipedia.org/wiki/Peano_axioms" target="_blank">Peano Axioms (Wikipedia)</a>
        </div>
        <script>
            (function() {
                const backLink = document.getElementById('back-link');
                backLink.href = window.location.hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html'
                    : '../../mathematics-database-table.html';
            })();
        </script>
        <h1>Peano Arithmetic</h1>
        <p>Axiomatic development of natural number arithmetic. Five axioms, definitions of addition and multiplication, and key theorems. Based on Landau, Foundations of Analysis. Split into three views.</p>
        <div class="sections">
            <a href="number_theory-peano-arithmetic-axioms-foundations.html">Chart 1 — Axioms & Addition Foundations</a>
            <a href="number_theory-peano-arithmetic-addition-multiplication.html">Chart 2 — Commutativity, Multiplication, Distributivity</a>
            <a href="number_theory-peano-arithmetic-order-induction.html">Chart 3 — Order & Induction</a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(NUM_DIR, "number_theory-peano-arithmetic.html"), indexHtml, "utf8");
  console.log("Wrote", path.join(NUM_DIR, "number_theory-peano-arithmetic.html"));
} else {
  console.log("MATH_DB not found - skipping HTML generation.");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
