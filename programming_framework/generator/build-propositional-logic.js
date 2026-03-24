#!/usr/bin/env node
/**
 * Build Propositional Logic discourse JSON and Mermaid.
 * Hilbert-style (Łukasiewicz P2): 3 axioms + MP, definitions of ∨∧↔, key theorems.
 * Based on Frege, Łukasiewicz, Church; Wikipedia Propositional calculus.
 */

const fs = require('fs');
const path = require('path');

const NODES = [
  { id: "A1", type: "axiom", label: "φ → (ψ → φ)", short: "Weakening", colorClass: "axiom" },
  { id: "A2", type: "axiom", label: "(φ→(ψ→χ)) → ((φ→ψ)→(φ→χ))", short: "Distrib. of impl.", colorClass: "axiom" },
  { id: "A3", type: "axiom", label: "(¬φ→¬ψ) → (ψ→φ)", short: "Contraposition", colorClass: "axiom" },
  { id: "MP", type: "axiom", label: "Modus Ponens: φ, (φ→ψ) ⊢ ψ", short: "MP", colorClass: "axiom" },
  { id: "T1", type: "theorem", label: "φ → φ", short: "Self-implication", colorClass: "theorem" },
  { id: "T2", type: "theorem", label: "¬¬φ → φ", short: "Double neg. elim", colorClass: "theorem" },
  { id: "T3", type: "theorem", label: "φ → ¬¬φ", short: "Double neg. intro", colorClass: "theorem" },
  { id: "T4", type: "theorem", label: "(φ→ψ) → (¬ψ→¬φ)", short: "Transposition", colorClass: "theorem" },
  { id: "T5", type: "theorem", label: "(φ→ψ)∧(ψ→χ) ⇒ (φ→χ)", short: "Hyp. syllogism", colorClass: "theorem" },
  { id: "DefOr", type: "definition", label: "φ ∨ ψ := ¬φ → ψ", short: "Def. disjunction", colorClass: "definition" },
  { id: "DefAnd", type: "definition", label: "φ ∧ ψ := ¬(φ → ¬ψ)", short: "Def. conjunction", colorClass: "definition" },
  { id: "DefIff", type: "definition", label: "φ ↔ ψ := (φ→ψ)∧(ψ→φ)", short: "Def. biconditional", colorClass: "definition" },
  { id: "T6", type: "theorem", label: "φ → (φ ∨ ψ)", short: "Addition (∨I)", colorClass: "theorem" },
  { id: "T7", type: "theorem", label: "(φ∧ψ) → φ", short: "Simplification (∧E)", colorClass: "theorem" },
  { id: "T8", type: "theorem", label: "(φ∧ψ) → ψ", short: "Simplification (∧E)", colorClass: "theorem" },
  { id: "T9", type: "theorem", label: "φ → (ψ → (φ∧ψ))", short: "Conjunction (∧I)", colorClass: "theorem" },
  { id: "T10", type: "theorem", label: "(φ→ψ) ↔ (¬φ∨ψ)", short: "Material impl.", colorClass: "theorem" },
  { id: "T11", type: "theorem", label: "¬(φ∧ψ) ↔ (¬φ∨¬ψ)", short: "De Morgan (1)", colorClass: "theorem" },
  { id: "T12", type: "theorem", label: "¬(φ∨ψ) ↔ (¬φ∧¬ψ)", short: "De Morgan (2)", colorClass: "theorem" },
  { id: "T13", type: "theorem", label: "φ ∨ ¬φ", short: "Excluded middle", colorClass: "theorem" },
  { id: "T14", type: "theorem", label: "¬(φ ∧ ¬φ)", short: "Non-contradiction", colorClass: "theorem" },
  { id: "T15", type: "theorem", label: "(φ∧¬φ) → ψ", short: "Explosion", colorClass: "theorem" },
  { id: "T16", type: "theorem", label: "(φ∨ψ) ↔ (ψ∨φ)", short: "Commutation (∨)", colorClass: "theorem" },
  { id: "T17", type: "theorem", label: "(φ∧ψ) ↔ (ψ∧φ)", short: "Commutation (∧)", colorClass: "theorem" },
  { id: "T18", type: "theorem", label: "(φ∧(ψ∨χ)) ↔ ((φ∧ψ)∨(φ∧χ))", short: "Distribution", colorClass: "theorem" },
  { id: "T19", type: "theorem", label: "Deduction theorem", short: "Deduction thm", colorClass: "theorem" }
];

// Dependencies (from → to). Based on Hilbert/Łukasiewicz P2 development.
const DEPS = {
  T1: ["A1", "A2", "MP"],
  T2: ["A3", "T1", "MP"],
  T3: ["A1", "A3", "MP"],
  T4: ["A3", "T2", "T3", "MP"],
  T5: ["A2", "T1", "MP"],
  DefOr: ["A1", "A2", "A3", "MP"],
  DefAnd: ["DefOr", "A3", "MP"],
  DefIff: ["DefAnd", "T9", "MP"],
  T6: ["DefOr", "A1", "MP"],
  T7: ["DefAnd", "A1", "A3", "MP"],
  T8: ["DefAnd", "A1", "A3", "MP"],
  T9: ["A1", "A2", "MP"],
  T10: ["DefOr", "T4", "MP"],
  T11: ["DefAnd", "DefOr", "T4", "T6", "MP"],
  T12: ["DefAnd", "DefOr", "T4", "MP"],
  T13: ["DefOr", "T2", "T3", "MP"],
  T14: ["DefAnd", "T4", "MP"],
  T15: ["DefAnd", "A1", "A2", "MP"],
  T16: ["DefOr", "T4", "MP"],
  T17: ["DefAnd", "T9", "MP"],
  T18: ["DefAnd", "DefOr", "T6", "T7", "T8", "T9", "MP"],
  T19: ["A1", "A2", "MP"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "propositional-logic",
    name: "Propositional Logic",
    subject: "logic",
    variant: "classical",
    description: "Hilbert-style axiomatic development of classical propositional logic. Three axioms (Łukasiewicz P2), modus ponens, definitions of disjunction, conjunction, biconditional, and key theorems (double negation, De Morgan, excluded middle, deduction theorem).",
    structure: { axioms: 4, definitions: 3, theorems: 19 }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Propositional Logic Dependency Graph. Programming Framework.",
    keywords: ["propositional logic", "Hilbert", "Łukasiewicz", "tautology", "modus ponens"]
  },
  sources: [
    { id: "frege", type: "primary", authors: "Frege, G.", title: "Begriffsschrift", year: "1879", notes: "First axiomatic propositional logic" },
    { id: "lukasiewicz", type: "primary", authors: "Łukasiewicz, J.", title: "Elements of Mathematical Logic", year: "1929", notes: "P2: 3 axioms" },
    { id: "wikipedia", type: "digital", title: "Propositional calculus", url: "https://en.wikipedia.org/wiki/Propositional_calculus", notes: "Axioms and theorems" }
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
const outPath = path.join(dataDir, "propositional-logic.json");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote", outPath);

// Sanitize label for Mermaid (Unicode arrows/symbols can cause "Syntax error in text")
function sanitizeMermaidLabel(s) {
  return String(s)
    .replace(/→/g, "impl")
    .replace(/⊢/g, "|-")
    .replace(/∨/g, "or")
    .replace(/∧/g, "and")
    .replace(/↔/g, "iff")
    .replace(/\n/g, " ");
}

// Generate Mermaid - use parentheses for node shape (more robust than brackets)
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

// 3 sections
const sections = [
  { name: "axioms-implication", ids: ["A1","A2","A3","MP","T1","T2","T3","T4","T5"], title: "Axioms & Implication", desc: "Three Hilbert axioms, modus ponens, self-implication, double negation, transposition, hypothetical syllogism" },
  { name: "definitions-connectives", ids: ["DefOr","DefAnd","DefIff","T6","T7","T8","T9","T10","T11","T12"], title: "Definitions & Connectives", desc: "Definitions of disjunction, conjunction, biconditional; simplification, addition, material implication, De Morgan" },
  { name: "tautologies-metalogic", ids: ["T13","T14","T15","T16","T17","T18","T19"], title: "Tautologies & Metalogic", desc: "Excluded middle, non-contradiction, explosion, commutation, distribution, deduction theorem" }
];

const subgraphData = [];
for (const s of sections) {
  const filter = closure(s.ids);
  const { mermaid: sub, nodes: n, edges: e } = toMermaidWithCounts(filter);
  subgraphData.push({ ...s, mermaid: sub, nodes: n, edges: e });
  fs.writeFileSync(path.join(dataDir, `propositional-logic-${s.name}.mmd`), sub, "utf8");
  console.log("Wrote", path.join(dataDir, `propositional-logic-${s.name}.mmd`));
}

// Full graph
fs.writeFileSync(path.join(dataDir, "propositional-logic.mmd"), toMermaid(), "utf8");

// Generate HTML
const MATH_DB = process.env.MATH_DB || "/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database";
const DISC_DIR = path.join(MATH_DB, "processes", "discrete_mathematics");

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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1600px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%); color: white; padding: 30px; }
        .header h1 { margin: 0 0 10px 0; font-size: 2em; font-weight: 300; }
        .header-meta { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; font-size: 0.9em; opacity: 0.9; }
        .meta-item { background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; }
        .nav-links { padding: 15px 30px; background: #f8f9fa; border-bottom: 1px solid #ecf0f1; }
        .nav-links a { color: #8e44ad; text-decoration: none; margin-right: 20px; font-weight: 500; }
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
                <span class="meta-item">Discrete Mathematics / Logic</span>
                <span class="meta-item">Source: Frege, Łukasiewicz</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="index-link" href="#">Propositional Logic Index</a>
            <a href="https://en.wikipedia.org/wiki/Propositional_calculus" target="_blank">Propositional Calculus (Wikipedia)</a>
            <a href="https://huggingface.co/spaces/garywelz/programming_framework" target="_blank">Programming Framework</a>
        </div>
        <script>
            (function() {
                const hostname = window.location.hostname;
                const base = hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database'
                    : '../..';
                document.getElementById('back-link').href = base + '/mathematics-database-table.html';
                document.getElementById('index-link').href = base + '/processes/discrete_mathematics/discrete_mathematics-propositional-logic.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: Frege, G. <a href="https://en.wikipedia.org/wiki/Begriffsschrift" target="_blank">Begriffsschrift</a> (1879); Łukasiewicz, J. Elements of Mathematical Logic (1929)</em></p>
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
                        <li>propositional logic</li><li>Hilbert</li><li>Łukasiewicz</li><li>tautology</li><li>modus ponens</li><li>De Morgan</li>
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
      `Propositional Logic — ${d.title}`,
      d.desc + ". Shows how theorems depend on axioms, definitions, and prior theorems.",
      d.mermaid,
      d.nodes,
      d.edges
    );
    const fileName = "discrete_mathematics-propositional-logic-" + d.name;
    fs.writeFileSync(path.join(DISC_DIR, fileName + ".html"), html, "utf8");
    console.log("Wrote", path.join(DISC_DIR, fileName + ".html"));
  }
  // Index page
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Propositional Logic - Mathematics Process</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; padding: 30px; }
        h1 { color: #2c3e50; margin-bottom: 15px; }
        p { color: #555; margin-bottom: 25px; line-height: 1.6; }
        .nav-links { margin-bottom: 20px; }
        .nav-links a { color: #8e44ad; text-decoration: none; margin-right: 20px; font-weight: 500; }
        .nav-links a:hover { text-decoration: underline; }
        .sections { display: grid; gap: 15px; }
        .sections a { display: block; padding: 20px; background: #f8f9fa; border-radius: 10px; color: #2c3e50; text-decoration: none; font-weight: 500; border-left: 4px solid #8e44ad; }
        .sections a:hover { background: #ecf0f1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a href="https://en.wikipedia.org/wiki/Propositional_calculus" target="_blank">Propositional Calculus (Wikipedia)</a>
        </div>
        <script>
            (function() {
                const backLink = document.getElementById('back-link');
                backLink.href = window.location.hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html'
                    : '../../mathematics-database-table.html';
            })();
        </script>
        <h1>Propositional Logic</h1>
        <p>Hilbert-style axiomatic development of classical propositional logic. Three axioms (Łukasiewicz P2), modus ponens, definitions of disjunction, conjunction, biconditional, and key theorems. Split into three views.</p>
        <div class="sections">
            <a href="discrete_mathematics-propositional-logic-axioms-implication.html">Chart 1 — Axioms & Implication</a>
            <a href="discrete_mathematics-propositional-logic-definitions-connectives.html">Chart 2 — Definitions & Connectives</a>
            <a href="discrete_mathematics-propositional-logic-tautologies-metalogic.html">Chart 3 — Tautologies & Metalogic</a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(DISC_DIR, "discrete_mathematics-propositional-logic.html"), indexHtml, "utf8");
  console.log("Wrote", path.join(DISC_DIR, "discrete_mathematics-propositional-logic.html"));
} else {
  console.log("MATH_DB not found - skipping HTML generation.");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
