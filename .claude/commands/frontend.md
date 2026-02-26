---
name: frontend
description: "Frontend Design System — routes to spec, implement, review, scan, improve, or refresh agents."
argument-hint: "[refresh | implement | review | review-fix | ref <url> | lighthouse | scan | improve [path] | task description]"
allowed-tools: ["Task", "Read", "Glob", "AskUserQuestion"]
---

<objective>
Route frontend design tasks to specialized agents. Parse $ARGUMENTS to determine mode and dispatch accordingly.

Skill files may be at `.claude/skills/frontend/` or `~/.claude/skills/frontend/` depending on install method. Try project-local first, fall back to global.

Available skills: taste.md, visual-design.md, ux-ia.md, interaction-motion.md, layout-responsive.md, accessibility.md, component-architecture.md, forms-data.md, content-microcopy.md, performance.md

Deep skill files (principles + patterns) live alongside as `{domain}.deep.md`. Checklist-only files are the default `{domain}.md`.
</objective>

<taste_check>
Before spec/implement/review tasks (NOT before refresh or ref):

1. Read `.claude/skills/frontend/taste.md`
2. Check if the `<taste>` block contains actual observations (not just comments)
3. If empty: announce "Taste observations are empty — consider running `/frontend refresh` to populate them from your Pinterest and portfolio." Then proceed normally (do not block or force a refresh).
4. If populated: use silently, no announcement needed.
</taste_check>

<team_detection>
Before routing, check if agent teams are available:

1. Check: is CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 in environment?
   - No → use subagent paths for all modes (existing behavior)
   - Yes → teams are available; review-fix mode can use them
</team_detection>

<routing>
Parse `$ARGUMENTS` and route to the correct mode:

## Mode: refresh
**Trigger:** `$ARGUMENTS` starts with "refresh"

Dispatch via Task tool:
- subagent_type: `frontend-refresh`
- prompt: "Refresh taste observations from Pinterest and portfolio URLs."

Report completion when done.

---

## Mode: ref
**Trigger:** `$ARGUMENTS` starts with "ref" followed by a URL

Extract the URL from `$ARGUMENTS`. Derive a short name from the URL's hostname (e.g., `stripe.com` → `stripe`, `linear.app` → `linear`).

Dispatch via Task tool:
- subagent_type: `frontend-specifier`
- prompt: |
    Reference capture mode. Navigate to {URL} via Chrome DevTools MCP.
    1. Screenshot at 1440px viewport width (desktop)
    2. Screenshot at 375px viewport width (mobile)
    3. Extract visual observations: color palette, typography (faces, scale, weights), spacing rhythm, layout patterns, component patterns, energy/mood
    4. Write observations to `.frontend-specs/refs/{name}.md` using this format:

    ```
    # Reference: {name}
    Source: {URL}
    Captured: {today's date}

    ## Desktop (1440px)
    [screenshot observations]

    ## Mobile (375px)
    [screenshot observations]

    ## Visual Language
    - **Palette:** [colors observed]
    - **Typography:** [faces, scale, weights]
    - **Spacing:** [rhythm, density]
    - **Layout:** [grid, patterns]
    - **Components:** [notable patterns]
    - **Energy:** [calm/bold, minimal/rich, etc.]
    ```

    Create `.frontend-specs/refs/` directory if it doesn't exist.

Report the ref file path when done.

---

## Mode: implement
**Trigger:** `$ARGUMENTS` starts with "implement"

1. Check `.frontend-specs/` directory for spec files. If `$ARGUMENTS` includes a path, use that spec. Otherwise use the most recent spec file.
2. If no specs exist, tell the user: "No specs found in .frontend-specs/. Run `/frontend [task description]` first to create a spec."
3. Dispatch via Task tool:
   - subagent_type: `frontend-implementer`
   - prompt: "Implement the spec at [spec file path]. Read the spec file, detect the project stack, and write code matching the spec exactly."

Report completion and list files created/modified.

---

## Mode: review
**Trigger:** `$ARGUMENTS` starts with "review" but NOT "review-fix"

This is the parallel audit orchestration mode. It runs in the main context (not delegated to a single agent).

1. **Determine target files:** Parse the path from `$ARGUMENTS` (e.g., `review src/components/PricingCard.tsx`). If no path given, ask what to review.

2. **Determine applicable skills** based on what the files contain. Use this table:

   | File content | Skills to audit |
   |---|---|
   | Page/route with multiple sections | visual-design, ux-ia, layout-responsive, accessibility, content-microcopy, interaction-motion, performance |
   | Single UI component | visual-design, component-architecture, accessibility, content-microcopy, interaction-motion, performance |
   | Form or data entry | forms-data, accessibility, visual-design, layout-responsive, content-microcopy |
   | Animation/transition heavy | interaction-motion, accessibility |
   | Navigation/routing component | ux-ia, layout-responsive, accessibility |
   | Design system tokens/theme | component-architecture, visual-design |

   Read the target files first to classify them. When in doubt, include more skills rather than fewer.

3. **Launch parallel auditors:** Dispatch one `frontend-auditor` Task per applicable skill, ALL IN PARALLEL (multiple Task tool calls in a single message):
   - subagent_type: `frontend-auditor`
   - model: `sonnet`
   - prompt for each: "You are auditing the **{skill-domain}** domain. Read the skill file at `.claude/skills/frontend/{skill-domain}.md`, then evaluate these files against its checklist: {file paths}. Project uses: {detected stack info if known}. Return findings in the structured format (Critical/Important/Nice-to-have/Passing)."

4. **Synthesize findings** after all auditors complete:
   - Deduplicate findings that appear across multiple skill audits
   - Group by component/file, not by skill domain
   - Order by severity: Critical → Important → Nice-to-have
   - For each finding, preserve the `file:line` evidence

5. **Write improvement spec** to `.frontend-specs/{name}-review.md` with this structure:
   ```
   # Review: [Component/Page Name]

   ## Summary
   {X} critical, {Y} important, {Z} nice-to-have findings across {N} skill domains.

   ## Critical Findings
   Grouped by file, with file:line evidence and fix description.

   ## Important Findings
   Same format.

   ## Nice-to-have
   Same format.

   ## Passing Areas
   Brief summary of what's already solid.
   ```

6. **Triage and fix** — after writing the review file, present findings via AskUserQuestion:

   If zero findings across all severities: skip triage, report "All domains pass." and stop.

   Otherwise, present a summary:
   ```
   Found {X} critical, {Y} important, {Z} nice-to-have issues.

   Critical:
   1. {title} ({file}) — {one-line description}
   ...

   Important:
   2. {title} ({file}) — {one-line description}
   ...
   ```

   Options:
   - "Fix Critical + Important now (Recommended)"
   - "Fix Critical only"
   - "Show full report only"
   - (Other — for picking specific issues)

   If user picks a fix option: dispatch selected findings to `frontend-implementer` via Task, grouped by file (fix all issues in one file together). Include in the prompt: "These are audit findings from a code review, not a design spec. For each finding, read the file, locate the issue at the referenced line, and apply the fix described. Do not restructure or redesign — only fix the specific issues listed." After each batch, briefly report what was fixed.

7. Report the review spec file path and final summary.

---

## Mode: review-fix
**Trigger:** `$ARGUMENTS` starts with "review-fix" AND teams are available (see team_detection above).

**Fallback:** If teams are NOT enabled, announce: "Agent teams not enabled. Running audit-only review with subagents. To enable teams: set CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 in settings.json env." Then fall through to the regular **review** mode above (subagent auditors, no fixing).

### Step 1: Determine target

Parse the path from `$ARGUMENTS` (e.g., `review-fix src/components/PricingCard.tsx`). If no path given, ask what to review.

### Step 2: Gather context

**Auto-detect (no questions needed):**
- Stack: read `package.json` + config files to detect framework, CSS approach, component library
- File listing: all files in the target path
- Design context: read `.claude/skills/frontend/taste.md` and summarize observations
- Test runner: check `package.json` scripts for test/lint/type-check commands

**Ask the user (via AskUserQuestion, 1-2 questions):**
1. **Severity threshold**: "Fix critical issues only, or critical + important?" — Options: "Critical only", "Critical + Important (Recommended)". Default: critical + important. Determines fixer's scope.
2. **Fix scope constraint** (only if target is broad, e.g. a directory): "Any files the fixer should NOT touch?" — Prevents unintended modifications.

### Step 3: Determine target files and applicable skills

Same logic as the **review** mode: read the target files, classify them using the skill table, select applicable skill domains.

### Step 4: Write team brief

Write to `.frontend-specs/{name}-team-brief.md`:

```
# Team Brief: {name}

## Task
Review and fix {files}. Severity threshold: {critical | critical+important}.

## Detected Stack
- Framework: {e.g., Next.js 15}
- CSS: {e.g., Tailwind 4}
- Components: {e.g., shadcn/ui}
- Test: {e.g., Vitest} | Lint: {e.g., eslint} | Types: {e.g., tsc}

## Files Under Review
{list of files with brief purpose}

## Applicable Skill Domains
{list of skills selected by the classification table}

## Design Context
{taste.md observations summary, or "No taste observations — blank slate"}

## Constraints
- Fixer must NOT touch: {excluded files, if any}
- Severity threshold: {from QnA}
```

### Step 5: Create agent team

Create an agent team called `frontend-review-fix-{name}` and spawn two teammates with natural language instructions:

> Create an agent team called "frontend-review-fix-{name}".
>
> Spawn two teammates:
> - **auditor** (sonnet model): Read-only code reviewer. Read `.claude/agents/frontend-auditor.md` for your full role definition and required output format. Read all applicable skill files from `.claude/skills/frontend/`. Evaluate {files} against every checklist. Write structured findings (Critical/Important/Nice-to-have with file:line evidence) to `.frontend-specs/{name}-audit.md`. Message fixer when done.
> - **fixer** (opus model): Frontend implementer. Read the team brief at `.frontend-specs/{name}-team-brief.md` for stack/conventions context. When audit findings are ready, read `.frontend-specs/{name}-audit.md` and fix all Critical and Important items (or Critical only, per severity threshold). Write a summary of changes to `.frontend-specs/{name}-fixes.md`. Message auditor when done.
>
> Task plan:
> 1. "Audit {files} against {skill domains}" — auditor, no dependencies
> 2. "Fix Critical and Important findings" — fixer, blocked by task 1
> 3. "Validate fixes against original findings" — auditor, blocked by task 2. Write results to `.frontend-specs/{name}-validation.md`.
> 4. "Synthesize final review report" — lead, blocked by task 3
>
> Do NOT implement fixes yourself. Wait for all teammates to complete. Then synthesize: combine audit findings, fixes applied, and validation results into `.frontend-specs/{name}-review.md`.

**Why 1 auditor, not N?** Teammates are full Claude instances (expensive). One auditor checking all skill domains sequentially is more cost-effective than multiple teammate auditors. Subagents are for cheap parallel fan-out; teams are for closed-loop coordination.

### Step 6: Synthesize

After all teammates complete (tasks 1-3 done), the lead (main context) writes the final report to `.frontend-specs/{name}-review.md` combining:
- Audit findings from `.frontend-specs/{name}-audit.md`
- Fixes applied from `.frontend-specs/{name}-fixes.md`
- Validation results (whether fixes resolved the findings)

Report the review file path and summary of what was found and fixed.

---

## Mode: lighthouse
**Trigger:** `$ARGUMENTS` starts with "lighthouse"

Goal: Run Lighthouse against the project's dev server and feed failures back to the implementer for fixing. Bash-driven, not screenshot-driven. One loop max.

### Step 1: Check prerequisites
Run via Bash:
- Check `npx lighthouse --version` — if not available, run `npm install -g lighthouse` and verify
- Check if a dev server is already running on localhost by testing common ports (3000, 3001, 4000, 4321, 5173, 8080) with: `curl -s -o /dev/null -w "%{http_code}" http://localhost:{PORT}`
- If no server found, check `package.json` for a `dev` or `start` script, then instruct the user: "No dev server detected. Run `npm run dev` in another terminal, then run `/frontend lighthouse` again." Exit early if no server.

### Step 2: Detect the URL
- Use the first port that returned 200 from Step 1
- Parse `$ARGUMENTS` for a path suffix (e.g., `lighthouse /pricing` → test `http://localhost:{PORT}/pricing`)
- Default to `http://localhost:{PORT}/`

### Step 3: Run Lighthouse
```bash
npx lighthouse {URL} \
  --output=json \
  --output-path=.frontend-specs/lighthouse-report.json \
  --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
  --only-categories=performance,accessibility,best-practices,seo \
  --quiet
```

### Step 4: Parse results
Read `.frontend-specs/lighthouse-report.json`. Extract:
- Category scores (performance, accessibility, best-practices, seo) — multiply by 100 for 0-100 scale
- Failed audits: any audit where `score < 1` and `scoreDisplayMode !== 'informative'` and `scoreDisplayMode !== 'notApplicable'`
- For each failed audit: extract `id`, `title`, `description`, `score`, and `details.items` (first 3 items max)

### Step 5: Report and decide

If ALL scores are 100:
- Print: "✓ Lighthouse: 100/100 across Performance, Accessibility, Best Practices, SEO"
- Done. No fix pass needed.

If any score < 100:
- Print a summary table:
  ```
  Lighthouse Results: {URL}
  ├─ Performance:     {score}/100
  ├─ Accessibility:   {score}/100
  ├─ Best Practices:  {score}/100
  └─ SEO:             {score}/100

  {N} failed audits
  ```
- Write findings to `.frontend-specs/lighthouse-findings.md` in the standard Critical/Important/Nice-to-have format:
  - Score 0-49 → Critical
  - Score 50-89 → Important
  - Score 90-99 → Nice-to-have
  - Map each failed audit to a finding with: audit title, current score, what it means, and the fix
- Ask the user (AskUserQuestion): "Lighthouse found {N} issues. Fix them now?" — Options: "Fix all", "Fix Critical + Important only", "Show report only"

### Step 6: Fix pass (if user approved)
Dispatch via Task tool:
- subagent_type: `frontend-implementer`
- prompt: "Fix the Lighthouse failures in `.frontend-specs/lighthouse-findings.md`. Read the findings file, then fix each item in the codebase. Focus on static code fixes (HTML attributes, meta tags, image attributes, font loading, script attributes). Do NOT change visual design or layout. After fixing, report what you changed."

### Step 7: Re-run (if fixes were applied)
After the implementer completes, re-run Lighthouse (Step 3) and report the new scores. Do this once — do not loop more than twice total.

### Notes on what Lighthouse can and cannot fix statically:
- **Fixable in code:** Missing meta tags, missing alt text, missing loading attributes, font-display issues, render-blocking scripts, non-descriptive links, missing viewport meta, console errors from bad code, image format/dimension issues
- **Not fixable in code:** Actual LCP time (depends on server speed), network latency, server response time (TTFB), third-party script performance — note these as "infrastructure" issues in the findings, not code issues

---

## Mode: scan
**Trigger:** `$ARGUMENTS` starts with "scan"

Profiles the existing codebase and writes a structured report.

1. Check if `.frontend-specs/codebase-profile.md` exists:
   - If it exists and was modified within the last 7 days: ask via AskUserQuestion — "Codebase profile exists from {modification date}. Re-scan or use existing?" Options: "Use existing", "Re-scan (Recommended if stack changed)"
   - If stale (> 7 days) or missing: proceed to scan
2. Dispatch via Task tool:
   - subagent_type: `frontend-scanner`
   - model: `sonnet`
   - prompt: "Profile the codebase. Detect framework, CSS approach, component library, design tokens, naming conventions, file structure, testing/tooling config, dev server port, and a11y baseline. Write profile to `.frontend-specs/codebase-profile.md`."
3. Read `.frontend-specs/codebase-profile.md` after completion and print a brief summary (stack, CSS, component library, dev server status).

---

## Mode: improve
**Trigger:** `$ARGUMENTS` starts with "improve"

Orchestrates scan + review + lighthouse + triage + fix in one interactive flow. This is the primary brownfield improvement mode.

### Step 1: Determine target
Parse path from `$ARGUMENTS` (e.g., `improve src/components/PricingCard.tsx`). If no path given, ask via AskUserQuestion: "What file or directory do you want to improve?" Options: (Other — freeform path input).

### Step 2: Ensure codebase profile
Check for `.frontend-specs/codebase-profile.md`:
- **Missing:** dispatch Task to `frontend-scanner` (model: sonnet) with prompt: "Profile the codebase. Write to `.frontend-specs/codebase-profile.md`." Wait for completion.
- **Exists and < 7 days old:** use existing silently.
- **Exists and > 7 days old:** ask via AskUserQuestion: "Codebase profile exists from {modification date}. Re-scan or use existing?" Options: "Use existing", "Re-scan (Recommended if stack changed)". If re-scan: dispatch scanner as above. If use existing: proceed.

Read the profile for stack context (framework, CSS approach, component library, conventions).

### Step 3: Run parallel review
Same as review mode steps 2-4:
1. Read the target files to classify them against the skill table
2. Launch parallel `frontend-auditor` Tasks per applicable skill (model: sonnet)
3. Collect and synthesize findings (deduplicate, group by file, order by severity)

Hold findings in context — do not write a review file yet.

### Step 4: Run lighthouse (conditional)
Read the codebase profile for dev server port information.
- If a dev server port is detected: dispatch Task to `frontend-implementer` with prompt: "Run only the specified bash commands. Do not read specs or make design changes. Run `npx lighthouse http://localhost:{PORT}/ --output=json --output-path=.frontend-specs/lighthouse-report.json --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' --only-categories=performance,accessibility,best-practices,seo --quiet`. Then read the JSON output. Extract category scores and failed audits (score < 1, scoreDisplayMode not 'informative' or 'notApplicable'). Write a summary of findings to `.frontend-specs/lighthouse-findings.md`." Read findings back.
- If no server detected: note "Lighthouse skipped — no dev server detected. Run `npm run dev` and use `/frontend lighthouse` separately."

### Step 5: Triage
Combine review + lighthouse findings. Present via AskUserQuestion with priority ranking:

```
Found {X} critical, {Y} important, {Z} nice-to-have issues.
{Lighthouse scores if available: Performance X/100, A11y X/100, etc.}

Top issues:
1. {title} ({file}) — {one-line description}
2. ...
```

Options:
- "Fix all Critical + Important (Recommended)"
- "Fix Critical only"
- "Let me pick"
- "Show report only"

If "Show report only": write combined findings to `.frontend-specs/{name}-improvement.md` and stop.

### Step 6: Incremental fixes
Dispatch selected findings to `frontend-implementer` via Task, grouped by file (fix all issues in one file together). Use model: sonnet for the implementer.

After each file batch: briefly report what was fixed. Then ask via AskUserQuestion: "Continue with remaining fixes?" Options: "Continue (Recommended)", "Stop here".

### Step 7: Re-validate (if lighthouse was run in Step 4)
If lighthouse was run: dispatch Task to `frontend-implementer` with the same lighthouse command from Step 4 to re-run and report new scores. Add to the prompt: "Run only the specified bash commands. Do not read specs or make design changes."
Also dispatch Task to `frontend-implementer` with prompt: "Run only the specified bash commands. Do not read specs or make design changes." to run lint + type-check commands from the codebase profile's Scripts table (if configured).
Report comparison: before vs after scores.

### Step 8: Write improvement report
Write to `.frontend-specs/{name}-improvement.md` with sections:
```
# Improvement Report: {name}

## Profile Summary
{Stack, CSS, component library from profile}

## Fixed
{List of findings that were fixed, grouped by file}

## Deferred
{Findings the user chose not to fix}

## Not Fixable in Code
{Infrastructure issues, third-party limitations, etc.}

## Validation
{Lighthouse before/after scores if available}
{Lint/type-check results if available}
```

Report the improvement file path and a brief summary.

---

## Mode: spec (default)
**Trigger:** Any `$ARGUMENTS` that don't match the above modes, OR no arguments (ask what to build).

### Dialogue phase

Before dispatching to the specifier, gather context via AskUserQuestion. Skip questions whose answers are already clear from `$ARGUMENTS`.

**Question 1** (skip if `$ARGUMENTS` already describes what to build clearly):
- "What are you building?"
- Options: freeform (use "Other" option)

**Question 2:**
- "Any reference URLs, screenshots, or styles to match?"
- Options: "No references", "Yes — I'll paste URLs/paths" (use "Other" for input)

**Question 3:**
- "Any constraints?"
- Options: "No constraints — start fresh", "Using an existing design system", "Specific brand colors/fonts", "Framework requirements"
- multiSelect: true

Bundle all answers into the prompt sent to the specifier agent.

Also check for reference files in `.frontend-specs/refs/` — if any exist, list them in the prompt so the specifier can use them.

### Model selection

Before dispatching, classify the task scope to select the optimal model:

| Scope | Model | Signal |
|-------|-------|--------|
| Single component | sonnet | button, card, modal, form field, nav element |
| Form / data display | sonnet | form, input pattern, table, data viz |
| Animation / interaction | sonnet | specific animation or interaction |
| Full page / feature | opus | page, landing, dashboard, multi-section |
| Design system | opus | tokens, theme, system-wide patterns |
| Multi-component feature | opus | 3+ components working together |
| Redesign | opus | explicitly mentions redesign |

Default to sonnet when uncertain. Use the classified model in the Task tool's `model` parameter.

### Dispatch

Dispatch via Task tool:
- subagent_type: `frontend-specifier`
- model: `{classified model from table above}`
- prompt: "Create a frontend spec for: {$ARGUMENTS}. {dialogue answers bundled here}. {ref files listed if any}. Write the spec to .frontend-specs/{name}-spec.md. Read taste.md for aesthetic context first."

Report completion and the spec file path.
</routing>

<spec_artifacts>
All specs are written to `.frontend-specs/` in the project root (or current working directory if no project root).

- Spec files: `.frontend-specs/{name}-spec.md`
- Review files: `.frontend-specs/{name}-review.md`
- Improvement reports: `.frontend-specs/{name}-improvement.md`
- Codebase profile: `.frontend-specs/codebase-profile.md`
- Reference files: `.frontend-specs/refs/{name}.md`
- Create the directory if it doesn't exist.
- Use kebab-case for names derived from task descriptions.
- **Name derivation for review/review-fix modes:** Use the target's basename without extension for files (e.g., `PricingCard.tsx` → `pricing-card`), directory name for directories (e.g., `src/components/` → `components`), always kebab-case.
</spec_artifacts>

<quick_reference>
All `.claude/` paths resolve project-local first, then `~/.claude/` (global install).

- Taste file: `.claude/skills/frontend/taste.md`
- Skill files (checklist): `.claude/skills/frontend/*.md`
- Skill files (deep): `.claude/skills/frontend/*.deep.md`
- Agents: `.claude/agents/frontend-{specifier,implementer,auditor,refresh,scanner}.md`
- Quality gate config: `.claude/frontend-gaterc.json`
- Quality gate: `.claude/hooks/frontend-quality-gate.cjs`
- Team hooks: `.claude/hooks/frontend-team-{task,idle}-gate.cjs`
- Codebase profile: `.frontend-specs/codebase-profile.md`
- Spec output: `.frontend-specs/`
- Reference captures: `.frontend-specs/refs/`
- Team briefs: `.frontend-specs/{name}-team-brief.md`
- Audit findings: `.frontend-specs/{name}-audit.md`
- Fix summaries: `.frontend-specs/{name}-fixes.md`
- Lighthouse output: `.frontend-specs/lighthouse-report.json`
- Lighthouse findings: `.frontend-specs/lighthouse-findings.md`
- Pinterest/Portfolio URLs: see taste.md frontmatter
- Force refresh: `/frontend refresh`
- Scan command: `/frontend scan`
- Improve command: `/frontend improve [path]`
- Run audit: `/frontend lighthouse` (requires dev server running)
- Agent teams env: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
</quick_reference>
