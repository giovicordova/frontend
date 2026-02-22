<state>
<updated>2026-02-22 14:28</updated>

## What exists

<codebase>
Claude Code skill system for frontend design — no application source code. The entire project is `.claude/` configuration that adds a `/frontend` command with spec, implement, review, review-fix, and refresh modes.

**Agents** (`.claude/agents/`) — 4 agent configs:
- `frontend-specifier.md` — Discovers intent, reads skills, produces implementation-ready specs
- `frontend-implementer.md` — Reads specs, detects stack, writes code
- `frontend-auditor.md` — Evaluates code against a single skill checklist (read-only, sonnet)
- `frontend-refresh.md` — Navigates Pinterest/portfolio via Chrome DevTools, captures taste observations

**Skills** (`.claude/skills/frontend/`) — 9 domain checklists:
- `taste.md` — Aesthetic observations (auto-refreshed every 30 days)
- `visual-design.md`, `ux-ia.md`, `interaction-motion.md`, `layout-responsive.md`
- `accessibility.md`, `component-architecture.md`, `forms-data.md`, `content-microcopy.md`

**Hooks** (`.claude/hooks/`) — 3 CJS quality gates:
- `frontend-quality-gate.cjs` — PostToolUse: warns on a11y/performance violations in frontend files
- `frontend-team-idle-gate.cjs` — TeammateIdle: blocks idle while tasks remain
- `frontend-team-task-gate.cjs` — TaskCompleted: blocks audit without findings, blocks fix with lint/type errors

**Command** (`.claude/commands/frontend.md`) — Slash command router for all modes.

**Config**: `settings.json`, `CLAUDE.md`, `README.md`, `LICENSE`, `.gitignore`
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
    settings.json
    project/
      reports/improvement-plan.md
      state.md
  .frontend-specs/          (gitignored — runtime output)
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
- Hooks: fail open on errors, use word-boundary regex for task matching, walk up to project root for path resolution
- Skills: domain checklists with scope/principles/checklist sections
- All paths project-relative (`.claude/`), never global (`~/.claude/`)
</design>

<git>
Branch: main (ahead of origin/main by 1 commit)
Status: 9 modified files + 1 untracked (LICENSE) — pending commit for si:apply improvements

Recent commits:
- 4d978ad fix(hooks): resolve 7 bugs in frontend hook system
- 69ce8fe feat: initial release — Claude Code skill system for frontend design
</git>

## What's next

Add `.claude/project/vision.md` to enable gap analysis.

</state>
