// clean-shots.mjs — load each page, dismiss splash, screenshot (NO interaction).
// For design review of the default state. Usage:
//   node test/clean-shots.mjs <baseUrl> <shotsDir> <skin> <path1> ...
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("/opt/homebrew/lib/node_modules/promptfoo/node_modules/playwright");
const [baseUrl, shotsDir, skin, ...paths] = process.argv.slice(2);
mkdirSync(shotsDir, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });
for (const p of paths) {
  const page = await ctx.newPage();
  if (skin && skin !== "default") await page.addInitScript((s) => { try { localStorage.setItem("kami.theme", s); } catch {} document.cookie = "kami.theme=" + s + "; path=/"; }, skin);
  try {
    await page.goto(baseUrl + p, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(500);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${shotsDir}/${(p.replace(/\//g, "_").replace(/^_|_$/g, "") || "index")}.png` });
    process.stdout.write(".");
  } catch (e) { process.stdout.write("x"); }
  await page.close();
}
console.log("\ndone");
await browser.close();
