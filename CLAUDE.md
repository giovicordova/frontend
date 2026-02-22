# Frontend Design System

See [README.md](README.md) for architecture, installation, and usage.

## Paths

```
.claude/agents/frontend-{specifier,implementer,auditor,refresh}.md
.claude/skills/frontend/*.md
.claude/hooks/frontend-{quality-gate,team-idle-gate,team-task-gate}.js
.claude/commands/frontend.md
.claude/settings.json
.frontend-specs/          — gitignored output directory
```

## Editing skills

Skill files are checklists with `<scope>`, `<principles>`, and `<checklist>` sections. `taste.md` is special — it stores aesthetic observations refreshed from Pinterest/portfolio via Chrome DevTools.

## Editing hooks

Hooks read JSON from stdin and exit 0 (allow) or 2 (block). They fail open on errors.

## Path convention

All paths in agents, commands, and hooks use `.claude/` (project-relative), not `~/.claude/` (global). Agent team task storage is the exception — it lives at `~/.claude/tasks/` (managed by Claude Code).
