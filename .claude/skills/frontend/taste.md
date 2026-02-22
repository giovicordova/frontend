---
name: taste
domain: frontend
last_updated: 2026-02-22
pinterest_url: https://nl.pinterest.com/cordovagiova/
portfolio_url: https://giovannicordova.com/
---

<scope>
Manages the user's personal aesthetic preferences derived from Pinterest boards and portfolio.
Handles: taste refresh workflow, aesthetic observation storage, staleness detection.
Does NOT handle: applying taste to implementations (that's the agent's job), any design principles or constraints.
</scope>

<sources>
Style references live in the frontmatter above. When a taste refresh is triggered:
1. Use Chrome DevTools MCP to navigate to each URL
2. Screenshot pages, scroll through sections, capture the visual language
3. Extract observations — colors, typography, spacing, layout patterns, texture, energy
4. Save findings as descriptive notes in the `<taste>` block below (no enforced values, just observations)
5. Update `last_updated` in frontmatter

Pinterest will show login walls — dismiss with Escape/close button/scroll past. Never log in. Capture what's visible.
</sources>

<staleness>
Refresh interval: 30 days from `last_updated`.
Before any spec task (not before explicit refresh):
1. Read `last_updated` from frontmatter
2. If empty, missing, or older than 30 days: trigger refresh before proceeding
3. If within 30 days: proceed silently
</staleness>

<taste>
<!-- Populated by `/frontend refresh`. Descriptive observations, not enforced rules. -->
<!-- These notes are the default aesthetic direction when a project has no design system. -->
<!-- When a project has its own design system, taste yields to it. -->
<!-- User explicit direction also overrides taste. -->
</taste>

<checklist>
- Is `last_updated` current (within 30 days)?
- Does the `<taste>` block contain concrete observations (colors, type, spacing, energy)?
- Are observations descriptive (not prescriptive) — "tends toward" not "must use"?
- Does the spec acknowledge taste as starting point, not mandate?
</checklist>
