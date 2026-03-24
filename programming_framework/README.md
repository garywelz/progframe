---
title: "Programming Framework for Systematic Analysis"
emoji: "🎨"
colorFrom: "blue"
colorTo: "green"
sdk: "static"
sdk_version: "latest"
app_file: "index.html"
pinned: false
author: "garywelz"
short_description: Mermaid flowcharts & graphs across science + links to interactive math/biology databases
---

## Programming Framework

A systematic visualization methodology for analyzing complex systems across disciplines using Mermaid Markdown and a universal five-color code.

**Source & backup:** [github.com/garywelz/progframe](https://github.com/garywelz/progframe)

### Interactive databases (hosted on Google Cloud Storage)

Browse searchable tables and open individual process charts:

- **Mathematics** — [Algorithms & axiomatic theories table](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html) · [Named collections (mathematicians & theorems)](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/collections/index.html) · [Whole of mathematics graph](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/whole-of-mathematics.html)
- **Biology** — [Pathways, mechanisms & lab protocols table](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/biology-processes-database/biology-database-table.html) · [Theme collections](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/biology-processes-database/collections/index.html)

Complex systems across biology, chemistry, and physics exhibit remarkable similarities in their organizational principles despite operating at vastly different scales and domains. Traditional analysis methods often remain siloed within specific disciplines, limiting our ability to identify common patterns and computational logic that govern system behavior. Here, we present the Programming Framework, a systematic methodology that translates complex system dynamics into standardized computational representations using Mermaid Markdown syntax and LLM processing.

### Purpose and Goals

The Programming Framework project aims to advance the use of Mermaid Markdown syntax and Large Language Models (LLMs) to create standardized, color-coded flowcharts representing complex processes across all academic disciplines. By providing a universal methodology for translating system dynamics into computational representations, this framework enables systematic comparison and pattern recognition across traditionally separate fields including biology, chemistry, physics, computer science, and mathematics. The project builds upon three decades of computational biology research and demonstrates how modern AI tools can democratize complex system analysis, making sophisticated visualization accessible to researchers, educators, and students worldwide.

### Technical Foundation: Mermaid Markdown

#### The Invention of Mermaid

**Knut Sveidqvist** invented the Mermaid markdown format. He created Mermaid, a JavaScript-based diagramming and charting tool, to simplify diagram creation in documentation workflows. The project was inspired by his experience trying to update a diagram in a document, which was difficult due to the file format.

Sveidqvist's innovation revolutionized how diagrams are created and maintained in documentation by providing a text-based syntax that can be version-controlled, easily edited, and automatically rendered into visual diagrams. This approach eliminates the need for external diagramming tools and ensures diagrams stay synchronized with their documentation.

#### Mermaid Markdown (.mmd) Format

The Programming Framework leverages Mermaid's `.mmd` file format, which provides:

- **Text-based syntax** for creating complex flowcharts and diagrams
- **Version control compatibility** - diagrams can be tracked in Git repositories
- **LLM-friendly format** - AI systems can generate and modify diagram code
- **Cross-platform compatibility** - works in any environment that supports JavaScript
- **Embeddable rendering** - diagrams can be displayed in HTML, Markdown, and other formats

#### LLM Integration and Workflow

Our methodology uses Large Language Models to:

1. **Generate .mmd files** - LLMs create detailed Mermaid syntax for complex processes
2. **Apply color coding** - Systematic application of the 5-category color system
3. **Ensure consistency** - Standardized node naming and connection patterns
4. **Embed in HTML** - .mmd files are embedded in HTML for web display
5. **Maintain quality** - LLMs can validate and optimize diagram structure

This workflow enables rapid creation of sophisticated visualizations that would be impractical to create manually, while maintaining the flexibility and editability of text-based formats.

### Universal Color Coding Table

| Color | Hex | Biology | Chemistry | Computer Science | Physics | Mathematics |
| --- | --- | --- | --- | --- | --- | --- |
| Red | `#ff6b6b` | Environmental signals, nutrients | Reactant supply, temperature | Input data, user commands | Energy input, force | Axioms, givens |
| Yellow | `#ffd43b` | Enzymes, receptors | Catalysts, vessels | Data structures, algorithms | Fields, particles | Theorems, methods |
| Green | `#51cf66` | Metabolic reactions | Chemical reactions | Algorithm execution | Quantum/force operations | Calculations, deductions |
| Blue | `#74c0fc` | Metabolites, states | Intermediates, streams | Variables, memory states | States, measurement results | Intermediate results |
| Violet | `#b197fc` | Biomolecules, responses | Final products | Program outputs | Phenomena, measured quantities | Proven results |

### Explore the Space

- Biology evidence base: [GLMP Space](https://huggingface.co/spaces/garywelz/glmp) (Hugging Face) and repo
- Chemistry processes: [chemistry_processes.html](chemistry_processes.html)
- Computer Science: [computer_science_processes.html](computer_science_processes.html)
- Physics: [physics_processes.html](physics_processes.html)
- Mathematics: [mathematics_processes.html](mathematics_processes.html)
- Full article: [programming_framework_article.html](programming_framework_article.html)

### Experimental Validation

- **Validation Paper**: [experimental_validation_paper.html](experimental_validation_paper.html) — comprehensive experimental protocols and validation methodology
- **Core validation flowcharts** (under `validation_flowcharts/`):
  - [catalytic_hydrogenation_optimization.html](validation_flowcharts/catalytic_hydrogenation_optimization.html) — Experiment 1: catalytic hydrogenation
  - [raft_polymerization_mechanism.html](validation_flowcharts/raft_polymerization_mechanism.html) — Experiment 2: polymerization kinetics
  - [surface_catalysis_mechanism.html](validation_flowcharts/surface_catalysis_mechanism.html) — Experiment 3: surface chemistry
  - [electrochemical_oxygen_reduction.html](validation_flowcharts/electrochemical_oxygen_reduction.html) — Experiment 4: electrochemical process
  - [quantum_chemistry_calculation.html](validation_flowcharts/quantum_chemistry_calculation.html) — Experiment 5: computational chemistry

### Batch Architecture

The project now includes a comprehensive batch architecture for each discipline:

- **Mathematics**: 7 batches (21 processes) - Complete ✅
- **Chemistry**: 14 batches (70 processes) - Complete ✅
- **Computer Science**: 7 batches (21 processes) - Complete ✅
- **Physics**: 7 batches (21 processes) - Complete ✅
- **Biology**: External GLMP Space - Complete ✅

Each discipline has an index page (`*_index.html`) and individual batch files (`*_batch_*.html`) containing detailed process visualizations.
