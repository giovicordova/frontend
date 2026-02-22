<state>
<updated>2026-02-22 15:00</updated>

## What exists

<codebase>
Claude Code skill system for frontend design — no application source code. The `.claude/` directory is the product: a `/frontend` command with spec, implement, review, review-fix, and refresh modes.

**Agents** (`.claude/agents/`) — 4 agent configs:
- `frontend-specifier.md` — Discovers intent, reads skills, produces implementation-ready specs
- `frontend-implementer.md` — Reads specs, detects stack, writes code
- `frontend-auditor.md` — Evaluates code against a single skill checklist (read-only, sonnet)
- `frontend-refresh.md` — Navigates Pinterest/portfolio via Chrome DevTools, captures taste observations

**Skills** (`.claude/skills/frontend/`) — 9 domain checklists:
- `taste.md` — Aesthetic observations (auto-refreshed every 30 days, currently empty — needs first `/frontend refresh`)
- `visual-design.md`, `ux-ia.md`, `interaction-motion.md`, `layout-responsive.md`
- `accessibility.md`, `component-architecture.md`, `forms-data.md`, `content-microcopy.md`

**Hooks** (`.claude/hooks/`) — 3 CJS quality gates:
- `frontend-quality-gate.cjs` — PostToolUse: warns on a11y/performance violations in frontend files
- `frontend-team-idle-gate.cjs` — TeammateIdle: blocks idle while tasks remain
- `frontend-team-task-gate.cjs` — TaskCompleted: blocks audit without findings, blocks fix with lint/type errors

**Command** (`.claude/commands/frontend.md`) — Slash command router for all modes.

**Project reports** (`.claude/project/reports/`):
- `improvement-plan.md` — 44 improvements applied, 0 pending, 0 rejected (tracked)
- `active-directives.md` — 3 behavioral rules for SI cycles (untracked)
- `reasoning.md`, `data-patterns.md`, `system-observations.md` — SI artifacts (gitignored)

**Adjacent work** (gitignored — workspace-only, not part of the skill system):
- `research/frontend-research.md` — Research notes on frontend design approaches
- `ui/colors/colours.md` — 9-colour dual-mode palette with CSS variables
- `typography/` — Separate git repo with typocraft-v1 and typocraft-v2 Python projects
</codebase>

<structure>
frontend/
  .claude/
    agents/
      frontend-{specifier,implementer,auditor,refresh}.md
    commands/
      frontend.md
    hooks/
      frontend-{quality-gate,team-idle-gate,team-task-gate}.cjs
    skills/frontend/
      taste.md, visual-design.md, ux-ia.md, interaction-motion.md,
      layout-responsive.md, accessibility.md, component-architecture.md,
      forms-data.md, content-microcopy.md
    project/
      state.md, vision.md
      reports/{improvement-plan,active-directives,reasoning,system-observations,data-patterns}.md
    settings.json
  research/                      (gitignored)
  typography/                    (gitignored, separate git repo)
  ui/                            (gitignored)
  .frontend-specs/               (gitignored — runtime output)
  .gitignore
  CLAUDE.md
  README.md
  LICENSE
</structure>

<tests>
No tests. This is a prompt/config system — no executable code beyond 3 hook scripts.
</tests>

<design>
- Routing: `/frontend` command parses arguments → dispatches to agents by mode
- Staleness: taste.md checked for 30-day freshness before spec/implement/review
- Review-fix: agent team (auditor + fixer) with closed-loop validation, gated by hooks
- Hooks: CJS, fail open on errors, use word-boundary regex for task matching, walk up to project root for path resolution
- Skills: domain checklists with scope/principles/patterns/checklist sections
- All paths project-relative (`.claude/`), never global (`~/.claude/`)
- Agent teams enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json
</design>

<git>
Branch: main (up to date with origin/main)
Staged: vision.md (new)
Unstaged: 11 modified files (agents, hooks, command, skills, reports, CLAUDE.md, README.md)
Untracked: active-directives.md

Recent commits:
- da2da9d fix: apply 7 improvements and add project state tracking
- 4d978ad fix(hooks): resolve 7 bugs in frontend hook system
- 69ce8fe feat: initial release — Claude Code skill system for frontend design
</git>

## What's next

The skill system is functional and stable after 3 SI observation cycles (44 improvements applied). The gap between vision and current state:

1. **Real-world validation** — Drop the system into an actual frontend project and run `/frontend` end-to-end to find friction.
2. **Taste data** — `taste.md` is empty. Run `/frontend refresh` with real Pinterest/portfolio URLs to populate curated observations.
3. **Colour & typography integration** — The `ui/colors/` palette and `typography/` work exist as adjacent artifacts. They could inform skill checklists (e.g., visual-design.md could reference the project palette).

</state>
