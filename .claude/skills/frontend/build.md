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
