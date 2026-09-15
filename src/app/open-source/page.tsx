import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OpenSourceDirectoryClient from '@/components/features/tools/OpenSourceDirectoryClient';
import {
  fetchDirectoryStats,
  fetchAllToolsByTrack,
  fetchLaneCountsForTrack,
  fetchToolsByTrack,
} from '@/lib/api/toolsStats';
import { openSourceTabFromKind } from '@/lib/constants/tracks';
import { generateSEO } from '@/lib/utils/seo';
import { formatToolCount } from '@/lib/constants/stats';
import {
  inferOpenSourceLane,
  isOpenSourceLaneId,
} from '@/lib/openSourceLanes';

export const revalidate = 600;

const PAGE_SIZE = 24;

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
    ? `${counted} ${tab.label} founders can run`
    : `${tab.label} founders can run`;
  return generateSEO({
    title,
    description:
      'Browse open-source AI by job lane — local models, agents, RAG, MCP, and skills. Clone and self-host without buying a hosted seat.',
    path: tab.kind === 'repos' ? '/open-source' : `/open-source?kind=${tab.kind}`,
    keywords: [
      'open source AI',
      'GitHub AI repos',
      'local LLMs',
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
  const laneRaw = Array.isArray(params.lane) ? params.lane[0] : params.lane;
  const tab = openSourceTabFromKind(kindRaw);
  const lane = isOpenSourceLaneId(laneRaw) ? laneRaw : '';
  const page = Math.max(1, Number.parseInt(pageRaw || '1', 10) || 1);

  const [stats, catalogLaneCounts] = await Promise.all([
    fetchDirectoryStats(),
    fetchLaneCountsForTrack(tab.track),
  ]);

  if (lane) {
    const catalogTools = await fetchAllToolsByTrack(tab.track);
    const filtered = catalogTools.filter(
      (tool) => inferOpenSourceLane(tool).id === lane,
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageTools = filtered.slice(
      (safePage - 1) * PAGE_SIZE,
      safePage * PAGE_SIZE,
    );

    return (
      <div className="min-h-screen bg-[var(--gray-black)]">
        <Navbar />
        <main className="py-8 md:py-12 px-4 md:px-6">
          <Suspense
            fallback={<div className="text-center text-white py-20">Loading open source…</div>}
          >
            <OpenSourceDirectoryClient
              initialKind={tab.kind}
              initialPage={safePage}
              initialTools={pageTools}
              initialCount={filtered.length}
              initialLane={lane}
              trackCounts={stats?.by_track ?? []}
              catalogLaneCounts={catalogLaneCounts}
            />
          </Suspense>
        </main>
        <Footer />
      </div>
    );
  }

  const listing = await fetchToolsByTrack(tab.track, PAGE_SIZE, page);

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <main className="py-8 md:py-12 px-4 md:px-6">
        <Suspense
          fallback={<div className="text-center text-white py-20">Loading open source…</div>}
        >
          <OpenSourceDirectoryClient
            initialKind={tab.kind}
            initialPage={page}
            initialTools={listing.tools}
            initialCount={listing.count}
            initialLane=""
            trackCounts={stats?.by_track ?? []}
            catalogLaneCounts={catalogLaneCounts}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
