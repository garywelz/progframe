#!/bin/bash
# Build (if needed) and upload Chemistry Processes Database to GCS.
# Run from progframe repo root: ./upload-chemistry-database-to-gcs.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="$SCRIPT_DIR/programming_framework/chemistry-processes-database"
BUCKET="gs://regal-scholar-453620-r7-podcast-storage/chemistry-processes-database"

if [ ! -d "$DB_DIR" ]; then
  echo "Error: $DB_DIR not found"
  exit 1
fi

echo "Regenerating chemistry database from source batches..."
python3 "$SCRIPT_DIR/build_chemistry_database.py"

echo "Uploading to $BUCKET ..."
gsutil -h "Cache-Control:no-cache, max-age=0" cp "$DB_DIR/metadata.json" "$BUCKET/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp "$DB_DIR/chemistry-database-table.html" "$BUCKET/"
gsutil -m -h "Cache-Control:no-cache, max-age=0" rsync -r "$DB_DIR/batches" "$BUCKET/batches"

echo "✅ Chemistry database upload complete."
echo "   Table: https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/chemistry-processes-database/chemistry-database-table.html"
