#!/usr/bin/env bash
set -euo pipefail

# ── Resolve repo root (works from any directory) ──────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$HOME/.claude"

# ── 1. Remove stale symlinks (BEFORE mkdir / copy) ───────────────────
stale_removed=()

# Old agent symlinks
for old in frontend-auditor.md frontend-implementer.md frontend-refresh.md \
           frontend-scanner.md frontend-specifier.md; do
  if [ -L "$TARGET/agents/$old" ]; then
    rm "$TARGET/agents/$old"
    stale_removed+=("agents/$old")
  fi
done

# skills/frontend directory symlink
if [ -L "$TARGET/skills/frontend" ]; then
  rm "$TARGET/skills/frontend"
  stale_removed+=("skills/frontend (dir symlink)")
fi

# commands/frontend.md symlink
if [ -L "$TARGET/commands/frontend.md" ]; then
  rm "$TARGET/commands/frontend.md"
  stale_removed+=("commands/frontend.md")
fi

# Any frontend-*.cjs hook symlinks
for f in "$TARGET/hooks"/frontend-*.cjs; do
  [ -e "$f" ] || [ -L "$f" ] || continue
  if [ -L "$f" ]; then
    name="$(basename "$f")"
    rm "$f"
    stale_removed+=("hooks/$name")
  fi
done

# ── 2. Create target directories ─────────────────────────────────────
mkdir -p "$TARGET/skills/frontend"
mkdir -p "$TARGET/agents"
mkdir -p "$TARGET/commands"
mkdir -p "$TARGET/hooks"

# ── 3. Copy files ────────────────────────────────────────────────────
copied=()

for f in "$SCRIPT_DIR"/skills/frontend/*.md; do
  cp "$f" "$TARGET/skills/frontend/"
  copied+=("skills/frontend/$(basename "$f")")
done

for f in "$SCRIPT_DIR"/agents/frontend-*.md; do
  cp "$f" "$TARGET/agents/"
  copied+=("agents/$(basename "$f")")
done

cp "$SCRIPT_DIR/commands/frontend.md" "$TARGET/commands/"
copied+=("commands/frontend.md")

for f in "$SCRIPT_DIR"/hooks/frontend-*.cjs; do
  cp "$f" "$TARGET/hooks/"
  copied+=("hooks/$(basename "$f")")
done

# ── 4. Merge hook into settings.json (idempotent) ────────────────────
SETTINGS="$TARGET/settings.json"
[ -f "$SETTINGS" ] || echo '{}' > "$SETTINGS"

hook_status="already present"
if ! node -e '
  const fs = require("fs");
  const s = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const hooks = (s.hooks && s.hooks.PostToolUse) || [];
  const exists = hooks.some(e =>
    e.hooks && e.hooks.some(h => h.command && h.command.includes("frontend-quality-gate"))
  );
  process.exit(exists ? 0 : 1);
' "$SETTINGS"; then
  node -e '
    const fs = require("fs");
    const p = process.argv[1];
    const s = JSON.parse(fs.readFileSync(p, "utf8"));
    if (!s.hooks) s.hooks = {};
    if (!s.hooks.PostToolUse) s.hooks.PostToolUse = [];
    s.hooks.PostToolUse.push({
      matcher: "Write|Edit",
      hooks: [{ type: "command", command: "node ~/.claude/hooks/frontend-quality-gate.cjs" }]
    });
    fs.writeFileSync(p, JSON.stringify(s, null, 2) + "\n");
  ' "$SETTINGS"
  hook_status="added"
fi

# ── 5. Summary ───────────────────────────────────────────────────────
echo ""
echo "Frontend plugin installed to $TARGET"
echo ""

if [ ${#stale_removed[@]} -gt 0 ]; then
  echo "Removed stale symlinks:"
  for s in "${stale_removed[@]}"; do echo "  - $s"; done
  echo ""
fi

echo "Copied files:"
for c in "${copied[@]}"; do echo "  + $c"; done
echo ""
echo "PostToolUse hook: $hook_status"
echo ""
