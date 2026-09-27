import { Metadata } from 'next';
import { fetchDirectoryStats, fetchToolsByTrack, getTrackCount } from '@/lib/api/toolsStats';
import { STATS, withLiveCount } from '@/lib/constants/stats';
import { SITE_URL } from '@/lib/constants/site';
import { generateSEO } from '@/lib/utils/seo';
import { toolsAPI, trackingAPI } from '@/lib/api/apiClient';
import { catalogApiQuery, catalogQueryFromParams, catalogQueryKey } from '@/lib/catalogQuery';
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/layout/HeroSection";
import TrendingTools from "../components/features/tools/TrendingTools";
import TrustStrip from "../components/layout/TrustStrip";
import Top20Tools from "../components/features/tools/Top20Tools";
import OpenSourceHome from '@/components/features/tools/OpenSourceHome';
import HomeJourneys from '@/components/layout/HomeJourneys';
import Footer from "../components/layout/Footer";
import FounderSurveyCTA from '@/components/features/survey/FounderSurveyCTA';
import type { Tool } from '@/types';

function homeDescription(toolCount: number | null, agentCount: number | null) {
  return `Find the right AI and put it to work. Search ${withLiveCount(toolCount, 'AI tools')}, ${withLiveCount(agentCount, 'agents')}, ${STATS.llmsCompared} LLMs, and ${STATS.researchPapers} research papers, or start a service intake.`;
}

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const stats = await fetchDirectoryStats();
  const description = homeDescription(stats?.total_tools ?? null, stats?.agent_count ?? null);
  return generateSEO({
    title: 'Find the right AI. Put it to work.',
    description,
    path: '/',
  });
}

export default async function Home({ searchParams }: HomeProps) {
  const raw = await searchParams;
  const directoryQuery = catalogQueryFromParams({
    get(name: string) {
      const value = raw[name];
      if (Array.isArray(value)) return value[0] ?? null;
      return value ?? null;
    },
  });
  const apiQuery = catalogApiQuery(directoryQuery);
  const [stats, openSource, directory, arrivals] = await Promise.all([
    fetchDirectoryStats(),
    fetchToolsByTrack('open_source', 8, 1),
    toolsAPI.getAll({
      q: apiQuery.q,
      category: apiQuery.category,
      pricing_type: apiQuery.pricing_type,
      job_cluster: apiQuery.job_cluster,
      deployment: apiQuery.deployment,
      integration: apiQuery.integration,
      ordering: apiQuery.ordering,
      page: Number(apiQuery.page),
      page_size: Number(apiQuery.page_size),
      track: apiQuery.track,
    }),
    trackingAPI.getCommunitySubmittedTools(8),
  ]);
  const directoryReady = Boolean(directory && (Array.isArray(directory) || (typeof directory === 'object' && 'results' in directory)));
  const directoryTools: Tool[] = directory && typeof directory === 'object' && 'results' in directory
    ? directory.results || []
    : Array.isArray(directory) ? directory : [];
  const directoryCount = directory && typeof directory === 'object' && 'count' in directory
    ? Number(directory.count) || directoryTools.length
    : directoryTools.length;

  return (
    <div className="min-h-screen bg-[var(--ink)] selection:bg-[var(--copper)] selection:text-[var(--ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "One9Founders",
            "url": SITE_URL,
            "description": `Find the right AI and put it to work. Directory of tools, agents, LLMs, and ${STATS.researchPapers} research papers.`,
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_URL}/?q={search_term_string}#tools-section`,
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <Navbar />
      <HeroSection
        toolCount={stats?.total_tools}
        agentCount={stats?.agent_count}
        openSourceCount={getTrackCount(stats, 'open_source')}
      />
      <HomeJourneys part="paths" />
      <Top20Tools
        initial={directoryReady ? {
          tools: directoryTools,
          count: directoryCount,
          queryKey: catalogQueryKey(directoryQuery),
        } : null}
      />
      <TrendingTools initialTools={Array.isArray(arrivals) ? arrivals : []} />
      <HomeJourneys part="guides" />
      <TrustStrip
        toolCount={stats?.total_tools}
        fullyAssessedCount={stats?.fully_assessed_count}
      />
      <OpenSourceHome
        initialTools={openSource.tools}
        initialCount={openSource.count}
        trackCounts={stats?.by_track ?? []}
      />
      <FounderSurveyCTA />
      <Footer />
    </div>
  );
}
