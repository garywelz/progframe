#!/usr/bin/env node
/**
 * Build Euclid's Elements Book II discourse JSON and Mermaid.
 * Dependencies from David E. Joyce, Clark University:
 * https://mathcs.clarku.edu/~djoyce/java/elements/bookII/bookII.html
 *
 * Book II: 14 propositions on geometric algebra (rectangles, squares).
 * Props 1-10 logically independent within Book II; 11-14 depend on 6, 4, 7, 5.
 * All depend on Book I (right angles, parallels, areas).
 */

const fs = require('fs');
const path = require('path');

const PROPOSITIONS = [
  { n: 1, short: "Rectangle = sum of rectangles", full: "If one line is cut into segments, rectangle by whole equals sum of rectangles by each segment" },
  { n: 2, short: "Sum of rectangles = square on whole", full: "If a line is cut at random, sum of rectangles by whole and each segment equals square on whole" },
  { n: 3, short: "Rectangle = rectangle + square", full: "If a line is cut at random, rectangle by whole and one segment equals rectangle by segments plus square on that segment" },
  { n: 4, short: "Square on whole = squares + 2×rectangle", full: "If a line is cut at random, square on whole equals squares on segments plus twice rectangle contained by segments" },
  { n: 5, short: "Unequal segments: rectangle + square = square on half", full: "If a line cut into equal and unequal segments, rectangle by unequal segments plus square on difference equals square on half" },
  { n: 6, short: "Bisected + added: rectangle + square = square", full: "If a line bisected and added to, rectangle by whole-with-added and added plus square on half equals square on half-plus-added" },
  { n: 7, short: "Square on whole + square on segment", full: "If a line cut at random, square on whole plus square on one segment equals twice rectangle by whole and segment plus square on remainder" },
  { n: 8, short: "Four times rectangle + square", full: "If a line cut at random, four times rectangle by whole and one segment plus square on remainder equals square on whole-plus-segment" },
  { n: 9, short: "Unequal segments: sum of squares", full: "If a line cut into equal and unequal segments, sum of squares on unequal segments is double sum of square on half and square on difference" },
  { n: 10, short: "Bisected + added: sum of squares", full: "If a line bisected and added to, square on whole-with-added plus square on added equals double sum of square on half and square on half-plus-added" },
  { n: 11, short: "Cut line: rectangle = square (golden section)", full: "To cut a given line so that rectangle by whole and one segment equals square on remaining segment" },
  { n: 12, short: "Obtuse triangle: law of cosines", full: "In obtuse-angled triangles, square on side opposite obtuse angle greater than sum of squares on sides containing it" },
  { n: 13, short: "Acute triangle: law of cosines", full: "In acute-angled triangles, square on side opposite acute angle less than sum of squares on sides containing it" },
  { n: 14, short: "Construct square = rectilinear figure", full: "To construct a square equal to a given rectilinear figure" }
];

// Joyce: within Book II only. 6→11, 4→12, 7→13, 5→14. All depend on Book I.
const DEPS = {
  1: ["Def1"],
  2: ["Def1"],
  3: ["Def1"],
  4: ["Def1"],
  5: ["Def1", "Def2"],
  6: ["Def1", "Def2"],
  7: ["Def1"],
  8: ["Def1"],
  9: ["Def1"],
  10: ["Def1"],
  11: ["Prop6"],
  12: ["Prop4"],
  13: ["Prop7"],
  14: ["Prop5"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-ii",
    name: "Euclid's Elements, Book II",
    subject: "geometry",
    variant: "classical",
    description: "The 14 propositions of Book II on geometric algebra (rectangles, squares). Props 1-10 are logically independent within Book II; 11-14 depend on 6, 4, 7, 5. All depend on Book I. Source: David E. Joyce, Clark University.",
    structure: { books: 2, propositions: 14, foundationTypes: ["definition"] }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book II Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book II", "geometric algebra", "rectangles", "squares", "golden section", "quadrature"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book II", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookII/bookII.html", notes: "Clark University; dependency table from Logical structure" },
    { id: "euclid-heath", type: "primary", authors: "Heath, T.L.", title: "The Thirteen Books of Euclid's Elements", year: "1908", edition: "2nd", publisher: "Cambridge University Press", url: "https://archive.org/details/euclidheath00heatiala", notes: "Standard English translation" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    foundation: { fill: "#95a5a6", stroke: "#7f8c8d" },
    definition: { fill: "#3498db", stroke: "#2980b9" },
    proposition: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

// Add Book I foundation (cross-book reference)
discourse.nodes.push(
  { id: "BookI", type: "foundation", label: "Book I — Fundamentals of plane geometry", shortLabel: "Book I", short: "Foundation", book: 1, colorClass: "foundation" }
);

// Add definitions
discourse.nodes.push(
  { id: "Def1", type: "definition", label: "Rectangle contained by two straight lines containing the right angle", shortLabel: "Def. II.1", book: 2, number: 1, colorClass: "definition" },
  { id: "Def2", type: "definition", label: "Gnomon: parallelogram about diameter with two complements", shortLabel: "Def. II.2", book: 2, number: 2, colorClass: "definition" }
);

// Add propositions
for (const prop of PROPOSITIONS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. II.${prop.n}`,
    short: prop.short,
    book: 2,
    number: prop.n,
    colorClass: "proposition"
  });
  discourse.edges.push({ from: "BookI", to: `Prop${prop.n}` });
  for (const dep of DEPS[prop.n] || []) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

// Write JSON
const dataDir = path.join(__dirname, "..", "data");
const outPath = path.join(dataDir, "euclid-elements-book-ii.json");
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
    const desc = n.short || (n.label && n.label.length > 35 ? n.label.slice(0, 32) + "..." : n.label || n.id);
    const lbl = (n.shortLabel || n.id) + "\\n" + (desc || "");
    lines.push(`    ${n.id}["${String(lbl).replace(/"/g, '\\"')}"]`);
  }
  for (const e of edges) {
    lines.push(`    ${e.from} --> ${e.to}`);
  }
  lines.push("    classDef foundation fill:#95a5a6,color:#fff,stroke:#7f8c8d");
  lines.push("    classDef definition fill:#3498db,color:#fff,stroke:#2980b9");
  lines.push("    classDef proposition fill:#1abc9c,color:#fff,stroke:#16a085");
  const foundIds = nodes.filter(n => n.type === "foundation").map(n => n.id).join(",");
  const defIds = nodes.filter(n => n.type === "definition").map(n => n.id).join(",");
  const propIds = nodes.filter(n => n.type === "proposition").map(n => n.id).join(",");
  if (foundIds) lines.push(`    class ${foundIds} foundation`);
  lines.push(`    class ${defIds} definition`);
  lines.push(`    class ${propIds} proposition`);
  return lines.join("\n");
}

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

function toMermaidWithCounts(filter) {
  const nodes = filter ? discourse.nodes.filter(filter) : discourse.nodes;
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = discourse.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  return { mermaid: toMermaid(filter), nodes: nodes.length, edges: edges.length };
}

// Full graph (Book II is small - 16 nodes)
const fullMermaid = toMermaid();
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-ii.mmd"), fullMermaid, "utf8");
console.log("Wrote", path.join(dataDir, "euclid-elements-book-ii.mmd"));

// Single HTML page (Book II fits in one view)
const MATH_DB = process.env.MATH_DB || "/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database";
const GEOM_DIR = path.join(MATH_DB, "processes", "geometry_topology");

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
        .header { background: linear-gradient(135deg, #e67e22 0%, #e67e22dd 100%); color: white; padding: 30px; }
        .header h1 { margin: 0 0 10px 0; font-size: 2em; font-weight: 300; }
        .header-meta { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; font-size: 0.9em; opacity: 0.9; }
        .meta-item { background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; }
        .nav-links { padding: 15px 30px; background: #f8f9fa; border-bottom: 1px solid #ecf0f1; }
        .nav-links a { color: #e67e22; text-decoration: none; margin-right: 20px; font-weight: 500; }
        .nav-links a:hover { text-decoration: underline; }
        .content { padding: 30px; }
        .description { margin-bottom: 30px; }
        .description h2 { color: #2c3e50; margin-bottom: 15px; }
        .flowchart-container { margin: 30px 0; }
        .flowchart-container h2 { color: #2c3e50; margin-bottom: 15px; }
        .mermaid { background: white; padding: 20px; border-radius: 10px; border: 1px solid #ecf0f1; overflow-x: auto; overflow-y: auto; min-height: 400px; }
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
                <span class="meta-item">Geometry & Topology</span>
                <span class="meta-item">Source: Euclid's Elements</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="euclid-index-link" href="#">Euclid's Elements (all books)</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookII/bookII.html" target="_blank">Euclid's Elements Book II (Joyce)</a>
            <a href="https://huggingface.co/spaces/garywelz/programming_framework" target="_blank">Programming Framework</a>
        </div>
        <script>
            (function() {
                const hostname = window.location.hostname;
                const backLink = document.getElementById('back-link');
                const euclidLink = document.getElementById('euclid-index-link');
                const base = hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database'
                    : '../..';
                backLink.href = base + '/mathematics-database-table.html';
                euclidLink.href = base + '/processes/geometry_topology/geometry_topology-euclid-elements.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookII/bookII.html" target="_blank">Euclid's Elements, Book II</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#95a5a6"></div><div><strong>Gray</strong><br><small>Book I (foundation)</small></div></div>
                    <div class="color-item"><div class="color-box" style="background:#3498db"></div><div><strong>Blue</strong><br><small>Definitions</small></div></div>
                    <div class="color-item"><div class="color-box" style="background:#1abc9c"></div><div><strong>Teal</strong><br><small>Propositions</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book II</li><li>geometric algebra</li><li>rectangles</li><li>squares</li><li>golden section</li><li>quadrature</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default', flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'linear', nodeSpacing: 40, rankSpacing: 40, padding: 20 }, themeVariables: { fontSize: '14px', fontFamily: 'Segoe UI, Arial, sans-serif' } });
    </script>
</body>
</html>`;
}

if (fs.existsSync(GEOM_DIR)) {
  const { mermaid, nodes, edges } = toMermaidWithCounts(() => true);
  const html = htmlTemplate(
    "Euclid's Elements Book II",
    "Dependency graph for all 14 propositions of Euclid's Elements Book II. Geometric algebra: rectangles, squares, distributive law. Props 1-10 independent within Book II; 11-14 depend on 6, 4, 7, 5. All depend on Book I.",
    mermaid,
    nodes,
    edges
  );
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-ii.html"), html, "utf8");
  console.log("Wrote", path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-ii.html"));
} else {
  console.log("MATH_DB not found at", GEOM_DIR, "- skipping HTML generation.");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
