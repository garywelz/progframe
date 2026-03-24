#!/usr/bin/env node
/**
 * Build Euclid's Elements Book VII discourse JSON and Mermaid charts.
 * 22 definitions, 39 propositions. Number theory: GCD, proportions, primes, LCM.
 * Book VII does not depend on previous books. Source: David E. Joyce.
 *
 * Charts: 4. Chart 1: Defs + Props 1-10. Chart 2: Props 11-20. Chart 3: Props 21-30. Chart 4: Props 31-39.
 */

const fs = require('fs');
const path = require('path');

const DEFS = [
  { n: 1, short: "Unit", full: "A unit is that by virtue of which each of the things that exist is called one" },
  { n: 2, short: "Number", full: "A number is a multitude composed of units" },
  { n: 3, short: "Part", full: "A number is part of a number when it measures it" },
  { n: 4, short: "Parts", full: "Parts when it does not measure it" },
  { n: 5, short: "Multiple", full: "The greater is a multiple of the less when measured by the less" },
  { n: 6, short: "Even", full: "An even number is that which is divisible into two equal parts" },
  { n: 7, short: "Odd", full: "An odd number is that which is not divisible into two equal parts" },
  { n: 8, short: "Even-times even", full: "Even-times even: measured by an even number an even number of times" },
  { n: 9, short: "Even-times odd", full: "Even-times odd: measured by an even number an odd number of times" },
  { n: 10, short: "Odd-times odd", full: "Odd-times odd: measured by an odd number an odd number of times" },
  { n: 11, short: "Prime", full: "A prime number is that which is measured by a unit alone" },
  { n: 12, short: "Relatively prime", full: "Numbers relatively prime when only a unit measures both" },
  { n: 13, short: "Composite", full: "A composite number is that measured by some number" },
  { n: 14, short: "Composite to one another", full: "Numbers composite to one another when some number measures both" },
  { n: 15, short: "Multiply", full: "A number multiplies a number when the latter is added as many times as units in the former" },
  { n: 16, short: "Product", full: "When two numbers multiplied produce a number, the product is plane" },
  { n: 17, short: "Side", full: "Sides of the product are the numbers multiplied" },
  { n: 18, short: "Plane number", full: "A plane number is that produced by two numbers" },
  { n: 19, short: "Solid number", full: "A solid number is that produced by three numbers" },
  { n: 20, short: "Similar plane", full: "Similar plane numbers have sides proportional" },
  { n: 21, short: "Similar solid", full: "Similar solid numbers have sides proportional" },
  { n: 22, short: "Perfect", full: "A perfect number is that which equals its own parts" }
];

const PROPS = [
  { n: 1, short: "Antenaresis, relatively prime", full: "Unequal numbers: repeated subtraction; if unit left, relatively prime" },
  { n: 2, short: "GCD of two numbers", full: "To find greatest common measure of two numbers not relatively prime" },
  { n: 3, short: "GCD of three numbers", full: "To find greatest common measure of three numbers" },
  { n: 4, short: "Part or parts", full: "Any number is part or parts of any number, less of greater" },
  { n: 5, short: "Same part: sum", full: "If a is same part of b as c of d, then a+c same part of b+d" },
  { n: 6, short: "Same parts: sum", full: "If a is same parts of b as c of d, then a+c same parts of b+d" },
  { n: 7, short: "Same part: remainder", full: "If a part of b as c of d, remainder same part of remainder" },
  { n: 8, short: "Same parts: remainder", full: "If a parts of b as c of d, remainder same parts of remainder" },
  { n: 9, short: "Same part: alternately", full: "If a part of b as c of d, alternately a part/parts of c as b of d" },
  { n: 10, short: "Same parts: alternately", full: "If a parts of b as c of d, alternately a part/parts of c as b of d" },
  { n: 11, short: "Proportion: remainder", full: "If whole:whole as subtracted:subtracted, remainder:remainder as whole:whole" },
  { n: 12, short: "Proportional: sum", full: "Proportional: one antecedent to consequent as sum antecedents to sum consequents" },
  { n: 13, short: "Proportional: alternately", full: "If four numbers proportional, also proportional alternately" },
  { n: 14, short: "Ex aequali", full: "If a:b = d:e and b:c = e:f, then a:c = d:f" },
  { n: 15, short: "Unit measures", full: "If unit measures a, b measures c same times, alternately unit:c as b:d" },
  { n: 16, short: "Commutativity of product", full: "If a×b and c×d, then a×b = c×d (commutativity)" },
  { n: 17, short: "Ratio of products", full: "a:b = (a×c):(b×c)" },
  { n: 18, short: "Ratio: multipliers", full: "a×c : b×c = a:b" },
  { n: 19, short: "Proportional iff product", full: "a:b = c:d iff a×d = b×c" },
  { n: 20, short: "Least in ratio", full: "Least numbers in ratio measure others same number of times" },
  { n: 21, short: "Relatively prime: least", full: "Relatively prime numbers are least in their ratio" },
  { n: 22, short: "Least: relatively prime", full: "Least numbers in ratio are relatively prime" },
  { n: 23, short: "Relatively prime: divisor", full: "If a,b relatively prime, divisor of a relatively prime to b" },
  { n: 24, short: "Product relatively prime", full: "If a,b relatively prime to c, then a×b relatively prime to c" },
  { n: 25, short: "Square relatively prime", full: "If a,b relatively prime, a² relatively prime to b" },
  { n: 26, short: "Products relatively prime", full: "If a,c and b,d relatively prime, a×b, c×d relatively prime" },
  { n: 27, short: "Squares relatively prime", full: "If a,b relatively prime, a²,b² relatively prime; a×a², b×b²" },
  { n: 28, short: "Sum relatively prime", full: "If a,b relatively prime, a+b prime to each; converse" },
  { n: 29, short: "Prime to non-multiple", full: "Prime relatively prime to any number it does not measure" },
  { n: 30, short: "Prime divides product", full: "If prime measures product, it measures one factor" },
  { n: 31, short: "Composite has prime factor", full: "Any composite measured by some prime" },
  { n: 32, short: "Prime or has prime factor", full: "Any number is prime or measured by some prime" },
  { n: 33, short: "Least in ratio", full: "Given numbers, find least in same ratio" },
  { n: 34, short: "LCM of two", full: "To find least number that two given numbers measure" },
  { n: 35, short: "LCM divides common multiple", full: "If two numbers measure some number, LCM also measures it" },
  { n: 36, short: "LCM of three", full: "To find least number that three given numbers measure" },
  { n: 37, short: "Measured has part", full: "If a measures b, b has part named by a" },
  { n: 38, short: "Part implies measured", full: "If b has part named by a, a measures b" },
  { n: 39, short: "Least with given parts", full: "To find least number with given parts" }
];

// Joyce: VII.1→2,3; VII.2→3; VII.5-10 fractions; VII.11-19 proportions; VII.20-29 relatively prime; VII.30-32 primes; VII.33-39 LCM
const DEPS = {
  1: [],
  2: ["Prop1"],
  3: ["Prop1", "Prop2"],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
  15: [],
  16: [],
  17: [],
  18: [],
  19: [],
  20: ["Prop19"],
  21: ["Prop20"],
  22: ["Prop21"],
  23: ["Prop22"],
  24: ["Prop23"],
  25: ["Prop23"],
  26: ["Prop24"],
  27: ["Prop25"],
  28: ["Prop23"],
  29: ["Prop23"],
  30: ["Prop29"],
  31: [],
  32: ["Prop31"],
  33: ["Prop20", "Prop22"],
  34: ["Prop33"],
  35: ["Prop34"],
  36: ["Prop34"],
  37: [],
  38: ["Prop37"],
  39: ["Prop38"]
};

const discourse = {
  schemaVersion: "1.0",
  discourse: {
    id: "euclid-elements-book-vii",
    name: "Euclid's Elements, Book VII",
    subject: "number_theory",
    variant: "classical",
    description: "Number theory: GCD (Euclidean algorithm), proportions, primes, LCM. 22 definitions, 39 propositions. Does not depend on previous books. Source: David E. Joyce.",
    structure: { books: 7, definitions: 22, propositions: 39, foundationTypes: ["definition"] }
  },
  metadata: {
    created: "2026-03-18",
    lastUpdated: "2026-03-18",
    version: "1.0.0",
    license: "CC BY 4.0",
    authors: ["Welz, G."],
    methodology: "Programming Framework",
    citation: "Welz, G. (2026). Euclid's Elements Book VII Dependency Graph. Programming Framework.",
    keywords: ["Euclid", "Elements", "Book VII", "number theory", "GCD", "prime", "LCM"]
  },
  sources: [
    { id: "joyce", type: "digital", authors: "Joyce, David E.", title: "Euclid's Elements, Book VII", year: "1996", url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookVII/bookVII.html", notes: "Clark University" }
  ],
  nodes: [],
  edges: [],
  colorScheme: {
    definition: { fill: "#3498db", stroke: "#2980b9" },
    proposition: { fill: "#1abc9c", stroke: "#16a085" }
  }
};

for (const d of DEFS) {
  discourse.nodes.push({
    id: `Def${d.n}`,
    type: "definition",
    label: d.full,
    shortLabel: `Def. VII.${d.n}`,
    short: d.short,
    book: 7,
    number: d.n,
    colorClass: "definition"
  });
}

for (const prop of PROPS) {
  discourse.nodes.push({
    id: `Prop${prop.n}`,
    type: "proposition",
    label: prop.full,
    shortLabel: `Prop. VII.${prop.n}`,
    short: prop.short,
    book: 7,
    number: prop.n,
    colorClass: "proposition"
  });
  for (const dep of DEPS[prop.n] || []) {
    discourse.edges.push({ from: dep, to: `Prop${prop.n}` });
  }
}

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "euclid-elements-book-vii.json"), JSON.stringify(discourse, null, 2), "utf8");
console.log("Wrote euclid-elements-book-vii.json");

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
                <span class="meta-item">Number Theory</span>
                <span class="meta-item">Source: Euclid's Elements</span>
            </div>
        </div>
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="euclid-index-link" href="#">Euclid's Elements (all books)</a>
            <a id="book-index-link" href="#">Euclid Book VII Index</a>
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVII/bookVII.html" target="_blank">Euclid's Elements Book VII (Joyce)</a>
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
                document.getElementById('book-index-link').href = base + '/processes/geometry_topology/geometry_topology-euclid-elements-book-vii.html';
            })();
        </script>
        <div class="content">
            <div class="description">
                <h2>Description</h2>
                <p>${subtitle}</p>
                <p style="margin-top:10px;"><em>Source: <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVII/bookVII.html" target="_blank">Euclid's Elements, Book VII</a> (David E. Joyce, Clark University)</em></p>
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
                        <li>Euclid</li><li>Elements</li><li>Book VII</li><li>number theory</li><li>GCD</li><li>prime</li><li>LCM</li>
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
  [[10, "1–10", "GCD, part/parts, proportions"], [20, "11–20", "Proportions, products, least in ratio"], [30, "21–30", "Relatively prime, primes"], [39, "31–39", "Primes, LCM, parts"]].forEach(([max, range, desc]) => {
    const filter = closure(max);
    const m = toMermaid(filter);
    const nodes = discourse.nodes.filter(filter);
    const edges = discourse.edges.filter(e => filter({ id: e.from }) && filter({ id: e.to }));
    fs.writeFileSync(path.join(GEOM_DIR, `geometry_topology-euclid-elements-book-vii-props-${range.replace(/–/g, "-").replace(" ", "-")}.html`), htmlTemplate(`Euclid's Elements Book VII — Propositions ${range}`, desc, m, nodes.length, edges.length), "utf8");
    console.log(`Wrote geometry_topology-euclid-elements-book-vii-props-${range.replace(/–/g, "-").replace(" ", "-")}.html`);
  });
}

// Book VII index
if (fs.existsSync(GEOM_DIR)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Euclid's Elements Book VII - Mathematics Process</title>
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
            <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVII/bookVII.html" target="_blank">Euclid's Elements Book VII (Joyce)</a>
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
        <h1>Euclid's Elements Book VII</h1>
        <p>Number theory: GCD (Euclidean algorithm), proportions of numbers, primes, LCM. 22 definitions, 39 propositions. Does not depend on previous books.</p>
        <div class="sections">
            <a href="geometry_topology-euclid-elements-book-vii-props-1-10.html">Propositions 1–10 <span class="chart-meta">GCD, part/parts, proportions</span></a>
            <a href="geometry_topology-euclid-elements-book-vii-props-11-20.html">Propositions 11–20 <span class="chart-meta">Proportions, products, least in ratio</span></a>
            <a href="geometry_topology-euclid-elements-book-vii-props-21-30.html">Propositions 21–30 <span class="chart-meta">Relatively prime, primes</span></a>
            <a href="geometry_topology-euclid-elements-book-vii-props-31-39.html">Propositions 31–39 <span class="chart-meta">Primes, LCM, parts</span></a>
        </div>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(GEOM_DIR, "geometry_topology-euclid-elements-book-vii.html"), indexHtml, "utf8");
  console.log("Wrote geometry_topology-euclid-elements-book-vii.html");
}

console.log("Done. Nodes:", discourse.nodes.length, "Edges:", discourse.edges.length);
