/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["kami-ui"],
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
