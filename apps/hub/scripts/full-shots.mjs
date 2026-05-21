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
const PAGES = [
  { name: "root", path: "/" },
  { name: "playground", path: "/playground" },
  { name: "tools-hub", path: "/tools" },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  for (const p of PAGES) {
    const page = await context.newPage();
    await page.addInitScript(() => {
      try {
        localStorage.setItem("theme", "brutalist");
        document.documentElement.setAttribute("data-theme", "brutalist");
      } catch {}
    });
    await page.goto(BASE + p.path, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const out = join(outDir, `full__brutalist__${p.name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log("✓", p.name, "→", out);
    await page.close();
  }
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
