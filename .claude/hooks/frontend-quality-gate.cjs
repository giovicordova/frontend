#!/usr/bin/env node

/**
 * PostToolUse hook for Write/Edit on frontend files.
 * Checks for common accessibility and performance violations.
 * Outputs warnings to stderr — does not block writes.
 */

const fs = require("fs");

let input;
try {
  input = JSON.parse(fs.readFileSync("/dev/stdin", "utf8"));
} catch {
  process.exit(0);
}
const toolName = input.tool_name;
const toolInput = input.tool_input;

// Only check Write and Edit tools
if (toolName !== "Write" && toolName !== "Edit") {
  process.exit(0);
}

const filePath = toolInput.file_path;
if (!filePath) {
  process.exit(0);
}

// Only check frontend file types
const frontendExtensions = [
  ".tsx",
  ".jsx",
  ".vue",
  ".svelte",
  ".css",
  ".scss",
];
const ext = filePath.substring(filePath.lastIndexOf("."));
if (!frontendExtensions.includes(ext)) {
  process.exit(0);
}

// For Edit tool, check the new_string content; for Write tool, check content
const content = toolName === "Edit" ? toolInput.new_string : toolInput.content;
if (!content) {
  process.exit(0);
}

const warnings = [];

// Check: outline: none without :focus-visible replacement
if (/outline:\s*none/i.test(content) || /outline:\s*0\b/i.test(content)) {
  if (
    !/:focus-visible/.test(content) &&
    !/focus-visible:/.test(content) // Tailwind variant
  ) {
    warnings.push(
      "outline:none detected without :focus-visible replacement — keyboard users will lose focus indication"
    );
  }
}

// Check: <img> without alt attribute (JSX and HTML)
const imgTagRegex = /<img\b[^>]*>/gi;
const imgTags = content.match(imgTagRegex) || [];
for (const tag of imgTags) {
  if (!/\balt\s*[={]/i.test(tag)) {
    warnings.push(
      `<img> without alt attribute — screen readers cannot describe this image`
    );
    break; // One warning is enough
  }
}

// Check: onClick on non-interactive elements without role
const onClickRegex = /<(div|span|p|section|article|header|footer|main|li|ul)\b[^>]*onClick/gi;
const clickMatches = content.match(onClickRegex) || [];
for (const match of clickMatches) {
  if (!/\brole\s*[={]/i.test(match)) {
    const element = match.match(/<(\w+)/)?.[1] || "element";
    warnings.push(
      `onClick on <${element}> without role attribute — use a <button> or add role="button" with tabIndex={0} and keyboard handlers`
    );
    break;
  }
}

// Check: tabindex > 0
const tabIndexRegex = /tabIndex\s*[={]\s*["']?([0-9]+)/gi;
let tabMatch;
while ((tabMatch = tabIndexRegex.exec(content))) {
  const value = parseInt(tabMatch[1], 10);
  if (value > 0) {
    warnings.push(
      `tabIndex={${value}} — positive tabindex breaks natural tab order. Use 0 or -1 only`
    );
    break;
  }
}

// Check: <img> without explicit dimensions (CLS risk)
for (const tag of imgTags) {
  const hasWidth = /\b(width|w-)\s*[=:{]/i.test(tag);
  const hasHeight = /\b(height|h-)\s*[=:{]/i.test(tag);
  const hasAspectRatio = /aspect-ratio/i.test(tag);
  const hasFill = /\bfill\b/i.test(tag); // Next.js Image fill prop
  const hasSize = /\bsize\s*[={]/i.test(tag);
  if (!hasWidth && !hasHeight && !hasAspectRatio && !hasFill && !hasSize) {
    warnings.push(
      `<img> without explicit dimensions — causes Cumulative Layout Shift. Add width/height or use aspect-ratio`
    );
    break;
  }
}

if (warnings.length > 0) {
  const header = `⚠ Frontend Quality Gate (${filePath}):`;
  const body = warnings.map((w) => `  • ${w}`).join("\n");
  process.stderr.write(`${header}\n${body}\n`);
}

process.exit(0);
