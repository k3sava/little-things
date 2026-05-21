import type { Metadata } from "next";
import { redirect } from "next/navigation";

// file-converter was an image-only converter, fully superseded by
// /image-converter. Kept as a redirect so old links/bookmarks resolve.
export const metadata: Metadata = {
  title: "File Converter moved to Image Converter | little tools",
  robots: { index: false, follow: true },
};

export default function Page() {
  redirect("/image-converter");
}
