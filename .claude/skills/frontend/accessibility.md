---
name: accessibility
domain: frontend
---

<scope>
WCAG AAA compliance, keyboard navigation, screen reader support, ARIA patterns, contrast, focus management, motion sensitivity, and reduced-motion preferences.
Does NOT cover: visual design choices (visual-design.md), form-specific validation UX (forms-data.md), layout structure/grid systems (layout-responsive.md), animation timing/easing (interaction-motion.md).
</scope>

<checklist>
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
