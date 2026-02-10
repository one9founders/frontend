import { Metadata } from 'next';
import { getAllTools } from '@/lib/actions/tools';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ComparePageClient from '@/components/features/tools/ComparePageClient';

export const revalidate = 3600;

export const metadata: Metadata = generateSEO({
  title: 'Compare AI Tools Side by Side',
  description: 'Compare up to 4 AI tools side by side. Evaluate features, pricing, ratings, and integrations to find the best AI tool for your startup or business.',
  path: '/compare',
  keywords: ['AI tool comparison', 'compare AI tools', 'AI software comparison', 'startup tools', 'founder tools', 'AI tool features'],
});

export default async function ComparePage() {
  const data = await getAllTools({ page_size: 100 });
  const initialTools = Array.isArray(data) ? data : (data?.results || []);

  const structuredData = generateStructuredData({
    '@type': 'WebPage',
    name: 'Compare AI Tools',
    description: 'Compare up to 4 AI tools side by side to find the best solution for your needs.',
    url: 'https://one9founders.com/compare',
    mainEntity: {
      '@type': 'ItemList',
      name: 'AI Tools for Comparison',
      numberOfItems: initialTools.length,
      itemListElement: initialTools.slice(0, 10).map((tool: { name: string; slug: string; description: string }, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: tool.name,
          url: `https://one9founders.com/tool/${tool.slug}`,
          description: tool.description,
        },
      })),
    },
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--gray-600)] mb-4">Compare AI Tools</h1>
          <p className="text-lg sm:text-xl text-[var(--gray-300)] max-w-2xl mx-auto">
            Select up to 4 AI tools to compare features, pricing, and ratings side by side
          </p>
        </div>

        <ComparePageClient initialTools={initialTools} />
      </div>
      
      <Footer />
    </div>
  );
}
