#!/usr/bin/env node
/**
 * Build Euclid's Elements Book V discourse JSON and Mermaid charts.
 * 18 definitions, 25 propositions. Theory of ratio and proportion (Eudoxus).
 * Book V does NOT depend on previous books. Source: David E. Joyce.
 *
 * Charts: 3. Chart 1: Defs + Props 1-8. Chart 2: Props 9-16. Chart 3: Props 17-25.
 */

const fs = require('fs');
const path = require('path');

const DEFS = [
  { n: 1, short: "Part", full: "A magnitude is a part of a magnitude when it measures it" },
  { n: 2, short: "Multiple", full: "The greater is a multiple of the less when it is measured by the less" },
  { n: 3, short: "Ratio", full: "A ratio is a sort of relation in respect of size between two magnitudes" },
  { n: 4, short: "Same ratio", full: "Magnitudes have a ratio when the less can be multiplied to exceed the greater" },
  { n: 5, short: "In same ratio (Eudoxus)", full: "Magnitudes in same ratio when equimultiples alike exceed, equal, or fall short" },
  { n: 6, short: "Proportional", full: "Magnitudes which have the same ratio are proportional" },
  { n: 7, short: "Greater ratio", full: "When of equimultiples first exceeds second, third does not exceed fourth" },
  { n: 8, short: "Compound ratio", full: "Compound ratio is the ratio of the products of corresponding terms" },
  { n: 9, short: "Duplicate ratio", full: "Duplicate ratio is the ratio of the squares" },
  { n: 10, short: "Triplicate ratio", full: "Triplicate ratio is the ratio of the cubes" },
  { n: 11, short: "Corresponding magnitudes", full: "Corresponding magnitudes in proportion" },
  { n: 12, short: "Alternate ratio", full: "Alternate: first to third as second to fourth" },
  { n: 13, short: "Inverse ratio", full: "Inverse: second to first as fourth to third" },
  { n: 14, short: "Composition of ratio", full: "Composition: first+second to second as third+fourth to fourth" },
  { n: 15, short: "Separation of ratio", full: "Separation: first−second to second as third−fourth to fourth" },
  { n: 16, short: "Conversion of ratio", full: "Conversion: first to first−second as third to third−fourth" },
  { n: 17, short: "Ex aequali", full: "Ex aequali: when first to second as second to third" },
  { n: 18, short: "Ex aequali perturbed", full: "Ex aequali perturbed: when ratios are in perturbed order" }
];

const PROPS = [
  { n: 1, short: "Sum of multiples", full: "If magnitudes each same multiple of others, sum is that multiple of sum" },
  { n: 2, short: "Equimultiples sum", full: "If first:second as third:fourth, sum of first and fifth as sum of third and sixth" },
  { n: 3, short: "Equimultiples of equimultiples", full: "Equimultiples of equimultiples are equimultiples" },
  { n: 4, short: "Equimultiples preserve ratio", full: "If a:b = c:d, then ma:nb = mc:nd" },
  { n: 5, short: "Multiple of difference", full: "Multiple of whole minus multiple of part = multiple of remainder" },
  { n: 6, short: "Equimultiples minus equimultiples", full: "Equimultiples minus equimultiples equal or equimultiples" },
  { n: 7, short: "Equals in ratio", full: "Equal magnitudes have same ratio to same; same to equals" },
  { n: 8, short: "Greater has greater ratio", full: "Of unequal magnitudes, greater has greater ratio to same" },
  { n: 9, short: "Same ratio implies equal", full: "Magnitudes with same ratio to same are equal" },
  { n: 10, short: "Greater ratio implies greater", full: "Of magnitudes with ratio to same, greater ratio implies greater" },
  { n: 11, short: "Transitivity of ratios", full: "Ratios same with same ratio are same with one another" },
  { n: 12, short: "Sum of antecedents/consequents", full: "Proportional: one antecedent to one consequent as sum to sum" },
  { n: 13, short: "Substitution in ratio inequality", full: "If a:b = c:d and c:d > e:f, then a:b > e:f" },
  { n: 14, short: "Equal ratios, equal magnitudes", full: "If a:b = c:d and a>c, then b>d" },
  { n: 15, short: "Parts as equimultiples", full: "Parts have same ratio as their equimultiples" },
  { n: 16, short: "Alternate proportion", full: "If a:b = c:d, then a:c = b:d" },
  { n: 17, short: "Jointly implies separately", full: "If (a+b):b = (c+d):d, then a:b = c:d" },
  { n: 18, short: "Separately implies jointly", full: "If a:b = c:d, then (a+b):b = (c+d):d" },
  { n: 19, short: "Whole to whole as part to part", full: "If (a+b):(c+d) = a:c, then also = b:d" },
  { n: 20, short: "Ex aequali (direct)", full: "If a:b = d:e and b:c = e:f and a>c, then d>f" },
  { n: 21, short: "Ex aequali (perturbed)", full: "If a:b = e:f and b:c = d:e and a>c, then d>f" },
  { n: 22, short: "Ex aequali chain", full: "If a1:a2 = b1:b2, a2:a3 = b2:b3, ..., then a1:an = b1:bn" },
  { n: 23, short: "Ex aequali perturbed chain", full: "If a:b = y:z and b:c = x:y, then a:c = x:z" },
  { n: 24, short: "Sum of ratios", full: "If a:b = c:d and e:b = f:d, then (a+e):b = (c+f):d" },
  { n: 25, short: "Sum of extremes > sum of means", full: "If a:b = c:d and a greatest, d least, then a+d > b+c" }
];

// Joyce logical structure
const DEPS = {
  1: [],
  2: [],
  3: ["Prop2"],
  4: ["Prop3"],
  5: ["Prop1"],
  6: ["Prop2"],
  7: [],
  8: ["Prop1"],
  9: ["Prop8"],
  10: ["Prop7", "Prop8"],
  11: [],
  12: ["Prop1"],
  13: [],
  14: ["Prop8", "Prop10", "Prop13"],
  15: ["Prop7", "Prop12"],
  16: ["Prop11", "Prop14", "Prop15"],
  17: ["Prop1", "Prop2"],
  18: ["Prop11", "Prop14", "Prop17"],
  19: ["Prop11", "Prop16", "Prop17"],
  20: ["Prop7", "Prop8", "Prop10", "Prop13"],
  21: ["Prop7", "Prop8", "Prop10", "Prop13"],
  22: ["Prop4", "Prop20"],
  23: ["Prop11", "Prop15", "Prop16", "Prop21"],
  24: ["Prop7", "Prop18", "Prop22"],
  25: ["Prop7", "Prop11", "Prop14", "Prop19"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-v",
    name: "Euclid's Elements, Book V",
    subject: "geometry",
    variant: "classical",
    description: "Theory of ratio and proportion (Eudoxus). 18 definitions, 25 propositions. Does not depend on previous books. Source: David E. Joyce.",
    structure: { books: 5, definitions: 18, propositions: 25, foundationTypes: ["definition"] }
  },
  metadata: {
    created: "2026-03-15",
    lastUpdated: "2026-03-15",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book V Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book V", "proportion", "ratio", "Eudoxus"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book V", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookV/bookV.html", notes: "Clark University; Logical structure" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    definition: { fill: "#3498db", stroke: "#2980b9" },
    proposition: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

// Book V has no cross-book dependencies
for (const d of DEFS) {
  discourse.nodes.push({
    id: `Def${d.n}`,
    type: "definition",
    label: d.full,
    shortLabel: `Def. V.${d.n}`,
    short: d.short,
    book: 5,
    number: d.n,
    colorClass: "definition"
  });
}

for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. V.${prop.n}`,
    short: prop.short,
    book: 5,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n] || []) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-v.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-v.json");

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
  lines.push("    classDef definition fill:#3498db,color:#fff,stroke:#2980b9");
  lines.push("    classDef proposition fill:#1abc9c,color:#fff,stroke:#16a085");
  const defIds = nodes.filter(n => n.type === "definition").map(n => n.id).join(",");
  const propIds = nodes.filter(n => n.type === "proposition").map(n => n.id).join(",");
  lines.push(`    class ${defIds} definition`);
  lines.push(`    class ${propIds} proposition`);
  return lines.join("\n");
}

function closure(propMax) {
  const needed = new Set();
  for (let i = 1; i <= propMax; i++) needed.add(`Prop${i}`);
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
            <a id="book-index-link" href="#">Euclid Book V Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookV/bookV.html" target="_blank">Euclid's Elements Book V (Joyce)</a>
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
                document.getElementById('book-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-v.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookV/bookV.html" target="_blank">Euclid's Elements, Book V</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
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
                        <li>Euclid</li><li>Elements</li><li>Book V</li><li>proportion</li><li>ratio</li><li>Eudoxus</li>
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
  const filter1 = closure(8);
  const m1 = toMermaid(filter1);
  const nodes1 = discourse.nodes.filter(filter1);
  const edges1 = discourse.edges.filter(e => filter1({ id: e.from }) && filter1({ id: e.to }));
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-v-props-1-8.html"), htmlTemplate("Euclid's Elements Book V — Propositions 1–8", "Theory of proportion: multiples, equimultiples, basic ratio properties. Book V does not depend on previous books.", m1, nodes1.length, edges1.length), "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-v-props-1-8.html");

  const filter2 = closure(16);
  const m2 = toMermaid(filter2);
  const nodes2 = discourse.nodes.filter(filter2);
  const edges2 = discourse.edges.filter(e => filter2({ id: e.from }) && filter2({ id: e.to }));
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-v-props-9-16.html"), htmlTemplate("Euclid's Elements Book V — Propositions 9–16", "Ratio inequalities, transitivity, alternate proportion, jointly and separately.", m2, nodes2.length, edges2.length), "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-v-props-9-16.html");

  const m3 = toMermaid(() => true);
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-v-props-17-25.html"), htmlTemplate("Euclid's Elements Book V — Propositions 17–25", "Ex aequali, perturbed ratios, composition, sum of extremes.", m3, discourse.nodes.length, discourse.edges.length), "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-v-props-17-25.html");
}

// Book V index
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book V - Mathematics Process</title>
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
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookV/bookV.html" target="_blank">Euclid's Elements Book V (Joyce)</a>
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
        <h1>Euclid's Elements Book V</h1>
        <p>Theory of ratio and proportion (Eudoxus). 18 definitions, 25 propositions. Does not depend on previous books. Foundation for Book VI and Books X–XIII.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-v-props-1-8.html">Propositions 1–8 <span class="chart-meta">Multiples, equimultiples, basic ratio</span></a>
            <a href="geometry_topology-euclid-elements-book-v-props-9-16.html">Propositions 9–16 <span class="chart-meta">Inequalities, alternate, jointly</span></a>
            <a href="geometry_topology-euclid-elements-book-v-props-17-25.html">Propositions 17–25 <span class="chart-meta">Ex aequali, perturbed, composition</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-v.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-v.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
