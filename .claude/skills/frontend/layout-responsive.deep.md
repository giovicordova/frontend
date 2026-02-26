---
name: layout-responsive-deep
domain: frontend
---

<principles>
1. **Content dictates breakpoints, not devices.** Set breakpoints where the layout breaks, not at specific device widths. Common starting points: 640px (small), 768px (medium), 1024px (large), 1280px (xlarge). But always verify by resizing — if content is awkward at 900px, add a breakpoint there.

2. **Mobile-first is structural, not just CSS.** Design the content hierarchy for the smallest viewport first. Wider viewports add columns, expand spacing, and reveal secondary content — they don't restructure the information hierarchy. Every element visible on mobile must have a clear purpose.

3. **Grid for page-level, flex for component-level.** CSS Grid handles two-dimensional page layouts (sidebar + main, card grids, dashboards). Flexbox handles one-dimensional component layouts (nav items, button groups, form rows). Don't force grid into flex problems or vice versa.

4. **Fluid over fixed.** Use relative units (%, rem, vw, clamp()) for widths and font sizes. Set max-widths to prevent content from stretching too wide. `clamp()` enables fluid scaling without breakpoints: `clamp(min, preferred, max)`.

5. **Container queries over media queries where supported.** Components should respond to their container's width, not the viewport. This makes components truly reusable across different layout contexts. Fall back to media queries for page-level layout changes.

6. **Spacing scales with viewport.** Don't use the same 16px padding on mobile and desktop. Scale section spacing, container padding, and gaps proportionally. Clamp or use breakpoint-specific spacing values.

7. **No horizontal scroll, no layout shifts.** Nothing should overflow horizontally at any viewport. Images, tables, and code blocks must be contained. Reserve space for content that loads asynchronously (skeleton, aspect-ratio) to prevent CLS.
</principles>

<patterns>
**Page layouts:** Full-width (marketing), constrained center (content/docs, max-width 1200-1400px), sidebar + main (app/dashboard), multi-column (magazine/news).

**Responsive patterns:**
- Stack → side-by-side (cards, feature sections)
- Sidebar → drawer/overlay (navigation, filters)
- Table → card list (data on mobile)
- Multi-column → single column (content)
- Horizontal nav → hamburger/bottom nav (navigation)

**Grid patterns:** Auto-fill/auto-fit with minmax for card grids. Named grid areas for semantic layouts. Subgrid for aligned nested content.

**Spacing rhythm:** Section spacing > component spacing > element spacing. Each level uses the spacing scale at different magnitudes. Sections: 64-96px desktop, 40-64px mobile. Components: 24-48px. Elements: 8-16px.

**Anti-patterns to avoid:**
- Fixed pixel widths on containers
- Viewport-unit-only font sizes (no minimum floor)
- Hiding critical content on mobile (`display: none` for important info)
- Position: absolute for layout (use for overlays only)
- Negative margins as layout tools
- Magic number breakpoints with no content justification
</patterns>
