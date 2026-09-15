import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HackerNewsDirectoryClient from '@/components/features/tools/HackerNewsDirectoryClient';
import { fetchDirectoryStats, fetchToolsBySource } from '@/lib/api/toolsStats';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { formatToolCount } from '@/lib/constants/stats';
import { siteUrl } from '@/lib/constants/site';

export const revalidate = 600;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const pageRaw = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = Math.max(1, Number.parseInt(pageRaw || '1', 10) || 1);
  const stats = await fetchDirectoryStats();
  const count =
    stats?.by_source?.find((row) => row.source === 'hackernews')?.count ?? null;
  const counted = formatToolCount(count);
  const title = counted
    ? `${counted} AI tools from Hacker News`
    : 'AI tools from Hacker News';
  return generateSEO({
    title: page > 1 ? `${title} · page ${page}` : title,
    description:
      'Browse AI tools catalogued from Hacker News Show HN and AI threads. Each listing credits the original discussion.',
    // Canonical stays on the hub URL; paginated query URLs are noindex (and
    // already disallowed in robots.txt via /*?page=).
    path: '/hacker-news',
    keywords: [
      'Hacker News AI tools',
      'Show HN',
      'AI startups',
      'HN tools directory',
      'One9Founders',
    ],
    robots:
      page > 1
        ? { index: false, follow: true }
        : { index: true, follow: true },
  });
}

export default async function HackerNewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pageRaw = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = Math.max(1, Number.parseInt(pageRaw || '1', 10) || 1);

  const [stats, listing] = await Promise.all([
    fetchDirectoryStats(),
    fetchToolsBySource('hackernews', 24, page),
  ]);

  const count =
    listing.count ||
    stats?.by_source?.find((row) => row.source === 'hackernews')?.count ||
    0;

  const structuredData = generateStructuredData({
    '@type': 'CollectionPage',
    name: 'AI tools from Hacker News',
    description:
      'AI tools catalogued from Hacker News Show HN and AI threads, with attribution back to the original discussion.',
    url: siteUrl('/hacker-news'),
    isPartOf: {
      '@type': 'WebSite',
      name: 'One9Founders',
      url: siteUrl('/'),
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: count,
      itemListElement: (listing.tools || []).slice(0, 24).map((tool, index) => ({
        '@type': 'ListItem',
        position: (page - 1) * 24 + index + 1,
        url: siteUrl(`/tool/${tool.slug}`),
        name: tool.name,
      })),
    },
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="py-8 md:py-12 px-4 md:px-6">
        <Suspense
          fallback={<div className="text-center text-white py-20">Loading Hacker News…</div>}
        >
          <HackerNewsDirectoryClient
            initialPage={page}
            initialTools={listing.tools}
            initialCount={count}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
