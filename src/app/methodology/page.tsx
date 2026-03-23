import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { STATS } from '@/lib/constants/stats';

export const metadata: Metadata = generateSEO({
  title: 'How We Rate AI Tools | 10-Point Security Framework | One9Founders',
  description: `Our transparent 10-point framework rates ${STATS.totalResources} AI tools on security, pricing, features, and more. Zero affiliate bias. See how we score every tool.`,
  path: '/methodology',
  keywords: ['AI tool rating', 'tool evaluation methodology', 'security assessment', 'unbiased reviews', 'AI tool criteria', 'LLM evaluation'],
});

const criteria = [
  {
    number: 1,
    title: 'Security & Data Privacy',
    weight: '20 points',
    description: 'The most heavily weighted factor in our assessment.',
    items: [
      'Data encryption standards (at rest and in transit)',
      'Privacy policy clarity and GDPR/CCPA compliance',
      'Data retention and deletion policies',
      'Third-party data sharing practices',
      'Security certifications (SOC 2, ISO 27001, etc.)',
      'Whether user data is used for model training',
    ],
  },
  {
    number: 2,
    title: 'Functionality & Features',
    weight: '15 points',
    description: null,
    items: [
      'Core feature completeness for stated use case',
      'Feature depth compared to category competitors',
      'Unique capabilities or innovations',
      'API availability and documentation quality',
    ],
  },
  {
    number: 3,
    title: 'Ease of Use',
    weight: '15 points',
    description: null,
    items: [
      'Onboarding experience (time to first value)',
      'Interface intuitiveness',
      'Learning curve for new users',
      'Documentation and tutorial quality',
    ],
  },
  {
    number: 4,
    title: 'Pricing & Value',
    weight: '15 points',
    description: null,
    items: [
      'Free tier availability and practical limits',
      'Pricing transparency (no hidden fees)',
      'Value compared to alternatives in category',
      'Startup-friendly pricing options',
    ],
  },
  {
    number: 5,
    title: 'Reliability & Performance',
    weight: '10 points',
    description: null,
    items: [
      'Uptime track record',
      'Response speed and latency',
      'Output quality consistency',
      'Error handling and recovery',
    ],
  },
  {
    number: 6,
    title: 'Integration Capabilities',
    weight: '10 points',
    description: null,
    items: [
      'Native integrations with popular tools',
      'Zapier/Make/n8n compatibility',
      'API robustness and rate limits',
      'Webhook and automation support',
    ],
  },
  {
    number: 7,
    title: 'Customer Support',
    weight: '5 points',
    description: null,
    items: [
      'Support channels available (chat, email, phone)',
      'Response time in our testing',
      'Knowledge base and self-service quality',
    ],
  },
  {
    number: 8,
    title: 'Company Stability',
    weight: '5 points',
    description: null,
    items: [
      'Funding status and runway',
      'Team size and growth trajectory',
      'Market presence and reputation',
    ],
  },
  {
    number: 9,
    title: 'Update Frequency',
    weight: '3 points',
    description: null,
    items: [
      'Feature release cadence',
      'Bug fix responsiveness',
      'Roadmap transparency',
    ],
  },
  {
    number: 10,
    title: 'Startup-Friendliness',
    weight: '2 points',
    description: null,
    items: [
      'Startup program or discounts available',
      'Scalable pricing as you grow',
      'Features tailored for small teams',
    ],
  },
];

const processSteps = [
  {
    title: 'Initial Screening',
    description: 'We verify the tool is legitimate, actively maintained, and relevant to startup use cases.',
  },
  {
    title: 'Security Assessment',
    description: 'Our team reviews privacy policies, checks for security certifications, and evaluates data handling practices.',
  },
  {
    title: 'Hands-On Testing',
    description: 'We create accounts and test core functionality for a minimum of 7 days across real use cases.',
  },
  {
    title: 'Comparative Analysis',
    description: 'We benchmark against similar tools in the same category.',
  },
  {
    title: 'Score Calculation',
    description: 'We apply our weighted criteria to generate the final rating.',
  },
  {
    title: 'Ongoing Monitoring',
    description: 'We re-evaluate tools quarterly and immediately after major updates or security incidents.',
  },
];

export default function MethodologyPage() {
  const structuredData = generateStructuredData({
    '@type': 'WebPage',
    name: 'How We Rate AI Tools - One9Founders Methodology',
    description: 'Our transparent 10-point evaluation framework for rating AI tools.',
    url: 'https://www.one9founders.com/methodology',
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          How We Rate AI Tools
        </h1>

        {/* Introduction */}
        <section className="mb-16">
          <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-8">
            <p className="text-[var(--gray-300)] text-lg leading-relaxed mb-4">
              One9Founders uses a uniform, transparent methodology to evaluate every AI tool
              in our directory. Unlike other directories that rely on affiliate relationships
              or popularity metrics alone, we apply consistent criteria across all tools.
            </p>
            <p className="text-white font-semibold text-lg">
              Our commitment: Zero affiliate bias. Every tool rated the same way. Security first.
            </p>
          </div>
        </section>

        {/* Rating Framework */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Our 10-Point Evaluation Framework
          </h2>

          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div
                key={criterion.number}
                className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {criterion.number}. {criterion.title}
                  </h3>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium">
                    {criterion.weight}
                  </span>
                </div>
                {criterion.description && (
                  <p className="text-[var(--gray-400)] mb-4">{criterion.description}</p>
                )}
                <ul className="space-y-2">
                  {criterion.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-[var(--gray-300)]">
                      <svg
                        className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Testing Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Our Testing Process</h2>

          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-[var(--gray-400)]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Zero Affiliate Bias */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Our Zero Affiliate Bias Commitment
          </h2>

          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8">
            <p className="text-[var(--gray-300)] text-lg leading-relaxed mb-4">
              One9Founders does not accept affiliate commissions from any tool listed
              in our directory. Our revenue comes from optional premium listings and
              enterprise partnerships - never from influencing which tools rank higher.
            </p>
            <p className="text-white text-lg leading-relaxed">
              This means when we recommend a tool, it&apos;s because it genuinely scored
              well in our evaluation - not because we earn money when you click.
            </p>
          </div>
        </section>

        {/* LLM Evaluation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">How We Evaluate LLMs</h2>
          <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-8">
            <p className="text-[var(--gray-300)] text-lg leading-relaxed mb-6">
              Our LLM Explorer tracks 177 models across multiple dimensions. Unlike tool ratings, LLM data is sourced from public benchmarks and provider documentation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">What We Track</h3>
                <ul className="space-y-2">
                  {[
                    'Arena Elo rankings (from Chatbot Arena)',
                    'Input & output pricing (USD and INR)',
                    'Context window size',
                    'Provider and model family',
                    'Open-source vs proprietary license',
                    'India-affordable pricing tags',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--gray-300)]">
                      <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Data Sources</h3>
                <ul className="space-y-2">
                  {[
                    'LMSYS Chatbot Arena leaderboard',
                    'Official provider pricing pages',
                    'Model documentation and release notes',
                    'Community benchmarks and evaluations',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--gray-300)]">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--gray-700)]">
              <p className="text-[var(--gray-400)]">
                LLM data is updated as providers release new models or change pricing. Visit our{' '}
                <Link href="/llms" className="text-purple-400 hover:text-purple-300 underline">LLM Explorer</Link>{' '}
                to compare all 177 models.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Questions About Our Methodology?
          </h2>
          <p className="text-[var(--gray-400)] mb-6">
            We believe in transparency. If you have questions about how we rate tools
            or want to report an error in our assessment, reach out to us.
          </p>
          <a
            href="mailto:hello@one9founders.com"
            className="inline-block btn-primary"
          >
            Contact Us
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
