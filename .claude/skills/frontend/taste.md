---
name: taste
domain: frontend
last_updated:
# Replace these with your own Pinterest board and portfolio URLs
pinterest_url: https://nl.pinterest.com/cordovagiova/
portfolio_url: https://giovannicordova.com/
---

<scope>
Manages the user's personal aesthetic preferences derived from Pinterest boards and portfolio.
Handles: taste refresh workflow, aesthetic observation storage, staleness detection.
Does NOT handle: applying taste to implementations (that's the agent's job), any design principles or constraints.
</scope>

<taste>
<!-- Populated by `/frontend refresh`. Descriptive observations, not enforced rules. -->
<!-- These notes are the default aesthetic direction when a project has no design system. -->
<!-- When a project has its own design system, taste yields to it. -->
<!-- User explicit direction also overrides taste. -->
</taste>

<checklist>
- Is `last_updated` current (within 30 days)?
- Does the `<taste>` block contain concrete observations (colors, type, spacing, energy)? If empty, trigger a refresh before proceeding with spec work.
- Are observations descriptive (not prescriptive) — "tends toward" not "must use"?
- Does the spec acknowledge taste as starting point, not mandate?
</checklist>
