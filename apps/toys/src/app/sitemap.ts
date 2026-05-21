import type { MetadataRoute } from "next";
import { aggregatedSlugs } from "@/data/toys";

const BASE = "https://toys.iamkesava.com";

// Hub + every aggregated toy (each lives at /<slug>/, served from public/<slug>/).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...aggregatedSlugs.map((slug) => ({
      url: `${BASE}/${slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
