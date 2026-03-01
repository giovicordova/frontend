#!/usr/bin/env bash
set -euo pipefail

TARGET="$HOME/.claude"
removed=()

# ── 1. Remove skills/frontend/ directory ───────────────────────────
if [ -d "$TARGET/skills/frontend" ]; then
  rm -rf "$TARGET/skills/frontend"
  removed+=("skills/frontend/")
fi

# ── 2. Remove agent files ─────────────────────────────────────────
for f in "$TARGET/agents"/frontend-*.md; do
  [ -e "$f" ] || continue
  name="$(basename "$f")"
  rm "$f"
  removed+=("agents/$name")
done

# ── 3. Remove command file ────────────────────────────────────────
if [ -f "$TARGET/commands/frontend.md" ]; then
  rm "$TARGET/commands/frontend.md"
  removed+=("commands/frontend.md")
fi

# ── 4. Remove hook files ─────────────────────────────────────────
for f in "$TARGET/hooks"/frontend-*.cjs; do
  [ -e "$f" ] || continue
  name="$(basename "$f")"
  rm "$f"
  removed+=("hooks/$name")
done

# ── 5. Remove frontend hook entries from settings.json ────────────
SETTINGS="$TARGET/settings.json"
if [ -f "$SETTINGS" ]; then
  settings_changed=$(node -e '
    const fs = require("fs");
    const p = process.argv[1];
    const s = JSON.parse(fs.readFileSync(p, "utf8"));
    if (!s.hooks || !s.hooks.PostToolUse) process.exit(0);
    const before = s.hooks.PostToolUse.length;
    s.hooks.PostToolUse = s.hooks.PostToolUse.filter(e =>
      !(e.hooks && e.hooks.some(h => h.command && h.command.includes("frontend-")))
    );
    const after = s.hooks.PostToolUse.length;
    if (before === after) process.exit(0);
    if (after === 0) delete s.hooks.PostToolUse;
    if (Object.keys(s.hooks).length === 0) delete s.hooks;
    fs.writeFileSync(p, JSON.stringify(s, null, 2) + "\n");
    process.stdout.write("yes");
  ' "$SETTINGS" 2>/dev/null || true)

  if [ "$settings_changed" = "yes" ]; then
    removed+=("settings.json hook entries")
  fi
fi

# ── 6. Summary ────────────────────────────────────────────────────
echo ""
if [ ${#removed[@]} -gt 0 ]; then
  echo "Frontend plugin uninstalled from $TARGET"
  echo ""
  echo "Removed:"
  for r in "${removed[@]}"; do echo "  - $r"; done
else
  echo "Nothing to remove — frontend plugin was not installed."
fi
echo ""
echo "Per-project .frontend-specs/ directories were left untouched."
echo ""
