import { Footer } from "@/components/footer";
import { allTools, getPrimaryCollection } from "@/data/tools";
import { ToolPageClient } from "./tool-page-client";
import type { BreadcrumbItem } from "@/contexts/breadcrumb-context";

interface ToolPageWrapperProps {
  /** Pass the canonical href (e.g. "/meeting-cost") for SSR breadcrumbs.
   *  Existing pages that omit it get breadcrumbs resolved client-side via
   *  ToolPageClient's usePathname fallback. */
  href?: string;
  children: React.ReactNode;
}

export function ToolPageWrapper({ href, children }: ToolPageWrapperProps) {
  // When href is known server-side, compute breadcrumbs here.
  let breadcrumbs: BreadcrumbItem[] | undefined;

  if (href) {
    const cleanHref = href.replace(/\/$/, "") || href;
    const tool = allTools.find((t) => t.href === cleanHref);
    const collection = tool ? getPrimaryCollection(tool) : null;
    breadcrumbs = [
      { label: "home", href: "https://apps.iamkesava.com" },
      { label: "tools", href: "/" },
      ...(collection ? [{ label: collection.title.toLowerCase(), href: collection.href }] : []),
      { label: tool?.name.toLowerCase() ?? "tool" },
    ];
  }

  return (
    <ToolPageClient href={href?.replace(/\/$/, "") || href} breadcrumbs={breadcrumbs}>
      <div className="kami-scope kami-text">
        <div>{children}</div>
        <Footer />
      </div>
    </ToolPageClient>
  );
}
