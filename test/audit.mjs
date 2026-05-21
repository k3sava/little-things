// audit.mjs — defect-revealing capture: load, dismiss splash, FULL-PAGE shot,
// per theme. This is the "actually look at every page" protocol.
// Usage: node test/audit.mjs <baseUrl> <shotsDir> <themesCSV> <path1> <path2> ...
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("/opt/homebrew/lib/node_modules/promptfoo/node_modules/playwright");

const [baseUrl, shotsDir, themesCSV, ...paths] = process.argv.slice(2);
const themes = (themesCSV || "default").split(",");
mkdirSync(shotsDir, { recursive: true });

const browser = await chromium.launch();
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });
  for (const p of paths) {
    const page = await ctx.newPage();
    if (theme !== "default") await page.addInitScript((s) => { try { localStorage.setItem("kami.theme", s); } catch {} document.cookie = "kami.theme=" + s + "; path=/"; }, theme);
    const slug = (p.replace(/\//g, "_").replace(/^_|_$/g, "") || "index");
    try {
      await page.goto(baseUrl + p, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(500);
      // dismiss splash: click center, then escape (covers both patterns)
      await page.mouse.click(640, 450).catch(() => {});
      await page.waitForTimeout(200);
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${shotsDir}/${slug}__${theme}.png`, fullPage: true }).catch(async () => {
        await page.screenshot({ path: `${shotsDir}/${slug}__${theme}.png` }).catch(() => {});
      });
      process.stdout.write(".");
    } catch (e) {
      process.stdout.write("x");
    }
    await page.close();
  }
  await ctx.close();
}
console.log("\naudit shots done");
await browser.close();
