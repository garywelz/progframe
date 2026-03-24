#!/usr/bin/env node
/**
 * Build Euclid's Elements Book IV discourse JSON and Mermaid charts.
 * 7 definitions, 16 propositions. Inscribed/circumscribed figures.
 * Joyce: IV.10←IV.1,IV.5,II.11; IV.11←IV.2,IV.10; IV.12←IV.11; IV.16←IV.1,IV.2,IV.11.
 * All rely on Books I and III.
 *
 * Charts: 2. Chart 1: Defs + Props 1-5. Chart 2: Props 6-16.
 */

const fs = require('fs');
const path = require('path');

const DEFS = [
  { n: 1, short: "Inscribe in circle", full: "Rectilinear figure inscribed in circle when each vertex on circumference" },
  { n: 2, short: "Circumscribe about circle", full: "Figure circumscribed about circle when each side touches circle" },
  { n: 3, short: "Inscribe circle in figure", full: "Circle inscribed in figure when each side touches circle" },
  { n: 4, short: "Circumscribe circle about figure", full: "Circle circumscribed about figure when each vertex on circumference" },
  { n: 5, short: "Inscribe in figure", full: "Figure inscribed in figure when each vertex of inner on sides of outer" },
  { n: 6, short: "Circumscribe about figure", full: "Figure circumscribed about figure when each side of outer touches inner" },
  { n: 7, short: "Inscribe line in circle", full: "Straight line inscribed in circle when its ends on circumference" }
];

const PROPS = [
  { n: 1, short: "Fit line in circle", full: "To fit into given circle a straight line equal to given, not greater than diameter" },
  { n: 2, short: "Inscribe triangle in circle", full: "To inscribe in given circle a triangle equiangular with given triangle" },
  { n: 3, short: "Circumscribe triangle about circle", full: "To circumscribe about given circle a triangle equiangular with given" },
  { n: 4, short: "Inscribe circle in triangle", full: "To inscribe a circle in a given triangle" },
  { n: 5, short: "Circumscribe circle about triangle", full: "To circumscribe a circle about a given triangle" },
  { n: 6, short: "Inscribe square in circle", full: "To inscribe a square in a given circle" },
  { n: 7, short: "Circumscribe square about circle", full: "To circumscribe a square about a given circle" },
  { n: 8, short: "Inscribe circle in square", full: "To inscribe a circle in a given square" },
  { n: 9, short: "Circumscribe circle about square", full: "To circumscribe a circle about a given square" },
  { n: 10, short: "Isosceles triangle, base angles double", full: "To construct isosceles triangle with each base angle double the remaining" },
  { n: 11, short: "Inscribe pentagon in circle", full: "To inscribe an equilateral equiangular pentagon in a given circle" },
  { n: 12, short: "Circumscribe pentagon about circle", full: "To circumscribe an equilateral equiangular pentagon about a given circle" },
  { n: 13, short: "Inscribe circle in pentagon", full: "To inscribe a circle in a given equilateral equiangular pentagon" },
  { n: 14, short: "Circumscribe circle about pentagon", full: "To circumscribe a circle about a given equilateral equiangular pentagon" },
  { n: 15, short: "Inscribe hexagon in circle", full: "To inscribe an equilateral equiangular hexagon in a given circle" },
  { n: 16, short: "Inscribe 15-gon in circle", full: "To inscribe an equilateral equiangular fifteen-angled figure in a given circle" }
];

// Joyce: IV.10←IV.1,IV.5,II.11; IV.11←IV.2,IV.10; IV.12←IV.11; IV.16←IV.1,IV.2,IV.11. All use Book I, Book III.
const DEPS = {
  1: ["BookI", "BookIII"],
  2: ["BookI", "BookIII"],
  3: ["BookI", "BookIII"],
  4: ["BookI", "BookIII"],
  5: ["BookI", "BookIII"],
  6: ["BookI", "BookIII", "Prop1"],  // inscribe square uses IV.1
  7: ["BookI", "BookIII", "Prop6"],
  8: ["BookI", "BookIII", "Prop7"],
  9: ["BookI", "BookIII", "Prop8"],
  10: ["BookI", "BookIII", "Prop1", "Prop5", "PropII11"],
  11: ["BookI", "BookIII", "Prop2", "Prop10"],
  12: ["BookI", "BookIII", "Prop11"],
  13: ["BookI", "BookIII", "Prop11"],
  14: ["BookI", "BookIII", "Prop11"],
  15: ["BookI", "BookIII", "Prop1"],
  16: ["BookI", "BookIII", "Prop1", "Prop2", "Prop11"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-iv",
    name: "Euclid's Elements, Book IV",
    subject: "geometry",
    variant: "classical",
    description: "Inscribed and circumscribed figures: triangle, square, pentagon, hexagon, 15-gon. All depend on Books I and III. IV.10 uses II.11. Source: David E. Joyce.",
    structure: { books: 4, definitions: 7, propositions: 16, foundationTypes: ["definition", "foundation"] }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book IV Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book IV", "inscribed", "circumscribed", "pentagon", "hexagon"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book IV", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookIV/bookIV.html", notes: "Clark University; Logical structure" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    foundation: { fill: "#95a5a6", stroke: "#7f8c8d" },
    definition: { fill: "#3498db", stroke: "#2980b9" },
    proposition: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

// Cross-book foundations
discourse.nodes.push(
  { id: "BookI", type: "foundation", label: "Book I — Fundamentals of plane geometry", shortLabel: "Book I", short: "Foundation", book: 1, colorClass: "foundation" },
  { id: "BookIII", type: "foundation", label: "Book III — Theory of circles", shortLabel: "Book III", short: "Foundation", book: 3, colorClass: "foundation" },
  { id: "PropII11", type: "foundation", label: "Prop. II.11 — Golden section", shortLabel: "Prop. II.11", short: "From Book II", book: 2, colorClass: "foundation" }
);

// Definitions
for (const d of DEFS) {
  discourse.nodes.push({
    id: `Def${d.n}`,
    type: "definition",
    label: d.full,
    shortLabel: `Def. IV.${d.n}`,
    short: d.short,
    book: 4,
    number: d.n,
    colorClass: "definition"
  });
  discourse.edges.push({ from: "BookI", to: `Def${d.n}` });
  discourse.edges.push({ from: "BookIII", to: `Def${d.n}` });
}

// Propositions
for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. IV.${prop.n}`,
    short: prop.short,
    book: 4,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n]) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

// Write JSON
const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-iv.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-iv.json");

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
  needed.add("BookI");
  needed.add("BookIII");
  needed.add("PropII11");
  for (const d of DEFS) needed.add(`Def${d.n}`);
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
                <span class="meta-item">Geometry & Topology</span>
                <span class="meta-item">Source: Euclid's Elements</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="euclid-index-link" href="#">Euclid's Elements (all books)</a>
            <a id="book-index-link" href="#">Euclid Book IV Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookIV/bookIV.html" target="_blank">Euclid's Elements Book IV (Joyce)</a>
            <a href="https://huggingface.co/spaces/garywelz/programming_framework" target="_blank">Programming Framework</a>
        </div>
        <script>
            (function() {
                const hostname = window.location.hostname;
                const backLink = document.getElementById('back-link');
                const euclidLink = document.getElementById('euclid-index-link');
                const indexLink = document.getElementById('book-index-link');
                const base = hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database'
                    : '../..';
                backLink.href = base + '/mathematics-database-table.html';
                euclidLink.href = base + '/processes/geometry_topology/geometry_topology-euclid-elements.html';
                indexLink.href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-iv.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookIV/bookIV.html" target="_blank">Euclid's Elements, Book IV</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#95a5a6"></div><div><strong>Gray</strong><br><small>Book I, Book III, Prop II.11 (foundation)</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book IV</li><li>inscribed</li><li>circumscribed</li><li>pentagon</li><li>hexagon</li>
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
  // Chart 1: Defs + Props 1-5 (triangle constructions)
  const filter1 = closure(5);
  const nodes1 = discourse.nodes.filter(filter1);
  const edges1 = discourse.edges.filter(e => filter1({ id: e.from }) && filter1({ id: e.to }));
  const m1 = toMermaid(filter1);
  const html1 = htmlTemplate(
    "Euclid's Elements Book IV — Propositions 1–5",
    "Dependency graph for definitions and propositions 1–5. Inscribe/circumscribe triangle and circle. All depend on Book I and Book III.",
    m1,
    nodes1.length,
    edges1.length
  );
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-iv-props-1-5.html"), html1, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-iv-props-1-5.html");

  // Chart 2: Props 6-16 (square, pentagon, hexagon, 15-gon)
  const filter2 = () => true;
  const m2 = toMermaid(filter2);
  const html2 = htmlTemplate(
    "Euclid's Elements Book IV — Propositions 6–16",
    "Dependency graph for propositions 6–16. Square, pentagon (IV.10 uses Prop II.11), hexagon, 15-gon. IV.11←IV.2,IV.10; IV.16←IV.1,IV.2,IV.11.",
    m2,
    discourse.nodes.length,
    discourse.edges.length
  );
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-iv-props-6-16.html"), html2, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-iv-props-6-16.html");
} else {
  console.log("MATH_DB not found at", GEOM_DIR, "- skipping HTML generation.");
}

// Book IV index page
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book IV - Mathematics Process</title>
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
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookIV/bookIV.html" target="_blank">Euclid's Elements Book IV (Joyce)</a>
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
        <h1>Euclid's Elements Book IV</h1>
        <p>Inscribed and circumscribed figures: triangle, square, pentagon, hexagon, 15-gon. All depend on Books I and III. Prop IV.10 uses Prop II.11 (golden section). Dependency charts split into two views.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-iv-props-1-5.html">Propositions 1–5 <span class="chart-meta">Defs + triangle, circle</span></a>
            <a href="geometry_topology-euclid-elements-book-iv-props-6-16.html">Propositions 6–16 <span class="chart-meta">Square, pentagon, hexagon, 15-gon</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-iv.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-iv.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
