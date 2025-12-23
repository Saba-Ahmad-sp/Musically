import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'c.saavncdn.com',
      },
      {
        protocol: 'https',
        hostname: 'saavn.dev',
      },
      {
        protocol: 'https',
        hostname: '*.saavncdn.com', // Wildcard for all regional CDNs
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For mock fallback
      }
    ],
  },
  // Suppress hydration warning caused by browser extensions if needed, though strictly we should fix the DOM.
  // We'll rely on React's automatic handling for now.
};

export default nextConfig;
