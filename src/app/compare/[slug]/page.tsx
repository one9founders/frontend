export const runtime = 'edge';

import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/actions/tools';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tool } from '@/types';

export const revalidate = 3600;

function parseComparisonSlug(slug: string): { toolASlug: string; toolBSlug: string } | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return null;
  return { toolASlug: parts[0], toolBSlug: parts[1] };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);
  if (!parsed) {
    return generateSEO({
      title: 'Compare AI Tools',
      description: 'Compare AI tools side by side for your startup.',
      path: `/compare/${slug}`,
    });
  }

  const [toolA, toolB] = await Promise.all([
    getToolBySlug(parsed.toolASlug),
    getToolBySlug(parsed.toolBSlug),
  ]);

  const nameA = toolA?.name || parsed.toolASlug;
  const nameB = toolB?.name || parsed.toolBSlug;

  return generateSEO({
    title: `${nameA} vs ${nameB} - AI Tool Comparison (2026)`,
    description: `Compare ${nameA} and ${nameB} side by side. Features, pricing, security scores, and ratings compared for startup founders.`,
    path: `/compare/${slug}`,
    keywords: [`${nameA} vs ${nameB}`, 'AI tool comparison', 'startup tools', 'founder tools'],
  });
}

function ComparisonRow({ label, valueA, valueB }: { label: string; valueA: React.ReactNode; valueB: React.ReactNode }) {
  return (
    <tr className="border-b border-[var(--gray-700)]">
      <td className="py-3 px-4 text-[var(--gray-400)] font-medium text-sm">{label}</td>
      <td className="py-3 px-4 text-white text-sm">{valueA}</td>
      <td className="py-3 px-4 text-white text-sm">{valueB}</td>
    </tr>
  );
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);

  if (!parsed) {
    return (
      <div className="min-h-screen bg-[var(--gray-black)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Invalid Comparison</h1>
          <p className="text-[var(--gray-400)]">Use the format /compare/tool-a-vs-tool-b to compare two tools.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const [rawToolA, rawToolB] = await Promise.all([
    getToolBySlug(parsed.toolASlug),
    getToolBySlug(parsed.toolBSlug),
  ]);

  if (!rawToolA || !rawToolB) {
    return (
      <div className="min-h-screen bg-[var(--gray-black)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Tool Not Found</h1>
          <p className="text-[var(--gray-400)]">
            One or both tools could not be found. Please check the URL and try again.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const toolA = rawToolA as Tool;
  const toolB = rawToolB as Tool;

  const structuredData = generateStructuredData({
    '@type': 'WebPage',
    name: `${toolA.name} vs ${toolB.name}`,
    description: `Detailed comparison of ${toolA.name} and ${toolB.name} for startup founders.`,
    url: `https://www.one9founders.com/compare/${slug}`,
  });

  const breadcrumbSchema = generateStructuredData({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.one9founders.com' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://www.one9founders.com/compare' },
      { '@type': 'ListItem', position: 3, name: `${toolA.name} vs ${toolB.name}`, item: `https://www.one9founders.com/compare/${slug}` },
    ],
  });

  const formatPricing = (tool: Tool) => {
    const parts: string[] = [];
    if (tool.pricing_models?.length) parts.push(tool.pricing_models.join(', '));
    if (tool.pricing_from) parts.push(`From $${tool.pricing_from}/mo`);
    if (tool.free_tier_available) parts.push('Free tier available');
    if (tool.free_trial_days) parts.push(`${tool.free_trial_days}-day trial`);
    return parts.length ? parts.join(' | ') : 'Contact for pricing';
  };

  const formatSecurity = (tool: Tool) => {
    if (tool.security_score != null) return `${tool.security_score}/100`;
    return 'Pending';
  };

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {toolA.name} vs {toolB.name}
          </h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            A detailed side-by-side comparison to help you choose the right AI tool for your startup.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-[var(--gray-900)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--gray-700)] bg-[var(--gray-800)]">
                <th className="py-4 px-4 text-left text-[var(--gray-400)] text-sm font-medium w-1/4">Feature</th>
                <th className="py-4 px-4 text-left text-white font-semibold w-[37.5%]">
                  <div className="flex items-center gap-3">
                    {toolA.logo_url && (
                      <img src={toolA.logo_url} alt={toolA.name} className="w-8 h-8 rounded object-cover" />
                    )}
                    {toolA.name}
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-white font-semibold w-[37.5%]">
                  <div className="flex items-center gap-3">
                    {toolB.logo_url && (
                      <img src={toolB.logo_url} alt={toolB.name} className="w-8 h-8 rounded object-cover" />
                    )}
                    {toolB.name}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                label="Description"
                valueA={toolA.short_description}
                valueB={toolB.short_description}
              />
              <ComparisonRow
                label="Rating"
                valueA={toolA.rating ? `${toolA.rating}/5 (${toolA.review_count} reviews)` : 'No ratings yet'}
                valueB={toolB.rating ? `${toolB.rating}/5 (${toolB.review_count} reviews)` : 'No ratings yet'}
              />
              <ComparisonRow
                label="Pricing"
                valueA={formatPricing(toolA)}
                valueB={formatPricing(toolB)}
              />
              <ComparisonRow
                label="Security Score"
                valueA={formatSecurity(toolA)}
                valueB={formatSecurity(toolB)}
              />
              <ComparisonRow
                label="Startup Friendly"
                valueA={toolA.startup_friendly ? 'Yes' : 'No'}
                valueB={toolB.startup_friendly ? 'Yes' : 'No'}
              />
              <ComparisonRow
                label="Categories"
                valueA={toolA.categories?.map((c) => c.name).join(', ') || '-'}
                valueB={toolB.categories?.map((c) => c.name).join(', ') || '-'}
              />
              <ComparisonRow
                label="Use Cases"
                valueA={
                  toolA.use_cases?.length ? (
                    <ul className="list-disc list-inside space-y-1">
                      {toolA.use_cases.slice(0, 5).map((uc, i) => <li key={i}>{uc}</li>)}
                    </ul>
                  ) : '-'
                }
                valueB={
                  toolB.use_cases?.length ? (
                    <ul className="list-disc list-inside space-y-1">
                      {toolB.use_cases.slice(0, 5).map((uc, i) => <li key={i}>{uc}</li>)}
                    </ul>
                  ) : '-'
                }
              />
              <ComparisonRow
                label="Key Features"
                valueA={
                  toolA.features?.length ? (
                    <ul className="list-disc list-inside space-y-1">
                      {toolA.features.slice(0, 5).map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  ) : '-'
                }
                valueB={
                  toolB.features?.length ? (
                    <ul className="list-disc list-inside space-y-1">
                      {toolB.features.slice(0, 5).map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  ) : '-'
                }
              />
              <ComparisonRow
                label="Integrations"
                valueA={toolA.integrations?.length ? toolA.integrations.slice(0, 5).join(', ') : '-'}
                valueB={toolB.integrations?.length ? toolB.integrations.slice(0, 5).join(', ') : '-'}
              />
              <ComparisonRow
                label="Website"
                valueA={
                  toolA.website ? (
                    <a href={toolA.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">
                      Visit Site
                    </a>
                  ) : '-'
                }
                valueB={
                  toolB.website ? (
                    <a href={toolB.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">
                      Visit Site
                    </a>
                  ) : '-'
                }
              />
            </tbody>
          </table>
        </div>

        {/* Individual Tool Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={`/tool/${toolA.slug}`}
            className="block bg-[var(--gray-900)] rounded-lg p-4 hover:bg-[var(--gray-800)] transition-colors"
          >
            <p className="text-white font-medium">View {toolA.name} Details</p>
            <p className="text-[var(--gray-400)] text-sm mt-1">Full review, security assessment, and user ratings</p>
          </a>
          <a
            href={`/tool/${toolB.slug}`}
            className="block bg-[var(--gray-900)] rounded-lg p-4 hover:bg-[var(--gray-800)] transition-colors"
          >
            <p className="text-white font-medium">View {toolB.name} Details</p>
            <p className="text-[var(--gray-400)] text-sm mt-1">Full review, security assessment, and user ratings</p>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
