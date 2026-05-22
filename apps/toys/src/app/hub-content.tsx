"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppCard } from "@/components/app-card";
import { Breadcrumb } from "@/components/breadcrumb";
import { Footer } from "@/components/footer";
import { groups, allToys as allApps } from "@/data/toys";

// Mirror of the tools hub search so the two index pages are laid out identically.
function ToySearch({
  value,
  onChange,
  inputRef,
  placeholder = "Search toys…",
}: {
  value: string;
  onChange: (v: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  placeholder?: string;
}) {
  return (
    <div className="tools-hub-search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: 0.55 }}>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        ref={inputRef}
        id="toys-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="tools-hub-search-input"
        aria-label="Search toys"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} className="tools-hub-search-clear" aria-label="Clear search">×</button>
      )}
      <kbd className="tools-hub-search-kbd" aria-hidden="true">/</kbd>
    </div>
  );
}

export function ToysHubContent() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (e.key === "/" && !inField) {
        e.preventDefault();
        const visible = Array.from(document.querySelectorAll<HTMLInputElement>(".tools-hub-search-input"))
          .find((el) => el.offsetParent !== null);
        (visible ?? searchRef.current)?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    let pool = activeGroup ? (groups.find((g) => g.label === activeGroup)?.apps ?? allApps) : allApps;
    const q = query.trim().toLowerCase();
    if (q) {
      pool = pool.filter((app) =>
        [app.title, app.badge, app.description].join(" ").toLowerCase().includes(q)
      );
    }
    return pool;
  }, [query, activeGroup]);

  return (
    <div className="kami-scope min-h-screen tools-hub toys-hub kami-text">
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
          <h1 className="hub-glass-hero-title">{allApps.length} toys</h1>
          <p className="hub-glass-hero-sub">Interactive · Creative · In-browser</p>
          <div className="hub-glass-hero-search">
            <ToySearch value={query} onChange={setQuery} placeholder="Search toys…" />
          </div>
        </div>
      </div>

      {/* ── Material: top app bar — always in DOM, CSS shows for material theme ── */}
      <div className="hub-material-appbar">
        <div className="hub-material-appbar-inner">
          <div>
            <p className="hub-material-appbar-label">little toys</p>
            <h1 className="hub-material-appbar-title">{allApps.length} toys</h1>
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
        {/* Default heading — CSS hides for glass/material/metro. Left-aligned,
            "{N} little toys", matching the tools hub exactly. */}
        <div className="hub-default-heading mb-5 sm:mb-7">
          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl kami-text">
            {allApps.length} little toys
          </h1>
          <p className="mt-1 text-sm sm:text-base kami-text-muted">
            Creative experiments and interactive toys. Everything runs in your browser.
          </p>
        </div>

        {/* Search (full width) + category chips on their own row — same as tools. */}
        <div className="hub-default-search-wrap tools-hub-search-wrap">
          <div className="hub-default-search">
            <ToySearch value={query} onChange={setQuery} inputRef={searchRef} />
          </div>

          <div className="tools-hub-chips" role="tablist" aria-label="Toy categories">
            <button
              role="tab"
              aria-selected={activeGroup === null}
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
                  role="tab"
                  aria-selected={isActive}
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

        {/* Flat list with section header + count — same as tools "All tools". */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider kami-text-dim">
            {activeGroup ?? "All toys"}
          </h2>
          <p className="text-xs kami-text-dim">
            {filtered.length} toy{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm kami-text-muted kami-surface kami-border-all" style={{ borderStyle: "dashed", borderRadius: "var(--kami-card-radius)" }}>
            No toys match &ldquo;{query}&rdquo;. Try a different word.
          </div>
        ) : (
          <div className="tools-hub-grid">
            {filtered.map((app) => (
              <AppCard
                key={app.href}
                title={app.title}
                badge={app.badge}
                description={app.description}
                href={app.href}
                external={(app as { external?: boolean }).external}
                ctaLabel="Play"
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
