#!/usr/bin/env node
/**
 * Build Euclid's Elements Book III discourse JSON and Mermaid charts.
 * 11 definitions, 37 propositions. All depend on Book I. III.35 uses II.5, I.47.
 * Source: David E. Joyce, Clark University.
 *
 * Charts: ~16 nodes each. Chart 1: Defs + Props 1-5. Chart 2: Props 6-20. Chart 3: Props 21-37.
 */

const fs = require('fs');
const path = require('path');

const DEFS = [
  { n: 1, short: "Equal circles", full: "Equal circles are those with equal radii" },
  { n: 2, short: "Tangent", full: "A straight line touches a circle if it meets but does not cut it" },
  { n: 3, short: "Circles touching", full: "Circles touch one another if they meet but do not cut" },
  { n: 4, short: "Equally distant from center", full: "Lines equally distant from center when perpendiculars from center equal" },
  { n: 5, short: "Greater distance", full: "Greater distance when greater perpendicular falls" },
  { n: 6, short: "Segment of circle", full: "Segment of circle: figure contained by straight line and circumference" },
  { n: 7, short: "Angle of segment", full: "Angle of segment: contained by straight line and circumference" },
  { n: 8, short: "Angle in segment", full: "Angle in segment: contained by straight lines joining circumference" },
  { n: 9, short: "Angle stands on circumference", full: "Angle stands on circumference when lines cut off that circumference" },
  { n: 10, short: "Sector", full: "Sector: figure contained by two radii and circumference between them" },
  { n: 11, short: "Similar segments", full: "Similar segments are those which admit equal angles" }
];

const PROPS = [
  { n: 1, short: "Find center of circle", full: "To find the center of a given circle" },
  { n: 2, short: "Chord falls within circle", full: "Straight line joining two points on circumference falls within circle" },
  { n: 3, short: "Diameter bisects chord at right angles", full: "If diameter bisects chord not through center, it cuts at right angles" },
  { n: 4, short: "Non-diameters do not bisect", full: "Two non-diameters cutting one another do not bisect" },
  { n: 5, short: "Cutting circles do not share center", full: "If two circles cut one another, they do not have same center" },
  { n: 6, short: "Touching circles do not share center", full: "If two circles touch, they do not have same center" },
  { n: 7, short: "Greatest/shortest from point on diameter", full: "From point on diameter: greatest through center, least is remainder" },
  { n: 8, short: "Lines from point outside circle", full: "From point outside: through center greatest; between point and diameter least" },
  { n: 9, short: "Three equal lines imply center", full: "If more than two equal lines fall from point on circle, point is center" },
  { n: 10, short: "Circles cut at most two points", full: "A circle does not cut another at more than two points" },
  { n: 11, short: "Internally touching circles", full: "Line joining centers of internally touching circles passes through contact" },
  { n: 12, short: "Externally touching circles", full: "Line joining centers of externally touching circles passes through contact" },
  { n: 13, short: "Circles touch at most one point", full: "Circle does not touch another at more than one point" },
  { n: 14, short: "Equal chords equally distant", full: "Equal chords equally distant from center, and conversely" },
  { n: 15, short: "Diameter greatest", full: "Diameter greatest; nearer to center greater than more remote" },
  { n: 16, short: "Tangent at end of diameter", full: "Perpendicular at end of diameter falls outside; horn angle" },
  { n: 17, short: "Draw tangent from point", full: "From given point to draw straight line touching given circle" },
  { n: 18, short: "Radius to tangent perpendicular", full: "Radius to point of contact perpendicular to tangent" },
  { n: 19, short: "Perpendicular from contact to center", full: "Perpendicular from contact to tangent passes through center" },
  { n: 20, short: "Angle at center double angle at circumference", full: "Angle at center double angle at circumference on same base" },
  { n: 21, short: "Angles in same segment equal", full: "In a circle angles in same segment equal one another" },
  { n: 22, short: "Opposite angles of cyclic quadrilateral", full: "Sum of opposite angles of cyclic quadrilateral equals two right angles" },
  { n: 23, short: "Same line, two similar unequal segments", full: "On same line cannot construct two similar unequal segments on same side" },
  { n: 24, short: "Similar segments on equal lines equal", full: "Similar segments on equal straight lines equal one another" },
  { n: 25, short: "Complete circle from segment", full: "Given segment of circle, describe complete circle" },
  { n: 26, short: "Equal angles stand on equal arcs", full: "In equal circles equal angles stand on equal circumferences" },
  { n: 27, short: "Equal arcs imply equal angles", full: "In equal circles angles on equal circumferences equal one another" },
  { n: 28, short: "Equal chords cut off equal arcs", full: "In equal circles equal chords cut off equal circumferences" },
  { n: 29, short: "Equal arcs imply equal chords", full: "In equal circles chords cutting equal circumferences are equal" },
  { n: 30, short: "Bisect given circumference", full: "To bisect a given circumference" },
  { n: 31, short: "Angle in semicircle is right", full: "Angle in semicircle right; in greater segment less; in less greater" },
  { n: 32, short: "Tangent-chord angle equals alternate segment", full: "Angle with tangent equals angle in alternate segment" },
  { n: 33, short: "Segment admitting given angle", full: "On given line describe segment admitting angle equal to given" },
  { n: 34, short: "Cut off segment admitting angle", full: "From given circle cut off segment admitting given angle" },
  { n: 35, short: "Rectangle from chord segments equal", full: "If chords cut one another, rectangle by segments of one equals other" },
  { n: 36, short: "Tangent squared = secant × external", full: "From point outside: tangent squared = secant × external part" },
  { n: 37, short: "Converse: tangent if rectangle = square", full: "If rectangle equals square on line, that line touches circle" }
];

// Joyce: III.1 uses I.10, I.11, I.Def.15, I.8, I.Def.10. III.9, III.10 use III.1 cor. III.16 cor → III.17, III.33, III.37. III.35 uses III.1, I.12, III.3, II.5, I.47.
// Simplified: all depend on Book I. Key within-Book: 1→2,3; 3→4,14,15,35; 16→17,33,37; 20→21,31; 21→22; 31→32; 32→33,34; 35→36; 36→37.
const DEPS = {
  1: ["BookI"],
  2: ["BookI", "Prop1"],
  3: ["BookI", "Prop1"],
  4: ["BookI", "Prop3"],
  5: ["BookI"],
  6: ["BookI"],
  7: ["BookI"],
  8: ["BookI"],
  9: ["BookI", "Prop1"],
  10: ["BookI", "Prop1"],
  11: ["BookI"],
  12: ["BookI"],
  13: ["BookI"],
  14: ["BookI", "Prop3"],
  15: ["BookI", "Prop3"],
  16: ["BookI"],
  17: ["BookI", "Prop16"],
  18: ["BookI", "Prop1"],
  19: ["BookI", "Prop18"],
  20: ["BookI", "Prop1"],
  21: ["BookI", "Prop20"],
  22: ["BookI", "Prop21"],
  23: ["BookI"],
  24: ["BookI", "Prop23"],
  25: ["BookI"],
  26: ["BookI"],
  27: ["BookI", "Prop26"],
  28: ["BookI", "Prop27"],
  29: ["BookI", "Prop28"],
  30: ["BookI"],
  31: ["BookI", "Prop20"],
  32: ["BookI", "Prop31"],
  33: ["BookI", "Prop16", "Prop32"],
  34: ["BookI", "Prop32"],
  35: ["BookI", "Prop1", "Prop3", "PropII5"],
  36: ["BookI", "Prop1", "Prop18", "Prop35"],
  37: ["BookI", "Prop1", "Prop16", "Prop32", "Prop36"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-iii",
    name: "Euclid's Elements, Book III",
    subject: "geometry",
    variant: "classical",
    description: "Theory of circles: 11 definitions, 37 propositions. All depend on Book I. III.35 uses II.5. Source: David E. Joyce.",
    structure: { books: 3, definitions: 11, propositions: 37, foundationTypes: ["definition", "foundation"] }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book III Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book III", "circles", "chords", "tangents"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book III", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookIII/bookIII.html", notes: "Clark University" }
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
  { id: "PropII5", type: "foundation", label: "Prop. II.5 — Rectangle + square = square on half", shortLabel: "Prop. II.5", short: "From Book II", book: 2, colorClass: "foundation" }
);

// Definitions
for (const d of DEFS) {
  discourse.nodes.push({
    id: `Def${d.n}`,
    type: "definition",
    label: d.full,
    shortLabel: `Def. III.${d.n}`,
    short: d.short,
    book: 3,
    number: d.n,
    colorClass: "definition"
  });
  discourse.edges.push({ from: "BookI", to: `Def${d.n}` });
}

// Propositions
for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. III.${prop.n}`,
    short: prop.short,
    book: 3,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n] || ["BookI"]) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

// Write JSON
const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-iii.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-iii.json");

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
  needed.add("PropII5");
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
            <a id="book-index-link" href="#">Euclid Book III Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookIII/bookIII.html" target="_blank">Euclid's Elements Book III (Joyce)</a>
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
                indexLink.href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-iii.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookIII/bookIII.html" target="_blank">Euclid's Elements, Book III</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#95a5a6"></div><div><strong>Gray</strong><br><small>Book I, Prop II.5 (foundation)</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book III</li><li>circles</li><li>chords</li><li>tangents</li>
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
  // Chart 1: Book I + Prop II.5 + Defs 1-11 + Props 1-5 = 2+11+5 = 18 (slightly over)
  const filter1 = closure(5);
  const nodes1 = discourse.nodes.filter(filter1);
  const edges1 = discourse.edges.filter(e => filter1({ id: e.from }) && filter1({ id: e.to }));
  const m1 = toMermaid(filter1);
  const html1 = htmlTemplate(
    "Euclid's Elements Book III — Propositions 1–5",
    "Dependency graph for definitions and propositions 1–5 of Book III. Theory of circles: center, chords, diameters. All depend on Book I.",
    m1,
    nodes1.length,
    edges1.length
  );
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-iii-props-1-5.html"), html1, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-iii-props-1-5.html");

  // Chart 2: Props 6-20
  const filter2 = closure(20);
  const nodes2 = discourse.nodes.filter(filter2);
  const edges2 = discourse.edges.filter(e => filter2({ id: e.from }) && filter2({ id: e.to }));
  const m2 = toMermaid(filter2);
  const html2 = htmlTemplate(
    "Euclid's Elements Book III — Propositions 6–20",
    "Dependency graph for propositions 6–20. Touching circles, distances, tangent at diameter, angles at center and circumference.",
    m2,
    nodes2.length,
    edges2.length
  );
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-iii-props-6-20.html"), html2, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-iii-props-6-20.html");

  // Chart 3: Props 21-37
  const filter3 = () => true;
  const m3 = toMermaid(filter3);
  const nodes3 = discourse.nodes;
  const edges3 = discourse.edges;
  const html3 = htmlTemplate(
    "Euclid's Elements Book III — Propositions 21–37",
    "Dependency graph for propositions 21–37. Cyclic quadrilaterals, segments, chord rectangle theorem (III.35 uses Prop II.5), tangent-secant.",
    m3,
    nodes3.length,
    edges3.length
  );
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-iii-props-21-37.html"), html3, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-iii-props-21-37.html");
} else {
  console.log("MATH_DB not found at", GEOM_DIR, "- skipping HTML generation.");
}

// Book III index page
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book III - Mathematics Process</title>
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
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookIII/bookIII.html" target="_blank">Euclid's Elements Book III (Joyce)</a>
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
        <h1>Euclid's Elements Book III</h1>
        <p>Theory of circles: 11 definitions, 37 propositions. Chords, tangents, angles at center and circumference. All depend on Book I. Prop III.35 uses Prop II.5. Dependency charts split into three views (~16 nodes each).</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-iii-props-1-5.html">Propositions 1–5 <span class="chart-meta">Defs + center, chords, diameters</span></a>
            <a href="geometry_topology-euclid-elements-book-iii-props-6-20.html">Propositions 6–20 <span class="chart-meta">Touching circles, tangent, angles</span></a>
            <a href="geometry_topology-euclid-elements-book-iii-props-21-37.html">Propositions 21–37 <span class="chart-meta">Cyclic quadrilaterals, chord rectangle, tangent-secant</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-iii.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-iii.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
