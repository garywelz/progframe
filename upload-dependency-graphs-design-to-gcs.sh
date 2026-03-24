#!/bin/bash
# Upload Mathematical Dependency Graphs design documents to GCS
# Run from progframe: ./upload-dependency-graphs-design-to-gcs.sh

set -e

BUCKET="gs://regal-scholar-453620-r7-podcast-storage"
DESIGN_DIR="/home/gdubs/progframe/programming_framework"
GCS_PATH="mathematics-dependency-graphs/design"

if [ ! -d "$DESIGN_DIR" ]; then
    echo "Error: Design directory not found at $DESIGN_DIR"
    exit 1
fi

echo "Uploading Mathematical Dependency Graphs design to GCS..."
cd "$DESIGN_DIR"

# Create the GCS path (gsutil cp will create directories as needed)
gsutil cp dependency-graphs-design.html "$BUCKET/$GCS_PATH/"
gsutil cp MATHEMATICAL_DEPENDENCY_GRAPHS_DESIGN.md "$BUCKET/$GCS_PATH/"
gsutil cp discourse-schema.json "$BUCKET/$GCS_PATH/"

echo ""
echo "Done! View at:"
echo "  https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/$GCS_PATH/dependency-graphs-design.html"
echo ""
echo "Or:"
echo "  https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/$GCS_PATH/MATHEMATICAL_DEPENDENCY_GRAPHS_DESIGN.md"
echo "  https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/$GCS_PATH/discourse-schema.json"
