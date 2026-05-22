import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface KamiBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function KamiBreadcrumb({ items }: KamiBreadcrumbProps) {
  return (
    <nav className="kami-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
          {i > 0 ? <span className="kami-breadcrumb-sep">·</span> : null}
          {item.href ? (
            // Absolute/cross-origin hrefs must be plain anchors — a Next <Link>
            // RSC-prefetches them and fails CORS, logging console errors on
            // otherwise-fine pages.
            /^https?:\/\//.test(item.href) ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default KamiBreadcrumb;
