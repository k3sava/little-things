"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppCard } from "@/components/app-card";
import { Breadcrumb } from "@/components/breadcrumb";
import { Footer } from "@/components/footer";
import { groups, allToys as allApps } from "@/data/toys";

function ToySearch({
  value,
  onChange,
  inputRef,
  placeholder = "Search experiments…",
}: {
  value: string;
  onChange: (v: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  placeholder?: string;
}) {
  return (
    <div className="toys-hub-search">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: 0.5, flexShrink: 0 }}>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        ref={inputRef}
        id="toys-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="toys-hub-search-input"
        aria-label="Search experiments"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} className="toys-hub-search-clear" aria-label="Clear">×</button>
      )}
    </div>
  );
}

export function ToysHubContent() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Focus whichever search input is currently visible (varies by theme)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (e.key === "/" && !inField) {
        e.preventDefault();
        const visible = Array.from(document.querySelectorAll<HTMLInputElement>(".toys-hub-search-input"))
          .find((el) => el.offsetParent !== null);
        (visible ?? searchRef.current)?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = activeGroup ? (groups.find(g => g.label === activeGroup)?.apps ?? allApps) : allApps;
    if (!q) return null;
    return pool.filter((app) =>
      [app.title, app.badge, app.description].join(" ").toLowerCase().includes(q)
    );
  }, [query, activeGroup]);

  return (
    <div className="kami-scope min-h-screen toys-hub kami-text">
      <Breadcrumb
        items={[
          { label: "home", href: "https://apps.iamkesava.com" },
          { label: "toys" },
        ]}
      />

      {/* ── Glass: frosted hero — always in DOM, CSS shows for glass theme ── */}
      <div className="hub-glass-hero">
        <div className="hub-glass-hero-inner">
          <p className="hub-glass-hero-eyebrow">little toys</p>
          <h1 className="hub-glass-hero-title">{allApps.length} experiments</h1>
          <p className="hub-glass-hero-sub">Interactive · Creative · In-browser</p>
          <div className="hub-glass-hero-search">
            <ToySearch value={query} onChange={setQuery} placeholder="Search experiments…" />
          </div>
        </div>
      </div>

      {/* ── Material: top app bar — always in DOM, CSS shows for material theme ── */}
      <div className="hub-material-appbar">
        <div className="hub-material-appbar-inner">
          <div>
            <p className="hub-material-appbar-label">little toys</p>
            <h1 className="hub-material-appbar-title">{allApps.length} experiments</h1>
          </div>
          <div className="hub-material-appbar-search">
            <ToySearch value={query} onChange={setQuery} placeholder="Search…" />
          </div>
        </div>
      </div>

      {/* ── Metro: flat header + pivot — always in DOM, CSS shows for metro theme ── */}
      <div className="hub-metro-header">
        <div className="hub-metro-header-top">
          <h1 className="hub-metro-title">toys</h1>
          <div className="hub-metro-search">
            <ToySearch value={query} onChange={setQuery} placeholder="Search…" />
          </div>
        </div>
        <nav className="metro-pivot hub-metro-pivot" role="tablist" aria-label="Categories">
          <button
            role="tab"
            aria-selected={activeGroup === null}
            className={`metro-pivot-item${activeGroup === null ? " is-active" : ""}`}
            onClick={() => setActiveGroup(null)}
          >
            All ({allApps.length})
          </button>
          {groups.map((g) => (
            <button
              key={g.label}
              role="tab"
              aria-selected={activeGroup === g.label}
              className={`metro-pivot-item${activeGroup === g.label ? " is-active" : ""}`}
              onClick={() => setActiveGroup(activeGroup === g.label ? null : g.label)}
            >
              {g.label}
            </button>
          ))}
        </nav>
      </div>

      <main id="main" className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8">

        {/* Default heading — CSS hides for glass/material/metro */}
        <div className="hub-default-heading mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl kami-text">
            Toys
          </h1>
          <p className="mt-3 kami-text-muted">
            Creative experiments and interactive toys.
          </p>
        </div>

        {/* Search + group chips — CSS hides for glass/metro; hides search for material */}
        <div className="hub-default-search-wrap mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="hub-default-search">
            <ToySearch value={query} onChange={setQuery} inputRef={searchRef} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveGroup(null)}
              data-active={activeGroup === null}
              className="tools-hub-chip"
            >
              All <span className="tools-hub-chip-count">{allApps.length}</span>
            </button>
            {groups.map((g) => {
              const isActive = activeGroup === g.label;
              return (
                <button
                  key={g.label}
                  onClick={() => setActiveGroup(isActive ? null : g.label)}
                  data-active={isActive}
                  className="tools-hub-chip"
                >
                  {g.label} <span className="tools-hub-chip-count">{g.apps.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results or group sections */}
        {filtered !== null ? (
          <section className="mb-10">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider kami-text-dim">
                Results
              </h2>
              <p className="text-xs kami-text-dim">
                {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm kami-text-muted kami-surface" style={{ borderStyle: "dashed" }}>
                No experiments match your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {filtered.map((app) => (
                  <AppCard key={app.href} title={app.title} badge={app.badge} description={app.description} href={app.href} external={(app as { external?: boolean }).external} ctaLabel="Play" />
                ))}
              </div>
            )}
          </section>
        ) : (
          (activeGroup
            ? groups.filter(g => g.label === activeGroup)
            : groups
          ).map((group) => (
            <section key={group.label} className="mb-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider kami-text-dim">
                {group.label} <span className="font-normal ml-1">{group.apps.length}</span>
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {group.apps.map((app) => (
                  <AppCard key={app.href} title={app.title} badge={app.badge} description={app.description} href={app.href} external={(app as { external?: boolean }).external} ctaLabel="Play" />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
}
