---
name: performance-deep
domain: frontend
---

<principles>
1. **Performance is UX, not an afterthought.** LCP < 2.5s, INP < 200ms, CLS < 0.1 are user experience thresholds, not vanity metrics. Every render-blocking resource is a user waiting.

2. **The critical rendering path is the bottleneck.** HTML → CSS → render tree → layout → paint. Anything that blocks this chain delays first paint. Inline critical CSS, defer everything else.

3. **Images are the #1 performance variable.** Format (WebP/AVIF), sizing (explicit dimensions), loading strategy (eager above fold, lazy below), and delivery (CDN, srcset) are all required, not optional.

4. **Fonts cause invisible layout shift.** font-display: swap prevents invisible text. Preconnect cuts DNS lookup time. Subsetting reduces payload. Self-hosting removes third-party dependency.

5. **JavaScript is the most expensive resource per byte.** Parse + compile + execute is 3-10x more expensive than equivalent JSON. Code-split at route boundaries. Tree-shake aggressively. Defer non-critical scripts.

6. **Every third-party script is a liability.** Analytics, chat widgets, and tag managers can double load time. Load them async, defer them, or facade them (load on interaction). Never block the main thread for third-party code.

7. **Measure in the field, not just the lab.** Lighthouse is a lab tool. Real User Monitoring (RUM) via web-vitals library catches p75/p95 issues that synthetic tests miss. Both matter.
</principles>

<patterns>
**Resource hints:** `<link rel="preconnect">` for origins you'll fetch from (fonts, APIs) — include crossorigin for font origins. `<link rel="preload">` for critical resources discovered late (hero image, key font file) — use sparingly, only for resources the browser wouldn't discover early in the HTML. `<link rel="prefetch">` for next-page resources — low priority, only when confident the user will navigate there.

**Image optimization:** Use `srcset` with width descriptors and `sizes` attribute to let the browser pick the right resolution. Next.js `<Image>` handles srcset, format negotiation, and lazy loading automatically — use it. For non-framework projects, wrap images in aspect-ratio containers (`aspect-ratio: 16/9` or padding-bottom hack) to reserve space before load. Serve WebP with AVIF as progressive enhancement. Always set explicit `width` and `height` attributes to prevent CLS.

**Font loading strategy:** Self-host when possible to eliminate third-party DNS lookup. Use `font-display: swap` to show fallback text immediately. Preconnect to font origins (`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`). Subset fonts to only the character sets needed. Load only the weights and styles actually used — importing an entire family for 2 weights wastes bandwidth.

**Script loading:** `defer` for scripts that need DOM access but aren't critical to first paint (analytics, interactivity). `async` for independent scripts that don't depend on DOM or other scripts (third-party tags). `type="module"` scripts are deferred by default. Never use bare `<script src>` in `<head>` without async or defer — it blocks HTML parsing.

**CLS prevention:** Reserve space for dynamic content with `min-height`, `aspect-ratio`, or skeleton screens. Set explicit dimensions on images and videos. Use `transform` for animations — never animate `width`, `height`, `top`, `left`, or `margin`. Avoid inserting content above existing content (banners, cookie notices should push from top on load, not inject mid-page).

**Bundle optimization:** Dynamic `import()` for route-level code splitting. `React.lazy()` + `Suspense` for component-level splitting. Tree-shake by using named imports (`import { map } from 'lodash-es'` not `import _ from 'lodash'`). Analyze bundles with `next build --analyze` or `vite-bundle-visualizer` to find oversized chunks.

**Anti-patterns to avoid:**
- Preloading everything (defeats prioritization — browser can only preload ~6 resources in parallel)
- Using `<link rel="preload">` for fonts without the `crossorigin` attribute (causes double-fetch)
- Lazy-loading above-fold images (delays LCP — use `loading="eager"` or Next.js `priority`)
- Importing entire icon libraries for 3 icons (`import * from 'lucide-react'` pulls hundreds of icons)
- Inline SVGs for complex illustrations (use `<img>` instead — inline SVGs block HTML parsing for large markup)
- Render-blocking Google Fonts without `&display=swap` parameter (causes Flash of Invisible Text)
</patterns>
