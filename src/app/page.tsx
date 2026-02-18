import { generateStructuredData } from '@/lib/utils/seo';
import { getAllTools } from '@/lib/actions/tools';
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/layout/HeroSection";
import WhySection from "../components/shared/WhySection";
import PortfolioSection from "../components/shared/PortfolioSection";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import Footer from "../components/layout/Footer";

export const revalidate = 300; // 5 minutes - faster updates for ratings and new tools

export default async function Home() {
  const data = await getAllTools({ page: 1, page_size: 20 });
  const initialTools = data?.results || data || [];
  const initialTotalCount = data?.count || initialTools.length;
  const initialTotalPages = Math.ceil(initialTotalCount / 20);

  const websiteSchema = generateStructuredData({
    '@type': 'WebSite',
    name: 'One9Founders',
    url: 'https://one9founders.com',
    description: "India's first security-first AI tools directory with 2,500+ tools tested using uniform rating criteria",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://one9founders.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  });

  const organizationSchema = generateStructuredData({
    '@type': 'Organization',
    name: 'One9Founders',
    url: 'https://one9founders.com',
    logo: 'https://one9founders.com/logo-light.png',
    description: 'Security-first AI tools directory backed by IIT Bombay',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'One9Founders Team',
    },
    sameAs: [
      'https://twitter.com/one9founders',
      'https://linkedin.com/company/one9founders',
      'https://instagram.com/one9founders',
    ],
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Navbar />
      <HeroSection />
      <WhySection />
      <PortfolioSection
        initialTools={initialTools}
        initialTotalCount={initialTotalCount}
        initialTotalPages={initialTotalPages}
      />
      {/* <NewsletterSignup /> */}
      <Footer />
    </div>
  );
}
