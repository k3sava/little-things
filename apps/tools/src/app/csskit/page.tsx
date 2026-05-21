import type { Metadata } from "next";
import { redirect } from "next/navigation";

// Legacy kit URL. Redirects to the matching collection.
export const metadata: Metadata = {
  title: "CSS Kit — see the /for/designers collection | little tools",
  robots: { index: false, follow: true },
};

export default function Page() {
  redirect("/for/designers");
}
