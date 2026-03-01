# Frontend Design System

See [README.md](README.md) for architecture, installation, and usage.

## Paths

```
.claude/agents/frontend-{designer,builder,reviewer}.md
.claude/skills/frontend/*.md          — design.md, experience.md, build.md, taste.md
.claude/hooks/frontend-quality-gate.cjs
.claude/commands/frontend.md
.claude/settings.json                 — env + hooks
.claude/frontend-gaterc.json          — optional quality gate config
.frontend-specs/                      — gitignored output directory
.frontend-specs/design-tokens.json    — per-project visual identity source of truth
.frontend-specs/brand-preview.html    — browser-viewable brand board
.frontend-specs/refs/                 — reference captures from /frontend ref
.frontend-specs/codebase-profile.md   — scanner output
```

## Editing skills

Skill files have two sections in a single file:
- **Checklist section** (above `--- deep ---`) — Used by reviewers and for quick tasks.
- **Deep section** (below `--- deep ---`) — Principles + patterns. Used by the designer for full pages, redesigns, and design systems.
- **`taste.md`** is special — single file storing aesthetic observations refreshed from Pinterest/portfolio via Chrome DevTools.

## Editing hooks

Hooks read JSON from stdin and exit 0 (allow) or 2 (block). They fail open on errors.

The quality gate hook includes token compliance checks — when `.frontend-specs/design-tokens.json` exists, it flags hardcoded colors, fonts, and radii that don't reference tokens.

## Path convention

All agents and commands try `.claude/` (project-relative) first, then fall back to `~/.claude/` (global).

## Vision

Read `VISION.md` in the project root for the project's core intent.
