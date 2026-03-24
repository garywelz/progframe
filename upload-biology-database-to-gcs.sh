#!/bin/bash
# Upload Biology Processes Database to GCS
# Run from progframe: ./upload-biology-database-to-gcs.sh

set -e

DB_DIR="/home/gdubs/copernicus-web-public/huggingface-space/biology-processes-database"
BUCKET="gs://regal-scholar-453620-r7-podcast-storage/biology-processes-database"

if [ ! -d "$DB_DIR" ]; then
    echo "Error: Biology database not found at $DB_DIR"
    exit 1
fi

echo "Uploading Biology Processes Database to GCS..."
cd "$DB_DIR"

# Upload metadata and table (with cache bust for fresh fetch)
gsutil -h "Cache-Control:no-cache, max-age=0" cp metadata.json "$BUCKET/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp biology-database-table.html "$BUCKET/"

# Theme collections (index + theme pages)
if [ -d "collections" ]; then
    echo "Uploading theme collections..."
    gsutil -m -h "Cache-Control:no-cache, max-age=0" cp -r collections "$BUCKET/"
    echo "   Uploaded collections/ (index + theme pages)"
fi

# Upload all process HTML files
gsutil -h "Cache-Control:no-cache, max-age=0" -m cp -r processes/pathways/* "$BUCKET/processes/pathways/"
gsutil -h "Cache-Control:no-cache, max-age=0" -m cp -r processes/mechanisms/* "$BUCKET/processes/mechanisms/"
gsutil -h "Cache-Control:no-cache, max-age=0" -m cp -r processes/assay_protocols/* "$BUCKET/processes/assay_protocols/"

echo "✅ Biology database upload complete."
