import type { Metadata } from "next";
import { JsonLd, solutionLd } from "@/lib/json-ld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stem Studio: split, manipulate, sample, remix",
  description:
    "Upload any song and split it into vocals, drums, bass, and other stems using AI. Apply effects, pitch shift, time stretch, create samples, and export remixes.",
  authors: [{ name: "Kesava" }],
  alternates: { canonical: "https://apps.iamkesava.com/playground/stem-studio" },
  openGraph: {
    title: "Stem Studio: split, manipulate, sample, remix",
    description:
      "AI-powered stem separation with a full production studio: effects, pitch shift, time stretch, sample maker, and mix export.",
    url: "https://apps.iamkesava.com/playground/stem-studio",
    siteName: "Kami Studios",
    type: "website",
    images: [{ url: "https://apps.iamkesava.com/og/playground-stem-studio.svg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Stem Studio: split, manipulate, sample, remix",
    description:
      "AI-powered stem separation with effects, pitch shift, time stretch, sample maker, and mix export.",
    images: ["https://apps.iamkesava.com/og/playground-stem-studio.svg"]
  },
};

export default function StemStudioPage() {
  return (
    <>
      <JsonLd data={solutionLd({"url":"https://apps.iamkesava.com/playground/stem-studio","name":"Stem Studio","description":"Upload any song. AI splits it into vocals, drums, bass, and other stems. Effects, pitch shift, time stretch, sample maker, mix export. All in your browser."})} />
      <iframe
      src="/stem-studio.html"
      title="Stem Studio"
      allow="autoplay"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        zIndex: 1,
      }}
    />
  </>
  );
}
