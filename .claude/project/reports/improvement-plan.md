# Improvement Plan

## Pending

(none)

## Applied

### 3. No LICENSE file for public repository
Added public domain dedication with creator attribution (Giovanni Cordova with Claude Code).
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

### 14. Review-fix mode missing path argument handling
Added "Step 1: Determine target" to review-fix mode with path parsing and "ask what to review" fallback. Renumbered subsequent steps.

### 15. Content-microcopy missing from single-component review classification
Added `content-microcopy` to "Single UI component" row in skill classification table.

### 16. Interaction-motion missing from page-level review classification
Added `interaction-motion` to "Page/route with multiple sections" row in skill classification table.

### 1. Auditor h3 headings never match task-gate h2 regex — review-fix loop broken
Changed hook regex to `/^#{2,3} Critical/m` and `/^#{2,3} Important/m` in `frontend-team-task-gate.cjs`.

### 2. CJS hooks break in ESM host projects
Renamed all 3 hooks from `.js` to `.cjs` and updated `settings.json` paths.

### 4. Quality gate missing try/catch on stdin parsing
Wrapped stdin parsing in `frontend-quality-gate.cjs` with try/catch, exit 0 on failure.

### 6. hasTsc logic fails on empty-string script values
Replaced truthy check with `["type-check", "typecheck", "types"].find(k => k in scripts)`.

### 7. npx tsc fallback can silently install TypeScript
Changed `npx tsc` to `npx --no tsc` to prevent silent installation.

### 8. tsc errors written to stdout are missed by stderr-only check
Both catch blocks now check `e.stdout` in addition to `e.stderr`.

### 9. subject.includes("fix") matches "prefix", "suffix", "fixture"
Replaced `includes()` with word-boundary regex for `fix`, `audit`, and `validate`.

### 5. Quality gate Edit operations only check new_string, not full file
Replaced tool-input content extraction with `fs.readFileSync(filePath)` — PostToolUse runs after the tool, so disk reflects the completed write/edit. Catches multi-line patterns across the full file.

### 10. Img dimension Tailwind detection is dead code
Split into attribute check (`/\bwidth\s*[=:{]/`) and Tailwind class check (`/\bw-[\d[]/`). Correctly matches `w-64` and `w-[200px]` while excluding `w-full`/`w-auto`.

### 11. Quality gate should check aria-hidden on focusable containers
Added `aria-hidden="true"` detection matching both HTML (`"true"`) and JSX (`{true}`) syntax. Educational warning about focusable children.

### 12. Quality gate should detect framework image components
Extended `imgTagRegex` to `/<(?:img|Image)\b[^>]*>/gi`. Both alt and CLS checks now cover `<Image>` components. Warning messages dynamically extract the actual tag name.

### 13. Quality gate missing .html and .astro extensions
Added `.html`, `.astro`, `.mdx` to the `frontendExtensions` array.

### 20. Extension extraction should use path.extname()
Added `path` require, replaced manual `substring(lastIndexOf("."))` with `path.extname(filePath)`.

## Rejected
