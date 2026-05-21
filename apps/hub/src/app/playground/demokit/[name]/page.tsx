"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";

interface Variable {
  key: string;
  type: string;
  selector: string;
  default: string;
}

interface CaptureData {
  name: string;
  manifest: { variables: Variable[] };
  personas: Record<string, Record<string, string | number>>;
  screenshots: string[];
}

export default function DemoKitEditor() {
  const params = useParams();
  const name = (params?.name as string) || "";
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [data, setData] = useState<CaptureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"preview" | "variables" | "personas" | "render">("preview");
  const [renderStatus, setRenderStatus] = useState("");
  const [rendering, setRendering] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [annotating, setAnnotating] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{
    selector: string;
    text: string;
    tag: string;
  } | null>(null);
  const [newVarKey, setNewVarKey] = useState("");
  const [newVarType, setNewVarType] = useState("text");

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(`/api/demokit/captures/${name}`);
      const json = await res.json();
      if (json.error || !json.manifest) {
        setData(null);
      } else {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function injectAnnotationScript() {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;

    // Inject hover highlight styles
    const style = doc.createElement("style");
    style.textContent = `
      .dk-hover { outline: 2px dashed #3b82f6 !important; outline-offset: 2px; cursor: crosshair !important; }
      .dk-annotated { outline: 2px solid #22c55e !important; outline-offset: 2px; }
      .dk-selected { outline: 2px solid #f59e0b !important; outline-offset: 2px; }
    `;
    doc.head.appendChild(style);

    // Highlight existing annotated elements
    doc.querySelectorAll("[data-dk-var]").forEach((el) => {
      el.classList.add("dk-annotated");
    });

    // Hover effect
    doc.body.addEventListener("mouseover", (e) => {
      const el = e.target as HTMLElement;
      if (el === doc.body) return;
      el.classList.add("dk-hover");
    });
    doc.body.addEventListener("mouseout", (e) => {
      const el = e.target as HTMLElement;
      el.classList.remove("dk-hover");
    });

    // Click to select
    doc.body.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const el = e.target as HTMLElement;
      if (el === doc.body) return;

      // Remove previous selection
      doc.querySelectorAll(".dk-selected").forEach((s) =>
        s.classList.remove("dk-selected")
      );
      el.classList.add("dk-selected");

      // Build a simple unique selector
      const tag = el.tagName.toLowerCase();
      const existingVar = el.getAttribute("data-dk-var");
      let selector = tag;

      if (el.id) {
        selector = `#${el.id}`;
      } else if (el.className && typeof el.className === "string") {
        const classes = el.className
          .split(" ")
          .filter(
            (c) =>
              c &&
              !c.startsWith("dk-") &&
              !c.includes("hover") &&
              !c.includes("selected")
          )
          .slice(0, 2);
        if (classes.length > 0) {
          selector = `${tag}.${classes.join(".")}`;
        }
      }

      window.parent.postMessage(
        {
          type: "dk-select",
          selector,
          text: el.textContent?.slice(0, 100) || "",
          tag,
          existingVar,
        },
        "*"
      );
    });
  }

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "dk-select") {
        setSelectedElement({
          selector: e.data.selector,
          text: e.data.text,
          tag: e.data.tag,
        });
        if (e.data.existingVar) {
          setNewVarKey(e.data.existingVar);
        } else {
          setNewVarKey("");
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function handleIframeLoad() {
    if (annotating) {
      injectAnnotationScript();
    }
  }

  function toggleAnnotateMode() {
    setAnnotating(!annotating);
    if (!annotating) {
      // About to enable - inject script on next load
      const iframe = iframeRef.current;
      if (iframe?.contentDocument) {
        injectAnnotationScript();
      }
    } else {
      // Disabling - reload iframe to clear
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.src = iframe.src;
      }
      setSelectedElement(null);
    }
  }

  async function handleAnnotate() {
    if (!selectedElement || !newVarKey) return;

    try {
      const res = await fetch("/api/demokit/annotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captureName: name,
          annotations: [
            {
              selector: selectedElement.selector,
              key: newVarKey,
              type: newVarType,
            },
          ],
        }),
      });
      const result = await res.json();
      if (result.error) {
        alert(result.error);
      } else {
        setSelectedElement(null);
        setNewVarKey("");
        await loadData();
        // Reload iframe to show updated annotations
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src;
        }
      }
    } catch (err) {
      alert(String(err));
    }
  }

  async function handleRender(persona?: string) {
    setRendering(true);
    setRenderStatus("Rendering...");
    try {
      const res = await fetch("/api/demokit/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captureName: name,
          persona: persona || undefined,
        }),
      });
      const result = await res.json();
      if (result.error) {
        setRenderStatus(`Error: ${result.error}`);
      } else {
        setRenderStatus(
          `Done — ${result.screenshots.length} screenshot(s) rendered`
        );
        await loadData();
      }
    } catch (err) {
      setRenderStatus(`Error: ${String(err)}`);
    } finally {
      setRendering(false);
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-zinc-500">Loading...</div>;
  }
  if (!data) {
    return <div className="text-center py-20 text-zinc-500">Capture not found</div>;
  }

  const tabs = [
    { id: "preview" as const, label: "Preview" },
    { id: "variables" as const, label: `Variables (${data.manifest.variables.length})` },
    { id: "personas" as const, label: `Personas (${Object.keys(data.personas).length})` },
    { id: "render" as const, label: `Screenshots (${data.screenshots.length})` },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <a
              href="/playground/demokit"
              className="text-sm text-zinc-500 hover:text-white transition-colors shrink-0"
            >
              Captures
            </a>
            <span className="text-zinc-700 shrink-0">/</span>
            <h1 className="text-lg font-medium truncate">{name}</h1>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={toggleAnnotateMode}
            className={`text-sm px-4 py-2 rounded-lg transition-colors ${
              annotating
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {annotating ? "Annotating..." : "Annotate"}
          </button>
          <button
            onClick={() => handleRender()}
            disabled={rendering}
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {rendering ? "Rendering..." : "Render All"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-900 rounded-lg p-1 w-full sm:w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm px-4 py-1.5 rounded-md transition-colors ${
              tab === t.id
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "preview" && (
        <div className="space-y-4">
          {annotating && selectedElement && (
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-medium">
                Selected: <code className="text-blue-400">{selectedElement.selector}</code>
              </h3>
              <p className="text-xs text-zinc-500 truncate">
                Content: {selectedElement.text}
              </p>
              <div className="flex gap-3 items-end">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">
                    Variable Key
                  </label>
                  <input
                    type="text"
                    value={newVarKey}
                    onChange={(e) => setNewVarKey(e.target.value)}
                    placeholder="headline"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Type</label>
                  <select
                    value={newVarType}
                    onChange={(e) => setNewVarType(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-zinc-500"
                  >
                    <option value="text">text</option>
                    <option value="image">image</option>
                    <option value="link">link</option>
                    <option value="number">number</option>
                    <option value="date">date</option>
                  </select>
                </div>
                <button
                  onClick={handleAnnotate}
                  disabled={!newVarKey}
                  className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {annotating && !selectedElement && (
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-4">
              <p className="text-sm text-blue-300">
                Click on any element in the preview below to select it for annotation.
                Green outlines show already-annotated elements.
              </p>
            </div>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <iframe
              ref={iframeRef}
              src={`/api/demokit/captures/${name}/template`}
              className="w-full border-0"
              style={{ height: "70vh" }}
              onLoad={handleIframeLoad}
              sandbox={annotating ? "allow-scripts allow-same-origin" : "allow-same-origin"}
            />
          </div>
        </div>
      )}

      {tab === "variables" && (
        <div className="space-y-2">
          {data.manifest.variables.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p>No variables annotated yet</p>
              <p className="text-sm mt-1">
                Use the Annotate button to mark editable regions
              </p>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs">
                    <th className="text-left px-4 py-3 font-medium">Key</th>
                    <th className="text-left px-4 py-3 font-medium">Type</th>
                    <th className="text-left px-4 py-3 font-medium">Selector</th>
                    <th className="text-left px-4 py-3 font-medium">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {data.manifest.variables.map((v) => (
                    <tr key={v.key} className="border-b border-zinc-800/50">
                      <td className="px-4 py-3 font-mono text-blue-400">
                        {v.key}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{v.type}</td>
                      <td className="px-4 py-3 text-zinc-500 font-mono text-xs">
                        {v.selector}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 truncate max-w-xs">
                        {v.default}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "personas" && (
        <div className="space-y-4">
          {Object.keys(data.personas).length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p>No personas yet</p>
              <p className="text-sm mt-1 font-mono">
                Add JSON files to demos/{name}/personas/
              </p>
            </div>
          ) : (
            Object.entries(data.personas).map(([pName, values]) => (
              <div
                key={pName}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">{pName}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedPersona(pName);
                        handleRender(pName);
                      }}
                      disabled={rendering}
                      className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                    >
                      {rendering && selectedPersona === pName
                        ? "Rendering..."
                        : "Render"}
                    </button>
                  </div>
                </div>
                <pre className="text-xs text-zinc-400 bg-zinc-950 rounded-lg p-3 overflow-x-auto">
                  {JSON.stringify(values, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "render" && (
        <div className="space-y-4">
          {renderStatus && (
            <p
              className={`text-sm px-3 py-2 rounded-lg ${
                renderStatus.startsWith("Error")
                  ? "bg-red-950/30 text-red-400"
                  : "bg-green-950/30 text-green-400"
              }`}
            >
              {renderStatus}
            </p>
          )}
          {data.screenshots.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p>No screenshots rendered yet</p>
              <p className="text-sm mt-1">
                Click &quot;Render All&quot; to generate screenshots
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.screenshots.map((s) => (
                <div
                  key={s}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                >
                  <p className="text-xs text-zinc-500 font-mono mb-2">{s}</p>
                  <div className="bg-zinc-950 rounded-lg p-2 text-center text-zinc-600 text-sm">
                    {s}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
