import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { allStacks } from '@/components/features/stacks/stackData';

export const metadata: Metadata = generateSEO({
  title: 'AI Tool Stacks for Indian Founders',
  description: 'Curated AI tool stacks for Indian founders with INR pricing. Solo founder, SaaS, content creator, customer support, and no-code stacks.',
  path: '/stacks',
  keywords: ['AI tool stacks', 'startup tools India', 'founder stacks', 'INR pricing', 'AI tools for Indian startups'],
});

export default function StacksPage() {
  const stacks = Object.values(allStacks);

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Tool Stacks for Indian Founders</h1>
        <p className="text-[var(--gray-300)] text-lg mb-10 max-w-2xl">
          Curated tool combinations for different founder profiles. Every stack includes INR pricing, security ratings, and free tier options.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {stacks.map((stack) => {
            const toolCount = stack.categories.reduce((sum, cat) => sum + cat.tools.length, 0);
            const totalINR = stack.categories.reduce((total, cat) => {
              const pick = cat.tools.find(t => t.isPick);
              return total + (pick?.priceINR || 0);
            }, 0);

            return (
              <a
                key={stack.slug}
                href={`/stacks/${stack.slug}`}
                className="block bg-[var(--gray-900)] rounded-lg p-6 border border-[var(--gray-700)] hover:border-copper/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-white mb-2">{stack.title}</h2>
                <p className="text-[var(--gray-400)] text-sm mb-4 line-clamp-2">{stack.heroDescription}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-copper">{toolCount} tools</span>
                  <span className="text-[var(--gray-500)]">|</span>
                  <span className="text-white">
                    {totalINR === 0 ? 'Free' : `From ₹${totalINR.toLocaleString('en-IN')}/mo`}
                  </span>
                  <span className="text-[var(--gray-500)]">|</span>
                  <span className="text-[var(--gray-500)]">{stack.lastUpdated}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
