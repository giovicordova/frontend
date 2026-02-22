---
name: content-microcopy
domain: frontend
---

<scope>
UX writing, error messages, empty states, CTAs, onboarding copy, labels, tooltips, confirmation dialogs, and status messages.
Does NOT cover: visual presentation of content (visual-design.md), form validation logic and patterns (forms-data.md), information architecture and navigation labels (ux-ia.md).
</scope>

<principles>
1. **Clarity over cleverness.** Users scan, they don't read. Use plain language. One idea per sentence. Active voice. Present tense. Avoid jargon, marketing speak, and internal terminology. "Save changes" not "Persist modifications."

2. **Error messages are help messages.** Every error message answers three questions: What happened? Why? How to fix it? "Email address is invalid" → "Enter a valid email address (e.g., name@example.com)." Never blame the user. Never show raw error codes or stack traces.

3. **Empty states are onboarding opportunities.** Empty lists, dashboards, and search results are teaching moments. Show: what this area will contain, how to populate it (primary action), and optionally an illustration. "No projects yet. Create your first project to get started." with a visible CTA button.

4. **CTAs describe the outcome, not the action.** "Get started" not "Submit." "Save changes" not "OK." "Delete project" not "Confirm." Destructive CTAs name what's being destroyed. Primary CTA is visually dominant. One primary CTA per view.

5. **Labels are scannable.** Form labels: noun or short noun phrase ("Email address" not "Please enter your email address below"). Navigation labels: 1-2 words. Button labels: verb + object ("Add member," "Export CSV"). Tooltip labels: one sentence max, no period.

6. **Confirmation copy names the stakes.** "Delete this project? This will permanently remove all 47 files and cannot be undone." Include: what will happen, what will be lost, whether it's reversible. Confirm button repeats the action ("Delete project"), cancel button says "Cancel" (not "No" or "Go back").

7. **Status messages match urgency.** Success: brief, auto-dismiss ("Changes saved"). Warning: persistent, actionable ("Storage 90% full. Free up space."). Error: persistent, explains fix ("Upload failed. File exceeds 10MB limit. Choose a smaller file."). Info: contextual, dismissible ("New features available. See what's new.").
</principles>

<patterns>
**Tone calibration:** Neutral-professional for enterprise/tools. Warm-conversational for consumer apps. Technical-precise for developer tools. Match the product's existing voice. When no voice exists, default to clear and neutral.

**Error message template:** "[What happened]. [How to fix it]." Examples: "Password must be at least 8 characters. Add more characters to continue." / "Connection lost. Check your internet and try again."

**Empty state template:** "[What belongs here]. [How to add it]." + CTA button. Examples: "No team members yet. Invite people to collaborate." [Invite members].

**Loading copy:** Avoid "Loading..." for everything. Context-specific: "Fetching your projects..." / "Analyzing data..." / "Preparing export...". For long operations: show progress percentage or step count.

**Confirmation dialog template:** Title: "[Action] [object]?" Body: "[Consequence]. [Reversibility]." Actions: "[Action object]" / "Cancel". Example: Title: "Delete project?" Body: "This will permanently remove 'My Project' and all its files. This cannot be undone." Actions: "Delete project" / "Cancel".

**Anti-patterns to avoid:**
- "Error: 500" or any raw error code exposed to users
- "Are you sure?" without explaining consequences
- "OK" / "Cancel" without action-specific labels
- Empty states with no guidance ("No items")
- Exclamation marks in error messages ("Error! Something went wrong!")
- Double negatives ("Don't you not want to cancel?")
- Lorem ipsum or TODO placeholder copy in specs
</patterns>

<checklist>
- Are error messages specific and actionable (what happened + how to fix)?
- Do empty states explain what belongs and how to populate?
- Do CTAs describe outcomes (not generic "Submit"/"OK")?
- Is confirmation copy explicit about consequences and reversibility?
- Are labels concise (noun phrases for fields, verb+object for buttons)?
- Are status messages calibrated to urgency (auto-dismiss vs persistent)?
- Is the tone consistent with the product voice?
- Is loading copy contextual (not generic "Loading...")?
- Is all copy free of jargon, blame, and raw technical errors?
- Are destructive action labels specific ("Delete project" not "Delete")?
</checklist>
