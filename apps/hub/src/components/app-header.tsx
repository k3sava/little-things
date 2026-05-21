"use client";

import { useCallback, useState } from "react";

interface AppHeaderProps {
  title?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
}

export function AppHeader({
  title = "the little things",
  breadcrumb = [{ label: "home" }],
}: AppHeaderProps) {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async () => {
    const url = window.location.href;
    if ("share" in navigator) {
      try { await navigator.share({ title: document.title, url }); return; } catch { /* fall through */ }
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch { /* ignore */ }
    }
  }, []);

  return (
    <header className="kami-app-header">
      <div className="kami-app-header-left">
        {/* Theme pill — no-op until skin engine */}
        <button
          type="button"
          className="app-theme-pill"
          aria-label="Theme switcher — coming soon"
          title="Themes coming soon"
          disabled
        >
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#d946ef', marginRight: 4 }} />
          <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BRUTALIST</span>
        </button>

        {/* Breadcrumb */}
        <nav className="kami-app-breadcrumb" aria-label="Breadcrumb">
          {breadcrumb.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className="kami-app-breadcrumb-sep" aria-hidden="true">·</span>}
              {item.href
                ? <a href={item.href}>{item.label}</a>
                : <span aria-current="page">{item.label}</span>
              }
            </span>
          ))}
        </nav>
      </div>

      <div className="kami-app-header-center">
        <h1 className="kami-app-header-title">{title}</h1>
      </div>

      <div className="kami-app-header-right">
        <button
          type="button"
          className="tool-icon-btn"
          onClick={share}
          aria-label="Share"
          title="Share"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          )}
        </button>
      </div>
    </header>
  );
}
