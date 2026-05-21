import type { Metadata } from "next";
import { getToolByHref, getPrimaryCollection } from "@/data/tools";

const SITE = "https://tools.iamkesava.com";

export function generateToolMetadata(href: string): Metadata {
  const tool = getToolByHref(href);
  if (!tool) {
    return {
      title: "little tools",
      description: "Free browser-based tools by Kesava.",
    };
  }
  const collection = getPrimaryCollection(tool);
  const url = `${SITE}${href}`;
  return {
    title: `${tool.name} — free ${collection.title.toLowerCase()} tool`,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: tool.name,
      description: tool.description,
      url,
      siteName: "little tools",
      type: "website",
      images: [{ url: `${SITE}/og${href}.svg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.name,
      description: tool.description,
    },
  };
}
