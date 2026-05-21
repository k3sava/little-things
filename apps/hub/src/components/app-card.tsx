import Link from "next/link";

export interface AppCardProps {
  title: string;
  description: string;
  href: string;
  badge?: React.ReactNode;
  subtitle?: string;
  external?: boolean;
  ctaLabel?: string;
  minHeight?: number;
}

export function AppCard({
  title,
  description,
  href,
  badge,
  subtitle,
  external,
  ctaLabel = "Open",
  minHeight = 160,
}: AppCardProps) {
  const inner = (
    <div className="kami-card" style={{ minHeight, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div className="kami-header-name" style={{ fontSize: "0.95rem" }}>{title}</div>
        {badge ? <span style={{ fontSize: "0.62rem", opacity: 0.6 }}>{badge}</span> : null}
      </div>
      {subtitle ? <div style={{ fontSize: "0.72rem", opacity: 0.55 }}>{subtitle}</div> : null}
      <div style={{ fontSize: "0.82rem", color: "var(--kami-text-muted)", lineHeight: 1.5, flex: 1 }}>
        {description}
      </div>
      <div style={{ marginTop: 8 }}>
        <span className="kami-btn" style={{ fontSize: "0.72rem", padding: "6px 14px" }}>{ctaLabel} →</span>
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      {inner}
    </Link>
  );
}

export default AppCard;
