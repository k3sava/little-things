#!/usr/bin/env node
// prebuild-aeo.mjs — generate AEO surface for apps.iamkesava.com.
// Outputs to public/:
//   llms.txt
//   .well-known/agent-permissions.json
//   og/default.svg + og/<route>.svg

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const PUB = join(ROOT, "public");
const SITE = "https://apps.iamkesava.com";

// Collections live on tools.iamkesava.com now. Apps cross-links to them but
// no longer hosts collection landing pages.
const TOOLS_SITE = "https://tools.iamkesava.com";
const COLLECTIONS = [
  { id: "developers", title: "Developers", description: "Encoding, hashing, formatting, and debugging utilities." },
  { id: "designers",  title: "Designers",  description: "Color, layout, animation, and visual design tools." },
  { id: "writers",    title: "Writers",    description: "Headline testing, readability scoring, and text editing." },
  { id: "pmm",        title: "PMM",        description: "Positioning, competitive analysis, and go-to-market tools." },
  { id: "ads",        title: "Ads",        description: "Campaign tracking, copy testing, and creative utilities." },
  { id: "pm",         title: "PM",         description: "Specs, competitive research, and stakeholder communication." },
  { id: "seo",        title: "SEO",        description: "Meta tags, structured data, and content optimization." },
  { id: "everyone",   title: "Everyone",   description: "PDF tools, file conversion, and everyday utilities." },
];

const PLAYGROUND = [
  { slug: "demokit", title: "DemoKit", description: "Capture and play back any web page as a demo. Bookmarklet for authenticated pages, URL fetch for public ones." },
  { slug: "stem-studio", title: "Stem Studio", description: "Upload any song. AI splits it into vocals, drums, bass, and other stems. Effects, pitch shift, time stretch, sample maker, mix export." },
  { slug: "zen-garden", title: "Zen Garden", description: "Ink and Void: a CSS Zen Garden submission. 1800 lines of pure CSS, scroll-driven animations, oklch color, @property, subgrid. Zero images, zero JS." },
];

async function writeLlms() {
  const lines = [
    "# Kami Studios apps",
    "",
    "> AI playground experiments and creative work by Kesava. Free, ad-free, no signup. apps.iamkesava.com is the home for kami's playground; tools and toys live on their own subdomains.",
    "",
    "## Index",
    "",
    `- [Sitemap](${SITE}/sitemap.xml): every canonical URL on apps.`,
    `- [Home](${SITE}/): playground entry, links out to tools + toys.`,
    `- [Tools](${TOOLS_SITE}/): 60+ free browser tools (separate domain, same builder). Collection pages live there now: ${TOOLS_SITE}/for/<slug>/.`,
    `- [Toys](https://toys.iamkesava.com/): creative experiments (audio, visual, generative).`,
    "",
    "## Agent discovery",
    "",
    `- [apps.json](${SITE}/apps.json): machine-readable catalog of playground entries.`,
    `- [Agent permissions](${SITE}/.well-known/agent-permissions.json): use rights, attribution, license.`,
    `- [API catalog](${SITE}/.well-known/api-catalog): RFC 9727 linkset to discoverable resources.`,
    `- [Agent skills](${SITE}/.well-known/agent-skills/index.json): Agent Skills Discovery v0.2 index.`,
    "",
    "## Playground (real iamkesava routes)",
    "",
    ...PLAYGROUND.map((p) => `- [${p.title}](${SITE}/playground/${p.slug}/): ${p.description}`),
    "",
    "## Tool collections (canonical URLs are on tools.iamkesava.com)",
    "",
    ...COLLECTIONS.map((c) => `- [${c.title}](${TOOLS_SITE}/for/${c.id}/): ${c.description}`),
    "",
    "## URL templates",
    "",
    `- Playground: \`${SITE}/playground/<slug>/\``,
    `- Tool collection: \`${TOOLS_SITE}/for/<slug>/\` (off-site, redirected from \`${SITE}/for/<slug>\`)`,
    "",
    "## License",
    "",
    "MIT for code; cite content with attribution to Kesava.",
  ];
  await writeFile(join(PUB, "llms.txt"), lines.join("\n"));
}

async function writeAppsJson() {
  const today = new Date().toISOString().slice(0, 10);
  const out = {
    $schema: `${SITE}/apps.schema.json`,
    site: SITE,
    license: "MIT",
    last_updated: today,
    counts: { playground: PLAYGROUND.length },
    playground: PLAYGROUND.map((p) => ({
      slug: p.slug,
      title: p.title,
      url: `${SITE}/playground/${p.slug}/`,
      description: p.description,
    })),
  };
  await writeFile(join(PUB, "apps.json"), JSON.stringify(out, null, 2));
}

async function writeAgentPermissions() {
  await mkdir(join(PUB, ".well-known"), { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const obj = {
    $schema: "https://addyosmani.com/agent-permissions/schema.json",
    policy_version: "1.0",
    site: SITE,
    license: "MIT",
    attribution_required: true,
    allowed_uses: [
      "read",
      "summarize",
      "cite",
      "answer-engine-indexing",
      "training-with-attribution",
      "embed-with-attribution",
    ],
    disallowed_uses: ["republish-without-attribution"],
    preferred_format: "html",
    canonical_index: `${SITE}/sitemap.xml`,
    discovery: [
      `${SITE}/llms.txt`,
      `${SITE}/sitemap.xml`,
      `${SITE}/robots.txt`,
    ],
    schema: {
      playground_url_template: `${SITE}/playground/{slug}/`,
    },
    related_sites: {
      tools: TOOLS_SITE,
      toys: "https://toys.iamkesava.com",
    },
    contact: "https://github.com/k3sava/kami/issues",
    counts: { playground: PLAYGROUND.length },
    last_updated: today,
  };
  await writeFile(join(PUB, ".well-known", "agent-permissions.json"), JSON.stringify(obj, null, 2));
}

const W = 1200, H = 630;
function escapeXml(s) {
  return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
}
function wrap(text, maxChars, maxLines = 3) {
  const words = (text || "").split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if (!line.length) { line = w; continue; }
    if ((line + " " + w).length <= maxChars) { line += " " + w; continue; }
    lines.push(line);
    line = w;
    if (lines.length >= maxLines) {
      lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:!?]?$/, "") + "…";
      return lines;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}
function ogSvg({ eyebrow, title, byline, accent = "#0a0a0a" }) {
  const titleLines = wrap(title, 32, 4);
  const lineH = 70;
  const startY = 230;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fafaf9"/>
      <stop offset="1" stop-color="#f0eee9"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${accent}"/>
  <g transform="translate(80, 60)">
    <circle cx="0" cy="14" r="6" fill="${accent}"/>
    <text x="16" y="20" font-family="DM Sans, system-ui, sans-serif" font-size="22" fill="#0a0a0a">apps.iamkesava</text>
  </g>
  ${eyebrow ? `<text x="80" y="170" font-family="JetBrains Mono, monospace" font-size="16" fill="#525252" letter-spacing="2">${escapeXml(eyebrow.toUpperCase())}</text>` : ""}
  ${titleLines.map((line, i) => `<text x="80" y="${startY + i * lineH}" font-family="Cormorant Garamond, serif" font-size="62" font-weight="500" fill="#0a0a0a">${escapeXml(line)}</text>`).join("\n  ")}
  ${byline ? `<text x="80" y="${startY + titleLines.length * lineH + 36}" font-family="JetBrains Mono, monospace" font-size="22" fill="#525252">${escapeXml(byline)}</text>` : ""}
  <text x="${W - 80}" y="${H - 60}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="14" fill="#737373">apps.iamkesava.com</text>
</svg>`;
}
async function writeOg() {
  const ogDir = join(PUB, "og");
  await rm(ogDir, { recursive: true, force: true });
  await mkdir(ogDir, { recursive: true });
  await writeFile(join(ogDir, "default.svg"), ogSvg({
    eyebrow: "tools, playgrounds, the little things",
    title: "the little things by Kesava",
    byline: "apps.iamkesava.com",
  }));
  // No collection OG cards on apps anymore — collection pages live on
  // tools.iamkesava.com which generates its own.
  for (const p of PLAYGROUND) {
    await writeFile(join(ogDir, `playground-${p.slug}.svg`), ogSvg({
      eyebrow: "playground",
      title: p.title,
      byline: p.description.split(".")[0],
      accent: "#8b5cf6",
    }));
  }
}

async function main() {
  console.log(`prebuild-aeo: ${PLAYGROUND.length} playground entries (collections live on tools.iamkesava.com)`);
  await writeLlms();
  await writeAppsJson();
  await writeAgentPermissions();
  await writeOg();
  console.log(`prebuild-aeo: wrote llms.txt, apps.json, agent-permissions.json, ${PLAYGROUND.length + 1} OG cards`);
}
main().catch((e) => { console.error(e); process.exit(1); });
