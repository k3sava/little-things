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
const PAGES = [
  { name: "root", path: "/" },
  { name: "tools-hub", path: "/tools" },
  { name: "textkit", path: "/tools/textkit" },
  { name: "designkit", path: "/tools/designkit" },
  { name: "playground", path: "/playground" },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const theme of THEMES) {
    for (const p of PAGES) {
      const page = await context.newPage();
      // Set theme via localStorage BEFORE the page script runs
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("theme", t);
          if (t && t !== "default") document.documentElement.setAttribute("data-theme", t);
          else document.documentElement.removeAttribute("data-theme");
        } catch {}
      }, theme);

      const url = BASE + p.path;
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      // Give the theme-switcher client effect a tick
      await page.waitForTimeout(400);

      const out = join(outDir, `${theme}__${p.name}.png`);
      await page.screenshot({ path: out, fullPage: true });
      console.log("✓", theme, p.name, "→", out);
      await page.close();
    }
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
