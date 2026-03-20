import { Metadata } from 'next';
import { generateStructuredData } from '@/lib/utils/seo';
import { getAllTools } from '@/lib/actions/tools';
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
  title: "One9Founders — India's Largest AI Ecosystem Navigator",
  description:
    "Discover 27,000+ AI tools, agents, LLMs, open source models, and startups. Security-validated with zero affiliate bias. Supported by IIT Bombay.",
  openGraph: {
    title: "One9Founders — India's Largest AI Ecosystem Navigator",
    description:
      "Discover 27,000+ AI tools, agents, LLMs, open source models, and startups. Security-validated with zero affiliate bias. Supported by IIT Bombay.",
  },
  twitter: {
    title: "One9Founders — India's Largest AI Ecosystem Navigator",
    description:
      "Discover 27,000+ AI tools, agents, LLMs, open source models, and startups. Security-validated with zero affiliate bias.",
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
              url: 'https://one9founders.com',
              description: "India's Largest AI Ecosystem Navigator — Discover 27,000+ AI tools, agents, LLMs, open source models, and startups.",
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://one9founders.com/search?q={search_term_string}',
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
