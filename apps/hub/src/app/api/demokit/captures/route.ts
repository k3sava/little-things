import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { getDemosDirs } from "@/lib/demokit";

export async function GET() {
  try {
    const allCaptures: {
      name: string;
      hasTemplate: boolean;
      variableCount: number;
      personas: string[];
      screenshots: string[];
      updatedAt: string;
    }[] = [];

    const seen = new Set<string>();

    for (const demosDir of getDemosDirs()) {
      if (!fs.existsSync(demosDir)) continue;

      const entries = fs.readdirSync(demosDir, { withFileTypes: true });
      for (const e of entries) {
        if (!e.isDirectory() || seen.has(e.name)) continue;
        seen.add(e.name);

        const dir = path.join(demosDir, e.name);
        const hasTemplate = fs.existsSync(path.join(dir, "template.html"));
        if (!hasTemplate) continue;

        const manifestPath = path.join(dir, "manifest.json");
        let variableCount = 0;
        if (fs.existsSync(manifestPath)) {
          try {
            const manifest = JSON.parse(
              fs.readFileSync(manifestPath, "utf-8")
            );
            variableCount = manifest.variables?.length || 0;
          } catch {}
        }

        let personas: string[] = [];
        const personasDir = path.join(dir, "personas");
        if (fs.existsSync(personasDir)) {
          personas = fs
            .readdirSync(personasDir)
            .filter((f) => f.endsWith(".json"))
            .map((f) => f.replace(".json", ""));
        }

        let screenshots: string[] = [];
        const renderedDir = path.join(dir, "rendered");
        if (fs.existsSync(renderedDir)) {
          screenshots = fs
            .readdirSync(renderedDir)
            .filter((f) => f.endsWith(".png"));
        }

        const stat = fs.statSync(path.join(dir, "template.html"));

        allCaptures.push({
          name: e.name,
          hasTemplate,
          variableCount,
          personas,
          screenshots,
          updatedAt: stat.mtime.toISOString(),
        });
      }
    }

    return NextResponse.json({ captures: allCaptures });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
