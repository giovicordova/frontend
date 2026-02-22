# Improvement Plan

## Pending

### 3. No LICENSE file for public repository
**Category:** structure
**Evidence:** README instructs "Copy the `.claude/` directory into your project root" but no license grants permission to do so.
**Current:** All rights reserved by default. Contributors/users have no legal permission to use, modify, or distribute.
**Proposed:** Add MIT LICENSE file.
**Impact:** Resolves legal contradiction between installation docs and copyright.
**Status:** pending

### 5. Quality gate Edit operations only check new_string, not full file
**Category:** code
**Evidence:** `frontend-quality-gate.js:40` — checks `toolInput.new_string` only for Edit tool
**Current:** Split-attribute patterns (e.g., `<div>` on one line, `onClick` added in edit) produce false negatives/positives.
**Proposed:** Read the full file from disk after edit and check that instead.
**Impact:** Eliminates blind spots for multi-line JSX patterns in Edit operations.
**Status:** pending

### 10. Img dimension Tailwind detection is dead code
**Category:** code
**Evidence:** `frontend-quality-gate.js:99` — `\b(width|w-)\s*[=:{]` never matches Tailwind classes like `w-64`
**Current:** Tailwind width/height classes appear inside `className="..."`, not as tag attributes. The `w-`/`h-` branches never fire.
**Proposed:** Split into attribute check (`/\bwidth\s*[=:{]/`) and class check (`/\bw-\d/`).
**Impact:** Eliminates false-positive CLS warnings in Tailwind projects.
**Status:** pending

### 11. Quality gate should check aria-hidden on focusable containers
**Category:** code
**Evidence:** `frontend-quality-gate.js` — 5 checks total, none for `aria-hidden="true"` on interactive children
**Current:** A critical WCAG failure (interactive elements invisible to screen readers) goes uncaught.
**Proposed:** Add regex check for `aria-hidden="true"` containing button/a/input elements.
**Impact:** Catches a common, high-severity accessibility violation.
**Status:** pending

### 12. Quality gate should detect framework image components (Next.js Image, etc.)
**Category:** skill
**Evidence:** `frontend-quality-gate.js:60` — only checks `<img>`, not `<Image>`
**Current:** In Next.js/Astro projects, most images use framework components that bypass all quality checks.
**Proposed:** Add `<Image>` pattern to alt-attribute check.
**Impact:** Extends accessibility coverage to the actual image components used in modern frameworks.
**Status:** pending

### 13. Quality gate missing .html and .astro extensions
**Category:** skill
**Evidence:** `frontend-quality-gate.js:26-33` — only `.tsx`, `.jsx`, `.vue`, `.svelte`, `.css`, `.scss`
**Current:** HTML and Astro files bypass all quality gate checks.
**Proposed:** Add `.html`, `.astro`, `.mdx` to the extensions array.
**Impact:** Extends coverage to additional frontend file types.
**Status:** pending

### 14. Review-fix mode missing path argument handling
**Category:** skill
**Evidence:** `frontend.md` review mode (line 66) handles missing path; review-fix mode does not
**Current:** `/frontend review-fix` with no path proceeds with no target, causing downstream failures.
**Proposed:** Add "If no path given, ask what to review" to review-fix section.
**Impact:** Prevents broken review-fix runs from missing input.
**Status:** pending

### 15. Content-microcopy missing from single-component review classification
**Category:** skill
**Evidence:** `frontend.md:73` — "Single UI component" maps to visual-design, component-architecture, accessibility only
**Current:** Button labels, empty states, error messages in components are never audited.
**Proposed:** Add `content-microcopy` to the "Single UI component" row.
**Impact:** Catches microcopy issues during component reviews.
**Status:** pending

### 16. Interaction-motion missing from page-level review classification
**Category:** skill
**Evidence:** `frontend.md:72` — "Page/route with multiple sections" excludes interaction-motion
**Current:** Scroll animations, hover effects, page transitions on pages go unaudited.
**Proposed:** Add `interaction-motion` to the "Page/route" row.
**Impact:** Catches motion issues during page reviews.
**Status:** pending

### 17. Specifier content/copy tasks missing accessibility skill
**Category:** skill
**Evidence:** `frontend-specifier.md:68` — "Content/copy" maps to content-microcopy, ux-ia only
**Current:** Content changes affecting screen reader text, aria-labels, alt attributes miss accessibility review.
**Proposed:** Add `accessibility` to the content/copy task type.
**Impact:** Ensures content-focused specs include accessibility requirements.
**Status:** pending

### 18. Name derivation undocumented for review/review-fix modes
**Category:** skill
**Evidence:** `frontend.md` references `{name}` in artifact paths but never defines derivation for review modes
**Current:** Claude generates inconsistent names across runs (e.g., `PricingCard-review.md` vs `pricing-card-review.md`).
**Proposed:** Add rule: basename without extension for files, directory name for directories, kebab-case.
**Impact:** Consistent artifact naming across runs.
**Status:** pending

### 19. Task-gate uses cwd instead of project root for .frontend-specs/
**Category:** skill
**Evidence:** `frontend-team-task-gate.js:34` — `path.join(cwd, ".frontend-specs")`
**Current:** If teammate cwd differs from project root, hook can't find findings and blocks incorrectly.
**Proposed:** Walk up from cwd looking for `.claude/` to find project root.
**Impact:** Prevents false-positive blocks when teammate cwd doesn't match project root.
**Status:** pending

### 20. Extension extraction should use path.extname()
**Category:** code
**Evidence:** `frontend-quality-gate.js:34` — manual `substring(lastIndexOf("."))` instead of `path.extname()`
**Current:** Works by accident for common cases but inconsistent with other hooks that use the `path` module.
**Proposed:** Replace with `path.extname(filePath)`.
**Impact:** Maintainability and consistency across hooks.
**Status:** pending

### 21. README missing Chrome DevTools MCP setup instructions
**Category:** workflow
**Evidence:** README line 19 lists "Chrome with a DevTools MCP connection" as prerequisite with no link or setup info
**Current:** Users who clone the repo cannot configure the MCP dependency needed for refresh/reference inspection.
**Proposed:** Add link to Chrome DevTools MCP package or brief setup note.
**Impact:** Reduces friction for new users.
**Status:** pending

### 22. .gitignore workspace exclusions may confuse contributors
**Category:** workflow
**Evidence:** `.gitignore` lines 4-6 exclude `typography/`, `ui/`, `research/` — workspace dirs that don't exist in the repo
**Current:** Meaningless to consumers. If project ever adds a legitimate `ui/` directory, it would be silently ignored.
**Proposed:** Add comment explaining these are workspace-only. Consider removing `ui/` and `research/` since they were already excluded from the initial commit.
**Impact:** Prevents confusion and accidental exclusion of future directories.
**Status:** pending

### 23. team_name.includes("frontend") is overly broad
**Category:** code
**Evidence:** `frontend-team-idle-gate.js:28` and `frontend-team-task-gate.js:26`
**Current:** Matches any team name containing "frontend" as substring (e.g., "not-frontend").
**Proposed:** Use `team_name.startsWith("frontend-review-fix")` for precision.
**Impact:** Low — defensive improvement against accidental activation.
**Status:** pending

### 24. Orphan .claude/project/ directory untracked and undocumented
**Category:** structure
**Evidence:** `.claude/project/reports/` exists but no file references `.claude/project/`
**Current:** Empty directory contradicts documented structure. Not in .gitignore, could leak generated content.
**Proposed:** Add `.claude/project/` to `.gitignore` if used for SI reports, or delete if unused.
**Impact:** Prevents accidental commit of generated artifacts.
**Status:** pending

## Applied

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

## Rejected
