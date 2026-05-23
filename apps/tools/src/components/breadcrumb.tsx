"use client";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  fixed?: boolean;
}

export function Breadcrumb({ items, fixed = true }: BreadcrumbProps) {
  return (
    <nav
      className={`kami-breadcrumb${fixed ? " kami-breadcrumb-fixed" : ""}`}
    >
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1 select-none">·</span>}
          {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
