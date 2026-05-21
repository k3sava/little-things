#!/usr/bin/env node
// Wire per-page Schema.org @graph + per-page OG meta for the remaining
// real iamkesava routes:
//   - src/app/for/<slug>/layout.tsx → CollectionPage + BreadcrumbList
//   - src/app/playground/<slug>/page.tsx → SoftwareApplication
// Idempotent: skips files that already import JsonLd.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const APP = join(ROOT, "src", "app");
const SITE = "https://apps.iamkesava.com";

async function loadCollections() {
  const src = await readFile(join(ROOT, "src", "data", "tools.ts"), "utf8");
  const colsM = src.match(/export const collections[^=]*=\s*\[([\s\S]*?)\n\];/);
  const cols = new Map();
  if (!colsM) return cols;
  for (const block of colsM[1].split(/\n\s*\{/).slice(1)) {
    const entry = "{" + block;
    const get = (k) => (entry.match(new RegExp(`${k}\\s*:\\s*"([^"]*)"`)) || [])[1] || "";
    const id = get("id");
    if (id) cols.set(id, { id, title: get("title"), description: get("description"), href: get("href") });
  }
  return cols;
}

async function wireCollections() {
  const cols = await loadCollections();
  let updated = 0;
  for (const [slug, col] of cols) {
    const layoutPath = join(APP, "for", slug, "layout.tsx");
    let src;
    try { src = await readFile(layoutPath, "utf8"); }
    catch { console.log(`  skip ${slug}: no layout.tsx`); continue; }
    if (src.includes("@/lib/json-ld")) { continue; }
    const url = SITE + col.href + "/";
    const og = `${SITE}/og/for-${slug}.svg`;
    const title = `Free tools for ${col.title.toLowerCase()}, by Kesava`;
    const description = col.description;
    const next = `import type { Metadata } from "next";
import { JsonLd, collectionLd } from "@/lib/json-ld";

const url = "${url}";
const title = "${title}";
const description = "${description.replace(/"/g, '\\"')}";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "Kesava" }],
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: "Kami Studios",
    type: "website",
    images: [{ url: "${og}", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["${og}"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={collectionLd({
          id: "${col.id}",
          title: "${col.title}",
          description: "${col.description.replace(/"/g, '\\"')}",
          hrefSegment: "${col.href}/",
        })}
      />
      {children}
    </>
  );
}
`;
    await writeFile(layoutPath, next);
    console.log(`  wrote for/${slug}/layout.tsx`);
    updated++;
  }
  return updated;
}

const PLAYGROUND = [
  {
    slug: "demokit",
    name: "DemoKit",
    description: "Capture and play back any web page as a demo. Bookmarklet for authenticated pages, URL fetch for public ones. Annotations, hotspots, exportable to share.",
  },
  {
    slug: "stem-studio",
    name: "Stem Studio",
    description: "Upload any song. AI splits it into vocals, drums, bass, and other stems. Effects, pitch shift, time stretch, sample maker, mix export. All in your browser.",
  },
  {
    slug: "zen-garden",
    name: "Ink and Void",
    description: "A CSS Zen Garden submission using modern CSS. Scroll-driven animations, oklch color, @property, subgrid, container queries. 1800 lines of pure CSS, zero images, zero JavaScript.",
  },
];

async function wirePlayground() {
  let updated = 0;
  for (const p of PLAYGROUND) {
    const pagePath = join(APP, "playground", p.slug, "page.tsx");
    let src;
    try { src = await readFile(pagePath, "utf8"); }
    catch { console.log(`  skip playground/${p.slug}: no page.tsx`); continue; }
    if (src.includes("@/lib/json-ld")) { continue; }
    const url = `${SITE}/playground/${p.slug}`;
    const og = `${SITE}/og/playground-${p.slug}.svg`;
    const ldArg = JSON.stringify({
      url,
      name: p.name,
      description: p.description,
    });
    // Inject import after the first existing import line.
    const firstImport = src.match(/^import [^\n]+\n/m);
    if (!firstImport) continue;
    let next = src.replace(firstImport[0], firstImport[0] + `import { JsonLd, solutionLd } from "@/lib/json-ld";\n`);
    // Inject openGraph.images + twitter.images + per-page OG into metadata
    next = next.replace(/openGraph:\s*\{([^}]*)\}/m, (m, inner) => {
      if (/images\s*:/.test(inner)) return m;
      const trimmed = inner.replace(/,\s*$/, "");
      return `openGraph: {${trimmed},\n    images: [{ url: "${og}", width: 1200, height: 630 }]\n  }`;
    });
    next = next.replace(/twitter:\s*\{([^}]*)\}/m, (m, inner) => {
      let updated = inner;
      if (!/images\s*:/.test(updated)) {
        updated = updated.replace(/,?\s*$/, "");
        updated += `,\n    images: ["${og}"]`;
      }
      if (/card\s*:\s*"summary"/.test(updated)) {
        updated = updated.replace(/card\s*:\s*"summary"/, 'card: "summary_large_image"');
      }
      return `twitter: {${updated}\n  }`;
    });
    // Inject <JsonLd /> as the first JSX child of the page's return.
    // Match the `return (` shape; insert `<JsonLd ... />` right after the
    // opening fragment / wrapper. We use a function-export shape.
    next = next.replace(/return\s*\(\s*</, `return (\n    <>\n      <JsonLd data={solutionLd(${ldArg})} />\n      <`);
    // Close the fragment we opened. The original return ended with `);` — leave a placeholder
    // we wrap manually below. Instead of regex, simpler approach: also insert a closing fragment.
    // Find the last `);` of the file and prepend `</> ` to it.
    const lastClose = next.lastIndexOf(");");
    if (lastClose > 0) {
      next = next.slice(0, lastClose) + "</>\n  );" + next.slice(lastClose + 2);
    }
    await writeFile(pagePath, next);
    console.log(`  wrote playground/${p.slug}/page.tsx`);
    updated++;
  }
  return updated;
}

async function main() {
  const a = await wireCollections();
  const b = await wirePlayground();
  console.log(`\nwire-per-page-jsonld: ${a} collection layouts, ${b} playground pages`);
}
main().catch((e) => { console.error(e); process.exit(1); });
