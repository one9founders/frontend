'use client';

import Link from 'next/link';
import type { LandingPage, ContentBlock } from '@/types/education';
import CourseCard from './CourseCard';
import InquiryForm from './InquiryForm';

interface LandingPageContentProps {
  page: LandingPage;
  pageType: string;
}

export default function LandingPageContent({ page, pageType }: LandingPageContentProps) {
  return (
    <>
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {page.hero_title}
          </h1>
          <p className="text-xl text-[var(--gray-300)] mb-8 max-w-2xl mx-auto">
            {page.hero_subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#inquiry-form" className="btn-primary px-6 py-3">
              {page.hero_cta_text || 'Get Started'}
            </a>
            <Link href="/learn/courses" className="btn-secondary px-6 py-3">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Pitch Section */}
      {page.pitch_title && (
        <section className="py-16 px-6 bg-[var(--gray-900)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">{page.pitch_title}</h2>
            <div className="text-[var(--gray-300)] leading-relaxed prose prose-invert max-w-none">
              {page.pitch_content.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Blocks */}
      {page.content_blocks && page.content_blocks.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.content_blocks.map((block: ContentBlock, index: number) => (
                <div
                  key={index}
                  className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6"
                >
                  {block.icon && (
                    <div className="w-12 h-12 rounded-lg bg-copper/10 flex items-center justify-center mb-4">
                      <span className="text-2xl">{block.icon}</span>
                    </div>
                  )}
                  {block.title && (
                    <h3 className="text-lg font-bold text-white mb-2">{block.title}</h3>
                  )}
                  {block.content && (
                    <p className="text-sm text-[var(--gray-400)]">{block.content}</p>
                  )}
                  {block.items && block.items.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {block.items.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--gray-400)]">
                          <svg className="w-4 h-4 text-copper flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses */}
      {page.featured_courses && page.featured_courses.length > 0 && (
        <section className="py-16 px-6 bg-[var(--gray-900)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Recommended Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.featured_courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry Form */}
      <section id="inquiry-form" className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <InquiryForm
            sourcePage={`/learn/${pageType}`}
            title="Get Started"
            subtitle="Fill out the form below and we'll get back to you within 24 hours with enrollment details."
          />
        </div>
      </section>
    </>
  );
}
