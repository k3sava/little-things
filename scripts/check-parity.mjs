#!/usr/bin/env node
// check-parity.mjs — guards against drift of shared chrome.
//
// Footer, ThemeSwitcher, and AppCard live in exactly one place: the kami-ui
// package. Each app must import them from "kami-ui". If an app re-creates one
// of these components locally, the three sites silently diverge (the exact
// bug class this guardrail exists to prevent). Fail the build when that
// happens.

import { readdir } from "node:fs/promises";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const APPS_DIR = join(ROOT, "apps");

// Basenames that must NOT exist as local components in any app — they belong
// to kami-ui. help-footer.tsx etc. are deliberately different names.
const FORBIDDEN = new Set([
  "footer.tsx",
  "kami-footer.tsx",
  "theme-switcher.tsx",
  "app-card.tsx",
]);

async function walk(dir, hits) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return hits;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next" || e.name === "out") continue;
      await walk(full, hits);
    } else if (FORBIDDEN.has(basename(e.name))) {
      hits.push(full);
    }
  }
  return hits;
}

async function main() {
  const apps = (await readdir(APPS_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => join(APPS_DIR, d.name, "src"));

  const hits = [];
  for (const src of apps) await walk(src, hits);

  if (hits.length) {
    console.error("✗ parity check failed — shared chrome must come from kami-ui, not local copies:\n");
    for (const h of hits) console.error("  " + h.replace(ROOT + "/", ""));
    console.error('\nDelete these files and import { Footer, ThemeSwitcher, AppCard } from "kami-ui".');
    process.exit(1);
  }

  console.log("✓ parity check passed — Footer/ThemeSwitcher/AppCard are single-sourced from kami-ui.");
}

main().catch((e) => { console.error(e); process.exit(1); });
