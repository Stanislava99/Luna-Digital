import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the "N" developer badge (local dev only) so it doesn't cover the page while reviewing
  devIndicators: false,
  // Each language has its own root layout, so the 404 page brings its own <html>
  experimental: { globalNotFound: true },
  // Old static URLs keep working after the move to Next.js
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      { source: "/builder.html", destination: "/builder", permanent: true },
    ];
  },
  // Client demo pages live as static files in public/demo/<name>/index.html
  async rewrites() {
    return [{ source: "/demo/:slug", destination: "/demo/:slug/index.html" }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "seaandskivillas.com" },
    ],
  },
};

export default nextConfig;
