#!/usr/bin/env node

/**
 * TeammateIdle hook for frontend agent teams.
 * Prevents teammates from stopping while work remains:
 * - Blocks if teammate has in-progress tasks assigned to them
 * - Blocks if unclaimed unblocked pending tasks exist
 *
 * Reads task state from ~/.claude/tasks/{team_name}/.
 * Fails open (exit 0) on any IO error since storage format is undocumented.
 *
 * Exit 0 = allow idle, Exit 2 = block idle (keep working)
 */

const fs = require("fs");
const path = require("path");

let input;
try {
  input = JSON.parse(fs.readFileSync("/dev/stdin", "utf8"));
} catch {
  process.exit(0);
}

const { team_name = "", teammate_name = "" } = input;

// Only gate frontend review-fix teams
if (!team_name.startsWith("frontend-review-fix")) {
  process.exit(0);
}

// Try to read task state — fail open on any error
try {
  const tasksDir = path.join(
    process.env.HOME || "~",
    ".claude",
    "tasks",
    team_name
  );

  if (!fs.existsSync(tasksDir)) {
    // No task directory — can't determine state, allow idle
    process.exit(0);
  }

  const taskFiles = fs
    .readdirSync(tasksDir)
    .filter((f) => f.endsWith(".json"));
  const tasks = taskFiles
    .map((f) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(tasksDir, f), "utf8")
        );
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  // Check 1: Does this teammate have in-progress tasks?
  const ownInProgress = tasks.filter(
    (t) =>
      t.status === "in_progress" &&
      t.owner &&
      t.owner.toLowerCase() === teammate_name.toLowerCase()
  );

  if (ownInProgress.length > 0) {
    const subjects = ownInProgress.map((t) => t.subject).join(", ");
    process.stderr.write(
      `BLOCKED: You have in-progress tasks: ${subjects}. Complete them before going idle.\n`
    );
    process.exit(2);
  }

  // Check 2: Are there unclaimed, unblocked, pending tasks?
  const completedIds = new Set(
    tasks.filter((t) => t.status === "completed").map((t) => t.id)
  );

  const unclaimed = tasks.filter((t) => {
    if (t.status !== "pending") return false;
    if (t.owner) return false; // Already claimed
    // Check if blocked by incomplete tasks
    const blockedBy = t.blockedBy || [];
    return blockedBy.every((id) => completedIds.has(id));
  });

  if (unclaimed.length > 0) {
    const subjects = unclaimed.map((t) => t.subject).join(", ");
    process.stderr.write(
      `BLOCKED: Unclaimed tasks available: ${subjects}. Pick one up before going idle.\n`
    );
    process.exit(2);
  }

  // No blockers — allow idle
  process.exit(0);
} catch {
  // Fail open on any unexpected error
  process.exit(0);
}
