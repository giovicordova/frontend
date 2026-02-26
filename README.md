# Frontend

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill system for frontend design. It adds a `/frontend` command that routes tasks to specialized agents, evaluates code against domain checklists, and enforces quality through hooks.

## What it does

| Mode | Command | Description |
|------|---------|-------------|
| Spec | `/frontend [task]` | Produces an implementation-ready spec with layout, visual design, accessibility, and interaction details |
| Implement | `/frontend implement` | Reads a spec and writes code matching it exactly, adapting to the detected project stack |
| Review | `/frontend review [path]` | Runs parallel auditors against domain checklists, produces a findings report |
| Review + Fix | `/frontend review-fix [path]` | Same as review, but spawns an agent team that audits, fixes, re-validates, and reports |
| Refresh | `/frontend refresh` | Scrapes Pinterest/portfolio via Chrome DevTools and updates taste observations |

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- For `review-fix` mode: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (pre-configured in `.claude/settings.json`)
- For `refresh` and reference inspection: Chrome with a DevTools MCP connection (see [Chrome DevTools MCP](https://github.com/anthropics/anthropic-quickstarts/tree/main/chrome-devtools-mcp) for setup)

## Installation

Copy the `.claude/` directory into your project root (or symlink it). The system is self-contained — all paths are project-relative.

```text
your-project/
  .claude/           <-- copy this directory
  src/
  package.json
  ...
```

Specs, reviews, and team artifacts are written to `.frontend-specs/` in your project root. Add it to `.gitignore`.

## Architecture

### Agents (`.claude/agents/`)

| Agent | Role | Model |
|-------|------|-------|
| `frontend-specifier` | Discovers intent, reads skill files, produces specs | default |
| `frontend-implementer` | Reads specs, detects stack, writes code | default |
| `frontend-auditor` | Evaluates code against a single skill checklist (read-only) | sonnet |
| `frontend-refresh` | Navigates reference URLs, captures aesthetic observations | default |

### Skills (`.claude/skills/frontend/`)

Domain checklists that auditors evaluate code against:

- **taste** — Aesthetic observations from Pinterest/portfolio (auto-refreshed every 30 days)
- **visual-design** — Typography, color, hierarchy, elevation, whitespace
- **ux-ia** — Information architecture, navigation, user flows
- **interaction-motion** — Transitions, micro-interactions, animation constraints
- **layout-responsive** — Grid, breakpoints, container patterns, responsive behavior
- **accessibility** — WCAG AAA, keyboard, screen reader, focus management, contrast
- **component-architecture** — API design, composition, state management, naming
- **forms-data** — Validation, error states, data display, input patterns
- **content-microcopy** — Labels, empty states, error messages, loading copy

### Hooks (`.claude/hooks/`)

| Hook | Trigger | Behavior |
|------|---------|----------|
| `frontend-quality-gate.cjs` | `PostToolUse` (Write/Edit) | Warns on common a11y and performance violations in frontend files |
| `frontend-team-idle-gate.cjs` | `TeammateIdle` | Blocks teammates from idling while tasks remain |
| `frontend-team-task-gate.cjs` | `TaskCompleted` | Blocks audit completion without findings; blocks fix completion if lint/types fail |

### Command (`.claude/commands/frontend.md`)

The `/frontend` slash command. Parses arguments, detects mode, runs staleness checks on taste data, and dispatches to the appropriate agent or team workflow.

## Adding a skill domain

1. Create `.claude/skills/frontend/{domain}.md` with scope, principles, and checklist sections
2. Add the domain to the classification table in `.claude/commands/frontend.md`
3. Auditors automatically pick it up when files match the classification

## How review-fix teams work

When agent teams are enabled, `review-fix` creates a closed loop:

1. **Auditor** (sonnet) reads all applicable skill files, evaluates target code, writes structured findings
2. **Fixer** (opus) reads findings, applies fixes, runs lint/type-check
3. **Auditor** validates fixes against original findings
4. **Lead** synthesizes the final report

Hooks enforce the loop — the auditor can't complete without structured findings, and the fixer can't complete with failing lint or types.

## License

MIT
