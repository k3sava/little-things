import { NextRequest, NextResponse } from "next/server";
import { inlineResources, saveCapture } from "@/lib/demokit";

/**
 * Capture a web page by fetching its HTML and inlining all resources.
 * Works on Vercel serverless — no Playwright/Chromium needed.
 *
 * Accepts either:
 *   { url: "https://..." }                      — fetches the page server-side
 *   { html: "<html>...", url: "...", name: "x" } — uses provided HTML (bookmarklet/authenticated pages)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, html: rawHtml, name, skipInline } = body;

    if (!url && !rawHtml) {
      return NextResponse.json(
        { error: "Either 'url' or 'html' is required" },
        { status: 400 }
      );
    }

    const baseUrl = url || "";
    const captureName =
      name ||
      (url
        ? url
            .replace(/https?:\/\//, "")
            .replace(/[^a-z0-9]/gi, "-")
            .slice(0, 40)
        : `capture-${Date.now()}`);

    // Step 1: Get raw HTML
    let html: string;
    if (rawHtml) {
      html = rawHtml;
    } else {
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(30000),
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          redirect: "follow",
        });
        if (!res.ok) {
          return NextResponse.json(
            { error: `Failed to fetch URL: ${res.status} ${res.statusText}` },
            { status: 502 }
          );
        }
        html = await res.text();
      } catch (err) {
        return NextResponse.json(
          {
            error: `Could not reach URL: ${err instanceof Error ? err.message : String(err)}`,
          },
          { status: 502 }
        );
      }
    }

    // Step 2: Inline resources (skip if bookmarklet already inlined)
    const processedHtml = skipInline
      ? html
      : await inlineResources(html, baseUrl);

    // Step 3: Save capture
    await saveCapture(captureName, processedHtml);

    return NextResponse.json({
      name: captureName,
      size: Buffer.byteLength(processedHtml, "utf-8"),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
