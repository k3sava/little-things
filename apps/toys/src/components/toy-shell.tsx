"use client";

import { useCallback, useEffect, useRef } from "react";
import { Breadcrumb } from "./breadcrumb";

interface ToyShellProps {
  slug: string;
  title: string;
  tagline: string;
}

// Shared shell for single-canvas toys. The toy is served un-chromed at
// /e/<slug>/ and loaded in an isolated <iframe>. The page is a fixed,
// non-scrolling flex column: a solid top bar (breadcrumb; the floating
// ThemeSwitcher + ShareButton from the root layout sit over its corners) and
// the iframe filling exactly the remaining height. No page scroll and no footer
// below the iframe — that was producing a second scrollbar — and the solid bar
// stops the breadcrumb bleeding over the toy canvas.
export function ToyShell({ slug, title, tagline }: ToyShellProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const syncTheme = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme") || "default";
    const dark = root.hasAttribute("data-dark");
    try {
      frame.contentWindow?.postMessage({ kamiTheme: theme, kamiDark: dark }, "*");
    } catch { /* noop */ }
    try {
      const idoc = frame.contentDocument;
      if (idoc) {
        if (theme && theme !== "default") idoc.documentElement.setAttribute("data-theme", theme);
        else idoc.documentElement.removeAttribute("data-theme");
        idoc.documentElement.toggleAttribute("data-dark", dark);
      }
    } catch { /* cross-origin (dev) — postMessage already covered it */ }
  }, []);

  useEffect(() => {
    syncTheme();
    const obs = new MutationObserver(syncTheme);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-dark"],
    });
    return () => obs.disconnect();
  }, [syncTheme]);

  return (
    <div className="toy-page">
      <header className="toy-bar">
        <Breadcrumb
          fixed={false}
          items={[
            { label: "home", href: "https://apps.iamkesava.com" },
            { label: "toys", href: "/" },
            { label: title.toLowerCase() },
          ]}
        />
      </header>
      <iframe
        ref={frameRef}
        src={`/e/${slug}/`}
        title={`${title} — ${tagline}`}
        onLoad={syncTheme}
        className="toy-frame"
        allow="microphone; midi; clipboard-write; fullscreen; accelerometer; gyroscope"
      />
    </div>
  );
}
