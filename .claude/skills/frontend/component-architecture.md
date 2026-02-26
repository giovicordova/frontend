---
name: component-architecture
domain: frontend
---

<scope>
Component API design, design tokens, theming systems, variant patterns, file/folder structure, headless vs styled components, composition patterns, and state management boundaries.
Does NOT cover: visual styling details (visual-design.md), specific interaction behavior (interaction-motion.md), layout systems (layout-responsive.md).
</scope>

<checklist>
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
</checklist>
