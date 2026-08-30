import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Image from 'next/image';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { educationAPI } from '@/lib/api/apiClient';
import OrganizationInquiryForm from '@/components/features/education/OrganizationInquiryForm';
import type { LandingPage } from '@/types/education';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page: LandingPage | null = await educationAPI.getLandingPage('organizations');
  if (!page) {
    return generateSEO({
      title: 'AI Training for Colleges & Corporates',
      description: 'Custom AI training programs for colleges and corporates. Supported by IIT Bombay.',
      path: '/learn/organizations',
    });
  }
  return generateSEO({
    title: page.meta_title || page.hero_title || 'AI Training for Organizations',
    description: page.meta_description || page.hero_subtitle || 'Custom AI training programs.',
    path: '/learn/organizations',
    keywords: ['AI training colleges', 'corporate AI training', 'campus AI program', 'IIT Bombay', 'organization training'],
  });
}

export default async function OrganizationsPage() {
  let page: LandingPage | null = null;
  try {
    page = await educationAPI.getLandingPage('organizations');
  } catch {
    // Graceful fallback
  }

  const heroTitle = page?.hero_title || 'Bring AI Training to Your Campus or Organization';
  const heroSubtitle = page?.hero_subtitle || 'Custom programs for colleges and corporates. Supported by IIT Bombay.';
  const pitchTitle = page?.pitch_title || '';
  const pitchContent = page?.pitch_content || '';
  const contentBlocks = page?.content_blocks || [];

  const structuredData = generateStructuredData({
    '@type': 'WebPage',
    name: heroTitle,
    description: heroSubtitle,
    url: 'https://www.one9founders.com/learn/organizations',
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
          { name: 'Organizations', path: '/learn/organizations' },
        ]}
      />

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--gray-900)] border border-[var(--gray-700)] px-4 py-2 rounded-full mb-6">
            <Image src="/iitb-logo.png" alt="IIT Bombay" width={24} height={24} className="rounded-sm" />
            <span className="text-sm text-[var(--gray-300)]">Supported by IIT Bombay</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">{heroTitle}</h1>
          <p className="text-xl text-[var(--gray-300)] mb-8 max-w-2xl mx-auto">{heroSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#college-form" className="btn-primary px-6 py-3">For Colleges</a>
            <a href="#corporate-form" className="btn-secondary px-6 py-3">For Corporates</a>
          </div>
        </div>
      </section>

      {/* Pitch Section */}
      {pitchTitle && (
        <section className="py-16 px-6 bg-[var(--gray-900)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">{pitchTitle}</h2>
            <div className="text-[var(--gray-300)] leading-relaxed">
              {pitchContent.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Blocks */}
      {contentBlocks.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentBlocks.map((block, index) => (
                <div key={index} className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6">
                  {block.icon && (
                    <div className="w-12 h-12 rounded-lg bg-copper/10 flex items-center justify-center mb-4">
                      <span className="text-2xl">{block.icon}</span>
                    </div>
                  )}
                  {block.title && <h3 className="text-lg font-bold text-white mb-2">{block.title}</h3>}
                  {block.content && <p className="text-sm text-[var(--gray-400)]">{block.content}</p>}
                  {block.items && block.items.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {block.items.map((item, i) => (
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

      {/* Features */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-800)] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-copper/10">
                <svg className="w-6 h-6 text-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Custom Programs</h3>
              <p className="text-sm text-[var(--gray-400)]">Tailored curriculum based on your team&apos;s needs and goals.</p>
            </div>
            <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-800)] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-500/10">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">IIT Bombay Certificates</h3>
              <p className="text-sm text-[var(--gray-400)]">Certificate issued through IIT Bombay Educational Outreach.</p>
            </div>
            <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-800)] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-500/10">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dedicated Support</h3>
              <p className="text-sm text-[var(--gray-400)]">Priority support and custom content for your organization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Contact Us for Custom Pricing</h2>
          <p className="text-[var(--gray-400)] mb-8 max-w-2xl mx-auto">
            Every organization is different. We&apos;ll design a program that fits your batch size, timeline, and budget.
          </p>
        </div>
      </section>

      {/* College Form */}
      <section id="college-form" className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-2xl mx-auto">
          <OrganizationInquiryForm
            inquiryType="college"
            title="For Colleges & Universities"
            subtitle="Bring AI training to your campus. Contact us for custom pricing."
          />
        </div>
      </section>

      {/* Corporate Form */}
      <section id="corporate-form" className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <OrganizationInquiryForm
            inquiryType="corporate"
            title="For Corporates & Companies"
            subtitle="Upskill your team with AI. Contact us for custom pricing."
          />
        </div>
      </section>
    </>
  );
}
