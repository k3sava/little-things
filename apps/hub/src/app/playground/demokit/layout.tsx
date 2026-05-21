import type { Metadata } from "next";
import { KamiBreadcrumb } from "@/components/kami-breadcrumb";
import { KamiFooter } from "@/components/kami-footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DemoKit — capture and showcase web demos",
  description:
    "Record, annotate, and share interactive web page demos. Everything runs in your browser.",
  authors: [{ name: "Kesava" }],
  robots: { index: false, follow: false },
  alternates: { canonical: "https://apps.iamkesava.com/playground/demokit" },
  openGraph: {
    title: "DemoKit — capture and showcase web demos",
    description:
      "Record, annotate, and share interactive web page demos. Everything runs in your browser.",
    url: "https://apps.iamkesava.com/playground/demokit",
    siteName: "Kami Studios",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "DemoKit — capture and showcase web demos",
    description:
      "Record, annotate, and share interactive web page demos. Everything runs in your browser.",
  },
};

export default function DemoKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="kami-page min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3">
        <KamiBreadcrumb
          items={[
            { label: "home", href: "/" },
            { label: "playground", href: "/playground" },
            { label: "demokit" },
          ]}
        />
      </div>
      <header className="border-b px-4 sm:px-6 py-4 kami-border-bottom-strong">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/playground/demokit" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">DemoKit</span>
            <span className="text-xs px-2 py-0.5 rounded-full kami-badge">
              beta
            </span>
          </a>
          <nav className="flex items-center gap-4 text-sm kami-text-muted">
            <a href="/playground/demokit" className="hover:text-black transition-colors">
              Dashboard
            </a>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
      <KamiFooter current="apps" />
    </div>
  );
}
