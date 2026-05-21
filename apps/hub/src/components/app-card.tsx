import Link from "next/link";
import type { CSSProperties } from "react";

interface AppCardProps {
  title: string;
  description: string;
  href: string;
  /** Optional short label pill rendered in the top-right corner. */
  badge?: React.ReactNode;
  /** Optional small dim line rendered under the title. */
  subtitle?: string;
  /** Treat href as an external URL. Opens in a new tab. */
  external?: boolean;
  /** CTA text shown on hover. Defaults to "Open". */
  ctaLabel?: string;
  /** Minimum card height in px. Defaults to 172. */
  minHeight?: number;
}

export function AppCard({
  title,
  description,
  href,
  badge,
  subtitle,
  external = false,
  ctaLabel = "Open",
  minHeight = 172,
}: AppCardProps) {
  const body = (
    <>
      {/* Base face */}
      <div className="transition-opacity duration-250 group-hover:opacity-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold kami-text">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-0.5 text-xs kami-text-dim">
                {subtitle}
              </p>
            )}
            <p className="mt-1 text-sm leading-6 kami-text-muted">
              {description}
            </p>
          </div>
          {badge && (
            <span className="shrink-0 px-2 py-1 text-xs font-medium kami-badge">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Hover face */}
      <div className="kami-tile-overlay pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center opacity-0 transition-opacity duration-250 group-hover:opacity-100">
        <div>
          <p className="text-base font-semibold kami-text-overlay">
            {title}
          </p>
          <p className="mt-1 text-sm kami-text-overlay-dim">
            {description}
          </p>
        </div>
        <span className="kami-overlay-btn-primary inline-flex items-center px-3 py-2 text-xs font-semibold">
          {ctaLabel} →
        </span>
      </div>
    </>
  );

  const className =
    "group kami-tile relative block overflow-hidden px-6 py-4 transition-all duration-250";
  const style: CSSProperties = { minHeight: `${minHeight}px` };

  const isExternal = external || /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
        style={style}
      >
        {body}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {body}
    </Link>
  );
}
