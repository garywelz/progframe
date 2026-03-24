#!/usr/bin/env python3
"""Generate Priority 3 chart HTML files."""
import os
import re

DB = "/home/gdubs/copernicus-web-public/huggingface-space/mathematics-processes-database/processes"

CHARTS = {
    "operator_algebras": [
        ("operator_algebras-cstar", "C*-Algebras", "#2c5282", "Banach *-algebra with ‖x*x‖=‖x‖². Gelfand–Naimark."),
        ("operator_algebras-vonneumann", "Von Neumann Algebras", "#2c5282", "M=M'' double commutant. Factors. Type I, II, III."),
        ("operator_algebras-gns", "GNS Construction", "#2c5282", "State ω → Hilbert space H_ω, rep π_ω. Cyclic vector."),
        ("operator_algebras-spectral", "Spectral Theory for C*-Algebras", "#2c5282", "Spectrum σ(x), spectral radius. C*-functional calculus."),
    ],
    "k_theory": [
        ("k_theory-algebraic", "Algebraic K-Theory", "#553c9a", "K₀, K₁. Grothendieck group. Exact sequences."),
        ("k_theory-topological", "Topological K-Theory", "#553c9a", "K(X) vector bundles. Bott periodicity."),
        ("k_theory-operator", "Operator K-Theory", "#553c9a", "K₀(A), K₁(A) for C*-algebras. Ext groups."),
        ("k_theory-bott", "Bott Periodicity", "#553c9a", "K⁻ⁿ≅K⁻ⁿ⁻². 8-fold periodicity."),
    ],
    "quantum_algebra": [
        ("quantum_algebra-groups", "Quantum Groups", "#805ad5", "U_q(g), R-matrix. Quasitriangular Hopf."),
        ("quantum_algebra-hopf", "Hopf Algebras", "#805ad5", "Coalgebra, antipode. Duality."),
        ("quantum_algebra-operads", "Operads", "#805ad5", "Composition, associativity. Algebras over operads."),
        ("quantum_algebra-yangbaxter", "Yang–Baxter Equation", "#805ad5", "R₁₂R₁₃R₂₃=R₂₃R₁₃R₁₂. Braid relations."),
    ],
    "optimization": [
        ("optimization-linear", "Linear Programming", "#dd6b20", "max c·x, Ax≤b. Feasible region, vertices."),
        ("optimization-simplex", "Simplex Method", "#dd6b20", "Pivot, tableau. Finite for nondegenerate."),
        ("optimization-duality", "Duality", "#dd6b20", "Primal-dual. Strong duality, complementary slackness."),
        ("optimization-control", "Optimal Control", "#dd6b20", "Pontryagin max principle. Hamilton–Jacobi–Bellman."),
    ],
    "information_theory": [
        ("information_theory-entropy", "Entropy", "#319795", "H(X), H(X|Y). Shannon entropy. Mutual information."),
        ("information_theory-channel", "Channel Capacity", "#319795", "C=max I(X;Y). Shannon capacity theorem."),
        ("information_theory-coding", "Source & Channel Coding", "#319795", "Source coding, channel coding. Optimal codes."),
        ("information_theory-rate", "Rate–Distortion", "#319795", "R(D). Distortion-rate function."),
    ],
    "mathematical_physics": [
        ("mathematical_physics-classical", "Lagrangian & Hamiltonian", "#b7791f", "L, H. Euler–Lagrange, Hamilton eqs."),
        ("mathematical_physics-quantum", "Quantum Mechanics", "#b7791f", "Hilbert space, observables. Uncertainty."),
        ("mathematical_physics-field", "Field Theory", "#b7791f", "Lagrangian density. Noether. Gauge."),
        ("mathematical_physics-statmech", "Statistical Mechanics", "#b7791f", "Partition function. Ensembles. Phase transitions."),
    ],
}

# Chart-specific Mermaid content: (D1-D4 definitions, T1-T5 theorems, edges)
MERMAID = {
    "operator_algebras-cstar": """graph TD
    D1["Def: C*-algebra\nBanach *-alg, ‖x*x‖=‖x‖²"]
    D2["Def: Commutative C*\nA ≅ C₀(X) locally compact"]
    D3["Def: Positive element\nx ≥ 0 iff x = a*a"]
    D4["Def: State\nω linear, ω(1)=1, ω(x*x)≥0"]
    T1["Thm: Gelfand–Naimark\nA↪B(H) isometry"]
    T2["Thm: GNS\nstate → cyclic rep"]
    T3["Thm: Spectrum\nσ(x) compact in C"]
    T4["Thm: Continuous f.calc\nf(x) well-defined"]
    T5["Thm: Spectral radius\nr(x)=‖x‖ for normal"]
    D1 --> D2
    D1 --> D3
    D3 --> D4
    D4 --> T2
    D1 --> T1
    D1 --> T3
    T3 --> T4
    T3 --> T5""",
    "operator_algebras-vonneumann": """graph TD
    D1["Def: Von Neumann algebra\nM⊂B(H), M=M''"]
    D2["Def: Commutant\nM' = {x: xm=mx ∀m}"]
    D3["Def: Factor\nM∩M' = C1"]
    D4["Def: Type I, II, III\nclassification by proj lattice"]
    T1["Thm: Bicommutant\nM''=strong cl(M)"]
    T2["Thm: Double comm.\nM = M''"]
    T3["Thm: Type decompos.\nany vN → factors"]
    T4["Thm: Tomita–Takesaki\nmodular theory"]
    T5["Thm: Murray–von Neumann\nfactors type I,II,III"]
    D2 --> D1
    D1 --> T1
    T1 --> T2
    D1 --> D3
    D3 --> D4
    D4 --> T5
    D1 --> T3
    T3 --> T4""",
    "operator_algebras-gns": """graph TD
    D1["Def: State on C*\nω:A→C linear pos"]
    D2["Def: GNS rep\nH_ω from ω, π_ω"]
    D3["Def: Cyclic vector\nξ, π(A)ξ dense"]
    D4["Def: Faithful state\nω(x*x)=0 ⇒ x=0"]
    T1["Thm: GNS unique\nω → (H_ω,π_ω,ξ) unique"]
    T2["Thm: Cyclic\nπ_ω cyclic for ξ"]
    T3["Thm: ω(x)=⟨ξ,π(x)ξ⟩\nrecovery formula"]
    T4["Thm: Irreducible iff\nω pure"]
    T5["Thm: Universal rep\n⊕ all GNS reps"]
    D1 --> D2
    D2 --> D3
    D1 --> D4
    D2 --> T1
    D3 --> T2
    T1 --> T3
    D4 --> T4
    T1 --> T5""",
    "operator_algebras-spectral": """graph TD
    D1["Def: Spectrum σ(x)\nλ: x−λ1 not inv"]
    D2["Def: Spectral radius\nr(x)=max|σ(x)|"]
    D3["Def: Normal element\nx*x=xx*"]
    D4["Def: C*-funct. calc\nf(x) for f∈C(σ(x))"]
    T1["Thm: σ(x) nonempty\ncompact in C"]
    T2["Thm: r(x)=lim ‖xⁿ‖^{1/n}"]
    T3["Thm: Spectral mapping\nσ(f(x))=f(σ(x))"]
    T4["Thm: Continuous calc\nf↦f(x) iso"]
    T5["Thm: Borel calc\nextends to bounded Borel"]
    D1 --> D2
    D1 --> D3
    D3 --> D4
    D1 --> T1
    D2 --> T2
    D4 --> T3
    T3 --> T4
    T4 --> T5""",
    "k_theory-algebraic": """graph TD
    D1["Def: Projective module\nP ⊕ Q ≅ F free"]
    D2["Def: Grothendieck group\nK₀(R) from proj mods"]
    D3["Def: K₁(R)\nGL(R)/E(R) abelianized"]
    D4["Def: Exact sequence\n0→A→B→C→0"]
    T1["Thm: K₀ additivity\nK₀(A⊕B)≅K₀(A)⊕K₀(B)"]
    T2["Thm: K₀(R)≅Z\nfor R field"]
    T3["Thm: K₁ stability\nGL_n↪GL_{n+1}"]
    T4["Thm: Exact seq K₀\n0→K₀(A)→K₀(B)→K₀(C)→0"]
    T5["Thm: Mayer–Vietoris\nsquare → long exact"]
    D1 --> D2
    D2 --> T1
    T1 --> T2
    D3 --> T3
    D4 --> T4
    T4 --> T5""",
    "k_theory-topological": """graph TD
    D1["Def: Vector bundle\nE→X, locally trivial"]
    D2["Def: K⁰(X)\nGrothendieck of bundles"]
    D3["Def: K⁻¹(X)\nK⁰(ΣX) suspension"]
    D4["Def: Reduced K̃\nK̃⁰ = coker K⁰(pt)→K⁰(X)"]
    T1["Thm: K⁰(X) ring\n⊕,⊗ on bundles"]
    T2["Thm: Swan\nbundles ↔ proj C(X)-mods"]
    T3["Thm: Bott periodicity\nK⁻ⁿ≅K⁻ⁿ⁻²"]
    T4["Thm: Thom isomorphism\nK(E)≅K(X) for spin^c"]
    T5["Thm: Atiyah–Hirzebruch\nspectral sequence"]
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D2 --> T1
    T1 --> T2
    D3 --> T3
    T3 --> T4""",
    "k_theory-operator": """graph TD
    D1["Def: K₀(A) C*-alg\nproj mods over A"]
    D2["Def: K₁(A)\nU(A)/U(A)_0"]
    D3["Def: Ext group\nExt(A) for C*-alg A"]
    D4["Def: Suspension SA\nC₀(R)⊗A"]
    T1["Thm: K₀(A)≅K₁(SA)\nBott periodicity"]
    T2["Thm: Six-term exact\nK₀,K₁,∂ in exact seq"]
    T3["Thm: Ext = K¹\nKasparov"]
    T4["Thm: Index map\nFredholm → K-theory"]
    T5["Thm: Pimsner–Voiculescu\nK of crossed products"]
    D1 --> D2
    D2 --> D4
    D4 --> T1
    T1 --> T2
    D3 --> T3
    T2 --> T4""",
    "k_theory-bott": """graph TD
    D1["Def: Reduced K⁻ⁿ\nK̃(ΣⁿX)"]
    D2["Def: 8-fold periodicity\nn mod 8"]
    D3["Def: Clifford alg\nCℓ_n representation"]
    D4["Def: Real K-theory\nKO, KR"]
    T1["Thm: K⁻ⁿ≅K⁻ⁿ⁻²\ncomplex 2-periodicity"]
    T2["Thm: KO⁻ⁿ≅KO⁻ⁿ⁻⁸\nreal 8-periodicity"]
    T3["Thm: Bott generator\nβ ∈ π₂(U)"]
    T4["Thm: Atiyah–Bott–Shapiro\nClifford → K-theory"]
    T5["Thm: Thom\norientability → K-class"]
    D1 --> D2
    D2 --> T2
    T1 --> T2
    D3 --> T4
    D4 --> T5""",
    "quantum_algebra-groups": """graph TD
    D1["Def: Hopf algebra\nΔ,ε,S comult,counit,antipode"]
    D2["Def: U_q(g)\nq-deformed enveloping"]
    D3["Def: R-matrix\nR ∈ H⊗H quasi-triang"]
    D4["Def: Quasitriangular\n(Δ')R = RΔ"]
    T1["Thm: R-matrix eqn\nR₁₂R₁₃R₂₃=R₂₃R₁₃R₁₂"]
    T2["Thm: U_q(sl₂)\ngen E,F,K; relations"]
    T3["Thm: Rep category\nbraided monoidal"]
    T4["Thm: Quantum double\nD(H) construction"]
    T5["Thm: R gives braiding\nτ∘(π⊗ρ)∘R"]
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> T1
    T1 --> T3
    T3 --> T5""",
    "quantum_algebra-hopf": """graph TD
    D1["Def: Coalgebra\nΔ,ε comult,counit"]
    D2["Def: Bialgebra\nalg + coalg compatible"]
    D3["Def: Antipode S\nm(S⊗id)Δ=ε"]
    D4["Def: Hopf algebra\nbialgebra with S"]
    T1["Thm: S antipode\nS(ab)=S(b)S(a)"]
    T2["Thm: S²=id\nfor cocommutative"]
    T3["Thm: Dual H*\nfinite-dim dual Hopf"]
    T4["Thm: Integral\nHaar-like elem"]
    T5["Thm: Radford formula\nS⁴=id"]
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> T1
    T1 --> T2
    T3 --> T5""",
    "quantum_algebra-operads": """graph TD
    D1["Def: Operad P\nP(n) Σ_n-spaces"]
    D2["Def: Composition\nγ:P(k)×P(n₁)×...→P(Σnᵢ)"]
    D3["Def: Associativity\n(ab)c = a(bc)"]
    D4["Def: Algebra over P\nP(n)×Aⁿ→A"]
    T1["Thm: Assoc operad\nAss(n)=Σ_n"]
    T2["Thm: Comm operad\nCom(n)=pt"]
    T3["Thm: Free P-alg\nP∘V"]
    T4["Thm: Koszul duality\nP ↔ P^!"]
    T5["Thm: Bar-cobar\nresolution"]
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> T1
    T1 --> T2
    T2 --> T3""",
    "quantum_algebra-yangbaxter": """graph TD
    D1["Def: YBE\nR₁₂R₁₃R₂₃=R₂₃R₁₃R₁₂"]
    D2["Def: R-matrix\nR ∈ End(V⊗V)"]
    D3["Def: Braid relation\nσᵢσᵢ₊₁σᵢ=σᵢ₊₁σᵢσᵢ₊₁"]
    D4["Def: Quantum YBE\nwith spectral param"]
    T1["Thm: YBE ⇒ braid\nR gives braid rep"]
    T2["Thm: Baxterization\nsolutions from R"]
    T3["Thm: Faddeev–Reshetikhin\nQR integrability"]
    T4["Thm: Vertex models\n2D stat mech"]
    T5["Thm: Quantum groups\nU_q from R"]
    D1 --> D2
    D2 --> D3
    D3 --> T1
    T1 --> T2
    D4 --> T3
    T3 --> T4""",
    "optimization-linear": """graph TD
    D1["Def: LP std form\nmax c·x, Ax≤b, x≥0"]
    D2["Def: Feasible region\npolyhedron P"]
    D3["Def: Vertex\nbasic feasible sol"]
    D4["Def: Slack variables\nAx+s=b"]
    T1["Thm: Opt at vertex\nif bounded, opt at vert"]
    T2["Thm: Duality\nmax c·x ⟺ min b·y"]
    T3["Thm: Strong duality\nif both feasible"]
    T4["Thm: Farkas lemma\nAx≤b feasible iff..."]
    T5["Thm: Complementary slack\nx*,y* opt ⟺ ..."]
    D1 --> D2
    D2 --> D3
    D3 --> T1
    D1 --> T2
    T2 --> T3
    T3 --> T5""",
    "optimization-simplex": """graph TD
    D1["Def: Simplex tableau\n[B|N], b, c"]
    D2["Def: Pivot\nenter/leave var"]
    D3["Def: Bland's rule\nanti-cycling"]
    D4["Def: Two-phase\nPhase I: feasibility"]
    T1["Thm: Finite steps\nnondegenerate ⇒ finite"]
    T2["Thm: Optimality cond\nc_N − c_B B⁻¹N ≤ 0"]
    T3["Thm: Simplex alg\npivot to improve"]
    T4["Thm: Cycling\nBland prevents cycle"]
    T5["Thm: Complexity\nKlee–Minty exp"]
    D1 --> D2
    D2 --> D3
    D3 --> T1
    T1 --> T3
    D3 --> T4""",
    "optimization-duality": """graph TD
    D1["Def: Primal (P)\nmax c·x, Ax≤b"]
    D2["Def: Dual (D)\nmin b·y, A'y≥c, y≥0"]
    D3["Def: Weak duality\nc·x ≤ b·y"]
    D4["Def: Complementary slack\nxⱼ(A'y−c)ⱼ=0"]
    T1["Thm: Strong duality\nval(P)=val(D) if feasible"]
    T2["Thm: Complement slack\nx*,y* opt ⟺ slack"]
    T3["Thm: Farkas\ninfeasibility cert"]
    T4["Thm: KKTT\nLP KKT = duality"]
    T5["Thm: Dual simplex\nfrom dual feas"]
    D1 --> D2
    D2 --> D3
    D3 --> T1
    T1 --> T2
    D4 --> T2""",
    "optimization-control": """graph TD
    D1["Def: State x(t)\ncontrolled dynamics"]
    D2["Def: Control u(t)\nadmissible"]
    D3["Def: Cost functional\nJ = ∫L + φ(x_T)"]
    D4["Def: Hamiltonian H\nH = L + λ·f"]
    T1["Thm: Pontryagin max\nu* maximizes H"]
    T2["Thm: HJB eqn\n−V_t = min_u H"]
    T3["Thm: Bang-bang\nL linear ⇒ bound"]
    T4["Thm: LQR\nquadratic → Riccati"]
    T5["Thm: Bellman\noptimality principle"]
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> T1
    T1 --> T2
    T2 --> T4""",
    "information_theory-entropy": """graph TD
    D1["Def: Shannon entropy\nH(X)=−Σ p log p"]
    D2["Def: Conditional H\nH(X|Y)=E_Y H(X|Y=y)"]
    D3["Def: Mutual info\nI(X;Y)=H(X)−H(X|Y)"]
    D4["Def: Joint entropy\nH(X,Y) chain rule"]
    T1["Thm: H(X)≥0\nequality iff deterministic"]
    T2["Thm: Chain rule\nH(X,Y)=H(X)+H(Y|X)"]
    T3["Thm: I(X;Y)≥0\nindep iff 0"]
    T4["Thm: Data processing\nI(X;Z)≤I(X;Y)"]
    T5["Thm: Fano\nH(X|Y)≤H(P_e)"]
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D1 --> T1
    T2 --> T3
    T3 --> T4""",
    "information_theory-channel": """graph TD
    D1["Def: Channel\np(y|x) conditional"]
    D2["Def: Capacity\nC = max I(X;Y)"]
    D3["Def: DMC\nmemoryless"]
    D4["Def: Input constraint\nE[cost(X)]≤B"]
    T1["Thm: Shannon capacity\nC = max I(X;Y)"]
    T2["Thm: Coding thm\nR<C ⇒ reliable"]
    T3["Thm: Converse\nR>C ⇒ unreliable"]
    T4["Thm: AWGN\nC = ½ log(1+SNR)"]
    T5["Thm: Blahut–Arimoto\nalg for C"]
    D1 --> D2
    D2 --> D3
    D3 --> T1
    T1 --> T2
    T2 --> T3""",
    "information_theory-coding": """graph TD
    D1["Def: Source code\nenc: X^n→{0,1}*"]
    D2["Def: Channel code\nenc, dec, rate R"]
    D3["Def: Block error\nP_e = P(dec(Y)≠X)"]
    D4["Def: Rate R\nbits/channel use"]
    T1["Thm: Source coding\nR≥H(X) for lossless"]
    T2["Thm: Channel coding\nR<C ⇒ ∃ code"]
    T3["Thm: Joint src-ch\nseparation optimal"]
    T4["Thm: Lempel–Ziv\nuniversal compress"]
    T5["Thm: Polar codes\ncapacity achieving"]
    D1 --> D2
    D2 --> D3
    D3 --> T1
    T1 --> T2
    T2 --> T4""",
    "information_theory-rate": """graph TD
    D1["Def: Distortion d\nx,̂x → d(x,̂x)"]
    D2["Def: Rate–distortion R(D)\nmin R for E[d]≤D"]
    D3["Def: Distortion–rate D(R)\ninverse"]
    D4["Def: Test channel\np(̂x|x)"]
    T1["Thm: R(D) = min I(X;̂X)"]
    T2["Thm: Convex\nR(D) convex ∩"]
    T3["Thm: Parametric\nλ, waterfilling"]
    T4["Thm: Gaussian\nR(D)=½log(σ²/D)"]
    T5["Thm: Blahut\niterative algo"]
    D1 --> D2
    D2 --> D3
    D3 --> T1
    T1 --> T2
    T2 --> T4""",
    "mathematical_physics-classical": """graph TD
    D1["Def: Lagrangian L\nL(q,q̇,t)"]
    D2["Def: Action S\nS = ∫L dt"]
    D3["Def: Hamiltonian H\nH = p·q̇ − L"]
    D4["Def: Poisson bracket\n{f,g} = ∂f/∂q ∂g/∂p − ..."]
    T1["Thm: Euler–Lagrange\n∂L/∂q = d/dt ∂L/∂q̇"]
    T2["Thm: Hamilton eqs\nq̇=∂H/∂p, ṗ=−∂H/∂q"]
    T3["Thm: Least action\nδS=0 ⇒ E-L"]
    T4["Thm: Noether\nsymmetry → conserved"]
    T5["Thm: Liouville\n{H,f}=0 ⇒ const"]
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D1 --> T1
    T1 --> T3
    T2 --> T4""",
    "mathematical_physics-quantum": """graph TD
    D1["Def: State vector\n|ψ⟩ ∈ H Hilbert"]
    D2["Def: Observable\nA = A* self-adj op"]
    D3["Def: Expectation\n⟨A⟩ = ⟨ψ|A|ψ⟩"]
    D4["Def: Commutator [A,B]\nAB−BA"]
    T1["Thm: Born rule\nprob = |⟨φ|ψ⟩|²"]
    T2["Thm: Heisenberg\n[A,B] = iℏ{A,B}"]
    T3["Thm: Uncertainty\nΔA ΔB ≥ |⟨[A,B]⟩|/2"]
    T4["Thm: Schrödinger\niℏ ∂ψ/∂t = Hψ"]
    T5["Thm: Spectral\nA = ∫λ dE_λ"]
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D1 --> T1
    D4 --> T2
    T2 --> T3
    T4 --> T5""",
    "mathematical_physics-field": """graph TD
    D1["Def: Lagrangian density\nℒ(φ,∂φ)"]
    D2["Def: Action S\nS = ∫ℒ d⁴x"]
    D3["Def: Gauge field\nA_μ, D_μ = ∂_μ + ieA_μ"]
    D4["Def: Covariant deriv\nD_μ φ"]
    T1["Thm: Euler–Lagrange\n∂ℒ/∂φ = ∂_μ ∂ℒ/∂(∂_μφ)"]
    T2["Thm: Noether\nsymmetry → J^μ conserved"]
    T3["Thm: Gauge invariance\nℒ(A+∂χ) = ℒ(A)"]
    T4["Thm: Yang–Mills\nF_μν = ∂_μA_ν − ∂_νA_μ + [A_μ,A_ν]"]
    T5["Thm: Higgs\nspontaneous symmetry break"]
    D1 --> D2
    D2 --> T1
    T1 --> T2
    D3 --> D4
    D4 --> T3""",
    "mathematical_physics-statmech": """graph TD
    D1["Def: Partition fn\nZ = Σ exp(−βE)"]
    D2["Def: Canonical\nZ(β,V,N)"]
    D3["Def: Grand canon\nΞ(μ,V,T)"]
    D4["Def: Free energy F\nF = −kT log Z"]
    T1["Thm: F = U − TS\nHelmholtz"]
    T2["Thm: Equipartition\n½kT per dof"]
    T3["Thm: Phase transition\nsingularity in F"]
    T4["Thm: Critical exponents\nuniversality"]
    T5["Thm: Ising\n2D exact solution"]
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> T1
    T1 --> T2
    T2 --> T3""",
}

ATTRIBUTION_HTML = {
    "operator_algebras-cstar": '''<span class="meta-item attribution-wrap"><span class="attribution-trigger meta-item">Cite</span><div class="attribution-popover"><strong>Primary:</strong> Israel Gelfand, Mark Naimark<br><strong>Publication:</strong> Gelfand–Naimark theorem (1943)<br><strong>URL:</strong> <a href="https://en.wikipedia.org/wiki/Gelfand%E2%80%93Naimark_theorem" target="_blank">Wikipedia</a></div></span>''',
    "information_theory-entropy": '''<span class="meta-item attribution-wrap"><span class="attribution-trigger meta-item">Cite</span><div class="attribution-popover"><strong>Primary:</strong> Claude Shannon<br><strong>Publication:</strong> A Mathematical Theory of Communication (1948)<br><strong>URL:</strong> <a href="https://en.wikipedia.org/wiki/Entropy_(information_theory)" target="_blank">Wikipedia</a></div></span>''',
}

TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }}
        .container {{ max-width: 1600px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }}
        .header {{ background: linear-gradient(135deg, {color} 0%, {color2} 100%); color: white; padding: 30px; }}
        .header-meta {{ display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; font-size: 0.9em; opacity: 0.9; }}
        .meta-item {{ background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; }}
        .nav-links {{ padding: 15px 30px; background: #f8f9fa; border-bottom: 1px solid #ecf0f1; }}
        .nav-links a {{ color: {color}; text-decoration: none; margin-right: 20px; font-weight: 500; }}
        .content {{ padding: 30px; }}
        .mermaid {{ background: white; padding: 20px; border-radius: 10px; border: 1px solid #ecf0f1; overflow-x: auto; min-height: 450px; }}
        .info-card {{ background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px; }}
        .frontier {{ margin-top: 20px; padding: 15px; font-size: 0.9em; }}
        .attribution-wrap {{ position: relative; }}
        .attribution-trigger {{ cursor: help; background: rgba(255,255,255,0.2) !important; }}
        .attribution-popover {{ display: none; position: absolute; top: 100%; left: 0; margin-top: 4px; background: #2c3e50; color: #ecf0f1; padding: 14px 18px; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.25); min-width: 300px; z-index: 100; font-size: 0.85em; line-height: 1.5; }}
        .attribution-popover::before {{ content: ''; position: absolute; bottom: 100%; left: 0; right: 0; height: 12px; }}
        .attribution-popover strong {{ color: #fff; }}
        .attribution-popover a {{ color: {color}; }}
        .attribution-wrap:hover .attribution-popover, .attribution-wrap:focus-within .attribution-popover {{ display: block; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>{title}</h1><div class="header-meta"><span class="meta-item">{subcat}</span>{attribution_html}</div></div>
        <div class="nav-links"><a id="back-link" href="#">← Back</a><a id="index-link" href="#">Index</a></div>
        <script>(function(){{const b=window.location.hostname.includes('storage.googleapis.com')?'https://storage.googleapis.com/regal-scholar-453620-r7-podcast-storage/mathematics-processes-database':'../..';document.getElementById('back-link').href=b+'/mathematics-database-table.html';document.getElementById('index-link').href=b+'/processes/{subdir}/{subdir}.html';}})();</script>
        <div class="content">
            <p style="margin-bottom:20px;">{desc}</p>
            <div class="mermaid">{mermaid_graph}
    classDef definition fill:{color},color:#fff
    classDef theorem fill:{color2},color:#fff
    class D1,D2,D3,D4 definition
    class T1,T2,T3,T4,T5 theorem</div>
            <div class="info-card"><h3>Process Statistics</h3><ul><li><strong>Nodes:</strong> 14</li><li><strong>Edges:</strong> 11</li></ul></div>
            <div class="frontier"><strong>Frontier:</strong> <a href="https://arxiv.org/list/{arxiv}/recent" target="_blank">{arxiv}</a></div>
        </div>
    </div>
    <script>mermaid.initialize({{ startOnLoad: true, flowchart: {{ useMaxWidth: true, htmlLabels: true }} }});</script>
</body>
</html>
'''

ARXIV = {
    "operator_algebras": "math.OA",
    "k_theory": "math.KT",
    "quantum_algebra": "math.QA",
    "optimization": "math.OC",
    "information_theory": "math.IT",
    "mathematical_physics": "math.MP",
}

def lighter(c):
    # simple lighten
    h = c.lstrip('#')
    r, g, b = int(h[0:2],16), int(h[2:4],16), int(h[4:6],16)
    r, g, b = min(255, r+40), min(255, g+40), min(255, b+40)
    return f"#{r:02x}{g:02x}{b:02x}"

def main():
    for subdir, charts in CHARTS.items():
        arxiv = ARXIV[subdir]
        subcat_name = subdir.replace("_", " ").title()
        for fname, title, color, desc in charts:
            color2 = lighter(color)
            raw_graph = MERMAID.get(fname, """graph TD
    D1["Def: ..."]
    D2["Def: ..."]
    D3["Def: ..."]
    D4["Def: ..."]
    T1["Thm: ..."]
    T2["Thm: ..."]
    T3["Thm: ..."]
    T4["Thm: ..."]
    T5["Thm: ..."]
    D1 --> T1
    D2 --> T2
    D3 --> T3
    D4 --> T4""")
            # Mermaid needs \n (backslash-n) for line breaks in labels; real newlines break parsing
            mermaid_graph = re.sub(r'([^\s])\n([^\s])', r'\1\\n\2', raw_graph)
            attribution_html = ATTRIBUTION_HTML.get(fname, "")
            content = TEMPLATE.format(
                title=title, color=color, color2=color2, desc=desc,
                subcat=subcat_name, subdir=subdir, arxiv=arxiv,
                mermaid_graph=mermaid_graph, attribution_html=attribution_html
            )
            path = os.path.join(DB, subdir, fname + ".html")
            with open(path, "w") as f:
                f.write(content)
            print(f"Wrote {path}")

if __name__ == "__main__":
    main()
