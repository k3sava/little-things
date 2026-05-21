// Schema.org @graph helpers for the apps site. Vercel-runtime friendly.

import type { ReactNode } from "react";

export const SITE = "https://apps.iamkesava.com";

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function rootLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": SITE + "/#site",
        name: "apps.iamkesava, Kami Studios",
        alternateName: "Kami Studios apps",
        description:
          "Kami Studios apps and playground experiments by Kesava. AI-powered creative tools.",
        url: SITE + "/",
        publisher: { "@id": SITE + "/#org" },
        sameAs: [
          "https://tools.iamkesava.com/",
          "https://toys.iamkesava.com/",
          "https://codex.iamkesava.com/",
          "https://iamkesava.com/",
        ],
      },
      {
        "@type": "Organization",
        "@id": SITE + "/#org",
        name: "Kami Studios",
        url: "https://iamkesava.com",
        founder: { "@type": "Person", name: "Kesava", url: "https://iamkesava.com" },
        sameAs: ["https://github.com/k3sava", "https://www.linkedin.com/in/k3sava"],
      },
    ],
  };
}

export interface CollectionLdInput {
  id: string;
  title: string;
  description: string;
  hrefSegment: string; // e.g. "/for/developers"
  toolUrls?: { name: string; url: string; description: string }[];
}
export function collectionLd({ id, title, description, hrefSegment, toolUrls = [] }: CollectionLdInput) {
  const url = SITE + hrefSegment;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        name: title,
        description,
        url,
        publisher: { "@type": "Organization", name: "Kami Studios", url: SITE },
        ...(toolUrls.length
          ? {
              hasPart: toolUrls.slice(0, 30).map((t) => ({
                "@type": "SoftwareApplication",
                name: t.name,
                url: t.url,
                description: t.description,
              })),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "apps", item: SITE + "/" },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
      {
        "@type": "WebPage",
        "@id": url + "#page",
        url,
        name: title,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "main p:first-of-type"],
        },
      },
    ],
  };
}

export interface ArticleLdInput {
  url: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  category?: string;
  categoryUrl?: string;
}
export function articleLd({ url, headline, description, datePublished, dateModified, category, categoryUrl }: ArticleLdInput) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": url,
        headline,
        description,
        url,
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        author: { "@type": "Person", name: "Kesava", url: "https://iamkesava.com" },
        publisher: { "@type": "Organization", name: "Kami Studios", url: SITE },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "apps", item: SITE + "/" },
          ...(category && categoryUrl
            ? [{ "@type": "ListItem", position: 2, name: category, item: categoryUrl }]
            : []),
          { "@type": "ListItem", position: category ? 3 : 2, name: headline, item: url },
        ],
      },
    ],
  };
}

export interface SolutionLdInput {
  url: string;
  name: string;
  description: string;
}
export function solutionLd({ url, name, description }: SolutionLdInput) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        name,
        description,
        url,
        publisher: { "@type": "Organization", name: "Kami Studios", url: SITE },
        about: { "@type": "Thing", name },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "main p:first-of-type"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "apps", item: SITE + "/" },
          { "@type": "ListItem", position: 2, name: "playground", item: SITE + "/playground" },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": url + "#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is ${name}?`,
            acceptedAnswer: { "@type": "Answer", text: description },
          },
          {
            "@type": "Question",
            name: `Is ${name} free?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Free, no signup, no ads. Runs in your browser as part of Kami Studios apps.",
            },
          },
          {
            "@type": "Question",
            name: `Where can I find the source?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "Source for the apps + playground lives at https://github.com/k3sava/kami.",
            },
          },
        ],
      },
    ],
  };
}

export function JsonLdRoot({ children }: { children?: ReactNode }) {
  return (
    <>
      <JsonLd data={rootLd()} />
      {children}
    </>
  );
}
