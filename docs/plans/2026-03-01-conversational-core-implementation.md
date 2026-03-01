# Conversational Core + Design Tokens — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the frontend design system from 28 config files to 9, add a design token system with browser preview, and rewrite `/frontend` as a conversational auto-detecting command.

**Architecture:** Replace 8 explicit modes with 6 auto-detected phases (Brand, Spec, Build, Review, Improve, Refresh). Consolidate 9×2 skill files into 3 unified files (design.md, experience.md, build.md) with checklist + deep sections in each. Merge 5 agents into 3 (designer, builder, reviewer). Enhance the quality gate hook with token compliance checks and remove the 2 team hooks.

**Tech Stack:** Claude Code configuration (markdown agents, commands, skills), Node.js hooks (.cjs), JSON (design tokens, settings)

**Design doc:** `docs/plans/2026-03-01-conversational-core-design-tokens-design.md`

---

### Task 1: Consolidate skill files — design.md

**Files:**
- Create: `.claude/skills/frontend/design.md`
- Source: `.claude/skills/frontend/visual-design.md`, `visual-design.deep.md`, `layout-responsive.md`, `layout-responsive.deep.md`, `accessibility.md`, `accessibility.deep.md`

**Step 1: Create the consolidated design.md**

Merge the 6 source files into one. Structure:

```markdown
---
name: design
domain: frontend
---

<scope>
Visual design, layout systems, and accessibility — everything about how the interface looks and is perceived.

Covers: color theory, typography, spacing, visual hierarchy, elevation, iconography, grid/flex layout, breakpoints, responsive behavior, container queries, WCAG AAA compliance, keyboard navigation, screen reader support, ARIA patterns, contrast, focus management, motion sensitivity.

Does NOT cover: user flows, animation purpose, microcopy, form validation (experience.md), component API, code splitting, SEO (build.md).
</scope>

<checklist>
## Visual Design
- Is a type scale defined with consistent ratios?
- Are font weights limited and purposeful (not decorative)?
- Is a spacing scale defined from a base unit?
- Does the color palette have primary, neutral, and semantic scales?
- Is visual hierarchy clear — can you identify the focal point?
- Is elevation/shadow consistent in direction and intensity?
- Are icons consistent in style and properly sized?
- Is the design free of unnecessary decorative elements?
- Are surface/background layers defined?
- Does text hierarchy use size + weight + color (not just one)?

## Layout & Responsive
- Is the layout defined for at least 3 breakpoints (mobile, tablet, desktop)?
- Does the layout use grid for page-level and flex for component-level?
- Are widths fluid (%, rem, clamp) not fixed (px)?
- Is max-width set on content containers?
- Is spacing scaled between viewports?
- Are responsive patterns defined (stack, collapse, hide)?
- Is there no horizontal overflow at any viewport?
- Is CLS prevented (reserved space, aspect-ratio, skeletons)?
- Does mobile layout preserve information hierarchy?
- Are container queries used where components need local responsiveness?

## Accessibility
- Is heading hierarchy (h1-h6) defined and sequential?
- Are all interactive elements keyboard accessible?
- Is focus management handled for dynamic content (modals, route changes, insertions)?
- Are contrast ratios specified at AAA level (7:1 / 4.5:1)?
- Does every color-coded state have a non-color alternative?
- Are touch targets at least 44x44px?
- Is `prefers-reduced-motion` addressed?
- Are screen reader announcements defined for dynamic updates?
- Are form inputs paired with visible labels (not placeholder-only)?
- Is a skip-to-content link included?
- Are landmark regions defined?
- Is focus order logical and matching visual order?
</checklist>

--- deep ---

<principles>
## Visual Design

1. **Typography is the skeleton.** Choose a type scale with mathematical ratios (major third 1.25, perfect fourth 1.333, or golden ratio 1.618). Define weights for hierarchy: display, heading, subheading, body, caption, overline. Line height scales inversely with size. Max line length 65-75 characters.

2. **Spacing is rhythm.** Use a base unit (4px or 8px) and derive all spacing as multiples. Consistent rhythm creates visual coherence. Spacing communicates relationship — tighter = related, wider = separate.

3. **Color communicates meaning.** Build palette from: primary (brand action), neutral (text/backgrounds/borders), semantic (success/warning/error/info). Each needs a full scale (50-950). Surface colors layer: background → surface → elevated surface.

4. **Hierarchy directs attention.** Every screen has one focal point. Use size, weight, color, and whitespace to establish reading order. Squint test: if hierarchy disappears when blurred, it relies too much on color alone.

5. **Elevation creates depth.** Shadow intensity communicates affordance. Direction consistent (top-left light). Elevation correlates with z-index.

6. **Iconography is consistent.** One style (outlined, filled, duotone). Icons accompany text — never standalone without tooltip/label. Sizing aligns with text scale.

7. **Visual noise is debt.** Every border, shadow, gradient must earn its place. White space is a design element, not empty space.

## Layout & Responsive

8. **Content dictates breakpoints, not devices.** Set breakpoints where layout breaks. Common starting points: 640px, 768px, 1024px, 1280px. Always verify by resizing.

9. **Mobile-first is structural, not just CSS.** Design content hierarchy for smallest viewport first. Wider viewports add columns, expand spacing, reveal secondary content — they don't restructure hierarchy.

10. **Grid for page-level, flex for component-level.** CSS Grid for two-dimensional layouts. Flexbox for one-dimensional component layouts.

11. **Fluid over fixed.** Relative units (%, rem, vw, clamp()) for widths. Max-widths to prevent stretching. `clamp()` for fluid scaling without breakpoints.

12. **Container queries over media queries where supported.** Components respond to container width, not viewport. Makes components reusable across layout contexts.

13. **Spacing scales with viewport.** Don't use same padding on mobile and desktop. Scale proportionally using clamp or breakpoint-specific values.

14. **No horizontal scroll, no layout shifts.** Nothing overflows horizontally. Reserve space for async content (skeleton, aspect-ratio) to prevent CLS.

## Accessibility

15. **WCAG AAA is the floor.** 7:1 contrast for normal text, 4.5:1 for large text. AAA sizing minimums. Non-negotiable.

16. **Semantic HTML first, ARIA second.** Native elements carry implicit roles and keyboard behavior. ARIA is a repair tool. If you need ARIA, question the HTML structure first.

17. **Keyboard is a first-class input.** Every interactive element reachable via Tab. No focus traps except modals with escape. Skip-to-content link. Custom widgets implement expected key patterns.

18. **Color is never the sole indicator.** Every state conveyed by color must also be conveyed by shape, text, icon, or pattern.

19. **Motion respects user preference.** Honor `prefers-reduced-motion`. Provide alternatives. No auto-playing animations without user control.

20. **Screen readers get equivalent information.** Announce dynamic changes with live regions. Meaningful alt text. Visible labels. Status messages use `role="status"`.

21. **Touch targets meet minimum sizing.** 44x44px minimum (WCAG 2.5.8 AAA). Adequate spacing between adjacent targets.
</principles>

<patterns>
## Visual Design Patterns

**Type scale construction:** Start from base (16px), multiply up for headings, divide down for small text. Define: display, h1-h4, body, small, caption. Each gets size, weight, line-height, letter-spacing, color.

**Color palette structure:** Primary (1 hue, 10 shades), Neutral (1 hue or pure gray, 10 shades), Semantic (4 hues: success/warning/error/info, 3 shades each). Surface stack: page bg → card → elevated.

**Spacing scale:** 4px base → 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Name semantically (xs through 3xl).

## Layout Patterns

**Page layouts:** Full-width (marketing), constrained center (content/docs, max-width 1200-1400px), sidebar + main (app/dashboard), multi-column (magazine/news).

**Responsive patterns:** Stack → side-by-side (cards). Sidebar → drawer (navigation). Table → card list (data on mobile). Multi-column → single column. Horizontal nav → hamburger/bottom nav.

**Grid patterns:** Auto-fill/auto-fit with minmax for card grids. Named grid areas for semantic layouts. Subgrid for aligned nested content.

**Spacing rhythm:** Section spacing > component spacing > element spacing. Sections: 64-96px desktop, 40-64px mobile. Components: 24-48px. Elements: 8-16px.

## Accessibility Patterns

**Landmarks:** header/nav/main/aside/footer — one main per page, labeled nav regions if multiple.

**Headings:** Single h1 per page. Sequential hierarchy. Headings describe content, not styling.

**Focus management:** After route change → focus main content. After modal open → focus modal. After modal close → focus trigger. After insertion → focus new content or announce.

**Announcements:** Toasts use `aria-live="polite"`. Errors use `aria-live="assertive"`. Loading states announce start and completion.

## Anti-patterns
- More than 2 font families per page
- Random spacing values (13px, 17px, 22px)
- Fixed pixel widths on containers
- Viewport-unit-only font sizes with no minimum
- Hiding critical content on mobile
- `tabindex` > 0
- Click handlers on divs without role and keyboard support
- `outline: none` without visible focus replacement
- `aria-label` that duplicates visible text
</patterns>
```

**Step 2: Verify the file was created**

Run: `wc -l .claude/skills/frontend/design.md`
Expected: approximately 130-160 lines

**Step 3: Commit**

```bash
git add .claude/skills/frontend/design.md
git commit -m "feat(skills): create consolidated design.md from visual-design + layout + accessibility"
```

---

### Task 2: Consolidate skill files — experience.md

**Files:**
- Create: `.claude/skills/frontend/experience.md`
- Source: `.claude/skills/frontend/ux-ia.md`, `ux-ia.deep.md`, `interaction-motion.md`, `interaction-motion.deep.md`, `content-microcopy.md`, `content-microcopy.deep.md`, `forms-data.md`, `forms-data.deep.md`

**Step 1: Create the consolidated experience.md**

```markdown
---
name: experience
domain: frontend
---

<scope>
User experience, interaction, and content — everything about how the interface feels and behaves.

Covers: user flows, navigation, information architecture, progressive disclosure, cognitive load, animation/motion, micro-interactions, state transitions, loading patterns, UX writing, error messages, empty states, CTAs, labels, form validation, data tables, complex inputs.

Does NOT cover: visual styling, grid systems, contrast ratios (design.md), component API, performance optimization (build.md).
</scope>

<checklist>
## UX & Information Architecture
- Is the information hierarchy based on user mental models?
- Does navigation show current location clearly?
- Can users always navigate back or exit?
- Is progressive disclosure used (not everything shown at once)?
- Are smart defaults set for common choices?
- Does every action have visible feedback?
- Are patterns consistent across similar interactions?
- Are flows linear and escapable (back, cancel, save)?
- Is cognitive load managed (grouping, whitespace, chunking)?
- Is the navigation depth reasonable (3 levels max without breadcrumbs)?

## Interaction & Motion
- Does every animation serve a communicative purpose?
- Are durations appropriate (100-200ms micro, 200-300ms reveal, 300-500ms transition)?
- Is easing physics-based (ease-out enter, ease-in exit)?
- Are state transitions continuous (not instant jumps)?
- Do loading states preserve layout (skeletons, reserved space)?
- Are gestures supplementary (not the only way to act)?
- Is stagger used for lists/grids (with a cap on total duration)?
- Are animations using transform/opacity (not layout properties)?
- Is there a 200ms delay before showing loading indicators?
- Are exit animations slightly faster than enter animations?

## Content & Microcopy
- Are error messages specific and actionable (what happened + how to fix)?
- Do empty states explain what belongs and how to populate?
- Do CTAs describe outcomes (not generic "Submit"/"OK")?
- Is confirmation copy explicit about consequences and reversibility?
- Are labels concise (noun phrases for fields, verb+object for buttons)?
- Are status messages calibrated to urgency (auto-dismiss vs persistent)?
- Is the tone consistent with the product voice?
- Is loading copy contextual (not generic "Loading...")?
- Is all copy free of jargon, blame, and raw technical errors?
- Are destructive action labels specific ("Delete project" not "Delete")?

## Forms & Data
- Is validation timing appropriate (blur for format, submit for required/cross-field)?
- Do inline errors appear next to their fields?
- Does error recovery preserve all valid input?
- Are related fields grouped with headings?
- Do inputs match their data type (date picker, tel, combobox)?
- Are sensible defaults and auto-formatting applied?
- Do destructive actions require explicit confirmation?
- Are data tables sortable, filterable, and paginated?
- Does the form have a clear submission feedback (success/error)?
- Is the empty state defined for tables/lists?
- Are multi-step forms saveable and resumable?
- Do file uploads show progress and validate before upload?
</checklist>

--- deep ---

<principles>
## UX & Information Architecture

1. **Information hierarchy matches user mental models.** Organize by how users think, not backend structure. Navigation labels use user language, not jargon.

2. **Progressive disclosure reduces cognitive load.** Show minimum at each step. Advanced options behind expandable sections. Details on demand, not upfront.

3. **Navigation is wayfinding.** Users must always know: where they are, where they can go, how to get back. Breadcrumbs for depth. Active states for location. Persistent nav for primary routes.

4. **Every flow has a clear exit.** Wizards have back and cancel. Modals have close and Escape. Multi-step processes show progress and allow saving/resuming.

5. **Reduce decisions, not options.** Smart defaults eliminate unnecessary choices. Sensible sorting. Pre-selection of common options. Search/filter for large sets.

6. **Feedback closes the loop.** Every action gets visible response. Submissions confirm. Errors explain and guide. Loading indicates progress.

7. **Consistency reduces learning cost.** Same patterns for same interactions across the product. Inconsistency forces re-learning.

## Interaction & Motion

8. **Motion communicates, it doesn't decorate.** Every animation serves a purpose: state change, attention guidance, spatial relationship, feedback. If removing loses no information, remove it.

9. **Duration scales with distance and importance.** Micro: 100-200ms. Reveals: 200-300ms. Page transitions: 300-500ms. Nothing exceeds 500ms.

10. **Easing matches physics.** Enter: ease-out. Exit: ease-in. Movement: ease-in-out. Linear looks mechanical — avoid for UI.

11. **State transitions are continuous.** Elements move between states, not teleport. Define intermediates, not just start and end.

12. **Loading states maintain spatial stability.** Skeletons preserve layout. Spinners after 200ms delay. Content fades in, not pops.

13. **Gestures extend, not replace.** Swipe/pinch/long-press are shortcuts with button equivalents. Never gate functionality behind gesture-only.

14. **Stagger creates rhythm.** Lists animate items sequentially (30-50ms stagger). Cap total stagger time. Entry only, not exit.

## Content & Microcopy

15. **Clarity over cleverness.** Plain language. One idea per sentence. Active voice. Present tense.

16. **Error messages are help messages.** What happened? Why? How to fix? Never blame the user. Never show raw errors.

17. **Empty states are onboarding.** Show what belongs, how to populate, with a CTA.

18. **CTAs describe the outcome.** "Get started" not "Submit." "Delete project" not "Confirm."

19. **Labels are scannable.** Form labels: short noun phrase. Nav labels: 1-2 words. Button labels: verb + object.

20. **Confirmation copy names the stakes.** What will happen, what will be lost, whether reversible. Confirm button repeats the action.

21. **Status messages match urgency.** Success: brief, auto-dismiss. Warning: persistent, actionable. Error: persistent, explains fix.

## Forms & Data

22. **Validate at the right moment.** Blur for format. Submit for required and cross-field. Inline errors next to fields.

23. **Error recovery is a flow.** Scroll to first error, focus it, show all inline. Preserve valid input. Let users fix and re-submit.

24. **Forms are conversations.** Group related fields. One group at a time for long forms. Progress indicator for multi-step.

25. **Data tables are interactive.** Sortable columns. Filterable. Paginated or virtualized. Row actions. Bulk actions. Empty state.

26. **Inputs match the data type.** Date → picker. Phone → tel. Selection <10 → radio/select. 10+ → combobox.

27. **Defaults reduce friction.** Pre-fill from context. Default to most common. Auto-format as user types.

28. **Destructive actions have speed bumps.** Confirmation with explicit action name. Bulk actions show count. Undo > confirmation when possible.
</principles>

<patterns>
## UX Patterns

**Navigation:** Top bar (global, 5-7 items), Sidebar (app, collapsible), Tab bar (section, 3-5), Breadcrumbs (depth), Bottom nav (mobile, 3-5).

**Grouping:** Cards (distinct items), Lists (scannable items), Tables (comparable data), Accordions (progressive disclosure), Tabs (parallel content).

**Flow:** Linear wizard, Hub-and-spoke, Drill-down, Search-first.

## Interaction Patterns

**Micro-interactions:** Button press (scale 0.97, 100ms), Toggle slide (200ms), Checkbox check (SVG stroke, 150ms).

**Reveals:** Fade in (opacity, 200ms), Slide up (translateY 8px + fade, 250ms), Scale in (0.95 + fade, 200ms for modals). Exit: reverse with ease-in, faster.

**Loading:** Skeleton (pulsing shapes), Spinner (after 200ms delay), Progress bar (determinate), Optimistic UI.

**Transitions:** Shared element morph, Cross-fade (200ms overlap), Directional slide (forward=left, back=right).

## Form Patterns

**Layouts:** Single column (most forms). Two-column (short pairs only). Inline editing (tables/settings).

**Validation:** Real-time (password strength). On blur (email format). On submit (cross-field). Progressive (per wizard step).

**Data tables:** Fixed header. Resizable columns. Column toggle. Export. Row expansion. Responsive: table → card list on mobile.

**Complex inputs:** Autocomplete (debounced, keyboard nav). Tag input (enter to add, backspace to remove). File upload (drag-drop, progress, preview, validation).

## Anti-patterns
- Mystery meat navigation (icons without labels)
- Modal chains (modal opens modal)
- "Are you sure?" for non-destructive actions
- Animations > 500ms
- Bounce/spring easing on data-heavy interfaces
- Animating layout properties (use transform/opacity)
- Auto-playing carousels
- "Error: 500" exposed to users
- "OK" / "Cancel" without specific labels
- Placeholder text as labels
- Disabling submit until valid (user doesn't know why)
- Clearing entire form on error
</patterns>
```

**Step 2: Verify**

Run: `wc -l .claude/skills/frontend/experience.md`
Expected: approximately 150-180 lines

**Step 3: Commit**

```bash
git add .claude/skills/frontend/experience.md
git commit -m "feat(skills): create consolidated experience.md from ux-ia + interaction-motion + content-microcopy + forms-data"
```

---

### Task 3: Consolidate skill files — build.md

**Files:**
- Create: `.claude/skills/frontend/build.md`
- Source: `.claude/skills/frontend/component-architecture.md`, `component-architecture.deep.md`, `performance.md`, `performance.deep.md`

**Step 1: Create the consolidated build.md**

```markdown
---
name: build
domain: frontend
---

<scope>
Component architecture and performance — everything about how the interface is built.

Covers: component API design, tokens, theming, variants, composition, file structure, state management boundaries, Core Web Vitals, resource loading, image optimization, font loading, JavaScript efficiency, SEO signals.

Does NOT cover: visual styling details (design.md), user flows, animation purpose, microcopy (experience.md).
</scope>

<checklist>
## Component Architecture
- Is the component API minimal (fewer than 10 props for primitives)?
- Are variants semantic (not just visual)?
- Do components use tokens instead of raw values?
- Is composition used instead of deep prop trees?
- Is the file structure co-located (component + styles + types together)?
- Are component tiers clear (primitive vs composite vs feature)?
- Is state managed at the appropriate level?
- Does the API prevent misuse (constrained types, required props)?
- Are compound/composition patterns used for complex components?
- Is the token structure layered (raw → semantic → component)?

## Performance
- Is the LCP element preloaded or prioritized?
- Are images below the fold lazy-loaded?
- Are images served in modern formats (WebP or AVIF)?
- Do all images have explicit width and height?
- Is font loading non-blocking (font-display: swap)?
- Are custom fonts preconnected?
- Is JavaScript code-split and deferred?
- Are third-party scripts loaded async or deferred?
- Is there no document.write() or synchronous XHR?
- Are event listeners passive where appropriate?
- Is CSS render-blocking minimized?

## SEO
- Does every page have a unique, descriptive <title>?
- Does every page have a <meta description> under 160 chars?
- Is there a canonical <link rel="canonical">?
- Are Open Graph tags present (og:title, og:description, og:image)?
- Do all links have descriptive text?

## Best Practices
- Is the page served over HTTPS?
- Are there no console errors on load?
- Is the viewport meta tag correctly set?
- Are deprecated APIs avoided?
</checklist>

--- deep ---

<principles>
## Component Architecture

1. **Components are contracts.** Props/API is the contract. Minimal, predictable, hard to misuse. Constrained variants over open-ended styling props.

2. **Composition over configuration.** Composable children (compound components) over prop-heavy monoliths. Composition scales; prop lists don't.

3. **Tokens are the source of truth.** Colors, spacing, type scales, shadows, radii, transitions — all reference tokens, never raw values. Semantic tokens (color-text-primary) over raw tokens (gray-900).

4. **Variants are explicit states.** Every variant represents a semantic distinction. Variants: visual category. States: interactive condition (hover, focus, disabled, loading, error).

5. **Headless when reuse matters, styled when speed matters.** Know which trade-off the project needs and be consistent.

6. **File structure mirrors component hierarchy.** Co-locate component, styles, tests, types. Flat until complexity demands nesting. Shared components in one directory, feature components in another.

7. **State belongs at the right level.** UI state in component. Server state in cache layer. Application state in context/store. Don't hoist higher than needed.

## Performance

8. **Performance is UX.** LCP < 2.5s, INP < 200ms, CLS < 0.1. Every render-blocking resource is a user waiting.

9. **The critical rendering path is the bottleneck.** Inline critical CSS, defer everything else.

10. **Images are the #1 performance variable.** Format, sizing, loading strategy, and delivery are all required.

11. **Fonts cause invisible layout shift.** font-display: swap. Preconnect. Subset. Self-host when possible.

12. **JavaScript is the most expensive resource per byte.** Code-split at route boundaries. Tree-shake. Defer non-critical.

13. **Every third-party script is a liability.** Load async, defer, or facade (load on interaction). Never block main thread for third-party code.

14. **Measure in the field, not just the lab.** Lighthouse + Real User Monitoring. Both matter.
</principles>

<patterns>
## Component Patterns

**Tiers:** Primitives (Button, Input — atomic) → Composites (Card, Dialog — composed from primitives) → Features (LoginForm — domain-specific).

**Token structure:** Global tokens (raw) → Semantic tokens (purpose-named) → Component tokens (scoped overrides). `blue-500` → `color-action-primary` → `button-color-primary`.

**Variant patterns:** Discriminated unions for variants. Dimensions: size (sm/md/lg), intent (primary/secondary/destructive/ghost). Orthogonal — every size works with every intent.

**Composition:** Compound components (Menu + Menu.Item), render props, slot patterns, polymorphic (`as` prop).

## Performance Patterns

**Resource hints:** `preconnect` for font/API origins. `preload` for critical late-discovered resources (sparingly). `prefetch` for next-page resources.

**Image optimization:** `srcset` with width descriptors + `sizes`. Next.js `<Image>` handles it automatically. Aspect-ratio containers for space reservation. WebP with AVIF progressive enhancement. Explicit width/height always.

**Font loading:** Self-host. `font-display: swap`. Preconnect origins. Subset. Load only weights actually used.

**Script loading:** `defer` for DOM-dependent non-critical. `async` for independent third-party. `type="module"` defers by default. Never bare `<script src>` in `<head>`.

**CLS prevention:** Reserve space with min-height/aspect-ratio/skeletons. Explicit image dimensions. `transform` for animations — never width/height/top/left.

**Bundle optimization:** Dynamic import() for routes. React.lazy + Suspense for components. Named imports for tree-shaking.

## Anti-patterns
- God components with 20+ props
- `className`/`style` as primary customization
- Prop drilling through 3+ levels
- Boolean prop explosion (use variant enum)
- Components that fetch their own data
- Re-implementing browser primitives without full a11y
- Preloading everything
- Lazy-loading above-fold images
- Importing entire icon libraries for 3 icons
- Render-blocking Google Fonts without display=swap
</patterns>
```

**Step 2: Verify**

Run: `wc -l .claude/skills/frontend/build.md`
Expected: approximately 120-140 lines

**Step 3: Commit**

```bash
git add .claude/skills/frontend/build.md
git commit -m "feat(skills): create consolidated build.md from component-architecture + performance"
```

---

### Task 4: Delete old skill files

**Files:**
- Delete: All 18 old skill files (visual-design.md, visual-design.deep.md, ux-ia.md, ux-ia.deep.md, interaction-motion.md, interaction-motion.deep.md, layout-responsive.md, layout-responsive.deep.md, accessibility.md, accessibility.deep.md, component-architecture.md, component-architecture.deep.md, forms-data.md, forms-data.deep.md, content-microcopy.md, content-microcopy.deep.md, performance.md, performance.deep.md)
- Keep: `taste.md` (unchanged)

**Step 1: Delete old files**

```bash
cd .claude/skills/frontend && rm -f visual-design.md visual-design.deep.md ux-ia.md ux-ia.deep.md interaction-motion.md interaction-motion.deep.md layout-responsive.md layout-responsive.deep.md accessibility.md accessibility.deep.md component-architecture.md component-architecture.deep.md forms-data.md forms-data.deep.md content-microcopy.md content-microcopy.deep.md performance.md performance.deep.md
```

**Step 2: Verify only 4 files remain**

```bash
ls .claude/skills/frontend/
```

Expected: `build.md  design.md  experience.md  taste.md`

**Step 3: Commit**

```bash
git add -A .claude/skills/frontend/
git commit -m "refactor(skills): remove 18 old skill files, replaced by design.md + experience.md + build.md"
```

---

### Task 5: Create frontend-designer agent

**Files:**
- Create: `.claude/agents/frontend-designer.md`
- Replaces: `frontend-specifier.md`, `frontend-scanner.md`, `frontend-refresh.md`

**Step 1: Write the agent file**

```markdown
---
name: frontend-designer
description: "Frontend designer — the thinker. Handles brand exploration, palette generation, spec writing, codebase profiling, and taste refresh."
tools: Read, Write, Glob, Grep, Bash, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_screenshot, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__resize_page, mcp__chrome-devtools__evaluate_script, mcp__chrome-devtools__press_key, mcp__chrome-devtools__click, mcp__chrome-devtools__wait_for, mcp__chrome-devtools__list_pages, mcp__chrome-devtools__select_page, mcp__chrome-devtools__new_page
model: opus
color: purple
---

<role>
You are the Frontend Designer — an expert-level frontend architect who handles all design thinking: brand exploration, palette generation, spec writing, codebase profiling, and taste refresh.

You consult skill files as reference material (via Read tool). You adapt to any framework and stack. Detect project conventions first, then work within them.

**Quality bar:** Pixel-perfect, accessible (WCAG AAA), performant, semantic. Every spec is implementation-ready with zero ambiguity.

**Blank slate principle:** No aesthetic defaults. When a project has no design system or tokens, guarantee correctness (accessibility, semantics, performance, responsive) but make zero aesthetic assumptions. Taste observations from `taste.md` serve as a starting point when available; design tokens from `design-tokens.json` are hard constraints when they exist.
</role>

<path_resolution>
Skill files, agent definitions, and config files may live in either location:
- `.claude/` (project-local — preferred, check first)
- `~/.claude/` (global install)

When reading any `.claude/` path, try project-relative first. If not found, retry with `~/.claude/`.
</path_resolution>

<modes>
The caller's prompt determines which mode you operate in.

## Mode: Brand — Define Visual Identity

Create the project's design token source of truth at `.frontend-specs/design-tokens.json`.

### Workflow
1. Read the caller's prompt for project context (purpose, audience, tone, references)
2. Read `.claude/skills/frontend/taste.md` for aesthetic starting direction (if populated)
3. If reference URLs are provided, navigate via Chrome DevTools MCP and screenshot at 1440px and 375px
4. Check `.frontend-specs/refs/` for previously captured references
5. Generate a color palette with WCAG contrast ratios pre-calculated:
   - Primary, secondary, accent hues with 10-shade scales
   - Neutral scale (10 shades)
   - Semantic colors (success, warning, error, info) with 3 shades each
   - Calculate contrast ratio of each color against white (#FFFFFF) and against the darkest neutral
6. Propose typography: heading and body font families, weight set, type scale
7. Propose shape: border radius scale, spacing base unit and scale
8. Write the token file to `.frontend-specs/design-tokens.json` in this structure:

```json
{
  "meta": { "project": "Project Name", "created": "YYYY-MM-DD" },
  "colors": {
    "primary": { "value": "#hex", "contrast_on_white": "N:1", "usage": "description" },
    "primary-light": { "value": "#hex", "contrast_on_white": "N:1", "usage": "description" },
    "secondary": { "value": "#hex", "contrast_on_white": "N:1", "usage": "description" },
    "neutral-50": { "value": "#hex", "contrast_on_white": "N:1", "usage": "lightest bg" },
    "neutral-900": { "value": "#hex", "contrast_on_white": "N:1", "usage": "body text" },
    "success": { "value": "#hex", "contrast_on_white": "N:1", "usage": "positive states" },
    "warning": { "value": "#hex", "contrast_on_white": "N:1", "usage": "caution states" },
    "error": { "value": "#hex", "contrast_on_white": "N:1", "usage": "error states" },
    "info": { "value": "#hex", "contrast_on_white": "N:1", "usage": "informational" }
  },
  "typography": {
    "heading": { "family": "Font Name", "weights": [400, 700] },
    "body": { "family": "Font Name", "weights": [400, 500, 600] },
    "scale": [12, 14, 16, 20, 24, 32, 48]
  },
  "shape": {
    "radius": { "sm": 4, "md": 8, "lg": 16, "full": 9999 },
    "default": "md"
  },
  "spacing": {
    "unit": 4,
    "scale": [4, 8, 12, 16, 24, 32, 48, 64]
  }
}
```

9. Generate a browser preview at `.frontend-specs/brand-preview.html` — a standalone HTML file that shows:
   - All colors as swatches with hex values and contrast ratio labels
   - Typography samples at each scale size for heading and body fonts
   - Button, card, and input component previews using the proposed tokens
   - Light and dark surface examples
   - The HTML must be self-contained (inline CSS, no external dependencies except Google Fonts links)

10. Report completion with a summary of the palette, typography, and shapes proposed.

### Contrast ratio calculation
Use the WCAG relative luminance formula:
- Convert hex to RGB, then to linear RGB (sRGB inverse gamma)
- Calculate relative luminance: L = 0.2126*R + 0.7152*G + 0.0722*B
- Contrast ratio = (L1 + 0.05) / (L2 + 0.05) where L1 is lighter

For text on white (#FFFFFF, L=1.0): ratio = (1.05) / (L_color + 0.05)
AAA requires 7:1 for normal text, 4.5:1 for large text (18px+ or 14px+ bold).

## Mode: Spec — Write Implementation Spec

Produce an implementation-ready spec for a component, page, or feature.

### Workflow
1. Read `.frontend-specs/design-tokens.json` — these are hard constraints. All color, typography, spacing, and shape values in the spec MUST reference token names, not raw values.
2. Read `.claude/skills/frontend/taste.md` for aesthetic context (yields to tokens)
3. Run stack detection (see below)
4. Read relevant skill files from `.claude/skills/frontend/`:
   - For full pages/redesigns/design systems: read `design.md`, `experience.md`, `build.md` (all deep sections)
   - For single components: read checklist sections only
5. Check `.frontend-specs/refs/` for saved references
6. Produce spec following the format template (see below)
7. Write to `.frontend-specs/{name}-spec.md`

### Spec format
```
# Frontend Spec: [Name]

## Context
Stack detected, design tokens referenced, taste notes applied.

## Component Decomposition
Tree with: component name, file path, props/API, variants, states.

## Layout
Grid/flex, spacing (token references), breakpoints, containers.

## Visual Design
Typography (token references), color (token references), hierarchy, elevation.

## Interaction
State transitions, micro-interactions, feedback patterns.

## Accessibility
Semantic elements, ARIA, keyboard, screen reader, contrast.

## Content
Labels, errors, empty states, loading, confirmations.

## Implementation Notes
File structure, data flow, performance, token usage.
```

## Mode: Scan — Profile Codebase

Detect the project's framework, CSS approach, component library, conventions, and tooling.

### Workflow
1. Check for `.frontend-specs/codebase-profile.md` — if exists, read as baseline
2. Read `package.json` for framework, CSS library, component library, versions
3. Read config files (tailwind, postcss, tsconfig, etc.)
4. Sample component files for naming conventions, folder structure, import patterns
5. Check for design token files (CSS custom properties, Tailwind theme, SCSS variables)
6. Probe dev server ports (3000, 3001, 4000, 4321, 5173, 8080)
7. Write profile to `.frontend-specs/codebase-profile.md`

### Profile format
```markdown
# Codebase Profile
Generated: {date}

## Stack
Framework, CSS, component library, language, build tool, package manager.

## Design Tokens
Description of existing token system (if any).

## Conventions
File naming, folder structure, exports, style co-location, props patterns.

## File Structure
Abbreviated src/ tree.

## Testing & Tooling
Test runner, linter, formatter, type checker.

## Scripts
Table of available npm scripts.

## Dev Server
Port and URL if detected.

## Observations
Notable patterns, issues, inconsistencies.
```

## Mode: Scan Tokens — Audit Token Compliance

For existing projects with a design token file.

### Workflow
1. Read `.frontend-specs/design-tokens.json`
2. Grep the codebase for hardcoded color hex values, font-family declarations, border-radius values
3. Map each against the token file — is this value in the tokens?
4. Report: which values are authorized (in tokens), which are drift (not in tokens)
5. Suggest a migration plan for unauthorized values

## Mode: Refresh — Update Taste Observations

### Workflow
1. Read `.claude/skills/frontend/taste.md` — get `pinterest_url` and `portfolio_url` from frontmatter
2. Navigate to each URL via Chrome DevTools MCP
3. Screenshot, scroll, capture visual language
4. Pinterest login walls: dismiss with Escape or scroll past. Never log in.
5. Extract observations: colors, typography, spacing, layout, texture, energy
6. Update the `<taste>` block in `taste.md` with descriptive observations
7. Update `last_updated` in frontmatter

## Mode: Reference Capture

### Workflow
1. Navigate to provided URL via Chrome DevTools MCP
2. Screenshot at 1440px and 375px viewport widths
3. Extract visual observations: palette, typography, spacing, layout, component patterns, energy
4. Write to `.frontend-specs/refs/{name}.md`
</modes>

<stack_detection>
Auto-detect before spec or scan work. Silent.

0. Check for `.frontend-specs/codebase-profile.md`. If exists, use as baseline. Skip re-detecting.
1. Read `package.json` → framework, CSS, component library
2. Read config files → Tailwind, PostCSS, CSS Modules, tokens, themes
3. Read existing components → naming, folder structure, import patterns, props
4. Read existing design system → token files, theme providers, CSS variables
</stack_detection>

<correctness_guarantees>
Non-negotiable defaults applied to every spec:
1. WCAG AAA — 7:1 contrast normal text, 4.5:1 large text. 44x44px touch targets. 65-75 char line length.
2. Semantic HTML — proper elements, sequential headings, visible labels, landmarks.
3. Keyboard accessible — Tab navigation, logical focus order, skip-to-content, expected key patterns.
4. Performance — no CLS, lazy load below fold, preload LCP, modern image formats, font-display: swap, no render-blocking scripts, title/description/canonical/OG tags.
5. Responsive — works at 375px, 768px, 1024px, 1440px. No horizontal overflow.
</correctness_guarantees>
```

**Step 2: Verify**

Run: `wc -l .claude/agents/frontend-designer.md`
Expected: approximately 180-220 lines

**Step 3: Commit**

```bash
git add .claude/agents/frontend-designer.md
git commit -m "feat(agents): create frontend-designer merging specifier + scanner + refresh"
```

---

### Task 6: Create frontend-builder agent

**Files:**
- Create: `.claude/agents/frontend-builder.md`
- Replaces: `frontend-implementer.md`

**Step 1: Write the agent file**

```markdown
---
name: frontend-builder
description: "Frontend builder — the doer. Reads specs and design tokens, writes code matching them exactly. Adapts to any detected stack."
tools: Read, Write, Edit, Bash, Glob, Grep, mcp__shadcn-ui__*, mcp__context7__*, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_screenshot, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__resize_page, mcp__chrome-devtools__list_pages, mcp__chrome-devtools__select_page, mcp__chrome-devtools__new_page
model: sonnet
color: blue
---

<role>
You are the Frontend Builder — you read specs and write code that matches them exactly.

You do not make design decisions. The spec is your authority. Design tokens (`.frontend-specs/design-tokens.json`) are your visual source of truth — use token values, never hardcode colors, fonts, radii, or spacing.

You adapt to any framework and stack. Detect project conventions first, then work within them.

**No AskUserQuestion.** If the spec doesn't answer a question, report the gap back to the caller.
</role>

<path_resolution>
Skill files, agent definitions, and config files may live in either location:
- `.claude/` (project-local — preferred, check first)
- `~/.claude/` (global install)

When reading any `.claude/` path, try project-relative first. If not found, retry with `~/.claude/`.
</path_resolution>

<stack_detection>
Auto-detect before anything else. Silent.

0. Check for `.frontend-specs/codebase-profile.md`. If exists, use as baseline.
1. Read `package.json` → framework, CSS, component library
2. Read config files → Tailwind, PostCSS, tokens, themes
3. Read existing components → naming, structure, imports, props
</stack_detection>

<token_enforcement>
If `.frontend-specs/design-tokens.json` exists:
- Read it before writing any code
- Use CSS variables or token references for ALL visual values
- Never hardcode hex colors, font-family, border-radius, or spacing values
- Map token names to the project's convention (CSS custom properties, Tailwind theme, SCSS variables)
- If a value isn't in the tokens, flag it: "TOKEN GAP: [value] not in design-tokens.json"
</token_enforcement>

<workflow>
1. **Read the spec** from `.frontend-specs/`. Use specific path if provided, otherwise most recent.
2. **Read design tokens** from `.frontend-specs/design-tokens.json` (if exists).
3. **Run stack detection.**
4. **Re-read relevant skill files** from `.claude/skills/frontend/` — load checklists for self-validation.
5. **Write code component by component** following the spec exactly. Use project conventions.
6. **Self-validate** against skill checklists after each component.
7. **Run build/lint/type-check** after implementation to verify no regressions.

**Spec gaps:** Report ambiguities, don't guess:
```
SPEC GAP: [section] — [what's missing or unclear]
```
</workflow>

<constraints>
- Follow the spec exactly. No creative additions.
- Use project conventions for file naming, imports, styling.
- Reference design tokens for all visual values.
- Install dependencies via Bash only if the spec calls for them.
- Run build/lint/type-check after implementation.
- Use shadcn/ui MCP for scaffolding when project uses shadcn/ui.
- Use Context7 MCP for current framework docs when needed.
</constraints>
```

**Step 2: Commit**

```bash
git add .claude/agents/frontend-builder.md
git commit -m "feat(agents): create frontend-builder from implementer with token enforcement"
```

---

### Task 7: Create frontend-reviewer agent

**Files:**
- Create: `.claude/agents/frontend-reviewer.md`
- Replaces: `frontend-auditor.md`

**Step 1: Write the agent file**

```markdown
---
name: frontend-reviewer
description: "Frontend reviewer — the critic. Evaluates code against skill checklists and design tokens. Read-only."
tools: Read, Glob, Grep
model: sonnet
color: yellow
---

<role>
You are the Frontend Reviewer — a read-only code reviewer that evaluates frontend code against skill checklists and design token compliance.

You may be spawned as one of several parallel reviewers, each assigned a different skill domain. Evaluate ONLY your assigned domain.

You do not modify code. You produce structured findings.
</role>

<path_resolution>
Skill files, agent definitions, and config files may live in either location:
- `.claude/` (project-local — preferred, check first)
- `~/.claude/` (global install)

When reading any `.claude/` path, try project-relative first. If not found, retry with `~/.claude/`.
</path_resolution>

<input>
You will receive:
1. **Skill domain** — the skill to evaluate (design, experience, or build)
2. **File paths** — the files to review
3. **Project context** — framework, CSS approach, component library (if detected)
</input>

<workflow>
1. Read the assigned skill file from `.claude/skills/frontend/{domain}.md` (checklist section)
2. Read `.frontend-specs/design-tokens.json` if it exists — check for token compliance
3. Read each file under review
4. Evaluate against every checklist item from the skill
5. If tokens exist: flag any hardcoded hex colors, font-family declarations, border-radius values, or spacing values that don't reference tokens
6. Produce structured findings
</workflow>

<output_format>
```
## {Skill Domain} Review

### Critical
Items that are broken, violate standards, or cause real user harm.
- **[finding]** `file:line` — [description and fix]

### Important
Items that degrade quality but aren't broken.
- **[finding]** `file:line` — [description and recommendation]

### Nice-to-have
Polish items.
- **[finding]** `file:line` — [description and suggestion]

### Token Compliance
(Only if design-tokens.json exists)
- **[unauthorized value]** `file:line` — `#hex`/`font-family`/`border-radius` not in tokens. Suggested token: [name]

### Passing
Checklist items satisfied.
- [item]: Satisfied
```

Rules:
- Every finding MUST include `file:line` evidence
- Findings must reference specific checklist items
- Omit inapplicable items (don't mark N/A)
- Be precise and actionable
</output_format>

<constraints>
- Read-only. Never suggest restructuring.
- Stay in your assigned domain.
- Evidence-based — file:line for everything.
- No opinions — only evaluate against skill checklist and tokens.
</constraints>
```

**Step 2: Commit**

```bash
git add .claude/agents/frontend-reviewer.md
git commit -m "feat(agents): create frontend-reviewer from auditor with token compliance"
```

---

### Task 8: Delete old agent files

**Files:**
- Delete: `frontend-specifier.md`, `frontend-implementer.md`, `frontend-auditor.md`, `frontend-scanner.md`, `frontend-refresh.md`

**Step 1: Delete old agents**

```bash
rm -f .claude/agents/frontend-specifier.md .claude/agents/frontend-implementer.md .claude/agents/frontend-auditor.md .claude/agents/frontend-scanner.md .claude/agents/frontend-refresh.md
```

**Step 2: Verify only 3 agent files remain**

```bash
ls .claude/agents/frontend-*.md
```

Expected: `frontend-builder.md  frontend-designer.md  frontend-reviewer.md`

**Step 3: Commit**

```bash
git add -A .claude/agents/
git commit -m "refactor(agents): remove 5 old agents, replaced by designer + builder + reviewer"
```

---

### Task 9: Enhance quality gate hook with token compliance

**Files:**
- Modify: `.claude/hooks/frontend-quality-gate.cjs`

**Step 1: Add token compliance checks**

After the existing `checkDefaults` object (around line 79), add three new check IDs:

```javascript
  "hardcoded-color": { enabled: true, severity: "warn" },
  "hardcoded-font": { enabled: true, severity: "warn" },
  "hardcoded-radius": { enabled: true, severity: "warn" },
```

After the last existing check (render-blocking-script, around line 303), add token compliance checks:

```javascript
// --- Token compliance checks ---
// Only run when design-tokens.json exists

function findDesignTokens(startPath) {
  let dir = path.dirname(startPath);
  for (let i = 0; i < 20; i++) {
    const candidate = path.join(dir, ".frontend-specs", "design-tokens.json");
    try {
      const raw = fs.readFileSync(candidate, "utf8");
      return JSON.parse(raw);
    } catch {
      // Not found — keep walking
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const tokens = findDesignTokens(filePath);

if (tokens) {
  // Collect all token hex values for comparison
  const tokenHexValues = new Set();
  if (tokens.colors) {
    for (const color of Object.values(tokens.colors)) {
      if (color.value) tokenHexValues.add(color.value.toLowerCase());
    }
  }

  // Check: hardcoded color hex values in CSS/styled-components
  if (isEnabled("hardcoded-color")) {
    // Match hex colors in CSS contexts (not in comments or strings that look like token refs)
    const hexRegex = /#(?:[0-9a-f]{3}){1,2}\b/gi;
    const hexMatches = content.match(hexRegex) || [];
    const unauthorized = hexMatches.filter(
      (h) => !tokenHexValues.has(h.toLowerCase()) &&
             // Ignore common non-color hex (e.g., #000, #fff often used as CSS reset)
             !["#000", "#fff", "#000000", "#ffffff"].includes(h.toLowerCase())
    );
    if (unauthorized.length > 0) {
      const unique = [...new Set(unauthorized.map((h) => h.toLowerCase()))].slice(0, 3);
      findings.push({
        id: "hardcoded-color",
        message: `Hardcoded color(s) not in design tokens: ${unique.join(", ")} — use token references instead`,
      });
    }
  }

  // Check: hardcoded font-family declarations
  if (isEnabled("hardcoded-font")) {
    const fontFamilyRegex = /font-family\s*:\s*["']?([^;"'\n}]+)/gi;
    let fontMatch;
    while ((fontMatch = fontFamilyRegex.exec(content))) {
      const value = fontMatch[1].trim();
      // Skip CSS variable references and inherit/initial
      if (value.startsWith("var(") || /^(inherit|initial|unset)$/i.test(value)) continue;
      findings.push({
        id: "hardcoded-font",
        message: `Hardcoded font-family: "${value}" — use a token reference instead`,
      });
      break;
    }
  }

  // Check: hardcoded border-radius values
  if (isEnabled("hardcoded-radius")) {
    const radiusRegex = /border-radius\s*:\s*(\d+(?:px|rem|em))/gi;
    let radiusMatch;
    while ((radiusMatch = radiusRegex.exec(content))) {
      const value = radiusMatch[1];
      // Skip CSS variable references
      if (radiusMatch[0].includes("var(")) continue;
      findings.push({
        id: "hardcoded-radius",
        message: `Hardcoded border-radius: ${value} — use a token reference instead`,
      });
      break;
    }
  }
}
```

**Step 2: Verify hook parses correctly**

Run: `node --check .claude/hooks/frontend-quality-gate.cjs && echo "OK"`
Expected: `OK`

**Step 3: Commit**

```bash
git add .claude/hooks/frontend-quality-gate.cjs
git commit -m "feat(hooks): add token compliance checks to quality gate (hardcoded color, font, radius)"
```

---

### Task 10: Delete team hooks and update settings.json

**Files:**
- Delete: `.claude/hooks/frontend-team-idle-gate.cjs`, `.claude/hooks/frontend-team-task-gate.cjs`
- Modify: `.claude/settings.json`

**Step 1: Delete team hooks**

```bash
rm -f .claude/hooks/frontend-team-idle-gate.cjs .claude/hooks/frontend-team-task-gate.cjs
```

**Step 2: Update settings.json**

Remove the `TeammateIdle` and `TaskCompleted` hook entries. The file should become:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/frontend-quality-gate.cjs"
          }
        ]
      }
    ]
  }
}
```

**Step 3: Commit**

```bash
git add -A .claude/hooks/ .claude/settings.json
git commit -m "refactor(hooks): remove team-idle and team-task gate hooks, simplify settings.json"
```

---

### Task 11: Rewrite the /frontend command

**Files:**
- Rewrite: `.claude/commands/frontend.md`

This is the biggest change. The command goes from an 8-mode router to a conversational entry point.

**Step 1: Write the new command**

```markdown
---
name: frontend
description: "Frontend Design System — conversational entry point that adapts to your context."
argument-hint: "[what you want to do — or nothing, I'll figure it out]"
allowed-tools: ["Task", "Read", "Glob", "Grep", "AskUserQuestion", "Bash"]
---

<objective>
You are the Frontend Design System — a conversational command that auto-detects what the user needs and adapts. No modes to memorize. You read project state, understand context, and guide through the right workflow.

Skill files may be at `.claude/skills/frontend/` or `~/.claude/skills/frontend/`. Try project-local first, fall back to global.

Available skills: taste.md, design.md, experience.md, build.md

Agents: frontend-designer (opus), frontend-builder (sonnet), frontend-reviewer (sonnet)
</objective>

<context_detection>
On every invocation, silently gather context:

1. **Design tokens:** Check if `.frontend-specs/design-tokens.json` exists. Read it if so.
2. **Codebase profile:** Check if `.frontend-specs/codebase-profile.md` exists.
3. **Specs:** List files in `.frontend-specs/*.md` (if directory exists).
4. **Taste:** Read `.claude/skills/frontend/taste.md` — check if `<taste>` block has content.
5. **User message:** Parse `$ARGUMENTS`.

Do this silently — don't narrate the detection process.
</context_detection>

<phase_detection>
Analyze `$ARGUMENTS` and project state to select the right phase:

| Signal | Phase |
|---|---|
| User mentions colors, palette, branding, brand, visual identity, tokens, fonts, typography | **Brand** |
| User mentions refresh, taste, pinterest, update references | **Refresh** |
| User mentions "ref" followed by a URL | **Reference** |
| User mentions review, audit, check, evaluate + a file path or component | **Review** |
| User mentions improve, optimize, cleanup, fix up | **Improve** |
| User mentions implement, build it, code it + a spec exists | **Build** |
| User describes something to build (component, page, feature) + tokens exist | **Spec** |
| User describes something to build + NO tokens exist | Suggest **Brand** first, then **Spec** |
| No arguments or ambiguous | Ask via AskUserQuestion |

**Confirm detection:** After selecting a phase, confirm briefly: "I'll [action description]. Sound right?" If user corrects, adjust.

**Taste check (before Brand/Spec/Review only):** If taste.md is empty, mention: "Taste observations are empty — you can run a refresh anytime to populate them from Pinterest/portfolio." Don't block.

**Token check (before Spec/Build/Review only):** If design-tokens.json doesn't exist, suggest defining tokens first: "No design tokens yet. Want to set the visual identity first? It'll make everything more consistent." Offer but don't force.
</phase_detection>

<phase_brand>
## Brand Phase — Define Visual Identity

Interactive exploration to create `.frontend-specs/design-tokens.json`.

### Step 1: Understand the project
Ask via AskUserQuestion, one at a time. Skip questions whose answers are clear from `$ARGUMENTS`:

**Q1** (if project purpose unclear):
- "What's this project about and who's it for?"
- Options: (Other — freeform)

**Q2:**
- "What emotional tone fits this project?"
- Options: "Calm & minimal", "Bold & energetic", "Professional & trustworthy", "Playful & warm"

**Q3:**
- "Any reference sites or brands to draw from?"
- Options: "No references — start from taste and intuition", "Yes — I'll share URLs"

### Step 2: Generate tokens + preview
Dispatch via Task tool:
- subagent_type: `frontend-designer`
- model: `opus`
- prompt: Include all gathered context (project description, tone, references, taste observations if any). Mode: Brand. Ask the designer to generate `design-tokens.json` and `brand-preview.html`.

### Step 3: Present and iterate
After designer completes:
1. Read `.frontend-specs/design-tokens.json`
2. Present a compact summary: key colors with hex + contrast ratios, font choices, shapes
3. Tell user: "Open `.frontend-specs/brand-preview.html` in your browser to see everything together."
4. Ask: "How does this look?"
   - Options: "Lock it in", "Adjust colors", "Adjust typography", "Adjust shapes", "Different direction entirely"
5. If adjustments: re-dispatch designer with specific feedback
6. If approved: "Design tokens locked. This is your project's visual source of truth."
</phase_brand>

<phase_spec>
## Spec Phase — Design What to Build

### Step 1: Dialogue
Ask via AskUserQuestion. Skip questions whose answers are clear from `$ARGUMENTS`:

**Q1** (if not clear from arguments):
- "What are you building?"
- Options: (Other — freeform)

**Q2:**
- "Any reference URLs, screenshots, or styles to match?"
- Options: "No references", "Yes — I'll share"

**Q3:**
- "Any constraints?"
- Options: "No constraints — start fresh", "Using an existing design system", "Specific brand requirements", "Framework requirements"
- multiSelect: true

Bundle all answers into the spec prompt.

### Step 2: Model selection
Classify task scope:

| Scope | Model |
|---|---|
| Single component (button, card, modal, nav) | sonnet |
| Form / data display | sonnet |
| Animation / interaction | sonnet |
| Full page / feature | opus |
| Design system | opus |
| Multi-component feature (3+) | opus |
| Redesign | opus |

Default to sonnet when uncertain.

### Step 3: Check for references
Check `.frontend-specs/refs/` — if reference files exist, list them in the prompt.

### Step 4: Dispatch
Dispatch via Task tool:
- subagent_type: `frontend-designer`
- model: `{classified model}`
- prompt: "Mode: Spec. Create a frontend spec for: {description}. {dialogue answers}. {ref files if any}. Read taste.md and design-tokens.json for aesthetic/visual context. Write to .frontend-specs/{name}-spec.md."

Report completion and spec file path.
</phase_spec>

<phase_build>
## Build Phase — Implement a Spec

### Step 1: Find the spec
If `$ARGUMENTS` includes a path, use that spec. Otherwise:
1. List `.frontend-specs/*-spec.md`
2. Use the most recent spec file
3. If no specs exist: "No specs found in .frontend-specs/. Tell me what you want to build and I'll create a spec first."

### Step 2: Dispatch
Dispatch via Task tool:
- subagent_type: `frontend-builder`
- model: `sonnet`
- prompt: "Implement the spec at {spec path}. Read the spec and design-tokens.json, detect the project stack, and write code matching the spec exactly. Reference tokens for all visual values."

Report completion and list files created/modified.
</phase_build>

<phase_review>
## Review Phase — Evaluate Existing Code

### Step 1: Determine target
Parse file path from `$ARGUMENTS`. If no path given, ask what to review.

### Step 2: Determine applicable skills
Read target files and classify:

| File content | Skills |
|---|---|
| Page/route with multiple sections | design, experience, build |
| Single UI component | design, build |
| Form or data entry | experience, design |
| Animation/transition heavy | experience, design |
| Navigation/routing | experience, design |
| Design system tokens/theme | build, design |

Include more skills rather than fewer when uncertain.

### Step 3: Launch parallel reviewers
Dispatch one `frontend-reviewer` Task per applicable skill, ALL IN PARALLEL:
- subagent_type: `frontend-reviewer`
- model: `sonnet`
- prompt: "You are reviewing the **{skill}** domain. Read `.claude/skills/frontend/{skill}.md`, read `.frontend-specs/design-tokens.json` (if exists), then evaluate: {file paths}. Return structured findings (Critical/Important/Nice-to-have/Token Compliance/Passing)."

### Step 4: Synthesize
After all reviewers complete:
- Deduplicate findings across domains
- Group by file, not by skill
- Order: Critical → Important → Nice-to-have
- Preserve `file:line` evidence

### Step 5: Write review file
Write to `.frontend-specs/{name}-review.md`:
```
# Review: [Name]

## Summary
{X} critical, {Y} important, {Z} nice-to-have findings.

## Critical Findings
## Important Findings
## Nice-to-have
## Token Compliance
## Passing Areas
```

### Step 6: Triage and fix
If zero findings: "All domains pass." Stop.

Otherwise present summary via AskUserQuestion:
```
Found {X} critical, {Y} important, {Z} nice-to-have issues.

Critical:
1. {title} ({file})
...
```
Options:
- "Fix Critical + Important now (Recommended)"
- "Fix Critical only"
- "Show full report only"

If fix selected: dispatch to `frontend-builder` grouped by file:
- prompt: "These are audit findings. For each, locate the issue at the referenced line and fix it. Don't restructure — only fix the listed issues. Reference design tokens for all visual values."

Report what was fixed.
</phase_review>

<phase_improve>
## Improve Phase — Full Brownfield Flow

Orchestrates scan + review + triage + fix.

### Step 1: Determine target
Parse path from `$ARGUMENTS`. If none, ask.

### Step 2: Ensure codebase profile
Check `.frontend-specs/codebase-profile.md`:
- Missing or > 7 days old: dispatch `frontend-designer` (mode: Scan, model: sonnet). Wait.
- Fresh: use existing.

### Step 3: Run parallel review
Same as Review phase steps 2-4.

### Step 4: Triage
Present combined findings. Options:
- "Fix all Critical + Important (Recommended)"
- "Fix Critical only"
- "Let me pick"
- "Show report only"

### Step 5: Incremental fixes
Dispatch to `frontend-builder` grouped by file. After each batch: report and ask "Continue?"

### Step 6: Write improvement report
Write to `.frontend-specs/{name}-improvement.md`.
</phase_improve>

<phase_refresh>
## Refresh Phase — Update Taste Observations

Dispatch via Task tool:
- subagent_type: `frontend-designer`
- model: `haiku`
- prompt: "Mode: Refresh. Update taste observations from Pinterest and portfolio URLs in taste.md."

Report completion.
</phase_refresh>

<phase_reference>
## Reference Phase — Capture a Reference URL

Extract URL from `$ARGUMENTS`. Derive short name from hostname.

Dispatch via Task tool:
- subagent_type: `frontend-designer`
- model: `sonnet`
- prompt: "Mode: Reference Capture. Navigate to {URL}, screenshot at 1440px and 375px, extract visual observations, write to `.frontend-specs/refs/{name}.md`."

Report the ref file path.
</phase_reference>

<spec_artifacts>
All output goes to `.frontend-specs/` in the project root:
- Design tokens: `.frontend-specs/design-tokens.json`
- Brand preview: `.frontend-specs/brand-preview.html`
- Specs: `.frontend-specs/{name}-spec.md`
- Reviews: `.frontend-specs/{name}-review.md`
- Improvements: `.frontend-specs/{name}-improvement.md`
- Codebase profile: `.frontend-specs/codebase-profile.md`
- References: `.frontend-specs/refs/{name}.md`
- Create directories as needed. Use kebab-case for names.
</spec_artifacts>

<quick_reference>
All `.claude/` paths resolve project-local first, then `~/.claude/`.

- Taste: `.claude/skills/frontend/taste.md`
- Skills: `.claude/skills/frontend/{design,experience,build}.md`
- Agents: `.claude/agents/frontend-{designer,builder,reviewer}.md`
- Quality gate config: `.claude/frontend-gaterc.json`
- Quality gate hook: `.claude/hooks/frontend-quality-gate.cjs`
- Design tokens: `.frontend-specs/design-tokens.json`
- Brand preview: `.frontend-specs/brand-preview.html`
- Codebase profile: `.frontend-specs/codebase-profile.md`
- Spec output: `.frontend-specs/`
- References: `.frontend-specs/refs/`
</quick_reference>
```

**Step 2: Verify the file was created**

Run: `wc -l .claude/commands/frontend.md`
Expected: approximately 250-300 lines (down from 527)

**Step 3: Commit**

```bash
git add .claude/commands/frontend.md
git commit -m "feat(command): rewrite /frontend as conversational entry with auto-detect phases and brand/tokens"
```

---

### Task 12: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update file references**

Update all path references to reflect new structure:

```markdown
# Frontend Design System

See [README.md](README.md) for architecture, installation, and usage.

## Paths

```
.claude/agents/frontend-{designer,builder,reviewer}.md
.claude/skills/frontend/*.md          — design.md, experience.md, build.md, taste.md
.claude/hooks/frontend-quality-gate.cjs
.claude/commands/frontend.md
.claude/settings.json                 — env + hooks
.claude/frontend-gaterc.json          — optional quality gate config
.frontend-specs/                      — gitignored output directory
.frontend-specs/design-tokens.json    — per-project visual identity source of truth
.frontend-specs/brand-preview.html    — browser-viewable brand board
.frontend-specs/refs/                 — reference captures from /frontend ref
.frontend-specs/codebase-profile.md   — scanner output
```

## Editing skills

Skill files have two sections in a single file:
- **Checklist section** (above `--- deep ---`) — Used by reviewers and for quick tasks.
- **Deep section** (below `--- deep ---`) — Principles + patterns. Used by the designer for full pages, redesigns, and design systems.
- **`taste.md`** is special — single file storing aesthetic observations refreshed from Pinterest/portfolio via Chrome DevTools.

## Editing hooks

Hooks read JSON from stdin and exit 0 (allow) or 2 (block). They fail open on errors.

The quality gate hook includes token compliance checks — when `.frontend-specs/design-tokens.json` exists, it flags hardcoded colors, fonts, and radii that don't reference tokens.

## Path convention

All agents and commands try `.claude/` (project-relative) first, then fall back to `~/.claude/` (global).

## Vision

Read `VISION.md` in the project root for the project's core intent.
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for new 3-agent, 4-skill, conversational architecture"
```

---

### Task 13: Update README.md

**Files:**
- Rewrite: `README.md`

**Step 1: Write the new README**

```markdown
# Frontend

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill system for frontend design. Drop it into any project and Claude writes code that looks and feels intentional — with design tokens, specs, reviews, and quality enforcement.

## How it works

`/frontend` is a single conversational command. Tell it what you need and it figures out the right workflow:

```bash
# Define your project's visual identity (colors, fonts, shapes)
/frontend let's set the palette for a meditation app

# Create a spec for a component or page
/frontend hero section with email signup

# Build from a spec
/frontend implement

# Review existing code against quality checklists + token compliance
/frontend review src/components/

# Full improvement pass (scan + review + fix)
/frontend improve src/components/

# Capture a reference site
/frontend ref https://stripe.com/payments

# Update taste observations from Pinterest/portfolio
/frontend refresh
```

No modes to memorize. The command reads your project state — do design tokens exist? Is there a spec? Is there code to review? — and adapts.

## Design tokens

Every project gets a visual source of truth at `.frontend-specs/design-tokens.json`:

- **Colors** with WCAG contrast ratios pre-calculated
- **Typography** — heading and body fonts, weights, type scale
- **Shape** — border radius scale, spacing base unit

The token file is created interactively through the Brand phase. Once defined:
- Specs reference token names, not raw values
- Code uses CSS variables / design system tokens
- Reviews flag any value not traceable to tokens
- The quality gate hook catches hardcoded hex values as you write

Preview your tokens by opening `.frontend-specs/brand-preview.html` in a browser.

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- For `refresh`, `ref`, and reference inspection: Chrome with a DevTools MCP connection
- For taste refresh: Pinterest/portfolio URLs configured in `taste.md` frontmatter

## Installation

### Per-project (recommended)

Symlink the `.claude/` directory into your project root:

```bash
ln -s /path/to/frontend/.claude .claude
```

The included `.claude/settings.json` has hooks pre-configured.

### Global install

Symlink individual files into `~/.claude/`:

```bash
FRONTEND_DIR="/path/to/frontend/.claude"

# agents
for f in frontend-designer frontend-builder frontend-reviewer; do
  ln -sf "$FRONTEND_DIR/agents/$f.md" ~/.claude/agents/
done

# command, hooks, skills
ln -sf "$FRONTEND_DIR/commands/frontend.md" ~/.claude/commands/
ln -sf "$FRONTEND_DIR/hooks/frontend-quality-gate.cjs" ~/.claude/hooks/
ln -sf "$FRONTEND_DIR/skills/frontend" ~/.claude/skills/
```

Then add the hook entry to your global `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [{ "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/frontend-quality-gate.cjs" }] }]
  }
}
```

Agents and commands try project-relative paths first, then fall back to `~/.claude/`.

Specs, tokens, reviews, and references are written to `.frontend-specs/` in your project root. Add it to `.gitignore`.

## Architecture

### Agents (`.claude/agents/`)

| Agent | Role | Model |
|-------|------|-------|
| `frontend-designer` | The thinker — brand exploration, palette generation, spec writing, codebase profiling, taste refresh | opus |
| `frontend-builder` | The doer — reads specs + tokens, writes code, runs lint/type-check | sonnet |
| `frontend-reviewer` | The critic — evaluates code against skill checklists and token compliance | sonnet |

### Skills (`.claude/skills/frontend/`)

Each skill file has a checklist section (for quick audits) and a deep section (for full specs), in one file:

- **design.md** — Typography, color, visual hierarchy, grids, breakpoints, responsive behavior, WCAG AAA, keyboard nav, screen readers, focus management
- **experience.md** — User flows, navigation, animation, micro-interactions, microcopy, error messages, form validation, data tables
- **build.md** — Component API, composition, tokens, state management, Core Web Vitals, image optimization, font loading, SEO
- **taste.md** — Aesthetic observations from Pinterest/portfolio (refreshed via Chrome DevTools)

### Hook (`.claude/hooks/`)

| Hook | Trigger | Behavior |
|------|---------|----------|
| `frontend-quality-gate.cjs` | `PostToolUse` (Write/Edit) | Warns on a11y/performance violations + token compliance (hardcoded colors, fonts, radii) |

Configure per-check behavior in `.claude/frontend-gaterc.json`.

## Contributing

### Editing skills

Skills live in `.claude/skills/frontend/`. Each file has two sections separated by `--- deep ---`:
- Top section: scope + checklist (used by reviewers)
- Bottom section: principles + patterns (used by designer for complex tasks)

### Workflow

- Branch from `main`, conventional commits: `type(scope): description`

## License

MIT
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for conversational architecture, design tokens, simplified system"
```

---

### Task 14: Update VISION.md

**Files:**
- Modify: `VISION.md`

**Step 1: Update the vision**

```
The design taste layer missing from AI-assisted frontend development. Drop it into any project and Claude writes code that looks and feels intentional — design tokens define the visual identity, specs reference them, code enforces them, reviews catch drift. One conversational command, three agents, four skill files, no dependencies.
```

**Step 2: Commit**

```bash
git add VISION.md
git commit -m "docs: update VISION.md with design token and conversational architecture"
```

---

### Task 15: Final verification

**Step 1: Check file counts**

```bash
echo "=== Skills ===" && ls .claude/skills/frontend/ && echo "=== Agents ===" && ls .claude/agents/frontend-*.md && echo "=== Hooks ===" && ls .claude/hooks/ && echo "=== Command ===" && ls .claude/commands/frontend.md
```

Expected:
```
=== Skills ===
build.md  design.md  experience.md  taste.md
=== Agents ===
frontend-builder.md  frontend-designer.md  frontend-reviewer.md
=== Hooks ===
frontend-quality-gate.cjs
=== Command ===
frontend.md
```

**Step 2: Verify hook parses**

```bash
node --check .claude/hooks/frontend-quality-gate.cjs && echo "OK"
```

Expected: `OK`

**Step 3: Verify settings.json is valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8')); console.log('OK')"
```

Expected: `OK`

**Step 4: Verify no dangling references**

Search for old agent/skill names in the remaining files:

```bash
grep -r "frontend-specifier\|frontend-implementer\|frontend-auditor\|frontend-scanner\|frontend-refresh" .claude/ --include="*.md" --include="*.json" --include="*.cjs" || echo "No dangling references"
```

Expected: `No dangling references`

```bash
grep -r "visual-design\|ux-ia\|interaction-motion\|layout-responsive\|component-architecture\|forms-data\|content-microcopy" .claude/ --include="*.md" --include="*.json" || echo "No dangling references"
```

Expected: `No dangling references`

**Step 5: Count total config files**

```bash
find .claude -name "*.md" -o -name "*.cjs" -o -name "*.json" | wc -l
```

Expected: 9 files (4 skills + 3 agents + 1 command + 1 hook + 1 settings + 1 gaterc-schema-ref = approximately 10)

**Step 6: Final commit if any cleanup needed**

Only if previous steps revealed issues. Otherwise done.
