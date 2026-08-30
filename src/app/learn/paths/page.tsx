import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { educationAPI } from '@/lib/api/apiClient';
import type { LearningPathListItem } from '@/types/education';

export const revalidate = 300;

export const metadata: Metadata = generateSEO({
  title: 'AI Learning Paths - Structured Learning Journeys',
  description: 'Curated learning paths to guide you from beginner to expert in AI tools. Choose a path based on your role and goals.',
  path: '/learn/paths',
  keywords: ['AI learning paths', 'AI roadmap', 'AI tool mastery', 'learning path', 'AI education India'],
});

const pathColors: Record<string, { gradient: string; border: string; iconBg: string }> = {
  students: { gradient: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/30', iconBg: 'bg-blue-500/10' },
  professionals: { gradient: 'from-rose-500/20 to-rose-600/5', border: 'border-rose-500/30', iconBg: 'bg-rose-500/10' },
  entrepreneurs: { gradient: 'from-copper/20 to-copper/5', border: 'border-copper/30', iconBg: 'bg-copper/10' },
  'sme-owners': { gradient: 'from-green-500/20 to-green-600/5', border: 'border-green-500/30', iconBg: 'bg-green-500/10' },
};

export default async function PathsPage() {
  let paths: LearningPathListItem[] = [];

  try {
    const data = await educationAPI.getLearningPaths();
    paths = Array.isArray(data) ? data : data?.results || [];
  } catch {
    // Graceful fallback
  }

  const structuredData = generateStructuredData({
    '@type': 'CollectionPage',
    name: 'AI Learning Paths',
    description: 'Curated learning paths for AI education.',
    url: 'https://www.one9founders.com/learn/paths',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
            Curated sequences of courses, guides, and workshops designed to take you from beginner to expert.
          </p>
        </div>
      </section>

      {/* Paths Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {paths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paths.map((path) => {
                const audienceSlug = path.audience?.slug || '';
                const colors = pathColors[audienceSlug] || pathColors.students;
                return (
                  <Link
                    key={path.id}
                    href={`/learn/paths/${path.slug}`}
                    className={`group block rounded-xl border bg-gradient-to-br ${colors.gradient} ${colors.border} hover:border-opacity-60 transition-all p-6`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
                        {path.icon ? (
                          <span className="text-2xl">{path.icon}</span>
                        ) : (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-copper-bright transition-colors mb-2">
                          {path.title}
                        </h3>
                        <p className="text-sm text-[var(--gray-400)] mb-3">
                          {path.short_description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--gray-500)]">
                          {path.audience && (
                            <span className="px-2 py-0.5 rounded bg-[var(--gray-800)]">{path.audience.name}</span>
                          )}
                          {path.estimated_duration && (
                            <span>{path.estimated_duration}</span>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-[var(--gray-600)] group-hover:text-white transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
              <svg className="w-16 h-16 mx-auto mb-6 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-3">Learning Paths Coming Soon</h2>
              <p className="text-[var(--gray-400)] max-w-md mx-auto mb-6">
                Structured learning journeys tailored to your goals are on the way.
              </p>
              <Link href="/learn" className="text-copper hover:text-copper-bright font-medium inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Education Hub
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
