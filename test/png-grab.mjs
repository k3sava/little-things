import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/opt/homebrew/lib/node_modules/promptfoo/node_modules/playwright");
const browser = await chromium.launch();
const ctx = await browser.newContext({ colorScheme: "light", acceptDownloads: true, permissions: ["clipboard-read","clipboard-write"] });
const page = await ctx.newPage();
await page.goto("http://localhost:8231/comparison-table/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600); await page.keyboard.press("Escape"); await page.waitForTimeout(300);
const [dl] = await Promise.all([
  page.waitForEvent("download", { timeout: 8000 }),
  page.getByText("Download PNG", { exact: false }).first().click(),
]);
await dl.saveAs("test/shots/comparison.png");
console.log("saved:", await dl.suggestedFilename());
await browser.close();
