<vision>
This project is the design taste layer missing from AI-assisted frontend development. Drop it into any project and Claude writes code that looks and feels intentional — specs with real layout thinking, accessibility baked in, visual decisions grounded in curated references. Reviews catch what linters can't: bad hierarchy, clunky interactions, inaccessible patterns. Self-contained skill system, no dependencies, just `.claude/` config.
</vision>

<state>
<updated>2026-02-24</updated>

## What exists

<codebase>
Claude Code skill system for frontend design — no application source code. The `.claude/` directory is the product: a `/frontend` command with spec, implement, review, review-fix, and refresh modes.

**Agents** (`.claude/agents/`) — 4 agent configs:
- `frontend-specifier.md` — Discovers intent from caller prompt, reads skills, produces specs (sonnet)
- `frontend-implementer.md` — Reads specs, detects stack, writes code (sonnet)
- `frontend-auditor.md` — Evaluates code against a single skill checklist, read-only (sonnet)
- `frontend-refresh.md` — Navigates Pinterest/portfolio via Chrome DevTools, captures taste observations (haiku)

**Skills** (`.claude/skills/frontend/`) — 9 domain checklists:
- `taste.md` — Aesthetic observations (auto-refreshed every 30 days, currently empty — needs first `/frontend refresh`)
- `visual-design.md`, `ux-ia.md`, `interaction-motion.md`, `layout-responsive.md`
- `accessibility.md`, `component-architecture.md`, `forms-data.md`, `content-microcopy.md`

**Hooks** (`.claude/hooks/`) — 3 CJS quality gates:
- `frontend-quality-gate.cjs` — PostToolUse: warns on a11y/performance violations in frontend files
- `frontend-team-idle-gate.cjs` — TeammateIdle: blocks idle while tasks remain
- `frontend-team-task-gate.cjs` — TaskCompleted: blocks audit without findings, blocks fix with lint/type errors

**Command** (`.claude/commands/frontend.md`) — Slash command router for all modes (allowed-tools: Task, Read, Glob).

**Project reports** (`.claude/project/reports/`):
- `directives.md` — Behavioral rules and structure patterns for SI cycles
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
      state.md
      reports/directives.md
    settings.json
  .frontend-specs/               (gitignored — runtime output)
  .gitignore
  CLAUDE.md
  README.md
  LICENSE
</structure>

<design>
- Routing: `/frontend` command parses arguments → dispatches to agents by mode
- Staleness: taste.md checked for 30-day freshness before spec/implement/review
- Review-fix: agent team (auditor + fixer) with closed-loop validation, gated by hooks
- Hooks: CJS, fail open on errors, use word-boundary regex for task matching, walk up to project root for path resolution
- Skills: domain checklists with scope/principles/patterns/checklist sections, symmetric scope exclusions
- All paths project-relative (`.claude/`), never global (`~/.claude/`)
- Agent teams enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json
</design>

## What's next

1. **Real-world validation** — Drop the system into an actual frontend project and run `/frontend` end-to-end.
2. **Taste data** — `taste.md` is empty. Run `/frontend refresh` to populate observations.
3. **Colour & typography integration** — Adjacent `ui/colors/` and `typography/` work could inform skill checklists.

</state>
