#!/usr/bin/env node

/**
 * TaskCompleted hook for frontend agent teams.
 * Blocks premature task completion:
 * - Audit/validate tasks must produce structured findings in .frontend-specs/
 * - Fix tasks must pass lint and type-check before completing
 *
 * Exit 0 = allow completion, Exit 2 = block completion
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

let input;
try {
  input = JSON.parse(fs.readFileSync("/dev/stdin", "utf8"));
} catch {
  process.exit(0);
}

const { task_subject = "", team_name = "", cwd = process.cwd() } = input;

// Only gate frontend teams
if (!team_name.includes("frontend")) {
  process.exit(0);
}

const subject = task_subject.toLowerCase();

// --- Audit / Validate tasks: require structured findings file ---
if (/\baudit\b/.test(subject) || /\bvalidate\b/.test(subject)) {
  const specsDir = path.join(cwd, ".frontend-specs");

  if (!fs.existsSync(specsDir)) {
    process.stderr.write(
      `BLOCKED: No .frontend-specs/ directory found. Audit/validate tasks must write findings before completing.\n`
    );
    process.exit(2);
  }

  // Look for any file with structured severity headings
  const files = fs.readdirSync(specsDir).filter((f) => f.endsWith(".md"));
  const hasStructuredFindings = files.some((f) => {
    try {
      const content = fs.readFileSync(path.join(specsDir, f), "utf8");
      return /^#{2,3} Critical/m.test(content) || /^#{2,3} Important/m.test(content);
    } catch {
      return false;
    }
  });

  if (!hasStructuredFindings) {
    process.stderr.write(
      `BLOCKED: No findings file with ## Critical / ## Important structure found in .frontend-specs/. Write audit findings before completing.\n`
    );
    process.exit(2);
  }

  process.exit(0);
}

// --- Fix tasks: require lint + type-check to pass ---
if (/\bfix\b/.test(subject)) {
  let pkgJson;
  try {
    pkgJson = JSON.parse(
      fs.readFileSync(path.join(cwd, "package.json"), "utf8")
    );
  } catch {
    // No package.json — can't enforce lint/types, allow completion
    process.exit(0);
  }

  const scripts = pkgJson.scripts || {};
  const errors = [];

  // Run lint if available
  if (scripts.lint) {
    try {
      execSync("npm run lint", { cwd, stdio: "pipe", timeout: 60000 });
    } catch (e) {
      errors.push(`Lint failed:\n${e.stderr?.toString() || e.message}`);
    }
  }

  // Run type-check if available
  const tscScript = ["type-check", "typecheck", "types"].find((k) => k in scripts);

  if (tscScript) {
    try {
      execSync(`npm run ${tscScript}`, {
        cwd,
        stdio: "pipe",
        timeout: 60000,
      });
    } catch (e) {
      const stderr = e.stderr?.toString() || "";
      const stdout = e.stdout?.toString() || "";
      errors.push(`Type-check failed:\n${stderr || stdout || e.message}`);
    }
  } else {
    // Fallback: try npx tsc --noEmit directly
    try {
      execSync("npx --no tsc --noEmit", { cwd, stdio: "pipe", timeout: 60000 });
    } catch (e) {
      // Only block if tsc is actually installed (exit code matters)
      const stderr = e.stderr?.toString() || "";
      const stdout = e.stdout?.toString() || "";
      if (!stderr.includes("not found") && !stderr.includes("ENOENT")) {
        errors.push(`Type-check failed:\n${stderr || stdout || e.message}`);
      }
    }
  }

  if (errors.length > 0) {
    process.stderr.write(
      `BLOCKED: Fix task cannot complete with errors:\n${errors.join("\n")}\n`
    );
    process.exit(2);
  }

  process.exit(0);
}

// All other task types — allow
process.exit(0);
