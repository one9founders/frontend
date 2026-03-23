import { generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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

function calculateTotalINR(categories: StackCategory[]): number {
  return categories.reduce((total, cat) => {
    const pick = cat.tools.find(t => t.isPick);
    return total + (pick?.priceINR || 0);
  }, 0);
}

function calculateTotalWithGST(total: number): number {
  return Math.round(total * 1.18);
}

export default function FounderStackTemplate({ data }: { data: StackPageData }) {
  const totalINR = calculateTotalINR(data.categories);
  const totalWithGST = calculateTotalWithGST(totalINR);
  const toolCount = data.categories.reduce((sum, cat) => sum + cat.tools.length, 0);

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
          <div className="flex flex-wrap gap-4">
            <div className="bg-[var(--gray-900)] rounded-lg px-5 py-3 border border-[var(--gray-700)]">
              <div className="text-[var(--gray-500)] text-xs">Total Monthly Cost</div>
              <div className="text-2xl font-bold text-white">&#8377;{totalINR.toLocaleString('en-IN')}<span className="text-sm text-[var(--gray-400)] font-normal">/mo</span></div>
              <div className="text-[var(--gray-500)] text-xs">&#8377;{totalWithGST.toLocaleString('en-IN')} incl. GST</div>
            </div>
            <div className="bg-[var(--gray-900)] rounded-lg px-5 py-3 border border-[var(--gray-700)]">
              <div className="text-[var(--gray-500)] text-xs">Tools in Stack</div>
              <div className="text-2xl font-bold text-white">{toolCount}</div>
            </div>
            <div className="bg-[var(--gray-900)] rounded-lg px-5 py-3 border border-[var(--gray-700)]">
              <div className="text-[var(--gray-500)] text-xs">Categories</div>
              <div className="text-2xl font-bold text-white">{data.categories.length}</div>
            </div>
          </div>
        </div>

        {/* TL;DR */}
        <div className="bg-[var(--gray-800)] border-l-4 border-purple-500 rounded-r-lg p-5 mb-10">
          <h2 className="text-lg font-semibold text-white mb-2">TL;DR</h2>
          <p className="text-[var(--gray-300)] text-sm leading-relaxed">{data.tldr}</p>
        </div>

        {/* Tool Categories */}
        {data.categories.map((category, catIdx) => (
          <div key={catIdx} className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">{category.name}</h2>
            
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--gray-700)]">
                    <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Tool</th>
                    <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Price (INR)</th>
                    <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Free Tier</th>
                    <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Key Feature</th>
                    <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Score</th>
                    <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Security</th>
                  </tr>
                </thead>
                <tbody>
                  {category.tools.map((tool, toolIdx) => (
                    <tr
                      key={toolIdx}
                      className={`border-b border-[var(--gray-800)] ${tool.isPick ? 'bg-purple-600/10' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <a href={`/tool/${tool.slug}`} className="text-white hover:text-purple-400 font-medium">
                          {tool.name}
                        </a>
                        {tool.isPick && (
                          <span className="ml-2 bg-purple-600 text-white px-1.5 py-0.5 rounded text-xs">
                            Top Pick
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {tool.priceINR === 0 ? 'Free' : `₹${tool.priceINR.toLocaleString('en-IN')}/mo`}
                      </td>
                      <td className="py-3 px-4">
                        {tool.freeTier ? (
                          <span className="text-green-400">Yes</span>
                        ) : (
                          <span className="text-[var(--gray-500)]">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[var(--gray-300)]">{tool.keyFeature}</td>
                      <td className="py-3 px-4 text-white">{tool.score}/10</td>
                      <td className="py-3 px-4 text-white">{tool.securityRating}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

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
