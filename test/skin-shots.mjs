// skin-shots.mjs — screenshot a page across skins by setting data-theme pre-load.
// Usage: NODE_PATH=$PF node test/skin-shots.mjs <baseUrl> <path> <outPrefix> skin1,skin2,...
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || "/opt/homebrew/lib/node_modules/promptfoo/node_modules/playwright");

const [baseUrl, pagePath, outPrefix, skinsArg] = process.argv.slice(2);
const skins = (skinsArg || "brutalist,glass,editorial,terminal").split(",");

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });

for (const skin of skins) {
  const page = await ctx.newPage();
  // Set theme cookie + localStorage before the page's bootstrap runs.
  await page.addInitScript((s) => {
    try { localStorage.setItem("kami.theme", s); } catch (e) {}
    document.cookie = "kami.theme=" + s + "; path=/";
  }, skin);
  await page.goto(baseUrl + pagePath, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  // Dismiss the one-time splash overlay if present (Escape closes it without
  // navigating, unlike a click which can hit a link on splash-less pages).
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(500);
  const file = `${outPrefix}-${skin}.png`;
  await page.screenshot({ path: file, fullPage: false });
  console.log("shot:", file);
  await page.close();
}
await browser.close();
