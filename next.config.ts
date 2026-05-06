import type { NextConfig } from "next";

function patternFromUrl(rawUrl?: string) {
  if (!rawUrl) return null;
  try {
    const u = new URL(rawUrl);
    return {
      protocol: u.protocol.replace(':', '') as 'http' | 'https',
      hostname: u.hostname,
      port: u.port || undefined,
      pathname: '/**',
    };
  } catch {
    return null;
  }
}

const backendPattern = patternFromUrl(process.env.NEXT_PUBLIC_API_URL);

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'amicale-api.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
      ...(backendPattern ? [backendPattern] : []),
    ],
  },
};

export default nextConfig;
