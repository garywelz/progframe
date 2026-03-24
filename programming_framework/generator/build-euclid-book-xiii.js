#!/usr/bin/env node
/**
 * Build Euclid's Elements Book XIII discourse JSON and Mermaid charts.
 * 18 propositions. Regular solids: tetrahedron, octahedron, cube, icosahedron, dodecahedron.
 * Depends on Books I, IV, VI, X, XI. Source: David E. Joyce.
 *
 * Charts: 2. Props 1-9, 10-18.
 */

const fs = require('fs');
const path = require('path');

const PROPS = [
  { n: 1, short: "Extreme and mean: square on greater", full: "Line cut in extreme and mean ratio: square on greater plus half whole equals five times square on half" },
  { n: 2, short: "Square five times: extreme and mean", full: "If square on line five times square on segment: double segment cut in extreme and mean, greater is remainder" },
  { n: 3, short: "Extreme and mean: sum of segments", full: "Line cut in extreme and mean: square on lesser + half greater equals five times square on half" },
  { n: 4, short: "Extreme and mean: sum of squares", full: "Line cut in extreme and mean: sum of squares on whole and lesser triple square on greater" },
  { n: 5, short: "Extreme and mean: add greater", full: "Line cut in extreme and mean, add greater: whole cut in extreme and mean, original is greater" },
  { n: 6, short: "Rational cut: apotome", full: "Rational line cut in extreme and mean ratio: each segment is apotome" },
  { n: 7, short: "Equilateral pentagon: three angles", full: "Equilateral pentagon: if three angles equal (order or not), pentagon equiangular" },
  { n: 8, short: "Pentagon: diagonals in extreme and mean", full: "Equilateral equiangular pentagon: diagonals subtending two angles cut in extreme and mean ratio" },
  { n: 9, short: "Hexagon + decagon: extreme and mean", full: "Side of hexagon + decagon in same circle: cut in extreme and mean, greater is hexagon" },
  { n: 10, short: "Pentagon: square equals hexagon + decagon", full: "Equilateral pentagon in circle: square on side equals sum of squares on hexagon and decagon" },
  { n: 11, short: "Pentagon in rational circle: minor", full: "Equilateral pentagon in circle with rational diameter: side is minor" },
  { n: 12, short: "Equilateral triangle: side triple radius", full: "Equilateral triangle in circle: square on side triple square on radius" },
  { n: 13, short: "Construct tetrahedron in sphere", full: "To construct pyramid (tetrahedron) in given sphere; diameter squared 1.5 times side squared" },
  { n: 14, short: "Construct octahedron in sphere", full: "To construct octahedron in sphere; diameter squared double side squared" },
  { n: 15, short: "Construct cube in sphere", full: "To construct cube in sphere; diameter squared triple side squared" },
  { n: 16, short: "Construct icosahedron in sphere", full: "To construct icosahedron in sphere; side is minor" },
  { n: 17, short: "Construct dodecahedron in sphere", full: "To construct dodecahedron in sphere; side is apotome" },
  { n: 18, short: "Compare five regular solids", full: "To set out sides of five figures and compare them; no other such figure exists" }
];

const FOUNDATIONS = ["BookI", "BookIV", "BookVI", "BookX", "BookXI"];
const DEPS = {};
for (let i = 1; i <= 18; i++) DEPS[i] = FOUNDATIONS;

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-xiii",
    name: "Euclid's Elements, Book XIII",
    subject: "regular_solids",
    variant: "classical",
    description: "Regular solids: tetrahedron, octahedron, cube, icosahedron, dodecahedron. 18 propositions. Depends on Books I, IV, VI, X, XI. Source: David E. Joyce.",
    structure: { books: 13, propositions: 18, foundationTypes: ["foundation"] }
  },
  metadata: {
    created: "2026-03-18",
    lastUpdated: "2026-03-18",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book XIII Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book XIII", "regular solids", "Platonic", "tetrahedron", "octahedron", "cube", "icosahedron", "dodecahedron"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book XIII", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookXIII/bookXIII.html", notes: "Clark University" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    foundation: { fill: "#95a5a6", stroke: "#7f8c8d" },
    proposition: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

discourse.nodes.push(
  { id: "BookI", type: "foundation", label: "Book I — Plane geometry", shortLabel: "Book I", short: "Foundation", book: 1, colorClass: "foundation" },
  { id: "BookIV", type: "foundation", label: "Book IV — Inscribed figures", shortLabel: "Book IV", short: "Foundation", book: 4, colorClass: "foundation" },
  { id: "BookVI", type: "foundation", label: "Book VI — Similar figures", shortLabel: "Book VI", short: "Foundation", book: 6, colorClass: "foundation" },
  { id: "BookX", type: "foundation", label: "Book X — Incommensurables", shortLabel: "Book X", short: "Foundation", book: 10, colorClass: "foundation" },
  { id: "BookXI", type: "foundation", label: "Book XI — Solid geometry", shortLabel: "Book XI", short: "Foundation", book: 11, colorClass: "foundation" }
);

for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. XIII.${prop.n}`,
    short: prop.short,
    book: 13,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n]) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-xiii.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-xiii.json");

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
  const needed = new Set(FOUNDATIONS);
  for (let i = 1; i <= propMax; i++) needed.add(`Prop${i}`);
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
                <span class="meta-item">Regular Solids</span>
                <span class="meta-item">Source: Euclid's Elements</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="euclid-index-link" href="#">Euclid's Elements (all books)</a>
            <a id="book-index-link" href="#">Euclid Book XIII Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookXIII/bookXIII.html" target="_blank">Euclid's Elements Book XIII (Joyce)</a>
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
                document.getElementById('book-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-xiii.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookXIII/bookXIII.html" target="_blank">Euclid's Elements, Book XIII</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#95a5a6"></div><div><strong>Gray</strong><br><small>Book I, IV, VI, X, XI (foundation)</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book XIII</li><li>regular solids</li><li>Platonic</li><li>tetrahedron</li><li>octahedron</li><li>cube</li><li>icosahedron</li><li>dodecahedron</li>
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

const CHARTS = [
  [9, "1-9", "Extreme and mean ratio, pentagon, hexagon, decagon"],
  [18, "10-18", "Five Platonic solids in sphere"]
];

if (fs.existsSync(GEOM_DIR)) {
  CHARTS.forEach(([max, range, desc]) => {
    const filter = closure(max);
    const m = toMermaid(filter);
    const nodes = discourse.nodes.filter(filter);
    const edges = discourse.edges.filter(e => filter({ id: e.from }) && filter({ id: e.to }));
    const fname = `geometry_topology-euclid-elements-book-xiii-props-${range.replace(/–/g, "-").replace(" ", "-")}.html`;
    fs.writeFileSync(path.join(GEOM_DIR, fname), htmlTemplate(`Euclid's Elements Book XIII — Propositions ${range}`, desc, m, nodes.length, edges.length), "utf8");
    console.log("Wrote", fname);
  });
}

// Book XIII index
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book XIII - Mathematics Process</title>
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
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookXIII/bookXIII.html" target="_blank">Euclid's Elements Book XIII (Joyce)</a>
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
        <h1>Euclid's Elements Book XIII</h1>
        <p>Regular solids: tetrahedron, octahedron, cube, icosahedron, dodecahedron. 18 propositions. Depends on Books I, IV, VI, X, XI. XIII.18: no other such figure exists.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-xiii-props-1-9.html">Propositions 1–9 <span class="chart-meta">Extreme and mean ratio, pentagon</span></a>
            <a href="geometry_topology-euclid-elements-book-xiii-props-10-18.html">Propositions 10–18 <span class="chart-meta">Five Platonic solids</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-xiii.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-xiii.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
