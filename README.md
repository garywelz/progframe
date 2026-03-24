# Programming Framework

**Process analysis methodology for science** — complex systems as color-coded Mermaid flowcharts and dependency-style graphs, comparable across biology, chemistry, physics, computer science, and mathematics.

| Resource | Link |
|----------|------|
| **Live Space (static app)** | [Hugging Face — programming_framework](https://huggingface.co/spaces/garywelz/programming_framework) |
| **Source & tooling** | [GitHub — garywelz/progframe](https://github.com/garywelz/progframe) |
| **Mathematics database (table + charts)** | [GCS — mathematics-database-table.html](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html) |
| **Biology database (table + charts)** | [GCS — biology-database-table.html](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/biology-processes-database/biology-database-table.html) |
| **Biology theme collections** | [GCS — collections/index.html](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/biology-processes-database/collections/index.html) |
| **Mathematics named collections** | [GCS — collections/index.html](https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/collections/index.html) |

## Repository layout

```
progframe/
├── programming_framework/   # Static Space: index, discipline hubs, batches, validation charts, data, generator
├── generate_collections.py           # Math named collection pages → copernicus math DB
├── add_named_collections.py          # Math metadata namedCollections
├── generate_biology_collections.py   # Biology theme collection pages
├── add_biology_named_collections.py  # Biology metadata namedCollections + collectionStats
├── upload-mathematics-database-to-gcs.sh
├── upload-biology-database-to-gcs.sh
├── add_attributions.py
└── …
```

Generator scripts that write into **`copernicus-web-public/huggingface-space/...`** use absolute paths on the author’s machine; adjust `DB_ROOT` / `METADATA` in those scripts if your clone differs.

## Local preview

Open `programming_framework/index.html` in a browser, or serve the folder:

```bash
cd programming_framework && python3 -m http.server 8080
# Visit http://localhost:8080/
```

## Deploying to Google Cloud Storage

Requires [gsutil](https://cloud.google.com/storage/docs/gsutil) authenticated to the target bucket.

```bash
cd /path/to/progframe
./upload-mathematics-database-to-gcs.sh
./upload-biology-database-to-gcs.sh
```

Biology bucket CORS (for embedded iframes) is documented under the biology database tree: `GCS_CORS.md` next to `cors.json` in `biology-processes-database/`.

## Hugging Face Space

The Space card and long description are driven by **`programming_framework/README.md`** (YAML frontmatter + Markdown). After editing, push the Space repo so Hugging Face rebuilds — same files as this folder when the Space is synced from GitHub, or push directly to `https://huggingface.co/spaces/garywelz/programming_framework`.

## License

See [LICENSE](LICENSE) (MIT).
