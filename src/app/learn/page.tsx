import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

export const metadata: Metadata = generateSEO({
  title: 'Education Hub - Learn AI Tools for Startups',
  description: 'Master AI tools for your startup. Guides, hands-on labs, workshops, courses, and learning paths curated for founders by One9Founders.',
  path: '/learn',
  keywords: ['AI tools education', 'startup learning', 'AI guides for founders', 'AI workshops', 'hands-on AI labs', 'founder courses'],
});

const learningPaths = [
  {
    title: 'AI Foundations',
    description: 'Start here. Understand AI fundamentals and how they apply to your startup.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    href: '/learn/paths',
    color: 'from-blue-500/20 to-blue-600/5',
    borderColor: 'border-blue-500/30',
    tagColor: 'text-blue-400',
    tag: 'Beginner',
  },
  {
    title: 'Growth & Automation',
    description: 'Learn to automate workflows and scale your startup with the right AI tools.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    href: '/learn/paths',
    color: 'from-purple-500/20 to-purple-600/5',
    borderColor: 'border-purple-500/30',
    tagColor: 'text-purple-400',
    tag: 'Intermediate',
  },
  {
    title: 'Security & Compliance',
    description: 'Evaluate AI tool security, understand data privacy, and stay compliant.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    href: '/learn/paths',
    color: 'from-green-500/20 to-green-600/5',
    borderColor: 'border-green-500/30',
    tagColor: 'text-green-400',
    tag: 'All Levels',
  },
  {
    title: 'AI Product Building',
    description: 'Build AI-powered products. From ideation to launch using modern AI tools.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    href: '/learn/paths',
    color: 'from-orange-500/20 to-orange-600/5',
    borderColor: 'border-orange-500/30',
    tagColor: 'text-orange-400',
    tag: 'Advanced',
  },
];

const navSections = [
  {
    title: 'Guides',
    description: 'Step-by-step tutorials on using AI tools effectively.',
    href: '/learn/guides',
    count: 'Coming soon',
  },
  {
    title: 'Hands-On Labs',
    description: 'Interactive exercises to build real skills with AI tools.',
    href: '/learn/labs',
    count: 'Coming soon',
  },
  {
    title: 'Workshops',
    description: 'Live and recorded sessions led by industry experts.',
    href: '/learn/workshops',
    count: 'Coming soon',
  },
  {
    title: 'Courses',
    description: 'Structured multi-lesson programs for deep learning.',
    href: '/learn/courses',
    count: 'Coming soon',
  },
  {
    title: 'Learning Paths',
    description: 'Curated sequences of content for specific goals.',
    href: '/learn/paths',
    count: 'Coming soon',
  },
  {
    title: 'For Organizations',
    description: 'Team training, custom programs, and enterprise solutions.',
    href: '/learn/for-organizations',
    count: 'Coming soon',
  },
];

export default function LearnPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Education Hub
          </span>
          <h1 className="text-5xl font-bold text-white mb-6">
            Master AI Tools for Your Startup
          </h1>
          <p className="text-xl text-[var(--gray-300)] mb-8 max-w-2xl mx-auto">
            Guides, hands-on labs, workshops, and structured learning paths - everything you need to leverage AI tools effectively as a founder.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/learn/guides" className="btn-primary px-6 py-3">
              Browse Guides
            </Link>
            <Link href="/learn/paths" className="btn-secondary px-6 py-3">
              View Learning Paths
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Learning Paths</h2>
            <p className="text-[var(--gray-400)] max-w-2xl mx-auto">
              Structured journeys designed to take you from beginner to expert in key areas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningPaths.map((path) => (
              <Link
                key={path.title}
                href={path.href}
                className={`group block p-6 rounded-xl border bg-gradient-to-br ${path.color} ${path.borderColor} hover:border-opacity-60 transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--gray-800)]">
                    {path.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {path.title}
                      </h3>
                      <span className={`text-xs font-medium ${path.tagColor}`}>
                        {path.tag}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--gray-400)]">
                      {path.description}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-[var(--gray-600)] group-hover:text-white transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides Placeholder */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Guides</h2>
              <p className="text-[var(--gray-400)]">
                In-depth tutorials to help you get the most out of AI tools.
              </p>
            </div>
            <Link
              href="/learn/guides"
              className="hidden sm:inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              View all guides
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-800)] p-6 flex flex-col"
              >
                <div className="w-full h-40 rounded-lg bg-[var(--gray-700)] mb-4 flex items-center justify-center">
                  <span className="text-[var(--gray-500)] text-sm">Guide thumbnail</span>
                </div>
                <div className="h-4 w-20 rounded bg-[var(--gray-700)] mb-3" />
                <div className="h-6 w-full rounded bg-[var(--gray-700)] mb-2" />
                <div className="h-4 w-3/4 rounded bg-[var(--gray-700)] mb-4" />
                <div className="mt-auto h-4 w-24 rounded bg-[var(--gray-700)]" />
              </div>
            ))}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link
              href="/learn/guides"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              View all guides
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Workshops Placeholder */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Upcoming Workshops</h2>
              <p className="text-[var(--gray-400)]">
                Live sessions with industry experts. Learn, ask questions, and network.
              </p>
            </div>
            <Link
              href="/learn/workshops"
              className="hidden sm:inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              All workshops
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--gray-700)] flex items-center justify-center">
                    <span className="text-[var(--gray-500)] text-xs">Date</span>
                  </div>
                  <div>
                    <div className="h-5 w-48 rounded bg-[var(--gray-700)] mb-1" />
                    <div className="h-3 w-32 rounded bg-[var(--gray-700)]" />
                  </div>
                </div>
                <div className="h-4 w-full rounded bg-[var(--gray-700)] mb-2" />
                <div className="h-4 w-2/3 rounded bg-[var(--gray-700)] mb-4" />
                <div className="flex items-center gap-3">
                  <div className="h-8 w-24 rounded-lg bg-[var(--gray-700)]" />
                  <span className="text-xs text-[var(--gray-500)]">Registration opens soon</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link
              href="/learn/workshops"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              All workshops
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Hands-On Labs Placeholder */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Hands-On Labs</h2>
              <p className="text-[var(--gray-400)]">
                Interactive, project-based exercises to build real skills with AI tools.
              </p>
            </div>
            <Link
              href="/learn/labs"
              className="hidden sm:inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              Explore labs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-800)] p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--gray-700)] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="h-4 w-16 rounded bg-[var(--gray-700)]" />
                </div>
                <div className="h-5 w-full rounded bg-[var(--gray-700)] mb-2" />
                <div className="h-4 w-5/6 rounded bg-[var(--gray-700)] mb-4" />
                <div className="flex items-center gap-2">
                  <div className="h-3 w-16 rounded bg-[var(--gray-700)]" />
                  <div className="h-3 w-12 rounded bg-[var(--gray-700)]" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link
              href="/learn/labs"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              Explore labs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* For Organizations Preview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-[var(--gray-700)] bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  For Teams
                </span>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Train Your Entire Team on AI Tools
                </h2>
                <p className="text-[var(--gray-300)] mb-6">
                  Custom training programs, team dashboards, progress tracking, and dedicated support for organizations looking to upskill their teams on AI.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/learn/for-organizations" className="btn-primary px-6 py-3">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="w-full max-w-sm rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--gray-700)]" />
                      <div>
                        <div className="h-4 w-32 rounded bg-[var(--gray-700)] mb-1" />
                        <div className="h-3 w-20 rounded bg-[var(--gray-700)]" />
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--gray-800)]">
                      <div className="h-2 w-3/4 rounded-full bg-purple-500/50" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-lg bg-[var(--gray-800)]" />
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
