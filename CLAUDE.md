# Frontend Design System

See [README.md](README.md) for architecture, installation, and usage.

## Paths

```
.claude/agents/frontend-{specifier,implementer,auditor,refresh,scanner}.md
.claude/skills/frontend/*.md          — checklist-only (scope + checklist)
.claude/skills/frontend/*.deep.md     — deep versions (principles + patterns)
.claude/hooks/frontend-{quality-gate,team-idle-gate,team-task-gate}.cjs
.claude/commands/frontend.md
.claude/settings.json                 — env only; hooks registered in global ~/.claude/settings.json
.claude/frontend-gaterc.json          — optional quality gate config (per-check enable/severity)
.frontend-specs/          — gitignored output directory
.frontend-specs/refs/     — reference captures from /frontend ref
.frontend-specs/codebase-profile.md   — scanner output (stack, conventions, tooling)
```

## Editing skills

Skill files are split into two versions:
- **`{domain}.md`** — Scope + checklist only. Used by auditors and for quick spec tasks.
- **`{domain}.deep.md`** — Principles + patterns. Used by the specifier for full pages, redesigns, and design systems.
- **`taste.md`** is special — single file storing aesthetic observations refreshed from Pinterest/portfolio via Chrome DevTools.

## Editing hooks

Hooks read JSON from stdin and exit 0 (allow) or 2 (block). They fail open on errors.

Hook source files live in `.claude/hooks/` (project repo) but are **symlinked into `~/.claude/hooks/`** and **registered in the global `~/.claude/settings.json`**. This means they fire in any project, not just this repo. The project-level `settings.json` has no hook entries to avoid duplicate execution.

## Path convention

All paths in agents, commands, and hooks use `.claude/` (project-relative), not `~/.claude/` (global). Agent team task storage is the exception — it lives at `~/.claude/tasks/` (managed by Claude Code).

## Vision

Read `VISION.md` in the project root for the project's core intent.
