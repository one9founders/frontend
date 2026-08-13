'use client';

import { Tool } from '@/types';
import Link from 'next/link';
import { HugeiconsIcon, ArrowUpRight01Icon, ViewIcon } from '@/components/ui/icons';
import posthog from 'posthog-js';
import { addRefToUrl } from '@/lib/utils/url';
import ToolLogo from '@/components/shared/ToolLogo';
import { useCurrency } from '@/lib/currency';
import ToolRatingBadge from '@/components/features/tools/ToolRatingBadge';
import ToolSecurityBadge from '@/components/features/tools/ToolSecurityBadge';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { currency, formatPrice } = useCurrency();

  const getPricingDisplay = () => {
    if (tool.free_tier_available) return 'Free';
    if (tool.free_trial_days) return `${tool.free_trial_days} days trial`;
    if (tool.pricing_from != null && tool.pricing_from > 0) {
      if (currency === 'INR') {
        const inr = formatPrice(tool.pricing_from, tool.pricing_inr);
        return inr ? `From ${inr}` : `From $${tool.pricing_from}`;
      }
      return `From $${tool.pricing_from}`;
    }
    if (tool.pricing_models?.includes('free')) return 'Free';
    if (tool.pricing_models?.includes('freemium')) return 'Freemium';
    return 'Paid';
  };

  const handleViewDetails = () => {
    posthog.capture('tool_details_viewed', {
      tool_id: tool.id,
      tool_name: tool.name,
      tool_slug: tool.slug,
      categories: tool.categories?.map(c => c.name) || [],
      is_featured: tool.is_featured,
      rating: tool.rating,
    });
  };

  const handleVisitTool = () => {
    posthog.capture('tool_visited', {
      tool_id: tool.id,
      tool_name: tool.name,
      tool_slug: tool.slug,
      tool_website: tool.website,
      is_affiliate: !!tool.affiliate_url,
      categories: tool.categories?.map(c => c.name) || [],
    });
  };

  const pricingText = getPricingDisplay();
  const colorClass = pricingText === 'Free' || pricingText === 'Freemium'
    ? pricingText === 'Free'
      ? 'bg-green-600/20 text-green-400'
      : 'bg-blue-600/20 text-blue-400'
    : pricingText.includes('trial')
      ? 'bg-blue-600/20 text-blue-400'
      : 'bg-purple-600/20 text-purple-400';

  return (
    <div className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-[transform,box-shadow] duration-300 group flex flex-col h-full bg-[var(--gray-900)] border border-[var(--gray-800)]">
      <div className="p-2 flex-1 flex flex-col">
        <div className="flex gap-3 flex-1">
          <div className="flex-shrink-0">
            <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-lg font-bold text-white truncate pr-2">{tool.name}</h3>
              <ToolRatingBadge tool={tool} compact className="text-xs flex-shrink-0" />
            </div>
            <div className="mt-0.5">
              <ToolSecurityBadge tool={tool} compact className="text-xs" />
            </div>
            <div className="mt-0.5">
              <span className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded ${colorClass}`}>
                {pricingText}
              </span>
            </div>
            <p className="text-sm text-[var(--gray-400)] line-clamp-2 leading-tight">
              {tool.short_description || tool.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Link
            href={`/tool/${tool.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-lg font-medium transition-colors bg-[var(--gray-700)] text-white hover:bg-[var(--gray-600)] text-sm flex items-center justify-center gap-2"
            onClick={handleViewDetails}
          >
            <HugeiconsIcon icon={ViewIcon} size={16} />
            View Details
          </Link>
          {tool.website && (
            <a
              href={addRefToUrl(tool.affiliate_url || tool.website)}
              target="_blank"
              rel="noopener nofollow"
              className="flex-1 text-center py-2 px-3 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700 text-sm flex items-center justify-center gap-2"
              onClick={handleVisitTool}
            >
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
              Visit Tool
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
