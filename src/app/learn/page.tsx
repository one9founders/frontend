import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import { educationAPI } from '@/lib/api/apiClient';
import CourseCard from '@/components/features/education/CourseCard';
import GuideCard from '@/components/features/education/GuideCard';
import WorkshopCard from '@/components/features/education/WorkshopCard';
import type { EducationAudience, CourseListItem, GuideListItem, WorkshopListItem } from '@/types/education';

export const revalidate = 300;

export const metadata: Metadata = generateSEO({
  title: 'Learn AI | Free Courses & Workshops for Founders | One9Founders',
  description: 'Free AI guides, hands-on courses, and live workshops for founders, students, and teams. From prompt engineering to building with agents. IIT Bombay backed.',
  path: '/learn',
  keywords: ['AI education', 'AI courses India', 'AI guides', 'AI workshops', 'learn AI', 'IIT Bombay', 'startup AI training'],
});

const audienceIcons: Record<string, React.ReactNode> = {
  students: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  professionals: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  entrepreneurs: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  organizations: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
};

const audienceColors: Record<string, { gradient: string; border: string }> = {
  students: { gradient: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/30' },
  professionals: { gradient: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/30' },
  entrepreneurs: { gradient: 'from-orange-500/20 to-orange-600/5', border: 'border-orange-500/30' },
  organizations: { gradient: 'from-green-500/20 to-green-600/5', border: 'border-green-500/30' },
};

export default async function LearnPage() {
  let audiences: EducationAudience[] = [];
  let featuredCourses: CourseListItem[] = [];
  let featuredGuides: GuideListItem[] = [];
  let upcomingWorkshops: WorkshopListItem[] = [];

  try {
    const [audienceRes, courseRes, guideRes, workshopRes] = await Promise.allSettled([
      educationAPI.getAudiences(),
      educationAPI.getCourses({ is_featured: true, page_size: 6 }),
      educationAPI.getGuides({ is_featured: true, page_size: 6 }),
      educationAPI.getWorkshops({ status: 'upcoming', page_size: 3 }),
    ]);

    if (audienceRes.status === 'fulfilled') {
      const data = audienceRes.value;
      audiences = Array.isArray(data) ? data : data?.results || [];
    }
    if (courseRes.status === 'fulfilled') {
      const data = courseRes.value;
      featuredCourses = Array.isArray(data) ? data : data?.results || [];
    }
    if (guideRes.status === 'fulfilled') {
      const data = guideRes.value;
      featuredGuides = Array.isArray(data) ? data : data?.results || [];
    }
    if (workshopRes.status === 'fulfilled') {
      const data = workshopRes.value;
      upcomingWorkshops = Array.isArray(data) ? data : data?.results || [];
    }
  } catch {
    // Graceful fallback
  }

  const structuredData = generateStructuredData({
    '@type': 'WebPage',
    name: 'Learn AI the Practical Way',
    description: 'Free guides, hands-on labs, and certified courses. Built for India\'s next generation.',
    url: 'https://www.one9founders.com/learn',
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
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--gray-900)] border border-[var(--gray-700)] px-4 py-2 rounded-full mb-6">
            <Image src="/iitb-logo.png" alt="IIT Bombay" width={24} height={24} className="rounded-sm" />
            <span className="text-sm text-[var(--gray-300)]">Supported by IIT Bombay</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Learn AI the Practical Way
          </h1>
          <p className="text-xl text-[var(--gray-300)] mb-8 max-w-2xl mx-auto">
            Free guides, hands-on courses, and live workshops. Built for India&apos;s next generation. Supported by IIT Bombay.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/learn/courses" className="btn-primary px-6 py-3">
              Explore Courses
            </Link>
            <Link href="/learn/guides" className="btn-secondary px-6 py-3">
              Free Guides
            </Link>
            <Link href="/learn/organizations" className="btn-secondary px-6 py-3">
              For Colleges &amp; Corporates
            </Link>
          </div>
        </div>
      </section>

      {/* Choose Your Track */}
      {audiences.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Track</h2>
              <p className="text-[var(--gray-400)] max-w-2xl mx-auto">
                Pick the learning path that matches your background and goals.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {audiences.map((audience) => {
                const slug = audience.slug;
                const colors = audienceColors[slug] || audienceColors.students;
                const icon = audienceIcons[slug] || audienceIcons.students;
                const href = slug === 'organizations' ? '/learn/organizations' : `/learn/${slug}`;
                return (
                  <Link
                    key={audience.id}
                    href={href}
                    className={`group block p-6 rounded-xl border bg-gradient-to-br ${colors.gradient} ${colors.border} hover:border-opacity-60 transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--gray-800)]">
                        {icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                          {audience.name}
                        </h3>
                        <p className="text-sm text-[var(--gray-400)]">{audience.description}</p>
                      </div>
                      <svg className="w-5 h-5 text-[var(--gray-600)] group-hover:text-white transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-[var(--gray-400)]">Hands-on programs to build real AI skills.</p>
            </div>
            <Link href="/learn/courses" className="hidden sm:inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium">
              View all courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-800)]">
              <span className="text-3xl mb-3 block">📚</span>
              <h3 className="text-lg font-bold text-white mb-2">Courses Launching Soon</h3>
              <p className="text-[var(--gray-400)] mb-4 max-w-md mx-auto">We&apos;re building hands-on AI courses for founders. Drop your email to get early access.</p>
              <p className="text-xs text-[var(--gray-500)]">Subscribe via our newsletter in the footer below.</p>
            </div>
          )}
        </div>
      </section>

      {/* Free Guides - hidden until content is available */}
      {featuredGuides.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Free Guides</h2>
                <p className="text-[var(--gray-400)]">In-depth tutorials to help you get the most out of AI tools.</p>
              </div>
              <Link href="/learn/guides" className="hidden sm:inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium">
                View all guides
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {featuredGuides.map((guide) => (
                <div key={guide.id} className="flex-shrink-0 w-[320px] snap-start">
                  <GuideCard guide={guide} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Workshops - hidden until content is available */}
      {upcomingWorkshops.length > 0 && (
        <section className="py-16 px-6 bg-[var(--gray-900)]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Upcoming Workshops</h2>
                <p className="text-[var(--gray-400)]">Live sessions with industry experts. Learn, ask questions, and network.</p>
              </div>
              <Link href="/learn/workshops" className="hidden sm:inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium">
                All workshops
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* For Colleges & Corporates */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-[var(--gray-700)] bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  For Teams
                </span>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Bring AI Training to Your Campus or Organization
                </h2>
                <p className="text-[var(--gray-300)] mb-6">
                  Custom programs for colleges and corporates. Supported by IIT Bombay. Contact us for custom pricing.
                </p>
                <Link href="/learn/organizations" className="btn-primary px-6 py-3">
                  Learn More
                </Link>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="w-full max-w-sm rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Custom Training</div>
                        <div className="text-xs text-[var(--gray-500)]">Tailored to your needs</div>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--gray-800)]">
                      <div className="h-2 w-3/4 rounded-full bg-purple-500/50" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['Courses', 'Workshops', 'Support'].map((item) => (
                        <div key={item} className="h-16 rounded-lg bg-[var(--gray-800)] flex items-center justify-center">
                          <span className="text-xs text-[var(--gray-500)]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </>
  );
}
