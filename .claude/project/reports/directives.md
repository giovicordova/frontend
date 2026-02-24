# Directives

Rules and patterns for SI observation cycles and ongoing maintenance.

## Behavioral Rules

### 1. Grep after renames
After applying improvements that rename or move files/strings, grep for the old name across the project to confirm no stale references remain.

### 2. Regenerate system-observations.md after applying fixes
Regenerate from current codebase state after each apply phase. Remove resolved items.

### 3. Status date annotations on all applied items
All applied items in improvement-plan.md must include `**Status:** applied (YYYY-MM-DD)`.

## Structure Patterns

- **Naming:** All agents, hooks, skills, and commands use `frontend-` prefix. Hooks use `-gate.cjs` suffix. Skills use domain names.
- **Self-contained:** All paths project-relative via `.claude/`, exception: team tasks at `~/.claude/tasks/`.
- **No runtime dependencies:** Hooks use only Node.js stdlib (fs, path, child_process, os).
- **Output isolation:** Generated artifacts go to `.frontend-specs/` (gitignored). Clean separation between source (`.claude/`) and output.
