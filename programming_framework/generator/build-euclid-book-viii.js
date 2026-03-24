#!/usr/bin/env node
/**
 * Build Euclid's Elements Book VIII discourse JSON and Mermaid charts.
 * 27 propositions. Continued proportions. Depends on Book VII. Source: David E. Joyce.
 *
 * Charts: 2. Chart 1: Props 1-14. Chart 2: Props 15-27.
 */

const fs = require('fs');
const path = require('path');

const PROPS = [
  { n: 1, short: "Continued proportion, extremes prime", full: "Continued proportion, extremes relatively prime: least in ratio" },
  { n: 2, short: "Find numbers in continued proportion", full: "To find numbers in continued proportion, least in given ratio" },
  { n: 3, short: "Least: extremes prime", full: "Least in continued proportion: extremes relatively prime" },
  { n: 4, short: "Find continued proportion from ratios", full: "Given ratios in least numbers, find least in continued proportion" },
  { n: 5, short: "Plane numbers: compound ratio", full: "Plane numbers have ratio compounded of ratios of sides" },
  { n: 6, short: "First does not measure second", full: "Continued proportion: if first does not measure second, none measures another" },
  { n: 7, short: "First measures last", full: "Continued proportion: if first measures last, it measures second" },
  { n: 8, short: "Numbers between in proportion", full: "Numbers between two in continued proportion correspond to ratios" },
  { n: 9, short: "Relatively prime: numbers to unit", full: "Two relatively prime: numbers between them as between each and unit" },
  { n: 10, short: "Numbers from unit", full: "Numbers between number and unit correspond to between two numbers" },
  { n: 11, short: "Mean proportional of squares", full: "Between two squares one mean proportional; duplicate ratio" },
  { n: 12, short: "Two means between cubes", full: "Between two cubes two mean proportionals; triplicate ratio" },
  { n: 13, short: "Products proportional", full: "Continued proportion: products proportional; products of products" },
  { n: 14, short: "Square measures square", full: "Square measures square iff side measures side" },
  { n: 15, short: "Cube measures cube", full: "Cube measures cube iff side measures side" },
  { n: 16, short: "Square does not measure square", full: "Square does not measure square iff side does not measure side" },
  { n: 17, short: "Cube does not measure cube", full: "Cube does not measure cube iff side does not measure side" },
  { n: 18, short: "Similar plane: mean proportional", full: "Between similar plane numbers one mean proportional; duplicate ratio" },
  { n: 19, short: "Similar solid: two means", full: "Between similar solid numbers two mean proportionals; triplicate ratio" },
  { n: 20, short: "One mean: similar plane", full: "If one mean between two numbers, they are similar plane" },
  { n: 21, short: "Two means: similar solid", full: "If two means between two numbers, they are similar solid" },
  { n: 22, short: "Three in proportion: first square", full: "Three in continued proportion, first square: third square" },
  { n: 23, short: "Four in proportion: first cube", full: "Four in continued proportion, first cube: fourth cube" },
  { n: 24, short: "Ratio as square to square", full: "If ratio as square to square and first square, second square" },
  { n: 25, short: "Ratio as cube to cube", full: "If ratio as cube to cube and first cube, second cube" },
  { n: 26, short: "Similar plane: square ratio", full: "Similar plane numbers have ratio of square to square" },
  { n: 27, short: "Similar solid: cube ratio", full: "Similar solid numbers have ratio of cube to cube" }
];

const DEPS = {};
for (let i = 1; i <= 27; i++) DEPS[i] = ["BookVII"];
DEPS[2] = ["BookVII", "Prop1"];
DEPS[3] = ["BookVII", "Prop2"];
DEPS[4] = ["BookVII", "Prop2"];
DEPS[5] = ["BookVII"];
DEPS[6] = ["BookVII", "Prop1"];
DEPS[7] = ["BookVII", "Prop1"];
DEPS[8] = ["BookVII"];
DEPS[9] = ["BookVII", "Prop8"];
DEPS[10] = ["BookVII", "Prop9"];
DEPS[11] = ["BookVII", "Prop8"];
DEPS[12] = ["BookVII", "Prop8"];
DEPS[13] = ["BookVII"];
DEPS[14] = ["BookVII", "Prop11"];
DEPS[15] = ["BookVII", "Prop12"];
DEPS[16] = ["BookVII", "Prop14"];
DEPS[17] = ["BookVII", "Prop15"];
DEPS[18] = ["BookVII", "Prop8"];
DEPS[19] = ["BookVII", "Prop8"];
DEPS[20] = ["BookVII", "Prop18"];
DEPS[21] = ["BookVII", "Prop19"];
DEPS[22] = ["BookVII", "Prop1"];
DEPS[23] = ["BookVII", "Prop1"];
DEPS[24] = ["BookVII", "Prop22"];
DEPS[25] = ["BookVII", "Prop23"];
DEPS[26] = ["BookVII", "Prop18"];
DEPS[27] = ["BookVII", "Prop19"];

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-viii",
    name: "Euclid's Elements, Book VIII",
    subject: "number_theory",
    variant: "classical",
    description: "Continued proportions. 27 propositions. Depends on Book VII. Source: David E. Joyce.",
    structure: { books: 8, propositions: 27, foundationTypes: ["foundation"] }
  },
  metadata: {
    created: "2026-03-18",
    lastUpdated: "2026-03-18",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book VIII Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book VIII", "continued proportion", "plane", "solid"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book VIII", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookVIII/bookVIII.html", notes: "Clark University" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    foundation: { fill: "#95a5a6", stroke: "#7f8c8d" },
    proposition: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

discourse.nodes.push(
  { id: "BookVII", type: "foundation", label: "Book VII — Number theory", shortLabel: "Book VII", short: "Foundation", book: 7, colorClass: "foundation" }
);

for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. VIII.${prop.n}`,
    short: prop.short,
    book: 8,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n] || ["BookVII"]) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-viii.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-viii.json");

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
  lines.push("    classDef proposition fill:#1abc9c,color:#fff,stroke:#16a085");
  const foundIds = nodes.filter(n => n.type === "foundation").map(n => n.id).join(",");
  const propIds = nodes.filter(n => n.type === "proposition").map(n => n.id).join(",");
  if (foundIds) lines.push(`    class ${foundIds} foundation`);
  lines.push(`    class ${propIds} proposition`);
  return lines.join("\n");
}

function closure(propMax) {
  const needed = new Set(["BookVII"]);
  for (let i = 1; i <= propMax; i++) needed.add(`Prop${i}`);
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of discourse.edges) {
      if (needed.has(e.to) && !needed.has(e.from)) { needed.add(e.from); changed = true; }
    }
  }
  return n => needed.has(n.id);
}

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
                <span class="meta-item">Number Theory</span>
                <span class="meta-item">Source: Euclid's Elements</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="euclid-index-link" href="#">Euclid's Elements (all books)</a>
            <a id="book-index-link" href="#">Euclid Book VIII Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVIII/bookVIII.html" target="_blank">Euclid's Elements Book VIII (Joyce)</a>
            <a href="https://huggingface.co/spaces/garywelz/programming_framework" target="_blank">Programming Framework</a>
        </div>
        <script>
            (function() {
                const hostname = window.location.hostname;
                const base = hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database'
                    : '../..';
                document.getElementById('back-link').href = base + '/mathematics-database-table.html';
                document.getElementById('euclid-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements.html';
                document.getElementById('book-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-viii.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVIII/bookVIII.html" target="_blank">Euclid's Elements, Book VIII</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#95a5a6"></div><div><strong>Gray</strong><br><small>Book VII (foundation)</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book VIII</li><li>continued proportion</li><li>plane</li><li>solid</li>
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
  const filter1 = closure(14);
  const m1 = toMermaid(filter1);
  const nodes1 = discourse.nodes.filter(filter1);
  const edges1 = discourse.edges.filter(e => filter1({ id: e.from }) && filter1({ id: e.to }));
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-viii-props-1-14.html"), htmlTemplate("Euclid's Elements Book VIII — Propositions 1–14", "Continued proportion, least in ratio, square/cube. Depends on Book VII.", m1, nodes1.length, edges1.length), "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-viii-props-1-14.html");

  const m2 = toMermaid(() => true);
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-viii-props-15-27.html"), htmlTemplate("Euclid's Elements Book VIII — Propositions 15–27", "Similar plane/solid, mean proportionals, square/cube ratios.", m2, discourse.nodes.length, discourse.edges.length), "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-viii-props-15-27.html");
}

// Book VIII index
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book VIII - Mathematics Process</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; padding: 30px; }
        h1 { color: #2c3e50; margin-bottom: 15px; }
        p { color: #555; margin-bottom: 25px; line-height: 1.6; }
        .nav-links { margin-bottom: 20px; }
        .nav-links a { color: #e67e22; text-decoration: none; margin-right: 20px; font-weight: 500; }
        .nav-links a:hover { text-decoration: underline; }
        .sections { display: grid; gap: 15px; }
        .sections a { display: block; padding: 20px; background: #f8f9fa; border-radius: 10px; color: #2c3e50; text-decoration: none; font-weight: 500; border-left: 4px solid #e67e22; }
        .sections a:hover { background: #ecf0f1; }
        .chart-meta { font-size: 0.9em; color: #7f8c8d; margin-top: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="euclid-index-link" href="#">Euclid's Elements (all books)</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVIII/bookVIII.html" target="_blank">Euclid's Elements Book VIII (Joyce)</a>
        </div>
        <script>
            (function() {
                const base = window.location.hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database'
                    : '../..';
                document.getElementById('back-link').href = base + '/mathematics-database-table.html';
                document.getElementById('euclid-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements.html';
            })();
        </script>
        <h1>Euclid's Elements Book VIII</h1>
        <p>Continued proportions. 27 propositions. Depends on Book VII. Plane numbers, solid numbers, mean proportionals.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-viii-props-1-14.html">Propositions 1–14 <span class="chart-meta">Continued proportion, squares, cubes</span></a>
            <a href="geometry_topology-euclid-elements-book-viii-props-15-27.html">Propositions 15–27 <span class="chart-meta">Similar plane/solid, ratios</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-viii.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-viii.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
