import { Metadata } from 'next';
import { generateStructuredData } from '@/lib/utils/seo';
import { getAllTools } from '@/lib/actions/tools';
import { STATS } from '@/lib/constants/stats';
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/layout/HeroSection";
import TrendingTools from "../components/features/tools/TrendingTools";
import BrowseCategories from "../components/shared/BrowseCategories";
import CorporateSection from "../components/shared/CorporateSection";
import PartnersSection from "../components/shared/PartnersSection";
import WhyTrustSection from "../components/shared/WhyTrustSection";
import Top20Tools from "../components/features/tools/Top20Tools";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: { absolute: "One9Founders | India's #1 AI Ecosystem Navigator" },
  description:
    `Discover ${STATS.totalResources} AI tools, ${STATS.aiAgents} agents, and ${STATS.llmsCompared} LLMs. Compare pricing, benchmarks, and security ratings. Built for startup founders. Supported by IIT Bombay.`,
  alternates: {
    canonical: 'https://www.one9founders.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.one9founders.com',
    title: "One9Founders | India's #1 AI Ecosystem Navigator",
    description:
      `Discover ${STATS.totalResources} AI tools, ${STATS.aiAgents} agents, and ${STATS.llmsCompared} LLMs. Compare pricing, benchmarks, and security ratings. Built for startup founders. Supported by IIT Bombay.`,
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
    description:
      `Discover ${STATS.totalResources} AI tools, ${STATS.aiAgents} agents, and ${STATS.llmsCompared} LLMs. Compare pricing, benchmarks, and security ratings. Built for startup founders.`,
    images: ['/og-image.png'],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData({
              '@type': 'WebSite',
              name: 'One9Founders',
              url: 'https://www.one9founders.com',
              description: `India's largest AI ecosystem navigator. ${STATS.totalResources} AI tools, ${STATS.llmsCompared} LLMs, ${STATS.aiAgents} agents. Built for startup founders.`,
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.one9founders.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            })
          ),
        }}
      />
      <Navbar />
      <HeroSection />
      <TrendingTools />
      <BrowseCategories />
      <CorporateSection />
      <PartnersSection />
      <WhyTrustSection />
      <Top20Tools />
      <Footer />
    </div>
  );
}
