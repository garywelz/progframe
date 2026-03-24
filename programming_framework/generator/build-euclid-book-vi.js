#!/usr/bin/env node
/**
 * Build Euclid's Elements Book VI discourse JSON and Mermaid charts.
 * 4 definitions, 33 propositions. Similar figures. Depends on Book I and Book V.
 * VI.1 is basis for most of Book VI; VI.33 uses proportion def directly. Source: David E. Joyce.
 *
 * Charts: 3. Chart 1: Defs + Props 1-11. Chart 2: Props 12-22. Chart 3: Props 23-33.
 */

const fs = require('fs');
const path = require('path');

const DEFS = [
  { n: 1, short: "Similar rectilinear", full: "Similar rectilinear figures have equal angles and proportional sides" },
  { n: 2, short: "Reciprocally proportional", full: "Figures reciprocally proportional when sides are proportional inversely" },
  { n: 3, short: "Mean proportional", full: "Straight line is mean proportional when first to it as it to third" },
  { n: 4, short: "Duplicate ratio", full: "Duplicate ratio is the ratio of the squares on corresponding sides" }
];

const PROPS = [
  { n: 1, short: "Triangles under same height", full: "Triangles and parallelograms under same height are as their bases" },
  { n: 2, short: "Parallel cuts sides proportionally", full: "Line parallel to side cuts sides proportionally; converse" },
  { n: 3, short: "Angle bisector divides base", full: "Angle bisector: segments of base proportionally as remaining sides" },
  { n: 4, short: "Equiangular: sides proportional", full: "Equiangular triangles: sides about equal angles proportional" },
  { n: 5, short: "Sides proportional: equiangular", full: "If sides proportional, triangles equiangular" },
  { n: 6, short: "One angle equal, sides proportional", full: "One angle equal, sides about it proportional: equiangular" },
  { n: 7, short: "One angle equal, other sides proportional", full: "One angle equal, sides about others proportional: equiangular" },
  { n: 8, short: "Altitude in right triangle", full: "Perpendicular from right angle: triangles similar to whole" },
  { n: 9, short: "Cut off prescribed part", full: "To cut off a prescribed part from a given straight line" },
  { n: 10, short: "Cut line similarly", full: "To cut a given line similarly to a given cut line" },
  { n: 11, short: "Third proportional", full: "To find a third proportional to two given lines" },
  { n: 12, short: "Fourth proportional", full: "To find a fourth proportional to three given lines" },
  { n: 13, short: "Mean proportional", full: "To find a mean proportional to two given lines" },
  { n: 14, short: "Parallelograms reciprocally proportional", full: "Equal equiangular parallelograms: sides reciprocally proportional" },
  { n: 15, short: "Triangles reciprocally proportional", full: "Equal triangles, one angle equal: sides reciprocally proportional" },
  { n: 16, short: "Four lines proportional: rectangle", full: "Four lines proportional iff rectangle extremes = rectangle means" },
  { n: 17, short: "Three lines proportional: rectangle", full: "Three lines proportional iff rectangle extremes = square on mean" },
  { n: 18, short: "Similar figure on given line", full: "To describe figure similar to given on given line" },
  { n: 19, short: "Similar triangles: duplicate ratio", full: "Similar triangles in duplicate ratio of corresponding sides" },
  { n: 20, short: "Similar polygons: duplicate ratio", full: "Similar polygons in duplicate ratio of corresponding sides" },
  { n: 21, short: "Similar to same: similar", full: "Figures similar to same rectilinear figure are similar" },
  { n: 22, short: "Four lines proportional: figures", full: "Four lines proportional iff similar figures on them proportional" },
  { n: 23, short: "Equiangular parallelograms: compound ratio", full: "Equiangular parallelograms: ratio compounded of sides" },
  { n: 24, short: "Parallelograms about diameter", full: "Parallelograms about diameter similar to whole" },
  { n: 25, short: "Similar and equal to another", full: "To construct figure similar to one and equal to another" },
  { n: 26, short: "Parallelogram similar to difference", full: "Parallelogram similar to whole, common angle: about same diameter" },
  { n: 27, short: "Greatest parallelogram applied", full: "Of parallelograms applied to line, greatest is on half" },
  { n: 28, short: "Apply parallelogram: deficient", full: "To apply parallelogram equal to figure, deficient by similar" },
  { n: 29, short: "Apply parallelogram: exceeding", full: "To apply parallelogram equal to figure, exceeding by similar" },
  { n: 30, short: "Extreme and mean ratio", full: "To cut a given line in extreme and mean ratio" },
  { n: 31, short: "Right triangle: similar figures", full: "In right triangle, figure on hypotenuse = sum of similar on sides" },
  { n: 32, short: "Two triangles: sides parallel", full: "Two triangles, two sides proportional, placed with parallel sides" },
  { n: 33, short: "Angles in circles: ratio of arcs", full: "Angles in equal circles have ratio of circumferences" }
];

// VI.1 uses I.3, I.38, I.41, V.Def.5, V.15, V.11. VI.1 is basis for most. VI.33 uses proportion def.
const DEPS = {
  1: ["BookI", "BookV"],
  2: ["BookI", "BookV", "Prop1"],
  3: ["BookI", "BookV", "Prop1"],
  4: ["BookI", "BookV", "Prop1"],
  5: ["BookI", "BookV", "Prop1"],
  6: ["BookI", "BookV", "Prop1"],
  7: ["BookI", "BookV", "Prop1"],
  8: ["BookI", "BookV", "Prop1"],
  9: ["BookI", "BookV", "Prop1"],
  10: ["BookI", "BookV", "Prop1"],
  11: ["BookI", "BookV", "Prop1"],
  12: ["BookI", "BookV", "Prop1"],
  13: ["BookI", "BookV", "Prop1"],
  14: ["BookI", "BookV", "Prop1"],
  15: ["BookI", "BookV", "Prop1"],
  16: ["BookI", "BookV", "Prop1"],
  17: ["BookI", "BookV", "Prop1"],
  18: ["BookI", "BookV", "Prop1"],
  19: ["BookI", "BookV", "Prop1"],
  20: ["BookI", "BookV", "Prop1"],
  21: ["BookI", "BookV", "Prop1"],
  22: ["BookI", "BookV", "Prop1"],
  23: ["BookI", "BookV", "Prop1"],
  24: ["BookI", "BookV", "Prop1"],
  25: ["BookI", "BookV", "Prop1"],
  26: ["BookI", "BookV", "Prop1"],
  27: ["BookI", "BookV", "Prop1"],
  28: ["BookI", "BookV", "Prop1"],
  29: ["BookI", "BookV", "Prop1"],
  30: ["BookI", "BookV", "Prop1"],
  31: ["BookI", "BookV", "Prop1"],
  32: ["BookI", "BookV", "Prop1"],
  33: ["BookI", "BookV"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-vi",
    name: "Euclid's Elements, Book VI",
    subject: "geometry",
    variant: "classical",
    description: "Similar figures. 4 definitions, 33 propositions. Depends on Book I and Book V. VI.1 is basis for most. Source: David E. Joyce.",
    structure: { books: 6, definitions: 4, propositions: 33, foundationTypes: ["definition", "foundation"] }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book VI Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book VI", "similar", "proportion", "triangles"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book VI", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookVI/bookVI.html", notes: "Clark University; VI.1 basis for most" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    foundation: { fill: "#95a5a6", stroke: "#7f8c8d" },
    definition: { fill: "#3498db", stroke: "#2980b9" },
    proposition: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

discourse.nodes.push(
  { id: "BookI", type: "foundation", label: "Book I — Fundamentals of plane geometry", shortLabel: "Book I", short: "Foundation", book: 1, colorClass: "foundation" },
  { id: "BookV", type: "foundation", label: "Book V — Theory of proportions", shortLabel: "Book V", short: "Foundation", book: 5, colorClass: "foundation" }
);

for (const d of DEFS) {
  discourse.nodes.push({
    id: `Def${d.n}`,
    type: "definition",
    label: d.full,
    shortLabel: `Def. VI.${d.n}`,
    short: d.short,
    book: 6,
    number: d.n,
    colorClass: "definition"
  });
  discourse.edges.push({ from: "BookI", to: `Def${d.n}` });
  discourse.edges.push({ from: "BookV", to: `Def${d.n}` });
}

for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. VI.${prop.n}`,
    short: prop.short,
    book: 6,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n]) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-vi.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-vi.json");

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
  needed.add("BookV");
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
            <a id="book-index-link" href="#">Euclid Book VI Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVI/bookVI.html" target="_blank">Euclid's Elements Book VI (Joyce)</a>
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
                document.getElementById('book-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-vi.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVI/bookVI.html" target="_blank">Euclid's Elements, Book VI</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#95a5a6"></div><div><strong>Gray</strong><br><small>Book I, Book V (foundation)</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book VI</li><li>similar</li><li>proportion</li><li>triangles</li>
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
  const filter1 = closure(11);
  const m1 = toMermaid(filter1);
  const nodes1 = discourse.nodes.filter(filter1);
  const edges1 = discourse.edges.filter(e => filter1({ id: e.from }) && filter1({ id: e.to }));
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-vi-props-1-11.html"), htmlTemplate("Euclid's Elements Book VI — Propositions 1–11", "Similar triangles: same height, parallel cuts, equiangular, third proportional. VI.1 is basis. Depends on Book I and Book V.", m1, nodes1.length, edges1.length), "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-vi-props-1-11.html");

  const filter2 = closure(22);
  const m2 = toMermaid(filter2);
  const nodes2 = discourse.nodes.filter(filter2);
  const edges2 = discourse.edges.filter(e => filter2({ id: e.from }) && filter2({ id: e.to }));
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-vi-props-12-22.html"), htmlTemplate("Euclid's Elements Book VI — Propositions 12–22", "Fourth proportional, reciprocally proportional, similar figures on lines, duplicate ratio.", m2, nodes2.length, edges2.length), "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-vi-props-12-22.html");

  const m3 = toMermaid(() => true);
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-vi-props-23-33.html"), htmlTemplate("Euclid's Elements Book VI — Propositions 23–33", "Compound ratio, parallelograms about diameter, application of areas, extreme and mean ratio, angles in circles.", m3, discourse.nodes.length, discourse.edges.length), "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-vi-props-23-33.html");
}

// Book VI index
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book VI - Mathematics Process</title>
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
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVI/bookVI.html" target="_blank">Euclid's Elements Book VI (Joyce)</a>
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
        <h1>Euclid's Elements Book VI</h1>
        <p>Similar figures. 4 definitions, 33 propositions. Depends on Book I and Book V. VI.1 (triangles under same height) is basis for most. VI.33 uses proportion def directly.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-vi-props-1-11.html">Propositions 1–11 <span class="chart-meta">Similar triangles, proportionals</span></a>
            <a href="geometry_topology-euclid-elements-book-vi-props-12-22.html">Propositions 12–22 <span class="chart-meta">Reciprocally proportional, duplicate ratio</span></a>
            <a href="geometry_topology-euclid-elements-book-vi-props-23-33.html">Propositions 23–33 <span class="chart-meta">Application of areas, extreme and mean ratio</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-vi.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-vi.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
