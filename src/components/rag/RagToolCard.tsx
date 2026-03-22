'use client';

import Link from 'next/link';
import { RagTool } from '@/types/rag';
import ToolLogo from '@/components/shared/ToolLogo';
import CategoryPill from '@/components/ui/CategoryPill';

interface RagToolCardProps {
  tool: RagTool;
  variant?: 'default' | 'compact' | 'compare';
}

const categoryConfig: Record<string, { label: string; variant: 'teal' | 'purple' | 'amber' }> = {
  vector_db: { label: 'Vector DB', variant: 'teal' },
  rag_framework: { label: 'RAG Framework', variant: 'purple' },
  embedding_model: { label: 'Embedding Model', variant: 'amber' },
};

const pricingConfig: Record<string, { label: string; variant: 'green' | 'blue' | 'gray' }> = {
  free: { label: 'Free', variant: 'green' },
  freemium: { label: 'Freemium', variant: 'blue' },
  paid: { label: 'Paid', variant: 'gray' },
  open_source: { label: 'Open Source', variant: 'green' },
};

function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`;
  return stars.toString();
}

export default function RagToolCard({ tool, variant = 'default' }: RagToolCardProps) {
  const catConfig = categoryConfig[tool.category] || { label: tool.category, variant: 'gray' as const };
  const priceConfig = pricingConfig[tool.pricing_model] || { label: tool.pricing_model, variant: 'gray' as const };

  if (variant === 'compact') {
    return (
      <Link href={`/rag-vector-dbs/${tool.slug}`} className="block">
        <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-3 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="xs" />
            <h4 className="text-sm font-semibold text-white truncate">{tool.name}</h4>
          </div>
          <p className="text-xs text-[var(--gray-400)] line-clamp-1">{tool.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <CategoryPill label={catConfig.label} variant={catConfig.variant} size="sm" />
            {tool.github_stars > 0 && (
              <span className="text-xs text-[var(--gray-500)]">
                <svg className="inline w-3 h-3 mr-0.5 -mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {formatStars(tool.github_stars)}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/rag-vector-dbs/${tool.slug}`} className="block">
      <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-4 hover:border-purple-500/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-white truncate">{tool.name}</h3>
              {tool.overall_rating > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className="text-sm text-white font-medium">{tool.overall_rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <CategoryPill label={catConfig.label} variant={catConfig.variant} size="sm" className="mt-1" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--gray-400)] line-clamp-2 leading-relaxed mb-3 flex-1">
          {tool.description || 'No description available.'}
        </p>

        {/* SDK languages */}
        {tool.sdk_languages && tool.sdk_languages.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tool.sdk_languages.slice(0, 4).map((lang) => (
              <span key={lang} className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--gray-800)] text-[var(--gray-400)]">
                {lang}
              </span>
            ))}
            {tool.sdk_languages.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--gray-800)] text-[var(--gray-400)]">
                +{tool.sdk_languages.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-3">
            {tool.github_stars > 0 && (
              <span className="text-xs text-[var(--gray-400)] flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {formatStars(tool.github_stars)}
              </span>
            )}
            {tool.deployment_options && tool.deployment_options.length > 0 && (
              <span className="text-xs text-[var(--gray-500)]">
                {tool.deployment_options.join(' \u00b7 ')}
              </span>
            )}
          </div>
          <CategoryPill label={priceConfig.label} variant={priceConfig.variant} size="sm" />
        </div>
      </div>
    </Link>
  );
}
