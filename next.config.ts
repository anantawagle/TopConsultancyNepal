import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run as a normal Next.js server so Sanity content can be revalidated
  // without rebuilding the entire site.
  images: {
    unoptimized: true, // Keep compatibility with the existing hosting setup
  },
};

export default nextConfig;
