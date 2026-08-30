import { Metadata } from 'next';
import { fetchDirectoryStats, fetchToolsByTrack, getTrackCount } from '@/lib/api/toolsStats';
import { STATS, withLiveCount } from '@/lib/constants/stats';
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/layout/HeroSection";
import TrendingTools from "../components/features/tools/TrendingTools";
import TrustStrip from "../components/layout/TrustStrip";
import CorporateSection from "../components/shared/CorporateSection";
import Top20Tools from "../components/features/tools/Top20Tools";
import OpenSourceHome from '@/components/features/tools/OpenSourceHome';
import Footer from "../components/layout/Footer";
import FounderSurveyCTA from '@/components/features/survey/FounderSurveyCTA';

function homeDescription(toolCount: number | null, agentCount: number | null) {
  return `Discover ${withLiveCount(toolCount, 'AI tools')}, ${withLiveCount(agentCount, 'agents')}, ${STATS.llmsCompared} LLMs, and ${STATS.researchPapers} research papers. Compare pricing, benchmarks, and security ratings. Built for startup founders.`;
}

export async function generateMetadata(): Promise<Metadata> {
  const stats = await fetchDirectoryStats();
  const description = homeDescription(stats?.total_tools ?? null, stats?.agent_count ?? null);
  return {
    title: { absolute: "One9Founders | India's #1 AI Ecosystem Navigator" },
    description,
    alternates: {
      canonical: 'https://one9founders.com',
    },
    openGraph: {
      type: 'website',
      url: 'https://one9founders.com',
      title: "One9Founders | India's #1 AI Ecosystem Navigator",
      description,
      images: [{
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'One9Founders - India\'s #1 AI Ecosystem Navigator',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: "One9Founders | India's #1 AI Ecosystem Navigator",
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function Home() {
  const [stats, openSource] = await Promise.all([
    fetchDirectoryStats(),
    fetchToolsByTrack('open_source', 8, 1),
  ]);

  return (
    <div className="min-h-screen bg-[var(--ink)] selection:bg-[var(--copper)] selection:text-[var(--ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "One9Founders",
            "url": "https://one9founders.com",
            "description": `India's largest AI tools, agents, LLMs, and ${STATS.researchPapers} research papers directory for startup founders`,
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://one9founders.com/search?q={search_term_string}",
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
      <TrendingTools />
      <TrustStrip
        toolCount={stats?.total_tools}
        fullyAssessedCount={stats?.fully_assessed_count}
      />
      <OpenSourceHome
        initialTools={openSource.tools}
        initialCount={openSource.count}
        trackCounts={stats?.by_track ?? []}
      />
      <Top20Tools />
      <CorporateSection />
      <FounderSurveyCTA />
      <Footer />
    </div>
  );
}
