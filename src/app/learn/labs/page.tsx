import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const metadata: Metadata = generateSEO({
  title: 'Hands-On AI Labs for Founders',
  description: 'Interactive, project-based labs to build real skills with AI tools. Practice in sandboxed environments with guided exercises.',
  path: '/learn/labs',
  keywords: ['AI labs', 'hands-on AI', 'interactive AI exercises', 'AI tool practice', 'startup labs'],
});

export default function LabsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Labs', path: '/learn/labs' },
        ]}
      />

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Hands-On Labs</h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            Interactive, project-based exercises to build real skills with AI tools in guided environments.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
            <svg className="w-16 h-16 mx-auto mb-6 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-3">Labs Coming Soon</h2>
            <p className="text-[var(--gray-400)] max-w-md mx-auto mb-6">
              We&apos;re building interactive lab environments where you can practice using AI tools hands-on. Stay tuned.
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
