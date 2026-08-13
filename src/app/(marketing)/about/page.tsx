import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactCard from '@/components/ui/ContactCard';
import { STATS, formatToolCount } from '@/lib/constants/stats';
import { getDirectoryStats } from '@/lib/actions/tools';

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getDirectoryStats();
  const toolCount = formatToolCount(stats.count);
  return generateSEO({
    title: 'About One9Founders | India\'s Largest AI Ecosystem Navigator',
    description: `One9Founders is India's largest AI ecosystem navigator. ${toolCount} AI tools, agents, LLMs, and models. Security-first ratings with zero affiliate bias. AI training for colleges and corporates. Backed by IIT Bombay.`,
    path: '/about',
    keywords: ['about one9founders', 'Indian startup team', 'AI tool directory India', 'IIT Bombay startup', 'founder resources India', 'AI tools for Indian startups', 'AI training India', 'AI training for colleges'],
  });
}

export default async function AboutPage() {
  const stats = await getDirectoryStats();
  const toolCount = formatToolCount(stats.count);
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData({
              '@type': 'Organization',
              name: 'One9Founders',
              url: 'https://www.one9founders.com',
              logo: 'https://www.one9founders.com/logo-light.png',
              description: `India's largest AI ecosystem navigator. ${toolCount} AI tools, agents, LLMs, and models. Security-validated with zero affiliate bias. Backed by IIT Bombay.`,
              foundingDate: '2024',
              areaServed: ['India', 'Global'],
              knowsAbout: ['AI Tools', 'Startup Technology', 'Security Assessment', 'Tool Evaluation', 'AI Training'],
              founders: [
                { '@type': 'Person', name: 'Amit Bhartiya', jobTitle: 'CEO' },
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@one9founders.com',
                contactType: 'Customer Service',
              },
            })
          ),
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About One9Founders
          </h1>
          <p className="text-lg md:text-xl text-[var(--gray-300)] mb-10">
            India&apos;s Largest AI Ecosystem Navigator. Built for founders, colleges, and enterprises.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[var(--gray-900)] rounded-xl p-4 border border-[var(--gray-700)]">
              <p className="text-2xl md:text-3xl font-bold text-white">{toolCount}</p>
              <p className="text-sm text-[var(--gray-400)]">AI Resources</p>
            </div>
            <div className="bg-[var(--gray-900)] rounded-xl p-4 border border-[var(--gray-700)] flex flex-col items-center justify-center">
              <img src="/iitb-logo.png" alt="IIT Bombay" className="h-8 mb-1" draggable={false} />
              <p className="text-sm text-[var(--gray-400)]">Backed by IIT Bombay</p>
            </div>
            <div className="bg-[var(--gray-900)] rounded-xl p-4 border border-[var(--gray-700)] flex flex-col items-center justify-center">
              <svg className="w-8 h-8 text-purple-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-[var(--gray-400)]">Serving Founders Across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">The Problem We Solve</h2>
          <div className="space-y-6 text-[var(--gray-300)] text-lg leading-relaxed">
            <p>
              Every week, hundreds of new AI tools, models, and agents launch globally. Indian founders, students, and enterprise teams face the same problem: they don&apos;t know which tools are trustworthy, which models are affordable for Indian budgets, or how to build AI into their workflows without wasting months on trial and error.
            </p>
            <p>
              Most AI directories are simple aggregators. They list tools, take affiliate commissions, and rank based on who pays the most. Nobody was building an ecosystem navigator - something that organizes the entire AI landscape and makes it accessible with security validation, honest ratings, and zero affiliate bias.
            </p>
            <p className="text-white font-semibold text-xl">
              That&apos;s why we built One9Founders.
            </p>
          </div>
        </div>
      </section>

      {/* What We've Built */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What We&apos;ve Built</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x1F6E0;&#xFE0F;</span>
              <h3 className="text-xl font-bold text-white mb-3">{toolCount} AI Resources, Organized</h3>
              <p className="text-[var(--gray-300)]">
                AI tools, agents, LLMs, open-source models, RAG frameworks, startups, and research papers. Categorized by use case, filterable by pricing, comparable side-by-side. New listings are added as we ingest and review them.
              </p>
            </div>
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x1F512;</span>
              <h3 className="text-xl font-bold text-white mb-3">Security-First Validation</h3>
              <p className="text-[var(--gray-300)]">
                Tools we have fully assessed go through our{' '}
                <Link href="/methodology" className="text-purple-400 hover:text-purple-300 underline">10-point security assessment</Link>
                {' '}covering data privacy, encryption standards, compliance certifications, and third-party data sharing. Unassessed listings are labeled clearly.
              </p>
            </div>
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x1F9E0;</span>
              <h3 className="text-xl font-bold text-white mb-3">
                <Link href="/llms" className="hover:text-purple-300 transition-colors">LLM Explorer</Link>
              </h3>
              <p className="text-[var(--gray-300)]">
                {STATS.llmsCompared} language models compared on input/output pricing, Arena rankings, context windows, parameter counts, and India-affordability tags.
              </p>
            </div>
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x1F916;</span>
              <h3 className="text-xl font-bold text-white mb-3">
                <Link href="/agents" className="hover:text-purple-300 transition-colors">{STATS.aiAgents} AI Agents</Link>
              </h3>
              <p className="text-[var(--gray-300)]">
                A growing directory of autonomous AI agents organized by capability - from coding and marketing to sales and operations.
              </p>
            </div>
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x1F513;</span>
              <h3 className="text-xl font-bold text-white mb-3">{STATS.openSourceModels} Open Source Models</h3>
              <p className="text-[var(--gray-300)]">
                Self-hostable models sorted by downloads, parameters, and provider - for teams that want to run AI on their own infrastructure.
              </p>
            </div>
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x1F3AF;</span>
              <h3 className="text-xl font-bold text-white mb-3">Zero Affiliate Bias</h3>
              <p className="text-[var(--gray-300)]">
                We do not accept affiliate commissions from any tool in our directory. Rankings are based purely on our evaluation criteria. When we recommend a tool, it&apos;s because it scored well - not because someone paid us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Training for Colleges & Corporates */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">AI Training for Colleges &amp; Corporates</h2>
          <p className="text-[var(--gray-300)] text-lg mb-10">
            Organizing the AI ecosystem is only half of what we do. The other half is making sure people can actually use it.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div className="bg-[var(--gray-900)] rounded-xl p-8 border border-[var(--gray-700)]">
              <h3 className="text-xl font-bold text-white mb-4">For Colleges &amp; Universities</h3>
              <p className="text-[var(--gray-300)]">
                We offer structured AI training programs designed for Indian students. Our curriculum covers practical AI tool usage, from ChatGPT and Claude to Midjourney and coding assistants. Programs include hands-on labs, real-world projects, and IIT Bombay certificates. We work with institutions to customize batch sizes, timelines, and budgets.
              </p>
            </div>
            <div className="bg-[var(--gray-900)] rounded-xl p-8 border border-[var(--gray-700)]">
              <h3 className="text-xl font-bold text-white mb-4">For Corporates &amp; Enterprises</h3>
              <p className="text-[var(--gray-300)]">
                We help companies upskill their teams with AI. Custom workshops, automation implementation, and AI consulting tailored to specific business workflows. Whether your team needs to adopt AI for marketing, operations, or product development, we design programs that deliver measurable outcomes.
              </p>
            </div>
          </div>

          <div className="bg-[var(--gray-900)] rounded-xl p-8 border border-[var(--gray-700)] mb-10">
            <h3 className="text-xl font-bold text-white mb-4">For AI Startups</h3>
            <p className="text-[var(--gray-300)]">
              We offer premium listing and discovery services. If you&apos;ve built an AI tool, agent, or model, One9Founders helps you get discovered by the founders and enterprises who need what you&apos;ve built.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@one9founders.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white btn-primary"
            >
              Talk to Us
            </a>
            <Link
              href="/learn/organizations"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-purple-400 border border-purple-500/40 hover:bg-purple-500/10 transition-colors"
            >
              Learn More About Our Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Why Founders Trust Us */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Founders Trust Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x1F512;</span>
              <h3 className="text-xl font-bold text-white mb-3">Security Comes First</h3>
              <p className="text-[var(--gray-300)]">
                Tools we have fully assessed go through our 10-point security check. Data privacy, encryption, compliance, and third-party data sharing are evaluated systematically. Security is weighted at 20% of our total score — the single largest factor. Unassessed listings are labeled &ldquo;Security: Not Yet Assessed.&rdquo;
              </p>
            </div>
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x1F3AF;</span>
              <h3 className="text-xl font-bold text-white mb-3">No Affiliate Revenue</h3>
              <p className="text-[var(--gray-300)]">
                We don&apos;t earn money when you click on a tool or sign up. Our revenue comes from AI training programs and enterprise partnerships - not from influencing what you see.
              </p>
            </div>
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x2B50;</span>
              <h3 className="text-xl font-bold text-white mb-3">Uniform Rating Criteria</h3>
              <p className="text-[var(--gray-300)]">
                Every assessed tool is evaluated using the same framework covering security, functionality, ease of use, pricing, reliability, integrations, support, company stability, update frequency, and startup-friendliness. Listings we have not scored yet are labeled Not Yet Rated — never a placeholder number.
              </p>
            </div>
            <div className="bg-[var(--gray-800)] rounded-xl p-6 border border-[var(--gray-700)]">
              <span className="text-3xl mb-4 block">&#x1F3DB;&#xFE0F;</span>
              <h3 className="text-xl font-bold text-white mb-3">Academic Rigor</h3>
              <p className="text-[var(--gray-300)]">
                Backed by IIT Bombay with mentorship from Dr. Ramesh Kuruva at the Desai Sethi School of Entrepreneurship. Our evaluation methodology and training curriculum meet research-grade standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Mentor</h2>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-8 bg-[var(--gray-900)]">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src="https://i1.rgstatic.net/ii/profile.image/11431281220749348-1706592251827_Q512/Ramesh-Kuruva.jpg"
                    alt="Dr. Ramesh Kuruva"
                    className="w-72 h-72 rounded-3xl object-cover"
                  />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Dr. Ramesh Kuruva</h3>
                  <p className="text-brand-primary mb-4">Assistant Professor, Desai Sethi School of Entrepreneurship, IIT Bombay</p>
                  <div className="text-sm text-[var(--gray-400)] space-y-1">
                    <p>&bull; Co-founder &amp; Former CEO of YNOS Venture Engine</p>
                    <p>&bull; PhD in Entrepreneurial Finance from IIT Madras</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
          <div className="max-w-sm mx-auto">
            <ContactCard
              picture="https://4cqs2zpl07.ucarecd.net/fe69a771-5074-4a28-9bda-c17e8c526ac9/-/preview/"
              name="Amit Bhartiya"
              designation="CEO"
              email="amitbhartiya.o9f@gmail.com"
              linkedin="https://www.linkedin.com/in/amitbhartiya33/"
              phone="+917878469798"
            />
          </div>
        </div>
      </section>

      {/* What We're Building Next */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">What We&apos;re Building Next</h2>
          <p className="text-[var(--gray-300)] mb-8">We&apos;re not done. Here&apos;s what&apos;s coming:</p>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--gray-800)] border border-[var(--gray-700)]">
              <span className="text-2xl flex-shrink-0">&#x1F5C4;&#xFE0F;</span>
              <div>
                <h3 className="text-white font-semibold">RAG &amp; Vector DB Comparisons</h3>
                <p className="text-[var(--gray-400)] text-sm">For teams building retrieval-augmented systems.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--gray-800)] border border-[var(--gray-700)]">
              <span className="text-2xl flex-shrink-0">&#x1F680;</span>
              <div>
                <h3 className="text-white font-semibold">AI Startup Profiles</h3>
                <p className="text-[var(--gray-400)] text-sm">Discover Indian and global companies building with AI.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--gray-800)] border border-[var(--gray-700)]">
              <span className="text-2xl flex-shrink-0">&#x1F4C4;</span>
              <div>
                <h3 className="text-white font-semibold">Research &amp; Papers Hub</h3>
                <p className="text-[var(--gray-400)] text-sm">Stay current with the latest AI research, curated for practitioners.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--gray-800)] border border-[var(--gray-700)]">
              <span className="text-2xl flex-shrink-0">&#x1F50D;</span>
              <div>
                <h3 className="text-white font-semibold">Deeper Security Scoring</h3>
                <p className="text-[var(--gray-400)] text-sm">Expanding our 10-point framework with automated monitoring.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--gray-800)] border border-[var(--gray-700)]">
              <span className="text-2xl flex-shrink-0">&#x1F5FA;&#xFE0F;</span>
              <div>
                <h3 className="text-white font-semibold">Regional AI Ecosystem Maps</h3>
                <p className="text-[var(--gray-400)] text-sm">Mapping the AI landscape city by city across India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[var(--gray-900)] rounded-xl p-6 border border-[var(--gray-700)] text-center">
              <h3 className="text-lg font-bold text-white mb-3">For Colleges &amp; Universities</h3>
              <Link
                href="/learn/organizations#college-form"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-sm text-white btn-primary"
              >
                Contact Us
              </Link>
            </div>
            <div className="bg-[var(--gray-900)] rounded-xl p-6 border border-[var(--gray-700)] text-center">
              <h3 className="text-lg font-bold text-white mb-3">For Corporates &amp; Enterprises</h3>
              <Link
                href="/learn/organizations#corporate-form"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-sm text-white btn-primary"
              >
                Contact Us
              </Link>
            </div>
            <div className="bg-[var(--gray-900)] rounded-xl p-6 border border-[var(--gray-700)] text-center">
              <h3 className="text-lg font-bold text-white mb-3">For AI Startups</h3>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-sm text-white btn-primary"
              >
                Submit Your Tool
              </Link>
            </div>
          </div>
          <p className="text-center text-[var(--gray-400)]">
            General inquiries:{' '}
            <a href="mailto:hello@one9founders.com" className="text-purple-400 hover:text-purple-300 underline">
              hello@one9founders.com
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
