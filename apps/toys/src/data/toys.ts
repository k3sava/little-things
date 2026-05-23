// Single source of truth for the toys hub. Imported by hub-content.tsx,
// sitemap.ts, prebuild-aeo, and aggregate-toys.
//
// Every toy now lives at toys.iamkesava.com/<slug>/ — aggregated from each
// toy's standalone GitHub repo at build time. The original
// k3sava.github.io/<toy>/ URL still serves for code-share, but
// toys.iamkesava.com is the canonical and where citations land.

export interface Toy {
  title: string;
  badge: string;
  description: string;
  href: string;        // canonical URL (toys.iamkesava.com path or external)
  external?: boolean;  // false for hub-aggregated, true for external
  slug?: string;       // for aggregated toys, the local slug
  embed?: boolean;     // single-canvas toys rendered via the shared ToyShell (iframe), so chrome === hub/tools
}

export interface ToyGroup {
  label: string;
  accentHex: string;
  apps: Toy[];
}

export const groups: ToyGroup[] = [
  {
    label: "Audio",
    accentHex: "#f97316",
    apps: [
      { slug: "sonicc",     title: "sonicc",      badge: "music",    description: "Keys, drums, pattern sequencer, sampler, and mic recorder. 16 presets, 9 waveforms, 12 FX, stereo knobs, MIDI support, WAV export.", href: "/sonicc/" },
      { slug: "plink",      title: "Plink",       badge: "audio",    description: "Drop marbles and hear them play. A pentatonic plinko board where every bounce is a note. Click pegs to toggle them.", href: "/plink/", embed: true },
      { slug: "synth-pad",  title: "Synth Pad",   badge: "audio",    description: "Touch or click and drag to play. An XY pad instrument with pentatonic tuning and warm oscillators.", href: "/synth-pad/", embed: true },
    ],
  },
  {
    label: "Visual",
    accentHex: "#8b5cf6",
    apps: [
      { slug: "kaleidoscopic", title: "Kaleidoscopic", badge: "WebGL",      description: "Upload any image and watch it fold into living geometry. 8 symmetry patterns, real-time WebGL rendering, video recording.", href: "/kaleidoscopic/", embed: true },
      { slug: "aurora",        title: "Aurora",        badge: "ambient",    description: "Move your cursor through living light. An interactive aurora borealis rendered in real time.", href: "/aurora/", embed: true },
      { slug: "string-art",    title: "String Art",    badge: "generative", description: "Modular multiplication on geometric shapes creates impossibly intricate patterns. Move your cursor to shape the strings.", href: "/string-art/", embed: true },
    ],
  },
  {
    label: "Simulation",
    accentHex: "#0ea5e9",
    apps: [
      { slug: "gravity-type",  title: "Gravity Type",  badge: "physics",    description: "Type anything and watch it fall. Letters tumble, stack, and scatter with real physics. Click to explode.", href: "/gravity-type/", embed: true },
      { slug: "particle-life", title: "Particle Life", badge: "simulation", description: "Colored particles follow simple attraction rules and create complex, organic behavior. Click to create a new universe.", href: "/particle-life/", embed: true },
    ],
  },
  {
    label: "Generative",
    accentHex: "#10b981",
    apps: [
      { slug: "aurea", title: "Aurea", badge: "math art", description: "Fibonacci-driven parametric line art. 6 original forms, 4K rendering, video recording. Thousands of lines from pure equations, biology from math.", href: "/aurea/", embed: true },
      { slug: "form", title: "FORM", badge: "typography", description: "Type a phrase, the system arranges it like a typographer. Five design philosophies (Swiss, Editorial, Brutalist, Kinetic, Painterly) plus a blend lab. PNG or video.", href: "/form/" },
      { slug: "wordart", title: "wordart", badge: "typography", description: "Type a phrase, pick an effect, export it. Eight canvas effects (line, slice, blur, dither, type, halftone, glitch, mesh) share one chrome with keyboard shortcuts, theme cycling, PNG snapshots, and a 15 s offline MP4 render.", href: "/wordart/" },
      { slug: "pixart", title: "pixart", badge: "image + video", description: "Drop an image or video, pick an effect. 28 canvas effects across 8 categories (type, tonal, halftone, geometric, cinematic, painterly, glitch, generative). 20 s seamless loops, PNG + MP4 export.", href: "/pixart/" },
      { slug: "poster", title: "poster", badge: "art direction", description: "Type a phrase, idea, or article. Two art directors compose two completely different posters. 12 directors, 10 template families, 45,408 variants. Every decision shown, every decision editable. Deterministic.", href: "/poster/" },
    ],
  },
  {
    label: "Craft",
    accentHex: "#f43f5e",
    apps: [
      { title: "Zen Garden", badge: "CSS art", description: "Ink and Void, a CSS Zen Garden submission. 1800+ lines of pure CSS: scroll-driven animations, oklch color, @property, subgrid. Zero images, zero JS.", href: "https://apps.iamkesava.com/playground/zen-garden", external: true },
    ],
  },
];

export const allToys = groups.flatMap((g) => g.apps);

// Slugs of toys that live at toys.iamkesava.com/<slug>/ (aggregated, internal).
export const aggregatedSlugs = allToys.filter((t) => t.slug && !t.external).map((t) => t.slug as string);

// Single-canvas toys rendered through the shared ToyShell (Next route + iframe).
// Their chrome (header, footer, theme toggle) is the SAME as the hub/tools by
// construction; the raw toy is served un-chromed from /e/<slug>/.
export const embedToys = allToys.filter((t) => t.embed && t.slug && !t.external) as (Toy & { slug: string })[];
export const embedSlugs = embedToys.map((t) => t.slug);
export const isEmbedSlug = (slug: string) => embedSlugs.includes(slug);
export const getToyBySlug = (slug: string) => allToys.find((t) => t.slug === slug);
