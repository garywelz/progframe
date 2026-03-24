#!/usr/bin/env node
/**
 * Build Euclid's Elements Book X discourse JSON and Mermaid charts.
 * 16 definitions (4+6+6), 115 propositions. Incommensurables, binomials, apotomes.
 * Depends on Books I, V, VI. Source: David E. Joyce.
 *
 * Charts: 8. Props 1-15, 16-30, 31-45, 46-60, 61-75, 76-90, 91-105, 106-115.
 */

const fs = require('fs');
const path = require('path');

const PROPS = [
  { n: 1, short: "Antenaresis for magnitudes", full: "Two unequal magnitudes: subtract more than half repeatedly; remainder less than lesser" },
  { n: 2, short: "Incommensurable criterion", full: "If less subtracted from greater repeatedly and remainder never measures prior: incommensurable" },
  { n: 3, short: "GCM of two commensurable", full: "To find greatest common measure of two commensurable magnitudes" },
  { n: 4, short: "GCM of three commensurable", full: "To find greatest common measure of three commensurable magnitudes" },
  { n: 5, short: "Commensurable: number ratio", full: "Commensurable magnitudes have ratio which a number has to a number" },
  { n: 6, short: "Number ratio: commensurable", full: "If two magnitudes have number-to-number ratio, they are commensurable" },
  { n: 7, short: "Incommensurable: no number ratio", full: "Incommensurable magnitudes do not have number-to-number ratio" },
  { n: 8, short: "No number ratio: incommensurable", full: "If magnitudes lack number-to-number ratio, they are incommensurable" },
  { n: 9, short: "Squares: commensurable iff square ratio", full: "Squares on commensurable lines have square-to-square ratio; converse" },
  { n: 10, short: "Find incommensurable lines", full: "To find two lines incommensurable with assigned: one in length, one in square" },
  { n: 11, short: "Proportion preserves commensurability", full: "Four proportional: first commensurable with second iff third with fourth" },
  { n: 12, short: "Commensurable with same", full: "Magnitudes commensurable with same magnitude are commensurable" },
  { n: 13, short: "Commensurable: incommensurable partner", full: "If two commensurable, one incommensurable with third, so is the other" },
  { n: 14, short: "Square difference, sum of squares", full: "Given two lines: find square by which greater square exceeds less; find line whose square equals sum" },
  { n: 15, short: "Commensurable sum", full: "Two commensurable added: whole commensurable with each" },
  { n: 16, short: "Incommensurable sum", full: "Two incommensurable added: sum incommensurable with each" },
  { n: 17, short: "Parallelogram falling short", full: "Applied parallelogram falling short by square: parts commensurable iff square difference commensurable" },
  { n: 18, short: "Parallelogram: incommensurable parts", full: "Applied parallelogram: parts incommensurable iff square difference incommensurable" },
  { n: 19, short: "Rational rectangle from rational", full: "Rectangle by rational lines commensurable in length is rational" },
  { n: 20, short: "Rational area on rational", full: "Rational area applied to rational line: breadth rational and commensurable" },
  { n: 21, short: "Medial: rational in square only", full: "Rectangle by rational in square only is irrational; side called medial" },
  { n: 22, short: "Medial applied to rational", full: "Square on medial applied to rational: breadth rational, incommensurable in length" },
  { n: 23, short: "Commensurable with medial", full: "Line commensurable with medial is medial" },
  { n: 24, short: "Medial rectangle: commensurable length", full: "Rectangle by medial lines commensurable in length is medial" },
  { n: 25, short: "Medial: square only", full: "Rectangle by medial in square only: rational or medial" },
  { n: 26, short: "Medial minus medial", full: "Medial area does not exceed medial by rational area" },
  { n: 27, short: "Find medial in square only, rational rect", full: "To find medial lines commensurable in square only containing rational rectangle" },
  { n: 28, short: "Find medial in square only, medial rect", full: "To find medial lines commensurable in square only containing medial rectangle" },
  { n: 29, short: "Find rational in square only, commensurable diff", full: "To find two rational in square only: square diff commensurable with greater" },
  { n: 30, short: "Find rational in square only, incommensurable diff", full: "To find two rational in square only: square diff incommensurable with greater" },
  { n: 31, short: "Find medial, rational rect, commensurable diff", full: "To find two medial in square only, rational rect: diff commensurable with greater" },
  { n: 32, short: "Find medial, medial rect, commensurable diff", full: "To find two medial in square only, medial rect: diff commensurable with greater" },
  { n: 33, short: "Find incommensurable: rational sum, medial rect", full: "To find two incommensurable in square: sum of squares rational, rectangle medial" },
  { n: 34, short: "Find incommensurable: medial sum, rational rect", full: "To find two incommensurable in square: sum medial, rectangle rational" },
  { n: 35, short: "Find incommensurable: both medial", full: "To find two incommensurable in square: sum and rect medial, incommensurable" },
  { n: 36, short: "Binomial defined", full: "Two rational in square only added: whole irrational, called binomial" },
  { n: 37, short: "First bimedial defined", full: "Two medial in square only, rational rect added: first bimedial" },
  { n: 38, short: "Second bimedial defined", full: "Two medial in square only, medial rect added: second bimedial" },
  { n: 39, short: "Major defined", full: "Two incommensurable in square, rational sum, medial rect added: major" },
  { n: 40, short: "Side of rational plus medial", full: "Two incommensurable in square, medial sum, rational rect added: side of rational plus medial" },
  { n: 41, short: "Side of sum of two medial", full: "Two incommensurable in square, both medial added: side of sum of two medial" },
  { n: 42, short: "Binomial: unique division", full: "Binomial divided into terms at one point only" },
  { n: 43, short: "First bimedial: unique division", full: "First bimedial divided at one point only" },
  { n: 44, short: "Second bimedial: unique division", full: "Second bimedial divided at one point only" },
  { n: 45, short: "Major: unique division", full: "Major divided at one point only" },
  { n: 46, short: "Side rational+medial: unique division", full: "Side of rational plus medial divided at one point only" },
  { n: 47, short: "Side two medial: unique division", full: "Side of sum of two medial divided at one point only" },
  { n: 48, short: "Find first binomial", full: "To find the first binomial line" },
  { n: 49, short: "Find second binomial", full: "To find the second binomial line" },
  { n: 50, short: "Find third binomial", full: "To find the third binomial line" },
  { n: 51, short: "Find fourth binomial", full: "To find the fourth binomial line" },
  { n: 52, short: "Find fifth binomial", full: "To find the fifth binomial line" },
  { n: 53, short: "Find sixth binomial", full: "To find the sixth binomial line" },
  { n: 54, short: "Rational × first binomial", full: "Area by rational and first binomial: side is binomial" },
  { n: 55, short: "Rational × second binomial", full: "Area by rational and second binomial: side is first bimedial" },
  { n: 56, short: "Rational × third binomial", full: "Area by rational and third binomial: side is second bimedial" },
  { n: 57, short: "Rational × fourth binomial", full: "Area by rational and fourth binomial: side is major" },
  { n: 58, short: "Rational × fifth binomial", full: "Area by rational and fifth binomial: side is rational plus medial" },
  { n: 59, short: "Rational × sixth binomial", full: "Area by rational and sixth binomial: side is sum of two medial" },
  { n: 60, short: "Square on binomial", full: "Square on binomial applied to rational: breadth first binomial" },
  { n: 61, short: "Square on first bimedial", full: "Square on first bimedial applied to rational: breadth second binomial" },
  { n: 62, short: "Square on second bimedial", full: "Square on second bimedial applied to rational: breadth third binomial" },
  { n: 63, short: "Square on major", full: "Square on major applied to rational: breadth fourth binomial" },
  { n: 64, short: "Square on rational+medial", full: "Square on rational+medial applied to rational: breadth fifth binomial" },
  { n: 65, short: "Square on two medial", full: "Square on sum of two medial applied to rational: breadth sixth binomial" },
  { n: 66, short: "Commensurable with binomial", full: "Line commensurable with binomial is binomial, same order" },
  { n: 67, short: "Commensurable with bimedial", full: "Line commensurable with bimedial is bimedial, same order" },
  { n: 68, short: "Commensurable with major", full: "Line commensurable with major is major" },
  { n: 69, short: "Commensurable with rational+medial", full: "Line commensurable with rational+medial is rational+medial" },
  { n: 70, short: "Commensurable with two medial", full: "Line commensurable with sum of two medial is sum of two medial" },
  { n: 71, short: "Rational + medial: four irrationals", full: "Rational and medial added: four irrationals arise" },
  { n: 72, short: "Two medial: two irrationals", full: "Two medial incommensurable added: two irrationals arise" },
  { n: 73, short: "Apotome defined", full: "Rational minus rational in square only: remainder irrational, apotome" },
  { n: 74, short: "First apotome of medial", full: "Medial minus medial, rational rect: first apotome of medial" },
  { n: 75, short: "Second apotome of medial", full: "Medial minus medial, medial rect: second apotome of medial" },
  { n: 76, short: "Minor defined", full: "Line minus incommensurable: sum rational, rect medial: remainder minor" },
  { n: 77, short: "Produces rational+medial", full: "Line minus incommensurable: sum medial, rect rational: produces rational+medial" },
  { n: 78, short: "Produces medial+medial", full: "Line minus incommensurable: both medial, incommensurable: produces medial+medial" },
  { n: 79, short: "Apotome: unique annex", full: "To apotome only one rational can be annexed in square only" },
  { n: 80, short: "First apotome medial: unique annex", full: "To first apotome of medial: unique medial annex, rational rect" },
  { n: 81, short: "Second apotome medial: unique annex", full: "To second apotome of medial: unique medial annex, medial rect" },
  { n: 82, short: "Minor: unique annex", full: "To minor: unique annex incommensurable in square" },
  { n: 83, short: "Rational+medial: unique annex", full: "To produces rational+medial: unique annex" },
  { n: 84, short: "Medial+medial: unique annex", full: "To produces medial+medial: unique annex" },
  { n: 85, short: "Find first apotome", full: "To find the first apotome" },
  { n: 86, short: "Find second apotome", full: "To find the second apotome" },
  { n: 87, short: "Find third apotome", full: "To find the third apotome" },
  { n: 88, short: "Find fourth apotome", full: "To find the fourth apotome" },
  { n: 89, short: "Find fifth apotome", full: "To find the fifth apotome" },
  { n: 90, short: "Find sixth apotome", full: "To find the sixth apotome" },
  { n: 91, short: "Rational × first apotome", full: "Area by rational and first apotome: side is apotome" },
  { n: 92, short: "Rational × second apotome", full: "Area by rational and second apotome: side is first apotome of medial" },
  { n: 93, short: "Rational × third apotome", full: "Area by rational and third apotome: side is second apotome of medial" },
  { n: 94, short: "Rational × fourth apotome", full: "Area by rational and fourth apotome: side is minor" },
  { n: 95, short: "Rational × fifth apotome", full: "Area by rational and fifth apotome: side produces rational+medial" },
  { n: 96, short: "Rational × sixth apotome", full: "Area by rational and sixth apotome: side produces medial+medial" },
  { n: 97, short: "Square on apotome medial", full: "Square on apotome of medial applied to rational: breadth first apotome" },
  { n: 98, short: "Square on first apotome medial", full: "Square on first apotome of medial: breadth second apotome" },
  { n: 99, short: "Square on second apotome medial", full: "Square on second apotome of medial: breadth third apotome" },
  { n: 100, short: "Square on minor", full: "Square on minor applied to rational: breadth fourth apotome" },
  { n: 101, short: "Square on rational+medial", full: "Square on produces rational+medial: breadth fifth apotome" },
  { n: 102, short: "Square on medial+medial", full: "Square on produces medial+medial: breadth sixth apotome" },
  { n: 103, short: "Commensurable with apotome", full: "Line commensurable with apotome is apotome, same order" },
  { n: 104, short: "Commensurable with apotome medial", full: "Line commensurable with apotome of medial is apotome of medial" },
  { n: 105, short: "Commensurable with minor", full: "Line commensurable with minor is minor" },
  { n: 106, short: "Commensurable with rational+medial", full: "Line commensurable with produces rational+medial is same" },
  { n: 107, short: "Commensurable with medial+medial", full: "Line commensurable with produces medial+medial is same" },
  { n: 108, short: "Rational minus medial", full: "From rational area subtract medial: side is apotome or minor" },
  { n: 109, short: "Medial minus rational", full: "From medial subtract rational: first apotome of medial or rational+medial" },
  { n: 110, short: "Medial minus medial", full: "From medial subtract medial incommensurable: second apotome or medial+medial" },
  { n: 111, short: "Apotome ≠ binomial", full: "Apotome is not the same as binomial" },
  { n: 112, short: "Rational on binomial", full: "Square on rational applied to binomial: breadth apotome, same order" },
  { n: 113, short: "Rational on apotome", full: "Square on rational applied to apotome: breadth binomial, same order" },
  { n: 114, short: "Apotome × binomial: rational", full: "Area by apotome and binomial (commensurable terms): side is rational" },
  { n: 115, short: "Medial: infinite irrationals", full: "From medial arise irrationals infinite in number, none same as preceding" }
];

const FOUNDATIONS = ["BookI", "BookV", "BookVI"];
const DEPS = {};
for (let i = 1; i <= 115; i++) DEPS[i] = FOUNDATIONS;

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-x",
    name: "Euclid's Elements, Book X",
    subject: "incommensurables",
    variant: "classical",
    description: "Incommensurables, binomials, apotomes. 16 definitions, 115 propositions. Depends on Books I, V, VI. Source: David E. Joyce.",
    structure: { books: 10, definitions: 16, propositions: 115, foundationTypes: ["foundation"] }
  },
  metadata: {
    created: "2026-03-18",
    lastUpdated: "2026-03-18",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book X Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book X", "incommensurable", "binomial", "apotome", "medial"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book X", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookX/bookX.html", notes: "Clark University" }
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
  { id: "BookV", type: "foundation", label: "Book V — Proportions", shortLabel: "Book V", short: "Foundation", book: 5, colorClass: "foundation" },
  { id: "BookVI", type: "foundation", label: "Book VI — Similar figures", shortLabel: "Book VI", short: "Foundation", book: 6, colorClass: "foundation" }
);

for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. X.${prop.n}`,
    short: prop.short,
    book: 10,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n]) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-x.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-x.json");

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
                <span class="meta-item">Incommensurables</span>
                <span class="meta-item">Source: Euclid's Elements</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="euclid-index-link" href="#">Euclid's Elements (all books)</a>
            <a id="book-index-link" href="#">Euclid Book X Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookX/bookX.html" target="_blank">Euclid's Elements Book X (Joyce)</a>
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
                document.getElementById('book-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-x.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookX/bookX.html" target="_blank">Euclid's Elements, Book X</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#95a5a6"></div><div><strong>Gray</strong><br><small>Book I, V, VI (foundation)</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book X</li><li>incommensurable</li><li>binomial</li><li>apotome</li><li>medial</li>
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
  [15, "1-15", "Commensurable, incommensurable, GCM, ratio, squares"],
  [30, "16-30", "Medial, rational, parallelogram, find lines"],
  [45, "31-45", "Binomial, bimedial, major, unique division"],
  [60, "46-60", "Find binomials, area by rational"],
  [75, "61-75", "Square on binomial, commensurable, apotome"],
  [90, "76-90", "Apotome types, find apotomes"],
  [105, "91-105", "Area by apotome, square on apotome, commensurable"],
  [115, "106-115", "Rational from irrational, order, infinite irrationals"]
];

if (fs.existsSync(GEOM_DIR)) {
  CHARTS.forEach(([max, range, desc]) => {
    const filter = closure(max);
    const m = toMermaid(filter);
    const nodes = discourse.nodes.filter(filter);
    const edges = discourse.edges.filter(e => filter({ id: e.from }) && filter({ id: e.to }));
    const fname = `geometry_topology-euclid-elements-book-x-props-${range.replace(/–/g, "-").replace(" ", "-")}.html`;
    fs.writeFileSync(path.join(GEOM_DIR, fname), htmlTemplate(`Euclid's Elements Book X — Propositions ${range}`, desc, m, nodes.length, edges.length), "utf8");
    console.log("Wrote", fname);
  });
}

// Book X index
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book X - Mathematics Process</title>
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
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookX/bookX.html" target="_blank">Euclid's Elements Book X (Joyce)</a>
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
        <h1>Euclid's Elements Book X</h1>
        <p>Incommensurables, binomials, apotomes. 115 propositions, 16 definitions. Depends on Books I, V, VI. Thirteen irrational straight lines; X.115: infinite irrationals from medial.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-x-props-1-15.html">Propositions 1–15 <span class="chart-meta">Commensurable, incommensurable, GCM, ratio</span></a>
            <a href="geometry_topology-euclid-elements-book-x-props-16-30.html">Propositions 16–30 <span class="chart-meta">Medial, rational, parallelogram</span></a>
            <a href="geometry_topology-euclid-elements-book-x-props-31-45.html">Propositions 31–45 <span class="chart-meta">Binomial, bimedial, major</span></a>
            <a href="geometry_topology-euclid-elements-book-x-props-46-60.html">Propositions 46–60 <span class="chart-meta">Find binomials, area by rational</span></a>
            <a href="geometry_topology-euclid-elements-book-x-props-61-75.html">Propositions 61–75 <span class="chart-meta">Square on binomial, apotome</span></a>
            <a href="geometry_topology-euclid-elements-book-x-props-76-90.html">Propositions 76–90 <span class="chart-meta">Apotome types, find apotomes</span></a>
            <a href="geometry_topology-euclid-elements-book-x-props-91-105.html">Propositions 91–105 <span class="chart-meta">Area by apotome, commensurable</span></a>
            <a href="geometry_topology-euclid-elements-book-x-props-106-115.html">Propositions 106–115 <span class="chart-meta">Rational from irrational, order</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-x.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-x.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
