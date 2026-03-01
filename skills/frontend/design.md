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
