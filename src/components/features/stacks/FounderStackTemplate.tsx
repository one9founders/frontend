import { generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StackCostCalculator from './StackCostCalculator';

export interface StackTool {
  name: string;
  slug: string;
  category: string;
  priceUSD: number;
  priceINR: number;
  freeTier: boolean;
  keyFeature: string;
  score: number;
  securityRating: number;
  isPick: boolean;
}

export interface StackCategory {
  name: string;
  tools: StackTool[];
}

export interface StackPageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  tldr: string;
  categories: StackCategory[];
  faqs: { question: string; answer: string }[];
  lastUpdated: string;
}

export default function FounderStackTemplate({ data }: { data: StackPageData }) {
  const faqSchema = generateStructuredData({
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });

  const breadcrumbSchema = generateStructuredData({
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.one9founders.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Stacks',
        item: 'https://www.one9founders.com/stacks',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.title,
        item: `https://www.one9founders.com/stacks/${data.slug}`,
      },
    ],
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
              Founder Stack
            </span>
            <span className="text-[var(--gray-500)] text-xs">
              Last updated: {data.lastUpdated}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{data.title}</h1>
          <p className="text-[var(--gray-300)] text-lg mb-6 leading-relaxed">{data.heroDescription}</p>
        </div>

        {/* TL;DR */}
        <div className="bg-[var(--gray-800)] border-l-4 border-purple-500 rounded-r-lg p-5 mb-10">
          <h2 className="text-lg font-semibold text-white mb-2">TL;DR</h2>
          <p className="text-[var(--gray-300)] text-sm leading-relaxed">{data.tldr}</p>
        </div>

        {/* Interactive Cost Calculator + Tool Tables */}
        <StackCostCalculator categories={data.categories} />

        {/* Copy This Stack CTA */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-600/30 rounded-lg p-8 text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-3">Copy This Stack</h2>
          <p className="text-[var(--gray-300)] mb-6 max-w-xl mx-auto">
            Get the complete list of tools with setup guides and exclusive startup discounts.
          </p>
          <a
            href="/tools"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Explore All Tools
          </a>
        </div>

        {/* FAQ Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="bg-[var(--gray-800)] rounded-lg p-5">
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-[var(--gray-300)] text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
