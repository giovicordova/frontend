---
name: component-architecture-deep
domain: frontend
---

<principles>
1. **Components are contracts.** The props/API is the contract between the component author and consumer. Props should be minimal, predictable, and hard to misuse. Prefer constrained variants (size: "sm" | "md" | "lg") over open-ended styling props (style, className passthrough). Every prop must have a clear purpose.

2. **Composition over configuration.** Prefer composable children (compound components) over prop-heavy monoliths. A `<Dialog>` with `<Dialog.Header>`, `<Dialog.Body>`, `<Dialog.Footer>` is more flexible than a Dialog with `title`, `body`, `footer`, `footerActions` props. Composition scales; prop lists don't.

3. **Tokens are the source of truth.** Colors, spacing, type scales, shadows, radii, transitions — all reference tokens, never raw values. Tokens enable theming, consistency, and maintainability. Semantic tokens (color-text-primary) over raw tokens (gray-900) in components. Raw tokens feed semantic tokens.

4. **Variants are explicit states.** Every component variant represents a meaningful semantic distinction, not just a visual one. `variant="destructive"` means something different from `variant="primary"` — don't add variants for purely aesthetic reasons. Variants: visual category. States: interactive condition (hover, focus, disabled, loading, error).

5. **Headless when reuse matters, styled when speed matters.** Headless components (logic + accessibility, no styles) maximize reuse across projects. Styled components (opinionated visuals) ship faster for single-project work. Know which trade-off the project needs and be consistent.

6. **File structure mirrors component hierarchy.** Co-locate component, styles, tests, stories, and types. Flat until complexity demands nesting. Shared/primitive components in one directory, feature/domain components in another. Index files re-export — don't hide deep imports.

7. **State belongs at the right level.** UI state (open/closed, selected tab) stays in the component. Server state (fetched data) belongs in a cache layer (React Query, SWR, etc.). Application state (auth, theme) belongs in context/store. Don't hoist state higher than it needs to be.
</principles>

<patterns>
**Component tiers:** Primitives (Button, Input, Text — atomic, generic) → Composites (Card, Dialog, Dropdown — composed from primitives) → Features (LoginForm, UserProfile — domain-specific, composed from composites).

**Token structure:** Global tokens (raw values) → Semantic tokens (purpose-named aliases) → Component tokens (component-scoped overrides). Example: `blue-500` → `color-action-primary` → `button-color-primary`.

**Variant patterns:** Use discriminated unions / literal types for variants. Common variant dimensions: size (sm/md/lg), intent (primary/secondary/destructive/ghost), state (default/loading/disabled/error). Combine orthogonally — every size works with every intent.

**Composition patterns:** Compound components (Menu + Menu.Item), render props (headless logic delegation), slot patterns (named children areas), polymorphic components (`as` prop for element override).

**Anti-patterns to avoid:**
- God components with 20+ props
- `className` or `style` as primary customization (breaks contract)
- Prop drilling through 3+ levels (use context or composition)
- Boolean prop explosion (`isLarge`, `isPrimary`, `isOutlined` — use variant enum)
- Components that fetch their own data (mix of concerns)
- Re-implementing browser primitives (custom select, custom checkbox) without full accessibility
</patterns>
