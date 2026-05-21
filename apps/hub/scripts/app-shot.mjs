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
const THEMES = ["default", "brutalist", "terminal"];
const TARGETS = [
  { name: "case-converter", path: "/tools/case-converter" },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const theme of THEMES) {
    for (const t of TARGETS) {
      const page = await context.newPage();
      await page.addInitScript((th) => {
        try {
          localStorage.setItem("theme", th);
          if (th && th !== "default") document.documentElement.setAttribute("data-theme", th);
          else document.documentElement.removeAttribute("data-theme");
        } catch {}
      }, theme);
      await page.goto(BASE + t.path, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      const out = join(outDir, `app__${theme}__${t.name}.png`);
      await page.screenshot({ path: out });
      console.log("✓", theme, t.name, "→", out);
      await page.close();
    }
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
