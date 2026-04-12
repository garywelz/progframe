# Mathematics Processes Database — mirrored index files

These files are the **canonical copies in git** for the public mathematics database:

- `metadata.json` — process list, counts, and statistics consumed by `mathematics-database-table.html`
- `mathematics-database-table.html` — algorithms + axiomatic theories index page

`upload-mathematics-database-to-gcs.sh` (run from the **progframe** repo root) copies them into the Copernicus `mathematics-processes-database` folder, then uploads to GCS with the rest of that project.

Edit here first; regenerate or merge other tooling into this `metadata.json` when you add charts, then commit and run the upload script.
