import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Sanity will handle image optimization
  },
};

export default nextConfig;
