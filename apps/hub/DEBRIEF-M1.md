# Milestone 1 Debrief: Shared Infrastructure + PDFKit

Date: 2026-04-12

---

## LEARN — Patterns and wins

### What worked well

1. **The three-hook triad is a clean separation of concerns.** `useToolState` owns URL persistence, `useFileDropZone` owns drag-and-drop, `useKeyboardShortcuts` owns hotkeys. No hook tries to do two things. This is the right grain size.

2. **ShortcutContext + ShortcutHintBar is a zero-config pattern.** Tools just call `useKeyboardShortcuts` with labeled shortcuts and the hint bar appears automatically. No prop drilling, no manual registration. The auto-hide-after-5s behavior is a nice touch that keeps the UI clean.

3. **`useFileDropZone` handles the hard parts correctly.** The `dragCounter` pattern for nested enter/leave events is the right fix (not the naive `isDragging` toggle that breaks on child elements). The ref-callback approach for attaching listeners is more robust than useEffect-on-ref.

4. **`useToolState` is deliberately string-only.** This is a feature, not a limitation. URL search params are strings. Forcing `Record<string, string>` means no serialization bugs. Tools that need richer state (like the PDF tools with File objects and Sets) correctly keep that state local and only use `useToolState` for the parts worth bookmarking.

5. **PDF tools prove the hooks compose well.** All three PDF tools use `useFileDropZone` + `useKeyboardShortcuts` together without conflict. The hooks don't interfere with each other or fight over event handling.

### Reusable patterns that emerged

- **Cmd+Enter = primary action, Cmd+O = open/add files.** All three PDF tools follow this. It should become the standard shortcut convention for every tool.
- **`formatBytes` / `formatSize` utility.** Duplicated across PDF Merge and PDF Split/Compress (slightly different implementations). Should be extracted.
- **Drop zone visual pattern.** The `isDragging ? "border-rose-400 bg-rose-50/10" : "border-gray-300 hover:border-gray-400"` styling is consistent across all three tools. Could become a `<DropZone>` component.
- **Status state machine.** PDF Compress and Split both use `type Status = "idle" | "loading" | "processing" | "done" | "error"`. This is a general pattern for file-processing tools.

---

## MAINTAIN — Conventions that must not drift

### Hook usage rules

1. **`useToolState` is for bookmarkable string state only.** Never try to serialize File objects, ArrayBuffers, or complex state into it. If a tool has no bookmarkable state (like the PDF tools), don't use `useToolState` at all. This is correct behavior, not a gap.

2. **`useKeyboardShortcuts` must receive a stable (memoized) array.** All three PDF tools correctly wrap their shortcuts in `useMemo`. If a tool passes an inline array, it will cause infinite re-registration loops with ShortcutContext. This is the #1 retrofit footgun.

3. **Shortcuts must have `label` to appear in the hint bar.** The hint bar only shows shortcuts where `s.label` is truthy. Internal-only shortcuts (no label) are invisible to the user. This is by design.

4. **`useFileDropZone` requires `readAs` to match usage.** PDF tools use `"arrayBuffer"` because pdf-lib needs ArrayBuffer. Text tools would use `"text"`. Mismatching this causes silent failures.

### Styling conventions (new tools vs. old tools)

The PDF tools introduced a **kami CSS variable system** (`--kami-text`, `--kami-text-muted`, `--kami-surface`, `--kami-border`, `--kami-input-bg`) that the older tools do not use. The older tools hardcode Tailwind classes like `text-gray-900`, `bg-white`, `border-gray-200`.

**This is the single largest consistency gap.** PDF Merge and PDF Split use kami variables. PDF Compress is a hybrid (uses kami variables in some places, hardcoded `text-gray-900`, `bg-white`, `border-gray-200` in others). The existing 34 tools are 100% hardcoded.

Decision needed: either retrofit all tools to kami variables (enables dark mode) or standardize on hardcoded Tailwind (simpler, no theming). Do not leave it mixed.

### Kit accent convention

PDFKit uses `rose` (accentHex: `#f43f5e`). The primary action button in PDF tools is `style={{ background: "#f43f5e" }}`. Other kits use `indigo`, `violet`, `emerald`. Retrofitted tools should use their kit's accent color for the primary action.

---

## CONSOLIDATE — Extraction opportunities

### High-value extractions

1. **`formatBytes(bytes: number): string`** — Duplicated in pdf-compress and pdf-split with identical logic. PDF Merge has a separate `formatSize` with slightly different formatting. Extract to `src/lib/format.ts`.

2. **`<FileDropZone>` component** — All three PDF tools render nearly identical drop zone UI:
   - Dashed border container
   - Icon + "Drop X here or click to browse" text
   - File extension hint
   - `isDragging` ring effect
   - Hidden `<input type="file">` with click-to-browse

   This is ~30 lines of JSX repeated three times. A shared `<FileDropZone>` component wrapping `useFileDropZone` would eliminate this duplication while keeping the hook available for custom layouts.

3. **`Spinner` component** — PDF Compress defines an inline `Spinner()` SVG component. This will be needed by any tool with async processing. Extract to `src/components/ui/spinner.tsx`.

4. **Status state machine type** — `"idle" | "loading" | "processing" | "done" | "error"` with `errorMessage` string is a pattern. Not necessarily worth extracting into a hook yet (the processing step names differ), but worth noting.

### Lower-value (defer)

- **PDF error handling pattern** (encrypted detection, `ignoreEncryption: true`). Consistent across all three but pdf-lib-specific. Not worth abstracting until there are 5+ PDF tools.
- **Auto-download pattern** (create blob URL, createElement('a'), click, revoke). Used in merge and split. Small enough to leave inline for now.

---

## DEBRIEF — Gap analysis and retrofit plan

### The gap

The 34 existing tools were built before the shared infrastructure existed. They share **zero** hooks and have **zero** keyboard shortcuts. Specifically:

| Capability | New PDF tools (3) | Existing tools (34) |
|---|---|---|
| `useKeyboardShortcuts` | All 3 | 0 / 34 |
| `useFileDropZone` | All 3 | 0 / 34 (file-converter could use it) |
| `useToolState` | 0 / 3 (correct: no bookmarkable state) | 0 / 34 |
| ShortcutHintBar | All 3 (via ToolPageWrapper) | All 34 (already wrapped, but no shortcuts registered) |
| Kami CSS variables | 2.5 / 3 | 0 / 34 |

The **ShortcutHintBar already works for all tools** because ToolPageWrapper wraps everything. The moment a tool registers shortcuts via `useKeyboardShortcuts`, they appear. This is the lowest-friction retrofit.

### Retrofit effort estimate

**Tier 1: Add keyboard shortcuts only (15 min per tool, highest ROI)**

Every tool has at least one primary action. Adding `useKeyboardShortcuts` with Cmd+Enter for the primary action and Cmd+C for copy (where applicable) is a mechanical change: import the hook, define shortcuts in `useMemo`, call the hook.

Priority order (tools where shortcuts add the most value):
1. **JSON Formatter** — Cmd+Enter to format, Cmd+Shift+M to minify, Cmd+C to copy output
2. **Regex Tester** — Cmd+Enter to test/highlight
3. **Text Diff** — Cmd+Enter to diff
4. **Find & Replace** — Cmd+Enter to replace all, Cmd+G for next match
5. **Markdown Editor** — Cmd+Enter to toggle preview, Cmd+B/I/K for bold/italic/link
6. **Cron Builder** — Cmd+C to copy expression
7. **Invoice Generator** — Cmd+Enter to generate PDF
8. All remaining tools (Cmd+C to copy output is universal)

**Tier 2: Add useToolState for bookmarkable tools (20 min per tool)**

Tools where URL state adds real value (sharing a specific conversion/output):
1. **Case Converter** — bookmark the input text + selected case
2. **Color Converter** — bookmark the input color
3. **Gradient Generator** — bookmark the gradient config
4. **Contrast Checker** — bookmark the two colors
5. **Base64** — bookmark encoded/decoded text
6. **URL Encoder** — bookmark the URL
7. **Timestamp Converter** — bookmark the timestamp
8. **Hash Generator** — bookmark the input

Tools where URL state adds no value (tools with no meaningful shareable state): Clipboard Manager, Flexbox Playground, CSS Grid, Box Shadow, Border Radius, Screenshot Beautifier, Invoice Generator.

**Tier 3: Add useFileDropZone (30 min per tool)**

Only tools that accept file input:
1. **File Converter** — the obvious candidate, currently uses its own file handling
2. **Screenshot Beautifier** — accepts image uploads
3. **Base64** — can encode files
4. **JSON Formatter** — could accept .json file drops (nice to have)

**Tier 4: Migrate to kami CSS variables (bulk find-and-replace)**

This is the largest effort but the most mechanical. Every `text-gray-900` becomes `style={{ color: "var(--kami-text)" }}`, every `bg-white` becomes `style={{ background: "var(--kami-surface)" }}`, etc. Can be done with a script or one tool at a time. Prerequisite: decide whether theming/dark mode is actually wanted.

### Recommended execution order

1. **Tier 1 for all 34 tools** (one pass, ~8 hours total). This gives every tool keyboard shortcuts and makes the hint bar useful site-wide. Highest visible impact for lowest effort.
2. **Consolidate shared components** (formatBytes, FileDropZone component, Spinner). Do this before Tier 2/3 to avoid creating more duplication.
3. **Tier 2 for the 8 high-value tools.** URL state is a differentiator for a tools site.
4. **Tier 3 for 4 file-accepting tools.** Nice to have, not urgent.
5. **Tier 4 (CSS variables) only if dark mode is confirmed.** Do not do this speculatively.

### Honest assessment

The shared infrastructure is well-designed and the PDF tools prove it works. The gap is purely about adoption. The existing 34 tools are functional but feel like a different generation of the product. The keyboard shortcuts are the single highest-leverage retrofit because they make every tool feel professional and the infrastructure (ToolPageWrapper + ShortcutContext) is already in place. The CSS variable migration is the largest effort and should only happen with a clear theming mandate.
