import { Metadata } from 'next';
import { Suspense } from 'react';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { educationAPI } from '@/lib/api/apiClient';
import CourseCard from '@/components/features/education/CourseCard';
import type { CourseListItem, EducationCategory, PaginatedResponse } from '@/types/education';
import CoursesFilterClient from './CoursesFilterClient';

export const revalidate = 300;

export const metadata: Metadata = generateSEO({
  title: 'AI Courses - Learn Practical AI Skills',
  description: 'Structured, hands-on courses on AI tools and strategies. Contact for pricing. Supported by IIT Bombay.',
  path: '/learn/courses',
  keywords: ['AI courses', 'AI training India', 'AI tool courses', 'practical AI courses', 'IIT Bombay courses'],
});

interface CoursesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : '';
  const difficulty = typeof params.difficulty === 'string' ? params.difficulty : '';
  const audience = typeof params.audience === 'string' ? params.audience : '';
  const format = typeof params.format === 'string' ? params.format : '';
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;

  let courses: CourseListItem[] = [];
  let totalCount = 0;
  let categories: EducationCategory[] = [];

  try {
    const [courseRes, catRes] = await Promise.allSettled([
      educationAPI.getCourses({
        category: category || undefined,
        difficulty: difficulty || undefined,
        audience: audience || undefined,
        format: format || undefined,
        page: page || 1,
        page_size: 12,
      }),
      educationAPI.getCategories(),
    ]);

    if (courseRes.status === 'fulfilled') {
      const data = courseRes.value as PaginatedResponse<CourseListItem> | CourseListItem[];
      if (Array.isArray(data)) {
        courses = data;
        totalCount = data.length;
      } else if (data && 'results' in data) {
        courses = data.results;
        totalCount = data.count;
      }
    }
    if (catRes.status === 'fulfilled') {
      const data = catRes.value;
      categories = Array.isArray(data) ? data : data?.results || [];
    }
  } catch {
    // Graceful fallback
  }

  const hasActiveFilters = !!(category || difficulty || audience || format);

  const structuredData = generateStructuredData({
    '@type': 'CollectionPage',
    name: 'AI Courses',
    description: 'Structured, hands-on courses on AI tools and strategies.',
    url: 'https://one9founders.com/learn/courses',
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
          { name: 'Courses', path: '/learn/courses' },
        ]}
      />

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Courses</h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            Structured, hands-on programs to build real AI skills. Contact for pricing.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<div className="h-20 animate-pulse bg-[var(--gray-800)] rounded mb-8" />}>
            <CoursesFilterClient categories={categories} />
          </Suspense>

          {courses.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[var(--gray-400)]">
                {totalCount} {totalCount === 1 ? 'course' : 'courses'} found
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>
          )}

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
              <svg className="w-16 h-16 mx-auto mb-6 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-3">
                {hasActiveFilters ? 'No courses match your filters' : 'Courses Coming Soon'}
              </h2>
              <p className="text-[var(--gray-400)] max-w-md mx-auto">
                {hasActiveFilters ? 'Try adjusting your filters.' : 'We\'re developing courses. Check back soon.'}
              </p>
            </div>
          )}

          {totalCount > 12 && (
            <div className="mt-8 flex justify-center gap-2">
              {page > 1 && (
                <a
                  href={`/learn/courses?page=${page - 1}${category ? `&category=${category}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}${format ? `&format=${format}` : ''}`}
                  className="px-4 py-2 rounded-lg bg-[var(--gray-800)] text-white hover:bg-[var(--gray-700)] transition-colors"
                >
                  Previous
                </a>
              )}
              <span className="px-4 py-2 text-[var(--gray-400)]">Page {page}</span>
              {totalCount > page * 12 && (
                <a
                  href={`/learn/courses?page=${page + 1}${category ? `&category=${category}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}${format ? `&format=${format}` : ''}`}
                  className="px-4 py-2 rounded-lg bg-[var(--gray-800)] text-white hover:bg-[var(--gray-700)] transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
