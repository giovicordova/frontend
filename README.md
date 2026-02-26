# Frontend

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill system for frontend design. It adds a `/frontend` command that routes tasks to specialized agents, evaluates code against domain checklists, and enforces quality through hooks.

## What it does

| Mode | Command | Description |
|------|---------|-------------|
| Spec | `/frontend [task]` | Asks clarifying questions, then produces an implementation-ready spec with layout, visual design, accessibility, and interaction details |
| Ref | `/frontend ref <url>` | Screenshots a reference URL at desktop and mobile, extracts visual observations, saves to `.frontend-specs/refs/` |
| Implement | `/frontend implement` | Reads a spec and writes code matching it exactly, adapting to the detected project stack |
| Review | `/frontend review [path]` | Runs parallel auditors against domain checklists, produces a findings report |
| Review + Fix | `/frontend review-fix [path]` | Same as review, but spawns an agent team that audits, fixes, re-validates, and reports |
| Lighthouse | `/frontend lighthouse` | Runs headless Lighthouse against your dev server, reports scores, optionally fixes failures automatically |
| Scan | `/frontend scan` | Profiles the existing codebase — detects framework, CSS, component library, conventions, tooling |
| Improve | `/frontend improve [path]` | Full brownfield flow: scan + review + lighthouse + triage + incremental fixes |
| Refresh | `/frontend refresh` | Scrapes Pinterest/portfolio via Chrome DevTools and updates taste observations |

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- For `review-fix` mode: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (pre-configured in `.claude/settings.json`)
- For `refresh`, `ref`, and reference inspection: Chrome with a DevTools MCP connection (see [Chrome DevTools MCP](https://github.com/anthropics/anthropic-quickstarts/tree/main/chrome-devtools-mcp) for setup)
- For `/frontend lighthouse`: a running dev server (`npm run dev`) and Node.js access to `npx lighthouse`

## Installation

### Per-project (recommended for trying it out)

Copy the `.claude/` directory into your project root:

```text
your-project/
  .claude/           <-- copy this directory
  src/
  package.json
  ...
```

Then add hook entries to your project's `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [{ "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "node .claude/hooks/frontend-quality-gate.cjs" }] }],
    "TeammateIdle": [{ "hooks": [{ "type": "command", "command": "node .claude/hooks/frontend-team-idle-gate.cjs" }] }],
    "TaskCompleted": [{ "hooks": [{ "type": "command", "command": "node .claude/hooks/frontend-team-task-gate.cjs" }] }]
  }
}
```

### Global (available in all projects)

Symlink agents, command, hooks, and skills into `~/.claude/`:

```bash
FRONTEND_DIR="/path/to/frontend/.claude"

# agents
for f in frontend-auditor frontend-implementer frontend-refresh frontend-scanner frontend-specifier; do
  ln -sf "$FRONTEND_DIR/agents/$f.md" ~/.claude/agents/
done

# command, hooks, skills
ln -sf "$FRONTEND_DIR/commands/frontend.md" ~/.claude/commands/
for f in frontend-quality-gate.cjs frontend-team-idle-gate.cjs frontend-team-task-gate.cjs; do
  ln -sf "$FRONTEND_DIR/hooks/$f" ~/.claude/hooks/
done
ln -sf "$FRONTEND_DIR/skills/frontend" ~/.claude/skills/
```

Then add the same hook entries above to your **global** `~/.claude/settings.json`, using `~/.claude/hooks/` paths instead of `.claude/hooks/`.

Specs, reviews, references, and team artifacts are written to `.frontend-specs/` in your project root. Add it to `.gitignore`.

## Architecture

### Agents (`.claude/agents/`)

| Agent | Role | Model |
|-------|------|-------|
| `frontend-specifier` | Discovers intent, reads skill files, produces specs | opus |
| `frontend-implementer` | Reads specs, detects stack, writes code | default |
| `frontend-auditor` | Evaluates code against a single skill checklist (read-only) | sonnet |
| `frontend-scanner` | Profiles existing codebases — stack, conventions, tooling | sonnet |
| `frontend-refresh` | Navigates reference URLs, captures aesthetic observations | default |

### Skills (`.claude/skills/frontend/`)

Domain checklists that auditors and specifiers evaluate against. Each skill has two files:

- **`{domain}.md`** — Scope + checklist only (used by auditors and for quick spec tasks)
- **`{domain}.deep.md`** — Principles + patterns (used by specifier for full pages, redesigns, and design systems)

Domains:

- **taste** — Aesthetic observations from Pinterest/portfolio (single file, no deep variant)
- **visual-design** — Typography, color, hierarchy, elevation, whitespace
- **ux-ia** — Information architecture, navigation, user flows
- **interaction-motion** — Transitions, micro-interactions, animation constraints
- **layout-responsive** — Grid, breakpoints, container patterns, responsive behavior
- **accessibility** — WCAG AAA, keyboard, screen reader, focus management, contrast
- **component-architecture** — API design, composition, state management, naming
- **forms-data** — Validation, error states, data display, input patterns
- **content-microcopy** — Labels, empty states, error messages, loading copy
- **performance** — Core Web Vitals targets, image optimization, font loading, SEO meta tags, Best Practices signals — mapped directly to Lighthouse audit IDs

### Hooks (`.claude/hooks/`)

| Hook | Trigger | Behavior |
|------|---------|----------|
| `frontend-quality-gate.cjs` | `PostToolUse` (Write/Edit) | Warns on common a11y and performance violations in frontend files |
| `frontend-team-idle-gate.cjs` | `TeammateIdle` | Blocks teammates from idling while tasks remain |
| `frontend-team-task-gate.cjs` | `TaskCompleted` | Blocks audit completion without findings; blocks fix completion if lint/types fail |

### Quality gate configuration (`.claude/frontend-gaterc.json`)

The quality gate hook supports per-check configuration. Create `.claude/frontend-gaterc.json` to override defaults:

```json
{
  "checks": {
    "outline-none": { "enabled": false },
    "img-dimensions": { "severity": "block" }
  }
}
```

Only overrides need to be specified — missing keys use defaults (enabled, severity: "warn"). Available check IDs: `outline-none`, `img-alt`, `onclick-role`, `tabindex-positive`, `img-dimensions`, `aria-hidden-container`, `img-loading`, `link-text`, `title-tag`, `font-display-swap`, `document-write`, `render-blocking-script`. Severity levels: `warn` (stderr, exit 0), `block` (stderr, exit 2), `off` (skip).

### Command (`.claude/commands/frontend.md`)

The `/frontend` slash command. Parses arguments, detects mode, checks taste data, and dispatches to the appropriate agent or team workflow.

**Taste behavior:** If taste observations are empty, the command suggests running `/frontend refresh` but does not block. If populated, taste data is used silently.

**Dialogue phase (spec mode):** Before dispatching to the specifier, the command asks up to 3 clarifying questions — what you're building, any reference URLs/screenshots, and any constraints. Answers are bundled into the specifier prompt.

**Dynamic model selection (spec mode):** The command classifies task scope (single component vs full page vs design system) and picks sonnet for focused tasks or opus for complex ones. This controls cost without sacrificing quality where it matters.

## Quick start

```bash
# generate a spec for a component
/frontend hero section with email signup

# inspect a reference site
/frontend ref https://stripe.com/payments

# profile the codebase
/frontend scan

# improve existing code (scan + review + lighthouse + fix)
/frontend improve src/components/

# review existing code against checklists
/frontend review src/components/

# audit and auto-fix
/frontend review-fix src/components/

# run Lighthouse audit
/frontend lighthouse
```

## Contributing

### Adding a skill domain

1. Create `.claude/skills/frontend/{domain}.md` with scope and checklist sections
2. Create `.claude/skills/frontend/{domain}.deep.md` with principles and patterns sections
3. Add the domain to the classification table in `.claude/commands/frontend.md`
4. Auditors automatically pick it up when files match the classification

### Workflow

- Branch from `main`, one skill domain per PR
- Conventional commits: `type(scope): description`

## How review-fix teams work

When agent teams are enabled, `review-fix` creates a closed loop:

1. **Auditor** (sonnet) reads all applicable skill files, evaluates target code, writes structured findings
2. **Fixer** (opus) reads findings, applies fixes, runs lint/type-check
3. **Auditor** validates fixes against original findings
4. **Lead** synthesizes the final report

Hooks enforce the loop — the auditor can't complete without structured findings, and the fixer can't complete with failing lint or types.

## License

MIT
