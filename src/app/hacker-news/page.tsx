import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HackerNewsDirectoryClient from '@/components/features/tools/HackerNewsDirectoryClient';
import { fetchDirectoryStats, fetchToolsBySource } from '@/lib/api/toolsStats';
import { generateSEO } from '@/lib/utils/seo';
import { formatToolCount } from '@/lib/constants/stats';

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
    path: page > 1 ? `/hacker-news?page=${page}` : '/hacker-news',
    keywords: [
      'Hacker News AI tools',
      'Show HN',
      'AI startups',
      'HN tools directory',
      'One9Founders',
    ],
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

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
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
