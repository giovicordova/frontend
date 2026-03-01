# Frontend Global Plugin Design

## Goal

Make the frontend design system installable as a global Claude Code plugin — works in every project without needing this repo checked out.

## Current State

- All files live in `.claude/` inside this repo
- Stale symlinks in `~/.claude/` point to old agent names that no longer exist
- Hook entries in `~/.claude/settings.json` reference symlinked files
- Per-project outputs (`.frontend-specs/`) are gitignored and generated per-project

## Design

### Repo Structure (after reorganization)

```
frontend/
├── install.sh
├── uninstall.sh
├── README.md
├── CLAUDE.md
├── VISION.md
├── skills/
│   └── frontend/
│       ├── design.md
│       ├── experience.md
│       ├── build.md
│       └── taste.md
├── agents/
│   ├── frontend-designer.md
│   ├── frontend-builder.md
│   └── frontend-reviewer.md
├── commands/
│   └── frontend.md
└── hooks/
    ├── frontend-quality-gate.cjs
    ├── frontend-team-idle-gate.cjs
    └── frontend-team-task-gate.cjs
```

Files move from `.claude/` subdirectories to top-level directories. The `.claude/` directory retains only `settings.json` (project-level) and `frontend-gaterc.json` (optional config).

### install.sh

1. Copy `skills/frontend/` → `~/.claude/skills/frontend/`
2. Copy `agents/*.md` → `~/.claude/agents/`
3. Copy `commands/frontend.md` → `~/.claude/commands/frontend.md`
4. Copy `hooks/frontend-*.cjs` → `~/.claude/hooks/`
5. Merge hook entries into `~/.claude/settings.json` (idempotent — skip if already present)
6. Remove stale symlinks (old names: frontend-auditor, frontend-implementer, frontend-refresh, frontend-scanner, frontend-specifier)
7. Print summary of what was installed/updated

### uninstall.sh

1. Remove `~/.claude/skills/frontend/`
2. Remove `~/.claude/agents/frontend-{designer,builder,reviewer}.md`
3. Remove `~/.claude/commands/frontend.md`
4. Remove `~/.claude/hooks/frontend-*.cjs`
5. Remove frontend hook entries from `~/.claude/settings.json`
6. Leave per-project `.frontend-specs/` untouched

### settings.json merge

The install script reads `~/.claude/settings.json`, adds these hook entries if not present:

- PostToolUse `Write|Edit` → `node ~/.claude/hooks/frontend-quality-gate.cjs`
- TeammateIdle → `node ~/.claude/hooks/frontend-team-idle-gate.cjs`
- TaskCompleted → `node ~/.claude/hooks/frontend-team-task-gate.cjs`

Uses Node.js for JSON manipulation (already available on the system).

### Per-Project Outputs (unchanged)

- `.frontend-specs/design-tokens.json` — visual identity per project
- `.frontend-specs/brand-preview.html` — brand board
- `.frontend-specs/codebase-profile.md` — scanner output
- `.frontend-specs/refs/` — reference captures
- `.claude/frontend-gaterc.json` — optional quality gate config

These are created by the plugin when working in a project. The global install only provides the skills/agents/commands/hooks.

### Path Resolution

Claude Code resolves skills, agents, and commands by name. Files in `~/.claude/` are found automatically. Project-level `.claude/` files take precedence — a project can override any global file by providing its own version.

The quality gate hook uses `__dirname` for relative paths, so it works from any install location.

## Decisions

- **Copy-based, not symlinks** — robust, no dependency on repo location
- **Auto-merge settings.json** — idempotent, safe to run multiple times
- **Top-level repo structure** — makes it clear this is a distributable plugin, not a Claude Code project
- **Per-project outputs stay per-project** — the plugin generates them, doesn't ship defaults
