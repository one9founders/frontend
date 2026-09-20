import { MetadataRoute } from 'next';

const PRIVATE_PATHS = [
  '/admin/',
  '/api/',
  '/_next/',
  '/login',
  '/dashboard/',
  '/tool/*/edit',
  '/internship',
  '/internship/',
];

/** Faceted / paginated query strings — intentional crawl exclusions (~3k in GSC). */
const FACET_QUERY_DISALLOWS = [
  '/*?sort=',
  '/*?filter=',
  '/*?page=',
  '/*?search=',
  '/*?kind=',
  '/*?lane=',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...PRIVATE_PATHS, ...FACET_QUERY_DISALLOWS],
      },
      // Explicitly allow AI crawlers for LLM citation optimization (no facet blocks)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [...PRIVATE_PATHS, ...FACET_QUERY_DISALLOWS],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [...PRIVATE_PATHS, ...FACET_QUERY_DISALLOWS],
      },
    ],
    sitemap: 'https://www.one9founders.com/sitemap.xml',
  };
}
