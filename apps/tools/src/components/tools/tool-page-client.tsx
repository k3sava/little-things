"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShortcutProvider } from "@/contexts/shortcut-context";
import { BreadcrumbContext } from "@/contexts/breadcrumb-context";
import type { BreadcrumbItem } from "@/contexts/breadcrumb-context";
import { allTools, getPrimaryCollection } from "@/data/tools";
import { RelatedTools } from "./related-tools";
import { Footer } from "@/components/footer";

const RECENT_KEY = "tools-recent";
const RECENT_MAX = 6;

function recordRecent(href: string) {
  if (typeof window === "undefined") return;
  try {
    const list: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    const next = [href, ...list.filter((h) => h !== href)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

interface ToolPageClientProps {
  /** Canonical href computed server-side. When absent, falls back to usePathname(). */
  href?: string;
  /** Breadcrumbs computed server-side. When absent, derived from pathname + tools manifest. */
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

export function ToolPageClient({ href: hrefProp, breadcrumbs: breadcrumbsProp, children }: ToolPageClientProps) {
  const rawPathname = usePathname();
  const pathname = rawPathname?.replace(/\/$/, "") || rawPathname || "";

  // Resolve the canonical href — prefer server-provided, fall back to pathname
  const resolvedHref = hrefProp ?? pathname;

  // When breadcrumbs weren't computed server-side, derive them here
  const tool = allTools.find((t) => t.href === resolvedHref);
  const collection = tool ? getPrimaryCollection(tool) : null;

  const resolvedBreadcrumbs: BreadcrumbItem[] = breadcrumbsProp ?? [
    { label: "home", href: "https://apps.iamkesava.com" },
    { label: "tools", href: "/" },
    ...(collection ? [{ label: collection.title.toLowerCase(), href: collection.href }] : []),
    { label: tool?.name.toLowerCase() ?? "tool" },
  ];

  useEffect(() => {
    if (resolvedHref) recordRecent(resolvedHref);
  }, [resolvedHref]);

  return (
    <ShortcutProvider>
      <BreadcrumbContext.Provider value={resolvedBreadcrumbs}>
        {children}
        <div className="kami-scope kami-text">
          {tool && (
            <div className="px-4 pb-12 lg:px-6">
              <RelatedTools currentHref={tool.href} />
            </div>
          )}
          <Footer />
        </div>
      </BreadcrumbContext.Provider>
    </ShortcutProvider>
  );
}
