import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { educationAPI } from '@/lib/api/apiClient';
import CourseCard from '@/components/features/education/CourseCard';
import GuideCard from '@/components/features/education/GuideCard';
import WorkshopCard from '@/components/features/education/WorkshopCard';
import type { LearningPathDetail } from '@/types/education';

export const revalidate = 300;

interface PathPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path: LearningPathDetail | null = await educationAPI.getLearningPathBySlug(slug);

  if (!path) {
    return { title: 'Learning Path Not Found | One9Founders' };
  }

  return generateSEO({
    title: `${path.title} - Learning Path`,
    description: path.short_description || path.description,
    path: `/learn/paths/${path.slug}`,
    keywords: [path.title, 'AI learning path', 'AI education', 'structured learning'],
  });
}

export default async function PathDetailPage({ params }: PathPageProps) {
  const { slug } = await params;
  const path: LearningPathDetail | null = await educationAPI.getLearningPathBySlug(slug);

  if (!path) {
    notFound();
  }

  const structuredData = generateStructuredData({
    '@type': 'Course',
    name: path.title,
    description: path.short_description || path.description,
    provider: {
      '@type': 'Organization',
      name: 'One9Founders',
      url: 'https://one9founders.com',
    },
    url: `https://one9founders.com/learn/paths/${path.slug}`,
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
          { name: path.title, path: `/learn/paths/${path.slug}` },
        ]}
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <header className="mb-10">
          {path.icon && <span className="text-4xl mb-4 block">{path.icon}</span>}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{path.title}</h1>
          <p className="text-lg text-[var(--gray-300)] mb-4">{path.short_description}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--gray-500)]">
            {path.audience && (
              <span className="px-3 py-1 rounded bg-[var(--gray-800)]">{path.audience.name}</span>
            )}
            {path.estimated_duration && (
              <span className="px-3 py-1 rounded bg-[var(--gray-800)]">{path.estimated_duration}</span>
            )}
          </div>
        </header>

        {/* Description */}
        {path.description && (
          <section className="mb-10">
            <div className="guide-content" dangerouslySetInnerHTML={{ __html: path.description }} />
          </section>
        )}

        {/* Modules */}
        {path.modules && path.modules.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-6">Learning Modules</h2>
            <div className="space-y-8">
              {path.modules.map((module, index) => (
                <div key={module.id} className="relative">
                  {/* Module header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-400">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{module.title}</h3>
                      {module.description && (
                        <p className="text-sm text-[var(--gray-400)] mt-1">{module.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Module content */}
                  <div className="ml-14 space-y-4">
                    {/* Courses */}
                    {module.courses && module.courses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--gray-500)] uppercase tracking-wider mb-3">Courses</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {module.courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Guides */}
                    {module.guides && module.guides.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--gray-500)] uppercase tracking-wider mb-3">Guides</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {module.guides.map((guide) => (
                            <GuideCard key={guide.id} guide={guide} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Workshops */}
                    {module.workshops && module.workshops.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--gray-500)] uppercase tracking-wider mb-3">Workshops</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {module.workshops.map((workshop) => (
                            <WorkshopCard key={workshop.id} workshop={workshop} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Connector line */}
                  {index < path.modules.length - 1 && (
                    <div className="absolute left-5 top-14 bottom-0 w-px bg-[var(--gray-700)]" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-12 text-center">
          <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-8">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Start?</h2>
            <p className="text-[var(--gray-400)] mb-6 max-w-md mx-auto">
              Begin your learning journey today. Explore courses and guides in this path.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/learn/courses" className="btn-primary px-6 py-3">Explore Courses</Link>
              <Link href="/learn/guides" className="btn-secondary px-6 py-3">Browse Guides</Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
