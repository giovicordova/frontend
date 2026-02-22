---
name: ux-ia
domain: frontend
---

<scope>
User flows, navigation patterns, information architecture, cognitive load management, progressive disclosure, wayfinding, and content organization.
Does NOT cover: visual execution of navigation (visual-design.md), specific interaction/animation behavior (interaction-motion.md), microcopy text (content-microcopy.md).
</scope>

<principles>
1. **Information hierarchy matches user mental models.** Organize content by how users think about it, not how the backend structures it. Card sort logic: group by task or concept, not by data table. Navigation labels use user language, not internal jargon.

2. **Progressive disclosure reduces cognitive load.** Show the minimum needed at each step. Advanced options behind expandable sections. Details on demand, not upfront. Don't front-load every option — let users dig deeper when they need to.

3. **Navigation is wayfinding, not decoration.** Users must always know: where they are, where they can go, and how to get back. Breadcrumbs for deep hierarchies. Active states for current location. Persistent navigation for primary routes. Back/escape paths always available.

4. **Every flow has a clear exit.** Wizards have back buttons and cancel options. Modals have close buttons and Escape key. Multi-step processes show progress and allow saving/resuming. Dead ends are design failures.

5. **Reduce decisions, not options.** Smart defaults eliminate unnecessary choices. Sensible sorting (most likely first). Pre-selection of common options. Search/filter for large sets instead of exposing everything. Users shouldn't have to think about things the system already knows.

6. **Feedback closes the loop.** Every user action gets a visible response. Submissions confirm success. Errors explain what happened and how to fix it. Loading states indicate progress. State changes are announced, not silent.

7. **Consistency reduces learning cost.** Same patterns for same interactions across the entire product. If settings pages use tabs, all settings pages use tabs. If delete requires confirmation, all destructive actions require confirmation. Inconsistency forces users to re-learn.
</principles>

<patterns>
**Navigation patterns:** Top bar (global nav, 5-7 items max), Sidebar (app nav, collapsible, grouped sections), Tab bar (section-level, 3-5 tabs), Breadcrumbs (hierarchical depth), Bottom nav (mobile primary actions, 3-5 items).

**Information grouping:** Card-based (distinct items with metadata), List-based (scannable items with actions), Table-based (comparable data with sorting/filtering), Accordion (progressive disclosure of sections), Tabs (parallel content views).

**Flow patterns:** Linear wizard (sequential steps with progress), Hub-and-spoke (central dashboard with detail views), Drill-down (list → detail → sub-detail), Search-first (search bar as primary interaction).

**Anti-patterns to avoid:**
- Mystery meat navigation (icons without labels)
- More than 3 levels of navigation depth without breadcrumbs
- Modal chains (modal opens another modal)
- Pagination without visible total/count context
- "Are you sure?" dialogs for non-destructive actions
- Forcing account creation before value demonstration
</patterns>

<checklist>
- Is the information hierarchy based on user mental models?
- Does navigation show current location clearly?
- Can users always navigate back or exit?
- Is progressive disclosure used (not everything shown at once)?
- Are smart defaults set for common choices?
- Does every action have visible feedback?
- Are patterns consistent across similar interactions?
- Are flows linear and escapable (back, cancel, save)?
- Is cognitive load managed (grouping, whitespace, chunking)?
- Is the navigation depth reasonable (3 levels max without breadcrumbs)?
</checklist>
