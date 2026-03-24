#!/usr/bin/env node
/**
 * Build Aristotle Syllogistic Logic discourse JSON and Mermaid.
 * Based on Prior Analytics: 4 perfect syllogisms, 3 conversion rules, 10 imperfect syllogisms.
 * Source: Stanford Encyclopedia of Philosophy, Aristotle's Logic.
 */

const fs = require('fs');
const path = require('path');

const NODES = [
  { id: "DefAEIO", type: "definition", label: "A, E, I, O: All/No/Some/Some-not", short: "Categorical forms", colorClass: "definition" },
  { id: "DefFig", type: "definition", label: "Three figures: middle term position", short: "Figures 1,2,3", colorClass: "definition" },
  { id: "Econv", type: "axiom", label: "Eab implies Eba (No M is P implies No P is M)", short: "E-conversion", colorClass: "axiom" },
  { id: "Iconv", type: "axiom", label: "Iab implies Iba (Some M is P implies Some P is M)", short: "I-conversion", colorClass: "axiom" },
  { id: "Aconv", type: "axiom", label: "Aab implies Iba (All M is P implies Some P is M)", short: "A-conversion", colorClass: "axiom" },
  { id: "Barbara", type: "axiom", label: "AAA-1: All M is P, All S is M therefore All S is P", short: "Barbara", colorClass: "axiom" },
  { id: "Celarent", type: "axiom", label: "EAE-1: No M is P, All S is M therefore No S is P", short: "Celarent", colorClass: "axiom" },
  { id: "Darii", type: "axiom", label: "AII-1: All M is P, Some S is M therefore Some S is P", short: "Darii", colorClass: "axiom" },
  { id: "Ferio", type: "axiom", label: "EIO-1: No M is P, Some S is M therefore Some S is not P", short: "Ferio", colorClass: "axiom" },
  { id: "Cesare", type: "theorem", label: "EAE-2: No P is M, All S is M therefore No S is P", short: "Cesare", colorClass: "theorem" },
  { id: "Camestres", type: "theorem", label: "AEE-2: All P is M, No S is M therefore No S is P", short: "Camestres", colorClass: "theorem" },
  { id: "Festino", type: "theorem", label: "EIO-2: No P is M, Some S is M therefore Some S is not P", short: "Festino", colorClass: "theorem" },
  { id: "Baroco", type: "theorem", label: "AOO-2: All P is M, Some S is not M therefore Some S is not P", short: "Baroco", colorClass: "theorem" },
  { id: "Darapti", type: "theorem", label: "AAI-3: All M is P, All M is S therefore Some S is P", short: "Darapti", colorClass: "theorem" },
  { id: "Felapton", type: "theorem", label: "EAO-3: No M is P, All M is S therefore Some S is not P", short: "Felapton", colorClass: "theorem" },
  { id: "Disamis", type: "theorem", label: "IAI-3: Some M is P, All M is S therefore Some S is P", short: "Disamis", colorClass: "theorem" },
  { id: "Datisi", type: "theorem", label: "AII-3: All M is P, Some M is S therefore Some S is P", short: "Datisi", colorClass: "theorem" },
  { id: "Bocardo", type: "theorem", label: "OAO-3: Some M is not P, All M is S therefore Some S is not P", short: "Bocardo", colorClass: "theorem" },
  { id: "Ferison", type: "theorem", label: "EIO-3: No M is P, Some M is S therefore Some S is not P", short: "Ferison", colorClass: "theorem" }
];

// Dependencies (from → to). Based on Prior Analytics reduction proofs.
const DEPS = {
  Barbara: ["DefAEIO", "DefFig"],
  Celarent: ["DefAEIO", "DefFig"],
  Darii: ["DefAEIO", "DefFig"],
  Ferio: ["DefAEIO", "DefFig"],
  Cesare: ["Econv", "Celarent"],
  Camestres: ["Econv", "Celarent"],
  Festino: ["Econv", "Ferio"],
  Baroco: ["Barbara"],
  Darapti: ["Aconv", "Darii"],
  Felapton: ["Aconv", "Ferio"],
  Disamis: ["Iconv", "Darii"],
  Datisi: ["Aconv", "Darii"],
  Bocardo: ["Barbara"],
  Ferison: ["Aconv", "Ferio"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "aristotle-syllogistic",
    name: "Aristotle Syllogistic Logic",
    subject: "logic",
    variant: "classical",
    description: "Aristotelian categorical syllogistic. Four perfect syllogisms (Barbara, Celarent, Darii, Ferio), three conversion rules, and ten imperfect syllogisms reduced to the perfect ones. Based on Prior Analytics.",
    structure: { axioms: 7, definitions: 2, theorems: 10 }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Aristotle Syllogistic Dependency Graph. Programming Framework.",
    keywords: ["Aristotle", "syllogism", "categorical logic", "Prior Analytics", "Barbara", "Celarent"]
  },
  sources: [
    { id: "aristotle", type: "primary", authors: "Aristotle", title: "Prior Analytics", year: "c. 350 BCE", notes: "Syllogistic theory" },
    { id: "stanford", type: "secondary", authors: "Smith, R.", title: "Aristotle's Logic", url: "https://plato.stanford.edu/entries/aristotle-logic/", notes: "Stanford Encyclopedia" }
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
const outPath = path.join(dataDir, "aristotle-syllogistic.json");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote", outPath);

// Sanitize label for Mermaid
function sanitizeMermaidLabel(s) {
  return String(s)
    .replace(/→/g, "impl")
    .replace(/⊢/g, "|-")
    .replace(/∨/g, "or")
    .replace(/∧/g, "and")
    .replace(/↔/g, "iff")
    .replace(/\n/g, " ");
}

// Generate Mermaid
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
  { name: "foundations-perfect", ids: ["DefAEIO", "DefFig", "Econv", "Iconv", "Aconv", "Barbara", "Celarent", "Darii", "Ferio"], title: "Foundations and Perfect Syllogisms", desc: "Categorical forms, figures, conversion rules, and the four perfect syllogisms (Barbara, Celarent, Darii, Ferio)" },
  { name: "figure-2", ids: ["Cesare", "Camestres", "Festino", "Baroco"], title: "Figure 2 Syllogisms", desc: "Cesare, Camestres, Festino, Baroco reduced to perfect syllogisms via conversion" },
  { name: "figure-3", ids: ["Darapti", "Felapton", "Disamis", "Datisi", "Bocardo", "Ferison"], title: "Figure 3 Syllogisms", desc: "Darapti, Felapton, Disamis, Datisi, Bocardo, Ferison reduced to perfect syllogisms" }
];

const subgraphData = [];
for (const s of sections) {
  const filter = closure(s.ids);
  const { mermaid: sub, nodes: n, edges: e } = toMermaidWithCounts(filter);
  subgraphData.push({ ...s, mermaid: sub, nodes: n, edges: e });
  fs.writeFileSync(path.join(dataDir, `aristotle-syllogistic-${s.name}.mmd`), sub, "utf8");
  console.log("Wrote", path.join(dataDir, `aristotle-syllogistic-${s.name}.mmd`));
}

fs.writeFileSync(path.join(dataDir, "aristotle-syllogistic.mmd"), toMermaid(), "utf8");

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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1600px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 30px; }
        .header h1 { margin: 0 0 10px 0; font-size: 2em; font-weight: 300; }
        .header-meta { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; font-size: 0.9em; opacity: 0.9; }
        .meta-item { background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; }
        .nav-links { padding: 15px 30px; background: #f8f9fa; border-bottom: 1px solid #ecf0f1; }
        .nav-links a { color: #2c3e50; text-decoration: none; margin-right: 20px; font-weight: 500; }
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
                <span class="meta-item">Source: Aristotle, Prior Analytics</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="index-link" href="#">Aristotle Syllogistic Index</a>
            <a href="https://plato.stanford.edu/entries/aristotle-logic/" target="_blank">Aristotle's Logic (Stanford)</a>
            <a href="https://huggingface.co/spaces/garywelz/programming_framework" target="_blank">Programming Framework</a>
        </div>
        <script>
            (function() {
                const hostname = window.location.hostname;
                const base = hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database'
                    : '../..';
                document.getElementById('back-link').href = base + '/mathematics-database-table.html';
                document.getElementById('index-link').href = base + '/processes/discrete_mathematics/discrete_mathematics-aristotle-syllogistic.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: Aristotle, <a href="https://plato.stanford.edu/entries/aristotle-logic/" target="_blank">Prior Analytics</a> (c. 350 BCE); Stanford Encyclopedia of Philosophy</em></p>
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
                        <li>Aristotle</li><li>syllogism</li><li>Barbara</li><li>Celarent</li><li>Prior Analytics</li><li>categorical logic</li>
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
      `Aristotle Syllogistic — ${d.title}`,
      d.desc + ". Shows how imperfect syllogisms reduce to perfect ones via conversion.",
      d.mermaid,
      d.nodes,
      d.edges
    );
    const fileName = "discrete_mathematics-aristotle-syllogistic-" + d.name;
    fs.writeFileSync(path.join(DISC_DIR, fileName + ".html"), html, "utf8");
    console.log("Wrote", path.join(DISC_DIR, fileName + ".html"));
  }
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aristotle Syllogistic - Mathematics Process</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; padding: 30px; }
        h1 { color: #2c3e50; margin-bottom: 15px; }
        p { color: #555; margin-bottom: 25px; line-height: 1.6; }
        .nav-links { margin-bottom: 20px; }
        .nav-links a { color: #2c3e50; text-decoration: none; margin-right: 20px; font-weight: 500; }
        .nav-links a:hover { text-decoration: underline; }
        .sections { display: grid; gap: 15px; }
        .sections a { display: block; padding: 20px; background: #f8f9fa; border-radius: 10px; color: #2c3e50; text-decoration: none; font-weight: 500; border-left: 4px solid #2c3e50; }
        .sections a:hover { background: #ecf0f1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a href="https://plato.stanford.edu/entries/aristotle-logic/" target="_blank">Aristotle's Logic (Stanford)</a>
        </div>
        <script>
            (function() {
                const backLink = document.getElementById('back-link');
                backLink.href = window.location.hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html'
                    : '../../mathematics-database-table.html';
            })();
        </script>
        <h1>Aristotle Syllogistic Logic</h1>
        <p>Categorical syllogistic from Prior Analytics. Four perfect syllogisms (Barbara, Celarent, Darii, Ferio), three conversion rules, and ten imperfect syllogisms reduced to the perfect ones. Split into three views.</p>
        <div class="sections">
            <a href="discrete_mathematics-aristotle-syllogistic-foundations-perfect.html">Chart 1 — Foundations and Perfect Syllogisms</a>
            <a href="discrete_mathematics-aristotle-syllogistic-figure-2.html">Chart 2 — Figure 2 Syllogisms</a>
            <a href="discrete_mathematics-aristotle-syllogistic-figure-3.html">Chart 3 — Figure 3 Syllogisms</a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(DISC_DIR, "discrete_mathematics-aristotle-syllogistic.html"), indexHtml, "utf8");
  console.log("Wrote", path.join(DISC_DIR, "discrete_mathematics-aristotle-syllogistic.html"));
} else {
  console.log("MATH_DB not found - skipping HTML generation.");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
