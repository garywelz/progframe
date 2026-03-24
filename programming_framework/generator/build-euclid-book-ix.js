#!/usr/bin/env node
/**
 * Build Euclid's Elements Book IX discourse JSON and Mermaid charts.
 * 36 propositions. Primes, perfect numbers, odd/even. Depends on Books VII and VIII. Source: David E. Joyce.
 *
 * Charts: 3. Chart 1: Props 1-12. Chart 2: Props 13-24. Chart 3: Props 25-36.
 */

const fs = require('fs');
const path = require('path');

const PROPS = [
  { n: 1, short: "Similar plane product square", full: "Two similar plane numbers multiplied: product is square" },
  { n: 2, short: "Product square: similar plane", full: "Two numbers product square: they are similar plane" },
  { n: 3, short: "Cube times itself", full: "Cubic number multiplied by itself: product is cube" },
  { n: 4, short: "Cube times cube", full: "Cubic times cubic: product is cube" },
  { n: 5, short: "Cube times any makes cube", full: "If cube times any makes cube, the multiplied is cubic" },
  { n: 6, short: "Number times itself cubic", full: "If number times itself makes cubic, it is cubic" },
  { n: 7, short: "Composite times any: solid", full: "Composite times any: product is solid" },
  { n: 8, short: "Continued proportion from unit", full: "Numbers from unit in continued proportion: 3rd square, 4th cube, 7th both" },
  { n: 9, short: "Second square: all square", full: "If second from unit square, all square; if cubic, all cubic" },
  { n: 10, short: "Second not square", full: "If second not square, only 3rd and every other square; similar for cube" },
  { n: 11, short: "Less measures greater", full: "Continued proportion from unit: less measures greater" },
  { n: 12, short: "Prime measures last", full: "If prime measures last, it measures second from unit" },
  { n: 13, short: "Second prime: only those measure", full: "Continued proportion, second prime: only proportional numbers measure last" },
  { n: 14, short: "Least measured by primes", full: "Least measured by given primes: not measured by any other prime" },
  { n: 15, short: "Three in proportion", full: "Three least in ratio: sum of any two prime to remainder" },
  { n: 16, short: "Relatively prime: no third", full: "Two relatively prime: no third as first to second" },
  { n: 17, short: "Extremes prime: no extension", full: "Continued proportion, extremes prime: last not to any as first to second" },
  { n: 18, short: "Third proportional", full: "Given two numbers, investigate if third proportional exists" },
  { n: 19, short: "Fourth proportional", full: "Given three numbers, investigate when fourth proportional exists" },
  { n: 20, short: "Infinitude of primes", full: "Prime numbers are more than any assigned multitude" },
  { n: 21, short: "Sum of evens even", full: "Sum of even numbers is even" },
  { n: 22, short: "Sum of odds (even count) even", full: "Sum of odd numbers, even multitude: sum even" },
  { n: 23, short: "Sum of odds (odd count) odd", full: "Sum of odd numbers, odd multitude: sum odd" },
  { n: 24, short: "Even minus even", full: "Even minus even: remainder even" },
  { n: 25, short: "Even minus odd", full: "Even minus odd: remainder odd" },
  { n: 26, short: "Odd minus odd", full: "Odd minus odd: remainder even" },
  { n: 27, short: "Odd minus even", full: "Odd minus even: remainder odd" },
  { n: 28, short: "Odd times even", full: "Odd times even: product even" },
  { n: 29, short: "Odd times odd", full: "Odd times odd: product odd" },
  { n: 30, short: "Odd measures even", full: "Odd measuring even: measures half" },
  { n: 31, short: "Odd prime to double", full: "Odd relatively prime to any: also prime to its double" },
  { n: 32, short: "Powers of 2", full: "Numbers doubled from 2: even-times even only" },
  { n: 33, short: "Half odd", full: "Number with half odd: even-times odd only" },
  { n: 34, short: "Neither", full: "Number neither: both even-times even and even-times odd" },
  { n: 35, short: "Geometric series", full: "Continued proportion: (second−first):first = (last−first):sum of rest" },
  { n: 36, short: "Perfect numbers", full: "If sum of powers of 2 is prime, product with last is perfect" }
];

const DEPS = {};
for (let i = 1; i <= 36; i++) DEPS[i] = ["BookVII", "BookVIII"];

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-ix",
    name: "Euclid's Elements, Book IX",
    subject: "number_theory",
    variant: "classical",
    description: "Primes, perfect numbers, odd/even. 36 propositions. Depends on Books VII and VIII. Source: David E. Joyce.",
    structure: { books: 9, propositions: 36, foundationTypes: ["foundation"] }
  },
  metadata: {
    created: "2026-03-18",
    lastUpdated: "2026-03-18",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book IX Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book IX", "prime", "perfect", "odd", "even"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book IX", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookIX/bookIX.html", notes: "Clark University; IX.20 infinitude of primes" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    foundation: { fill: "#95a5a6", stroke: "#7f8c8d" },
    proposition: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

discourse.nodes.push(
  { id: "BookVII", type: "foundation", label: "Book VII — Number theory", shortLabel: "Book VII", short: "Foundation", book: 7, colorClass: "foundation" },
  { id: "BookVIII", type: "foundation", label: "Book VIII — Continued proportions", shortLabel: "Book VIII", short: "Foundation", book: 8, colorClass: "foundation" }
);

for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. IX.${prop.n}`,
    short: prop.short,
    book: 9,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n]) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-ix.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-ix.json");

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
  const needed = new Set(["BookVII", "BookVIII"]);
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
                <span class="meta-item">Number Theory</span>
                <span class="meta-item">Source: Euclid's Elements</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="euclid-index-link" href="#">Euclid's Elements (all books)</a>
            <a id="book-index-link" href="#">Euclid Book IX Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookIX/bookIX.html" target="_blank">Euclid's Elements Book IX (Joyce)</a>
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
                document.getElementById('book-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-ix.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookIX/bookIX.html" target="_blank">Euclid's Elements, Book IX</a> (David E. Joyce, Clark University)</em></p>
            </div>
            <div class="flowchart-container">
                <h2>Dependency Flowchart</h2>
                <div class="mermaid">${mermaidEscaped}</div>
            </div>
            <div class="color-legend">
                <h3>Color Scheme</h3>
                <div class="color-grid">
                    <div class="color-item"><div class="color-box" style="background:#95a5a6"></div><div><strong>Gray</strong><br><small>Book VII, Book VIII (foundation)</small></div></div>
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
                        <li>Euclid</li><li>Elements</li><li>Book IX</li><li>prime</li><li>perfect</li><li>odd</li><li>even</li>
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
  [[12, "1–12", "Squares, cubes, continued proportion from unit"], [24, "13–24", "Primes, third/fourth proportional, infinitude of primes"], [36, "25–36", "Odd/even, perfect numbers"]].forEach(([max, range, desc]) => {
    const filter = closure(max);
    const m = toMermaid(filter);
    const nodes = discourse.nodes.filter(filter);
    const edges = discourse.edges.filter(e => filter({ id: e.from }) && filter({ id: e.to }));
    const fname = `geometry_topology-euclid-elements-book-ix-props-${range.replace(/–/g, "-").replace(" ", "-")}.html`;
    fs.writeFileSync(path.join(GEOM_DIR, fname), htmlTemplate(`Euclid's Elements Book IX — Propositions ${range}`, desc, m, nodes.length, edges.length), "utf8");
    console.log("Wrote", fname);
  });
}

// Book IX index
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book IX - Mathematics Process</title>
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
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookIX/bookIX.html" target="_blank">Euclid's Elements Book IX (Joyce)</a>
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
        <h1>Euclid's Elements Book IX</h1>
        <p>Primes, perfect numbers, odd/even. 36 propositions. Depends on Books VII and VIII. IX.20: infinitely many primes. IX.36: perfect numbers.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-ix-props-1-12.html">Propositions 1–12 <span class="chart-meta">Squares, cubes, continued proportion</span></a>
            <a href="geometry_topology-euclid-elements-book-ix-props-13-24.html">Propositions 13–24 <span class="chart-meta">Primes, infinitude, third proportional</span></a>
            <a href="geometry_topology-euclid-elements-book-ix-props-25-36.html">Propositions 25–36 <span class="chart-meta">Odd/even, perfect numbers</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-ix.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-ix.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
