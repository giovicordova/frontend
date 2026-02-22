# Improvement Plan

## Pending

*(none)*

## Applied

### 1. Auditor h3 headings never match task-gate h2 regex — review-fix loop broken
Changed hook regex to `/^#{2,3} Critical/m` and `/^#{2,3} Important/m` in `frontend-team-task-gate.cjs`.
**Status:** applied (2026-02-22)

### 2. CJS hooks break in ESM host projects
Renamed all 3 hooks from `.js` to `.cjs` and updated `settings.json` paths.
**Status:** applied (2026-02-22)

### 3. No LICENSE file for public repository
Added public domain dedication with creator attribution (Giovanni Cordova with Claude Code).
**Status:** applied (2026-02-22)

### 4. Quality gate missing try/catch on stdin parsing
Wrapped stdin parsing in `frontend-quality-gate.cjs` with try/catch, exit 0 on failure.
**Status:** applied (2026-02-22)

### 5. Quality gate Edit operations only check new_string, not full file
Replaced tool-input content extraction with `fs.readFileSync(filePath)` — PostToolUse runs after the tool, so disk reflects the completed write/edit. Catches multi-line patterns across the full file.
**Status:** applied (2026-02-22)

### 6. hasTsc logic fails on empty-string script values
Replaced truthy check with `["type-check", "typecheck", "types"].find(k => k in scripts)`.
**Status:** applied (2026-02-22)

### 7. npx tsc fallback can silently install TypeScript
Changed `npx tsc` to `npx --no tsc` to prevent silent installation.
**Status:** applied (2026-02-22)

### 8. tsc errors written to stdout are missed by stderr-only check
Both catch blocks now check `e.stdout` in addition to `e.stderr`.
**Status:** applied (2026-02-22)

### 9. subject.includes("fix") matches "prefix", "suffix", "fixture"
Replaced `includes()` with word-boundary regex for `fix`, `audit`, and `validate`.
**Status:** applied (2026-02-22)

### 10. Img dimension Tailwind detection is dead code
Split into attribute check (`/\bwidth\s*[=:{]/`) and Tailwind class check (`/\bw-[\d[]/`). Correctly matches `w-64` and `w-[200px]` while excluding `w-full`/`w-auto`.
**Status:** applied (2026-02-22)

### 11. Quality gate should check aria-hidden on focusable containers
Added `aria-hidden="true"` detection matching both HTML (`"true"`) and JSX (`{true}`) syntax. Educational warning about focusable children.
**Status:** applied (2026-02-22)

### 12. Quality gate should detect framework image components
Extended `imgTagRegex` to `/<(?:img|Image)\b[^>]*>/gi`. Both alt and CLS checks now cover `<Image>` components. Warning messages dynamically extract the actual tag name.
**Status:** applied (2026-02-22)

### 13. Quality gate missing .html and .astro extensions
Added `.html`, `.astro`, `.mdx` to the `frontendExtensions` array.
**Status:** applied (2026-02-22)

### 14. Review-fix mode missing path argument handling
Added "Step 1: Determine target" to review-fix mode with path parsing and "ask what to review" fallback. Renumbered subsequent steps.
**Status:** applied (2026-02-22)

### 15. Content-microcopy missing from single-component review classification
Added `content-microcopy` to "Single UI component" row in skill classification table.
**Status:** applied (2026-02-22)

### 16. Interaction-motion missing from page-level review classification
Added `interaction-motion` to "Page/route with multiple sections" row in skill classification table.
**Status:** applied (2026-02-22)

### 17. Specifier content/copy tasks missing accessibility skill
Added `accessibility` to the content/copy task type row in `frontend-specifier.md`.
**Status:** applied (2026-02-22)

### 18. Name derivation undocumented for review/review-fix modes
Added name derivation rule to `spec_artifacts` section in `frontend.md`: basename without extension for files, directory name for directories, always kebab-case.
**Status:** applied (2026-02-22)

### 19. Task-gate uses cwd instead of project root for .frontend-specs/
Added `findProjectRoot()` helper to `frontend-team-task-gate.cjs` that walks up from cwd looking for `.claude/`. All path references (specs dir, package.json, lint/typecheck exec) now use project root.
**Status:** applied (2026-02-22)

### 20. Extension extraction should use path.extname()
Added `path` require, replaced manual `substring(lastIndexOf("."))` with `path.extname(filePath)`.
**Status:** applied (2026-02-22)

### 21. README missing Chrome DevTools MCP setup instructions
Added link to Chrome DevTools MCP GitHub repo in README prerequisites section.
**Status:** applied (2026-02-22)

### 22. .gitignore workspace exclusions may confuse contributors
Added comment explaining `typography/`, `ui/`, `research/` are workspace-only directories.
**Status:** applied (2026-02-22)

### 23. team_name.includes("frontend") is overly broad
Replaced `team_name.includes("frontend")` with `team_name.startsWith("frontend-review-fix")` in both `frontend-team-idle-gate.cjs` and `frontend-team-task-gate.cjs`.
**Status:** applied (2026-02-22)

### 24. Orphan .claude/project/ directory untracked and undocumented
Added `.claude/project/` to `.gitignore` to prevent accidental commit of generated SI artifacts.
**Status:** applied (2026-02-22)

### 25. Hook .js to .cjs extension not propagated to documentation
Updated `.js` to `.cjs` in CLAUDE.md, README.md, and frontend.md. Added quality-gate hook to frontend.md quick_reference.
**Status:** applied (2026-02-22)

### 26. Specifier agent missing `new_page` Chrome DevTools tool
Added `mcp__chrome-devtools__new_page` to specifier's tools list.
**Status:** applied (2026-02-22)

### 27. Review-fix validation task has no output file and gate checks stale findings
Added output file spec to task 3 (`{name}-validation.md`). Tightened task-gate to extract `{name}` from team_name and check for specific audit/validation files.
**Status:** applied (2026-02-22)

### 28. CLAUDE.md omits `<patterns>` from skill file section description
Updated CLAUDE.md to list `<scope>`, `<principles>`, `<patterns>`, and `<checklist>`.
**Status:** applied (2026-02-22)

### 29. Specifier skill table missing domains for "New page/feature" task type
Added `content-microcopy`, `interaction-motion`, and `forms-data (if forms detected)` to "New page/feature" row.
**Status:** applied (2026-02-22)

### 30. Review mode skill table missing domains for single component and forms
Added `interaction-motion` to "Single UI component" and `content-microcopy` to "Form or data entry".
**Status:** applied (2026-02-22)

### 31. Review-fix team brief doesn't reference auditor agent config
Added reference to `.claude/agents/frontend-auditor.md` in auditor teammate description.
**Status:** applied (2026-02-22)

### 32. Refresh agent has unnecessary Edit tool
Removed `Edit` from refresh agent's tools list.
**Status:** applied (2026-02-22)

### 33. HOME fallback to tilde literal in idle gate
Added `os.homedir()` via `require("os")`, replacing `process.env.HOME || "~"`.
**Status:** applied (2026-02-22)

### 34. Lint error reporting only captures stderr, misses stdout
Updated lint catch block to capture both stderr and stdout, matching the type-check pattern.
**Status:** applied (2026-02-22)

### 35. onClick accessibility check misses role attribute after onClick in JSX
Replaced partial-tag regex with full-tag matching — captures entire opening tag, then checks for both onClick and role.
**Status:** applied (2026-02-22)

### 36. Img alt check false-positives on JSX spread props
Added spread operator check (`{...`) to skip alt warning on images using spread props.
**Status:** applied (2026-02-22)

### 37. Idle gate accesses task subject without null guard
Added `t.subject || t.id || "unnamed task"` fallback on both subject-mapping lines.
**Status:** applied (2026-02-22)

### 38. aria-hidden check fires on decorative SVG icons (valid pattern)
Narrowed check to container elements only (div, section, main, aside, nav, article, header, footer). Decorative elements like SVG icons no longer trigger the warning.
**Status:** applied (2026-02-22)

### 39. taste.md last_updated set but taste block is empty — defeats staleness check
Cleared `last_updated` to empty so staleness check triggers on first use.
**Status:** applied (2026-02-22)

### 40. vision.md untracked and not gitignored — in limbo
Staged vision.md for git tracking via `git add`.
**Status:** applied (2026-02-22)

### 41. SI workflow lacks a verification step after applying improvements
Added verification directive to active-directives.md: grep for old names after renames to confirm no stale references.
**Status:** applied (2026-02-22)

### 42. No active-directives.md file exists
Created `.claude/project/reports/active-directives.md` with 3 initial directives from lessons learned.
**Status:** applied (2026-02-22)

### 43. system-observations.md contains stale observations already resolved
Regenerated system-observations.md from current codebase state with all resolved items removed.
**Status:** applied (2026-02-22)

### 44. improvement-plan.md applied section has inconsistent status annotations
Standardized all applied items with `**Status:** applied (YYYY-MM-DD)` format.
**Status:** applied (2026-02-22)

## Rejected
