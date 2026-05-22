"use client";

import { useCallback, useEffect, useRef } from "react";
import { Breadcrumb } from "./breadcrumb";
import { Footer } from "./footer";

interface ToyShellProps {
  slug: string;
  title: string;
  tagline: string;
}

// Shared shell for single-canvas toys. The toy itself is served un-chromed at
// /e/<slug>/ and loaded in an isolated <iframe>; the chrome around it — fixed
// breadcrumb, footer, and the floating ThemeSwitcher/ShareButton from the root
// layout — is the SAME chrome the hub uses. So every toy has identical chrome
// by construction, and the toy's own CSS/JS can never leak into or crowd it.
export function ToyShell({ slug, title, tagline }: ToyShellProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Mirror the active theme into the iframe. Same-origin in production, so we
  // set data-theme directly; postMessage is the resilient fallback (and the
  // path the iframe's own listener uses).
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
    <>
      <Breadcrumb
        items={[
          { label: "home", href: "https://apps.iamkesava.com" },
          { label: "toys", href: "/" },
          { label: title.toLowerCase() },
        ]}
      />
      <iframe
        ref={frameRef}
        src={`/e/${slug}/`}
        title={`${title} — ${tagline}`}
        onLoad={syncTheme}
        className="toy-frame"
        allow="microphone; midi; clipboard-write; fullscreen; accelerometer; gyroscope"
      />
      <Footer />
    </>
  );
}
