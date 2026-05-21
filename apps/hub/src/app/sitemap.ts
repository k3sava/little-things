import type { MetadataRoute } from "next";

const BASE = "https://apps.iamkesava.com";

const playgroundItems = ["zen-garden"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 1.0 },
    ...playgroundItems.map((p) => ({
      url: `${BASE}/playground/${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
