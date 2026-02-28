import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const metadata: Metadata = generateSEO({
  title: 'AI Tool Guides for Startup Founders',
  description: 'Step-by-step guides on choosing, implementing, and getting the most out of AI tools for your startup. Written by founders, for founders.',
  path: '/learn/guides',
  keywords: ['AI tool guides', 'startup AI tutorials', 'how to use AI tools', 'AI implementation guides', 'founder guides'],
});

export default function GuidesPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Guides', path: '/learn/guides' },
        ]}
      />

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Guides</h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            Step-by-step tutorials on choosing, implementing, and mastering AI tools for your startup.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
            <svg className="w-16 h-16 mx-auto mb-6 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-3">Guides Coming Soon</h2>
            <p className="text-[var(--gray-400)] max-w-md mx-auto mb-6">
              We&apos;re crafting in-depth guides on AI tools for founders. Check back soon or subscribe to get notified.
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
