import type { Metadata } from "next";
import { redirect } from "next/navigation";

// Legacy kit URL. Redirects to the matching collection.
export const metadata: Metadata = {
  title: "Dev Kit — see the /for/developers collection | little tools",
  robots: { index: false, follow: true },
};

export default function Page() {
  redirect("/for/developers");
}
