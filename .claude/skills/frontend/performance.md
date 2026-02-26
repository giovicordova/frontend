---
name: performance
domain: frontend
---

<scope>
Core Web Vitals targets, resource loading strategy, image optimization, font loading, JavaScript efficiency, HTML meta completeness, and SEO signals.
Does NOT cover: accessibility contrast (accessibility.md), animation performance (interaction-motion.md), layout shift from responsive patterns (layout-responsive.md).
</scope>

<checklist>
**Performance:**
- Is the LCP element (largest image or heading) preloaded or prioritized?
- Are images below the fold lazy-loaded (loading="lazy" or Next.js priority={false})?
- Are images served in modern formats (WebP or AVIF)?
- Do all images have explicit width and height to prevent CLS?
- Is font loading non-blocking (font-display: swap or optional)?
- Are custom fonts preconnected (<link rel="preconnect">)?
- Is JavaScript code-split and deferred where possible?
- Are third-party scripts loaded async or deferred?
- Is there no document.write() or synchronous XHR?
- Are event listeners passive where appropriate (scroll, touchstart)?
- Is CSS render-blocking minimized (critical CSS inlined, rest deferred)?

**SEO:**
- Does every page have a unique, descriptive <title> tag?
- Does every page have a <meta name="description"> under 160 characters?
- Is there a canonical <link rel="canonical"> tag?
- Are Open Graph tags present (og:title, og:description, og:image)?
- Is the page indexable (no noindex unless intentional)?
- Do all links have descriptive text (no "click here")?
- Is structured data (JSON-LD) included where relevant?

**Best Practices:**
- Is the page served over HTTPS?
- Are there no console errors on load?
- Are all resources (images, scripts, styles) loaded over HTTPS?
- Is the viewport meta tag correctly set?
- Are deprecated APIs avoided?
</checklist>
