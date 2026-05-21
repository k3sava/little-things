import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { findCaptureDir } from "@/lib/demokit";

export async function GET(
  _req: NextRequest,
  { params }: { params: { name: string } }
) {
  const dir = findCaptureDir(params.name);
  if (!dir) {
    return new NextResponse("Not found", { status: 404 });
  }

  const html = fs.readFileSync(path.join(dir, "template.html"), "utf-8");
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
