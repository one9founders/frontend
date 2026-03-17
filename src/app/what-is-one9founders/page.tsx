import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'What is One9Founders? | AI Tool Directory for Startup Founders',
  description: 'One9Founders is an AI-powered platform built for startup founders to discover, compare, and use the best AI tools for building and scaling startups. Learn about our mission and how One9Founders helps founders worldwide.',
  path: '/what-is-one9founders',
  keywords: ['One9Founders', 'AI tool directory', 'startup founders', 'AI tools for startups', 'compare AI tools', 'founder resources'],
});

export default function WhatIsOne9FoundersPage() {
  const organizationSchema = generateStructuredData({
    '@type': 'Organization',
    name: 'One9Founders',
    url: 'https://one9founders.com',
    logo: 'https://one9founders.com/logo-light.png',
    description: 'One9Founders is an AI-powered platform built for startup founders to discover, compare, and use the best AI tools for building and scaling startups.',
    foundingDate: '2024',
    areaServed: ['India', 'Global'],
    knowsAbout: ['AI Tools', 'Startup Technology', 'Security Assessment', 'Tool Evaluation'],
    sameAs: [
      'https://twitter.com/one9founders',
      'https://linkedin.com/company/one9founders',
      'https://instagram.com/one9founders',
    ],
  });

  const webPageSchema = generateStructuredData({
    '@type': 'WebPage',
    name: 'What is One9Founders?',
    description: 'Learn about One9Founders, the AI-powered platform for startup founders to discover and compare AI tools.',
    url: 'https://one9founders.com/what-is-one9founders',
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          What is One9Founders?
        </h1>

        {/* Brand Definition */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8">
            <p className="text-xl text-white leading-relaxed">
              <strong>One9Founders</strong> is an AI-powered platform built for startup founders to discover, compare, and use the best AI tools for building and scaling startups.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            The One9Founders Mission
          </h2>
          <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-8">
            <p className="text-[var(--gray-300)] text-lg leading-relaxed mb-4">
              One9Founders was created with a simple but powerful mission: to help startup founders navigate the overwhelming landscape of AI tools. With thousands of AI tools launching every month, founders need a trusted resource to cut through the noise and find tools that actually work for their specific needs.
            </p>
            <p className="text-[var(--gray-300)] text-lg leading-relaxed">
              Unlike other directories that rely on affiliate commissions or popularity metrics, One9Founders evaluates every tool using a uniform, security-first methodology. This means founders can trust that our recommendations are based on genuine quality, not financial incentives.
            </p>
          </div>
        </section>

        {/* Who Uses One9Founders */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Who Uses One9Founders?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">First-Time Founders</h3>
              <p className="text-[var(--gray-400)]">
                Entrepreneurs launching their first startup use One9Founders to discover essential AI tools for productivity, marketing, development, and operations without wasting time on trial and error.
              </p>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Serial Entrepreneurs</h3>
              <p className="text-[var(--gray-400)]">
                Experienced founders rely on One9Founders to stay updated on the latest AI tools and compare alternatives to their current tech stack.
              </p>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Startup Teams</h3>
              <p className="text-[var(--gray-400)]">
                Product managers, CTOs, and team leads use One9Founders to evaluate and compare AI tools before making purchasing decisions for their organizations.
              </p>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Global Founders</h3>
              <p className="text-[var(--gray-400)]">
                Whether you&apos;re building in Bangalore, Mumbai, San Francisco, or anywhere else in the world, One9Founders helps you find the right AI tools for your market and use case.
              </p>
            </div>
          </div>
        </section>

        {/* What Makes One9Founders Different */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            What Makes One9Founders Different?
          </h2>
          <div className="space-y-6">
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security-First Approach
              </h3>
              <p className="text-[var(--gray-400)]">
                One9Founders prioritizes security in every evaluation. Every tool in our directory undergoes a 10-point security assessment covering data privacy, encryption, compliance, and third-party data sharing practices.
              </p>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Zero Affiliate Bias
              </h3>
              <p className="text-[var(--gray-400)]">
                One9Founders does not accept affiliate commissions from any tool in our directory. When we recommend a tool, it&apos;s because it genuinely scored well in our evaluation - not because we earn money when you click.
              </p>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Uniform Rating Criteria
              </h3>
              <p className="text-[var(--gray-400)]">
                Every tool on One9Founders is evaluated using the same 10-point framework, ensuring fair comparisons across categories. Our criteria cover security, functionality, ease of use, pricing, reliability, integrations, support, stability, updates, and startup-friendliness.
              </p>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                IIT Bombay Backed
              </h3>
              <p className="text-[var(--gray-400)]">
                One9Founders is backed by IIT Bombay, one of India&apos;s premier technology institutions. This partnership ensures that our platform maintains the highest standards of technical excellence and credibility.
              </p>
            </div>
          </div>
        </section>

        {/* One9Founders by the Numbers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            One9Founders by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6 text-center">
              <span className="block text-3xl md:text-4xl font-bold text-purple-400">2,500+</span>
              <span className="text-sm text-[var(--gray-400)]">Tools Tested</span>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6 text-center">
              <span className="block text-3xl md:text-4xl font-bold text-purple-400">10-Point</span>
              <span className="text-sm text-[var(--gray-400)]">Security Check</span>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6 text-center">
              <span className="block text-3xl md:text-4xl font-bold text-purple-400">0%</span>
              <span className="text-sm text-[var(--gray-400)]">Affiliate Bias</span>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6 text-center">
              <span className="block text-3xl md:text-4xl font-bold text-purple-400">9</span>
              <span className="text-sm text-[var(--gray-400)]">Categories</span>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Discovering AI Tools with One9Founders
          </h2>
          <p className="text-[var(--gray-400)] mb-6 max-w-2xl mx-auto">
            Join thousands of founders who trust One9Founders to find the best AI tools for their startups. Browse our directory, compare tools side-by-side, and make informed decisions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#tools-section" className="btn-primary">
              Explore Tools
            </Link>
            <Link href="/methodology" className="btn-secondary px-6 py-3">
              How We Rate Tools
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
