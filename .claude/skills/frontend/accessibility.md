---
name: accessibility
domain: frontend
---

<scope>
WCAG AAA compliance, keyboard navigation, screen reader support, ARIA patterns, contrast, focus management, motion sensitivity, and reduced-motion preferences.
Does NOT cover: visual design choices (visual-design.md), form-specific validation UX (forms-data.md).
</scope>

<principles>
1. **WCAG AAA is the floor, not the ceiling.** AAA contrast ratios (7:1 normal text, 4.5:1 large text). AAA sizing minimums. This is non-negotiable — accessibility is not a feature toggle.

2. **Semantic HTML first, ARIA second.** Native elements carry implicit roles, states, and keyboard behavior for free. ARIA is a repair tool for when semantics can't express the pattern. If you need ARIA, question whether the HTML structure is wrong first.

3. **Keyboard is a first-class input.** Every interactive element reachable via Tab. Logical focus order matching visual order. No focus traps (except modals with explicit escape). Skip-to-content link on every page. Custom widgets implement expected key patterns (Arrow keys for tabs, Escape to close, Space/Enter to activate).

4. **Color is never the sole indicator.** Every state conveyed by color must also be conveyed by shape, text, icon, or pattern. Error states need more than red — add icons and text. Active states need more than highlight — add underline or weight.

5. **Motion respects user preference.** Honor `prefers-reduced-motion`. Provide alternatives: fade instead of slide, instant instead of animated. Essential motion (progress indicators) can remain but should be subtle. No auto-playing animations without user control.

6. **Screen readers get equivalent information.** Announce dynamic content changes with live regions. Images have meaningful alt text (or empty alt for decorative). Form inputs have visible labels (not just placeholders). Status messages use `role="status"` or `aria-live="polite"`.

7. **Touch targets meet minimum sizing.** 44x44px minimum for touch targets (WCAG 2.5.8 AAA). Adequate spacing between adjacent targets to prevent mis-taps.
</principles>

<patterns>
**Landmarks:** header/nav/main/aside/footer — one main per page, labeled nav regions if multiple.

**Headings:** Single h1 per page. Sequential hierarchy (no skipping h2 to h4). Headings describe section content, not visual styling.

**Focus management:** After route change, focus moves to main content or page title. After modal open, focus moves to modal. After modal close, focus returns to trigger. After inline content insertion, focus moves to new content or announcement made.

**Announcements:** Toast/snackbar messages use `aria-live="polite"`. Error summaries use `aria-live="assertive"`. Loading states announce start and completion. Dynamic list updates announce count changes.

**Anti-patterns to avoid:**
- `tabindex` values > 0 (breaks natural order)
- `role="presentation"` on semantic elements
- Click handlers on non-interactive elements without role and keyboard support
- `outline: none` without visible focus replacement
- `aria-label` that duplicates visible text
- Infinite scroll without pagination alternative
</patterns>

<checklist>
- Does the spec define heading hierarchy (h1-h6)?
- Are all interactive elements keyboard accessible?
- Is focus management defined for dynamic content (modals, route changes, insertions)?
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
