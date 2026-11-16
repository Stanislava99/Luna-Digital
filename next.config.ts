import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the "N" developer badge (local dev only) so it doesn't cover the page while reviewing
  devIndicators: false,
  // Old static URLs keep working after the move to Next.js
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/builder.html", destination: "/builder", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "seaandskivillas.com" },
    ],
  },
};

export default nextConfig;
