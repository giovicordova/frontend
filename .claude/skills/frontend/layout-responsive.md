---
name: layout-responsive
domain: frontend
---

<scope>
Grid systems, flexbox patterns, breakpoint strategy, fluid layouts, container queries, adaptive patterns, and responsive behavior across viewports.
Does NOT cover: visual styling within layout containers (visual-design.md), accessibility of layout (accessibility.md), animation/transition behavior (interaction-motion.md), component API design (component-architecture.md).
</scope>

<checklist>
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
</checklist>
