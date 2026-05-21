import { createRequire } from "node:module";
const require = createRequire("/Users/k3sava/projects/portfolio/");
const { chromium } = require("playwright");
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "shots");
mkdirSync(outDir, { recursive: true });

const BASE = process.env.BASE_URL || "http://localhost:3030";
const THEMES = ["default", "brutalist", "editorial", "terminal", "zen"];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
  });

  for (const theme of THEMES) {
    const page = await context.newPage();
    await page.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t);
        if (t && t !== "default") document.documentElement.setAttribute("data-theme", t);
        else document.documentElement.removeAttribute("data-theme");
      } catch {}
    }, theme);

    await page.goto(BASE + "/tools/textkit", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    // Hover over the first QuickToolCard (Case Converter in featured section)
    const card = page.locator("text=Case Converter").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover({ force: true });
    await page.waitForTimeout(600); // wait for fade

    const out = join(outDir, `hover__${theme}__textkit.png`);
    await page.screenshot({ path: out });
    console.log("✓ hover", theme, "→", out);
    await page.close();
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
