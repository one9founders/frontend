import { getSitemapIndexLocs } from '@/lib/api/sitemap';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export async function GET() {
  const locs = await getSitemapIndexLocs();
  const lastmod = new Date().toISOString();
  const body = locs
    .map((loc) => `<sitemap><loc>${loc}</loc><lastmod>${lastmod}</lastmod></sitemap>`)
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
