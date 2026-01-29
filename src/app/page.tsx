import { generateStructuredData } from '@/lib/utils/seo';
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/layout/HeroSection";
import PortfolioSection from "../components/shared/PortfolioSection";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import Footer from "../components/layout/Footer";

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
              description: 'AI Tool Directory for Startups and Founders',
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
      <PortfolioSection />
      {/* <NewsletterSignup /> */}
      <Footer />
    </div>
  );
}
