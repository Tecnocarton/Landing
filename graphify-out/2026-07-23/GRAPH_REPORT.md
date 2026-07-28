# Graph Report - Landing  (2026-07-23)

## Corpus Check
- 49 files · ~85,083 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 266 nodes · 364 edges · 30 communities (13 shown, 17 thin omitted)
- Extraction: 97% EXTRACTED · 2% INFERRED · 1% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dd36e274`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Landing UI Components & Refactor Plan
- Graphify Pipeline Documentation
- Landing Page Core Component
- NPM Dependencies
- API Layout & Analytics
- Proceso (Process) Page
- Box Finder Tool
- Careers Page & Ads Analytics
- Build Config & Dev Dependencies
- Animation Presets
- Quote Submission API
- Box Measurement Diagram & Config
- Tecnocarton Brand Logo
- Vercel Config
- Web Design Guidelines Skill
- Next.js Config
- La Polar Client Logo
- Reminisen Client Logo
- Favicon No-Background Variant
- Conventional Box Product Image
- 3R Select Pop Client Logo
- CIC Saber Vivir Client Logo
- Colbox Client Logo
- Copelec Multitienda Client Logo
- Ecomat Client Logo
- Ferretería Mueblista Client Logo
- Idelab Ingeniería Client Logo
- Tubexa Ducasse Client Logo

## God Nodes (most connected - your core abstractions)
1. `Tecnocarton Landing (Project)` - 15 edges
2. `Graphify Skill (Codex)` - 14 edges
3. `Refactor Progresivo Landing Plan` - 12 edges
4. `siteConfig` - 9 edges
5. `recommendBoxes()` - 9 edges
6. `components/landing.jsx` - 9 edges
7. `UX/UI Landing Plan` - 9 edges
8. `TecnocartonLanding()` - 7 edges
9. `unitsPerBox()` - 7 edges
10. `Query, Path, Explain Reference` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AGENTS.md Graphify Integration Rules` --conceptually_related_to--> `Graphify Skill (Codex)`  [AMBIGUOUS]
  AGENTS.md → .codex/skills/graphify/SKILL.md
- `AGENTS.md Graphify Integration Rules` --semantically_similar_to--> `Root CLAUDE.md Graphify Integration Rules`  [INFERRED] [semantically similar]
  AGENTS.md → CLAUDE.md
- `"Ejemplo medidas" <img src="/MEDIDAS.png"> usage in custom box order form` --renders_image_asset--> `MEDIDAS.png (Box Dimensions Diagram)`  [EXTRACTED]
  components/landing.jsx → public/MEDIDAS.png
- `MEDIDAS.png (Box Dimensions Diagram)` --illustrates_dimension_convention_used_by--> `Medidas INTERNAS (largo x ancho x alto) convention in stock box config`  [EXTRACTED]
  public/MEDIDAS.png → config/stockBoxes.js
- `TecnocartonLanding()` --indirect_call--> `unitsPerBox()`  [INFERRED]
  components/landing.jsx → lib/boxFinder.mjs

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Pipeline Reference Set** — _codex_skills_graphify_skill_graphifyskill, _codex_skills_graphify_references_add_watch_addwatchreference, _codex_skills_graphify_references_exports_exportsreference, _codex_skills_graphify_references_extraction_spec_extractionspecreference, _codex_skills_graphify_references_github_and_merge_githubandmergereference, _codex_skills_graphify_references_hooks_hooksreference, _codex_skills_graphify_references_query_queryreference, _codex_skills_graphify_references_transcribe_transcribereference, _codex_skills_graphify_references_update_updatereference [EXTRACTED 1.00]
- **Landing Redesign Documentation Set (Plans + Specs)** — docs_superpowers_plans_2026_05_04_refactor_landing_refactorlandingplan, docs_superpowers_plans_2026_05_04_ux_ui_landing_uxuilandingplan, docs_superpowers_specs_2026_05_04_refactor_ux_landing_design_refactoruxlandingdesignspec, docs_superpowers_specs_2026_05_04_ux_ui_landing_design_uxuilandingdesignspec [INFERRED 0.90]
- **Quote Submission Data Flow** — readme_componentslandingjsx, readme_apicontactroute, readme_redis, readme_resendapi [EXTRACTED 1.00]

## Communities (30 total, 17 thin omitted)

### Community 0 - "Landing UI Components & Refactor Plan"
Cohesion: 0.07
Nodes (41): .client-card CSS class, superpowers:executing-plans skill, lib/hooks.js, ProductCard component (dead code), Refactor Progresivo Landing Plan, StatCard component (dead code), superpowers:subagent-driven-development skill, useCarousel hook (+33 more)

### Community 1 - "Graphify Pipeline Documentation"
Cohesion: 0.07
Nodes (31): Add & Watch Reference, /graphify add command, --watch folder watcher, Confidence Scoring Rubric, Extraction Subagent Prompt Spec, Node ID Format Rule, GitHub Clone & Cross-Repo Merge Reference, graphify clone command (+23 more)

### Community 2 - "Landing Page Core Component"
Cohesion: 0.08
Nodes (25): fadeInUp, MultiSelectDropdown, ONDA_OPTIONS, scaleIn, scrollToSection(), staggerContainer, StatCard, TecnocartonLanding() (+17 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.10
Nodes (21): clsx, framer-motion, ioredis, lucide-react, next, dependencies, clsx, framer-motion (+13 more)

### Community 4 - "API Layout & Analytics"
Cohesion: 0.16
Nodes (15): POST(), resend, sanitizeInput(), sanitizePhone(), metadata, viewport, WhatsAppButton(), siteConfig (+7 more)

### Community 5 - "Proceso (Process) Page"
Cohesion: 0.09
Nodes (21): fadeInUp, getProcessIcon(), getSustainabilityIcon(), Proceso(), scaleIn, staggerContainer, fadeInUp, SharedFooter() (+13 more)

### Community 6 - "Box Finder Tool"
Cohesion: 0.24
Nodes (14): BoxFinder(), fmt(), inputStyle(), labelStyle, products, stockBoxes, fitsInBox(), isValidTriple() (+6 more)

### Community 7 - "Careers Page & Ads Analytics"
Cohesion: 0.40
Nodes (6): Exports & Benchmark Reference, FalkorDB Export, MCP stdio Server, Neo4j Export, Token Reduction Benchmark, Wiki Export

### Community 8 - "Build Config & Dev Dependencies"
Cohesion: 0.11
Nodes (17): autoprefixer, devDependencies, autoprefixer, postcss, sharp, tailwindcss, name, private (+9 more)

### Community 13 - "Quote Submission API"
Cohesion: 0.39
Nodes (7): COUNTER_FILE, getNextQuoteNumber(), getRedisClient(), POST(), resend, sanitizeInput(), sanitizePhone()

### Community 15 - "Box Measurement Diagram & Config"
Cohesion: 0.29
Nodes (7): "Ejemplo medidas" <img src="/MEDIDAS.png"> usage in custom box order form, Medidas INTERNAS (largo x ancho x alto) convention in stock box config, Alto (Height) Dimension Label, Ancho (Width) Dimension Label, MEDIDAS.png (Box Dimensions Diagram), Fragile / Keep Dry / This Way Up Handling Icons, Largo (Length) Dimension Label

## Ambiguous Edges - Review These
- `Graphify Skill (Codex)` → `AGENTS.md Graphify Integration Rules`  [AMBIGUOUS]
  AGENTS.md · relation: conceptually_related_to
- `Graphify Skill (Codex)` → `Root CLAUDE.md Graphify Integration Rules`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to
- `Refactor Progresivo Landing Plan` → `Form Step 0 validation fix (disabled button)`  [AMBIGUOUS]
  docs/superpowers/specs/2026-05-04-refactor-ux-landing-design.md · relation: conceptually_related_to

## Knowledge Gaps
- **111 isolated node(s):** `resend`, `COUNTER_FILE`, `resend`, `metadata`, `viewport` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Graphify Skill (Codex)` and `AGENTS.md Graphify Integration Rules`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Graphify Skill (Codex)` and `Root CLAUDE.md Graphify Integration Rules`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Refactor Progresivo Landing Plan` and `Form Step 0 validation fix (disabled button)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `siteConfig` connect `API Layout & Analytics` to `Landing Page Core Component`, `Proceso (Process) Page`, `Quote Submission API`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Graphify Skill (Codex)` connect `Graphify Pipeline Documentation` to `Careers Page & Ads Analytics`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `Build Config & Dev Dependencies`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `resend`, `COUNTER_FILE`, `resend` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._