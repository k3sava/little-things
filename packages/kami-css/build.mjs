import { readFileSync, writeFileSync, watch } from "fs";
import { join } from "path";

const SRC = join(import.meta.dirname, "src");
const OUT = join(import.meta.dirname, "kami.css");

const FILES = [
  "01-tokens.css",
  "02-skins.css",
  "03-dark.css",
  "04-layout.css",
  "05-chrome.css",
  "06-animations.css",
];

function build() {
  const banner = `/* kami.css — built ${new Date().toISOString()} — do not edit directly */\n\n`;
  const css = FILES.map((f) => {
    const content = readFileSync(join(SRC, f), "utf-8");
    return `/* === ${f} === */\n${content}`;
  }).join("\n\n");
  writeFileSync(OUT, banner + css, "utf-8");
  console.log(`[kami-css] built → kami.css (${(banner.length + css.length / 1024).toFixed(1)}kb)`);
}

build();

if (process.argv.includes("--watch")) {
  console.log("[kami-css] watching src/ for changes...");
  watch(SRC, () => {
    try { build(); } catch (e) { console.error("[kami-css] build error:", e.message); }
  });
}
