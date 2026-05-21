/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // /for/<collection> on apps redirects to the canonical /for/<collection>
      // on tools so authority + citations for collection pages consolidate on
      // one domain. tools.iamkesava.com is now the only place collection
      // landing pages exist.
      {
        source: "/for",
        destination: "https://tools.iamkesava.com/",
        permanent: true,
      },
      {
        source: "/for/:slug",
        destination: "https://tools.iamkesava.com/for/:slug/",
        permanent: true,
      },
      // Tools extracted to tools.iamkesava.com (k3sava/little-tools, GitHub Pages).
      // Legacy /tools/title-case → /case-converter normalizes the rename too.
      {
        source: "/tools/title-case",
        destination: "https://tools.iamkesava.com/case-converter/",
        permanent: true,
      },
      {
        source: "/tools/text",
        destination: "https://tools.iamkesava.com/textkit/",
        permanent: true,
      },
      {
        source: "/tools/design",
        destination: "https://tools.iamkesava.com/designkit/",
        permanent: true,
      },
      {
        source: "/tools/dev",
        destination: "https://tools.iamkesava.com/devkit/",
        permanent: true,
      },
      {
        source: "/tools",
        destination: "https://tools.iamkesava.com/",
        permanent: true,
      },
      {
        source: "/tools/:path*",
        destination: "https://tools.iamkesava.com/:path*/",
        permanent: true,
      },
      {
        source: "/demokit",
        destination: "/playground/demokit",
        permanent: true,
      },
      {
        source: "/demokit/:path*",
        destination: "/playground/demokit/:path*",
        permanent: true,
      },
      {
        source: "/fun",
        destination: "https://toys.iamkesava.com/",
        permanent: true,
      },
      {
        source: "/fun/kaleidoscopic",
        destination: "https://k3sava.github.io/kaleidoscopic/",
        permanent: true,
      },
      ...[
        "sonicc",
        "plink",
        "synth-pad",
        "kaleidoscopic",
        "aurora",
        "string-art",
        "gravity-type",
        "particle-life",
        "aurea",
      ].map((name) => ({
        source: `/playground/${name}`,
        destination: `https://k3sava.github.io/${name}/`,
        permanent: true,
      })),
      // Playground hub now lives at toys.iamkesava.com (k3sava/little-toys).
      // /playground/stem-studio and /playground/zen-garden stay internal.
      {
        source: "/playground",
        destination: "https://toys.iamkesava.com/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
