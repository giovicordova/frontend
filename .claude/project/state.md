# Frontend Design System — State

## Vision

Design taste layer for AI-assisted frontend development. Drop into any project — Claude writes code that looks intentional, specs with real layout thinking, a11y baked in, reviews catch what linters miss. Self-contained, no dependencies, just `.claude/` config.

## System Inventory

### Modes (10)
| Mode | Trigger | Description |
|------|---------|-------------|
| spec | default | Dialogue → classify scope → dispatch specifier (sonnet or opus) |
| ref | `ref <url>` | Screenshot + extract visual observations |
| implement | `implement` | Read spec → write code |
| review | `review [path]` | Parallel auditors → findings report → triage → optional fix |
| review-fix | `review-fix [path]` | Agent team: auditor + fixer + validation loop |
| lighthouse | `lighthouse` | Headless Lighthouse → parse → optional fix pass |
| scan | `scan` | Profile codebase → stack, conventions, tooling report |
| improve | `improve [path]` | Full brownfield: scan + review + lighthouse + triage + fix |
| refresh | `refresh` | Scrape Pinterest/portfolio → update taste.md |
| (ref capture) | — | Internal ref file writing by specifier |

### Agents (5)
| Agent | Model | Role |
|-------|-------|------|
| frontend-specifier | opus | Spec producer (or sonnet for simple tasks via dynamic model selection) |
| frontend-implementer | sonnet | Code writer from specs |
| frontend-auditor | sonnet | Read-only checklist evaluator |
| frontend-scanner | sonnet | Codebase profiler |
| frontend-refresh | default | Taste observation scraper |

### Skills (10 domains)
taste, visual-design, ux-ia, interaction-motion, layout-responsive, accessibility, component-architecture, forms-data, content-microcopy, performance

Each has `{domain}.md` (checklist) and `{domain}.deep.md` (principles + patterns), except taste (single file).

### Hooks (3)
| Hook | Trigger | Purpose |
|------|---------|---------|
| frontend-quality-gate.cjs | PostToolUse (Write/Edit) | 12 checks with IDs, configurable via `.claude/frontend-gaterc.json` |
| frontend-team-idle-gate.cjs | TeammateIdle | Block idle while tasks remain |
| frontend-team-task-gate.cjs | TaskCompleted | Enforce audit format + lint/type pass |

### Configuration
- `.claude/frontend-gaterc.json` — per-check enable/severity overrides for quality gate
- `.claude/settings.json` — agent teams env, hook bindings
- `.frontend-specs/codebase-profile.md` — scanner output consumed by specifier, implementer, improve mode

## Key Patterns
- Specifier uses dynamic model selection: sonnet for components, opus for pages/systems
- Review mode now includes triage + optional fix dispatch
- Improve mode orchestrates scan → review → lighthouse → triage → fix → validate
- Scanner profile is reused by specifier and implementer (skip redundant detection)
- Quality gate checks have IDs and support warn/block/off severity via gaterc config
