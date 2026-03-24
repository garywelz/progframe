#!/bin/bash
# Delete generic chart files from GCS (run after local deletion and metadata update)
# Run from progframe: ./delete-generic-charts-from-gcs.sh
# Requires: gcloud auth login (and gsutil in PATH)

BUCKET="gs://regal-scholar-453620-r7-podcast-storage/mathematics-processes-database"

echo "Deleting generic charts from GCS..."
echo "If you see 'Permission denied' or 403 errors, run: gcloud auth login"
echo ""

gsutil rm "$BUCKET/processes/abstract_algebra/abstract_algebra-field-theory.html" || echo "  (skip or not found: field-theory.html)"
gsutil rm "$BUCKET/processes/abstract_algebra/abstract_algebra-field-theory.json" || true
gsutil rm "$BUCKET/processes/abstract_algebra/abstract_algebra-ring-theory.html" || true
gsutil rm "$BUCKET/processes/abstract_algebra/abstract_algebra-ring-theory.json" || true
gsutil rm "$BUCKET/processes/calculus_analysis/calculus_analysis-derivative-calculation.html" || true
gsutil rm "$BUCKET/processes/calculus_analysis/calculus_analysis-derivative-calculation.json" || true
gsutil rm "$BUCKET/processes/discrete_mathematics/discrete_mathematics-statistical-analysis.html" || true
gsutil rm "$BUCKET/processes/discrete_mathematics/discrete_mathematics-statistical-analysis.json" || true
gsutil rm "$BUCKET/processes/geometry_topology/geometry_topology-logic-set-theory.html" || true
gsutil rm "$BUCKET/processes/geometry_topology/geometry_topology-logic-set-theory.json" || true
gsutil rm "$BUCKET/processes/linear_algebra/linear_algebra-differential-geometry.html" || true
gsutil rm "$BUCKET/processes/linear_algebra/linear_algebra-differential-geometry.json" || true
gsutil rm "$BUCKET/processes/linear_algebra/linear_algebra-euclidean-geometry.html" || true
gsutil rm "$BUCKET/processes/linear_algebra/linear_algebra-euclidean-geometry.json" || true
gsutil rm "$BUCKET/processes/linear_algebra/linear_algebra-topology.html" || true
gsutil rm "$BUCKET/processes/linear_algebra/linear_algebra-topology.json" || true
gsutil rm "$BUCKET/processes/number_theory/number_theory-diophantine-equations.html" || true
gsutil rm "$BUCKET/processes/number_theory/number_theory-diophantine-equations.json" || true

# Additional generic charts (not in metadata)
gsutil rm "$BUCKET/processes/calculus_analysis/calculus_analysis-integral-calculation.html" || true
gsutil rm "$BUCKET/processes/calculus_analysis/calculus_analysis-integral-calculation.json" || true
gsutil rm "$BUCKET/processes/calculus_analysis/calculus_analysis-limit-calculation.html" || true
gsutil rm "$BUCKET/processes/calculus_analysis/calculus_analysis-limit-calculation.json" || true
gsutil rm "$BUCKET/processes/number_theory/number_theory-modular-arithmetic.html" || true
gsutil rm "$BUCKET/processes/number_theory/number_theory-modular-arithmetic.json" || true
gsutil rm "$BUCKET/processes/discrete_mathematics/discrete_mathematics-cryptographic-algorithms.html" || true
gsutil rm "$BUCKET/processes/discrete_mathematics/discrete_mathematics-cryptographic-algorithms.json" || true
gsutil rm "$BUCKET/processes/geometry_topology/geometry_topology-graph-theory-algorithms.html" || true
gsutil rm "$BUCKET/processes/geometry_topology/geometry_topology-graph-theory-algorithms.json" || true

echo "Done. Run upload-mathematics-database-to-gcs.sh to upload updated metadata."
