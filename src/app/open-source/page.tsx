import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OpenSourceDirectoryClient from '@/components/features/tools/OpenSourceDirectoryClient';
import { fetchDirectoryStats, fetchToolsByTrack } from '@/lib/api/toolsStats';
import { openSourceTabFromKind } from '@/lib/constants/tracks';
import { generateSEO } from '@/lib/utils/seo';
import { formatToolCount } from '@/lib/constants/stats';

export const revalidate = 600;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const kindRaw = Array.isArray(params.kind) ? params.kind[0] : params.kind;
  const tab = openSourceTabFromKind(kindRaw);
  const stats = await fetchDirectoryStats();
  const count = stats?.by_track.find((row) => row.track === tab.track)?.count;
  const counted = formatToolCount(count);
  const title = counted
    ? `${counted} ${tab.label} you can run locally`
    : `${tab.label} you can run locally`;
  return generateSEO({
    title,
    description:
      'GitHub repos, SKILL.md packs, and MCP servers you can clone, self-host, or call as an API. Free for teams who cannot buy a hosted seat.',
    path: tab.kind === 'repos' ? '/open-source' : `/open-source?kind=${tab.kind}`,
    keywords: [
      'open source AI',
      'GitHub AI repos',
      'SKILL.md',
      'MCP servers',
      'self-host AI',
      'free AI tools',
    ],
  });
}

export default async function OpenSourcePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const kindRaw = Array.isArray(params.kind) ? params.kind[0] : params.kind;
  const pageRaw = Array.isArray(params.page) ? params.page[0] : params.page;
  const tab = openSourceTabFromKind(kindRaw);
  const page = Math.max(1, Number.parseInt(pageRaw || '1', 10) || 1);

  const [stats, listing] = await Promise.all([
    fetchDirectoryStats(),
    fetchToolsByTrack(tab.track, 24, page),
  ]);

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <main className="py-8 md:py-12 px-4 md:px-6">
        <Suspense fallback={<div className="text-center text-white py-20">Loading open source…</div>}>
          <OpenSourceDirectoryClient
            initialKind={tab.kind}
            initialPage={page}
            initialTools={listing.tools}
            initialCount={listing.count}
            trackCounts={stats?.by_track ?? []}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
