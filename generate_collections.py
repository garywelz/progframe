#!/usr/bin/env python3
"""
Generate mathematician and theorem named collection pages for the mathematics database.
Output: mathematics-processes-database/collections/*.html
"""
import json
from pathlib import Path

DB_ROOT = Path("/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database")
COLLECTIONS = DB_ROOT / "collections"
PROC_BASE = "processes"  # relative from DB root

# Mathematician slug -> (display name, years, blurb, list of (subcat, chart_stem) for charts)
MATHEMATICIANS = [
    ("euclid", "Euclid", "c. 300 BCE", "Father of geometry; Elements founded axiomatic mathematics.",
     [("geometry_topology", "geometry_topology-euclid-elements-i-1-5"),
      ("geometry_topology", "geometry_topology-euclid-elements-book-i-definitions"),
      ("geometry_topology", "geometry_topology-euclid-elements-book-i-props-1-10"),
      ("geometry_topology", "geometry_topology-euclid-elements-book-i-props-11-20"),
      ("geometry_topology", "geometry_topology-euclid-elements-book-i-props-21-30"),
      ("geometry_topology", "geometry_topology-euclid-elements-book-i-props-31-41"),
      ("geometry_topology", "geometry_topology-euclid-elements-book-i-props-42-48"),
      ("geometry_topology", "geometry_topology-euclid-elements-book-ii"),
      ("number_theory", "number_theory-extended-euclidean")]),
    ("archimedes", "Archimedes", "c. 287–212 BCE",
     "Method of exhaustion, pi bounds, hydrostatics; precursor to calculus. See geometry for related content.",
     [("geometry_topology", "geometry_topology-euclid-elements-book-xii-props-1-9")]),  # Related
    ("eratosthenes", "Eratosthenes", "c. 276–194 BCE", "Sieve of Eratosthenes; measured Earth's circumference.",
     [("number_theory", "number_theory-sieve-of-eratosthenes")]),
    ("aristotle", "Aristotle", "384–322 BCE", "Syllogistic logic; Prior Analytics.",
     [("discrete_mathematics", "discrete_mathematics-aristotle-syllogistic-foundations-perfect"),
      ("discrete_mathematics", "discrete_mathematics-aristotle-syllogistic-figure-2"),
      ("discrete_mathematics", "discrete_mathematics-aristotle-syllogistic-figure-3")]),
    ("fermat", "Pierre de Fermat", "1607–1665", "Number theory; Fermat's Last Theorem (conjectured); Fermat primality test.",
     [("number_theory", "number_theory-fermat-last-theorem"),
      ("number_theory", "number_theory-fermat-primality")]),
    ("euler", "Leonhard Euler", "1707–1783", "Graph theory, analysis, Euler's formula, number theory.",
     [("numerical_analysis", "numerical_analysis-ode-solvers"),
      ("discrete_mathematics", "discrete_mathematics-numerical-methods")]),
    ("gauss", "Carl Friedrich Gauss", "1777–1855", "Number theory, algebra, differential geometry, statistics.",
     [("statistics_probability", "statistics_probability-central-limit-theorem"),
      ("numerical_analysis", "numerical_analysis-linear-direct"),
      ("numerical_analysis", "numerical_analysis-interpolation")]),
    ("lagrange", "Joseph-Louis Lagrange", "1736–1813", "Lagrange's theorem (groups); calculus of variations.",
     [("abstract_algebra", "abstract_algebra-group-theory-subgroups-lagrange"),
      ("geometry_topology", "geometry_topology-combinatorics-advanced-counting")]),
    ("laplace", "Pierre-Simon Laplace", "1749–1827", "Laplace transform; Bayesian probability.",
     [("statistics_probability", "statistics_probability-bayes-theorem"),
      ("statistics_probability", "statistics_probability-central-limit-theorem")]),
    ("bayes", "Thomas Bayes", "1701–1761", "Bayes' theorem; foundation of Bayesian inference.",
     [("statistics_probability", "statistics_probability-bayes-theorem")]),
    ("cauchy", "Augustin-Louis Cauchy", "1789–1857", "Rigorous analysis; Cauchy sequences; complex analysis.",
     [("complex_analysis", "complex_analysis-analytic-cauchy-riemann"),
      ("complex_analysis", "complex_analysis-cauchy-residue"),
      ("calculus_analysis", "calculus_analysis-real-analysis-limits-continuity")]),
    ("riemann", "Bernhard Riemann", "1826–1866", "Riemannian geometry; Riemann hypothesis; complex analysis.",
     [("differential_geometry", "differential_geometry-riemannian"),
      ("number_theory", "number_theory-riemann-hypothesis"),
      ("complex_analysis", "complex_analysis-analytic-cauchy-riemann")]),
    ("germain", "Sophie Germain", "1776–1831", "Number theory; Sophie Germain primes; elasticity; contributions to Fermat's Last Theorem.",
     [("number_theory", "number_theory-fermat-last-theorem"),
      ("number_theory", "number_theory-sieve-of-eratosthenes"),
      ("partial_differential_equations", "partial_differential_equations-classical")]),
    ("galois", "Évariste Galois", "1811–1832", "Galois theory; group theory; solvability by radicals.",
     [("abstract_algebra", "abstract_algebra-field-theory-galois"),
      ("abstract_algebra", "abstract_algebra-field-theory-extensions"),
      ("abstract_algebra", "abstract_algebra-field-theory-splitting")]),
    ("kovalevskaya", "Sofia Kovalevskaya", "1850–1891", "First woman to earn a doctorate in mathematics; Cauchy–Kovalevskaya theorem (existence for PDEs).",
     [("partial_differential_equations", "partial_differential_equations-classical"),
      ("partial_differential_equations", "partial_differential_equations-wellposed"),
      ("calculus_analysis", "calculus_analysis-real-analysis-differentiation")]),
    ("godel", "Kurt Gödel", "1906–1978", "Incompleteness theorems; completeness of first-order logic.",
     [("number_theory", "number_theory-peano-arithmetic-godel-incompleteness-1"),
      ("number_theory", "number_theory-peano-arithmetic-godel-incompleteness-2"),
      ("number_theory", "number_theory-peano-arithmetic-godel-completeness"),
      ("number_theory", "number_theory-peano-arithmetic-godel-formalization"),
      ("number_theory", "number_theory-peano-arithmetic-godel-fol"),
      ("foundations", "foundations-axiomatic-set-theory-ad"),
      ("discrete_mathematics", "discrete_mathematics-model-theory-compactness")]),
    ("peano", "Giuseppe Peano", "1858–1932", "Peano axioms; formalization of arithmetic.",
     [("number_theory", "number_theory-peano-arithmetic-axioms-foundations"),
      ("number_theory", "number_theory-peano-arithmetic-addition-multiplication"),
      ("number_theory", "number_theory-peano-arithmetic-order-induction"),
      ("number_theory", "number_theory-peano-arithmetic-godel-completeness"),
      ("number_theory", "number_theory-peano-arithmetic-godel-incompleteness-1"),
      ("number_theory", "number_theory-peano-arithmetic-godel-incompleteness-2")]),
    ("noether", "Emmy Noether", "1882–1935", "Abstract algebra; Noetherian rings; Noether's theorem.",
     [("commutative_algebra", "commutative_algebra-noetherian"),
      ("commutative_algebra", "commutative_algebra-primary-decomp"),
      ("abstract_algebra", "abstract_algebra-ring-theory-ideals-quotients")]),
    ("cartwright", "Mary Cartwright", "1900–1998", "Chaotic dynamics; Cartwright–Littlewood theorem; first woman president of LMS.",
     [("calculus_analysis", "calculus_analysis-devaney-chaos-definition"),
      ("calculus_analysis", "calculus_analysis-symbolic-dynamics"),
      ("calculus_analysis", "calculus_analysis-complex-dynamics-julia-fatou")]),
    ("hilbert", "David Hilbert", "1862–1943", "Hilbert spaces; axiomatic geometry; 23 problems.",
     [("functional_analysis", "functional_analysis-hilbert-spaces"),
      ("spectral_theory", "spectral_theory-spectrum"),
      ("operator_algebras", "operator_algebras-spectral")]),
    ("kolmogorov", "Andrey Kolmogorov", "1903–1987", "Axiomatic probability; algorithmic complexity.",
     [("statistics_probability", "statistics_probability-kolmogorov-axioms")]),
    ("vonneumann", "John von Neumann", "1903–1957", "Operator algebras; game theory; merge sort.",
     [("operator_algebras", "operator_algebras-vonneumann"),
      ("operator_algebras", "operator_algebras-gns"),
      ("discrete_mathematics", "discrete_mathematics-merge-sort")]),
    ("dedekind", "Richard Dedekind", "1831–1916", "Ideal theory; Dedekind cuts; foundations.",
     [("abstract_algebra", "abstract_algebra-ring-theory-ideals-quotients"),
      ("number_theory", "number_theory-peano-arithmetic-axioms-foundations")]),
    ("cantor", "Georg Cantor", "1845–1918", "Set theory; transfinite numbers; continuum hypothesis.",
     [("foundations", "foundations-axiomatic-set-theory-ch-continuum"),
      ("foundations", "foundations-axiomatic-set-theory-ordinals-choice")]),
    ("eilenberg", "Samuel Eilenberg", "1913–1998", "Category theory; homological algebra.",
     [("category_theory", "category_theory-category-theory-foundations"),
      ("category_theory", "category_theory-category-theory-natural-transformations")]),
    ("grothendieck", "Alexander Grothendieck", "1928–2014", "Scheme theory; topos; revolutionary algebraic geometry.",
     [("algebraic_geometry", "algebraic_geometry-schemes-sheaves"),
      ("algebraic_geometry", "algebraic_geometry-cohomology")]),
    ("serre", "Jean-Pierre Serre", "1926–", "Algebraic topology; algebraic geometry; Fields 1954, Abel 2003.",
     [("algebraic_geometry", "algebraic_geometry-cohomology"),
      ("representation_theory", "representation_theory-group-reps")]),
    ("sullivan", "Dennis Sullivan", "1941–", "Rational homotopy; string topology; wandering domains.",
     [("geometry_topology", "geometry_topology-sullivan-minimal-models"),
      ("geometry_topology", "geometry_topology-string-topology"),
      ("calculus_analysis", "calculus_analysis-sullivan-no-wandering-domains"),
      ("calculus_analysis", "calculus_analysis-sullivan-dictionary")]),
    ("wiles", "Andrew Wiles", "1953–", "Proof of Fermat's Last Theorem; modularity theorem.",
     [("number_theory", "number_theory-fermat-last-theorem")]),
    ("tao", "Terence Tao", "1975–", "Prime progressions; harmonic analysis; Fields 2006.",
     [("number_theory", "number_theory-green-tao-theorem")]),
    ("green", "Ben Green", "1977–", "Additive combinatorics; Green–Tao theorem.",
     [("number_theory", "number_theory-green-tao-theorem")]),
    ("szemeredi", "Endre Szemerédi", "1940–", "Combinatorics; Szemerédi's theorem; Abel 2012.",
     [("number_theory", "number_theory-szemeredi-theorem")]),
    ("dijkstra", "Edsger W. Dijkstra", "1930–2002", "Shortest path algorithm; structured programming.",
     [("geometry_topology", "geometry_topology-dijkstra-algorithm")]),
    ("prim", "Robert C. Prim", "1921–", "Minimum spanning tree algorithm.",
     [("geometry_topology", "geometry_topology-prim-algorithm")]),
    ("kruskal", "Joseph Kruskal", "1928–2010", "Minimum spanning tree algorithm.",
     [("geometry_topology", "geometry_topology-kruskal-algorithm")]),
    ("hoare", "Tony Hoare", "1934–", "Quicksort; Hoare logic.",
     [("discrete_mathematics", "discrete_mathematics-quicksort")]),
    ("simpson", "Thomas Simpson", "1710–1761", "Simpson's rule for numerical integration.",
     [("calculus_analysis", "calculus_analysis-simpsons-rule")]),
    ("shannon", "Claude Shannon", "1916–2001", "Information theory; entropy.",
     [("information_theory", "information_theory-entropy"),
      ("information_theory", "information_theory-channel"),
      ("information_theory", "information_theory-coding")]),
    ("rivest", "Ronald Rivest", "1947–", "RSA cryptosystem; co-inventor.",
     [("discrete_mathematics", "discrete_mathematics-rsa-algorithm")]),
    ("gelfand", "Israel Gelfand", "1913–2009", "C*-algebras; representation theory; functional analysis.",
     [("operator_algebras", "operator_algebras-cstar"),
      ("spectral_theory", "spectral_theory-spectrum")]),
    ("atyiah", "Michael Atiyah", "1929–2019", "Index theorem; K-theory; Fields 1966, Abel 2004.",
     [("k_theory", "k_theory-topological"), ("operator_algebras", "operator_algebras-spectral")]),
    ("faltings", "Gerd Faltings", "1954–", "Mordell conjecture; arithmetic geometry; Fields 1986.",
     [("number_theory", "number_theory-fermat-last-theorem"), ("algebraic_geometry", "algebraic_geometry-schemes-sheaves")]),
    ("deligne", "Pierre Deligne", "1944–", "Weil conjectures; motives; Fields 1978, Abel 2013.",
     [("algebraic_geometry", "algebraic_geometry-schemes-sheaves")]),
    ("scholze", "Peter Scholze", "1987–", "Perfectoid spaces; arithmetic geometry; Fields 2018.",
     [("algebraic_geometry", "algebraic_geometry-schemes-sheaves"), ("number_theory", "number_theory-fermat-last-theorem")]),
    ("uhlenbeck", "Karen Uhlenbeck", "1942–", "Abel Prize 2019; gauge theory; geometric analysis; minimal surfaces.",
     [("differential_geometry", "differential_geometry-connections"),
      ("differential_geometry", "differential_geometry-riemannian"),
      ("differential_geometry", "differential_geometry-minimal-surfaces"),
      ("partial_differential_equations", "partial_differential_equations-classical")]),
    ("daubechies", "Ingrid Daubechies", "1954–", "Wavelets; Daubechies wavelets; applied and computational harmonic analysis.",
     [("numerical_analysis", "numerical_analysis-interpolation"),
      ("information_theory", "information_theory-entropy"),
      ("functional_analysis", "functional_analysis-hilbert-spaces")]),
    ("mirzakhani", "Maryam Mirzakhani", "1977–2017", "Fields Medal 2014; moduli spaces; dynamics on surfaces; first woman Fields medalist.",
     [("algebraic_geometry", "algebraic_geometry-schemes-sheaves"),
      ("differential_geometry", "differential_geometry-manifolds"),
      ("calculus_analysis", "calculus_analysis-complex-dynamics-julia-fatou")]),
    ("poincare", "Henri Poincaré", "1854–1912", "Poincaré conjecture; dynamical systems; topology.",
     [("geometry_topology", "geometry_topology-homotopy-theory-basics"),
      ("geometry_topology", "geometry_topology-de-rham-cohomology")]),
    ("hamilton", "William Rowan Hamilton", "1805–1865", "Hamiltonian mechanics; quaternions.",
     [("symplectic_geometry", "symplectic_geometry-hamiltonian"),
      ("mathematical_physics", "mathematical_physics-classical")]),
    ("poisson", "Siméon Poisson", "1781–1840", "Poisson bracket; probability.",
     [("symplectic_geometry", "symplectic_geometry-poisson")]),
    ("cartan", "Élie Cartan", "1869–1951", "Differential geometry; Lie groups; differential forms.",
     [("differential_geometry", "differential_geometry-forms"),
      ("representation_theory", "representation_theory-lie-algebras")]),
    ("thurston", "William Thurston", "1946–2012", "Geometrization conjecture; 3-manifolds; hyperbolic geometry; Fields 1982.",
     [("geometry_topology", "geometry_topology-homotopy-theory-basics"),
      ("geometry_topology", "geometry_topology-de-rham-cohomology"),
      ("geometry_topology", "geometry_topology-point-set-topology-props-1-15"),
      ("geometry_topology", "geometry_topology-algebraic-topology-props-1-15")]),
    ("milnor", "John Milnor", "1931–", "Exotic spheres; Morse theory; complex dynamics; Fields 1962, Abel 2011.",
     [("calculus_analysis", "calculus_analysis-quadratic-julia-mandelbrot"),
      ("calculus_analysis", "calculus_analysis-complex-dynamics-julia-fatou"),
      ("calculus_analysis", "calculus_analysis-hubbard-douady-collection"),
      ("calculus_analysis", "calculus_analysis-douady-hubbard-mandelbrot-connected"),
      ("differential_geometry", "differential_geometry-manifolds")]),
    ("perelman", "Grigory Perelman", "1966–", "Proof of Poincaré and geometrization; Ricci flow with surgery; declined Fields 2006.",
     [("geometry_topology", "geometry_topology-homotopy-theory-basics"),
      ("differential_geometry", "differential_geometry-riemannian"),
      ("differential_geometry", "differential_geometry-connections")]),
    ("newton", "Isaac Newton", "1642–1727", "Calculus; Newton's method; laws of motion; quadrature.",
     [("discrete_mathematics", "discrete_mathematics-numerical-methods"),
      ("numerical_analysis", "numerical_analysis-quadrature"),
      ("calculus_analysis", "calculus_analysis-real-analysis-differentiation")]),
    ("julia", "Gaston Julia", "1893–1978", "Julia sets; complex dynamics; iterative rational maps.",
     [("calculus_analysis", "calculus_analysis-complex-dynamics-julia-fatou"),
      ("calculus_analysis", "calculus_analysis-quadratic-julia-mandelbrot")]),
    ("fatou", "Pierre Fatou", "1878–1929", "Fatou sets; complex dynamics; iterative theory.",
     [("calculus_analysis", "calculus_analysis-complex-dynamics-julia-fatou"),
      ("calculus_analysis", "calculus_analysis-quadratic-julia-mandelbrot")]),
    ("douady", "Adrien Douady", "1935–2006", "Mandelbrot set connectedness; external rays; polynomial-like maps.",
     [("calculus_analysis", "calculus_analysis-hubbard-douady-collection"),
      ("calculus_analysis", "calculus_analysis-douady-hubbard-mandelbrot-connected"),
      ("calculus_analysis", "calculus_analysis-quadratic-julia-mandelbrot"),
      ("calculus_analysis", "calculus_analysis-boettcher-external-rays"),
      ("calculus_analysis", "calculus_analysis-polynomial-like-maps")]),
    ("hubbard", "John H. Hubbard", "1945–", "Mandelbrot set; complex dynamics; polynomial-like maps; Douady–Hubbard theory.",
     [("calculus_analysis", "calculus_analysis-hubbard-douady-collection"),
      ("calculus_analysis", "calculus_analysis-douady-hubbard-mandelbrot-connected"),
      ("calculus_analysis", "calculus_analysis-quadratic-julia-mandelbrot"),
      ("calculus_analysis", "calculus_analysis-boettcher-external-rays"),
      ("calculus_analysis", "calculus_analysis-polynomial-like-maps")]),
    ("brouwer", "Luitzen Egbertus Jan Brouwer", "1881–1966", "Fixed point theorem; intuitionistic logic; topology.",
     [("geometry_topology", "geometry_topology-point-set-topology-props-1-15"),
      ("geometry_topology", "geometry_topology-algebraic-topology-props-1-15")]),
    ("ramanujan", "Srinivasa Ramanujan", "1887–1920", "Partition function; mock theta; number theory; Rogers–Ramanujan.",
     [("number_theory", "number_theory-riemann-hypothesis"),
      ("number_theory", "number_theory-chinese-remainder-theorem"),
      ("number_theory", "number_theory-fermat-last-theorem")]),
    ("lebesgue", "Henri Lebesgue", "1875–1941", "Lebesgue measure and integration; Lp spaces; foundations of real analysis.",
     [("functional_analysis", "functional_analysis-hilbert-spaces"),
      ("functional_analysis", "functional_analysis-banach-spaces"),
      ("calculus_analysis", "calculus_analysis-real-analysis-completeness")]),
    ("weierstrass", "Karl Weierstrass", "1815–1897", "ε-δ rigor; Weierstrass approximation; pathological functions.",
     [("calculus_analysis", "calculus_analysis-real-analysis-limits-continuity"),
      ("calculus_analysis", "calculus_analysis-real-analysis-completeness"),
      ("numerical_analysis", "numerical_analysis-interpolation")]),
]

# Theorem slug -> (display name, statement/summary, list of (subcat, chart_stem))
THEOREMS = [
    ("fermat-last", "Fermat's Last Theorem", "No positive integers a, b, c, n>2 satisfy aⁿ+bⁿ=cⁿ.",
     [("number_theory", "number_theory-fermat-last-theorem")]),
    ("riemann-hypothesis", "Riemann Hypothesis", "All non-trivial zeros of ζ(s) have real part ½.",
     [("number_theory", "number_theory-riemann-hypothesis")]),
    ("chinese-remainder", "Chinese Remainder Theorem", "System of congruences with coprime moduli has unique solution modulo product.",
     [("number_theory", "number_theory-chinese-remainder-theorem")]),
    ("godel-incompleteness", "Gödel's Incompleteness Theorems", "Any consistent recursively axiomatized theory extending PA is incomplete.",
     [("number_theory", "number_theory-peano-arithmetic-godel-incompleteness-1"),
      ("number_theory", "number_theory-peano-arithmetic-godel-incompleteness-2")]),
    ("green-tao", "Green–Tao Theorem", "The primes contain arbitrarily long arithmetic progressions.",
     [("number_theory", "number_theory-green-tao-theorem")]),
    ("szemeredi", "Szemerédi's Theorem", "Subsets of positive density contain arbitrarily long arithmetic progressions.",
     [("number_theory", "number_theory-szemeredi-theorem")]),
    ("bayes", "Bayes' Theorem", "P(A|B) = P(B|A)P(A)/P(B); foundation of Bayesian inference.",
     [("statistics_probability", "statistics_probability-bayes-theorem")]),
    ("central-limit", "Central Limit Theorem", "Sum of i.i.d. random variables converges to normal distribution.",
     [("statistics_probability", "statistics_probability-central-limit-theorem")]),
    ("law-large-numbers", "Law of Large Numbers", "Sample average converges to population mean.",
     [("statistics_probability", "statistics_probability-law-of-large-numbers")]),
    ("kolmogorov-axioms", "Kolmogorov Axioms", "Axiomatic foundation of probability theory.",
     [("statistics_probability", "statistics_probability-kolmogorov-axioms")]),
    ("lagrange", "Lagrange's Theorem (Groups)", "Order of subgroup divides order of group.",
     [("abstract_algebra", "abstract_algebra-group-theory-subgroups-lagrange")]),
    ("galois-correspondence", "Galois Correspondence", "Subfields of Galois extension correspond to subgroups of Galois group.",
     [("abstract_algebra", "abstract_algebra-field-theory-galois")]),
    ("cauchy-riemann", "Cauchy–Riemann Equations", "Necessary and sufficient for complex differentiability.",
     [("complex_analysis", "complex_analysis-analytic-cauchy-riemann")]),
    ("residue", "Residue Theorem", "Contour integral equals 2πi times sum of residues.",
     [("complex_analysis", "complex_analysis-cauchy-residue")]),
    ("picard", "Picard Theorems", "Entire non-constant function omits at most one value.",
     [("complex_analysis", "complex_analysis-entire-picard")]),
    ("darboux", "Darboux Theorem", "Symplectic form locally equivalent to standard form.",
     [("symplectic_geometry", "symplectic_geometry-darboux")]),
    ("spectral", "Spectral Theorem", "Self-adjoint operators have spectral decomposition.",
     [("operator_algebras", "operator_algebras-spectral"),
      ("spectral_theory", "spectral_theory-spectrum"),
      ("spectral_theory", "spectral_theory-selfadjoint")]),
    ("gns", "GNS Construction", "C*-algebras have faithful Hilbert space representation.",
     [("operator_algebras", "operator_algebras-gns")]),
    ("sullivan-wandering", "Sullivan's No Wandering Domains", "Rational maps have no wandering components.",
     [("calculus_analysis", "calculus_analysis-sullivan-no-wandering-domains")]),
    ("markov-chains", "Markov Chains", "Memoryless stochastic process; transition probabilities.",
     [("statistics_probability", "statistics_probability-markov-chains")]),
    ("primality-tests", "Primality Tests", "Fermat, Miller–Rabin, and AKS algorithms for testing primality.",
     [("number_theory", "number_theory-fermat-primality"),
      ("number_theory", "number_theory-miller-rabin"),
      ("number_theory", "number_theory-aks-primality")]),
    ("poincare-conjecture", "Poincaré Conjecture", "Simply connected closed 3-manifold is homeomorphic to S³; proved by Perelman (2003) via Ricci flow.",
     [("geometry_topology", "geometry_topology-homotopy-theory-basics"),
      ("geometry_topology", "geometry_topology-de-rham-cohomology")]),
    ("newton-method", "Newton's Method", "Iterative root-finding: x_{n+1} = x_n - f(x_n)/f'(x_n); quadratic convergence near simple roots.",
     [("discrete_mathematics", "discrete_mathematics-numerical-methods")]),
    ("mandelbrot-connectedness", "Mandelbrot Set Connectedness", "Douady–Hubbard (1981–82): the Mandelbrot set M is connected via external rays and conformal isomorphism.",
     [("calculus_analysis", "calculus_analysis-douady-hubbard-mandelbrot-connected"),
      ("calculus_analysis", "calculus_analysis-quadratic-julia-mandelbrot"),
      ("calculus_analysis", "calculus_analysis-hubbard-douady-collection"),
      ("calculus_analysis", "calculus_analysis-boettcher-external-rays")]),
    ("minimal-surfaces", "Minimal Surfaces Theory", "Surfaces with zero mean curvature H=0; first variation of area; Plateau problem; Weierstrass representation.",
     [("differential_geometry", "differential_geometry-minimal-surfaces"),
      ("differential_geometry", "differential_geometry-riemannian"),
      ("differential_geometry", "differential_geometry-connections")]),
    ("costas-surface", "Costa's Surface", "Embedded minimal surface of genus 1 with three ends; discovered by Celso Costa (1982), proven embedded by Hoffman–Meeks.",
     [("differential_geometry", "differential_geometry-minimal-surfaces")]),
    ("brouwer-fixed-point", "Brouwer Fixed Point Theorem", "Continuous f: Dⁿ → Dⁿ has a fixed point (Dⁿ compact convex).",
     [("geometry_topology", "geometry_topology-point-set-topology-props-1-15"),
      ("geometry_topology", "geometry_topology-algebraic-topology-props-1-15")]),
    ("banach-fixed-point", "Banach Fixed Point Theorem", "Contraction on complete metric space has unique fixed point; Picard iteration.",
     [("functional_analysis", "functional_analysis-banach-spaces")]),
    ("stokes", "Stokes' Theorem", "∫_M dω = ∫_∂M ω; unifies Green, divergence, classical Stokes.",
     [("differential_geometry", "differential_geometry-forms")]),
    ("four-color", "Four Color Theorem", "Planar graph vertices 4-colorable; proved Appel–Haken (1976).",
     [("geometry_topology", "geometry_topology-combinatorics"),
      ("geometry_topology", "geometry_topology-combinatorics-combinations-binomial")]),
    ("jordan-curve", "Jordan Curve Theorem", "Simple closed plane curve divides plane into exactly two regions.",
     [("geometry_topology", "geometry_topology-point-set-topology-props-1-15"),
      ("complex_analysis", "complex_analysis-conformal-mappings")]),
    ("fundamental-theorem-algebra", "Fundamental Theorem of Algebra", "Every nonconstant complex polynomial has a root in ℂ.",
     [("complex_analysis", "complex_analysis-analytic-cauchy-riemann"),
      ("complex_analysis", "complex_analysis-entire-picard")]),
]

def make_chart_href(subcat: str, stem: str) -> str:
    # From collections/ we need ../processes/subcat/stem.html
    return f"../{PROC_BASE}/{subcat}/{stem}.html"

def make_collection_page(slug: str, title: str, subtitle: str, blurb: str, items: list, is_theorem: bool) -> str:
    item_label = "Charts" if not is_theorem else "Charts"
    base = "../" if (COLLECTIONS / "index.html").exists() else ""
    nav_gcs = "https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database"
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — Named Collection</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }}
        .container {{ max-width: 900px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; padding: 30px; }}
        h1 {{ color: #2c3e50; margin-bottom: 10px; }}
        .subtitle {{ color: #7f8c8d; font-size: 1em; margin-bottom: 15px; }}
        p {{ color: #555; margin-bottom: 25px; line-height: 1.6; }}
        .nav-links {{ margin-bottom: 20px; }}
        .nav-links a {{ color: #e67e22; text-decoration: none; margin-right: 20px; font-weight: 500; }}
        .nav-links a:hover {{ text-decoration: underline; }}
        .section-label {{ font-size: 0.9em; color: #7f8c8d; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }}
        .sections {{ display: grid; gap: 15px; margin-bottom: 25px; }}
        .sections a {{ display: block; padding: 20px; background: #f8f9fa; border-radius: 10px; color: #2c3e50; text-decoration: none; font-weight: 500; border-left: 4px solid #27ae60; }}
        .sections a:hover {{ background: #ecf0f1; }}
        .empty-note {{ color: #95a5a6; font-style: italic; padding: 15px; background: #fafafa; border-radius: 8px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
            <a id="collections-link" href="index.html">All Collections</a>
        </div>
        <script>
            (function() {{
                const isGCS = window.location.hostname.includes('storage.googleapis.com');
                const isHF = window.location.hostname.includes('huggingface.co');
                const base = isGCS ? '{nav_gcs}' : (isHF ? '..' : '..');
                document.getElementById('back-link').href = base + '/mathematics-database-table.html';
                document.getElementById('collections-link').href = isGCS ? base + '/collections/index.html' : 'index.html';
            }})();
        </script>
        <h1>{title}</h1>
        <div class="subtitle">{subtitle}</div>
        <p>{blurb}</p>
        <div class="section-label">{item_label}</div>
        <div class="sections">
''' + "\n".join(
    f'            <a href="{make_chart_href(sc, st)}">{st.replace(sc + "-", "").replace("-", " ").title()}</a>'
    for sc, st in items
) if items else '            <p class="empty-note">No charts in this collection yet. Related content may be added in future updates.</p>' + '''
        </div>
    </div>
</body>
</html>
'''

def main():
    COLLECTIONS.mkdir(parents=True, exist_ok=True)
    math_pages = []
    thm_pages = []

    for slug, name, years, blurb, items in MATHEMATICIANS:
        html = make_collection_page(slug, name, years, blurb, items, is_theorem=False)
        out = COLLECTIONS / f"{slug}.html"
        out.write_text(html, encoding="utf-8")
        print(f"Wrote {out}")
        math_pages.append((slug, name, years, len(items)))

    for slug, name, stmt, items in THEOREMS:
        blurb = stmt
        html = make_collection_page(slug, name, "Named Theorem", blurb, items, is_theorem=True)
        out = COLLECTIONS / f"theorem-{slug}.html"
        out.write_text(html, encoding="utf-8")
        print(f"Wrote {out}")
        thm_pages.append((slug, name, len(items)))

    # Collections index
    index_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Named Collections — Mathematics Database</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; padding: 30px; }
        h1 { color: #2c3e50; margin-bottom: 10px; }
        p { color: #555; margin-bottom: 25px; line-height: 1.6; }
        .nav-links { margin-bottom: 20px; }
        .nav-links a { color: #e67e22; text-decoration: none; margin-right: 20px; font-weight: 500; }
        .nav-links a:hover { text-decoration: underline; }
        .section-label { font-size: 0.9em; color: #7f8c8d; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
        .grid a { display: block; padding: 16px; background: #f8f9fa; border-radius: 10px; color: #2c3e50; text-decoration: none; font-weight: 500; border-left: 4px solid #e67e22; }
        .grid a:hover { background: #ecf0f1; }
        .grid a .meta { font-size: 0.8em; color: #95a5a6; margin-top: 4px; }
        .filter-btn { padding: 8px 16px; border: 2px solid #e67e22; background: white; color: #e67e22; border-radius: 8px; cursor: pointer; font-weight: 500; }
        .filter-btn:hover { background: #fff8f0; }
        .filter-btn.active { background: #e67e22; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a id="back-link" href="#">← Back to Mathematics Database</a>
        </div>
        <script>
            (function() {
                const isGCS = window.location.hostname.includes('storage.googleapis.com');
                const base = isGCS ? 'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database' : '..';
                document.getElementById('back-link').href = base + '/mathematics-database-table.html';
            })();
        </script>
        <h1>Named Collections</h1>
        <p>Browse processes by mathematician or by famous theorem. Each collection links to relevant charts in the database.</p>
        <div class="filter-bar" style="margin-bottom: 16px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="math">Mathematicians</button>
            <button class="filter-btn" data-filter="theorem">Named Theorems</button>
        </div>
        <div class="section-label">Mathematicians</div>
        <div class="grid" id="math-grid">
'''
    for slug, name, years, count in math_pages:
        meta = f"{count} chart{'s' if count != 1 else ''}" if count else "—"
        index_html += f'            <a href="{slug}.html"><span>{name}</span><span class="meta">{years} · {meta}</span></a>\n'
    index_html += '''        </div>
        <div class="section-label" style="margin-top: 25px;">Named Theorems</div>
        <div class="grid" id="theorem-grid">
'''
    for slug, name, count in thm_pages:
        meta = f"{count} chart{'s' if count != 1 else ''}"
        index_html += f'            <a href="theorem-{slug}.html"><span>{name}</span><span class="meta">{meta}</span></a>\n'
    index_html += '''        </div>
        <script>
        (function() {
            var btns = document.querySelectorAll('.filter-btn');
            var mathGrid = document.getElementById('math-grid');
            var thmGrid = document.getElementById('theorem-grid');
            var mathLabel = document.querySelector('.section-label');
            var thmLabel = document.querySelectorAll('.section-label')[1];
            function filter(which) {
                btns.forEach(function(b) { b.classList.toggle('active', b.dataset.filter === which); });
                if (which === 'all') {
                    mathGrid.style.display = '';
                    thmGrid.style.display = '';
                    if (mathLabel) mathLabel.style.display = '';
                    if (thmLabel) thmLabel.style.display = '';
                } else if (which === 'math') {
                    mathGrid.style.display = '';
                    thmGrid.style.display = 'none';
                    if (mathLabel) mathLabel.style.display = '';
                    if (thmLabel) thmLabel.style.display = 'none';
                } else {
                    mathGrid.style.display = 'none';
                    thmGrid.style.display = '';
                    if (mathLabel) mathLabel.style.display = 'none';
                    if (thmLabel) thmLabel.style.display = '';
                }
            }
            btns.forEach(function(b) {
                b.addEventListener('click', function() { filter(b.dataset.filter); });
            });
        })();
        </script>
    </div>
</body>
</html>
'''
    (COLLECTIONS / "index.html").write_text(index_html, encoding="utf-8")
    print(f"Wrote {COLLECTIONS / 'index.html'}")
    print(f"\nDone: {len(MATHEMATICIANS)} mathematicians, {len(THEOREMS)} theorems")

if __name__ == "__main__":
    main()
