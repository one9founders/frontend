import { getBlogPosts } from '@/lib/blog';

const SITE_URL = 'https://www.one9founders.com';
const FEED_LIMIT = 50;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rfc822(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toUTCString();
}

function buildRssXml(): string {
  const posts = getBlogPosts().slice(0, FEED_LIMIT);
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        `      <pubDate>${rfc822(post.publishedAt)}</pubDate>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml('One9Founders Blog')}</title>`,
    `    <link>${escapeXml(`${SITE_URL}/blog`)}</link>`,
    `    <description>${escapeXml('Expert insights, guides, and analysis on AI tools for startup founders.')}</description>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

export async function GET() {
  return new Response(buildRssXml(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
