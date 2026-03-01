# Frontend

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill system for frontend design. Drop it into any project and Claude writes code that looks and feels intentional — with design tokens, specs, reviews, and quality enforcement.

## How it works

`/frontend` is a single conversational command. Tell it what you need and it figures out the right workflow:

```bash
# Define your project's visual identity (colors, fonts, shapes)
/frontend let's set the palette for a meditation app

# Create a spec for a component or page
/frontend hero section with email signup

# Build from a spec
/frontend implement

# Review existing code against quality checklists + token compliance
/frontend review src/components/

# Full improvement pass (scan + review + fix)
/frontend improve src/components/

# Capture a reference site
/frontend ref https://stripe.com/payments

# Update taste observations from Pinterest/portfolio
/frontend refresh
```

No modes to memorize. The command reads your project state — do design tokens exist? Is there a spec? Is there code to review? — and adapts.

## Design tokens

Every project gets a visual source of truth at `.frontend-specs/design-tokens.json`:

- **Colors** with WCAG contrast ratios pre-calculated
- **Typography** — heading and body fonts, weights, type scale
- **Shape** — border radius scale, spacing base unit

The token file is created interactively through the Brand phase. Once defined:
- Specs reference token names, not raw values
- Code uses CSS variables / design system tokens
- Reviews flag any value not traceable to tokens
- The quality gate hook catches hardcoded hex values as you write

Preview your tokens by opening `.frontend-specs/brand-preview.html` in a browser.

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- For `refresh`, `ref`, and reference inspection: Chrome with a DevTools MCP connection
- For taste refresh: Pinterest/portfolio URLs configured in `taste.md` frontmatter

## Installation

```bash
git clone <repo-url>
cd frontend
./install.sh
```

Copies skills, agents, commands, and hooks into `~/.claude/`. Idempotent — run again after `git pull` to update.

To remove:

```bash
./uninstall.sh
```

Per-project `.frontend-specs/` directories are left untouched.

## Architecture

### Agents (`agents/`)

| Agent | Role | Model |
|-------|------|-------|
| `frontend-designer` | The thinker — brand exploration, palette generation, spec writing, codebase profiling, taste refresh | opus |
| `frontend-builder` | The doer — reads specs + tokens, writes code, runs lint/type-check | sonnet |
| `frontend-reviewer` | The critic — evaluates code against skill checklists and token compliance | sonnet |

### Skills (`skills/frontend/`)

Each skill file has a checklist section (for quick audits) and a deep section (for full specs), in one file:

- **design.md** — Typography, color, visual hierarchy, grids, breakpoints, responsive behavior, WCAG AAA, keyboard nav, screen readers, focus management
- **experience.md** — User flows, navigation, animation, micro-interactions, microcopy, error messages, form validation, data tables
- **build.md** — Component API, composition, tokens, state management, Core Web Vitals, image optimization, font loading, SEO
- **taste.md** — Aesthetic observations from Pinterest/portfolio (refreshed via Chrome DevTools)

### Hook (`hooks/`)

| Hook | Trigger | Behavior |
|------|---------|----------|
| `frontend-quality-gate.cjs` | `PostToolUse` (Write/Edit) | Warns on a11y/performance violations + token compliance (hardcoded colors, fonts, radii) |

Configure per-check behavior in `.claude/frontend-gaterc.json`.

## Contributing

### Editing skills

Skills live in `skills/frontend/`. Each file has two sections separated by `--- deep ---`:
- Top section: scope + checklist (used by reviewers)
- Bottom section: principles + patterns (used by designer for complex tasks)

### Workflow

- Branch from `main`, conventional commits: `type(scope): description`

## License

MIT
