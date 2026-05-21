import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { findCaptureDir, annotateHtml, generateManifest } from "@/lib/demokit";

export async function POST(req: NextRequest) {
  try {
    const { captureName, annotations } = await req.json();

    if (!captureName || !annotations) {
      return NextResponse.json(
        { error: "captureName and annotations required" },
        { status: 400 }
      );
    }

    const dir = findCaptureDir(captureName);
    if (!dir) {
      return NextResponse.json(
        { error: "Capture not found" },
        { status: 404 }
      );
    }

    const templatePath = path.join(dir, "template.html");
    const html = fs.readFileSync(templatePath, "utf-8");

    // Apply annotations directly with cheerio (no child_process needed)
    const annotated = annotateHtml(html, annotations);
    fs.writeFileSync(templatePath, annotated, "utf-8");

    // Regenerate manifest
    const manifest = generateManifest(annotated);
    fs.writeFileSync(
      path.join(dir, "manifest.json"),
      JSON.stringify(manifest, null, 2)
    );

    return NextResponse.json({
      success: true,
      variableCount: manifest.variables.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
