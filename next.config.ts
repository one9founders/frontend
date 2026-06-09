import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/ai-tool-directory-for-startup-founders',
        destination: '/',
        permanent: true,
      },
      {
        source: '/compare-ai-tools-side-by-side',
        destination: '/compare',
        permanent: true,
      },
      {
        source: '/indias-largest-ai-ecosystem-navigator',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about-one9founders',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/ai-news-insights-for-startup-founders',
        destination: '/news',
        permanent: true,
      },
      {
        source: '/one9founders-ai-tool-directory-for-startups',
        destination: '/',
        permanent: true,
      },
      {
        source: '/what-is-one9founders',
        destination: '/about',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
