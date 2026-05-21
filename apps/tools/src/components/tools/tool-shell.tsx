"use client";

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ShortcutContext } from "@/contexts/shortcut-context";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import type { FaqEntry } from "@/lib/json-ld";

export interface ToolShellProps {
  title: string;
  tagline?: string;
  /** Dynamic accent hex colour — injected as --tool-accent CSS var, not inline style. */
  accent?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  controls?: React.ReactNode;
  info?: React.ReactNode;
  /** Mobile bottom bar action buttons (e.g. Animate / Cursor). Slot left of About/Controls. */
  mobileAction?: React.ReactNode;
  hideControls?: boolean;
  controlsLabel?: string;
  panelWidth?: string;
  /** FAQ passages rendered below the tool for AEO — SEO-visible, below fold. */
  faqPassages?: FaqEntry[];
}

// ── Inline Theme Switcher (no-op pill) ──────────────────────────────────────

function InlineThemeSwitcher() {
  return (
    <div className="tool-theme-inline" aria-label="Theme (coming soon)">
      <button
        type="button"
        className="theme-switcher-pill"
        aria-label="Theme switcher — coming soon"
        title="Themes coming soon"
        disabled
      >
        <span className="theme-switcher-pill-icon">■</span>
      </button>
    </div>
  );
}

// ── Share button ─────────────────────────────────────────────────────────────

function ToolShareButton() {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const onShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = document.title;
    if ("share" in navigator) {
      try { await navigator.share({ title, url }); return; } catch { /* fall through */ }
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setState("copied");
        window.setTimeout(() => setState("idle"), 1800);
      } catch { /* ignore */ }
    }
  }, []);
  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="Share this tool"
      className="tool-icon-btn"
      title="Share"
    >
      {state === "copied" ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
      )}
    </button>
  );
}

// ── Shortcut key formatting ───────────────────────────────────────────────────

function formatShortcutKey(key: string, meta?: boolean, shift?: boolean, alt?: boolean) {
  const parts: string[] = [];
  if (meta) parts.push("⌘");
  if (alt) parts.push("⌥");
  if (shift) parts.push("⇧");
  const keyMap: Record<string, string> = {
    enter: "↵", return: "↵", escape: "Esc", backspace: "⌫",
    delete: "⌦", tab: "⇥", arrowup: "↑", arrowdown: "↓",
    arrowleft: "←", arrowright: "→", " ": "Space",
  };
  parts.push(keyMap[key.toLowerCase()] ?? key.toUpperCase());
  return parts.join("");
}


// ── ToolShell ────────────────────────────────────────────────────────────────

const SPLASH_SEEN_KEY = 'kami.splash.seen';

type SnapState = 'closed' | 'peek' | 'full';

function getSnapYPx(snap: SnapState, innerHeight: number): number {
  const panelH = innerHeight * 0.85;
  if (snap === 'full') return 0;
  if (snap === 'peek') return Math.round(panelH - innerHeight * 0.40);
  return Math.round(panelH); // closed
}

export function ToolShell({
  title,
  tagline,
  accent,
  actions,
  children,
  controls,
  info,
  mobileAction,
  hideControls,
  controlsLabel = "Controls",
  panelWidth = "320px",
  faqPassages,
}: ToolShellProps) {
  const [snapState, setSnapState] = useState<SnapState>('closed');
  const sheetOpen = snapState !== 'closed';
  const [infoOpen, setInfoOpen] = useState(false);
  const [splashOpen, setSplashOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const shortcutCtx = useContext(ShortcutContext);
  const shellRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);
  const dragStartClientY = useRef(0);
  const dragStartSnapY = useRef(0);

  const onHandlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 1024) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    dragStartClientY.current = e.clientY;
    dragStartSnapY.current = getSnapYPx(snapState, window.innerHeight);
    if (panelRef.current) panelRef.current.style.transition = 'none';
  }, [snapState]);

  const onHandlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !panelRef.current) return;
    const dy = e.clientY - dragStartClientY.current;
    const panelH = window.innerHeight * 0.85;
    const newY = Math.max(0, Math.min(panelH, dragStartSnapY.current + dy));
    panelRef.current.style.transform = `translateY(${newY}px)`;
  }, []);

  const onHandlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dy = e.clientY - dragStartClientY.current;
    const newY = dragStartSnapY.current + dy;
    const h = window.innerHeight;
    let next: SnapState;
    if (newY > h * 0.62) next = 'closed';
    else if (newY > h * 0.25) next = 'peek';
    else next = 'full';
    if (panelRef.current) { panelRef.current.style.transition = ''; panelRef.current.style.transform = ''; }
    setSnapState(next);
  }, []);

  // Restore sidebar collapsed state from localStorage
  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem('kami.sidebar') === 'collapsed');
    } catch { /* noop */ }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(v => {
      const next = !v;
      try { localStorage.setItem('kami.sidebar', next ? 'collapsed' : 'open'); } catch { /* noop */ }
      return next;
    });
  }, []);

  // First-run splash — small delay so tool shortcuts register first
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (!localStorage.getItem(SPLASH_SEEN_KEY)) setSplashOpen(true);
      } catch { /* noop */ }
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const labeledShortcuts = shortcutCtx?.shortcuts.filter((s) => s.label) ?? [];
  const hasControls = !hideControls && controls != null;
  const hasInfo = info != null;
  const breadcrumbs = useBreadcrumb();

  // Body scroll lock
  useEffect(() => {
    if (!sheetOpen && !infoOpen && !splashOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [sheetOpen, infoOpen, splashOpen]);

  // Global keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSplashOpen(false);
        setSnapState('closed');
        setInfoOpen(false);
        return;
      }
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        const t = e.target as Element | null;
        if (t?.matches?.("input, textarea, select, [contenteditable='true']")) return;
        e.preventDefault();
        setSplashOpen(v => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dismissSplash = useCallback(() => {
    setSplashOpen(false);
    try { localStorage.setItem(SPLASH_SEEN_KEY, '1'); } catch { /* noop */ }
  }, []);

  const breadcrumbSep = '·';

  return (
    <div
      ref={shellRef}
      className="tool-shell"
      style={{
        "--tool-shell-panel-w": panelWidth,
        "--tool-accent": accent ?? "transparent",
      } as React.CSSProperties}
    >

      {/* ── Header ── */}
      <header className="tool-shell-header">
        <div className="tool-shell-left">
          <InlineThemeSwitcher />
          <nav className="tool-shell-breadcrumb" aria-label="Breadcrumb">
            {breadcrumbs.length > 0 ? (
              breadcrumbs.map((item, i) => (
                <span key={i}>
                  {i > 0 && <span className="tool-shell-breadcrumb-sep" aria-hidden="true">{breadcrumbSep}</span>}
                  {item.href
                    ? <a href={item.href}>{item.label}</a>
                    : <span aria-current="page">{item.label}</span>
                  }
                </span>
              ))
            ) : (
              <>
                <a href="https://apps.iamkesava.com">home</a>
                <span className="tool-shell-breadcrumb-sep" aria-hidden="true">{breadcrumbSep}</span>
                <a href="https://tools.iamkesava.com">tools</a>
              </>
            )}
          </nav>
        </div>

        <div className="tool-shell-center">
          <div className="tool-shell-title-row">
            {accent && <span aria-hidden="true" className="tool-shell-accent-dot" />}
            <h1 className="tool-shell-title">{title}</h1>
          </div>
          {tagline && <p className="tool-shell-tagline">{tagline}</p>}
        </div>

        <div className="tool-shell-actions">
          {actions}
          {hasControls && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="tool-icon-btn tool-sidebar-toggle-btn"
              aria-label={sidebarCollapsed ? "Show controls panel" : "Collapse controls panel"}
              title={sidebarCollapsed ? "Show controls" : "Collapse controls"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d={sidebarCollapsed ? "M15 3v18" : "M9 3v18"}/>
              </svg>
            </button>
          )}
          <ToolShareButton />
          <button
            type="button"
            onClick={() => setSplashOpen(v => !v)}
            aria-label="Keyboard shortcuts"
            className="tool-icon-btn tool-help-btn"
            title="Help (?)"
          >
            ?
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={`tool-shell-body${hasControls ? " has-controls" : " no-controls"}${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
        <main className="tool-shell-canvas">{children}</main>

        {hasControls && (
          <aside
            ref={panelRef}
            data-snap={snapState}
            className="tool-shell-panel"
            aria-label="Controls"
          >
            <div
              className="tool-shell-panel-handle"
              aria-hidden="true"
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerUp}
            />
            <div className="tool-shell-panel-header">
              <span className="tool-shell-panel-label">{controlsLabel}</span>
              <button
                type="button"
                onClick={() => setSnapState('closed')}
                className="tool-shell-icon-btn"
                aria-label="Close controls"
              >
                <X size={16} />
              </button>
            </div>
            <div className="tool-shell-panel-inner">{controls}</div>
          </aside>
        )}
      </div>

      {/* ── FAQ passages (AEO / SEO, below fold) ── */}
      {faqPassages && faqPassages.length > 0 && (
        <section className="tool-faq" aria-label="Frequently asked questions">
          <h2 className="tool-faq-heading">About this tool</h2>
          <dl className="tool-faq-list">
            {faqPassages.map(({ q, a }, i) => (
              <div key={i} className="tool-faq-item">
                <dt className="tool-faq-question">{q}</dt>
                <dd className="tool-faq-answer">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ── Mobile FAB (controls sheet trigger, ≤768px) ── */}
      {hasControls && (
        <button
          type="button"
          className={`tool-sheet-fab${sheetOpen ? ' is-active' : ''}`}
          onClick={() => setSnapState(s => s === 'closed' ? 'peek' : 'closed')}
          aria-label={sheetOpen ? `Close ${controlsLabel}` : `Open ${controlsLabel}`}
          title={controlsLabel}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </button>
      )}

      {/* ── Mobile bottom action bar ── */}
      <div className="tool-mode-bottom">
        {mobileAction}
        {hasInfo && (
          <button
            type="button"
            className={`tool-mode-btn${infoOpen ? ' is-active' : ''}`}
            onClick={() => setInfoOpen(v => !v)}
          >
            About
          </button>
        )}
        {hasControls && (
          <button
            type="button"
            className={`tool-mode-btn is-primary${sheetOpen ? ' is-active' : ''}`}
            onClick={() => setSnapState(s => s === 'closed' ? 'peek' : 'closed')}
            aria-expanded={sheetOpen}
          >
            {controlsLabel}
          </button>
        )}
      </div>

      {/* ── Sheet / info backdrop ── */}
      {(sheetOpen || infoOpen) && (
        <button
          type="button"
          aria-label="Close panel"
          className="tool-shell-backdrop"
          onClick={() => {
            setSnapState('closed');
            setInfoOpen(false);
          }}
        />
      )}

      {/* ── Info drawer ── */}
      {hasInfo && (
        <div className={`tool-shell-info${infoOpen ? " is-open" : ""}`}>
          <div className="tool-shell-panel-handle" aria-hidden="true" />
          <div className="tool-shell-panel-header">
            <span className="tool-shell-panel-label">About</span>
            <button type="button" onClick={() => setInfoOpen(false)} className="tool-shell-icon-btn" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="tool-shell-panel-inner">{info}</div>
        </div>
      )}

      {/* ── Splash / help overlay ── */}
      {splashOpen && (
        <div className="tool-splash" role="dialog" aria-label="Keyboard shortcuts" onClick={dismissSplash}>
          <div className="tool-splash-inner">
            <div className="tool-splash-title">{title}</div>
            {tagline && <div className="tool-splash-tag">{tagline}</div>}
            <div className="tool-splash-grid">
              <span><kbd>T</kbd></span><span>cycle theme</span>
              {labeledShortcuts.map((s, i) => (
                <React.Fragment key={i}>
                  <span><kbd>{formatShortcutKey(s.key, s.meta, s.shift, s.alt)}</kbd></span>
                  <span>{s.label}</span>
                </React.Fragment>
              ))}
              <span><kbd>?</kbd></span><span>show this again</span>
              <span><kbd>Esc</kbd></span><span>close</span>
            </div>
            <div className="tool-splash-tap">click anywhere to begin</div>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

export function ControlGroup({ label, hint, children, inline }: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <section className={`control-group${inline ? " is-inline" : ""}`}>
      {label && (
        <div className="control-group-head">
          <label className="control-group-label">{label}</label>
          {hint && <span className="control-group-hint">{hint}</span>}
        </div>
      )}
      <div className="control-group-body">{children}</div>
    </section>
  );
}

export function CanvasToolbar({ children }: { children: React.ReactNode }) {
  return <div className="canvas-toolbar">{children}</div>;
}

export function ToolIconButton({ label, onClick, children, active, disabled, variant = "ghost" }: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  variant?: "ghost" | "solid" | "outline";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      data-variant={variant}
      data-active={active ? "true" : undefined}
      className="tool-icon-btn"
    >
      {children}
    </button>
  );
}

export function ToolActionButton({ onClick, children, variant = "ghost", disabled, type = "button" }: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "ghost" | "solid" | "outline" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} data-variant={variant} className="tool-action-btn">
      {children}
    </button>
  );
}
