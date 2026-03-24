#!/usr/bin/env node
/**
 * Build Euclid's Elements Book I discourse JSON and Mermaid.
 * Dependencies from David E. Joyce, Clark University:
 * https://mathcs.clarku.edu/~djoyce/java/elements/bookI/bookI.html
 */

const fs = require('fs');
const path = require('path');

const PROPOSITIONS = [
  { n: 1, short: "Equilateral triangle on given line", full: "To construct an equilateral triangle on a given finite straight line" },
  { n: 2, short: "Place line equal to given at point", full: "To place a straight line equal to a given straight line with one end at a given point" },
  { n: 3, short: "Cut off from greater segment equal to less", full: "To cut off from the greater of two given unequal straight lines a straight line equal to the less" },
  { n: 4, short: "SAS congruence", full: "If two triangles have two sides equal to two sides respectively, and the angles contained equal, then bases and remaining angles equal" },
  { n: 5, short: "Base angles of isosceles equal", full: "In isosceles triangles the angles at the base equal one another" },
  { n: 6, short: "Sides opposite equal angles equal", full: "If in a triangle two angles equal one another, then the sides opposite the equal angles also equal one another" },
  { n: 7, short: "Uniqueness of triangle from ends", full: "Given two lines from ends of a line meeting at a point, no other such pair from same ends on same side" },
  { n: 8, short: "SSS congruence", full: "If two triangles have two sides equal to two sides respectively, and the base equal to the base, then the angles contained are equal" },
  { n: 9, short: "Bisect angle", full: "To bisect a given rectilinear angle" },
  { n: 10, short: "Bisect line", full: "To bisect a given finite straight line" },
  { n: 11, short: "Perpendicular from point on line", full: "To draw a straight line at right angles to a given straight line from a given point on it" },
  { n: 12, short: "Perpendicular from point not on line", full: "To draw a straight line perpendicular to a given infinite straight line from a given point not on it" },
  { n: 13, short: "Angles on line sum to two right", full: "If a straight line stands on a straight line, it makes either two right angles or angles whose sum equals two right angles" },
  { n: 14, short: "If angles sum to two right, straight line", full: "If with any straight line, at a point, two lines not on same side make adjacent angles equal to two right, they are in a straight line" },
  { n: 15, short: "Vertical angles equal", full: "If two straight lines cut one another, they make the vertical angles equal to one another" },
  { n: 16, short: "Exterior angle > interior opposite", full: "In any triangle, if one side is produced, the exterior angle is greater than either interior opposite angle" },
  { n: 17, short: "Sum of two angles < two right", full: "In any triangle the sum of any two angles is less than two right angles" },
  { n: 18, short: "Angle opposite greater side greater", full: "In any triangle the angle opposite the greater side is greater" },
  { n: 19, short: "Side opposite greater angle greater", full: "In any triangle the side opposite the greater angle is greater" },
  { n: 20, short: "Triangle inequality", full: "In any triangle the sum of any two sides is greater than the remaining one" },
  { n: 21, short: "Lines from ends within triangle", full: "If from ends of one side two lines meet within the triangle, their sum < sum of other two sides" },
  { n: 22, short: "Construct triangle from three lines", full: "To construct a triangle out of three straight lines which equal three given straight lines" },
  { n: 23, short: "Construct angle equal to given", full: "To construct a rectilinear angle equal to a given rectilinear angle on a given straight line" },
  { n: 24, short: "SAS for greater angle => greater base", full: "If two triangles have two sides equal but one contained angle greater, the base is greater" },
  { n: 25, short: "SAS for greater base => greater angle", full: "If two triangles have two sides equal but base greater, the contained angle is greater" },
  { n: 26, short: "AAS congruence", full: "If two triangles have two angles equal and one side equal, the remaining sides and angle equal" },
  { n: 27, short: "Alternate angles equal => parallel", full: "If a line falling on two lines makes alternate angles equal, the lines are parallel" },
  { n: 28, short: "Exterior = interior opposite => parallel", full: "If exterior angle equals interior opposite, or interior same-side sum to two right, lines parallel" },
  { n: 29, short: "Parallel => alternate angles equal", full: "A line falling on parallel lines makes alternate angles equal, exterior = interior opposite" },
  { n: 30, short: "Transitivity of parallel", full: "Straight lines parallel to the same straight line are also parallel to one another" },
  { n: 31, short: "Draw parallel through point", full: "To draw a straight line through a given point parallel to a given straight line" },
  { n: 32, short: "Exterior angle = sum interior opposite", full: "In any triangle, exterior angle equals sum of two interior opposite; three angles = two right" },
  { n: 33, short: "Joining ends of equal parallel lines", full: "Straight lines which join the ends of equal and parallel straight lines in same directions are equal and parallel" },
  { n: 34, short: "Parallelogram properties", full: "In parallelogrammic areas the opposite sides and angles equal one another, diameter bisects" },
  { n: 35, short: "Parallelograms same base equal", full: "Parallelograms which are on the same base and in the same parallels equal one another" },
  { n: 36, short: "Parallelograms equal bases equal", full: "Parallelograms which are on equal bases and in the same parallels equal one another" },
  { n: 37, short: "Triangles same base equal", full: "Triangles which are on the same base and in the same parallels equal one another" },
  { n: 38, short: "Triangles equal bases equal", full: "Triangles which are on equal bases and in the same parallels equal one another" },
  { n: 39, short: "Equal triangles same base same side", full: "Equal triangles on same base and same side are in the same parallels" },
  { n: 40, short: "Equal triangles equal bases same side", full: "Equal triangles on equal bases and same side are in the same parallels" },
  { n: 41, short: "Parallelogram = 2× triangle", full: "If a parallelogram has same base with triangle and same parallels, parallelogram is double the triangle" },
  { n: 42, short: "Construct parallelogram = triangle", full: "To construct a parallelogram equal to a given triangle in a given rectilinear angle" },
  { n: 43, short: "Complements of parallelogram", full: "In any parallelogram the complements of the parallelograms about the diameter equal one another" },
  { n: 44, short: "Apply parallelogram to line", full: "To a given straight line in a given angle, to apply a parallelogram equal to a given triangle" },
  { n: 45, short: "Construct parallelogram = rectilinear figure", full: "To construct a parallelogram equal to a given rectilinear figure in a given rectilinear angle" },
  { n: 46, short: "Construct square on line", full: "To describe a square on a given straight line" },
  { n: 47, short: "Pythagorean theorem", full: "In right-angled triangles the square on the side opposite the right angle equals the sum of the squares on the sides containing the right angle" },
  { n: 48, short: "Converse Pythagorean", full: "If in a triangle the square on one side equals the sum of squares on the other two, the angle contained by those sides is right" }
];

// Joyce dependency table: { prop: [deps] }
const DEPS = {
  1: ["P1", "P3"],
  2: ["Prop1", "P1", "P2", "P3"],
  3: ["Prop2", "P3"],
  4: ["CN4", "CN5"],
  5: ["Prop3", "Prop4"],
  6: ["Prop3", "Prop4"],
  7: ["Prop5"],
  8: ["Prop7"],
  9: ["Prop1", "Prop3", "Prop8"],
  10: ["Prop1", "Prop4", "Prop9"],
  11: ["Prop1", "Prop3", "Prop8"],
  12: ["Prop8", "Prop10"],
  13: ["Prop11"],
  14: ["Prop13"],
  15: ["Prop13"],
  16: ["Prop3", "Prop4", "Prop10", "Prop15"],
  17: ["Prop13", "Prop16"],
  18: ["Prop3", "Prop5", "Prop16"],
  19: ["Prop5", "Prop18"],
  20: ["Prop3", "Prop5", "Prop19"],
  21: ["Prop16", "Prop20"],
  22: ["Prop3", "Prop20"],
  23: ["Prop8", "Prop22"],
  24: ["Prop3", "Prop4", "Prop5", "Prop19", "Prop23"],
  25: ["Prop4", "Prop24"],
  26: ["Prop3", "Prop4", "Prop16"],
  27: ["Prop16"],
  28: ["Prop13", "Prop15", "Prop27"],
  29: ["Prop13", "Prop15", "Prop27", "P5"],
  30: ["Prop29"],
  31: ["Prop23", "Prop27"],
  32: ["Prop13", "Prop29", "Prop31"],
  33: ["Prop4", "Prop27", "Prop29"],
  34: ["Prop4", "Prop26", "Prop29"],
  35: ["Prop4", "Prop29", "Prop34"],
  36: ["Prop33", "Prop34", "Prop35"],
  37: ["Prop31", "Prop34", "Prop35"],
  38: ["Prop31", "Prop34", "Prop36"],
  39: ["Prop31", "Prop37"],
  40: ["Prop31", "Prop38"],
  41: ["Prop34", "Prop37"],
  42: ["Prop10", "Prop23", "Prop31", "Prop38", "Prop41"],
  43: ["Prop34"],
  44: ["Prop15", "Prop29", "Prop31", "Prop42", "Prop43"],
  45: ["Prop14", "Prop29", "Prop30", "Prop33", "Prop34", "Prop42", "Prop44"],
  46: ["Prop3", "Prop11", "Prop29", "Prop31", "Prop34"],
  47: ["Prop4", "Prop14", "Prop31", "Prop41", "Prop46"],
  48: ["Prop3", "Prop8", "Prop11", "Prop47"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-i",
    name: "Euclid's Elements, Book I",
    subject: "geometry",
    variant: "classical",
    description: "The 48 propositions of Book I with dependencies on postulates (P1–P5), common notions (CN1–CN5), and prior propositions. Source: David E. Joyce, Clark University.",
    structure: { books: 1, propositions: 48, foundationTypes: ["postulate", "commonNotion"] }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book I Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book I", "plane geometry", "constructions", "Pythagorean theorem"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book I", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookI/bookI.html", notes: "Clark University; dependency table from Guide" },
    { id: "euclid-heath", type: "primary", authors: "Heath, T.L.", title: "The Thirteen Books of Euclid's Elements", year: "1908", edition: "2nd", publisher: "Cambridge University Press", url: "https://archive.org/details/euclidheath00heatiala", notes: "Standard English translation" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    postulate: { fill: "#e74c3c", stroke: "#c0392b" },
    commonNotion: { fill: "#9b59b6", stroke: "#8e44ad" },
    proposition: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

// Add postulates and common notions
const postulates = [
  { id: "P1", label: "Draw a straight line from any point to any point", shortLabel: "Post. 1" },
  { id: "P2", label: "Produce a finite straight line continuously in a straight line", shortLabel: "Post. 2" },
  { id: "P3", label: "Describe a circle with any center and radius", shortLabel: "Post. 3" },
  { id: "P4", label: "All right angles equal one another", shortLabel: "Post. 4" },
  { id: "P5", label: "Parallel postulate: if interior angles < two right, lines meet", shortLabel: "Post. 5" }
];
const commonNotions = [
  { id: "CN1", label: "Things equal to the same thing are equal to each other", shortLabel: "CN 1" },
  { id: "CN2", label: "If equals are added to equals, the wholes are equal", shortLabel: "CN 2" },
  { id: "CN3", label: "If equals are subtracted from equals, the remainders are equal", shortLabel: "CN 3" },
  { id: "CN4", label: "Things coinciding with one another are equal", shortLabel: "CN 4" },
  { id: "CN5", label: "The whole is greater than the part", shortLabel: "CN 5" }
];

for (const p of postulates) {
  discourse.nodes.push({ id: p.id, type: "postulate", label: p.label, shortLabel: p.shortLabel, book: 1, number: parseInt(p.id.slice(1)), colorClass: "postulate" });
}
for (const c of commonNotions) {
  discourse.nodes.push({ id: c.id, type: "commonNotion", label: c.label, shortLabel: c.shortLabel, book: 1, number: parseInt(c.id.slice(2)), colorClass: "commonNotion" });
}

// Add propositions
for (const prop of PROPOSITIONS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. I.${prop.n}`,
    short: prop.short,
    book: 1,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n] || []) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

// Write JSON
const dataDir = path.join(__dirname, "..", "data");
const outPath = path.join(dataDir, "euclid-elements-book-i.json");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote", outPath);

// Generate Mermaid (full graph - may be large)
function toMermaid(filter) {
  const nodes = filter ? discourse.nodes.filter(filter) : discourse.nodes;
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = discourse.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  const lines = ["graph TD"];
  for (const n of nodes) {
    const desc = n.short || (n.label.length > 35 ? n.label.slice(0, 32) + "..." : n.label);
    const lbl = (n.shortLabel || n.id) + "\\n" + desc;
    lines.push(`    ${n.id}["${lbl.replace(/"/g, '\\"')}"]`);
  }
  for (const e of edges) {
    lines.push(`    ${e.from} --> ${e.to}`);
  }
  lines.push("    classDef postulate fill:#e74c3c,color:#fff,stroke:#c0392b");
  lines.push("    classDef commonNotion fill:#9b59b6,color:#fff,stroke:#8e44ad");
  lines.push("    classDef proposition fill:#1abc9c,color:#fff,stroke:#16a085");
  const postIds = nodes.filter(n => n.type === "postulate").map(n => n.id).join(",");
  const cnIds = nodes.filter(n => n.type === "commonNotion").map(n => n.id).join(",");
  const propIds = nodes.filter(n => n.type === "proposition").map(n => n.id).join(",");
  lines.push(`    class ${postIds} postulate`);
  lines.push(`    class ${cnIds} commonNotion`);
  lines.push(`    class ${propIds} proposition`);
  return lines.join("\n");
}

// Full graph
const fullMermaid = toMermaid();
const mermaidPath = path.join(dataDir, "euclid-elements-book-i.mmd");
fs.writeFileSync(mermaidPath, fullMermaid, "utf8");
console.log("Wrote", mermaidPath);

// Subgraphs: include foundations + props in range + all their dependencies (transitive)
function closure(propMin, propMax) {
  const needed = new Set();
  for (let i = propMin; i <= propMax; i++) needed.add(`Prop${i}`);
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
const subgraphData = [];
const sections = [
  { name: "props-1-10", min: 1, max: 10, title: "Propositions 1–10", desc: "Foundations, SAS, SSS, bisections, perpendiculars" },
  { name: "props-11-20", min: 11, max: 20, title: "Propositions 11–20", desc: "Right angles, straight lines, vertical angles, triangle exterior, triangle inequality" },
  { name: "props-21-30", min: 21, max: 30, title: "Propositions 21–30", desc: "Lines within triangle, construct triangle/angle, parallel lines" },
  { name: "props-31-41", min: 31, max: 41, title: "Propositions 31–41", desc: "Parallelograms, triangles, areas" },
  { name: "props-42-48", min: 42, max: 48, title: "Propositions 42–48", desc: "Constructions, Pythagorean theorem" }
];
for (const s of sections) {
  const { mermaid: sub, nodes: n, edges: e } = toMermaidWithCounts(closure(s.min, s.max));
  subgraphData.push({ ...s, mermaid: sub, nodes: n, edges: e });
  const subPath = path.join(dataDir, `euclid-elements-book-i-${s.name}.mmd`);
  fs.writeFileSync(subPath, sub, "utf8");
  console.log("Wrote", subPath);
}

// Generate HTML pages for Mathematics Processes Database
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
        .mermaid { background: white; padding: 20px; border-radius: 10px; border: 1px solid #ecf0f1; overflow-x: hidden; overflow-y: auto; min-height: 600px; max-width: 100%; }
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
            <a id="book-index-link" href="#">Euclid Book I Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookI/bookI.html" target="_blank">Euclid's Elements Book I (Joyce)</a>
            <a href="https://huggingface.co/spaces/garywelz/programming_framework" target="_blank">Programming Framework</a>
        </div>
        <script>
            (function() {
                const hostname = window.location.hostname;
                const backLink = document.getElementById('back-link');
                const indexLink = document.getElementById('book-index-link');
                const base = hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database'
                    : '../..';
                backLink.href = base + '/mathematics-database-table.html';
                indexLink.href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-i.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookI/bookI.html" target="_blank">Euclid's Elements, Book I</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <p class="flowchart-note" style="font-size:0.9rem;color:#7f8c8d;margin-bottom:12px;"><strong>Note:</strong> Arrows mean &quot;depends on&quot; (tail → head). Edge crossing can create illusions of connections between adjacent nodes—e.g., I.47 and I.40 have no direct dependency; both depend on I.31 among others.</p>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#e74c3c"></div><div><strong>Red</strong><br><small>Postulates</small></div></div>
                    <div class="color-item"><div class="color-box" style="background:#9b59b6"></div><div><strong>Purple</strong><br><small>Common Notions</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book I</li><li>axioms</li><li>postulates</li><li>propositions</li><li>geometry</li><li>Pythagorean theorem</li>
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

if (fs.existsSync(GEOM_DIR)) {
  for (const d of subgraphData) {
    const html = htmlTemplate(
      `Euclid's Elements Book I — ${d.title}`,
      `Dependency graph for ${d.title} of Euclid's Elements Book I. ${d.desc}. Shows how propositions depend on postulates (P1–P5), common notions (CN1–CN5), and prior propositions.`,
      d.mermaid,
      d.nodes,
      d.edges
    );
    const fileName = "geometry_topology-euclid-elements-book-i-" + d.name;
    fs.writeFileSync(path.join(GEOM_DIR, fileName + ".html"), html, "utf8");
    console.log("Wrote", path.join(GEOM_DIR, fileName + ".html"));
  }
  // Index page
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book I - Mathematics Process</title>
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
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookI/bookI.html" target="_blank">Euclid's Elements Book I (Joyce)</a>
        </div>
        <script>
            (function() {
                const backLink = document.getElementById('back-link');
                backLink.href = window.location.hostname.includes('storage.googleapis.com')
                    ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html'
                    : '../../mathematics-database-table.html';
            })();
        </script>
        <h1>Euclid's Elements, Book I</h1>
        <p>Full dependency graph of all 48 propositions. Dependencies from David E. Joyce, Clark University. Split into five views for clarity.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-i-props-1-10.html">Propositions 1–10 — Foundations, SAS, SSS, bisections, perpendiculars</a>
            <a href="geometry_topology-euclid-elements-book-i-props-11-20.html">Propositions 11–20 — Right angles, straight lines, vertical angles, triangle exterior, triangle inequality</a>
            <a href="geometry_topology-euclid-elements-book-i-props-21-30.html">Propositions 21–30 — Lines within triangle, construct triangle/angle, parallel lines</a>
            <a href="geometry_topology-euclid-elements-book-i-props-31-41.html">Propositions 31–41 — Parallelograms, triangles, areas</a>
            <a href="geometry_topology-euclid-elements-book-i-props-42-48.html">Propositions 42–48 — Constructions, Pythagorean theorem</a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-i.html"), indexHtml, "utf8");
  console.log("Wrote", path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-i.html"));
} else {
  console.log("MATH_DB not found at", GEOM_DIR, "- skipping HTML generation. Set MATH_DB or ensure copernicus-web-public is available.");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
