"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";

const LISTING_PATHS = new Set([
  "/",
  "/tools",
  "/tools/textkit",
  "/tools/designkit",
  "/tools/devkit",
  "/playground",
]);

export function ShareButton() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "copied">("idle");

  const onShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = document.title;

    if ("share" in navigator) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to copy
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setState("copied");
        window.setTimeout(() => setState("idle"), 1800);
      } catch {
        // ignore
      }
    }
  }, []);

  if (pathname && LISTING_PATHS.has(pathname)) return null;

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="Share this page"
      className="kami-share-btn fixed z-[100] inline-flex items-center gap-1.5"
    >
      <ShareIcon />
      <span>{state === "copied" ? "Copied" : "Share"}</span>
    </button>
  );
}

function ShareIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
