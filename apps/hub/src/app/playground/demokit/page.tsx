"use client";

import { useState, useEffect, useCallback } from "react";
import { JsonLd, solutionLd } from "@/lib/json-ld";

interface Capture {
  name: string;
  hasTemplate: boolean;
  variableCount: number;
  personas: string[];
  screenshots: string[];
  updatedAt: string;
}

function getBookmarkletCode(host: string): string {
  // Minified bookmarklet — captures the DOM from the user's browser and posts to DemoKit
  return `javascript:void((function(){var h=document.documentElement.outerHTML,u=location.href,n=prompt('Capture name:',location.hostname.replace(/\\./g,'-'));if(!n)return;var x=new XMLHttpRequest();x.open('POST','${host}/api/demokit/capture',true);x.setRequestHeader('Content-Type','application/json');x.onload=function(){var r=JSON.parse(x.responseText);if(r.error){alert('Error: '+r.error)}else{alert('Captured! Opening editor...');window.open('${host}/demokit/'+r.name)}};x.onerror=function(){alert('Capture failed — check that DemoKit is running at ${host}')};x.send(JSON.stringify({html:h,url:u,name:n,skipInline:true}))})())`;
}

export default function DemoKitDashboard() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCapture, setShowCapture] = useState(false);
  const [captureMode, setCaptureMode] = useState<"url" | "html" | "bookmarklet">("bookmarklet");
  const [captureUrl, setCaptureUrl] = useState("");
  const [captureName, setCaptureName] = useState("");
  const [captureHtml, setCaptureHtml] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState("");
  const [host, setHost] = useState("");

  useEffect(() => {
    setHost(window.location.origin);
  }, []);

  const loadCaptures = useCallback(async () => {
    try {
      const res = await fetch("/api/demokit/captures");
      const data = await res.json();
      setCaptures(data.captures || []);
    } catch {
      console.error("Failed to load captures");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCaptures();
  }, [loadCaptures]);

  async function handleCapture(e: React.FormEvent) {
    e.preventDefault();
    if (captureMode === "url" && !captureUrl) return;
    if (captureMode === "html" && !captureHtml) return;

    setCapturing(true);
    setCaptureError("");

    try {
      const payload: Record<string, string | boolean | undefined> = {
        name: captureName || undefined,
      };

      if (captureMode === "url") {
        payload.url = captureUrl;
      } else {
        payload.html = captureHtml;
        payload.url = captureUrl || undefined;
        payload.skipInline = !captureUrl; // skip inline if no base URL provided
      }

      const res = await fetch("/api/demokit/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        setCaptureError(data.error);
      } else {
        setCaptureUrl("");
        setCaptureName("");
        setCaptureHtml("");
        setShowCapture(false);
        await loadCaptures();
      }
    } catch (err) {
      setCaptureError(String(err));
    } finally {
      setCapturing(false);
    }
  }

  return (
    <>
      <JsonLd data={solutionLd({"url":"https://apps.iamkesava.com/playground/demokit","name":"DemoKit","description":"Capture and play back any web page as a demo. Bookmarklet for authenticated pages, URL fetch for public ones. Annotations, hotspots, exportable to share."})} />
      <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Captures</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Captured web pages for interactive demos and marketing screenshots
          </p>
        </div>
        <button
          onClick={() => setShowCapture(!showCapture)}
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          New Capture
        </button>
      </div>

      {showCapture && (
        <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Capture a page</h2>
            <div className="flex bg-zinc-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setCaptureMode("bookmarklet")}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  captureMode === "bookmarklet"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                Bookmarklet
              </button>
              <button
                type="button"
                onClick={() => setCaptureMode("url")}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  captureMode === "url"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                From URL
              </button>
              <button
                type="button"
                onClick={() => setCaptureMode("html")}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  captureMode === "html"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                Paste HTML
              </button>
            </div>
          </div>

          {captureMode === "bookmarklet" && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">
                Drag this button to your bookmarks bar. Navigate to any page
                (including logged-in apps), then click it to capture.
              </p>
              <div className="flex items-center gap-4">
                {host && (
                  <a
                    href={getBookmarkletCode(host)}
                    onClick={(e) => e.preventDefault()}
                    draggable
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-colors select-none"
                    title="Drag this to your bookmarks bar"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                    Capture Page
                  </a>
                )}
                <span className="text-xs text-zinc-600">
                  Drag to bookmarks bar
                </span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-500 space-y-2">
                <p className="font-medium text-zinc-400">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Drag the blue &ldquo;Capture Page&rdquo; button to your bookmarks bar</li>
                  <li>Navigate to the page you want to capture (log in first if needed)</li>
                  <li>Click the bookmarklet in your bookmarks bar</li>
                  <li>Enter a name and the page is captured instantly</li>
                </ol>
                <p className="text-zinc-600 mt-2">
                  Works with authenticated pages of any web app you are
                  signed into. The bookmarklet captures the live DOM exactly
                  as rendered in your browser.
                </p>
              </div>
            </div>
          )}

          {captureMode === "url" && (
            <form onSubmit={handleCapture} className="space-y-4">
              <p className="text-sm text-zinc-500">
                Fetch and capture a public URL. For logged-in pages, use the Bookmarklet instead.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">URL</label>
                  <input
                    type="url"
                    value={captureUrl}
                    onChange={(e) => setCaptureUrl(e.target.value)}
                    placeholder="https://example.com/dashboard"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Name (optional)</label>
                  <input
                    type="text"
                    value={captureName}
                    onChange={(e) => setCaptureName(e.target.value)}
                    placeholder="my-dashboard"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
              {captureError && (
                <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                  {captureError}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={capturing}
                  className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {capturing ? "Capturing..." : "Capture"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCapture(false)}
                  className="text-sm text-zinc-400 px-4 py-2 rounded-lg hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {captureMode === "html" && (
            <form onSubmit={handleCapture} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">HTML Source</label>
                <p className="text-xs text-zinc-600 mb-2">
                  Open DevTools (F12), right-click the{" "}
                  <code className="bg-zinc-800 px-1 rounded">&lt;html&gt;</code>{" "}
                  tag, select &ldquo;Copy &gt; Copy outerHTML&rdquo;, and paste here.
                </p>
                <textarea
                  value={captureHtml}
                  onChange={(e) => setCaptureHtml(e.target.value)}
                  placeholder="<!DOCTYPE html><html>...</html>"
                  rows={6}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-y"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Base URL (for resolving resources)
                  </label>
                  <input
                    type="url"
                    value={captureUrl}
                    onChange={(e) => setCaptureUrl(e.target.value)}
                    placeholder="https://app.example.com"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Name (optional)</label>
                  <input
                    type="text"
                    value={captureName}
                    onChange={(e) => setCaptureName(e.target.value)}
                    placeholder="my-dashboard"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
              {captureError && (
                <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                  {captureError}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={capturing}
                  className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {capturing ? "Capturing..." : "Capture"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCapture(false)}
                  className="text-sm text-zinc-400 px-4 py-2 rounded-lg hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading...</div>
      ) : captures.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 mb-2">No captures yet</p>
          <p className="text-sm text-zinc-600">
            Click &ldquo;New Capture&rdquo; and use the Bookmarklet to capture any page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {captures.map((cap) => (
            <a
              key={cap.name}
              href={`/playground/demokit/${cap.name}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 hover:border-zinc-600 transition-colors group min-w-0"
            >
              <h3 className="font-medium text-sm group-hover:text-white transition-colors break-words">
                {cap.name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-3 text-xs text-zinc-500">
                <span className="bg-zinc-800 px-2 py-0.5 rounded-full">
                  {cap.variableCount} var{cap.variableCount !== 1 ? "s" : ""}
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded-full">
                  {cap.personas.length} persona
                  {cap.personas.length !== 1 ? "s" : ""}
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded-full">
                  {cap.screenshots.length} screenshot
                  {cap.screenshots.length !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-xs text-zinc-600 mt-3">
                {new Date(cap.updatedAt).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  </>
  );
}
