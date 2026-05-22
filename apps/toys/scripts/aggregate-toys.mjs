#!/usr/bin/env node
// aggregate-toys.mjs — pull each external toy's index.html from GitHub
// and place it under public/<slug>/ so toys.iamkesava.com/<slug>/ becomes
// the canonical URL for every toy. The original k3sava.github.io/<slug>/
// URL stays alive for code-share, but iamkesava.com gets the citations,
// authority, and traffic.
//
// Each toy is a single-file repo (index.html at root). We:
//   1. Download index.html from raw.githubusercontent.com
//   2. Inject `<link rel="canonical" href="https://toys.iamkesava.com/<slug>/">`
//   3. Inject Schema.org @graph (CreativeWork) for the page
//   4. Save to public/<slug>/index.html
//
// Run via `npm run prebuild` (auto-runs before `next build`).

import { writeFile, mkdir, rm } from "node:fs/promises";
import { copyFileSync } from "node:fs";
import { Buffer } from "node:buffer";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const PUB = join(ROOT, "public");
const SITE = "https://toys.iamkesava.com";
const GH = "https://raw.githubusercontent.com/k3sava";

// Single-canvas toys served un-chromed at /e/<slug>/ and rendered through the
// shared ToyShell (Next route + iframe). Keep aligned with `embed: true` in
// src/data/toys.ts. These have NO header of their own, so the ToyShell header
// is the only chrome — guaranteeing parity with the hub and tools.
const EMBED = new Set([
  "synth-pad", "plink", "kaleidoscopic", "aurora",
  "string-art", "gravity-type", "particle-life", "aurea",
]);

// Per-toy metadata. Keep aligned with src/data/toys.ts.
const TOYS = [
  {
    slug: "sonicc", name: "sonicc", category: "Audio",
    keywords: "music, drums, synth, sequencer",
    description: "Keys, drums, pattern sequencer, sampler, and mic recorder. 16 presets, 9 waveforms, 12 FX, stereo knobs, MIDI support, WAV export.",
    tagline: "Play synth, drums, and samples in your browser.",
    nativeNote: true,
    shortcuts: [{ key: "A-K", label: "Synth keys" }, { key: "1-8", label: "Drum pads" }, { key: "Space", label: "Play / stop sequencer" }],
    faq: [
      { q: "What instruments does sonicc include?", a: "A polyphonic synthesizer, drum machine, step sequencer, sample looper, and mic input. All run in the browser via Web Audio API." },
      { q: "Is a native app coming?", a: "Yes. sonicc is coming to iOS and iPad with AVAudioEngine, Core MIDI, and AudioKit for lower latency and MIDI controller support." },
    ],
    related: [{ slug: "synth-pad", title: "Synth Pad" }, { slug: "plink", title: "Plink" }],
  },
  {
    slug: "plink", name: "Plink", category: "Audio",
    keywords: "audio, plinko, pentatonic",
    description: "Drop marbles and hear them play. A pentatonic plinko board where every bounce is a note. Click pegs to toggle them.",
    tagline: "Drop balls and make music.",
    nativeNote: false,
    shortcuts: [{ key: "Click", label: "Drop a ball" }, { key: "S", label: "Silence" }],
    faq: [
      { q: "What is Plink?", a: "Plink is a generative musical toy. Drop balls onto pegs arranged like a pachinko machine. Each ball bounces off pegs and plays a note when it lands. Overlapping patterns create emergent music." },
      { q: "Can I change the key or scale?", a: "Yes. Use the controls strip to select the musical key and scale (major, minor, pentatonic, blues)." },
    ],
    related: [{ slug: "synth-pad", title: "Synth Pad" }, { slug: "gravity-type", title: "Gravity Type" }],
  },
  {
    slug: "synth-pad", name: "Synth Pad", category: "Audio",
    keywords: "synth, audio, XY pad",
    description: "Touch or click and drag to play. An XY pad instrument with pentatonic tuning and warm oscillators.",
    tagline: "A browser synthesizer you can play with your fingers.",
    nativeNote: false,
    shortcuts: [{ key: "A-K", label: "Piano keys (QWERTY)" }, { key: "O", label: "Oscillator type" }],
    faq: [
      { q: "What is Synth Pad?", a: "A polyphonic synthesizer running entirely in the browser using the Web Audio API. Play with keyboard keys, tap on mobile, or connect a MIDI controller." },
      { q: "Can I connect a MIDI keyboard?", a: "Yes. Connect a USB MIDI keyboard before opening the page. Supported in Chrome and Edge." },
      { q: "What oscillator types are available?", a: "Sine, square, sawtooth, and triangle. Each produces a different timbre." },
    ],
    related: [{ slug: "plink", title: "Plink" }, { slug: "sonicc", title: "sonicc" }],
  },
  {
    slug: "kaleidoscopic", name: "Kaleidoscopic", category: "Visual",
    keywords: "WebGL, kaleidoscope, image",
    description: "Upload any image and watch it fold into living geometry. 8 symmetry patterns, real-time WebGL rendering, video recording.",
    tagline: "Turn any image into a living mandala.",
    nativeNote: true,
    shortcuts: [{ key: "1-8", label: "Symmetry count" }, { key: "U", label: "Upload image" }],
    faq: [
      { q: "How does Kaleidoscopic work?", a: "It takes a triangle slice of the input (your webcam, an uploaded image, or generative noise) and mirrors it radially to form a mandala. The symmetry count (1-8) sets how many mirror reflections are applied." },
      { q: "Can I use my webcam?", a: "Yes. Click the camera icon to stream your webcam through the kaleidoscope in real time." },
      { q: "How do I upload my own image?", a: "Press U or click the upload button. JPEG, PNG, and WebP are supported." },
      { q: "Is a native app coming?", a: "Yes. Kaleidoscopic is coming to iOS and iPad. The native app uses Metal shaders for higher frame rates and adds Apple Pencil support." },
    ],
    related: [{ slug: "aurora", title: "Aurora" }, { slug: "aurea", title: "Aurea" }],
  },
  {
    slug: "aurora", name: "Aurora", category: "Visual",
    keywords: "ambient, generative, light",
    description: "Move your cursor through living light. An interactive aurora borealis rendered in real time.",
    tagline: "Move your cursor through living light.",
    nativeNote: false,
    shortcuts: [{ key: "F", label: "Fullscreen" }],
    faq: [
      { q: "What is Aurora?", a: "Aurora is an interactive aurora borealis rendered in WebGL. Move your cursor or touch the screen to ripple through the light field. Every session is unique." },
      { q: "Does it work on mobile?", a: "Yes. Touch and drag to interact with the aurora. Best on a large screen but fully functional on mobile." },
      { q: "What creates the aurora effect?", a: "A fragment shader running on the GPU blends layered noise fields with a color gradient based on real aurora palettes. The cursor distorts the noise field." },
      { q: "Can I use Aurora as a screensaver?", a: "Yes. Go fullscreen (F key) and set your display to not sleep. On macOS, browser windows can serve as lightweight screensavers." },
    ],
    related: [{ slug: "kaleidoscopic", title: "Kaleidoscopic" }, { slug: "particle-life", title: "Particle Life" }],
  },
  {
    slug: "string-art", name: "String Art", category: "Visual",
    keywords: "generative, geometry, modular",
    description: "Modular multiplication on geometric shapes creates impossibly intricate patterns. Move your cursor to shape the strings.",
    tagline: "Thread infinite strings between rotating pins.",
    nativeNote: false,
    shortcuts: [{ key: "+/-", label: "Add/remove pins" }, { key: "S", label: "Speed" }],
    faq: [
      { q: "What is String Art?", a: "An animation of threads connecting evenly-spaced pins on a circle. The pattern is driven by multiplication tables producing cardioids, nephroids, and other mathematical curves." },
      { q: "What is the math behind it?", a: "Each pin is numbered 0 to N-1. A thread connects pin k to pin (k times multiplier) mod N. As the multiplier changes, the envelope of lines traces out mathematical curves." },
    ],
    related: [{ slug: "particle-life", title: "Particle Life" }, { slug: "aurea", title: "Aurea" }],
  },
  {
    slug: "gravity-type", name: "Gravity Type", category: "Simulation",
    keywords: "physics, type, gravity",
    description: "Type anything and watch it fall. Letters tumble, stack, and scatter with real physics. Click to explode.",
    tagline: "Letters that fall, bounce, and collide.",
    nativeNote: false,
    shortcuts: [{ key: "Space", label: "Drop letter" }, { key: "R", label: "Reset" }],
    faq: [
      { q: "What is Gravity Type?", a: "Type any key and watch the letters fall and pile up under simulated gravity. Letters collide with each other and the floor using a rigid-body physics engine." },
      { q: "What physics engine powers it?", a: "Matter.js — a 2D rigid-body physics engine. Each letter glyph is decomposed into convex polygons for accurate collision detection." },
    ],
    related: [{ slug: "particle-life", title: "Particle Life" }, { slug: "plink", title: "Plink" }],
  },
  {
    slug: "particle-life", name: "Particle Life", category: "Simulation",
    keywords: "particles, simulation, emergence",
    description: "Colored particles follow simple attraction rules and create complex, organic behavior. Click to create a new universe.",
    tagline: "Watch evolution emerge from three simple rules.",
    nativeNote: false,
    shortcuts: [{ key: "R", label: "Randomize rules" }, { key: "Space", label: "Pause / resume" }],
    faq: [
      { q: "What is Particle Life?", a: "Particle Life is a simulation where particles of different species attract or repel each other based on a rule matrix. Emergent behaviors — clusters, orbits, swarms — arise from simple attraction/repulsion rules." },
      { q: "How do I change the rules?", a: "Open the rules panel to edit the attraction matrix. Each cell sets how strongly species A attracts (positive) or repels (negative) species B. Randomize to discover new behaviors." },
      { q: "Why does it sometimes freeze?", a: "All particles clumping into a black hole is a known emergent behavior, not a bug. Randomize rules or click Reset to restart." },
    ],
    related: [{ slug: "gravity-type", title: "Gravity Type" }, { slug: "string-art", title: "String Art" }],
  },
  {
    slug: "aurea", name: "Aurea", category: "Generative",
    keywords: "math art, fibonacci, parametric",
    description: "Fibonacci-driven parametric line art. 6 original forms, 4K rendering, video recording. Thousands of lines from pure equations, biology from math.",
    tagline: "Golden ratio spirals rendered in real time.",
    nativeNote: false,
    shortcuts: [{ key: "N", label: "New pattern" }, { key: "+/-", label: "Density" }],
    faq: [
      { q: "What is Aurea?", a: "Aurea renders Fibonacci spiral patterns based on the golden angle (137.5 degrees). Points are placed at each golden angle rotation, producing sunflower seed arrangements found in nature." },
      { q: "What is the golden ratio?", a: "The golden ratio phi is approximately 1.618. The golden angle (approximately 137.5 degrees) produces maximally-spaced spiral patterns." },
    ],
    related: [{ slug: "string-art", title: "String Art" }, { slug: "aurora", title: "Aurora" }],
  },
  {
    slug: "form",
    name: "FORM",
    category: "Generative",
    keywords: "typography, poster, generative, design systems",
    description: "Type a phrase, the system arranges it like a typographer. Five design philosophies (Swiss, Editorial, Brutalist, Kinetic, Painterly) plus a blend lab. PNG or video.",
    tagline: "Generative 3D forms that breathe.",
    nativeNote: false,
    shortcuts: [{ key: "Space", label: "New form" }, { key: "S", label: "Save PNG" }],
    faq: [
      { q: "What is FORM?", a: "FORM renders generative 3D polyhedra with animated displacement fields. Each form is unique, driven by noise functions that make the surface breathe and shift." },
      { q: "Can I save a form I like?", a: "Yes. Press S to save the current frame as a PNG." },
    ],
    related: [{ slug: "aurea", title: "Aurea" }, { slug: "aurora", title: "Aurora" }],
    subpaths: ["", "swiss", "editorial", "brutalist", "kinetic", "painterly", "mycelium", "blend", "shared/style.css", "shared/app.js", "shared/parse.js", "shared/layout.js", "shared/philosophies/swiss.js", "shared/philosophies/editorial.js", "shared/philosophies/brutalist.js", "shared/philosophies/kinetic.js", "shared/philosophies/painterly.js", "shared/philosophies/mycelium.js", "shared/philosophies/blend.js", "shared/knowledge/designers.json"],
  },
  {
    slug: "pixart",
    name: "pixart",
    category: "Visual",
    keywords: "image, video, effects, canvas, generative, ascii, dither, crt, halftone, kaleidoscope, slit-scan, flow-field, ink-wash, watercolor",
    description: "Drop an image or video, pick an effect. 47 client-side canvas image/video effects (ascii, bevel, bloom, caustic, cellular, chromatic-diffusion, cloth, collapse, contour, crosshatch, crt, datamosh, displace, distort, dithering, dots, edge, erosion, film-grain, flow-field, flow-warp, glitch-scan, gradients, halftone-cmyk, ink-wash, kaleido-morph, kaleidoscope, mesh-gradient, moire, mosaic, neon-glow, patterns, photomosaic, pixel-sort, prismatic, recolor, rgb-shift, scatter, sift, slit-scan, split-tone, stack, stippling, superpixel, voronoi, watercolor, zoom-blur). 20 s seamless loop, per-effect mode systems, PNG + MP4 export, keyboard shortcuts.",
    tagline: "Upload a photo. Apply pixel art and glitch effects.",
    nativeNote: false,
    shortcuts: [{ key: "U", label: "Upload image" }, { key: "S", label: "Save" }, { key: "R", label: "Randomize" }],
    faq: [
      { q: "What effects does pixart apply?", a: "Pixel art (quantized palette + block render), glitch (data bending, scanlines, chromatic aberration), dither, ASCII art, and halftone. Stack effects by enabling multiple." },
      { q: "What image formats are supported?", a: "JPEG, PNG, WebP, and GIF (first frame). Uploaded images are processed in the browser canvas - nothing is sent to a server." },
    ],
    related: [{ slug: "wordart", title: "wordart" }, { slug: "poster", title: "poster" }],
    subpaths: [
      "",
      "ascii/effect.js", "ascii/index.html",
      "bevel/effect.js", "bevel/index.html",
      "bloom/effect.js", "bloom/index.html",
      "caustic/effect.js", "caustic/index.html",
      "cellular/effect.js", "cellular/index.html",
      "chromatic-diffusion/effect.js", "chromatic-diffusion/index.html",
      "cloth/effect.js", "cloth/index.html",
      "collapse/effect.js", "collapse/index.html",
      "contour/effect.js", "contour/index.html",
      "crosshatch/effect.js", "crosshatch/index.html",
      "crt/effect.js", "crt/index.html",
      "datamosh/effect.js", "datamosh/index.html",
      "displace/effect.js", "displace/index.html",
      "distort/effect.js", "distort/index.html", "distort/assets/displacement.png",
      "dithering/effect.js", "dithering/index.html",
      "dots/effect.js", "dots/index.html",
      "edge/effect.js", "edge/index.html",
      "erosion/effect.js", "erosion/index.html",
      "film-grain/effect.js", "film-grain/index.html",
      "flow-field/effect.js", "flow-field/index.html",
      "flow-warp/effect.js", "flow-warp/index.html",
      "glitch-scan/effect.js", "glitch-scan/index.html",
      "gradients/effect.js", "gradients/index.html",
      "halftone-cmyk/effect.js", "halftone-cmyk/index.html",
      "ink-wash/effect.js", "ink-wash/index.html",
      "kaleido-morph/effect.js", "kaleido-morph/index.html",
      "kaleidoscope/effect.js", "kaleidoscope/index.html",
      "mesh-gradient/effect.js", "mesh-gradient/index.html",
      "moire/effect.js", "moire/index.html",
      "mosaic/effect.js", "mosaic/index.html",
      "neon-glow/effect.js", "neon-glow/index.html",
      "patterns/effect.js", "patterns/index.html",
      "patterns/patterns/pattern-1.png", "patterns/patterns/pattern-2.png",
      "patterns/patterns/pattern-3.png", "patterns/patterns/pattern-4.png",
      "patterns/patterns/pattern-5.png", "patterns/patterns/pattern-6.png",
      "photomosaic/effect.js", "photomosaic/index.html",
      "pixel-sort/effect.js", "pixel-sort/index.html",
      "prismatic/effect.js", "prismatic/index.html",
      "recolor/effect.js", "recolor/index.html",
      "rgb-shift/effect.js", "rgb-shift/index.html",
      "scatter/effect.js", "scatter/index.html",
      "sift/effect.js", "sift/index.html",
      "slit-scan/effect.js", "slit-scan/index.html",
      "split-tone/effect.js", "split-tone/index.html",
      "stack/effect.js", "stack/index.html",
      "stippling/effect.js", "stippling/index.html",
      "superpixel/effect.js", "superpixel/index.html",
      "voronoi/effect.js", "voronoi/index.html",
      "watercolor/effect.js", "watercolor/index.html",
      "shared/chrome.css", "shared/gui.css", "shared/gui.js",
      "shared/theme.js", "shared/state.js", "shared/export.js",
      "shared/keys.js", "shared/theme-tokens.css",
      "assets/samples/portrait.jpg", "assets/samples/landscape.jpg",
      "assets/samples/macro.jpg", "assets/samples/cityscape.jpg",
      "assets/samples/clip.mp4",
      "assets/thumbs/ascii.webp", "assets/thumbs/bevel.webp",
      "assets/thumbs/bloom.webp", "assets/thumbs/caustic.webp",
      "assets/thumbs/cellular.webp", "assets/thumbs/chromatic-diffusion.webp",
      "assets/thumbs/cloth.webp", "assets/thumbs/collapse.webp", "assets/thumbs/contour.webp",
      "assets/thumbs/crosshatch.webp", "assets/thumbs/crt.webp",
      "assets/thumbs/datamosh.webp", "assets/thumbs/displace.webp",
      "assets/thumbs/distort.webp", "assets/thumbs/dithering.webp",
      "assets/thumbs/dots.webp", "assets/thumbs/edge.webp",
      "assets/thumbs/erosion.webp", "assets/thumbs/film-grain.webp", "assets/thumbs/flow-field.webp",
      "assets/thumbs/flow-warp.webp", "assets/thumbs/glitch-scan.webp",
      "assets/thumbs/gradients.webp", "assets/thumbs/halftone-cmyk.webp",
      "assets/thumbs/ink-wash.webp", "assets/thumbs/kaleido-morph.webp", "assets/thumbs/kaleidoscope.webp",
      "assets/thumbs/mesh-gradient.webp", "assets/thumbs/moire.webp",
      "assets/thumbs/mosaic.webp", "assets/thumbs/neon-glow.webp",
      "assets/thumbs/patterns.webp", "assets/thumbs/photomosaic.webp",
      "assets/thumbs/pixel-sort.webp", "assets/thumbs/prismatic.webp",
      "assets/thumbs/recolor.webp", "assets/thumbs/rgb-shift.webp",
      "assets/thumbs/scatter.webp", "assets/thumbs/sift.webp", "assets/thumbs/slit-scan.webp",
      "assets/thumbs/split-tone.webp", "assets/thumbs/stippling.webp",
      "assets/thumbs/superpixel.webp", "assets/thumbs/voronoi.webp",
      "assets/thumbs/stack.webp",
      "assets/thumbs/watercolor.webp",
      "assets/thumbs/zoom-blur.webp",
      "assets/previews/ascii.mp4", "assets/previews/bevel.mp4",
      "assets/previews/bloom.mp4", "assets/previews/caustic.mp4",
      "assets/previews/cellular.mp4", "assets/previews/chromatic-diffusion.mp4",
      "assets/previews/cloth.mp4", "assets/previews/collapse.mp4", "assets/previews/contour.mp4",
      "assets/previews/crosshatch.mp4", "assets/previews/crt.mp4",
      "assets/previews/datamosh.mp4", "assets/previews/displace.mp4",
      "assets/previews/distort.mp4", "assets/previews/dithering.mp4",
      "assets/previews/dots.mp4", "assets/previews/edge.mp4",
      "assets/previews/erosion.mp4", "assets/previews/film-grain.mp4", "assets/previews/flow-field.mp4",
      "assets/previews/flow-warp.mp4", "assets/previews/glitch-scan.mp4",
      "assets/previews/gradients.mp4", "assets/previews/halftone-cmyk.mp4",
      "assets/previews/ink-wash.mp4", "assets/previews/kaleido-morph.mp4", "assets/previews/kaleidoscope.mp4",
      "assets/previews/mesh-gradient.mp4", "assets/previews/moire.mp4",
      "assets/previews/mosaic.mp4", "assets/previews/neon-glow.mp4",
      "assets/previews/patterns.mp4", "assets/previews/photomosaic.mp4",
      "assets/previews/pixel-sort.mp4", "assets/previews/prismatic.mp4",
      "assets/previews/recolor.mp4", "assets/previews/rgb-shift.mp4",
      "assets/previews/scatter.mp4", "assets/previews/sift.mp4", "assets/previews/slit-scan.mp4",
      "assets/previews/split-tone.mp4", "assets/previews/stippling.mp4",
      "assets/previews/superpixel.mp4", "assets/previews/voronoi.mp4",
      "assets/previews/stack.mp4",
      "assets/previews/watercolor.mp4",
      "assets/previews/zoom-blur.mp4",
    ],
  },
  {
    slug: "wordart",
    name: "wordart",
    tagline: "Type anything. Get neon, matrix, fire, and more effects.",
    nativeNote: false,
    shortcuts: [{ key: "Enter", label: "Apply effect" }, { key: "S", label: "Save PNG" }],
    faq: [
      { q: "What effects does wordart include?", a: "Neon glow, Matrix digital rain, fire, glitch, 3D extrusion, gradient fill, and more. Each effect is a canvas shader applied to text rendered at high resolution." },
      { q: "How do I save the result?", a: "Press S or click Save PNG. The download is the full canvas at the rendered resolution." },
    ],
    related: [{ slug: "poster", title: "poster" }, { slug: "pixart", title: "pixart" }],
    category: "Generative",
    keywords: "typography, type, effects, canvas, generative, 3D, cylinder, spiral, ribbon, aurora, chromatic, constellation, liquid, halftone, dither, glitch",
    description: "Type a phrase, switch effects. 24 canvas typography effects — 3D cylinder wrap, Archimedean spiral, ribbon twist, aurora glow, chromatic aberration, constellation scatter, liquid drip, construct mosaic, cascade waterfall, clutter scatter, coil spiral, collapse gravity, interference Moiré, and more. Animate mode, interactive cursor mode, PNG + MP4 export.",
    subpaths: [
      "",
      "aurora", "aurora/effect.js",
      "blur", "blur/effect.js",
      "cascade", "cascade/effect.js",
      "chromatic", "chromatic/effect.js",
      "clutter", "clutter/effect.js",
      "coil", "coil/effect.js",
      "collapse", "collapse/effect.js",
      "constellation", "constellation/effect.js",
      "construct", "construct/effect.js",
      "cylinder", "cylinder/effect.js",
      "dither", "dither/effect.js",
      "glitch", "glitch/effect.js",
      "halftone", "halftone/effect.js",
      "interference", "interference/effect.js",
      "line", "line/effect.js", "line/effect.css",
      "liquid", "liquid/effect.js",
      "mesh", "mesh/effect.js",
      "noise", "noise/effect.js",
      "pixel", "pixel/effect.js",
      "ribbon", "ribbon/effect.js",
      "ripple", "ripple/effect.js",
      "slice", "slice/effect.js",
      "type", "type/effect.js",
      "wave", "wave/effect.js",
      "shared/chrome.css", "shared/gui.css", "shared/gui.js",
      "shared/theme.js", "shared/state.js", "shared/export.js",
      "shared/keys.js", "shared/theme-tokens.css", "shared/interact.js",
      "assets/thumbs/aurora.webp", "assets/thumbs/blur.webp",
      "assets/thumbs/cascade.webp", "assets/thumbs/chromatic.webp",
      "assets/thumbs/clutter.webp", "assets/thumbs/coil.webp",
      "assets/thumbs/collapse.webp", "assets/thumbs/constellation.webp",
      "assets/thumbs/construct.webp", "assets/thumbs/cylinder.webp",
      "assets/thumbs/dither.webp", "assets/thumbs/glitch.webp",
      "assets/thumbs/halftone.webp", "assets/thumbs/interference.webp",
      "assets/thumbs/line.webp", "assets/thumbs/liquid.webp",
      "assets/thumbs/mesh.webp", "assets/thumbs/noise.webp",
      "assets/thumbs/pixel.webp", "assets/thumbs/ribbon.webp",
      "assets/thumbs/ripple.webp", "assets/thumbs/slice.webp",
      "assets/thumbs/type.webp", "assets/thumbs/wave.webp",
      "assets/previews/aurora.mp4", "assets/previews/blur.mp4",
      "assets/previews/cascade.mp4", "assets/previews/chromatic.mp4",
      "assets/previews/clutter.mp4", "assets/previews/coil.mp4",
      "assets/previews/collapse.mp4", "assets/previews/constellation.mp4",
      "assets/previews/construct.mp4", "assets/previews/cylinder.mp4",
      "assets/previews/dither.mp4", "assets/previews/glitch.mp4",
      "assets/previews/halftone.mp4", "assets/previews/interference.mp4",
      "assets/previews/line.mp4", "assets/previews/liquid.mp4",
      "assets/previews/mesh.mp4", "assets/previews/noise.mp4",
      "assets/previews/pixel.mp4", "assets/previews/ribbon.mp4",
      "assets/previews/ripple.mp4", "assets/previews/slice.mp4",
      "assets/previews/type.mp4", "assets/previews/wave.mp4",
    ],
  },
  {
    slug: "poster",
    name: "poster",
    category: "Generative",
    keywords: "typography, poster, generative, design, art direction, editorial",
    description: "Type a phrase, idea, or article. Two art directors compose two completely different posters. 12 directors, 10 template families, 45,408 variants. Every decision is shown. Every decision is editable. Deterministic — same input, same output.",
    tagline: "Design a poster with generative backgrounds and bold type.",
    nativeNote: false,
    shortcuts: [{ key: "G", label: "New background" }, { key: "S", label: "Save PNG" }],
    faq: [
      { q: "What is the poster maker?", a: "A quick poster design tool with generative backgrounds and bold typographic layouts. Add title, sub-title, and body text, pick a layout and background, download." },
      { q: "What size is the output?", a: "1080x1080px (Instagram square) by default. Toggle to 1920x1080 (landscape) or 1080x1920 (portrait story)." },
    ],
    related: [{ slug: "wordart", title: "wordart" }, { slug: "pixart", title: "pixart" }],
    subpaths: [
      "",
      "shared/style.css",
      "shared/chrome.css", "shared/gui.css", "shared/theme.js", "shared/theme-tokens.css",
      "shared/parse.js", "shared/seed.js", "shared/article.js",
      "shared/templateParams.js", "shared/layout.js", "shared/mycelium.js",
      "shared/conceit.js", "shared/archetypes.js",
      "shared/director.js", "shared/render.js", "shared/app.js",
      "shared/knowledge/designers.json",
    ],
  },
];

async function fetchToyHtml(slug) {
  // Try main first, then master. Most repos use main.
  for (const branch of ["main", "master"]) {
    const url = `${GH}/${slug}/${branch}/index.html`;
    const res = await fetch(url, { headers: { "User-Agent": "little-toys-aggregator" } });
    if (res.ok) return await res.text();
  }
  throw new Error(`could not fetch index.html for ${slug} from main or master`);
}

// Inject canonical sister-site chrome into a toy's HTML:
//   - <link>/<script> tags pointing to /_chrome/* (served from this repo)
//   - Theme switcher (top-left), breadcrumb (top-left), shortcut hint (top-right)
//   - Fixed footer (sister sites + made by Kesava + github link) at bottom
//   - Optional splash overlay (only when toy doesn't already have one)
//
// Idempotent: if the HTML already contains kami-breadcrumb or
// theme-switcher-container, the chrome is assumed to be in place (this is
// true for wordart/pixart/form/poster which ship their own copies).
// Toys that capture every key as input — pressing T would both cycle the
// theme AND type a letter. Disable the T-shortcut for these; users click
// the theme switcher pill instead.
const KEY_CAPTURE_TOYS = new Set(["gravity-type"]);

function buildKamiMetaScript(toyMeta, name, tagline) {
  const meta = {
    title: toyMeta?.name || name,
    tagline: toyMeta?.tagline || tagline || "",
    nativeNote: toyMeta?.nativeNote || false,
    shortcuts: toyMeta?.shortcuts || [],
    faq: toyMeta?.faq || [],
    related: toyMeta?.related || [],
  };
  return `<script>window.kamiMeta = ${JSON.stringify(meta)};</script>`;
}

function injectChrome(html, slug, name, description, isSubpage, toyMeta) {
  const hasKamiHeader     = /class=["'][^"']*\bkami-header\b/i.test(html);
  const hasWaTop          = /class=["'][^"']*\bwa-top\b/i.test(html);
  const hasKamiBreadcrumb = /class=["'][^"']*\bkami-breadcrumb\b/i.test(html);
  const hasKamiFooter     = /class=["'][^"']*\bkami-footer\b/i.test(html);
  const hasThemeSwitcher  = /class=["'][^"']*\btheme-switcher-container\b/i.test(html);
  const hasSoniccTheme    = /class=["'][^"']*\btheme-sw\b/i.test(html);
  const hasSoniccCrumb    = /class=["'][^"']*\bcrumb\b/i.test(html) && /https:\/\/iamkesava\.com/.test(html);

  const AEO_ROW = `  <div class="row aeo"><a href="${SITE}/llms.txt">llms.txt</a><span class="sep">·</span><a href="${SITE}/sitemap.xml">sitemap</a><span class="sep">·</span><a href="${SITE}/toys.json">toys.json</a></div>\n`;

  // Already has the new global header — just ensure breadcrumb is canonical,
  // AEO row is present in the footer, kamiMeta is declared, and shell.js loads.
  if (hasKamiHeader) {
    let result = rewriteOwnBreadcrumb(html, slug, name);
    // Inject AEO row into kami-footer or wa-bottom if not already present
    if (!result.includes('class="row aeo"') && !result.includes("class='row aeo'")) {
      // Try kami-footer-aeo div first (canonical 3-row footer)
      if (/<div[^>]+class=["'][^"']*\bkami-footer-aeo\b/i.test(result)) {
        result = result.replace(
          /(<div[^>]+class=["'][^"']*\bkami-footer-aeo\b[^"']*["'][^>]*>)([\s\S]*?)<\/div>/i,
          (m, open, inner) => `${open}${inner}\n  <a href="${SITE}/llms.txt">llms.txt</a><span class="kami-footer-sep" aria-hidden="true">·</span><a href="${SITE}/sitemap.xml">sitemap</a><span class="kami-footer-sep" aria-hidden="true">·</span><a href="${SITE}/toys.json">toys.json</a></div>`
        );
      } else if (/<footer[^>]+class=["'][^"']*\bwa-bottom\b/i.test(result)) {
        result = result.replace(
          /(<footer[^>]+class=["'][^"']*\bwa-bottom\b[^"']*["'][^>]*>)/i,
          `$1\n${AEO_ROW}`
        );
      }
    }
    // Inject kamiMeta if not already present (idempotent)
    if (!result.includes('window.kamiMeta') && toyMeta && !isSubpage) {
      const metaScript = buildKamiMetaScript(toyMeta, name, toyMeta.tagline);
      if (/<head[^>]*>/i.test(result)) {
        result = result.replace(/<head[^>]*>/i, (m) => m + '\n' + metaScript);
      }
    }
    // Inject shell.js if not already present (idempotent)
    if (!result.includes('/_chrome/shell.js') && !isSubpage) {
      if (/<\/head>/i.test(result)) {
        result = result.replace(/<\/head>/i, `    <script src="/_chrome/shell.js" defer></script>\n  </head>`);
      }
    }
    return result;
  }

  // Effect pages with a full header bar (.wa-top) and sonicc's bespoke chrome
  // are complete standalone pages — only rewrite their breadcrumb link.
  // For .wa-top pages, also inject theme-patch.css so glass/material/metro
  // themes apply to panels (.wg-body, .wg-row, etc.) — those pages ship their
  // own theme-tokens.css from the source repo which only covers 5 legacy themes.
  // Also inject the AEO row into their existing wa-bottom footer.
  if (hasWaTop || (hasSoniccTheme && hasSoniccCrumb)) {
    let result = rewriteOwnBreadcrumb(html, slug, name);
    if (hasWaTop) {
      const patchLink = `<link rel="stylesheet" href="/_chrome/theme-patch.css">`;
      if (/<\/head>/i.test(result)) {
        result = result.replace(/<\/head>/i, `  ${patchLink}\n  </head>`);
      } else if (/<head[^>]*>/i.test(result)) {
        result = result.replace(/<head[^>]*>/i, (m) => m + patchLink);
      }
      // Inject AEO row as first child of wa-bottom (if not already present)
      if (!result.includes('class="row aeo"') && !result.includes("class='row aeo'")) {
        result = result.replace(
          /(<footer[^>]+class=["'][^"']*\bwa-bottom\b[^"']*["'][^>]*>)/i,
          `$1\n${AEO_ROW}`
        );
      }
    }
    // Inject kamiMeta so shell.js can read structured metadata on these pages too
    if (toyMeta && !isSubpage && !result.includes("window.kamiMeta")) {
      const kamiMetaScript = buildKamiMetaScript(toyMeta, name, toyMeta.tagline);
      if (/<\/head>/i.test(result)) {
        result = result.replace(/<\/head>/i, `  ${kamiMetaScript}\n  </head>`);
      } else if (/<head[^>]*>/i.test(result)) {
        result = result.replace(/<head[^>]*>/i, (m) => m + "\n" + kamiMetaScript);
      }
    }
    return result;
  }

  // Hub pages (e.g. wordart/index.html, pixart/index.html): have old floating
  // chrome (theme-switcher-container, kami-breadcrumb-fixed, kami-footer) but
  // no .wa-top header bar. Inject the new kami-header and suppress old floats.
  const isHubPage = hasThemeSwitcher || hasKamiBreadcrumb || hasKamiFooter;

  // Already has its own splash (plink, synth-pad, kaleidoscopic, etc.) —
  // skip the kami splash so we don't double-overlay. Tighter regex: must
  // be a full class/id value, not a prefix of something else like
  // "splash-essentials". Matches `id="splash"`, `class="splash"`,
  // `class="splash other"`, `class="other splash"`, etc.
  const hasOwnSplash =
    /\bid\s*=\s*["'](?:splash|loading-overlay|loading-screen|intro-overlay)["']/i.test(html) ||
    /\bclass\s*=\s*["'][^"']*(?:^|\s)(?:splash|loading-overlay|loading-screen|intro-overlay)(?:\s|["'])/i.test(html);

  // Use absolute paths so chrome loads from any subdirectory depth.
  const rootSlug = slug.split("/")[0];
  const skipKeyShortcuts = KEY_CAPTURE_TOYS.has(rootSlug);

  // Hub pages keep their own theme.js (don't load _chrome/theme.js to avoid
  // duplicate T-shortcut listeners). Standalone toys get the full chrome stack.
  const kamiMetaScript = (!isSubpage && toyMeta) ? buildKamiMetaScript(toyMeta, name, toyMeta.tagline) : "";
  const headInject = isHubPage ? `
    ${kamiMetaScript}
    <link rel="stylesheet" href="/_chrome/chrome.css">
    <style>
    /* aggregate-toys: suppress old floating chrome replaced by kami-header */
    body > .theme-switcher-container { display:none !important; }
    .kami-breadcrumb-fixed { display:none !important; }
    body > .kami-shortcut-hint { display:none !important; }
    .home-wrap { padding-top:64px !important; }
    </style>
    <script src="/_chrome/shell.js" defer></script>
  ` : `
    ${kamiMetaScript}
    <link rel="stylesheet" href="/_chrome/chrome.css">
    ${skipKeyShortcuts ? `<script>document.documentElement.setAttribute("data-kami-shortcuts","off");</script>` : ""}
    <script src="/_chrome/theme.js" defer></script>
    <script src="/_chrome/splash.js" defer></script>
    <script src="/_chrome/shell.js" defer></script>
  `;

  // Truncate description so the header subtitle fits on one line
  const shortDesc = escapeHtml(description.slice(0, 80));

  // Hub pages: inject kami-header only (no splash, no fixed footer — they have
  // their own scrollable footer). The page's own theme.js wires the theme picker.
  // Standalone toys: full chrome (header + splash + footer-fixed).
  const bodyInject = isHubPage ? `
<div class="kami-header">
  <div class="kami-header-left">
    <div class="theme-switcher-container">
      <button class="theme-switcher-pill" type="button"
        aria-label="Current theme. Click or press T to change."
        title="Cycle theme (T)">
        <span class="theme-switcher-pill-icon">○</span>
      </button>
    </div>
  </div>
  <div class="kami-header-center">
    <div class="kami-header-name">${escapeHtml(name)}</div>
    <div class="kami-header-desc">${shortDesc}</div>
    <nav class="kami-header-crumb" aria-label="Breadcrumb">
      <a href="https://apps.iamkesava.com">home</a>
      <span class="kami-header-crumb-sep" aria-hidden="true">·</span>
      <a href="https://toys.iamkesava.com/">toys</a>
    </nav>
  </div>
  <div class="kami-header-right">
    <div class="kami-shortcut-hint" aria-hidden="true"><kbd>/</kbd> search<span style="margin:0 .35rem">·</span><kbd>T</kbd> theme</div>
  </div>
</div>
` : `
<div class="kami-header">
  <div class="kami-header-left">
    <div class="theme-switcher-container">
      <button class="theme-switcher-pill" type="button"
        aria-label="Current theme. Click or press T to change."
        title="Cycle theme (T)">
        <span class="theme-switcher-pill-icon">○</span>
      </button>
    </div>
  </div>
  <div class="kami-header-center">
    <div class="kami-header-name">${escapeHtml(name)}</div>
    <div class="kami-header-desc">${shortDesc}</div>
    <nav class="kami-header-crumb" aria-label="Breadcrumb">
      <a href="https://apps.iamkesava.com">home</a>
      <span class="kami-header-crumb-sep" aria-hidden="true">·</span>
      <a href="https://toys.iamkesava.com/">toys</a>
    </nav>
  </div>
  <div class="kami-header-right">
    ${skipKeyShortcuts ? "" : `<div class="kami-shortcut-hint" aria-hidden="true"><kbd>T</kbd> theme</div>`}
  </div>
</div>
${hasOwnSplash ? "" : `<div class="kami-splash" role="status" aria-live="polite">
  <h1 class="kami-splash-name">${escapeHtml(name)}</h1>
  <p class="kami-splash-tag">${escapeHtml(description.slice(0, 90))}</p>
  <span class="kami-splash-dot"></span>
  <div class="kami-splash-skip">press <kbd>esc</kbd> or click to begin</div>
</div>`}
<footer class="wa-bottom" role="contentinfo">
  <div class="row aeo"><a href="${SITE}/llms.txt">llms.txt</a><span class="sep">·</span><a href="${SITE}/sitemap.xml">sitemap</a><span class="sep">·</span><a href="${SITE}/toys.json">toys.json</a></div>
  <nav class="row sister" aria-label="Sister sites">
    <span><a href="https://apps.iamkesava.com/">apps</a></span><span class="sep">·</span>
    <span><a href="https://tools.iamkesava.com/">tools</a></span><span class="sep">·</span>
    <span class="current" aria-current="page">toys</span><span class="sep">·</span>
    <span><a href="https://codex.iamkesava.com/">codex</a></span>
  </nav>
  <div class="row made">
    made by <a href="https://iamkesava.com" rel="author">kesava</a><span class="sep">·</span><a href="https://github.com/k3sava/${slug.split("/")[0]}" rel="noopener">github</a>
  </div>
</footer>
`;

  let out = html;
  // Insert head assets before </head>.
  if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `${headInject}\n  </head>`);
  } else if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => m + headInject);
  } else {
    out = `<!doctype html>\n<html><head>${headInject}</head>\n${out}\n</html>`;
  }
  // Insert chrome markup just after <body ...>. If no <body>, prepend.
  if (/<body[^>]*>/i.test(out)) {
    out = out.replace(/<body[^>]*>/i, (m) => m + bodyInject);
  } else {
    out = out + bodyInject;
  }
  return out;
}

// Embed mode: the toy is rendered inside the shared ToyShell <iframe>, so it
// gets NO site chrome (no header/footer/splash). It only needs:
//   1. kami-css (via chrome.css) so its --bg/--ink/etc. alias to kami tokens
//      and the whole canvas reskins with the active theme.
//   2. A theme-init script that reads the shared kami.theme cookie on load and
//      listens for postMessage from the parent shell for live theme changes.
// Same-origin (toys.iamkesava.com/e/<slug>/) so the parent can also drive it
// directly; the listener is the resilient path.
function injectEmbed(html, slug, name) {
  let out = html;
  const head = `  <link rel="stylesheet" href="/_chrome/chrome.css">
  <script>(function(){var k="kami.theme";function read(){try{var ck=('; '+document.cookie).split('; '+k+'=')[1];return ck?ck.split(';')[0]:(localStorage.getItem(k)||localStorage.getItem('theme'));}catch(e){return null;}}function apply(t){var h=document.documentElement;if(t&&t!=='default')h.setAttribute('data-theme',t);else h.removeAttribute('data-theme');}function dark(d){document.documentElement.toggleAttribute('data-dark',!!d);}apply(read());try{dark(localStorage.getItem('kami.dark')==='1');}catch(e){}window.addEventListener('message',function(e){var d=e&&e.data;if(!d||typeof d!=='object')return;if('kamiTheme' in d)apply(d.kamiTheme);if('kamiDark' in d)dark(d.kamiDark);});})();</script>
`;
  if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, head + "  </head>");
  } else if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => m + "\n" + head);
  } else if (/<html[^>]*>/i.test(out)) {
    out = out.replace(/<html[^>]*>/i, (m) => m + "\n<head>\n" + head + "</head>");
  } else {
    out = head + out;
  }
  return out;
}

function escapeHtml(s) {
  return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// When a toy ships its own chrome, ensure the breadcrumb uses the canonical
// 2-item format: home (apps.iamkesava.com) · toys.
// If it already has the correct format, leave it alone.
function rewriteOwnBreadcrumb(html, slug, name) {
  const re = /(<nav\b[^>]*\bclass\s*=\s*["'][^"']*\b(?:crumb|kami-breadcrumb)\b[^"']*["'][^>]*>)([\s\S]*?)(<\/nav>)/i;
  const m = html.match(re);
  if (!m) return html;
  // Already has canonical format (apps.iamkesava.com + toys.iamkesava.com) — leave it alone.
  if (/apps\.iamkesava\.com/.test(m[2]) && /toys\.iamkesava\.com/.test(m[2])) return html;
  const inner =
    `<a href="https://apps.iamkesava.com">home</a><span class="sep">&middot;</span>` +
    `<a href="https://toys.iamkesava.com/">toys</a>`;
  return html.replace(re, (_, open, _mid, close) => `${open}${inner}${close}`);
}

function injectCanonical(html, slug, name, description, keywords) {
  const url = `${SITE}/${slug}/`;
  const ldGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": url,
        name,
        description,
        url,
        keywords,
        author: { "@type": "Person", name: "Kesava", url: "https://iamkesava.com" },
        publisher: { "@type": "Organization", name: "little toys", url: SITE },
        codeRepository: `https://github.com/k3sava/${slug}`,
        license: "https://opensource.org/licenses/MIT",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "iamkesava", item: "https://iamkesava.com" },
          { "@type": "ListItem", position: 2, name: "toys", item: SITE + "/" },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  };
  const inject = `
    <link rel="canonical" href="${url}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${name}, by Kesava">
    <meta property="og:description" content="${description.replace(/"/g, "&quot;")}">
    <meta property="og:image" content="${url}og.svg">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${name}, by Kesava">
    <meta name="twitter:description" content="${description.replace(/"/g, "&quot;")}">
    <meta name="twitter:image" content="${url}og.svg">
    <meta name="author" content="Kesava">
    <meta name="description" content="${description.replace(/"/g, "&quot;")}">
    <script type="application/ld+json">${JSON.stringify(ldGraph)}</script>
  `;
  // Insert before </head>; if no </head>, prepend the document.
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${inject}\n  </head>`);
  }
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (m) => m + inject);
  }
  // No <head>: wrap minimally.
  return `<!doctype html>\n<html><head>${inject}</head>\n${html}\n</html>`;
}

const W = 1200, H = 630;
function escapeXml(s) {
  return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
}
function ogSvg(toy) {
  const accent = ({ Audio: "#ec4899", Visual: "#8b5cf6", Simulation: "#06b6d4", Generative: "#f59e0b" })[toy.category] || "#c084fc";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f0f1e"/>
      <stop offset="1" stop-color="#1a1530"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${accent}"/>
  <g transform="translate(80, 60)">
    <circle cx="0" cy="14" r="6" fill="#c084fc"/>
    <text x="16" y="20" font-family="DM Sans, system-ui, sans-serif" font-size="22" fill="#fafafa">little toys</text>
  </g>
  <text x="80" y="180" font-family="JetBrains Mono, monospace" font-size="16" fill="${accent}" letter-spacing="2">${escapeXml(toy.category.toUpperCase())}</text>
  <text x="80" y="290" font-family="Cormorant Garamond, serif" font-size="86" font-weight="500" fill="#fafafa">${escapeXml(toy.name)}</text>
  <text x="80" y="380" font-family="Source Serif 4, serif" font-size="28" fill="#a78bfa">${escapeXml(toy.description.slice(0, 90))}</text>
  <text x="80" y="540" font-family="JetBrains Mono, monospace" font-size="20" fill="#a78bfa">By Kesava</text>
  <text x="${W - 80}" y="${H - 60}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="14" fill="#71717a">toys.iamkesava.com/${escapeXml(toy.slug)}/</text>
</svg>`;
}

async function main() {
  let ok = 0, fail = 0;
  // Ship the shared design system into the chrome dir so injected toy HTML
  // can reference /_chrome/kami.css (8 skins + dark mode).
  try {
    copyFileSync(join(ROOT, "node_modules", "kami-css", "kami.css"), join(PUB, "_chrome", "kami.css"));
    console.log("aggregate-toys: copied kami-css → public/_chrome/kami.css");
  } catch (e) {
    console.error("aggregate-toys: FAILED to copy kami.css:", e.message);
    process.exit(1);
  }
  for (const toy of TOYS) {
    const isEmbed = EMBED.has(toy.slug);
    // Embed toys live at /e/<slug>/ (the Next route owns /<slug>/). Always
    // remove any stale chromed copy at public/<slug>/ so it can't shadow the
    // Next-generated shell page in the static export.
    await rm(join(PUB, toy.slug), { recursive: true, force: true });
    const dir = isEmbed ? join(PUB, "e", toy.slug) : join(PUB, toy.slug);
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });

    const subpaths = toy.subpaths || [""];
    let allOk = true;
    // Asset classification:
    //   directory  — sub is a bare slug like "line" or "shared", aggregator
    //                fetches `${sub}/index.html` and rewrites the HTML.
    //   text-asset — code/markup: .css .js .json .html. Fetched verbatim.
    //   binary     — images/video/font: .png .jpg .mp4 etc. Fetched as bytes.
    const TEXT_EXT = /\.(css|js|json|html)$/i;
    const BIN_EXT  = /\.(png|jpe?g|gif|webp|svg|ico|mp4|webm|mov|m4v|woff2?|ttf|otf|wasm)$/i;
    for (const sub of subpaths) {
      try {
        const isText = TEXT_EXT.test(sub);
        const isBin  = BIN_EXT.test(sub);
        const isAsset = isText || isBin;
        const fetchPath = sub === "" ? "index.html" : (isAsset ? sub : `${sub}/index.html`);

        let content = null;
        for (const branch of ["main", "master"]) {
          const url = `${GH}/${toy.slug}/${branch}/${fetchPath}`;
          const res = await fetch(url, { headers: { "User-Agent": "little-toys-aggregator" } });
          if (res.ok) {
            content = isBin ? Buffer.from(await res.arrayBuffer()) : await res.text();
            break;
          }
        }
        if (content === null) throw new Error(`could not fetch ${fetchPath}`);

        const localPath = sub === "" ? "index.html" : (isAsset ? sub : `${sub}/index.html`);
        const fullLocal = join(dir, localPath);
        await mkdir(join(fullLocal, ".."), { recursive: true });

        if (isBin) {
          await writeFile(fullLocal, content);
        } else if (isText) {
          // HTML text-assets (e.g. /pixart/<effect>/index.html) get canonical
          // injection same as the toy root. CSS/JS/JSON pass through verbatim.
          if (sub.endsWith(".html")) {
            const subSlug = toy.slug + "/" + sub.replace(/\/?index\.html$/, "");
            const pageName = `${toy.name} — ${sub.split("/")[0]}`;
            content = injectCanonical(content, subSlug, pageName, toy.description, toy.keywords);
            content = injectChrome(content, subSlug, pageName, toy.description, true, toy);
          }
          await writeFile(fullLocal, content);
        } else {
          // Directory — fetched its index.html, write to <sub>/index.html.
          const subSlug = toy.slug + (sub ? "/" + sub : "");
          const pageName = sub === "" ? toy.name : `${toy.name} — ${sub[0].toUpperCase() + sub.slice(1)}`;
          let enriched = injectCanonical(content, subSlug, pageName, toy.description, toy.keywords);
          // Embed toys (single-canvas, no own header) render inside the shared
          // ToyShell iframe — give them theme wiring only, no site chrome.
          enriched = isEmbed
            ? injectEmbed(enriched, toy.slug, toy.name)
            : injectChrome(enriched, subSlug, pageName, toy.description, sub !== "", toy);
          await writeFile(fullLocal, enriched);
        }
      } catch (e) {
        console.log(`  ✗ ${toy.slug}/${sub || "(root)"}: ${e.message}`);
        allOk = false;
      }
    }
    if (allOk) {
      await writeFile(join(dir, "og.svg"), ogSvg(toy));
      console.log(`  ✓ ${toy.slug} (${subpaths.length} path${subpaths.length===1?'':'s'})`);
      ok++;
    } else {
      fail++;
    }
  }
  console.log(`\naggregate-toys: ${ok} aggregated, ${fail} failed`);
  if (fail > 0 && fail === TOYS.length) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
