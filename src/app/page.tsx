import { Metadata } from 'next';
import { getDirectoryStats } from '@/lib/actions/tools';
import { STATS, formatToolCount } from '@/lib/constants/stats';
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/layout/HeroSection";
import TrendingTools from "../components/features/tools/TrendingTools";
import BrowseCategories from "../components/shared/BrowseCategories";
import CorporateSection from "../components/shared/CorporateSection";
import PartnersSection from "../components/shared/PartnersSection";
import WhyTrustSection from "../components/shared/WhyTrustSection";
import Top20Tools from "../components/features/tools/Top20Tools";
import Footer from "../components/layout/Footer";
import FounderSurveyCTA from '@/components/features/survey/FounderSurveyCTA';

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getDirectoryStats();
  const toolCount = formatToolCount(stats.count);
  const description = `Discover ${toolCount} AI tools, ${STATS.aiAgents} agents, ${STATS.llmsCompared} LLMs, and ${STATS.researchPapers} research papers. Compare pricing, benchmarks, and security ratings. Built for startup founders.`;
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
      description: `Discover ${toolCount} AI tools, ${STATS.aiAgents} agents, ${STATS.llmsCompared} LLMs, and ${STATS.researchPapers} research papers. Compare pricing, benchmarks, and security ratings. Built for startup founders.`,
      images: ['/og-image.png'],
    },
  };
}

export default async function Home() {
  const stats = await getDirectoryStats();

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
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
      <HeroSection toolCount={stats.count} />
      <TrendingTools />
      <BrowseCategories toolCount={stats.count} />
      <CorporateSection />
      <PartnersSection />
      <WhyTrustSection
        toolCount={stats.count}
        fullyAssessedCount={stats.fully_assessed_count}
      />
      <Top20Tools />
      <FounderSurveyCTA />
      <Footer />
    </div>
  );
}
