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
