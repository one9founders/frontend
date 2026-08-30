'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RagTool } from '@/types/rag';
import ToolLogo from '@/components/shared/ToolLogo';
import CategoryPill from '@/components/ui/CategoryPill';
import StarsChart from '@/components/charts/StarsChart';
import RagToolCard from './RagToolCard';

interface RagToolDetailClientProps {
  tool: RagTool & { similar_tools?: RagTool[] };
}

const categoryConfig: Record<string, { label: string; variant: 'teal' | 'copper' | 'amber' }> = {
  vector_db: { label: 'Vector Database', variant: 'teal' },
  rag_framework: { label: 'RAG Framework', variant: 'copper' },
  embedding_model: { label: 'Embedding Model', variant: 'amber' },
};

const pricingConfig: Record<string, { label: string; variant: 'green' | 'blue' | 'gray' }> = {
  free: { label: 'Free', variant: 'green' },
  freemium: { label: 'Freemium', variant: 'blue' },
  paid: { label: 'Paid', variant: 'gray' },
  open_source: { label: 'Open Source', variant: 'green' },
};

const statusConfig: Record<string, { label: string; variant: 'green' | 'amber' | 'red' }> = {
  active: { label: 'Active', variant: 'green' },
  stale: { label: 'Stale', variant: 'amber' },
  deprecated: { label: 'Deprecated', variant: 'red' },
};

const RATING_LABELS: Record<string, string> = {
  ease_of_use: 'Ease of Use',
  documentation: 'Documentation',
  performance: 'Performance',
  scalability: 'Scalability',
  community: 'Community',
  integration: 'Integration',
  security: 'Security',
  pricing_value: 'Pricing Value',
  reliability: 'Reliability',
  support: 'Support',
};

function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`;
  return stars.toString();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RagToolDetailClient({ tool }: RagToolDetailClientProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const catConfig = categoryConfig[tool.category] || { label: tool.category, variant: 'gray' as const };
  const priceConfig = pricingConfig[tool.pricing_model] || { label: tool.pricing_model, variant: 'gray' as const };
  const statConfig = statusConfig[tool.status] || { label: tool.status, variant: 'gray' as const };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back link */}
      <Link href="/rag-vector-dbs" className="inline-flex items-center gap-1 text-sm text-[var(--gray-400)] hover:text-white transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to directory
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-4 md:gap-6 mb-8">
        <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-2xl md:text-4xl font-bold text-white">{tool.name}</h1>
            {tool.overall_rating > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-600/20 border border-yellow-600/30">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="text-sm font-semibold text-yellow-400">{tool.overall_rating.toFixed(1)}</span>
              </div>
            )}
            <CategoryPill label={statConfig.label} variant={statConfig.variant} size="sm" />
          </div>
          <p className="text-[var(--gray-400)] text-base md:text-lg mb-3">{tool.description}</p>
          <div className="flex flex-wrap gap-2">
            <CategoryPill label={catConfig.label} variant={catConfig.variant} size="md" />
            <CategoryPill label={priceConfig.label} variant={priceConfig.variant} size="md" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
        {tool.website_url && (
          <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-lg font-semibold text-sm btn-primary inline-flex items-center gap-2">
            Visit Website
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        )}
        {tool.docs_url && (
          <a href={tool.docs_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg font-medium text-sm text-[var(--gray-300)] border border-[var(--gray-700)] hover:border-[var(--gray-600)] transition-colors inline-flex items-center gap-2">
            Documentation
          </a>
        )}
        {tool.github_url && (
          <a href={tool.github_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg font-medium text-sm text-[var(--gray-300)] border border-[var(--gray-700)] hover:border-[var(--gray-600)] transition-colors inline-flex items-center gap-2">
            GitHub
          </a>
        )}
      </div>

      {/* Section 1: Overview */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Overview</h2>
        <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-6">
          {tool.long_description ? (
            <div>
              <p className={`text-[var(--gray-300)] leading-relaxed whitespace-pre-line ${!showFullDescription ? 'line-clamp-6' : ''}`}>
                {tool.long_description}
              </p>
              {tool.long_description.length > 400 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-copper hover:text-copper-bright text-sm mt-2 cursor-pointer"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          ) : (
            <p className="text-[var(--gray-300)] leading-relaxed">{tool.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {tool.deployment_options && tool.deployment_options.map((opt) => (
              <span key={opt} className="px-2 py-1 text-xs rounded bg-[var(--gray-800)] text-[var(--gray-400)]">{opt}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Rating breakdown */}
      {tool.rating_scores && Object.keys(tool.rating_scores).length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Rating Breakdown</h2>
          <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-bold text-white">{tool.overall_rating.toFixed(1)}</div>
              <div className="text-sm text-[var(--gray-400)]">Overall Rating</div>
            </div>
            <div className="space-y-3">
              {Object.entries(tool.rating_scores).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-[var(--gray-400)] w-32 flex-shrink-0">{RATING_LABELS[key] || key}</span>
                  <div className="flex-1 h-2 bg-[var(--gray-800)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-copper rounded-full transition-all"
                      style={{ width: `${(value / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-white font-medium w-8 text-right">{value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Technical Specs */}
      {tool.specs && Object.keys(tool.specs).length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Technical Specs</h2>
          <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.specs.index_types && tool.specs.index_types.length > 0 && (
                <div>
                  <span className="text-sm text-[var(--gray-500)]">Index Types</span>
                  <p className="text-white text-sm mt-1">{tool.specs.index_types.join(', ')}</p>
                </div>
              )}
              {tool.specs.distance_metrics && tool.specs.distance_metrics.length > 0 && (
                <div>
                  <span className="text-sm text-[var(--gray-500)]">Distance Metrics</span>
                  <p className="text-white text-sm mt-1">{tool.specs.distance_metrics.join(', ')}</p>
                </div>
              )}
              {tool.specs.max_dimensions != null && (
                <div>
                  <span className="text-sm text-[var(--gray-500)]">Max Dimensions</span>
                  <p className="text-white text-sm mt-1">{tool.specs.max_dimensions.toLocaleString()}</p>
                </div>
              )}
              {tool.specs.hybrid_search != null && (
                <div>
                  <span className="text-sm text-[var(--gray-500)]">Hybrid Search</span>
                  <p className="text-white text-sm mt-1">{tool.specs.hybrid_search ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>

            {/* SDK Languages */}
            {tool.sdk_languages && tool.sdk_languages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--gray-800)]">
                <span className="text-sm text-[var(--gray-500)] block mb-2">SDK Languages</span>
                <div className="flex flex-wrap gap-2">
                  {tool.sdk_languages.map((lang) => (
                    <span key={lang} className="px-2 py-1 text-xs rounded bg-[var(--gray-800)] text-[var(--gray-300)]">{lang}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations */}
            {tool.integrations && tool.integrations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--gray-800)]">
                <span className="text-sm text-[var(--gray-500)] block mb-2">Integrations</span>
                <div className="flex flex-wrap gap-2">
                  {tool.integrations.map((int_) => (
                    <span key={int_} className="px-2 py-1 text-xs rounded-full bg-copper/20 text-copper border border-copper/30">{int_}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Security Certs */}
            {tool.security_certs && tool.security_certs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--gray-800)]">
                <span className="text-sm text-[var(--gray-500)] block mb-2">Security Certifications</span>
                <div className="flex flex-wrap gap-2">
                  {tool.security_certs.map((cert) => (
                    <span key={cert} className="px-2 py-1 text-xs rounded bg-green-600/20 text-green-400 border border-green-600/30">{cert}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 4: Pricing */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Pricing</h2>
        <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <CategoryPill label={priceConfig.label} variant={priceConfig.variant} size="md" />
          </div>
          {tool.pricing_details && Object.keys(tool.pricing_details).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(tool.pricing_details).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2">
                  <span className="text-sm text-[var(--gray-500)] capitalize min-w-[100px]">{key.replace(/_/g, ' ')}</span>
                  <span className="text-sm text-[var(--gray-300)]">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--gray-400)]">
              {tool.pricing_model === 'free' || tool.pricing_model === 'open_source'
                ? 'Free to use.'
                : 'Visit the website for detailed pricing information.'}
            </p>
          )}
          {tool.website_url && (
            <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-copper hover:text-copper-bright mt-3">
              Visit pricing page
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
        </div>
      </section>

      {/* Section 5: GitHub Activity */}
      {(tool.github_stars > 0 || (tool.github_snapshots && tool.github_snapshots.length > 0)) && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">GitHub Activity</h2>
          <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <span className="text-sm text-[var(--gray-500)]">Stars</span>
                <p className="text-xl font-bold text-white">{formatStars(tool.github_stars)}</p>
              </div>
              <div>
                <span className="text-sm text-[var(--gray-500)]">Forks</span>
                <p className="text-xl font-bold text-white">{formatStars(tool.github_forks)}</p>
              </div>
              <div>
                <span className="text-sm text-[var(--gray-500)]">Last Commit</span>
                <p className="text-sm font-medium text-white">{formatDate(tool.last_commit_at)}</p>
              </div>
              <div>
                <span className="text-sm text-[var(--gray-500)]">Latest Release</span>
                <p className="text-sm font-medium text-white">{tool.latest_release || 'N/A'}</p>
              </div>
            </div>

            {tool.github_snapshots && tool.github_snapshots.length >= 2 && (
              <div>
                <h3 className="text-sm font-medium text-[var(--gray-400)] mb-3">Stars Over Time</h3>
                <StarsChart data={tool.github_snapshots} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 6: Similar Tools */}
      {tool.similar_tools && tool.similar_tools.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Similar Solutions</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
            {tool.similar_tools.map((similar) => (
              <div key={similar.slug} className="flex-shrink-0 w-[280px]">
                <RagToolCard tool={similar} variant="compact" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
