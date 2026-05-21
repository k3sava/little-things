// verify.mjs — deep functional + design capture for one or more pages.
// Exercises every control in TWO passes (so controls that appear only after
// input are caught too), records throws/console errors, and saves a screenshot
// of each page for design review.
//
// Usage: node test/verify.mjs <baseUrl> <shotsDir> <path1> <path2> ...
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("/opt/homebrew/lib/node_modules/promptfoo/node_modules/playwright");

const [baseUrl, shotsDir, ...paths] = process.argv.slice(2);
mkdirSync(shotsDir, { recursive: true });

const SEL = "button:not([disabled]), [role=button], input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled]), [role=tab], [role=switch], a[href^='#'], summary";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light", permissions: ["clipboard-read", "clipboard-write"] });

async function exercise(page, h, errors) {
  const before = errors.length;
  let label = "?";
  try {
    if (!(await h.isVisible())) return null;
    const tag = await h.evaluate((el) => el.tagName.toLowerCase());
    const type = await h.evaluate((el) => el.getAttribute("type") || "");
    label = (await h.evaluate((el) => (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || el.getAttribute("name") || "").trim().slice(0, 36))) || `${tag}[${type}]`;
    if (tag === "input" && /^(text|search|email|url|tel|password|)$/.test(type)) await h.fill("test").catch(() => {});
    else if (tag === "input" && type === "number") await h.fill("42").catch(() => {});
    else if (tag === "input" && type === "range") await h.evaluate((el) => { el.value = el.max || "50"; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); });
    else if (tag === "input" && (type === "checkbox" || type === "radio")) await h.click({ timeout: 1200, force: true }).catch(() => {});
    else if (tag === "input" && type === "color") await h.evaluate((el) => { el.value = "#3366ff"; el.dispatchEvent(new Event("input", { bubbles: true })); });
    else if (tag === "input" && type === "date") await h.fill("2024-01-15").catch(() => {});
    else if (tag === "textarea") await h.fill("the quick brown fox jumps").catch(() => {});
    else if (tag === "select") { const n = await h.evaluate((el) => el.options.length); if (n > 1) await h.selectOption({ index: n - 1 }).catch(() => {}); }
    else await h.click({ timeout: 1200, force: true }).catch(() => {});
    await page.waitForTimeout(50);
    if (errors.length > before) return `✗ "${label}" → ${errors.slice(before).join(" | ")}`;
    return null;
  } catch (e) {
    return `✗ "${label}" threw: ${String(e.message).slice(0, 70)}`;
  }
}

let clean = 0, dirty = 0;
const lines = [];
for (const p of paths) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    // A resource 404 (e.g. validating a user-typed image URL) is not a broken
    // control — only flag real JS console errors.
    if (/Failed to load resource|net::ERR_|404|favicon/.test(t)) return;
    errors.push("console: " + t.slice(0, 120));
  });
  page.on("pageerror", (e) => errors.push("pageerror: " + String(e.message).slice(0, 120)));
  const issues = [];
  let count = 0;
  const seen = new Set();
  try {
    await page.goto(baseUrl + p, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(350);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(250);
    // two enumeration passes to catch controls that appear after interaction
    for (let pass = 0; pass < 2; pass++) {
      const handles = await page.$$(SEL);
      for (const h of handles) {
        let key;
        try { key = await h.evaluate((el) => (el.tagName + "|" + (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || el.name || "") + "|" + el.offsetTop + "," + el.offsetLeft).slice(0, 80)); }
        catch { continue; }
        if (seen.has(key)) continue;
        seen.add(key);
        const issue = await exercise(page, h, errors);
        count++;
        if (issue) issues.push(issue);
      }
    }
    await page.screenshot({ path: `${shotsDir}/${p.replace(/\//g, "_").replace(/^_|_$/g, "") || "index"}.png` }).catch(() => {});
  } catch (e) {
    issues.push("naverror: " + String(e.message).slice(0, 100));
  }
  if (issues.length === 0 && errors.length === 0) { clean++; lines.push(`✓ ${p} — ${count} controls`); }
  else { dirty++; lines.push(`✗ ${p} — ${count} controls, ${issues.length || errors.length} issue(s)`); for (const i of [...new Set(issues)].slice(0, 10)) lines.push("      " + i); if (!issues.length) for (const e of errors.slice(0, 4)) lines.push("      (load) " + e); }
  await page.close();
}
console.log(lines.join("\n"));
console.log(`\nverify: ${clean} clean, ${dirty} with issues (of ${paths.length})`);
await browser.close();
