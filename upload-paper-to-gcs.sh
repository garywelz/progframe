#!/bin/bash
# Upload GLMP paper series (Papers I, II, III) to GCS
# Run from progframe: ./upload-paper-to-gcs.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database"
BUCKET="gs://regal-scholar-453620-r7-podcast-storage/mathematics-processes-database"
GCS_BASE="https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database"

PAPER1="$SCRIPT_DIR/GLMP_Foundational_Typology.html"
PAPER2="$SCRIPT_DIR/genome_as_computer_v2 (1).html"
PAPER2_GCS_NAME="genome_as_computer_v2.html"
PAPER3="$SCRIPT_DIR/empirical_sequel_draft.html"
PAPER3_GCS_NAME="empirical_sequel_draft.html"

upload_paper() {
    local src="$1" gcs_name="$2" label="$3"
    if [ -f "$src" ]; then
        echo ""
        echo "=== $label ==="
        echo "Syncing to copernicus DB directory..."
        cp "$src" "$DB_DIR/$gcs_name"
        echo "Uploading $gcs_name to GCS..."
        gsutil -h "Cache-Control:no-cache, max-age=0" cp "$DB_DIR/$gcs_name" "$BUCKET/"
    else
        echo "Warning: $label not found at $src — skipping"
    fi
}

if [ ! -f "$PAPER1" ]; then
    echo "Error: Paper I not found at $PAPER1"
    exit 1
fi

upload_paper "$PAPER1" "GLMP_Foundational_Typology.html" "Paper I: Foundational Typology"
upload_paper "$PAPER2" "$PAPER2_GCS_NAME"                "Paper II: The Genome as Computer"
upload_paper "$PAPER3" "$PAPER3_GCS_NAME"                "Paper III: Empirical Test"

echo ""
echo "Done! View at:"
echo "  $GCS_BASE/GLMP_Foundational_Typology.html"
echo "  $GCS_BASE/genome_as_computer_v2.html"
echo "  $GCS_BASE/empirical_sequel_draft.html"
