# Chemistry processes database (GCS)

Searchable table + **56** process entries (Mermaid flowcharts) derived from `programming_framework/chemistry_batch_01.html`–`chemistry_batch_14.html`.

## Build

From repo root:

```bash
python3 build_chemistry_database.py
```

This writes (do not edit by hand):

- `metadata.json` — process index for the table page
- `chemistry-database-table.html` — filterable table (loads `metadata.json` from the same folder)
- `batches/chemistry_batch_XX.html` — copies with anchor `id`s and navigation for the `batches/` URL layout on GCS

Source batches under `programming_framework/` are **not** modified.

## Upload

Requires `gcloud`/`gsutil` credentials with write access to the bucket:

```bash
./upload-chemistry-database-to-gcs.sh
```

## Optional: Hugging Face Space

The static Space does not need this folder; you can exclude `chemistry-processes-database/` from rsync to HF if you want a smaller deploy. The live table is intended for GCS.

## Parity with mathematics database (research UX)

When extending chemistry, preserve the same *researcher-facing* patterns used on the mathematics table and chart pages (see also `programming_framework/ATTRIBUTION_SCHEMA.md`, `NEXT_PASS_CHECKLIST.md`, `NEXT_STEPS_PLAN.md`).

| Feature | Mathematics behavior | Chemistry direction |
|--------|----------------------|---------------------|
| **Frontier** | Links to **arXiv** “recent” lists (and similar) tied to subject area / metadata | **Implemented:** each process row has `frontierUrl` / `frontierLabel` (from `FRONTIER_BY_SLUG` in `build_chemistry_database.py`); table has a **Frontier** column. Edit that dict to change hubs. |
| **Cite** | “Cite” control in header with **hover/focus popover** (attribution: primary source, year, DOI, URL) | Reuse the same **popover pattern**; add optional `attribution` / cite block per process in metadata and inject into generated batch HTML headers |
| **Breadcrumbs** | Trail such as Database → domain → subcategory → chart | **Chemistry database table → branch → batch → process** (and mirror on batch pages when served from GCS) |
| **Search / filters** | Rich filters, named collections, keywords in metadata | Already: branch filter + title search; add **keywords**, **namedCollections** (themes), optional **fuzzy** search |
| **Navigation** | `storage.googleapis.com` vs local base detection for “Back to table” | Already partially on GCS batch copies; keep **one resolver** pattern like math |
| **Related / collections** | Named collections index, cross-links | Optional **theme pages** (e.g. electrochemistry, spectroscopy) like biology `collections/` |
| **Provenance / era** | Optional year, `frontierStatus`, tags in metadata | Same fields where they help (review article, classic text, computational workflow) |

Implement by extending **`build_chemistry_database.py`** + **`metadata.json`** first, then the **table HTML** and **generated batch** header template — no need to fork the math page verbatim; match behaviors and schema where possible.
