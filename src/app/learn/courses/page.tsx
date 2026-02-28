import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const metadata: Metadata = generateSEO({
  title: 'AI Courses for Startup Founders',
  description: 'Structured, multi-lesson courses on AI tools and strategies. Go deep on topics that matter for your startup growth.',
  path: '/learn/courses',
  keywords: ['AI courses', 'startup AI courses', 'AI tool training', 'founder education', 'AI learning'],
});

export default function CoursesPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Courses', path: '/learn/courses' },
        ]}
      />

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Courses</h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            Structured, multi-lesson programs to go deep on AI tools and strategies for your startup.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
            <svg className="w-16 h-16 mx-auto mb-6 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-3">Courses Coming Soon</h2>
            <p className="text-[var(--gray-400)] max-w-md mx-auto mb-6">
              We&apos;re developing structured courses that take you from beginner to expert. Check back soon.
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
