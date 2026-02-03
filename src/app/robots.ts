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
    ],
    sitemap: 'https://one9founders.com/sitemap.xml',
  };
}
