import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { findCaptureDir } from "@/lib/demokit";

export async function GET(
  _req: NextRequest,
  { params }: { params: { name: string } }
) {
  const name = params.name;
  const dir = findCaptureDir(name);

  if (!dir) {
    return NextResponse.json({ error: "Capture not found" }, { status: 404 });
  }

  const manifestPath = path.join(dir, "manifest.json");
  interface ManifestVar {
    key: string;
    type: string;
    selector: string;
    default: string;
  }
  let manifest: { variables: ManifestVar[] } = { variables: [] };
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch {}
  }

  const personas: Record<string, Record<string, string | number>> = {};
  const personasDir = path.join(dir, "personas");
  if (fs.existsSync(personasDir)) {
    const files = fs
      .readdirSync(personasDir)
      .filter((f) => f.endsWith(".json"));
    for (const f of files) {
      try {
        personas[f.replace(".json", "")] = JSON.parse(
          fs.readFileSync(path.join(personasDir, f), "utf-8")
        );
      } catch {}
    }
  }

  const renderedDir = path.join(dir, "rendered");
  const screenshots: string[] = [];
  if (fs.existsSync(renderedDir)) {
    screenshots.push(
      ...fs.readdirSync(renderedDir).filter((f) => f.endsWith(".png"))
    );
  }

  return NextResponse.json({ name, manifest, personas, screenshots });
}
