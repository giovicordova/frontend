# Design: Conversational Core + Design Token System

**Date:** 2026-03-01
**Status:** Approved

## Problem

The frontend design system has grown to 28 config files across 5 agents, 19 skill files, 3 hooks, and 8 explicit command modes. Users must memorize mode names and manually route requests. There's no system for defining and enforcing visual identity — colors, fonts, shapes, and spacing get invented ad-hoc during implementation.

## Solution

Two changes:

1. **Conversational `/frontend` command** — replace 8 explicit modes with a single dialogue-first entry point that auto-detects context and adapts.
2. **Design token system** — per-project visual identity defined once, explored interactively, previewed in the browser, and enforced throughout development.

## Architecture

### The Conversational Command

`/frontend` reads project state on entry:
- Design tokens file exists? (`.frontend-specs/design-tokens.json`)
- Codebase profile exists? (`.frontend-specs/codebase-profile.md`)
- Specs exist in `.frontend-specs/`?
- Recent file changes?
- User's message content?

Based on context, enters one of 6 phases (phases flow into each other — user never names them):

| Phase | Triggers when... | What happens |
|---|---|---|
| Brand | No tokens exist, or user mentions colors/palette/branding | Interactive exploration: project purpose, audience, mood -> palette, typography, shapes -> browser preview -> token file |
| Spec | Tokens exist but no spec for what user describes | Conversational design: clarifying questions -> implementation-ready spec referencing tokens |
| Build | Spec exists and user wants to implement | Dispatches builder agent with tokens + spec |
| Review | Code exists and user wants feedback | Audits code against skills and design tokens |
| Improve | User mentions improving, optimizing, or wants a full pass | Orchestrates scan + review + token compliance |
| Refresh | User mentions updating taste/references | Updates taste.md via Pinterest/portfolio browsing |

The command confirms its phase detection: "Looks like you want to define the visual identity. Let's start there?" If wrong, user corrects and it adjusts.

### The Design Token System

#### Token file structure

Location: `.frontend-specs/design-tokens.json`

```json
{
  "meta": { "project": "Project Name", "created": "2026-03-01" },
  "colors": {
    "primary": { "value": "#2D5A6B", "contrast_on_white": "7.2:1", "usage": "CTAs, key actions" },
    "secondary": { "value": "#8BA88E", "contrast_on_white": "3.1:1", "usage": "Accents" },
    "neutral-900": { "value": "#1A1A2E", "contrast_on_white": "15.8:1", "usage": "Body text" }
  },
  "typography": {
    "heading": { "family": "DM Serif Display", "weights": [400, 700] },
    "body": { "family": "Inter", "weights": [400, 500, 600] },
    "scale": [12, 14, 16, 20, 24, 32, 48]
  },
  "shape": {
    "radius": { "sm": 4, "md": 8, "lg": 16, "full": 9999 },
    "default": "md"
  },
  "spacing": {
    "unit": 4,
    "scale": [4, 8, 12, 16, 24, 32, 48, 64]
  }
}
```

Every color stores its contrast ratio. Every decision has a usage note.

#### Brand phase flow

1. Understand the project — purpose, audience, emotional tone
2. Reference check — use taste.md observations and/or provided reference URLs
3. Propose palette with pre-calculated contrast ratios
4. Propose typography with font pairings
5. Propose shapes — radii, spacing scale, overall feel
6. Browser preview — standalone HTML brand board with color swatches, typography samples, component previews
7. Iterate — user adjusts ("primary too dark", "rounder corners"), regenerates
8. Lock — saves token file as project's visual source of truth

#### Enforcement

- Specs reference token names, not raw values
- Implementer uses CSS variables / design system tokens, never hardcoded values
- Reviewer flags any color/font/radius not traceable to tokens
- Quality gate hook catches hardcoded hex values in CSS during writes

#### Live project application

For existing projects:
1. Scanner reads actual colors, fonts, radii from codebase
2. Maps against token file — shows drift (unauthorized values)
3. Generates migration plan to consolidate

### Agents (5 -> 3)

| Agent | Model | Replaces | Role |
|---|---|---|---|
| frontend-designer | opus | specifier + scanner + refresh | The thinker. Brand exploration, palette generation, spec writing, codebase profiling, taste refresh. |
| frontend-builder | sonnet | implementer | The doer. Reads specs + tokens, writes code, runs lint/type-check. |
| frontend-reviewer | sonnet | auditor | The critic. Reviews code against skills and tokens. Parallel across 3 skill domains. |

### Skills (19 -> 4)

| File | Covers |
|---|---|
| design.md | Typography, color, visual hierarchy, grids, breakpoints, contrast, keyboard nav, screen readers — all visual and perceptual concerns |
| experience.md | User flows, navigation, animation, copy, form validation, progressive disclosure — all behavioral concerns |
| build.md | Component API, composition, tokens, code splitting, image optimization, SEO — all implementation concerns |
| taste.md | Aesthetic observations from Pinterest/portfolio references (unchanged) |

Each file has a checklist section at the top (for quick audits) and deep principles below (for full specs), separated by a clear marker.

### Hooks (3 -> 1)

Keep the quality gate hook, enhanced with token compliance checking. Drop team-idle-gate and team-task-gate (the conversational flow manages completion naturally).

Token compliance additions:
- Flag hardcoded color hex values in CSS/styled-components when tokens file exists
- Flag hardcoded font-family declarations
- Flag hardcoded border-radius values

## Summary

| | Before | After |
|---|---|---|
| Command | 8 explicit modes | 1 conversational entry |
| Agents | 5 | 3 |
| Skill files | 19 | 4 |
| Hooks | 3 | 1 |
| Total config files | ~28 | ~9 |
| Design tokens | None | Full system: explore, preview, enforce |
