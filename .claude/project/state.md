<vision>
This project is the design taste layer missing from AI-assisted frontend development. Drop it into any project and Claude writes code that looks and feels intentional — specs with real layout thinking, accessibility baked in, visual decisions grounded in curated references. Reviews catch what linters can't: bad hierarchy, clunky interactions, inaccessible patterns. Self-contained skill system, no dependencies, just `.claude/` config.
</vision>

<state>
<updated>2026-02-26</updated>

## What exists

<codebase>
Claude Code skill system for frontend design — no application source code. The `.claude/` directory is the product: a `/frontend` command with spec, ref, implement, review, review-fix, and refresh modes.

**Agents** (`.claude/agents/`) — 4 agent configs:
- `frontend-specifier.md` — Discovers intent from caller prompt, reads skills, produces specs (opus). Checks visual references first, then taste.md.
- `frontend-implementer.md` — Reads specs, detects stack, writes code (sonnet)
- `frontend-auditor.md` — Evaluates code against a single skill checklist, read-only (sonnet)
- `frontend-refresh.md` — Navigates Pinterest/portfolio via Chrome DevTools, captures taste observations (haiku)

**Skills** (`.claude/skills/frontend/`) — 9 domains, split into checklist + deep files:
- `taste.md` — Aesthetic observations (single file, no deep variant — needs first `/frontend refresh`)
- `{domain}.md` — Scope + checklist only (used by auditors, quick spec tasks)
- `{domain}.deep.md` — Principles + patterns (used by specifier for full pages/redesigns)
- Domains: visual-design, ux-ia, interaction-motion, layout-responsive, accessibility, component-architecture, forms-data, content-microcopy, performance
- `performance.md` / `performance.deep.md` — Core Web Vitals, SEO, Best Practices checklist mapped to Lighthouse audit IDs

**Hooks** (`.claude/hooks/`) — 3 CJS quality gates:
- `frontend-quality-gate.cjs` — PostToolUse: warns on a11y, performance, and SEO violations in frontend files
- `frontend-team-idle-gate.cjs` — TeammateIdle: blocks idle while tasks remain
- `frontend-team-task-gate.cjs` — TaskCompleted: blocks audit without findings, blocks fix with lint/type errors

**Command** (`.claude/commands/frontend.md`) — Slash command router for all modes (allowed-tools: Task, Read, Glob, AskUserQuestion).

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
      taste.md
      {visual-design,ux-ia,interaction-motion,layout-responsive,
       accessibility,component-architecture,forms-data,
       content-microcopy}.md          — checklist only
      {visual-design,ux-ia,interaction-motion,layout-responsive,
       accessibility,component-architecture,forms-data,
       content-microcopy}.deep.md     — principles + patterns
    project/
      state.md
      reports/directives.md
    settings.json
  .frontend-specs/               (gitignored — runtime output)
  .frontend-specs/refs/          (reference captures)
  .gitignore
  CLAUDE.md
  README.md
  LICENSE
</structure>

<design>
- Routing: `/frontend` command parses arguments → dispatches to agents by mode (spec, ref, implement, review, review-fix, refresh)
- Taste: if taste.md observations empty, suggest refresh but don't block; if populated, use silently
- Dialogue: spec mode asks up to 3 clarifying questions before dispatching to specifier
- References: `/frontend ref <url>` captures visual observations to `.frontend-specs/refs/`; specifier checks refs/ before starting
- Skill split: `{domain}.md` (scope + checklist) for audits and quick tasks; `{domain}.deep.md` (principles + patterns) for full pages and redesigns
- Review-fix: agent team (auditor + fixer) with closed-loop validation, gated by hooks
- Hooks: CJS, fail open on errors, use word-boundary regex for task matching, walk up to project root for path resolution
- All paths project-relative (`.claude/`), never global (`~/.claude/`)
- Agent teams enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json
- Lighthouse: `/frontend lighthouse` mode runs headless Lighthouse CLI against dev server, parses JSON output, feeds failures to implementer, re-validates once
</design>

## What's next

1. **Real-world validation** — Drop the system into an actual frontend project and run `/frontend` end-to-end.
2. **Taste data** — `taste.md` is empty. Run `/frontend refresh` to populate observations.
3. **Colour & typography integration** — Adjacent `ui/colors/` and `typography/` work could inform skill checklists.

</state>
