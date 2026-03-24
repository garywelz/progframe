#!/usr/bin/env node
/**
 * Build Euclid's Elements Book XI discourse JSON and Mermaid charts.
 * 28 definitions, 39 propositions. Solid geometry: planes, parallelepipeds, prisms.
 * Depends on Books I and VI. Source: David E. Joyce.
 *
 * Charts: 3. Props 1-13, 14-26, 27-39.
 */

const fs = require('fs');
const path = require('path');

const PROPS = [
  { n: 1, short: "Line part in plane", full: "A part of a straight line cannot be in one plane and part in another elevated" },
  { n: 2, short: "Two lines cut: one plane", full: "If two straight lines cut one another, they lie in one plane; every triangle in one plane" },
  { n: 3, short: "Planes cut: line", full: "If two planes cut one another, their intersection is a straight line" },
  { n: 4, short: "Line perpendicular to plane", full: "If line at right angles to two lines cutting at point, also perpendicular to plane through them" },
  { n: 5, short: "Three lines from point", full: "If line at right angles to three lines meeting at point, the three lie in one plane" },
  { n: 6, short: "Perpendicular to same plane: parallel", full: "If two lines at right angles to same plane, they are parallel" },
  { n: 7, short: "Parallel lines: join in plane", full: "If two lines parallel, line joining points on each is in same plane" },
  { n: 8, short: "Parallel: one perpendicular", full: "If two lines parallel, one perpendicular to plane, so is the other" },
  { n: 9, short: "Parallel to same: parallel", full: "Lines parallel to same line but not in same plane are parallel to each other" },
  { n: 10, short: "Skew lines: equal angles", full: "Two lines meeting parallel to two meeting not in same plane: contain equal angles" },
  { n: 11, short: "Perpendicular from point to plane", full: "To draw line perpendicular to given plane from given elevated point" },
  { n: 12, short: "Perpendicular from point in plane", full: "To set up line at right angles to plane from given point in it" },
  { n: 13, short: "One perpendicular only", full: "From same point two lines cannot be perpendicular to same plane on same side" },
  { n: 14, short: "Planes perpendicular to line: parallel", full: "Planes to which same line is perpendicular are parallel" },
  { n: 15, short: "Skew lines: planes parallel", full: "Two lines meeting parallel to two meeting not in same plane: planes through them parallel" },
  { n: 16, short: "Parallel planes cut: parallel", full: "If two parallel planes cut by any plane, intersections are parallel" },
  { n: 17, short: "Parallel planes: same ratio", full: "If two lines cut by parallel planes, they are cut in same ratios" },
  { n: 18, short: "Line perpendicular: planes through it", full: "If line perpendicular to plane, all planes through it perpendicular to that plane" },
  { n: 19, short: "Planes perpendicular: intersection", full: "If two planes cutting one another perpendicular to plane, intersection perpendicular" },
  { n: 20, short: "Solid angle: plane angles", full: "Solid angle by three plane angles: sum of any two greater than third" },
  { n: 21, short: "Solid angle: less than four right", full: "Any solid angle contained by plane angles summing to less than four right angles" },
  { n: 22, short: "Three plane angles: construct triangle", full: "Three plane angles with sum of any two greater than third, equal sides: construct triangle" },
  { n: 23, short: "Construct solid angle", full: "To construct solid angle from three plane angles (sum of any two greater than third)" },
  { n: 24, short: "Solid by parallel planes", full: "If solid contained by parallel planes, opposite planes equal and parallelogrammic" },
  { n: 25, short: "Parallelepiped cut: base ratio", full: "Parallelepiped cut by plane parallel to opposite: base to base as solid to solid" },
  { n: 26, short: "Construct equal solid angle", full: "To construct solid angle equal to given on given line at given point" },
  { n: 27, short: "Similar parallelepiped on line", full: "To describe parallelepiped similar to given on given straight line" },
  { n: 28, short: "Parallelepiped: diagonal plane bisects", full: "Parallelepiped cut by plane through diagonals of opposite planes: bisected" },
  { n: 29, short: "Same base, height, same lines: equal", full: "Parallelepipeds same base, height, ends on same lines: equal" },
  { n: 30, short: "Same base, height, different lines: equal", full: "Parallelepipeds same base, height, ends not on same lines: equal" },
  { n: 31, short: "Equal bases, same height: equal", full: "Parallelepipeds on equal bases, same height: equal" },
  { n: 32, short: "Same height: as bases", full: "Parallelepipeds same height: to one another as bases" },
  { n: 33, short: "Similar: triplicate ratio", full: "Similar parallelepipeds: to one another in triplicate ratio of corresponding sides" },
  { n: 34, short: "Equal: bases reciprocally proportional", full: "Equal parallelepipeds: bases reciprocally proportional to heights" },
  { n: 35, short: "Equal plane angles: elevated lines", full: "Equal plane angles, elevated lines with equal angles: perpendiculars, joins" },
  { n: 36, short: "Three proportional: parallelepiped", full: "Three proportional lines: parallelepiped from three equals that on mean equilateral" },
  { n: 37, short: "Four proportional: parallelepipeds", full: "Four proportional: similar parallelepipeds proportional; converse" },
  { n: 38, short: "Cube: bisected by planes", full: "Cube opposite sides bisected, planes through: intersection and diameter bisect each other" },
  { n: 39, short: "Prisms: parallelogram, triangle", full: "Two prisms equal height, parallelogram and triangle bases, parallelogram double: equal" }
];

const FOUNDATIONS = ["BookI", "BookVI"];
const DEPS = {};
for (let i = 1; i <= 39; i++) DEPS[i] = FOUNDATIONS;

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-xi",
    name: "Euclid's Elements, Book XI",
    subject: "solid_geometry",
    variant: "classical",
    description: "Solid geometry: planes, perpendiculars, parallelepipeds, prisms. 28 definitions, 39 propositions. Depends on Books I and VI. Source: David E. Joyce.",
    structure: { books: 11, definitions: 28, propositions: 39, foundationTypes: ["foundation"] }
  },
  metadata: {
    created: "2026-03-18",
    lastUpdated: "2026-03-18",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book XI Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book XI", "solid geometry", "plane", "parallelepiped", "prism"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book XI", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookXI/bookXI.html", notes: "Clark University" }
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
  { id: "BookVI", type: "foundation", label: "Book VI — Similar figures", shortLabel: "Book VI", short: "Foundation", book: 6, colorClass: "foundation" }
);

for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. XI.${prop.n}`,
    short: prop.short,
    book: 11,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n]) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-xi.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-xi.json");

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
                <span class="meta-item">Solid Geometry</span>
                <span class="meta-item">Source: Euclid's Elements</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="euclid-index-link" href="#">Euclid's Elements (all books)</a>
            <a id="book-index-link" href="#">Euclid Book XI Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookXI/bookXI.html" target="_blank">Euclid's Elements Book XI (Joyce)</a>
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
                document.getElementById('book-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-xi.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookXI/bookXI.html" target="_blank">Euclid's Elements, Book XI</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#95a5a6"></div><div><strong>Gray</strong><br><small>Book I, VI (foundation)</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book XI</li><li>solid geometry</li><li>plane</li><li>parallelepiped</li><li>prism</li>
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
  [13, "1-13", "Planes, perpendiculars, parallel lines"],
  [26, "14-26", "Parallel planes, solid angles, parallelepipeds"],
  [39, "27-39", "Parallelepiped ratios, prisms"]
];

if (fs.existsSync(GEOM_DIR)) {
  CHARTS.forEach(([max, range, desc]) => {
    const filter = closure(max);
    const m = toMermaid(filter);
    const nodes = discourse.nodes.filter(filter);
    const edges = discourse.edges.filter(e => filter({ id: e.from }) && filter({ id: e.to }));
    const fname = `geometry_topology-euclid-elements-book-xi-props-${range.replace(/–/g, "-").replace(" ", "-")}.html`;
    fs.writeFileSync(path.join(GEOM_DIR, fname), htmlTemplate(`Euclid's Elements Book XI — Propositions ${range}`, desc, m, nodes.length, edges.length), "utf8");
    console.log("Wrote", fname);
  });
}

// Book XI index
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book XI - Mathematics Process</title>
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
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookXI/bookXI.html" target="_blank">Euclid's Elements Book XI (Joyce)</a>
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
        <h1>Euclid's Elements Book XI</h1>
        <p>Solid geometry: planes, perpendiculars, parallelepipeds, prisms. 39 propositions, 28 definitions. Depends on Books I and VI.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-xi-props-1-13.html">Propositions 1–13 <span class="chart-meta">Planes, perpendiculars, parallel lines</span></a>
            <a href="geometry_topology-euclid-elements-book-xi-props-14-26.html">Propositions 14–26 <span class="chart-meta">Parallel planes, solid angles, parallelepipeds</span></a>
            <a href="geometry_topology-euclid-elements-book-xi-props-27-39.html">Propositions 27–39 <span class="chart-meta">Parallelepiped ratios, prisms</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-xi.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-xi.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
