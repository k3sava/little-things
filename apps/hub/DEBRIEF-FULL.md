# Full Session Debrief: kami web tools (Milestones 1-3)

Date: 2026-04-12

---

## SESSION SUMMARY

### What was built

- **40 tools** across 5 kits: TextKit (11), DesignKit (13), DevKit (10), PDFKit (3), CSSKit (3)
- **Shared infrastructure layer**: 3 hooks (`useToolState`, `useFileDropZone`, `useKeyboardShortcuts`), 1 context (`ShortcutContext` + `ShortcutHintBar`), 1 wrapper (`ToolPageWrapper`)
- **Shared components**: `FileDropZone` (declarative drop zone), `Spinner` (loading indicator)
- **Shared utilities**: `formatBytes` (extracted from duplicate PDF implementations)
- **Kit system**: 5 kit landing pages with typed registry (`tools.ts`), accent colors, related-tools shuffler
- **CSSKit** (Milestone 3): Keyframe Animator, Easing Editor, Scroll Animation — the most interaction-rich tools in the suite

### What was retrofitted

- Existing tools received `useKeyboardShortcuts` (Cmd+Enter for primary action, Cmd+K for clear)
- Existing tools received `useToolState` for URL-bookmarkable state (JSON Formatter uses `q` param)
- `formatBytes` consolidated from 3 separate implementations into `src/lib/format-bytes.ts`
- `FileDropZone` component extracted to wrap the `useFileDropZone` hook with click-to-browse fallback
- `Spinner` extracted from inline PDF Compress definition to `src/components/tools/spinner.tsx`

---

## LEARN

### Patterns that worked

1. **String-only `useToolState`.** Forcing `Record<string, string>` eliminates serialization bugs entirely. Tools with complex state (File objects, Sets, SVG coordinates) correctly keep that state local and only persist the bookmarkable slice. The Easing Editor wisely skips `useToolState` because bezier coordinates are better manipulated via the canvas than a URL.

2. **Hook triad with zero coupling.** `useToolState` (persistence), `useFileDropZone` (file I/O), `useKeyboardShortcuts` (input) never interfere. All three PDF tools use drop + shortcuts together without conflict. This composability held through 40 tools.

3. **ShortcutContext auto-registration.** Tools call `useKeyboardShortcuts` with labeled shortcuts, the hint bar renders them — zero prop drilling. The auto-hide-after-5s and the context-based register/unregister lifecycle means new tools get hint bars for free via `ToolPageWrapper`.

4. **`dragCounter` pattern in `useFileDropZone`.** The correct fix for nested dragenter/dragleave events. Naive `isDragging` toggles break on child elements. The ref-callback approach for attaching listeners is more robust than useEffect-on-ref.

5. **SVG-based interactive editors (CSSKit).** The Easing Editor's `toSVG`/`fromSVG` coordinate mapping with pointer capture is the right pattern for draggable canvas tools. Allowing y-axis overshoot (-0.5 to 1.5) for bounce/back effects was a good design call.

6. **Kit accent system.** Each kit has an `accentHex` in the registry. This creates visual identity per kit without a complex theme system. PDFKit = rose, CSSKit = amber, DevKit = emerald.

### Architecture decisions that paid off

- **`ToolPageWrapper` wrapping all tool routes.** Keyboard shortcuts, hint bar, and future site-wide features (analytics, A/B, onboarding) get a single injection point.
- **Flat tool directory structure** (`src/app/tools/{tool-slug}/content.tsx`). No nesting by kit. Next.js file-based routing gives each tool a clean URL. Kit grouping is data-layer only (via `tools.ts`).
- **Separating `content.tsx` from `page.tsx`.** Keeps the "use client" boundary clean — page.tsx can remain a server component that imports the client content component.

### What would be different next time

- **Define the CSS variable system before building any tools.** The kami variables (`--kami-text`, `--kami-surface`, etc.) came in with PDFKit but the first 34 tools hardcode Tailwind classes. This created the largest consistency gap. Starting with variables would have eliminated the retrofit entirely.
- **Extract `FileDropZone` and `Spinner` as part of Milestone 1, not after.** The duplication across PDF tools was predictable. Building the component versions first would have saved the consolidation pass.
- **Establish Cmd+Enter / Cmd+K as conventions in tool #1.** The JSON Formatter retrofit shows how mechanical the keyboard shortcut addition is. Had the convention been set from tool #1, all 40 tools would have shipped with shortcuts.

---

## MAINTAIN

### Conventions to preserve

| Convention | Rule |
|---|---|
| Primary action shortcut | `Cmd+Enter` — every tool with a "do it" button |
| Clear shortcut | `Cmd+K` — every tool with input state |
| Copy shortcut | `Cmd+C` or `Cmd+Enter` — context-dependent |
| Shortcut array | **Must be wrapped in `useMemo`** — inline arrays cause infinite re-registration |
| `useToolState` scope | String state only. No Files, no ArrayBuffers, no objects. Tools with no bookmarkable state skip it entirely. |
| `useFileDropZone` readAs | Must match usage: `"arrayBuffer"` for binary (PDF, images), `"text"` for text (JSON, CSV), `"dataURL"` for previews |
| File extensions | `accept` arrays use lowercase dot-prefixed extensions: `[".pdf"]`, `[".json", ".txt"]` |
| Tool registry | Every tool gets an entry in `src/data/tools.ts` with `name`, `description`, `href`, `icon`, `kit`, `keywords` |
| Kit accent | Use kit `accentHex` for primary action buttons. Do not mix kit colors. |
| Content component | Tool logic lives in `content.tsx` as a default export. `page.tsx` is the thin server wrapper. |

### Hook APIs that must stay stable

**`useToolState<T extends Record<string, string>>(defaults: T): [T, (patch: Partial<T>) => void]`**
- Return type is a tuple matching `useState` convention
- `setState` merges (not replaces) — this is intentional and tools depend on it
- URL sync is debounced at 300ms — do not reduce below 200ms or typing feels laggy
- `window.history.replaceState` (not pushState) — avoids polluting back button history

**`useFileDropZone<T extends HTMLElement>({ accept, onDrop, readAs }): { isDragging, ref }`**
- `ref` is a callback ref, not a ref object — tools must use `ref={ref}` not `ref.current`
- `onDrop` receives `FileDropResult[]` with `{ file: File, content: string | ArrayBuffer }`
- The `FileDropZone` component wraps this hook — use the component for standard drop zones, the hook for custom layouts

**`useKeyboardShortcuts(shortcuts: Shortcut[]): void`**
- `Shortcut.meta` maps to both Cmd (Mac) and Ctrl (Windows)
- Bare letter keys are suppressed when focused in input/textarea — only meta combos fire from inputs
- `label` is optional: labeled shortcuts appear in the hint bar, unlabeled ones are invisible to the user

---

## NEXT OPPORTUNITIES (ranked by impact)

### 1. Retrofit remaining tools to full hook adoption (HIGH)

**~34 tools still lack keyboard shortcuts.** The infrastructure is in place (ToolPageWrapper + ShortcutContext). Each retrofit is ~15 min of mechanical work: import hook, define shortcuts in useMemo, call hook. Priority order:
- Regex Tester, Text Diff, Find & Replace, Markdown Editor (interaction-heavy, shortcuts add most value)
- All remaining tools (Cmd+C to copy output is universal)

**~26 tools could benefit from `useToolState`.** Color Converter, Contrast Checker, Gradient Generator, Base64, URL Encoder, Timestamp Converter, Hash Generator, Case Converter are the highest-value targets (shareable URLs).

### 2. CSS variable migration — decide and execute (HIGH)

The kami CSS variable system (`--kami-text`, `--kami-surface`, `--kami-border`, `--kami-input-bg`) exists in PDFKit tools but the other 37 tools hardcode Tailwind classes. This blocks dark mode. Decision required:
- If dark mode is a go: bulk migrate all tools (scriptable find-and-replace on `text-gray-900` -> `var(--kami-text)`, etc.)
- If not: standardize on Tailwind and remove kami variables from PDFKit tools to eliminate the inconsistency

### 3. SEO / content layer (MEDIUM-HIGH)

Each tool page is a server-rendered Next.js route — strong SEO foundation. Missing pieces:
- **Per-tool meta descriptions and OG images.** `tools.ts` has `description` but pages may not pipe it into `<head>`.
- **Structured data (JSON-LD).** `SoftwareApplication` or `WebApplication` schema for each tool.
- **Long-tail keyword pages.** "JSON formatter online", "cubic bezier generator", "PDF merge free" — add these as `h1`/`title` variations.
- **Cross-linking.** The `getRelatedTools` function exists but may not render on every page. Related tools in footer = internal link equity.
- **Sitemap.** Generate from `allTools` array. Easy win.

### 4. New tool categories (MEDIUM)

Gaps in the current suite where search volume exists:
- **ImageKit**: Image resize, crop, compress, format convert (WEBP/AVIF), background remove. All client-side via Canvas API + WASM.
- **DataKit**: CSV to JSON, JSON to CSV, SQL formatter, YAML/TOML converter. Text-based, high search volume.
- **SecurityKit**: Password generator, TOTP generator, CSP builder. Small tools, strong SEO.
- **CSSKit expansion**: CSS-to-Tailwind converter, Tailwind palette generator, CSS minifier.

### 5. Performance opportunities (MEDIUM)

- **Dynamic imports for heavy dependencies.** `pdf-lib` is loaded on every PDF tool mount. Use `next/dynamic` with `{ ssr: false }` and show the Spinner component during load.
- **Tool page code splitting.** Verify each tool's `content.tsx` is in its own chunk. The flat directory structure should give this for free with Next.js app router.
- **Preconnect/prefetch for tool navigation.** The hub page knows all tool URLs — `<Link prefetch>` for visible tools.

### 6. Testing (LOW-MEDIUM)

- Zero tests currently. The hooks are the highest-value test targets: `useToolState` URL sync, `useFileDropZone` event handling, `useKeyboardShortcuts` modifier matching.
- Playwright for the interactive CSSKit tools (bezier drag, linear point add/remove) would catch regressions in coordinate math.

---

## File reference

| File | Purpose |
|---|---|
| `src/data/tools.ts` | Tool + kit registry (40 tools, 5 kits) |
| `src/hooks/use-tool-state.ts` | URL-synced string state |
| `src/hooks/use-file-drop.ts` | Drag-and-drop file handling |
| `src/hooks/use-keyboard-shortcuts.ts` | Keyboard shortcut registration |
| `src/contexts/shortcut-context.tsx` | Hint bar auto-display |
| `src/components/tools/file-drop-zone.tsx` | Declarative drop zone component |
| `src/components/tools/spinner.tsx` | Loading spinner |
| `src/lib/format-bytes.ts` | Human-readable byte formatting |
