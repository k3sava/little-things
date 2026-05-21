// All three themed hero variants always in DOM — CSS controls visibility via data-theme.
// No client state needed: eliminates SSR flash and JSX theme branching.

export function HomeHero() {
  return (
    <>
      {/* Glass hero — shown only when data-theme="glass" */}
      <div className="home-glass-hero">
        <div className="home-glass-hero-inner">
          <p className="home-glass-hero-eyebrow">apps · tools · toys</p>
          <h1 className="home-glass-hero-title">the little things</h1>
          <p className="home-glass-hero-sub">
            Free browser-based utilities, creative toys, and open-source experiments.
            Nothing installs. Nothing uploads.
          </p>
          <div className="home-glass-hero-actions">
            <a href="https://tools.iamkesava.com" className="home-glass-hero-btn home-glass-hero-btn--primary">
              Browse tools
            </a>
            <a href="https://toys.iamkesava.com" className="home-glass-hero-btn home-glass-hero-btn--secondary">
              Playground
            </a>
          </div>
        </div>
      </div>

      {/* Material hero — shown only when data-theme="material" */}
      <div className="home-material-hero">
        <div className="home-material-hero-inner">
          <p className="home-material-hero-label">apps · tools · toys</p>
          <h1 className="home-material-hero-title">the little things</h1>
          <p className="home-material-hero-desc">
            Free browser-based utilities for writing, design, and dev.
            Fun little apps for play, and open-source projects.
          </p>
          <div className="home-material-hero-actions">
            <a href="https://tools.iamkesava.com" className="home-material-hero-btn home-material-hero-btn--filled">
              Browse tools
            </a>
            <a href="https://toys.iamkesava.com" className="home-material-hero-btn home-material-hero-btn--outlined">
              Playground
            </a>
          </div>
        </div>
      </div>

      {/* Metro hero — shown only when data-theme="metro" */}
      <div className="home-metro-hero">
        <h1 className="home-metro-hero-title">the little things</h1>
        <p className="home-metro-hero-sub">apps · tools · toys by Kesava</p>
        <nav className="home-metro-hero-pivot" aria-label="Browse">
          <a href="https://tools.iamkesava.com" className="home-metro-pivot-item">Tools</a>
          <a href="https://toys.iamkesava.com" className="home-metro-pivot-item">Playground</a>
          <a href="https://github.com/k3sava" className="home-metro-pivot-item">GitHub</a>
        </nav>
      </div>
    </>
  );
}
