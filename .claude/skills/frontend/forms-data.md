---
name: forms-data
domain: frontend
---

<scope>
Form patterns, input validation, data tables, data visualization, complex inputs (date pickers, multi-select, file upload), and error recovery flows.
Does NOT cover: general UX flows (ux-ia.md), error message copywriting (content-microcopy.md), form accessibility basics (accessibility.md covers labels, focus, ARIA).
</scope>

<principles>
1. **Validate at the right moment.** Don't validate on every keystroke (frustrating). Don't wait until submit (too late). Validate on blur for format rules (email, phone). Validate on submit for required fields and cross-field logic. Show inline errors next to the field, not in a distant summary.

2. **Error recovery is a flow, not a message.** After submit failure: scroll to first error, focus it, show all errors inline. Each error explains what's wrong AND how to fix it. Don't clear valid fields on error. Preserve all user input. Let users fix and re-submit without re-entering anything.

3. **Forms are conversations.** Group related fields (personal info, address, payment). Label groups with headings. Show one group at a time for long forms (wizard pattern). Progress indicator for multi-step. Each step should be saveable/resumable.

4. **Data tables are interactive documents.** Sortable columns (click header, visual indicator of sort direction). Filterable (search bar + column filters). Paginated or virtualized for large sets. Row actions visible on hover or in a column. Bulk actions via selection. Empty state when no results.

5. **Inputs match the data type.** Date → date picker (not free text). Phone → tel input with formatting. Currency → number input with locale formatting. Selection from <10 options → radio/select. Selection from 10+ options → searchable dropdown/combobox. Multi-select → checkbox group or tag input.

6. **Defaults reduce friction.** Pre-fill what you can infer (country from locale, timezone from browser). Default to the most common option. Remember previous selections where appropriate. Auto-format inputs (phone numbers, credit cards) as the user types.

7. **Destructive actions have speed bumps.** Delete/remove requires confirmation with explicit action name ("Delete project" not "OK"). Bulk destructive actions show count ("Delete 12 items?"). Undo is better than confirmation when possible. No destructive action should be one click from content.
</principles>

<patterns>
**Form layouts:** Single column (most forms — prevents missed fields). Two-column (only for short related pairs: first/last name, city/state). Inline editing (tables, settings — edit in place, save on blur or explicit action).

**Validation patterns:** Real-time (password strength meters, username availability). On blur (email format, required field). On submit (cross-field validation, server-side checks). Progressive (validate each step of wizard before allowing next).

**Data table patterns:** Fixed header on scroll. Resizable columns. Column visibility toggle. Export (CSV/PDF). Row expansion for detail view. Sticky first column on horizontal scroll. Responsive: table → card list on mobile.

**Complex input patterns:** Autocomplete (debounced search, keyboard navigation, clear button). Tag input (type + enter, remove with backspace/click x, max count). File upload (drag-and-drop zone, progress indicator, preview, size/type validation before upload). Rich text (toolbar with common formatting, markdown shortcut support).

**Anti-patterns to avoid:**
- Placeholder text as labels (disappears on input, accessibility issue)
- Disabling submit button until form is valid (user doesn't know why it's disabled)
- Clearing the entire form on error
- Required field indicators only (mark optional fields instead — most should be required)
- Pagination without total count on data tables
- Confirmation dialogs for non-destructive actions
</patterns>

<checklist>
- Is validation timing appropriate (blur for format, submit for required/cross-field)?
- Do inline errors appear next to their fields?
- Does error recovery preserve all valid input?
- Are related fields grouped with headings?
- Do inputs match their data type (date picker, tel, combobox)?
- Are sensible defaults and auto-formatting applied?
- Do destructive actions require explicit confirmation?
- Are data tables sortable, filterable, and paginated?
- Does the form have a clear submission feedback (success/error)?
- Is the empty state defined for tables/lists?
- Are multi-step forms saveable and resumable?
- Do file uploads show progress and validate before upload?
</checklist>
