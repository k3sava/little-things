import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToyShell } from "@/components/toy-shell";
import { embedToys, getToyBySlug } from "@/data/toys";

export const dynamicParams = false;

export function generateStaticParams() {
  return embedToys.map((t) => ({ toy: t.slug }));
}

export function generateMetadata({ params }: { params: { toy: string } }): Metadata {
  const toy = getToyBySlug(params.toy);
  if (!toy) return {};
  const url = `https://toys.iamkesava.com/${toy.slug}/`;
  const title = `${toy.title} — ${toy.badge} | little toys`;
  return {
    title,
    description: toy.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: toy.description,
      url,
      siteName: "little toys",
      type: "website",
      images: [{ url: `${url}og.svg`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: toy.description },
  };
}

export default function ToyPage({ params }: { params: { toy: string } }) {
  const toy = getToyBySlug(params.toy);
  if (!toy || !toy.embed || !toy.slug) notFound();
  return <ToyShell slug={toy.slug} title={toy.title} tagline={toy.description} />;
}
