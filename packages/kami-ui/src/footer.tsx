"use client";

// Cross-domain footer shared by every little-things app. Each site links to
// the others so authority triangulates and a stranger landing on one finds
// the rest. Single source of truth — apps pass only what legitimately differs.

export type SisterSite = "apps" | "tools" | "toys" | "codex";

interface FooterProps {
  /** Which sister site is rendering this footer (bolded, not linked). */
  current: SisterSite;
  /** The site's machine-readable index, e.g. { label: "tools.json", href: "/tools.json" }. */
  dataFile: { label: string; href: string };
  /** RSS feed path, e.g. "/feed.xml". Omit when the site has no feed. */
  feedHref?: string;
  /** Repository link. Defaults to the monorepo. */
  githubHref?: string;
}

const SISTERS: { key: SisterSite; label: string; href: string }[] = [
  { key: "apps", label: "apps", href: "https://apps.iamkesava.com/" },
  { key: "tools", label: "tools", href: "https://tools.iamkesava.com/" },
  { key: "toys", label: "toys", href: "https://toys.iamkesava.com/" },
  { key: "codex", label: "codex", href: "https://codex.iamkesava.com/" },
];

export function Footer({
  current,
  dataFile,
  feedHref,
  githubHref = "https://github.com/k3sava/little-things",
}: FooterProps) {
  return (
    <footer className="kami-footer">
      <div className="kami-footer-aeo">
        <a href="/llms.txt">llms.txt</a>
        <span className="kami-footer-sep" aria-hidden="true">·</span>
        <a href="/sitemap.xml">sitemap</a>
        {feedHref && (
          <>
            <span className="kami-footer-sep" aria-hidden="true">·</span>
            <a href={feedHref}>rss</a>
          </>
        )}
        <span className="kami-footer-sep" aria-hidden="true">·</span>
        <a href={dataFile.href}>{dataFile.label}</a>
      </div>
      <nav className="kami-footer-nav" aria-label="Sister sites">
        {SISTERS.map((s, i) => (
          <span key={s.key}>
            {s.key === current ? (
              <span aria-current="page" className="kami-footer-current">{s.label}</span>
            ) : (
              <a href={s.href}>{s.label}</a>
            )}
            {i < SISTERS.length - 1 && (
              <span className="kami-footer-sep" aria-hidden="true">·</span>
            )}
          </span>
        ))}
      </nav>
      <div className="kami-footer-credit">
        made by <a href="https://iamkesava.com" rel="author">kesava</a>
        <span className="kami-footer-sep" aria-hidden="true">·</span>
        <a href={githubHref} rel="noopener">github</a>
      </div>
    </footer>
  );
}

export default Footer;
