---
name: frontend
description: "Frontend Design System — routes to spec, implement, review, or refresh agents."
argument-hint: "[refresh | implement | review | review-fix | ref <url> | task description]"
allowed-tools: ["Task", "Read", "Glob", "AskUserQuestion"]
---

<objective>
Route frontend design tasks to specialized agents. Parse $ARGUMENTS to determine mode and dispatch accordingly.

Skill files live in `.claude/skills/frontend/`:
taste.md, visual-design.md, ux-ia.md, interaction-motion.md, layout-responsive.md, accessibility.md, component-architecture.md, forms-data.md, content-microcopy.md

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
   | Page/route with multiple sections | visual-design, ux-ia, layout-responsive, accessibility, content-microcopy, interaction-motion |
   | Single UI component | visual-design, component-architecture, accessibility, content-microcopy, interaction-motion |
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

6. Report the review spec file path and a brief summary of findings.

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

### Dispatch

Dispatch via Task tool:
- subagent_type: `frontend-specifier`
- prompt: "Create a frontend spec for: {$ARGUMENTS}. {dialogue answers bundled here}. {ref files listed if any}. Write the spec to .frontend-specs/{name}-spec.md. Read taste.md for aesthetic context first."

Report completion and the spec file path.
</routing>

<spec_artifacts>
All specs are written to `.frontend-specs/` in the project root (or current working directory if no project root).

- Spec files: `.frontend-specs/{name}-spec.md`
- Review files: `.frontend-specs/{name}-review.md`
- Reference files: `.frontend-specs/refs/{name}.md`
- Create the directory if it doesn't exist.
- Use kebab-case for names derived from task descriptions.
- **Name derivation for review/review-fix modes:** Use the target's basename without extension for files (e.g., `PricingCard.tsx` → `pricing-card`), directory name for directories (e.g., `src/components/` → `components`), always kebab-case.
</spec_artifacts>

<quick_reference>
- Taste file: `.claude/skills/frontend/taste.md`
- Skill files (checklist): `.claude/skills/frontend/*.md`
- Skill files (deep): `.claude/skills/frontend/*.deep.md`
- Agents: `.claude/agents/frontend-{specifier,implementer,auditor,refresh}.md`
- Spec output: `.frontend-specs/`
- Reference captures: `.frontend-specs/refs/`
- Team briefs: `.frontend-specs/{name}-team-brief.md`
- Audit findings: `.frontend-specs/{name}-audit.md`
- Fix summaries: `.frontend-specs/{name}-fixes.md`
- Pinterest: https://nl.pinterest.com/cordovagiova/
- Portfolio: https://giovannicordova.com/
- Force refresh: `/frontend refresh`
- Agent teams env: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- Quality gate: `.claude/hooks/frontend-quality-gate.cjs`
- Team hooks: `.claude/hooks/frontend-team-{task,idle}-gate.cjs`
</quick_reference>
