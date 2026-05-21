import Link from "next/link";

interface KamiFooterProps {
  /** which sister site is current: "apps" | "tools" | "toys" | "codex" */
  current?: "apps" | "tools" | "toys" | "codex";
}

const SISTERS: { key: string; label: string; href: string }[] = [
  { key: "apps", label: "apps", href: "https://apps.iamkesava.com" },
  { key: "tools", label: "tools", href: "https://tools.iamkesava.com" },
  { key: "toys", label: "toys", href: "https://toys.iamkesava.com" },
  { key: "codex", label: "codex", href: "https://codex.iamkesava.com" },
];

export function KamiFooter({ current = "apps" }: KamiFooterProps) {
  return (
    <footer className="kami-footer">
      <div className="kami-footer-aeo">
        <a href="/llms.txt">llms.txt</a>
        <span className="kami-footer-sep">·</span>
        <a href="/sitemap.xml">sitemap</a>
        <span className="kami-footer-sep">·</span>
        <a href="/apps.json">apps.json</a>
      </div>
      <nav className="kami-footer-nav" aria-label="Sister sites">
        {SISTERS.map((s, i) => (
          <span key={s.key} style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
            {i > 0 ? <span className="kami-footer-sep">·</span> : null}
            {s.key === current ? (
              <span className="kami-footer-current">{s.label}</span>
            ) : (
              <a href={s.href}>{s.label}</a>
            )}
          </span>
        ))}
      </nav>
      <div className="kami-footer-credit">
        made by <a href="https://iamkesava.com">kesava</a> ·{" "}
        <a href="https://github.com/k3sava">github</a>
      </div>
    </footer>
  );
}

export default KamiFooter;
