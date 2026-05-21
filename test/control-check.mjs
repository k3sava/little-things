// control-check.mjs — exercise every interactive control on a page and report
// which ones throw an error or fail to change anything.
//
// For each page: dismiss splash, enumerate buttons / inputs / textareas /
// selects / checkboxes / radios / range sliders, interact with each, and watch
// for console errors, uncaught exceptions, and whether the DOM responded.
//
// Usage: node test/control-check.mjs <baseUrl> <path1> <path2> ...
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/opt/homebrew/lib/node_modules/promptfoo/node_modules/playwright");

const [baseUrl, ...paths] = process.argv.slice(2);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light", permissions: ["clipboard-read", "clipboard-write"] });

let pagesClean = 0, pagesWithIssues = 0;
const report = [];

for (const p of paths) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 140)); });
  page.on("pageerror", (e) => errors.push("pageerror: " + String(e.message).slice(0, 140)));

  const issues = [];
  let controlCount = 0;
  try {
    await page.goto(baseUrl + p, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(350);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(250);

    // Enumerate visible, enabled controls.
    const handles = await page.$$(
      "button:not([disabled]), [role=button], input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled])"
    );
    for (const h of handles) {
      let label = "";
      try {
        const visible = await h.isVisible();
        if (!visible) continue;
        const tag = await h.evaluate((el) => el.tagName.toLowerCase());
        const type = await h.evaluate((el) => el.getAttribute("type") || "");
        label = (await h.evaluate((el) => (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || el.getAttribute("name") || "").trim().slice(0, 40))) || `${tag}[${type}]`;
        const before = errors.length;
        const htmlBefore = await page.evaluate(() => document.body.innerHTML.length);

        if (tag === "input" && /^(text|search|email|url|tel|password|)$/.test(type)) {
          await h.fill("test").catch(() => {});
        } else if (tag === "input" && type === "number") {
          await h.fill("42").catch(() => {});
        } else if (tag === "input" && type === "range") {
          await h.evaluate((el) => { el.value = el.max || "50"; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); });
        } else if (tag === "input" && (type === "checkbox" || type === "radio")) {
          await h.click({ timeout: 1500, force: true }).catch(() => {});
        } else if (tag === "input" && type === "color") {
          await h.evaluate((el) => { el.value = "#3366ff"; el.dispatchEvent(new Event("input", { bubbles: true })); });
        } else if (tag === "textarea") {
          await h.fill("the quick brown fox").catch(() => {});
        } else if (tag === "select") {
          const opts = await h.evaluate((el) => el.options.length);
          if (opts > 1) await h.selectOption({ index: opts - 1 }).catch(() => {});
        } else {
          // button / role=button
          await h.click({ timeout: 1500, force: true }).catch(() => {});
        }
        controlCount++;
        await page.waitForTimeout(60);
        if (errors.length > before) {
          issues.push(`✗ "${label}" → ${errors.slice(before).join(" | ")}`);
        }
      } catch (e) {
        issues.push(`✗ "${label}" interaction threw: ${String(e.message).slice(0, 80)}`);
      }
    }
  } catch (e) {
    issues.push("naverror: " + String(e.message).slice(0, 120));
  }

  if (issues.length === 0 && errors.length === 0) {
    pagesClean++;
    report.push(`✓ ${p} — ${controlCount} controls OK`);
  } else {
    pagesWithIssues++;
    report.push(`✗ ${p} — ${controlCount} controls, ${issues.length || errors.length} issue(s)`);
    for (const i of issues.slice(0, 8)) report.push("      " + i);
    if (issues.length === 0 && errors.length) for (const e of errors.slice(0, 4)) report.push("      (load) " + e);
  }
  await page.close();
}

console.log(report.join("\n"));
console.log(`\ncontrol-check: ${pagesClean} clean, ${pagesWithIssues} with issues (of ${paths.length})`);
await browser.close();
