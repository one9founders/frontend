'use client';

import { Tool } from '@/types';
import { useState } from 'react';
import Link from 'next/link';
import { HugeiconsIcon, StarIcon, ArrowUpRight01Icon, ViewIcon } from '@/components/ui/icons';
import posthog from 'posthog-js';
import { addRefToUrl } from '@/lib/utils/url';
import ToolLogo from '@/components/shared/ToolLogo';
import { useCurrency } from '@/lib/currency';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [showVideo, setShowVideo] = useState(false);
  const { currency, formatPrice } = useCurrency();

  const getPricingDisplay = () => {
    if (tool.free_tier_available) return 'Free';
    if (tool.free_trial_days) return `${tool.free_trial_days} days trial`;
    if (tool.pricing_from) {
      if (currency === 'INR') {
        return `From ${formatPrice(tool.pricing_from, tool.pricing_inr)}`;
      }
      return `From $${tool.pricing_from}`;
    }
    if (tool.pricing_models?.includes('free')) return 'Free';
    if (tool.pricing_models?.includes('freemium')) return 'Freemium';
    return 'Paid';
  };

  const getRatingStars = () => {
    if (!tool.rating) return null;
    const rating = Number(tool.rating);
    return Array.from({ length: 5 }, (_, i) => (
      <HugeiconsIcon 
        key={i} 
        icon={StarIcon}
        size={16} 
        aria-hidden="true"
        className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-[var(--gray-600)]'}
      />
    ));
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

  return (
    <div className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-[transform,box-shadow] duration-300 group flex flex-col h-full bg-[var(--gray-900)] border border-[var(--gray-800)]">
      
      {/* Content */}
      <div className="p-2 flex-1 flex flex-col">
        <div className="flex gap-3 flex-1">
          {/* Small Logo */}
          <div className="flex-shrink-0">
            <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="sm" />
          </div>
          
          {/* Content on Right */}
          <div className="flex-1 min-w-0">
            {/* Name and Rating */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-white truncate pr-2">{tool.name}</h3>
              {tool.rating > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="flex">{getRatingStars()}</div>
                  <span className="text-sm text-[var(--gray-400)]">{Number(tool.rating).toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* Security Badge */}
            <div className="flex items-center gap-1 mt-0.5">
              {tool.security_score != null ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Security: {tool.security_score}/100
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-[var(--gray-500)]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Security: Pending
                </span>
              )}
            </div>

            {/* Pricing Badge */}
            <div className="mt-0.5">
              {(() => {
                const pricingText = getPricingDisplay();
                const colorClass = pricingText === 'Free' || pricingText === 'Freemium'
                  ? pricingText === 'Free'
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-blue-600/20 text-blue-400'
                  : pricingText.includes('trial')
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-purple-600/20 text-purple-400';
                return (
                  <span className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded ${colorClass}`}>
                    {pricingText}
                  </span>
                );
              })()}
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--gray-400)] line-clamp-2 leading-tight">
              {tool.short_description || tool.description}
            </p>
          </div>
        </div>
        
        {/* Actions */}
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
