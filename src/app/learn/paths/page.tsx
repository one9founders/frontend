import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const metadata: Metadata = generateSEO({
  title: 'AI Learning Paths for Founders',
  description: 'Curated learning paths to guide you from beginner to expert in AI tools. Choose a path based on your role, stage, or goal.',
  path: '/learn/paths',
  keywords: ['AI learning paths', 'startup learning roadmap', 'AI tool mastery', 'founder learning path', 'AI education'],
});

export default function PathsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Learning Paths', path: '/learn/paths' },
        ]}
      />

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Learning Paths</h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            Curated sequences of guides, labs, and courses designed to take you from beginner to expert.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
            <svg className="w-16 h-16 mx-auto mb-6 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-3">Learning Paths Coming Soon</h2>
            <p className="text-[var(--gray-400)] max-w-md mx-auto mb-6">
              Structured learning journeys tailored to your goals are on the way. Subscribe to get early access.
            </p>
            <Link href="/learn" className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Education Hub
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
