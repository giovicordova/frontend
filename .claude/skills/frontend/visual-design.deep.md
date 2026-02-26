---
name: visual-design-deep
domain: frontend
---

<principles>
1. **Typography is the skeleton.** Choose a type scale with mathematical ratios (major third 1.25, perfect fourth 1.333, or golden ratio 1.618). Define weights for hierarchy: display, heading, subheading, body, caption, overline. Line height scales inversely with size (larger text = tighter leading). Max line length 65-75 characters for body text.

2. **Spacing is rhythm.** Use a base unit (4px or 8px) and derive all spacing as multiples. Consistent rhythm creates visual coherence even without explicit grid lines. Spacing communicates relationship — tighter spacing = related, wider spacing = separate. Apply spacing consistently: component padding, element gaps, section margins.

3. **Color communicates meaning.** Build palette from: primary (brand action), neutral (text/backgrounds/borders), semantic (success/warning/error/info). Each color needs a full scale (50-950 or equivalent). Surface colors layer: background → surface → elevated surface. Text colors layer: primary → secondary → tertiary → disabled.

4. **Hierarchy directs attention.** Every screen has one focal point. Use size, weight, color, and whitespace to establish reading order. Squint test: if hierarchy disappears when blurred, it relies too much on color alone. Group related items visually. Separate unrelated items with space, not lines.

5. **Elevation creates depth.** Shadow intensity communicates interactive affordance: flat = static, slight = card/container, elevated = floating/overlay. Shadow direction should be consistent (typically top-left light source). Elevation correlates with z-index stacking.

6. **Iconography is consistent.** Pick one icon style (outlined, filled, duotone) and stick to it. Icons accompany text — never standalone without tooltip/label. Icon sizing aligns with text scale. Decorative icons get `aria-hidden="true"`.

7. **Visual noise is debt.** Every border, shadow, gradient, and decorative element must earn its place. When in doubt, remove. White space is a design element, not empty space.
</principles>

<patterns>
**Type scale construction:** Start from base (16px), multiply up for headings, divide down for small text. Define: display (hero), h1-h4, body, small, caption. Each gets size, weight, line-height, letter-spacing, color.

**Color palette structure:** Primary (1 hue, 10 shades), Neutral (1 hue or pure gray, 10 shades), Semantic (4 hues: success/warning/error/info, 3 shades each: light bg, default, dark text). Surface stack: page bg (lightest neutral) → card (1 step lighter/darker) → elevated (2 steps).

**Spacing scale:** 4px base → 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Or 8px base → 8, 16, 24, 32, 48, 64, 96. Name them semantically (xs through 3xl) not by value.

**Anti-patterns to avoid:**
- More than 2 font families on one page
- Type scale with no mathematical relationship between sizes
- Random spacing values (13px, 17px, 22px)
- Decorative borders between every element (use space instead)
- Gradients, shadows, and rounded corners all at once
- Text over images without adequate overlay/contrast
</patterns>
