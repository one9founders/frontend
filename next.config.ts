import type { NextConfig } from "next";

// Cloudflare Pages local bindings via Wrangler. Opt-in only — calling
// setupDevPlatform() unconditionally hung `next dev` with no listen on :3000.
if (
  process.env.NODE_ENV === "development" &&
  process.env.ENABLE_CLOUDFLARE_DEV === "1"
) {
  // No top-level await: Next's next.config.ts loader require()s the compiled
  // output synchronously and errors on a top-level-await ESM graph.
  void (async () => {
    const { setupDevPlatform } = await import(
      "@cloudflare/next-on-pages/next-dev"
    );
    await setupDevPlatform();
  })();
}

const nextConfig: NextConfig = {
  /* config options here */
  // Pin explicitly: this repo sits alongside sibling projects that each have
  // their own lockfile, which makes Next.js's workspace-root inference
  // ambiguous and can hang `next dev`/`next build` tracing from the wrong root.
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: '/openworker',
        destination: '/worker',
        permanent: true,
      },
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
