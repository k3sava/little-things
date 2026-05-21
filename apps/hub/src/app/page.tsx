import type { Metadata } from "next";
import Link from "next/link";
import { AppCard } from "@/components/app-card";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { allTools } from "@/data/tools";
import { HomeHero } from "@/components/home-hero";

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

export default function Home() {
  return (
    <div className="kami-scope min-h-screen">
      <AppHeader />

      <HomeHero />

      <a
        href="https://codex.iamkesava.com/"
        rel="noopener"
        className="home-latest-banner latest-hero group relative block w-full overflow-hidden border-b transition-colors"
      >
        <div className="mx-auto flex w-[92%] max-w-[1600px] flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-12 sm:py-14">
          <div className="flex-1">
            <div className="home-latest-eyebrow mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em]">
              <span className="inline-block h-1.5 w-1.5 rounded-full home-latest-dot" />
              Latest
            </div>
            <h2 className="home-latest-title text-2xl font-semibold tracking-tight sm:text-4xl">
              a builder's codex
            </h2>
            <p className="home-latest-desc mt-3 max-w-[64ch] text-sm leading-6 sm:text-base">
              An open, primary-source library of operator insights. Atomic claims, named operators, verifiable sources. 150 cards · 190 operators · 24 synthesis patterns.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="home-latest-cta inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium uppercase transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg">
              Open codex
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </a>

      <main id="main" className="mx-auto w-[92%] max-w-[1600px] py-12 sm:py-16">
        {/* Default hero — hidden via CSS when glass/material/metro HomeHero renders */}
        <div className="home-default-hero mx-auto mb-10 max-w-[760px] text-center">
          <h2 className="home-default-hero-title text-4xl font-semibold tracking-tight sm:text-5xl">
            the little things
          </h2>
          <p className="home-default-hero-desc mx-auto mt-10 max-w-[62ch] text-sm leading-6 sm:text-base">
            Free browser-based utilities for writing, design, and dev,<br className="hidden sm:inline" />
            {" "}fun little apps for play, and open-source projects.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <a href="https://tools.iamkesava.com" className="home-default-hero-btn home-default-hero-btn--primary rounded-lg px-4 py-2 text-sm font-medium uppercase transition-all hover:opacity-80 hover:shadow-lg hover:-translate-y-0.5">
              Browse all tools
            </a>
            <a href="https://toys.iamkesava.com" className="home-default-hero-btn home-default-hero-btn--secondary rounded-lg px-4 py-2 text-sm font-medium uppercase transition-all hover:opacity-80 hover:shadow-lg hover:-translate-y-0.5">
              Playground
            </a>
          </div>
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="home-section-heading text-base font-semibold">Tools</h2>
            <a href="https://tools.iamkesava.com" className="home-section-link text-xs hover:underline">
              explore all tools →
            </a>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {allTools
              .slice()
              .sort(() => Math.random() - 0.5)
              .slice(0, 3)
              .map((tool) => (
                <AppCard
                  key={tool.href}
                  title={tool.name}
                  description={tool.description}
                  href={tool.href}
                  ctaLabel="Open tool"
                  minHeight={156}
                />
              ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="home-section-heading text-base font-semibold">Toys</h2>
            <a href="https://toys.iamkesava.com" className="home-section-link text-xs hover:underline">
              explore all toys →
            </a>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {playgroundApps
              .slice()
              .sort(() => Math.random() - 0.5)
              .slice(0, 3)
              .map((app) => (
                <AppCard
                  key={app.href}
                  title={app.title}
                  badge={app.badge}
                  description={app.description}
                  href={app.href}
                  external={(app as { external?: boolean }).external}
                  minHeight={156}
                />
              ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="home-section-heading text-base font-semibold">Human + AI</h2>
            <p className="home-section-meta text-xs">open source · github</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {humanAiApps.map((app) => (
              <AppCard
                key={app.href}
                title={app.name}
                description={app.description}
                href={app.href}
                subtitle={app.tagline}
                external
                ctaLabel="View on GitHub"
                minHeight={172}
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="home-section-heading text-base font-semibold uppercase tracking-wide">
              iOS + iPad
            </h2>
            <p className="home-section-meta text-xs" style={{ color: "#666" }}>
              coming to App Store
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {iosApps.map((app) => (
              <div
                key={app.name}
                className="relative p-5"
                style={{
                  border: "2px solid #000",
                  boxShadow: "4px 4px 0 #000",
                }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-bold uppercase tracking-wide">{app.name}</span>
                  <span className="text-xs" style={{ color: "#666" }}>
                    {app.tagline}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#444" }}>
                  {app.description}
                </p>
                <div
                  className="mt-3 text-xs uppercase tracking-widest"
                  style={{ color: "#d946ef" }}
                >
                  Coming soon
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-[760px] text-center">
          <p className="home-closing-text text-sm leading-6 sm:text-base">
            No sign-up, no downloads, no server-side stuff.<br className="hidden sm:inline" />
            {" "}Every app runs on-device in your browser.<br className="hidden sm:inline" />
            {" "}The GitHub projects are open source:<br className="hidden sm:inline" />
            {" "}fork it, or install locally.
          </p>
        </div>

      </main>
      <Footer />
    </div>
  );
}
