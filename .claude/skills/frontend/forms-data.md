---
name: forms-data
domain: frontend
---

<scope>
Form patterns, input validation, data tables, data visualization, complex inputs (date pickers, multi-select, file upload), and error recovery flows.
Does NOT cover: general UX flows (ux-ia.md), error message copywriting (content-microcopy.md), form accessibility basics (accessibility.md covers labels, focus, ARIA).
</scope>

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
