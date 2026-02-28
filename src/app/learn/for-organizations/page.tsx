import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const metadata: Metadata = generateSEO({
  title: 'AI Training for Organizations',
  description: 'Custom AI tool training programs for teams and organizations. Team dashboards, progress tracking, and dedicated support.',
  path: '/learn/for-organizations',
  keywords: ['AI training for teams', 'enterprise AI training', 'organization AI education', 'team AI upskilling', 'corporate AI tools'],
});

export default function ForOrganizationsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'For Organizations', path: '/learn/for-organizations' },
        ]}
      />

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">For Organizations</h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            Custom training programs, team dashboards, progress tracking, and dedicated support for organizations.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-purple-500/10">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Team Training</h3>
              <p className="text-sm text-[var(--gray-400)]">
                Customized learning programs for your entire team.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-500/10">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Progress Tracking</h3>
              <p className="text-sm text-[var(--gray-400)]">
                Dashboards to monitor team progress and skill development.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-500/10">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dedicated Support</h3>
              <p className="text-sm text-[var(--gray-400)]">
                Priority support and custom content for your organization.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-16 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
            <svg className="w-16 h-16 mx-auto mb-6 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-3">Enterprise Programs Coming Soon</h2>
            <p className="text-[var(--gray-400)] max-w-md mx-auto mb-6">
              We&apos;re building tailored AI training programs for organizations. Contact us to learn more or get early access.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:amitbhartiya.o9f@gmail.com?subject=Organization Training Inquiry"
                className="btn-primary px-6 py-3"
              >
                Contact Us
              </a>
              <Link href="/learn" className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-2 px-6 py-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Education Hub
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
