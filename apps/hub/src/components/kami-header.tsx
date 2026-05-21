"use client";

import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

interface KamiHeaderProps {
  name: string;
  desc?: string;
  crumb?: Crumb[];
  /** right-slot content, e.g. ShareButton */
  right?: React.ReactNode;
  /** left-slot content, e.g. theme pill trigger; if omitted, nothing extra */
  left?: React.ReactNode;
}

export function KamiHeader({ name, desc, crumb, right, left }: KamiHeaderProps) {
  return (
    <header className="kami-header">
      <div className="kami-header-left">{left}</div>
      <div className="kami-header-center">
        <div className="kami-header-name">{name}</div>
        {desc ? <div className="kami-header-desc">{desc}</div> : null}
        {crumb && crumb.length > 0 ? (
          <nav className="kami-header-crumb" aria-label="Breadcrumb">
            {crumb.map((c, i) => (
              <span key={`${c.label}-${i}`} style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                {i > 0 ? <span className="kami-header-crumb-sep">·</span> : null}
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </span>
            ))}
          </nav>
        ) : null}
      </div>
      <div className="kami-header-right">{right}</div>
    </header>
  );
}

export default KamiHeader;
