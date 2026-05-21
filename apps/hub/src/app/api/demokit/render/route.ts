import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { findCaptureDir } from "@/lib/demokit";

export async function POST(req: NextRequest) {
  try {
    const { captureName, persona, viewport, scale } = await req.json();

    if (!captureName) {
      return NextResponse.json(
        { error: "captureName required" },
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

    // Screenshot rendering requires Playwright which needs a local environment.
    // Check if we can exec the CLI (local dev only).
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      const demoPath = path.relative(
        path.resolve(process.cwd(), ".."),
        dir
      );
      let cmd: string;

      if (persona) {
        const personaPath = path.join(demoPath, "personas", `${persona}.json`);
        cmd = `node demokit/dist/cli.js render -d ${JSON.stringify(demoPath)} -p ${JSON.stringify(personaPath)}`;
      } else {
        cmd = `node demokit/dist/cli.js batch-render -d ${JSON.stringify(demoPath)}`;
      }

      if (viewport) cmd += ` --viewport ${viewport}`;
      if (scale) cmd += ` --scale ${scale}`;

      const { stdout } = await execAsync(cmd, {
        cwd: path.resolve(process.cwd(), ".."),
        timeout: 120000,
      });

      const renderedDir = path.join(dir, "rendered");
      let screenshots: string[] = [];
      if (fs.existsSync(renderedDir)) {
        screenshots = fs
          .readdirSync(renderedDir)
          .filter((f) => f.endsWith(".png"));
      }

      return NextResponse.json({ success: true, screenshots, output: stdout });
    } catch {
      return NextResponse.json(
        {
          error:
            "Screenshot rendering requires a local environment with Playwright. Use the CLI: node demokit/dist/cli.js render -d demos/<name>",
        },
        { status: 501 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
