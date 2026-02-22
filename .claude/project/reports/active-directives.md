# Active Directives

Behavioral rules accumulated from SI observation cycles. Applied during every apply phase.

## 1. Ripple Rule enforcement: grep after renames
After applying improvements that rename or move files/strings, grep for the old name across the project to confirm no stale references remain.
*Source: Improvement #2 renamed hooks to .cjs but left 3 doc files with stale .js references.*

## 2. Update system-observations.md after applying fixes
Regenerate system-observations.md from current codebase state after each apply phase. Remove items that have been resolved.

## 3. Status date annotations on all applied items
All applied items in improvement-plan.md must include `**Status:** applied (YYYY-MM-DD)` with the date applied.
