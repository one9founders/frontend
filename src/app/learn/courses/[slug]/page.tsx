import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { educationAPI } from '@/lib/api/apiClient';
import DifficultyBadge from '@/components/features/education/DifficultyBadge';
import FormatBadge from '@/components/features/education/FormatBadge';
import CurriculumAccordion from '@/components/features/education/CurriculumAccordion';
import FAQAccordion from '@/components/features/education/FAQAccordion';
import InquiryForm from '@/components/features/education/InquiryForm';
import GuideCard from '@/components/features/education/GuideCard';
import type { CourseDetail } from '@/types/education';

export const revalidate = 300;

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course: CourseDetail | null = await educationAPI.getCourseBySlug(slug);

  if (!course || Array.isArray(course)) {
    return { title: 'Course Not Found | One9Founders' };
  }

  return generateSEO({
    title: course.meta_title || course.title,
    description: course.meta_description || course.short_description || course.title,
    path: `/learn/courses/${course.slug}`,
    keywords: [course.title, 'AI course', course.difficulty, course.format, 'IIT Bombay'],
  });
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course: CourseDetail | null = await educationAPI.getCourseBySlug(slug);

  if (!course || Array.isArray(course)) {
    notFound();
  }

  const courseSchema = generateStructuredData({
    '@type': 'Course',
    name: course.title,
    description: course.meta_description || course.short_description,
    provider: {
      '@type': 'Organization',
      name: 'One9Founders',
      url: 'https://www.one9founders.com',
    },
    url: `https://www.one9founders.com/learn/courses/${course.slug}`,
    ...(course.has_certificate && {
      educationalCredentialAwarded: 'Certificate issued through IIT Bombay Educational Outreach',
    }),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Courses', path: '/learn/courses' },
          { name: course.title, path: `/learn/courses/${course.slug}` },
        ]}
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <DifficultyBadge difficulty={course.difficulty} size="md" />
            <FormatBadge format={course.format} size="md" />
            {course.duration_weeks > 0 && (
              <span className="px-3 py-1 text-sm rounded bg-[var(--gray-800)] text-[var(--gray-300)]">
                {course.duration_weeks} weeks
              </span>
            )}
            {course.has_certificate && (
              <span className="px-3 py-1 text-sm rounded bg-[var(--gray-800)] text-[var(--gray-300)]">
                Certificate
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{course.title}</h1>
          {course.subtitle && (
            <p className="text-lg text-[var(--gray-300)] mb-4">{course.subtitle}</p>
          )}

          {/* Contact for Pricing badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-6">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-purple-400 font-medium">Contact for Pricing</span>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--gray-500)]">
            {course.category && <span>{course.category.name}</span>}
            {course.hours_per_week > 0 && <span>{course.hours_per_week} hrs/week</span>}
            {course.total_lessons > 0 && <span>{course.total_lessons} lessons</span>}
            {course.language && <span>{course.language}{course.has_hindi_support ? ' + Hindi' : ''}</span>}
          </div>
        </header>

        {/* Video */}
        {course.intro_video_url && (
          <section className="mb-10">
            <div className="aspect-video rounded-xl overflow-hidden bg-[var(--gray-900)] border border-[var(--gray-700)]">
              <iframe
                src={course.intro_video_url}
                className="w-full h-full"
                allowFullScreen
                title={`${course.title} intro video`}
              />
            </div>
          </section>
        )}

        {/* Description */}
        {course.description && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
            <div className="guide-content" dangerouslySetInnerHTML={{ __html: course.description }} />
          </section>
        )}

        {/* Curriculum */}
        {course.modules && course.modules.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Curriculum</h2>
            <CurriculumAccordion modules={course.modules} />
          </section>
        )}

        {/* What's Included */}
        {course.whats_included && course.whats_included.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">What&apos;s Included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.whats_included.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--gray-900)]">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[var(--gray-300)]">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificate */}
        {course.has_certificate && (
          <section className="mb-10">
            <div className="rounded-xl border border-[var(--gray-700)] bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-3">Certificate</h2>
              <p className="text-[var(--gray-300)]">
                {course.certificate_description || 'Certificate issued through IIT Bombay Educational Outreach'}
              </p>
            </div>
          </section>
        )}

        {/* Instructors */}
        {course.instructors && course.instructors.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Instructors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.instructors.map((instructor) => (
                <div key={instructor.id} className="flex items-start gap-4 p-4 rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)]">
                  {instructor.photo ? (
                    <img src={instructor.photo} alt={instructor.name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[var(--gray-700)] flex items-center justify-center">
                      <span className="text-lg font-bold text-[var(--gray-500)]">{instructor.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white">{instructor.name}</h3>
                    {instructor.title && <p className="text-sm text-[var(--gray-400)]">{instructor.title}</p>}
                    {instructor.short_bio && <p className="text-sm text-[var(--gray-500)] mt-1">{instructor.short_bio}</p>}
                    <div className="flex gap-3 mt-2">
                      {instructor.linkedin_url && (
                        <a href={instructor.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300">LinkedIn</a>
                      )}
                      {instructor.twitter_url && (
                        <a href={instructor.twitter_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300">Twitter</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tools You'll Learn */}
        {course.tools_mentioned && course.tools_mentioned.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Tools You&apos;ll Learn</h2>
            <div className="flex flex-wrap gap-2">
              {course.tools_mentioned.map((toolSlug) => (
                <Link
                  key={toolSlug}
                  href={`/tool/${toolSlug}`}
                  className="px-3 py-1.5 text-sm rounded-full bg-[var(--gray-800)] text-[var(--gray-300)] hover:text-white hover:bg-[var(--gray-700)] transition-colors"
                >
                  {toolSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {course.faqs && course.faqs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <FAQAccordion faqs={course.faqs} />
          </section>
        )}

        {/* Related Guides */}
        {course.related_guides && course.related_guides.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.related_guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </section>
        )}

        {/* Inquiry Form */}
        <section className="mt-12">
          <InquiryForm
            courseSlug={course.slug}
            sourcePage={`/learn/courses/${course.slug}`}
            title="Interested in This Course?"
            subtitle="We'll get back within 24 hours with enrollment details."
          />
        </section>
      </article>
    </>
  );
}
