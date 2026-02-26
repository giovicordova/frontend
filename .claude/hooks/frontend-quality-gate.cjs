#!/usr/bin/env node

/**
 * PostToolUse hook for Write/Edit on frontend files.
 * Checks for common accessibility and performance violations.
 * Supports .claude/frontend-gaterc.json for per-check configuration.
 *
 * Each check has an ID and a default severity of "warn" (stderr + exit 0).
 * Config can override severity to "block" (stderr + exit 2) or "off" (skip).
 * Missing config = all checks enabled at "warn" severity (backward-compatible).
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

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

// --- Configuration loading ---

const checkDefaults = {
  "outline-none": { enabled: true, severity: "warn" },
  "img-alt": { enabled: true, severity: "warn" },
  "onclick-role": { enabled: true, severity: "warn" },
  "tabindex-positive": { enabled: true, severity: "warn" },
  "img-dimensions": { enabled: true, severity: "warn" },
  "aria-hidden-container": { enabled: true, severity: "warn" },
  "img-loading": { enabled: true, severity: "warn" },
  "link-text": { enabled: true, severity: "warn" },
  "title-tag": { enabled: true, severity: "warn" },
  "font-display-swap": { enabled: true, severity: "warn" },
  "document-write": { enabled: true, severity: "warn" },
  "render-blocking-script": { enabled: true, severity: "warn" },
};

// Walk up from filePath looking for .claude/ directory containing frontend-gaterc.json
function findGaterc(startPath) {
  let dir = path.dirname(startPath);
  for (let i = 0; i < 20; i++) {
    const candidate = path.join(dir, ".claude", "frontend-gaterc.json");
    try {
      const raw = fs.readFileSync(candidate, "utf8");
      return JSON.parse(raw);
    } catch {
      // Not found or invalid — keep walking
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: check global ~/.claude/frontend-gaterc.json
  try {
    const globalCandidate = path.join(os.homedir(), ".claude", "frontend-gaterc.json");
    const raw = fs.readFileSync(globalCandidate, "utf8");
    return JSON.parse(raw);
  } catch {
    // Not found globally either
  }
  return null;
}

const gaterc = findGaterc(filePath);
const checkConfig = {};

for (const [id, defaults] of Object.entries(checkDefaults)) {
  const override = gaterc?.checks?.[id];
  checkConfig[id] = {
    enabled: override?.enabled ?? defaults.enabled,
    severity: override?.severity ?? defaults.severity,
  };
}

function isEnabled(id) {
  const cfg = checkConfig[id];
  return cfg && cfg.enabled && cfg.severity !== "off";
}

function getSeverity(id) {
  return checkConfig[id]?.severity ?? "warn";
}

// --- Checks ---

const findings = []; // { id, message }

// Check: outline: none without :focus-visible replacement
if (isEnabled("outline-none")) {
  if (/outline:\s*none/i.test(content) || /outline:\s*0\b/i.test(content)) {
    if (
      !/:focus-visible/.test(content) &&
      !/focus-visible:/.test(content) // Tailwind variant
    ) {
      findings.push({
        id: "outline-none",
        message:
          "outline:none detected without :focus-visible replacement — keyboard users will lose focus indication",
      });
    }
  }
}

// Check: <img> without alt attribute (JSX and HTML)
const imgTagRegex = /<(?:img|Image)\b[^>]*>/gi;
const imgTags = content.match(imgTagRegex) || [];

if (isEnabled("img-alt")) {
  for (const tag of imgTags) {
    if (!/\balt\s*[={]/i.test(tag) && !/\{\s*\.\.\./.test(tag)) {
      const tagName = tag.match(/<(\w+)/)?.[1] || "img";
      findings.push({
        id: "img-alt",
        message: `<${tagName}> without alt attribute — screen readers cannot describe this image`,
      });
      break;
    }
  }
}

// Check: onClick on non-interactive elements without role
if (isEnabled("onclick-role")) {
  const fullTagRegex =
    /<(div|span|p|section|article|header|footer|main|li|ul)\b[^>]*>/gi;
  const fullTags = content.match(fullTagRegex) || [];
  for (const tag of fullTags) {
    if (/onClick/i.test(tag) && !/\brole\s*[={]/i.test(tag)) {
      const element = tag.match(/<(\w+)/)?.[1] || "element";
      findings.push({
        id: "onclick-role",
        message: `onClick on <${element}> without role attribute — use a <button> or add role="button" with tabIndex={0} and keyboard handlers`,
      });
      break;
    }
  }
}

// Check: tabindex > 0
if (isEnabled("tabindex-positive")) {
  const tabIndexRegex = /tabIndex\s*[={]\s*["']?([0-9]+)/gi;
  let tabMatch;
  while ((tabMatch = tabIndexRegex.exec(content))) {
    const value = parseInt(tabMatch[1], 10);
    if (value > 0) {
      findings.push({
        id: "tabindex-positive",
        message: `tabIndex={${value}} — positive tabindex breaks natural tab order. Use 0 or -1 only`,
      });
      break;
    }
  }
}

// Check: <img> without explicit dimensions (CLS risk)
if (isEnabled("img-dimensions")) {
  for (const tag of imgTags) {
    const hasWidth = /\bwidth\s*[=:{]/i.test(tag) || /\bw-[\d[]/.test(tag);
    const hasHeight = /\bheight\s*[=:{]/i.test(tag) || /\bh-[\d[]/.test(tag);
    const hasAspectRatio = /aspect-ratio/i.test(tag);
    const hasFill = /\bfill\b/i.test(tag);
    const hasSize = /\bsize\s*[={]/i.test(tag);
    if (!hasWidth && !hasHeight && !hasAspectRatio && !hasFill && !hasSize) {
      const tagName = tag.match(/<(\w+)/)?.[1] || "img";
      findings.push({
        id: "img-dimensions",
        message: `<${tagName}> without explicit dimensions — causes Cumulative Layout Shift. Add width/height or use aspect-ratio`,
      });
      break;
    }
  }
}

// Check: aria-hidden="true" on container elements
if (isEnabled("aria-hidden-container")) {
  const containerAriaHidden =
    /<(div|section|main|aside|nav|article|header|footer)\b[^>]*aria-hidden\s*=\s*["'{]?\s*true/gi;
  if (containerAriaHidden.test(content)) {
    findings.push({
      id: "aria-hidden-container",
      message:
        'aria-hidden="true" on container element — if it has focusable children (links, buttons, inputs), they become inaccessible to screen readers',
    });
  }
}

// Check: <img> without loading attribute (below-fold lazy loading)
if (isEnabled("img-loading")) {
  for (const tag of imgTags) {
    const hasFill = /\bfill\b/i.test(tag);
    const hasPriority = /\bpriority\b/i.test(tag);
    const hasLoading = /\bloading\s*[={]/i.test(tag);
    if (!hasFill && !hasPriority && !hasLoading) {
      findings.push({
        id: "img-loading",
        message: `<${tag.match(/<(\w+)/)?.[1] || "img"}> without loading attribute — add loading="lazy" for below-fold images or priority for LCP images`,
      });
      break;
    }
  }
}

// Check: <a> with non-descriptive text
if (isEnabled("link-text")) {
  const anchorRegex =
    /<a\b[^>]*>\s*(click here|here|read more|learn more|more|link)\s*<\/a>/gi;
  if (anchorRegex.test(content)) {
    findings.push({
      id: "link-text",
      message:
        'Non-descriptive link text detected ("click here", "read more", etc.) — use descriptive text for SEO and accessibility',
    });
  }
}

// Check: <title> missing in HTML files
if (isEnabled("title-tag")) {
  if ((ext === ".html" || ext === ".astro") && !/<title[\s>]/i.test(content)) {
    findings.push({
      id: "title-tag",
      message:
        "No <title> tag detected in HTML file — required for SEO (Lighthouse Best Practices)",
    });
  }
}

// Check: Google Fonts loaded without display=swap
if (isEnabled("font-display-swap")) {
  const gfontsRegex = /fonts\.googleapis\.com\/css/i;
  if (gfontsRegex.test(content) && !/display=swap/i.test(content)) {
    findings.push({
      id: "font-display-swap",
      message:
        "Google Fonts loaded without display=swap — causes invisible text during font load (FOIT). Add &display=swap to the URL",
    });
  }
}

// Check: document.write usage
if (isEnabled("document-write")) {
  if (/document\.write\s*\(/i.test(content)) {
    findings.push({
      id: "document-write",
      message:
        "document.write() detected — blocks HTML parsing and is flagged by Lighthouse Best Practices. Use DOM manipulation instead",
    });
  }
}

// Check: render-blocking <script> in <head> without async/defer
if (isEnabled("render-blocking-script")) {
  const headScriptRegex =
    /<script\b(?![^>]*\b(async|defer|type\s*=\s*["']module["'])\b)[^>]*src\s*=/gi;
  if (headScriptRegex.test(content) && /<head\b/i.test(content)) {
    findings.push({
      id: "render-blocking-script",
      message:
        "Render-blocking <script src> in <head> without async or defer — delays page rendering. Add defer or move before </body>",
    });
  }
}

// --- Output by severity ---

if (findings.length === 0) {
  process.exit(0);
}

const warns = findings.filter((f) => getSeverity(f.id) === "warn");
const blocks = findings.filter((f) => getSeverity(f.id) === "block");

const allOutput = [...blocks, ...warns];
if (allOutput.length > 0) {
  const header = `⚠ Frontend Quality Gate (${filePath}):`;
  const body = allOutput
    .map((f) => {
      const prefix = getSeverity(f.id) === "block" ? "BLOCK" : "warn";
      return `  • [${prefix}] ${f.message}`;
    })
    .join("\n");
  process.stderr.write(`${header}\n${body}\n`);
}

// Exit 2 if any blocking findings, otherwise exit 0
process.exit(blocks.length > 0 ? 2 : 0);
