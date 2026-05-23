import type { Metadata } from "next";
import { AppCard } from "kami-ui";
import { KamiHeader } from "@/components/kami-header";
import { Footer } from "kami-ui";
import { allTools } from "@/data/tools";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "the little things, tools and experiments by Kesava",
  description:
    "Free browser-based tools, open-source Human+AI experiments, and creative toys. Nothing installs, nothing uploads, everything runs right here.",
  authors: [{ name: "Kesava" }],
  alternates: { canonical: "https://apps.iamkesava.com" },
  openGraph: {
    title: "the little things, tools and experiments by Kesava",
    description:
      "Free browser-based tools, open-source Human+AI experiments, and creative toys.",
    url: "https://apps.iamkesava.com",
  },
};

const playgroundApps = [
  { title: "Kaleidoscopic", badge: "WebGL", description: "Upload any image and watch it fold into living geometry. 8 symmetry patterns, real-time WebGL.", href: "https://k3sava.github.io/kaleidoscopic/", external: true },
  { title: "Synth Pad", badge: "audio", description: "Touch or click and drag to play. An XY pad instrument with pentatonic tuning.", href: "https://k3sava.github.io/synth-pad/", external: true },
  { title: "Gravity Type", badge: "physics", description: "Type anything and watch it fall. Letters tumble, stack, and scatter with real physics.", href: "https://k3sava.github.io/gravity-type/", external: true },
  { title: "Plink", badge: "audio", description: "Drop marbles and hear them play. A pentatonic plinko board where every bounce is a note.", href: "https://k3sava.github.io/plink/", external: true },
  { title: "Aurora", badge: "ambient", description: "Move your cursor through living light. An interactive aurora borealis rendered in real time.", href: "https://k3sava.github.io/aurora/", external: true },
  { title: "String Art", badge: "generative", description: "Modular multiplication on geometric shapes creates impossibly intricate patterns.", href: "https://k3sava.github.io/string-art/", external: true },
  { title: "Particle Life", badge: "simulation", description: "Colored particles follow simple attraction rules and create complex, organic behavior.", href: "https://k3sava.github.io/particle-life/", external: true },
  { title: "Zen Garden", badge: "CSS art", description: "Ink and Void, a CSS Zen Garden submission. 1800+ lines of pure CSS, zero images, zero JS.", href: "/playground/zen-garden" },
  { title: "Aurea", badge: "math art", description: "Fibonacci-driven parametric line art. 6 forms, 4K rendering, video recording. Pure math.", href: "https://k3sava.github.io/aurea/", external: true },
];

interface RepoCard {
  name: string;
  tagline: string;
  description: string;
  href: string;
}

const iosApps = [
  {
    name: "Kaleidoscopic",
    tagline: "iOS + iPadOS",
    description:
      "Live kaleidoscope patterns from your camera or photo library. 12 symmetries, 4 animation personalities, Metal shaders, seamless video loops. Coming to App Store.",
  },
  {
    name: "sonicc",
    tagline: "iOS + iPadOS",
    description:
      "Keys, drums, sequencer, sampler, and MIDI — native on iPhone and iPad. AVAudioEngine, Core MIDI, three-pane iPad layout. Coming to App Store.",
  },
];

const humanAiApps: RepoCard[] = [
  {
    name: "a builder's codex",
    tagline: "operator insight library",
    description:
      "Atomic operator-attributed claims with mechanism, conditions, evidence, signals, counter-evidence. Free to cite. The codex is opinionated about epistemics so you don't have to be.",
    href: "https://codex.iamkesava.com/",
  },
  {
    name: "marker",
    tagline: "slides CLI",
    description:
      "Render a JSON file as a slide deck. Edit inline, click to add comments, one command to build. Takes 3 minutes, not 30.",
    href: "https://github.com/k3sava/marker",
  },
  {
    name: "chalk",
    tagline: "edit-in-place",
    description:
      "Writer edits inline. Designer comments on the real page. AI applies. No more doc-to-Figma-to-code transcription.",
    href: "https://github.com/k3sava/chalk",
  },
  {
    name: "curiosity",
    tagline: "research agent",
    description:
      "Ingest any link, auto-analyze topics, surface knowledge gaps, and chase what you care about. Curiosity makes the cat.",
    href: "https://github.com/k3sava/curiosity",
  },
];

function SectionHeading({ title, link, meta }: { title: string; link?: { href: string; label: string }; meta?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="kami-header-name" style={{ fontSize: "1rem" }}>{title}</h2>
      {link ? (
        <a href={link.href} style={{ fontSize: "0.72rem", color: "var(--kami-text-muted)" }}>{link.label} →</a>
      ) : null}
      {meta ? <span style={{ fontSize: "0.72rem", color: "var(--kami-text-dim)" }}>{meta}</span> : null}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <KamiHeader name="the little things" desc="apps · tools · toys" />

      <main id="main" className="mx-auto w-[92%] max-w-[1100px] py-12 sm:py-16">
        {/* Hero */}
        <div className="mx-auto mb-12 max-w-[760px] text-center">
          <h1
            className="kami-card"
            style={{
              border: "none",
              boxShadow: "none",
              background: "transparent",
              padding: 0,
              fontFamily: "var(--kami-font-display)",
              fontWeight: "var(--kami-heading-weight)" as unknown as number,
              textTransform: "var(--kami-heading-case)" as unknown as "none",
              letterSpacing: "var(--kami-heading-tracking)",
              fontSize: "clamp(2rem, 6vw, 3rem)",
              margin: 0,
            }}
          >
            the little things
          </h1>
          <p style={{ margin: "20px auto 0", maxWidth: "62ch", color: "var(--kami-text-muted)", lineHeight: 1.6 }}>
            Free browser-based utilities for writing, design, and dev, fun little apps for play, and open-source projects.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="https://tools.iamkesava.com" className="kami-btn">Browse all tools</a>
            <a
              href="https://toys.iamkesava.com"
              className="kami-btn"
              style={{ background: "var(--kami-surface-solid)", color: "var(--kami-text)", border: "var(--kami-card-border)" }}
            >
              Playground
            </a>
          </div>
        </div>

        {/* Latest banner */}
        <a href="https://codex.iamkesava.com/" rel="noopener" style={{ textDecoration: "none", color: "inherit", display: "block", marginBottom: 40 }}>
          <div className="kami-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--kami-text-dim)" }}>
              <span style={{ display: "inline-block", height: 6, width: 6, borderRadius: "50%", background: "var(--kami-accent)" }} />
              Latest
            </div>
            <h2 className="kami-header-name" style={{ fontSize: "1.4rem" }}>a builder&apos;s codex</h2>
            <p style={{ margin: 0, maxWidth: "64ch", color: "var(--kami-text-muted)", lineHeight: 1.6, fontSize: "0.9rem" }}>
              An open, primary-source library of operator insights. Atomic claims, named operators, verifiable sources. 150 cards · 190 operators · 24 synthesis patterns.
            </p>
            <span className="kami-btn" style={{ alignSelf: "flex-start", fontSize: "0.72rem", padding: "6px 14px" }}>Open codex →</span>
          </div>
        </a>

        <section className="mb-10">
          <SectionHeading title="Tools" link={{ href: "https://tools.iamkesava.com", label: "explore all tools" }} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {allTools
              .slice()
              .sort(() => Math.random() - 0.5)
              .slice(0, 3)
              .map((tool) => (
                <AppCard key={tool.href} title={tool.name} description={tool.description} href={tool.href} ctaLabel="Open tool" minHeight={156} />
              ))}
          </div>
        </section>

        <section className="mb-10">
          <SectionHeading title="Toys" link={{ href: "https://toys.iamkesava.com", label: "explore all toys" }} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {playgroundApps
              .slice()
              .sort(() => Math.random() - 0.5)
              .slice(0, 3)
              .map((app) => (
                <AppCard key={app.href} title={app.title} badge={app.badge} description={app.description} href={app.href} external={(app as { external?: boolean }).external} minHeight={156} />
              ))}
          </div>
        </section>

        <section className="mb-10">
          <SectionHeading title="Human + AI" meta="open source · github" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {humanAiApps.map((app) => (
              <AppCard key={app.href} title={app.name} description={app.description} href={app.href} subtitle={app.tagline} external ctaLabel="View on GitHub" minHeight={172} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <SectionHeading title="iOS + iPad" meta="coming to App Store" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {iosApps.map((app) => (
              <div key={app.name} className="kami-card">
                <div className="mb-1 flex items-center gap-2">
                  <span className="kami-header-name" style={{ fontSize: "0.9rem" }}>{app.name}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--kami-text-dim)" }}>{app.tagline}</span>
                </div>
                <p style={{ fontSize: "0.84rem", color: "var(--kami-text-muted)", lineHeight: 1.5 }}>{app.description}</p>
                <div style={{ marginTop: 12, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--kami-accent)" }}>
                  Coming soon
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-[760px] text-center">
          <p style={{ fontSize: "0.9rem", color: "var(--kami-text-muted)", lineHeight: 1.6 }}>
            No sign-up, no downloads, no server-side stuff. Every app runs on-device in your browser. The GitHub projects are open source: fork it, or install locally.
          </p>
        </div>
      </main>

      <Footer current="apps" dataFile={{ label: "apps.json", href: "/apps.json" }} />
    </div>
  );
}
