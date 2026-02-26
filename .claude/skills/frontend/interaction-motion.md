---
name: interaction-motion
domain: frontend
---

<scope>
Micro-interactions, animation principles, state transitions, gesture handling, loading/skeleton patterns, and feedback animations.
Does NOT cover: layout transition animations (layout-responsive.md), motion accessibility/reduced-motion (accessibility.md — see its `prefers-reduced-motion` principle), general UX flow design (ux-ia.md), component API design (component-architecture.md).
</scope>

<checklist>
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
</checklist>
