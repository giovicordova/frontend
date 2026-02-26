#!/usr/bin/env node

/**
 * PostToolUse hook for Write/Edit on frontend files.
 * Checks for common accessibility and performance violations.
 * Outputs warnings to stderr — does not block writes.
 */

const fs = require("fs");
const path = require("path");

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
  ".html",
  ".astro",
  ".mdx",
];
const ext = path.extname(filePath);
if (!frontendExtensions.includes(ext)) {
  process.exit(0);
}

// Read the full file from disk — PostToolUse runs after the tool executes
let content;
try {
  content = fs.readFileSync(filePath, "utf8");
} catch {
  process.exit(0);
}
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
const imgTagRegex = /<(?:img|Image)\b[^>]*>/gi;
const imgTags = content.match(imgTagRegex) || [];
for (const tag of imgTags) {
  if (!/\balt\s*[={]/i.test(tag) && !/\{\s*\.\.\./.test(tag)) {
    const tagName = tag.match(/<(\w+)/)?.[1] || "img";
    warnings.push(
      `<${tagName}> without alt attribute — screen readers cannot describe this image`
    );
    break; // One warning is enough
  }
}

// Check: onClick on non-interactive elements without role
const fullTagRegex = /<(div|span|p|section|article|header|footer|main|li|ul)\b[^>]*>/gi;
const fullTags = content.match(fullTagRegex) || [];
for (const tag of fullTags) {
  if (/onClick/i.test(tag) && !/\brole\s*[={]/i.test(tag)) {
    const element = tag.match(/<(\w+)/)?.[1] || "element";
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
  const hasWidth = /\bwidth\s*[=:{]/i.test(tag) || /\bw-[\d[]/.test(tag);
  const hasHeight = /\bheight\s*[=:{]/i.test(tag) || /\bh-[\d[]/.test(tag);
  const hasAspectRatio = /aspect-ratio/i.test(tag);
  const hasFill = /\bfill\b/i.test(tag); // Next.js Image fill prop
  const hasSize = /\bsize\s*[={]/i.test(tag);
  if (!hasWidth && !hasHeight && !hasAspectRatio && !hasFill && !hasSize) {
    const tagName = tag.match(/<(\w+)/)?.[1] || "img";
    warnings.push(
      `<${tagName}> without explicit dimensions — causes Cumulative Layout Shift. Add width/height or use aspect-ratio`
    );
    break;
  }
}

// Check: aria-hidden="true" on container elements (skip decorative elements like SVG icons)
const containerAriaHidden = /<(div|section|main|aside|nav|article|header|footer)\b[^>]*aria-hidden\s*=\s*["'{]?\s*true/gi;
if (containerAriaHidden.test(content)) {
  warnings.push(
    `aria-hidden="true" on container element — if it has focusable children (links, buttons, inputs), they become inaccessible to screen readers`
  );
}

// Check: <img> without loading attribute (below-fold lazy loading)
for (const tag of imgTags) {
  const hasFill = /\bfill\b/i.test(tag);
  const hasPriority = /\bpriority\b/i.test(tag); // Next.js Image
  const hasLoading = /\bloading\s*[={]/i.test(tag);
  if (!hasFill && !hasPriority && !hasLoading) {
    warnings.push(
      `<${tag.match(/<(\w+)/)?.[1] || "img"}> without loading attribute — add loading="lazy" for below-fold images or priority for LCP images`
    );
    break;
  }
}

// Check: <a> with non-descriptive text
const anchorRegex =
  /<a\b[^>]*>\s*(click here|here|read more|learn more|more|link)\s*<\/a>/gi;
if (anchorRegex.test(content)) {
  warnings.push(
    `Non-descriptive link text detected ("click here", "read more", etc.) — use descriptive text for SEO and accessibility`
  );
}

// Check: <title> missing in HTML files
if ((ext === ".html" || ext === ".astro") && !/<title[\s>]/i.test(content)) {
  warnings.push(
    `No <title> tag detected in HTML file — required for SEO (Lighthouse Best Practices)`
  );
}

// Check: Google Fonts loaded without display=swap
const gfontsRegex = /fonts\.googleapis\.com\/css/i;
if (gfontsRegex.test(content) && !/display=swap/i.test(content)) {
  warnings.push(
    `Google Fonts loaded without display=swap — causes invisible text during font load (FOIT). Add &display=swap to the URL`
  );
}

// Check: document.write usage
if (/document\.write\s*\(/i.test(content)) {
  warnings.push(
    `document.write() detected — blocks HTML parsing and is flagged by Lighthouse Best Practices. Use DOM manipulation instead`
  );
}

// Check: render-blocking <script> in <head> without async/defer
const headScriptRegex =
  /<script\b(?![^>]*\b(async|defer|type\s*=\s*["']module["'])\b)[^>]*src\s*=/gi;
if (headScriptRegex.test(content) && /<head\b/i.test(content)) {
  warnings.push(
    `Render-blocking <script src> in <head> without async or defer — delays page rendering. Add defer or move before </body>`
  );
}

if (warnings.length > 0) {
  const header = `⚠ Frontend Quality Gate (${filePath}):`;
  const body = warnings.map((w) => `  • ${w}`).join("\n");
  process.stderr.write(`${header}\n${body}\n`);
}

process.exit(0);
