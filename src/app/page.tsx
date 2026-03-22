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
  title: "One9Founders | India's Largest AI Tools, Agents & LLMs Directory",
  description:
    "Discover 26,000+ AI tools, 1,200+ agents, and 177 LLMs. Compare pricing, benchmarks, and security ratings. Built for startup founders. IIT Bombay backed.",
  openGraph: {
    title: "One9Founders | India's Largest AI Tools, Agents & LLMs Directory",
    description:
      "Discover 26,000+ AI tools, 1,200+ agents, and 177 LLMs. Compare pricing, benchmarks, and security ratings. Built for startup founders. IIT Bombay backed.",
  },
  twitter: {
    title: "One9Founders | India's Largest AI Tools, Agents & LLMs Directory",
    description:
      "Discover 26,000+ AI tools, 1,200+ agents, and 177 LLMs. Compare pricing, benchmarks, and security ratings. Built for startup founders.",
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
              description: "India's largest AI ecosystem navigator. 26,000+ AI tools, 177 LLMs, 1,200+ agents. Built for startup founders.",
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
