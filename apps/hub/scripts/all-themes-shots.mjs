import { createRequire } from "node:module";
const require = createRequire("/Users/k3sava/projects/portfolio/");
const { chromium } = require("playwright");
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "shots", "themes");
mkdirSync(outDir, { recursive: true });

const BASE = process.env.BASE_URL || "http://localhost:3030";
const THEMES = ["default", "brutalist", "editorial", "terminal", "zen"];
const PAGES = [
  { name: "root", path: "/" },
  { name: "playground", path: "/playground" },
  { name: "tools-hub", path: "/tools" },
  { name: "textkit", path: "/tools/textkit" },
  { name: "character-counter", path: "/tools/character-counter" },
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
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("theme", t);
          if (t === "default") {
            document.documentElement.removeAttribute("data-theme");
          } else {
            document.documentElement.setAttribute("data-theme", t);
          }
        } catch {}
      }, theme);
      try {
        await page.goto(BASE + p.path, { waitUntil: "networkidle", timeout: 30000 });
      } catch (e) {
        console.error("! goto failed", theme, p.name, e.message);
      }
      await page.waitForTimeout(600);
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
