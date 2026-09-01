import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { STATS, formatToolCount } from '@/lib/constants/stats';
import { fetchDirectoryStats } from '@/lib/api/toolsStats';

export const metadata: Metadata = generateSEO({
  title: 'How We Rate AI Tools',
  description: `We score published posture on seven evidence-backed criteria, each citing a source URL. Ease of use, reliability, and hands-on security testing are not automated. Zero affiliate bias.`,
  path: '/methodology',
  keywords: ['AI tool rating', 'tool evaluation methodology', 'security assessment', 'unbiased reviews', 'AI tool criteria', 'LLM evaluation', 'AI research papers'],
});

const criteria = [
  {
    number: 1,
    title: 'Security & Data Privacy',
    weight: 'Automated',
    description: 'Published posture only. We do not test anyone\'s controls.',
    items: [
      'Encryption in transit (HTTPS on the live site)',
      'A reachable privacy policy',
      'Stated compliance commitments such as SOC 2, GDPR, or a DPA',
      'Stated data retention or training-data commitments, when published',
    ],
  },
  {
    number: 2,
    title: 'Functionality & Features',
    weight: 'Automated',
    description: null,
    items: [
      'What the product or features page actually lists',
      'Stated capabilities compared with the tool\'s own positioning',
      'API or product surface mentioned on the site',
    ],
  },
  {
    number: 3,
    title: 'Ease of Use',
    weight: 'Hands-on',
    description: 'Not automated. Needs a person using the product.',
    items: [
      'Onboarding experience (time to first value)',
      'Interface intuitiveness',
      'Learning curve for new users',
      'Documentation and tutorial quality in actual use',
    ],
  },
  {
    number: 4,
    title: 'Pricing & Value',
    weight: 'Automated',
    description: null,
    items: [
      'A reachable pricing or plans page',
      'Free tier or trial, when published',
      'Whether prices are listed rather than "contact sales" only',
    ],
  },
  {
    number: 5,
    title: 'Reliability & Performance',
    weight: 'Hands-on',
    description: 'Not automated. Needs a person using the product.',
    items: [
      'Uptime in actual use',
      'Response speed and latency',
      'Output quality consistency',
      'Error handling and recovery',
    ],
  },
  {
    number: 6,
    title: 'Integration Capabilities',
    weight: 'Automated',
    description: null,
    items: [
      'An integrations, apps, or marketplace page',
      'Named connectors published by the vendor',
      'API or webhook mentions on the site',
    ],
  },
  {
    number: 7,
    title: 'Customer Support',
    weight: 'Automated',
    description: null,
    items: [
      'A support, contact, help, or docs URL that resolves',
      'Stated support channels on that page',
    ],
  },
  {
    number: 8,
    title: 'Company Stability',
    weight: 'Automated',
    description: null,
    items: [
      'What the vendor publishes about the company, team, or funding',
      'For open-source rows: whether the repository is archived',
    ],
  },
  {
    number: 9,
    title: 'Update Frequency',
    weight: 'Automated',
    description: null,
    items: [
      'A changelog, releases, or what\'s-new page',
      'For open-source rows: last commit date',
    ],
  },
  {
    number: 10,
    title: 'Startup-Friendliness',
    weight: 'Automated',
    description: null,
    items: [
      'Free tier, student, or startup programme pages',
      'Published credits or small-team pricing',
    ],
  },
];

const processSteps = [
  {
    title: 'Resolve the live site',
    description: 'We follow redirects and record whether the final URL is served over HTTPS. A dead or parked site is not scored.',
  },
  {
    title: 'Collect published evidence',
    description: 'We fetch a small set of pages from the tool\'s own domain — privacy, pricing, integrations, docs, changelog, and the homepage. Open-source rows use GitHub facts (licence, last commit, archived) instead. Each page is truncated; we do not crawl the whole site. We read the HTML we are served, so a client-rendered app may yield thin text — the URL still has to exist to be cited.',
  },
  {
    title: 'Score only what the pages support',
    description: 'A model reads those pages and scores a criterion only when it can cite one of the fetched URLs. No citation, no score. Guessing is discarded.',
  },
  {
    title: 'Leave the rest unassessed',
    description: 'Ease of Use, Reliability & Performance, and the hands-on half of Security stay null until a person uses the product. Absence is labelled, not filled in.',
  },
  {
    title: 'Hands-on testing (Rated only)',
    description: 'A listing becomes Rated only after someone on the team has actually used it and scored the two hands-on criteria. That list starts small on purpose.',
  },
  {
    title: 'Refresh on a schedule',
    description: 'The automated pass is re-run so evidence URLs and scores can move when a vendor publishes a privacy policy or a changelog. It is not a quarterly recertification of every listing.',
  },
];

export default async function MethodologyPage() {
  const stats = await fetchDirectoryStats();
  const toolCount = formatToolCount(stats?.total_tools);
  const assessedCount =
    stats?.fully_assessed_count != null
      ? stats.fully_assessed_count.toLocaleString('en-US')
      : null;
  const provisionalCount =
    stats?.provisionally_assessed_count != null
      ? stats.provisionally_assessed_count.toLocaleString('en-US')
      : null;

  const structuredData = generateStructuredData({
    '@type': 'WebPage',
    name: 'How We Rate AI Tools - One9Founders Methodology',
    description: 'Our transparent 10-point evaluation framework for rating AI tools.',
    url: 'https://www.one9founders.com/methodology',
  });

  const faqSchema = generateStructuredData({
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does One9Founders rate AI tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We score published posture on ten evidence-backed criteria. Each scored criterion cites a source URL. Ease of use, reliability, and hands-on security testing are not automated.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does Not Yet Rated mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fewer than 6 of 10 criteria have a citable source. No numeric score is shown on cards, comparison tables, FAQ copy, or structured data.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a Provisional score?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Six or more criteria evidenced from published pages, and no hands-on testing yet. The number is an unweighted mean of the evidenced criteria.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you perform security testing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. We check published security posture such as HTTPS, a reachable privacy policy, and stated compliance commitments. We do not perform security testing.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do affiliate relationships affect ratings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. One9Founders publishes scores from cited sources with zero affiliate bias.',
        },
      },
    ],
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
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
              One9Founders uses a uniform, transparent methodology to evaluate AI tools
              in our directory. Unlike other directories that rely on affiliate relationships
              or popularity metrics alone, we apply consistent criteria — and we only publish
              a numeric score when enough of that framework has been completed.
            </p>
            <p className="text-[var(--gray-300)] text-lg leading-relaxed mb-4">
              What runs on every tool is automated collection of published pages, then a
              score for each criterion that those pages actually support. Each score cites
              a source URL. Ease of Use, Reliability &amp; Performance, and hands-on security
              testing are not automated: they need a person using the product.
            </p>
            <p className="text-[var(--gray-300)] text-lg leading-relaxed mb-4">
              {provisionalCount != null && toolCount != null
                ? `Today, ${provisionalCount} of ${toolCount} tools have a Provisional score from published evidence.`
                : 'Provisional scores land as the automated pass covers the directory.'}
              {assessedCount != null
                ? ` ${assessedCount} ${Number(assessedCount.replace(/,/g, '')) === 1 ? 'tool has' : 'tools have'} a full Rated review after hands-on testing.`
                : ''}{' '}
              Listings that are not yet scored show
              &ldquo;Not Yet Rated&rdquo; rather than a placeholder number.
            </p>
            <p className="text-white font-semibold text-lg">
              Our commitment: Zero affiliate bias. Every scored criterion cites a URL. We do not claim tests we did not run.
            </p>
          </div>
        </section>

        {/* Rating states */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Rating and security states</h2>
          <div className="space-y-4 text-[var(--gray-300)]">
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Not Yet Rated</h3>
              <p>Fewer than 6 of 10 criteria have a citable source. No numeric score is shown anywhere — not on cards, comparison tables, FAQ copy, or structured data.</p>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Provisional</h3>
              <p>Six or more criteria evidenced from published pages, and no hands-on testing yet. The number is an unweighted mean of the evidenced criteria, shown as e.g. &ldquo;3.8/5 (Provisional — 7/10 criteria assessed)&rdquo;. Automated scoring cannot reach 10/10, because Ease of Use and Reliability are never filled in by the crawler.</p>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Rated</h3>
              <p>All 10 criteria scored, including hands-on testing by a person who has actually used the product. Only that short list qualifies. We show the numeric score with a tier: Outstanding (4.5–5.0), Excellent (4.0–4.49), Strong (3.5–3.99), Good (3.0–3.49), Fair (2.0–2.99), or Needs Improvement (below 2.0).</p>
            </div>
            <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Security status</h3>
              <p>We check published security posture — encryption in transit, a reachable privacy policy, and stated compliance commitments such as SOC 2 or GDPR. We do not perform security testing. Until that criterion is scored: &ldquo;Security: Not Yet Assessed&rdquo;. Below 12/20: &ldquo;Security: Flagged&rdquo;. 12/20 or above: &ldquo;Security: Published posture&rdquo;.</p>
            </div>
          </div>
        </section>

        {/* Rating Framework */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            The ten criteria
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    criterion.weight === 'Hands-on'
                      ? 'bg-amber-600/20 text-amber-300'
                      : 'bg-copper/20 text-copper'
                  }`}>
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
          <h2 className="text-3xl font-bold text-white mb-8">What actually happens</h2>

          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-6"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-copper rounded-full flex items-center justify-center text-[var(--ink)] font-bold">
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

          <div className="bg-gradient-to-r from-copper/20 to-copper/5 border border-copper/30 rounded-xl p-8">
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
              Our LLM Explorer tracks 250+ models across multiple dimensions. Unlike tool ratings, LLM data is sourced from public benchmarks and provider documentation.
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
                    'Arena (arena.ai) text and WebDev leaderboards',
                    'Artificial Analysis Intelligence Index',
                    'OpenRouter and official provider list prices',
                    'Model cards, Hugging Face, and release notes',
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
                <Link href="/llms" className="text-copper hover:text-copper-bright underline">LLM Explorer</Link>{' '}
                to compare all 250+ models.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">How We Ingest Research Papers</h2>
          <div className="bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-8">
            <p className="text-[var(--gray-300)] text-lg leading-relaxed mb-6">
              The research hub tracks {STATS.researchPapers} AI papers from {STATS.researchAuthors} authors. New work is ingested daily from arXiv and cross-referenced with HuggingFace daily papers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">What We Track</h3>
                <ul className="space-y-2">
                  {[
                    'Title, abstract, authors, and arXiv categories',
                    'Publication date and PDF / arXiv links',
                    'HuggingFace upvotes and paper URLs',
                    'AI-generated summaries and topic tags',
                    'Beginner / intermediate / advanced difficulty',
                    'Linked code repositories when available',
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
                    'arXiv API for cs.AI, cs.CL, cs.LG, and cs.IR',
                    'HuggingFace daily papers for upvotes and trending',
                    'Author records built from each ingested paper',
                    'AI enrichment for summaries, tags, and difficulty',
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
                Papers are added as they appear on arXiv. Visit the{' '}
                <Link href="/research" className="text-copper hover:text-copper-bright underline">research hub</Link>{' '}
                to browse all {STATS.researchPapers} papers.
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
