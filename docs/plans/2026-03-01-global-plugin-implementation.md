# Frontend Global Plugin Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the frontend repo into an installable global Claude Code plugin with copy-based install/uninstall scripts.

**Architecture:** Move distributable files from `.claude/` subdirectories to top-level directories (`skills/`, `agents/`, `commands/`, `hooks/`). Create `install.sh` (copies files to `~/.claude/`, merges settings.json, cleans stale symlinks) and `uninstall.sh` (removes frontend files from `~/.claude/`, strips hook entries). Keep `.claude/settings.json` for project-level config only.

**Tech Stack:** Shell (bash), Node.js (for JSON merge in settings.json)

---

### Task 1: Move skills to top-level

**Files:**
- Move: `.claude/skills/frontend/` → `skills/frontend/`
- Delete: `.claude/skills/` (entire directory after move)

**Step 1: Create top-level skills directory and move files**

```bash
mkdir -p skills/frontend
mv .claude/skills/frontend/design.md skills/frontend/
mv .claude/skills/frontend/experience.md skills/frontend/
mv .claude/skills/frontend/build.md skills/frontend/
mv .claude/skills/frontend/taste.md skills/frontend/
rmdir .claude/skills/frontend .claude/skills
```

**Step 2: Verify files moved correctly**

Run: `ls skills/frontend/`
Expected: `build.md  design.md  experience.md  taste.md`

Run: `ls .claude/skills/ 2>/dev/null`
Expected: No such file or directory

**Step 3: Commit**

```bash
git add -A skills/ .claude/skills/
git commit -m "refactor: move skills to top-level for plugin distribution"
```

---

### Task 2: Move agents to top-level

**Files:**
- Move: `.claude/agents/frontend-{designer,builder,reviewer}.md` → `agents/`
- Delete: `.claude/agents/` (directory after move)

**Step 1: Create top-level agents directory and move files**

```bash
mkdir -p agents
mv .claude/agents/frontend-designer.md agents/
mv .claude/agents/frontend-builder.md agents/
mv .claude/agents/frontend-reviewer.md agents/
rmdir .claude/agents
```

**Step 2: Verify**

Run: `ls agents/`
Expected: `frontend-builder.md  frontend-designer.md  frontend-reviewer.md`

**Step 3: Commit**

```bash
git add -A agents/ .claude/agents/
git commit -m "refactor: move agents to top-level for plugin distribution"
```

---

### Task 3: Move command to top-level

**Files:**
- Move: `.claude/commands/frontend.md` → `commands/`
- Delete: `.claude/commands/` (directory after move)

**Step 1: Move the command file**

```bash
mkdir -p commands
mv .claude/commands/frontend.md commands/
rmdir .claude/commands
```

**Step 2: Verify**

Run: `ls commands/`
Expected: `frontend.md`

**Step 3: Commit**

```bash
git add -A commands/ .claude/commands/
git commit -m "refactor: move command to top-level for plugin distribution"
```

---

### Task 4: Move hooks to top-level

**Files:**
- Move: `.claude/hooks/frontend-quality-gate.cjs` → `hooks/`
- Delete: `.claude/hooks/` (directory after move)

**Step 1: Move the hook file**

```bash
mkdir -p hooks
mv .claude/hooks/frontend-quality-gate.cjs hooks/
rmdir .claude/hooks
```

**Step 2: Verify**

Run: `ls hooks/`
Expected: `frontend-quality-gate.cjs`

**Step 3: Commit**

```bash
git add -A hooks/ .claude/hooks/
git commit -m "refactor: move hooks to top-level for plugin distribution"
```

---

### Task 5: Clean up .claude directory

The `.claude/` directory should only retain `settings.json` (project-level). Remove state files and `.DS_Store`.

**Files:**
- Keep: `.claude/settings.json`
- Delete: `.claude/state.json`, `.claude/state.backup.json`, `.claude/.DS_Store`
- Update: `.gitignore` — add `.claude/state*.json`

**Step 1: Remove state files and .DS_Store**

```bash
rm -f .claude/state.json .claude/state.backup.json .claude/.DS_Store
```

**Step 2: Update .gitignore**

Add these lines to `.gitignore`:

```
.claude/state*.json
.claude/.DS_Store
```

**Step 3: Update .claude/settings.json**

The project-level `settings.json` should only set env vars now. The hook reference to `.claude/hooks/` no longer exists locally — the global install handles it. Update to:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**Step 4: Verify**

Run: `ls -la .claude/`
Expected: only `settings.json` (and `.` / `..`)

**Step 5: Commit**

```bash
git add -A .claude/ .gitignore
git commit -m "chore: clean up .claude directory, keep only project settings"
```

---

### Task 6: Create install.sh

**Files:**
- Create: `install.sh`

**Step 1: Write install.sh**

The script must:
1. Determine its own directory (`SCRIPT_DIR`) so it works from any location
2. Create target directories in `~/.claude/` if they don't exist
3. Copy skills, agents, commands, hooks
4. Remove stale symlinks (old agent names that no longer exist)
5. Merge hook entries into `~/.claude/settings.json` using inline Node.js
6. Print a summary

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "Installing Frontend Design System..."
echo ""

# --- Copy files ---

mkdir -p "$CLAUDE_DIR/skills/frontend"
cp "$SCRIPT_DIR/skills/frontend/"*.md "$CLAUDE_DIR/skills/frontend/"
echo "  skills/frontend/ → ~/.claude/skills/frontend/"

mkdir -p "$CLAUDE_DIR/agents"
cp "$SCRIPT_DIR/agents/"frontend-*.md "$CLAUDE_DIR/agents/"
echo "  agents/frontend-*.md → ~/.claude/agents/"

mkdir -p "$CLAUDE_DIR/commands"
cp "$SCRIPT_DIR/commands/frontend.md" "$CLAUDE_DIR/commands/"
echo "  commands/frontend.md → ~/.claude/commands/"

mkdir -p "$CLAUDE_DIR/hooks"
cp "$SCRIPT_DIR/hooks/"frontend-*.cjs "$CLAUDE_DIR/hooks/"
echo "  hooks/frontend-*.cjs → ~/.claude/hooks/"

# --- Remove stale symlinks from previous installs ---

stale_agents=(
  "frontend-auditor.md"
  "frontend-implementer.md"
  "frontend-refresh.md"
  "frontend-scanner.md"
  "frontend-specifier.md"
)

for f in "${stale_agents[@]}"; do
  target="$CLAUDE_DIR/agents/$f"
  if [ -L "$target" ] || [ -f "$target" ]; then
    rm -f "$target"
    echo "  removed stale: agents/$f"
  fi
done

# Remove stale skill symlink (was a directory symlink in previous install)
if [ -L "$CLAUDE_DIR/skills/frontend" ]; then
  rm -f "$CLAUDE_DIR/skills/frontend"
  mkdir -p "$CLAUDE_DIR/skills/frontend"
  cp "$SCRIPT_DIR/skills/frontend/"*.md "$CLAUDE_DIR/skills/frontend/"
  echo "  replaced stale symlink: skills/frontend/"
fi

# Remove stale command symlink
if [ -L "$CLAUDE_DIR/commands/frontend.md" ]; then
  rm -f "$CLAUDE_DIR/commands/frontend.md"
  cp "$SCRIPT_DIR/commands/frontend.md" "$CLAUDE_DIR/commands/"
  echo "  replaced stale symlink: commands/frontend.md"
fi

# Remove stale hook symlinks
for f in "$CLAUDE_DIR/hooks/"frontend-*.cjs; do
  if [ -L "$f" ]; then
    rm -f "$f"
    echo "  replaced stale symlink: hooks/$(basename "$f")"
  fi
done

# --- Merge hook entries into settings.json ---

SETTINGS="$CLAUDE_DIR/settings.json"

if [ ! -f "$SETTINGS" ]; then
  echo '{}' > "$SETTINGS"
fi

node -e '
const fs = require("fs");
const settingsPath = process.argv[1];

const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));

if (!settings.hooks) settings.hooks = {};

// Define the frontend hook entries
const frontendHooks = {
  PostToolUse: {
    matcher: "Write|Edit",
    hooks: [{ type: "command", command: "node ~/.claude/hooks/frontend-quality-gate.cjs" }]
  }
};

// For each hook type, check if our entry already exists
for (const [eventType, entry] of Object.entries(frontendHooks)) {
  if (!settings.hooks[eventType]) settings.hooks[eventType] = [];

  const arr = settings.hooks[eventType];
  const alreadyExists = arr.some(existing =>
    existing.hooks?.some(h => h.command?.includes("frontend-quality-gate"))
  );

  if (!alreadyExists) {
    arr.push(entry);
    console.log("  added hook: " + eventType + " → frontend-quality-gate.cjs");
  } else {
    console.log("  hook already registered: " + eventType + " → frontend-quality-gate.cjs");
  }
}

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
' "$SETTINGS"

echo ""
echo "Frontend Design System installed."
echo "Use /frontend in any project to get started."
```

**Step 2: Make executable**

```bash
chmod +x install.sh
```

**Step 3: Run and verify**

Run: `./install.sh`
Expected: summary of copied files, stale cleanups, hook merges

Verify:
```bash
ls ~/.claude/skills/frontend/
ls ~/.claude/agents/frontend-*.md
ls ~/.claude/commands/frontend.md
ls ~/.claude/hooks/frontend-quality-gate.cjs
```

All should be real files (not symlinks).

**Step 4: Verify idempotency**

Run: `./install.sh`
Expected: same output, "hook already registered" for the merge step, no errors

**Step 5: Commit**

```bash
git add install.sh
git commit -m "feat: add install.sh for global plugin installation"
```

---

### Task 7: Create uninstall.sh

**Files:**
- Create: `uninstall.sh`

**Step 1: Write uninstall.sh**

```bash
#!/usr/bin/env bash
set -euo pipefail

CLAUDE_DIR="$HOME/.claude"

echo "Uninstalling Frontend Design System..."
echo ""

# --- Remove files ---

if [ -d "$CLAUDE_DIR/skills/frontend" ]; then
  rm -rf "$CLAUDE_DIR/skills/frontend"
  echo "  removed: skills/frontend/"
fi

for f in frontend-designer.md frontend-builder.md frontend-reviewer.md; do
  if [ -f "$CLAUDE_DIR/agents/$f" ] || [ -L "$CLAUDE_DIR/agents/$f" ]; then
    rm -f "$CLAUDE_DIR/agents/$f"
    echo "  removed: agents/$f"
  fi
done

if [ -f "$CLAUDE_DIR/commands/frontend.md" ] || [ -L "$CLAUDE_DIR/commands/frontend.md" ]; then
  rm -f "$CLAUDE_DIR/commands/frontend.md"
  echo "  removed: commands/frontend.md"
fi

for f in "$CLAUDE_DIR/hooks/"frontend-*.cjs; do
  if [ -f "$f" ] || [ -L "$f" ]; then
    rm -f "$f"
    echo "  removed: hooks/$(basename "$f")"
  fi
done

# --- Remove hook entries from settings.json ---

SETTINGS="$CLAUDE_DIR/settings.json"

if [ -f "$SETTINGS" ]; then
  node -e '
const fs = require("fs");
const settingsPath = process.argv[1];

const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));

if (settings.hooks) {
  for (const eventType of Object.keys(settings.hooks)) {
    const before = settings.hooks[eventType].length;
    settings.hooks[eventType] = settings.hooks[eventType].filter(entry =>
      !entry.hooks?.some(h => h.command?.includes("frontend-"))
    );
    const removed = before - settings.hooks[eventType].length;
    if (removed > 0) {
      console.log("  removed " + removed + " hook(s) from " + eventType);
    }
    // Clean up empty arrays
    if (settings.hooks[eventType].length === 0) {
      delete settings.hooks[eventType];
    }
  }
  // Clean up empty hooks object
  if (Object.keys(settings.hooks).length === 0) {
    delete settings.hooks;
  }
}

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
' "$SETTINGS"
fi

echo ""
echo "Frontend Design System uninstalled."
echo "Per-project .frontend-specs/ directories were left untouched."
```

**Step 2: Make executable**

```bash
chmod +x uninstall.sh
```

**Step 3: Commit**

```bash
git add uninstall.sh
git commit -m "feat: add uninstall.sh for global plugin removal"
```

---

### Task 8: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Rewrite the Installation section**

Replace the current Installation section (lines 56-98) with:

```markdown
## Installation

```bash
git clone https://github.com/YOUR_USER/frontend.git
cd frontend
./install.sh
```

This copies skills, agents, commands, and hooks into `~/.claude/`. The install is idempotent — run it again after `git pull` to update.

To remove:

```bash
./uninstall.sh
```

Per-project `.frontend-specs/` directories are left untouched.
```

Also update the Architecture section paths — replace `.claude/agents/`, `.claude/skills/frontend/`, `.claude/hooks/` with `agents/`, `skills/frontend/`, `hooks/` to reflect the new top-level layout.

**Step 2: Verify the README reads correctly**

Skim the full file for any remaining references to `.claude/agents/`, `.claude/skills/`, `.claude/hooks/`, or `.claude/commands/` in the context of *this repo's* file layout. Update them to the new top-level paths. Keep `.claude/` references that describe *installed* paths (e.g., "files are installed to `~/.claude/`") or *per-project* paths (e.g., `.claude/frontend-gaterc.json`).

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README for global plugin installation"
```

---

### Task 9: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update the Paths section**

Replace the current paths block to reflect the new repo structure:

```markdown
## Paths

```
skills/frontend/*.md                  — design.md, experience.md, build.md, taste.md
agents/frontend-{designer,builder,reviewer}.md
commands/frontend.md
hooks/frontend-quality-gate.cjs
install.sh / uninstall.sh             — global plugin management
.claude/settings.json                 — project-level env + hooks
.claude/frontend-gaterc.json          — optional quality gate config
.frontend-specs/                      — gitignored per-project output directory
.frontend-specs/design-tokens.json    — per-project visual identity source of truth
.frontend-specs/brand-preview.html    — browser-viewable brand board
.frontend-specs/refs/                 — reference captures from /frontend ref
.frontend-specs/codebase-profile.md   — scanner output
```
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md paths for top-level plugin layout"
```

---

### Task 10: Test the full install/uninstall cycle

**Step 1: Uninstall current (stale) global install**

```bash
./uninstall.sh
```

Verify stale symlinks and files are gone:
```bash
ls ~/.claude/skills/frontend/ 2>/dev/null && echo "FAIL: skills still exist" || echo "OK: skills removed"
ls ~/.claude/agents/frontend-*.md 2>/dev/null && echo "FAIL: agents still exist" || echo "OK: agents removed"
ls ~/.claude/commands/frontend.md 2>/dev/null && echo "FAIL: command still exists" || echo "OK: command removed"
ls ~/.claude/hooks/frontend-*.cjs 2>/dev/null && echo "FAIL: hooks still exist" || echo "OK: hooks removed"
```

Expected: all "OK"

**Step 2: Fresh install**

```bash
./install.sh
```

Verify:
```bash
file ~/.claude/skills/frontend/design.md  # should say "regular file", not "symbolic link"
file ~/.claude/agents/frontend-designer.md  # same
ls ~/.claude/skills/frontend/
ls ~/.claude/agents/frontend-{designer,builder,reviewer}.md
ls ~/.claude/commands/frontend.md
ls ~/.claude/hooks/frontend-quality-gate.cjs
```

Expected: all real files, all present

**Step 3: Verify settings.json hook entry**

```bash
node -e "const s = require('$HOME/.claude/settings.json'); console.log(JSON.stringify(s.hooks.PostToolUse.filter(h => h.hooks?.some(x => x.command?.includes('frontend'))), null, 2))"
```

Expected: one entry with `"node ~/.claude/hooks/frontend-quality-gate.cjs"`

**Step 4: Verify old stale agent symlinks are gone**

```bash
ls ~/.claude/agents/frontend-auditor.md 2>/dev/null && echo "FAIL" || echo "OK: no stale auditor"
ls ~/.claude/agents/frontend-implementer.md 2>/dev/null && echo "FAIL" || echo "OK: no stale implementer"
ls ~/.claude/agents/frontend-scanner.md 2>/dev/null && echo "FAIL" || echo "OK: no stale scanner"
```

Expected: all "OK"

**Step 5: Verify idempotent reinstall**

```bash
./install.sh
```

Expected: no errors, "hook already registered" message
