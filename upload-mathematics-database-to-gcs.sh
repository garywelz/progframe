#!/bin/bash
# Upload Mathematics Processes Database (including Euclid's Elements chart) to GCS
# Run from progframe: ./upload-mathematics-database-to-gcs.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database"
BUCKET="gs://regal-scholar-453620-r7-podcast-storage/mathematics-processes-database"

if [ ! -d "$DB_DIR" ]; then
    echo "Error: Mathematics database not found at $DB_DIR"
    exit 1
fi

echo "Uploading Mathematics Processes Database to GCS..."
cd "$DB_DIR"

# Re-run graph analysis (OR gates, Loops, AND gates) before upload
if [ -f "analyze-algorithm-graphs.py" ]; then
    echo "Running graph analysis..."
    python3 analyze-algorithm-graphs.py
fi

# Build Whole of Mathematics graph data
if [ -f "build-graph-data.js" ]; then
    echo "Building graph data..."
    node build-graph-data.js
fi

# Canonical index files live in progframe; copy into DB_DIR before upload (like ZFC index)
PF_MATH_DIR="$SCRIPT_DIR/programming_framework/mathematics-processes-database"
PF_MATH_META="$PF_MATH_DIR/metadata.json"
PF_MATH_TABLE="$PF_MATH_DIR/mathematics-database-table.html"
if [ -f "$PF_MATH_META" ]; then
  cp "$PF_MATH_META" "$DB_DIR/metadata.json"
  echo "Synced metadata.json from progframe → copernicus DB"
fi
if [ -f "$PF_MATH_TABLE" ]; then
  cp "$PF_MATH_TABLE" "$DB_DIR/mathematics-database-table.html"
  echo "Synced mathematics-database-table.html from progframe → copernicus DB"
fi

# Upload metadata (with cache bust for fresh fetch)
gsutil -h "Cache-Control:no-cache, max-age=0" cp metadata.json "$BUCKET/"

# Upload Whole of Mathematics visualization
gsutil -h "Cache-Control:no-cache, max-age=0" cp whole-of-mathematics.html "$BUCKET/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp graph-data.json "$BUCKET/"

# Upload database table (Algorithms + Axiomatic Theories sections)
gsutil -h "Cache-Control:no-cache, max-age=0" cp mathematics-database-table.html "$BUCKET/"

# Upload Number Theory Research Frontier sample
gsutil -h "Cache-Control:no-cache, max-age=0" cp number-theory-research-frontier.html "$BUCKET/"

# GLMP foundational typology (working paper; source in progframe repo)
PF_GLMP_TYPOLOGY="$SCRIPT_DIR/GLMP_Foundational_Typology.html"
if [ -f "$PF_GLMP_TYPOLOGY" ]; then
  cp "$PF_GLMP_TYPOLOGY" "$DB_DIR/GLMP_Foundational_Typology.html"
  echo "Synced GLMP_Foundational_Typology.html from progframe → copernicus DB"
fi
if [ -f "GLMP_Foundational_Typology.html" ]; then
  gsutil -h "Cache-Control:no-cache, max-age=0" cp GLMP_Foundational_Typology.html "$BUCKET/"
fi

# Upload Named Collections (mathematicians & theorems)
if [ -d "collections" ]; then
    echo "Uploading Named Collections..."
    gsutil -m -h "Cache-Control:no-cache, max-age=0" cp -r collections "$BUCKET/"
    echo "   Uploaded collections/ (index + 95 collection pages)"
fi

# Upload Euclid chart files
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-i-1-5.json "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-i-1-5.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book I (full) files
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-i.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-i-definitions.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-i-props-1-10.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-i-props-11-20.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-i-props-21-30.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-i-props-31-41.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-i-props-42-48.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book II
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-ii.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid master index (all books)
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book III
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-iii.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-iii-props-1-5.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-iii-props-6-20.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-iii-props-21-37.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book IV
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-iv.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-iv-props-1-5.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-iv-props-6-16.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book V
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-v.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-v-props-1-8.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-v-props-9-16.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-v-props-17-25.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book VI
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-vi.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-vi-props-1-11.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-vi-props-12-22.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-vi-props-23-33.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book VII
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-vii.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-vii-props-1-10.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-vii-props-11-20.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-vii-props-21-30.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-vii-props-31-39.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book VIII
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-viii.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-viii-props-1-14.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-viii-props-15-27.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book IX
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-ix.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-ix-props-1-12.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-ix-props-13-24.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-ix-props-25-36.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book X
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-x.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-x-props-1-15.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-x-props-16-30.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-x-props-31-45.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-x-props-46-60.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-x-props-61-75.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-x-props-76-90.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-x-props-91-105.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-x-props-106-115.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book XI
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xi.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xi-props-1-13.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xi-props-14-26.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xi-props-27-39.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book XII
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xii.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xii-props-1-9.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xii-props-10-18.html "$BUCKET/processes/geometry_topology/"

# Upload Euclid Book XIII
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xiii.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xiii-props-1-9.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-euclid-elements-book-xiii-props-10-18.html "$BUCKET/processes/geometry_topology/"

# Upload Axiomatic Set Theory (ZFC)
# Optional: copy curated index from progframe repo (Cantor / CH / GCH narrative, etc.)
PF_ZFC_INDEX="$SCRIPT_DIR/programming_framework/processes/foundations/foundations-axiomatic-set-theory.html"
if [ -f "$PF_ZFC_INDEX" ]; then
  cp "$PF_ZFC_INDEX" "$DB_DIR/processes/foundations/foundations-axiomatic-set-theory.html"
  echo "Synced foundations-axiomatic-set-theory.html from progframe → copernicus DB"
fi
PF_ZFC_CANTOR="$SCRIPT_DIR/programming_framework/processes/foundations/foundations-axiomatic-set-theory-cantor-cardinality.html"
if [ -f "$PF_ZFC_CANTOR" ]; then
  cp "$PF_ZFC_CANTOR" "$DB_DIR/processes/foundations/foundations-axiomatic-set-theory-cantor-cardinality.html"
  echo "Synced foundations-axiomatic-set-theory-cantor-cardinality.html from progframe → copernicus DB"
fi
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/foundations/foundations-axiomatic-set-theory.html "$BUCKET/processes/foundations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/foundations/foundations-axiomatic-set-theory-axioms-basic.html "$BUCKET/processes/foundations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/foundations/foundations-axiomatic-set-theory-definitions-derived.html "$BUCKET/processes/foundations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/foundations/foundations-axiomatic-set-theory-ordinals-choice.html "$BUCKET/processes/foundations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/foundations/foundations-axiomatic-set-theory-cantor-cardinality.html "$BUCKET/processes/foundations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/foundations/foundations-axiomatic-set-theory-ch-continuum.html "$BUCKET/processes/foundations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/foundations/foundations-axiomatic-set-theory-forcing.html "$BUCKET/processes/foundations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/foundations/foundations-axiomatic-set-theory-ad.html "$BUCKET/processes/foundations/"

# Upload Category Theory
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/category_theory/category_theory-category-theory.html "$BUCKET/processes/category_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/category_theory/category_theory-category-theory-foundations.html "$BUCKET/processes/category_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/category_theory/category_theory-category-theory-natural-transformations.html "$BUCKET/processes/category_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/category_theory/category_theory-category-theory-limits-adjunctions.html "$BUCKET/processes/category_theory/"

# Upload Algebraic Geometry
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/algebraic_geometry/algebraic_geometry.html "$BUCKET/processes/algebraic_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/algebraic_geometry/algebraic_geometry-affine-projective.html "$BUCKET/processes/algebraic_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/algebraic_geometry/algebraic_geometry-schemes-sheaves.html "$BUCKET/processes/algebraic_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/algebraic_geometry/algebraic_geometry-morphisms-rational.html "$BUCKET/processes/algebraic_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/algebraic_geometry/algebraic_geometry-cohomology.html "$BUCKET/processes/algebraic_geometry/"

# Upload Representation Theory
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/representation_theory/representation_theory.html "$BUCKET/processes/representation_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/representation_theory/representation_theory-group-reps.html "$BUCKET/processes/representation_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/representation_theory/representation_theory-characters.html "$BUCKET/processes/representation_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/representation_theory/representation_theory-lie-algebras.html "$BUCKET/processes/representation_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/representation_theory/representation_theory-schur-weyl.html "$BUCKET/processes/representation_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/representation_theory/representation_theory-induced-restricted.html "$BUCKET/processes/representation_theory/"

# Upload Commutative Algebra
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/commutative_algebra/commutative_algebra.html "$BUCKET/processes/commutative_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/commutative_algebra/commutative_algebra-noetherian.html "$BUCKET/processes/commutative_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/commutative_algebra/commutative_algebra-localization.html "$BUCKET/processes/commutative_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/commutative_algebra/commutative_algebra-primary-decomp.html "$BUCKET/processes/commutative_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/commutative_algebra/commutative_algebra-dimension.html "$BUCKET/processes/commutative_algebra/"

# Upload PDEs
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/partial_differential_equations/partial_differential_equations.html "$BUCKET/processes/partial_differential_equations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/partial_differential_equations/partial_differential_equations-classical.html "$BUCKET/processes/partial_differential_equations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/partial_differential_equations/partial_differential_equations-wellposed.html "$BUCKET/processes/partial_differential_equations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/partial_differential_equations/partial_differential_equations-sobolev.html "$BUCKET/processes/partial_differential_equations/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/partial_differential_equations/partial_differential_equations-maximum.html "$BUCKET/processes/partial_differential_equations/"

# Upload Differential Geometry
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/differential_geometry/differential_geometry.html "$BUCKET/processes/differential_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/differential_geometry/differential_geometry-manifolds.html "$BUCKET/processes/differential_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/differential_geometry/differential_geometry-riemannian.html "$BUCKET/processes/differential_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/differential_geometry/differential_geometry-connections.html "$BUCKET/processes/differential_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/differential_geometry/differential_geometry-forms.html "$BUCKET/processes/differential_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/differential_geometry/differential_geometry-minimal-surfaces.html "$BUCKET/processes/differential_geometry/"

# Upload Spectral Theory
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/spectral_theory/spectral_theory.html "$BUCKET/processes/spectral_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/spectral_theory/spectral_theory-spectrum.html "$BUCKET/processes/spectral_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/spectral_theory/spectral_theory-selfadjoint.html "$BUCKET/processes/spectral_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/spectral_theory/spectral_theory-compact.html "$BUCKET/processes/spectral_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/spectral_theory/spectral_theory-schrodinger.html "$BUCKET/processes/spectral_theory/"

# Upload Symplectic Geometry
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/symplectic_geometry/symplectic_geometry.html "$BUCKET/processes/symplectic_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/symplectic_geometry/symplectic_geometry-form.html "$BUCKET/processes/symplectic_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/symplectic_geometry/symplectic_geometry-hamiltonian.html "$BUCKET/processes/symplectic_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/symplectic_geometry/symplectic_geometry-darboux.html "$BUCKET/processes/symplectic_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/symplectic_geometry/symplectic_geometry-poisson.html "$BUCKET/processes/symplectic_geometry/"

# Upload Metric Geometry
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/metric_geometry/metric_geometry.html "$BUCKET/processes/metric_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/metric_geometry/metric_geometry-metric-spaces.html "$BUCKET/processes/metric_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/metric_geometry/metric_geometry-geodesics.html "$BUCKET/processes/metric_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/metric_geometry/metric_geometry-curvature.html "$BUCKET/processes/metric_geometry/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/metric_geometry/metric_geometry-hyperbolic.html "$BUCKET/processes/metric_geometry/"

# Upload Priority 3: Operator Algebras, K-Theory, Quantum Algebra, Optimization, Information Theory, Mathematical Physics
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/operator_algebras/operator_algebras.html "$BUCKET/processes/operator_algebras/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/operator_algebras/operator_algebras-cstar.html "$BUCKET/processes/operator_algebras/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/operator_algebras/operator_algebras-vonneumann.html "$BUCKET/processes/operator_algebras/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/operator_algebras/operator_algebras-gns.html "$BUCKET/processes/operator_algebras/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/operator_algebras/operator_algebras-spectral.html "$BUCKET/processes/operator_algebras/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/k_theory/k_theory.html "$BUCKET/processes/k_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/k_theory/k_theory-algebraic.html "$BUCKET/processes/k_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/k_theory/k_theory-topological.html "$BUCKET/processes/k_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/k_theory/k_theory-operator.html "$BUCKET/processes/k_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/k_theory/k_theory-bott.html "$BUCKET/processes/k_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/quantum_algebra/quantum_algebra.html "$BUCKET/processes/quantum_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/quantum_algebra/quantum_algebra-groups.html "$BUCKET/processes/quantum_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/quantum_algebra/quantum_algebra-hopf.html "$BUCKET/processes/quantum_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/quantum_algebra/quantum_algebra-operads.html "$BUCKET/processes/quantum_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/quantum_algebra/quantum_algebra-yangbaxter.html "$BUCKET/processes/quantum_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/optimization/optimization.html "$BUCKET/processes/optimization/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/optimization/optimization-linear.html "$BUCKET/processes/optimization/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/optimization/optimization-simplex.html "$BUCKET/processes/optimization/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/optimization/optimization-duality.html "$BUCKET/processes/optimization/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/optimization/optimization-control.html "$BUCKET/processes/optimization/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/information_theory/information_theory.html "$BUCKET/processes/information_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/information_theory/information_theory-entropy.html "$BUCKET/processes/information_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/information_theory/information_theory-channel.html "$BUCKET/processes/information_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/information_theory/information_theory-coding.html "$BUCKET/processes/information_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/information_theory/information_theory-rate.html "$BUCKET/processes/information_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/mathematical_physics/mathematical_physics.html "$BUCKET/processes/mathematical_physics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/mathematical_physics/mathematical_physics-classical.html "$BUCKET/processes/mathematical_physics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/mathematical_physics/mathematical_physics-quantum.html "$BUCKET/processes/mathematical_physics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/mathematical_physics/mathematical_physics-field.html "$BUCKET/processes/mathematical_physics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/mathematical_physics/mathematical_physics-statmech.html "$BUCKET/processes/mathematical_physics/"

# Upload Group Theory (axiom-theorem dependency graphs)
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-group-theory.html "$BUCKET/processes/abstract_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-group-theory-axioms-foundations.html "$BUCKET/processes/abstract_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-group-theory-subgroups-lagrange.html "$BUCKET/processes/abstract_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-group-theory-homomorphisms.html "$BUCKET/processes/abstract_algebra/"

# Upload Ring Theory
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-ring-theory.html "$BUCKET/processes/abstract_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-ring-theory-axioms-units.html "$BUCKET/processes/abstract_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-ring-theory-ideals-quotients.html "$BUCKET/processes/abstract_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-ring-theory-prime-maximal.html "$BUCKET/processes/abstract_algebra/"

# Upload Field Theory
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-field-theory.html "$BUCKET/processes/abstract_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-field-theory-extensions.html "$BUCKET/processes/abstract_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-field-theory-splitting.html "$BUCKET/processes/abstract_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/abstract_algebra/abstract_algebra-field-theory-galois.html "$BUCKET/processes/abstract_algebra/"

# Upload Real Analysis
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-real-analysis.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-real-analysis-completeness.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-real-analysis-limits-continuity.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-real-analysis-differentiation.html "$BUCKET/processes/calculus_analysis/"

# Upload Linear Algebra
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/linear_algebra/linear_algebra-linear-algebra.html "$BUCKET/processes/linear_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/linear_algebra/linear_algebra-linear-algebra-vector-spaces.html "$BUCKET/processes/linear_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/linear_algebra/linear_algebra-linear-algebra-linear-maps.html "$BUCKET/processes/linear_algebra/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/linear_algebra/linear_algebra-linear-algebra-eigenvalues.html "$BUCKET/processes/linear_algebra/"

# Upload Combinatorics
gsutil cp processes/geometry_topology/geometry_topology-combinatorics.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-combinatorics-principles-permutations.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-combinatorics-combinations-binomial.html "$BUCKET/processes/geometry_topology/"
gsutil cp processes/geometry_topology/geometry_topology-combinatorics-advanced-counting.html "$BUCKET/processes/geometry_topology/"

# Upload Topology dependency charts
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-topology-index.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-point-set-topology-props-1-15.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-point-set-topology-props-16-30.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-point-set-topology-props-31-45.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-point-set-topology-props-46-60.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-algebraic-topology-props-1-15.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-algebraic-topology-props-16-30.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-algebraic-topology-props-31-45.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-algebraic-topology-props-46-60.html "$BUCKET/processes/geometry_topology/"

# Upload Dennis Sullivan Collection (rational homotopy, complex dynamics, string topology)
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-sullivan-collection.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-de-rham-cohomology.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-homotopy-theory-basics.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-sullivan-minimal-models.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-string-topology.html "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-complex-dynamics-julia-fatou.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-measurable-riemann-mapping.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-sullivan-no-wandering-domains.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-sullivan-dictionary.html "$BUCKET/processes/calculus_analysis/"

# Upload Hubbard & Douady — Mandelbrot Set
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-hubbard-douady-collection.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-quadratic-julia-mandelbrot.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-boettcher-external-rays.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-douady-hubbard-mandelbrot-connected.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-polynomial-like-maps.html "$BUCKET/processes/calculus_analysis/"

# Upload Robert L. Devaney Collection
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-devaney-collection.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-devaney-chaos-definition.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-symbolic-dynamics.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-devaney-hairs-cantor-bouquet.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-sierpinski-curve-julia.html "$BUCKET/processes/calculus_analysis/"

# Upload Bioinformatics (Krampis / CUNY GC / Hunter College)
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/bioinformatics/bioinformatics-collection.html "$BUCKET/processes/bioinformatics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/bioinformatics/bioinformatics-sequence-alignment-nw-sw.html "$BUCKET/processes/bioinformatics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/bioinformatics/bioinformatics-blast-algorithm.html "$BUCKET/processes/bioinformatics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/bioinformatics/bioinformatics-hmm-sequence-analysis.html "$BUCKET/processes/bioinformatics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/bioinformatics/bioinformatics-phylogenetic-trees.html "$BUCKET/processes/bioinformatics/"

# Upload Statistics & Probability
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/statistics_probability/statistics_probability.html "$BUCKET/processes/statistics_probability/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/statistics_probability/statistics_probability-kolmogorov-axioms.html "$BUCKET/processes/statistics_probability/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/statistics_probability/statistics_probability-bayes-theorem.html "$BUCKET/processes/statistics_probability/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/statistics_probability/statistics_probability-central-limit-theorem.html "$BUCKET/processes/statistics_probability/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/statistics_probability/statistics_probability-law-of-large-numbers.html "$BUCKET/processes/statistics_probability/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/statistics_probability/statistics_probability-markov-chains.html "$BUCKET/processes/statistics_probability/"

# Upload Complex Analysis
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/complex_analysis/complex_analysis.html "$BUCKET/processes/complex_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/complex_analysis/complex_analysis-analytic-cauchy-riemann.html "$BUCKET/processes/complex_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/complex_analysis/complex_analysis-cauchy-residue.html "$BUCKET/processes/complex_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/complex_analysis/complex_analysis-conformal-mappings.html "$BUCKET/processes/complex_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/complex_analysis/complex_analysis-entire-picard.html "$BUCKET/processes/complex_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/complex_analysis/complex_analysis-singularities-laurent.html "$BUCKET/processes/complex_analysis/"

# Upload Numerical Analysis
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/numerical_analysis/numerical_analysis.html "$BUCKET/processes/numerical_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/numerical_analysis/numerical_analysis-quadrature.html "$BUCKET/processes/numerical_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/numerical_analysis/numerical_analysis-ode-solvers.html "$BUCKET/processes/numerical_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/numerical_analysis/numerical_analysis-linear-direct.html "$BUCKET/processes/numerical_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/numerical_analysis/numerical_analysis-iterative.html "$BUCKET/processes/numerical_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/numerical_analysis/numerical_analysis-interpolation.html "$BUCKET/processes/numerical_analysis/"

# Upload Functional Analysis
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/functional_analysis/functional_analysis.html "$BUCKET/processes/functional_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/functional_analysis/functional_analysis-banach-spaces.html "$BUCKET/processes/functional_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/functional_analysis/functional_analysis-hilbert-spaces.html "$BUCKET/processes/functional_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/functional_analysis/functional_analysis-distributions.html "$BUCKET/processes/functional_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/functional_analysis/functional_analysis-bounded-operators.html "$BUCKET/processes/functional_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/functional_analysis/functional_analysis-compact-spectral.html "$BUCKET/processes/functional_analysis/"

# Upload Aristotle Syllogistic
gsutil cp processes/discrete_mathematics/discrete_mathematics-aristotle-syllogistic.html "$BUCKET/processes/discrete_mathematics/"
gsutil cp processes/discrete_mathematics/discrete_mathematics-aristotle-syllogistic-foundations-perfect.html "$BUCKET/processes/discrete_mathematics/"
gsutil cp processes/discrete_mathematics/discrete_mathematics-aristotle-syllogistic-figure-2.html "$BUCKET/processes/discrete_mathematics/"
gsutil cp processes/discrete_mathematics/discrete_mathematics-aristotle-syllogistic-figure-3.html "$BUCKET/processes/discrete_mathematics/"

# Upload Type Theory
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-type-theory.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-type-theory-lambda.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-type-theory-typing.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-type-theory-normalization.html "$BUCKET/processes/discrete_mathematics/"

# Upload Model Theory
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-model-theory.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-model-theory-structures.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-model-theory-elementary.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-model-theory-compactness.html "$BUCKET/processes/discrete_mathematics/"

# Upload Proof Theory
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-proof-theory.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-proof-theory-sequents.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-proof-theory-cut-elimination.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-proof-theory-normalization.html "$BUCKET/processes/discrete_mathematics/"

# Upload Propositional Logic
gsutil cp processes/discrete_mathematics/discrete_mathematics-propositional-logic.html "$BUCKET/processes/discrete_mathematics/"
gsutil cp processes/discrete_mathematics/discrete_mathematics-propositional-logic-axioms-implication.html "$BUCKET/processes/discrete_mathematics/"
gsutil cp processes/discrete_mathematics/discrete_mathematics-propositional-logic-definitions-connectives.html "$BUCKET/processes/discrete_mathematics/"
gsutil cp processes/discrete_mathematics/discrete_mathematics-propositional-logic-tautologies-metalogic.html "$BUCKET/processes/discrete_mathematics/"

# Upload Number Theory index and charts
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory.html "$BUCKET/processes/number_theory/"
gsutil cp processes/number_theory/number_theory-peano-arithmetic.html "$BUCKET/processes/number_theory/"
gsutil cp processes/number_theory/number_theory-peano-arithmetic-axioms-foundations.html "$BUCKET/processes/number_theory/"
gsutil cp processes/number_theory/number_theory-peano-arithmetic-addition-multiplication.html "$BUCKET/processes/number_theory/"
gsutil cp processes/number_theory/number_theory-peano-arithmetic-order-induction.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-peano-arithmetic-godel-fol.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-peano-arithmetic-godel-formalization.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-peano-arithmetic-godel-completeness.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-peano-arithmetic-godel-incompleteness-1.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-peano-arithmetic-godel-incompleteness-2.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-peano-arithmetic-paris-harrington.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-peano-arithmetic-paris-goodstein.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-peano-arithmetic-paris-hydra.html "$BUCKET/processes/number_theory/"

# Upload Szemerédi & Green-Tao Theorems (additive combinatorics)
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-szemeredi-theorem.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-green-tao-theorem.html "$BUCKET/processes/number_theory/"

# Upload Primality Tests
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-fermat-primality.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-miller-rabin.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-aks-primality.html "$BUCKET/processes/number_theory/"

# Upload Chinese Remainder Theorem & Fermat's Last Theorem & Riemann Hypothesis
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-chinese-remainder-theorem.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-fermat-last-theorem.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-riemann-hypothesis.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-prime-number-generation.html "$BUCKET/processes/number_theory/" 2>/dev/null || true

# Upload Binary Search (NIST DADS) files
gsutil cp processes/discrete_mathematics/discrete_mathematics-binary-search.json "$BUCKET/processes/discrete_mathematics/"
gsutil cp processes/discrete_mathematics/discrete_mathematics-binary-search.html "$BUCKET/processes/discrete_mathematics/"

# Upload Sieve of Eratosthenes (Batch 1)
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-sieve-of-eratosthenes.json "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-sieve-of-eratosthenes.html "$BUCKET/processes/number_theory/"

# Upload Newton-Raphson (Batch 1)
gsutil cp processes/discrete_mathematics/discrete_mathematics-numerical-methods.json "$BUCKET/processes/discrete_mathematics/"
gsutil cp processes/discrete_mathematics/discrete_mathematics-numerical-methods.html "$BUCKET/processes/discrete_mathematics/"

# Upload Batch 2 algorithms
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-bisection-method.json "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-bisection-method.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-extended-euclidean.json "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/number_theory/number_theory-extended-euclidean.html "$BUCKET/processes/number_theory/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-dijkstra-algorithm.json "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-dijkstra-algorithm.html "$BUCKET/processes/geometry_topology/"

# Upload Batch 3 algorithms
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-rsa-algorithm.json "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-rsa-algorithm.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-simpsons-rule.json "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/calculus_analysis/calculus_analysis-simpsons-rule.html "$BUCKET/processes/calculus_analysis/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-kruskal-algorithm.json "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-kruskal-algorithm.html "$BUCKET/processes/geometry_topology/"

# Upload Batch 4 algorithms
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-aes-algorithm.json "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-aes-algorithm.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-merge-sort.json "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-merge-sort.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-prim-algorithm.json "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-prim-algorithm.html "$BUCKET/processes/geometry_topology/"

# Upload Batch 5 algorithms
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-quicksort.json "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-quicksort.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-bst-insert.json "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-bst-insert.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/discrete_mathematics/discrete_mathematics-parallel-and-example.html "$BUCKET/processes/discrete_mathematics/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-breadth-first-search.json "$BUCKET/processes/geometry_topology/"
gsutil -h "Cache-Control:no-cache, max-age=0" cp processes/geometry_topology/geometry_topology-breadth-first-search.html "$BUCKET/processes/geometry_topology/"

echo "Done! View at: https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database/mathematics-database-table.html"
