# Graph Report - Landing  (2026-07-28)

## Corpus Check
- 91 files · ~110,814 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 423 nodes · 779 edges · 32 communities (15 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.87)
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
- layout.js
- seo.js
- layout.js
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
1. `siteConfig` - 20 edges
2. `theme` - 17 edges
3. `Tecnocarton Landing (Project)` - 15 edges
4. `Graphify Skill (Codex)` - 14 edges
5. `buildMetadata()` - 12 edges
6. `Refactor Progresivo Landing Plan` - 12 edges
7. `SharedFooter()` - 11 edges
8. `recommendBoxes()` - 10 edges
9. `scrollToSection()` - 9 edges
10. `components/landing.jsx` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AGENTS.md Graphify Integration Rules` --conceptually_related_to--> `Graphify Skill (Codex)`  [AMBIGUOUS]
  AGENTS.md → .codex/skills/graphify/SKILL.md
- `AGENTS.md Graphify Integration Rules` --semantically_similar_to--> `Root CLAUDE.md Graphify Integration Rules`  [INFERRED] [semantically similar]
  AGENTS.md → CLAUDE.md
- `MEDIDAS.png (Box Dimensions Diagram)` --illustrates_dimension_convention_used_by--> `Medidas INTERNAS (largo x ancho x alto) convention in stock box config`  [EXTRACTED]
  public/MEDIDAS.png → config/stockBoxes.js
- `Root CLAUDE.md Graphify Integration Rules` --conceptually_related_to--> `Graphify Skill (Codex)`  [AMBIGUOUS]
  CLAUDE.md → .codex/skills/graphify/SKILL.md
- `BloqueContacto()` --calls--> `formatHours()`  [EXTRACTED]
  app/catalogo/page.js → lib/hours.mjs

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Pipeline Reference Set** — _codex_skills_graphify_skill_graphifyskill, _codex_skills_graphify_references_add_watch_addwatchreference, _codex_skills_graphify_references_exports_exportsreference, _codex_skills_graphify_references_extraction_spec_extractionspecreference, _codex_skills_graphify_references_github_and_merge_githubandmergereference, _codex_skills_graphify_references_hooks_hooksreference, _codex_skills_graphify_references_query_queryreference, _codex_skills_graphify_references_transcribe_transcribereference, _codex_skills_graphify_references_update_updatereference [EXTRACTED 1.00]
- **Landing Redesign Documentation Set (Plans + Specs)** — docs_superpowers_plans_2026_05_04_refactor_landing_refactorlandingplan, docs_superpowers_plans_2026_05_04_ux_ui_landing_uxuilandingplan, docs_superpowers_specs_2026_05_04_refactor_ux_landing_design_refactoruxlandingdesignspec, docs_superpowers_specs_2026_05_04_ux_ui_landing_design_uxuilandingdesignspec [INFERRED 0.90]
- **Quote Submission Data Flow** — readme_componentslandingjsx, readme_apicontactroute, readme_redis, readme_resendapi [EXTRACTED 1.00]

## Communities (32 total, 17 thin omitted)

### Community 0 - "Landing UI Components & Refactor Plan"
Cohesion: 0.07
Nodes (41): .client-card CSS class, superpowers:executing-plans skill, lib/hooks.js, ProductCard component (dead code), Refactor Progresivo Landing Plan, StatCard component (dead code), superpowers:subagent-driven-development skill, useCarousel hook (+33 more)

### Community 1 - "Graphify Pipeline Documentation"
Cohesion: 0.06
Nodes (37): Add & Watch Reference, /graphify add command, --watch folder watcher, Exports & Benchmark Reference, FalkorDB Export, MCP stdio Server, Neo4j Export, Token Reduction Benchmark (+29 more)

### Community 2 - "Landing Page Core Component"
Cohesion: 0.10
Nodes (26): CaseStudies(), ClientsCarousel(), carouselImages, Hero(), StatCard, Nav(), Products(), LINKS (+18 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.05
Nodes (38): autoprefixer, clsx, framer-motion, ioredis, lucide-react, next, dependencies, clsx (+30 more)

### Community 4 - "API Layout & Analytics"
Cohesion: 0.11
Nodes (15): metadata, metadata, getProcessIcon(), getSustainabilityIcon(), Proceso(), scaleIn, staggerContainer, benefits (+7 more)

### Community 5 - "Proceso (Process) Page"
Cohesion: 0.18
Nodes (10): 1. Preparar la planilla, 2. Crear el Apps Script, 3. Desplegar como Web App, 4. Configurar variables de entorno, Columnas de la planilla (orden exacto, fila 1), Comportamiento, Configuración (una sola vez), Dónde escribe (+2 more)

### Community 6 - "Box Finder Tool"
Cohesion: 0.12
Nodes (26): BoxFinder(), fmt(), inputStyle(), labelStyle, EMPTY_FORM, MultiSelectDropdown, ONDA_OPTIONS, QuoteWizard() (+18 more)

### Community 7 - "Careers Page & Ads Analytics"
Cohesion: 0.15
Nodes (22): CatalogoDownload(), WhatsAppIcon(), WhatsAppButton(), WhatsAppQuoteButton(), GOOGLE_ADS_CONVERSIONS, pushToDataLayer(), trackContactClick(), trackCotizacionEnviada() (+14 more)

### Community 8 - "Build Config & Dev Dependencies"
Cohesion: 0.11
Nodes (24): indice, metadata, Page(), metadata, generateMetadata(), Page(), SharedFooter(), BetaBadge() (+16 more)

### Community 10 - "layout.js"
Cohesion: 0.07
Nodes (29): POST(), resend, sanitizeInput(), sanitizePhone(), metadata, metadata, generateMetadata(), Page() (+21 more)

### Community 11 - "seo.js"
Cohesion: 0.18
Nodes (11): BloqueContacto(), dmSans, plusJakarta, metadata, RootLayout(), viewport, formatHours(), openingHoursSpecification() (+3 more)

### Community 12 - "layout.js"
Cohesion: 0.22
Nodes (8): 1. Calificación por volumen en la landing (on-page), 2. Estructura SEM (Google Ads), 3. Lista de keywords negativas (filtrar B2C / no calificado), 4. SEO orgánico orientado a B2B, 5. Medición de calificación, Problema, Reestructuración SEM/SEO + landing B2B — Tecnocartón, Resumen de cambios en el sitio que soportan esto

### Community 13 - "Quote Submission API"
Cohesion: 0.18
Nodes (17): COUNTER_FILE, getNextQuoteNumber(), getRedisClient(), POST(), resend, sanitizeInput(), sanitizePhone(), unescapeHtml() (+9 more)

### Community 15 - "Box Measurement Diagram & Config"
Cohesion: 0.33
Nodes (6): Medidas INTERNAS (largo x ancho x alto) convention in stock box config, Alto (Height) Dimension Label, Ancho (Width) Dimension Label, MEDIDAS.png (Box Dimensions Diagram), Fragile / Keep Dry / This Way Up Handling Icons, Largo (Length) Dimension Label

## Ambiguous Edges - Review These
- `Graphify Skill (Codex)` → `AGENTS.md Graphify Integration Rules`  [AMBIGUOUS]
  AGENTS.md · relation: conceptually_related_to
- `Graphify Skill (Codex)` → `Root CLAUDE.md Graphify Integration Rules`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to
- `Refactor Progresivo Landing Plan` → `Form Step 0 validation fix (disabled button)`  [AMBIGUOUS]
  docs/superpowers/specs/2026-05-04-refactor-ux-landing-design.md · relation: conceptually_related_to

## Knowledge Gaps
- **146 isolated node(s):** `resend`, `COUNTER_FILE`, `resend`, `metadata`, `metadata` (+141 more)
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
- **Why does `siteConfig` connect `layout.js` to `Landing Page Core Component`, `API Layout & Analytics`, `Box Finder Tool`, `Careers Page & Ads Analytics`, `Build Config & Dev Dependencies`, `seo.js`, `Quote Submission API`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `theme` connect `Landing Page Core Component` to `Build Config & Dev Dependencies`, `layout.js`, `API Layout & Analytics`, `Box Finder Tool`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `products` connect `Box Finder Tool` to `Landing Page Core Component`, `Careers Page & Ads Analytics`, `Build Config & Dev Dependencies`, `layout.js`, `Quote Submission API`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `resend`, `COUNTER_FILE`, `resend` to the rest of the system?**
  _146 weakly-connected nodes found - possible documentation gaps or missing edges._