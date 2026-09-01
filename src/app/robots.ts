import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/login',
          '/dashboard/',
          '/*?sort=',
          '/*?filter=',
          '/*?page=',
          '/*?search=',
        ],
      },
      // Explicitly allow AI crawlers for LLM citation optimization
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/login', '/dashboard/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/login', '/dashboard/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/login', '/dashboard/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/login', '/dashboard/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/login', '/dashboard/', '/*?sort=', '/*?filter=', '/*?page=', '/*?search='],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/login', '/dashboard/', '/*?sort=', '/*?filter=', '/*?page=', '/*?search='],
      },
    ],
    sitemap: 'https://www.one9founders.com/sitemap.xml',
  };
}
