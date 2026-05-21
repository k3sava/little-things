import type { Metadata } from "next";
import { JsonLd, solutionLd } from "@/lib/json-ld";
import { Breadcrumb } from "@/components/breadcrumb";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ink and Void, a CSS Zen Garden submission by Kesava",
  description:
    "A CSS Zen Garden submission using modern CSS: scroll-driven animations, oklch color, @property, subgrid, container queries. 1800+ lines of CSS, zero images, zero JavaScript.",
  authors: [{ name: "Kesava" }],
  alternates: { canonical: "https://apps.iamkesava.com/playground/zen-garden" },
  openGraph: {
    title: "Ink and Void, a CSS Zen Garden submission",
    description:
      "A CSS Zen Garden submission using modern CSS: scroll-driven animations, oklch color, @property, subgrid, container queries. Zero images, zero JavaScript.",
    url: "https://apps.iamkesava.com/playground/zen-garden",
    siteName: "Kami Studios",
    type: "website",
    images: [{ url: "https://apps.iamkesava.com/og/playground-zen-garden.svg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ink and Void, a CSS Zen Garden submission by Kesava",
    description:
      "A CSS Zen Garden submission using modern CSS: scroll-driven animations, oklch color, @property, subgrid, container queries. Zero images, zero JavaScript.",
    images: ["https://apps.iamkesava.com/og/playground-zen-garden.svg"]
  },
};

export default function ZenGardenPage() {
  return (
    <>
      <JsonLd data={solutionLd({"url":"https://apps.iamkesava.com/playground/zen-garden","name":"Ink and Void","description":"A CSS Zen Garden submission using modern CSS. Scroll-driven animations, oklch color, @property, subgrid, container queries. 1800 lines of pure CSS, zero images, zero JavaScript."})} />
      <div className="kami-playground flex min-h-screen flex-col kami-text">
      <Breadcrumb
        items={[
          { label: "home", href: "https://apps.iamkesava.com" },
          { label: "playground", href: "/playground" },
          { label: "zen garden" },
        ]}
      />
      <iframe
        src="/zen-garden.html"
        className="w-full flex-1 border-0"
        title="Ink and Void, CSS Zen Garden"
      />
      <div className="mx-auto max-w-[900px] px-8">
        <Footer />
      </div>
    </div>
  </>
  );
}
