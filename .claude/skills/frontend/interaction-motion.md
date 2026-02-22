---
name: interaction-motion
domain: frontend
---

<scope>
Micro-interactions, animation principles, state transitions, gesture handling, loading/skeleton patterns, and feedback animations.
Does NOT cover: layout transition animations (layout-responsive.md), motion accessibility/reduced-motion (accessibility.md), general UX flow design (ux-ia.md).
</scope>

<principles>
1. **Motion communicates, it doesn't decorate.** Every animation must serve a purpose: indicate state change, guide attention, show spatial relationships, or provide feedback. If removing the animation loses no information, remove it. Decorative motion is visual noise.

2. **Duration scales with distance and importance.** Micro-interactions (button press, toggle): 100-200ms. Reveals and collapses: 200-300ms. Page transitions: 300-500ms. Nothing should exceed 500ms for UI transitions. Longer = sluggish. Shorter = jarring.

3. **Easing matches physics.** Enter animations: ease-out (decelerate into resting position). Exit animations: ease-in (accelerate away). Movement between positions: ease-in-out. Linear easing looks mechanical — avoid for UI. Spring/bounce only for playful interactions.

4. **State transitions are continuous, not discrete.** Elements don't teleport — they move between states. Hover → pressed → released. Collapsed → expanding → expanded. Loading → loaded. Define intermediate states, not just start and end.

5. **Loading states maintain spatial stability.** Skeleton screens preserve layout during load (no CLS). Spinners for indeterminate waits (keep them subtle). Progress bars for determinate operations. Content should fade/slide in, not pop. Loading states appear after 200ms delay (avoid flash for fast loads).

6. **Gestures extend, not replace.** Swipe, pinch, long-press are shortcuts for actions that also have button/tap equivalents. Never gate functionality behind gesture-only interactions. Gesture feedback must be immediate and cancelable (drag back to cancel).

7. **Stagger creates rhythm.** Lists and grids animate items sequentially (30-50ms stagger between items). Stagger direction follows reading order. Cap total stagger time (don't stagger 100 items — fade the group). Stagger on entry only, not exit.
</principles>

<patterns>
**Micro-interactions:** Button press (scale 0.97, 100ms), Toggle slide (transform, 200ms), Checkbox check (SVG stroke animation, 150ms), Ripple effect (expanding circle from click point, 300ms).

**Reveals:** Fade in (opacity 0→1, 200ms), Slide up (translateY 8px→0 + fade, 250ms), Scale in (scale 0.95→1 + fade, 200ms, for modals/popovers). Exit: reverse with ease-in, slightly faster.

**Loading patterns:** Skeleton (pulsing gray shapes matching content layout), Spinner (after 200ms delay, centered in container), Progress bar (determinate, with percentage), Optimistic UI (show result immediately, reconcile on response).

**Transition patterns:** Shared element transitions (element morphs between views), Cross-fade (old content fades out, new fades in, 200ms overlap), Slide (directional, matches navigation direction — forward=slide left, back=slide right).

**Anti-patterns to avoid:**
- Animations longer than 500ms for UI elements
- Bounce/spring easing on data-heavy interfaces
- Animating layout properties (width, height, top, left) — use transform and opacity
- Motion that blocks interaction (user must wait for animation to complete)
- Parallax scrolling on content-heavy pages
- Auto-playing carousels
</patterns>

<checklist>
- Does every animation serve a communicative purpose?
- Are durations appropriate (100-200ms micro, 200-300ms reveal, 300-500ms transition)?
- Is easing physics-based (ease-out enter, ease-in exit)?
- Are state transitions continuous (not instant jumps)?
- Do loading states preserve layout (skeletons, reserved space)?
- Are gestures supplementary (not the only way to act)?
- Is stagger used for lists/grids (with a cap on total duration)?
- Are animations using transform/opacity (not layout properties)?
- Is there a 200ms delay before showing loading indicators?
- Are exit animations slightly faster than enter animations?
</checklist>
