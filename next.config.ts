import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable strict mode to prevent double-invoking refs with React Grid Layout
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev", // Allow default Cloudflare R2 domains
      },
      {
        protocol: "https",
        hostname: "pub-*.r2.dev", // Specific public R2 buckets
      },
    ],
  },
};

export default nextConfig;
