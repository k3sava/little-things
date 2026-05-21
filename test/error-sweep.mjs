// error-sweep.mjs — load every page under a base URL and report JS errors.
// Catches console.error + uncaught pageerror + failed network requests.
// Usage: node test/error-sweep.mjs <baseUrl> <slug1> <slug2> ...
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/opt/homebrew/lib/node_modules/promptfoo/node_modules/playwright");

const [baseUrl, ...paths] = process.argv.slice(2);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });

let clean = 0, dirty = 0;
for (const p of paths) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 160)); });
  page.on("pageerror", (e) => errors.push("pageerror: " + String(e.message).slice(0, 160)));
  page.on("requestfailed", (r) => {
    const u = r.url();
    // ignore favicon / analytics noise
    if (/favicon|analytics|gtag|plausible/.test(u)) return;
    errors.push("reqfail: " + u.slice(0, 120) + " (" + (r.failure()?.errorText || "?") + ")");
  });
  try {
    await page.goto(baseUrl + p, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(400);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(400);
  } catch (e) {
    errors.push("naverror: " + String(e.message).slice(0, 120));
  }
  if (errors.length) {
    dirty++;
    console.log(`✗ ${p}`);
    for (const e of errors) console.log(`    ${e}`);
  } else {
    clean++;
  }
  await page.close();
}
console.log(`\nerror-sweep: ${clean} clean, ${dirty} with errors (of ${paths.length})`);
await browser.close();
