'use client';

import { Tool } from '@/types';
import { useState } from 'react';
import Link from 'next/link';
import { HugeiconsIcon, StarIcon, ArrowUpRight01Icon, ViewIcon } from '@/components/ui/icons';
import posthog from 'posthog-js';
import { addRefToUrl } from '@/lib/utils/url';
import ToolLogo from '@/components/shared/ToolLogo';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [showVideo, setShowVideo] = useState(false);

  const getPricingDisplay = () => {
    if (tool.free_tier_available) return 'Free';
    if (tool.free_trial_days) return `${tool.free_trial_days} days trial`;
    if (tool.pricing_from) return `From $${tool.pricing_from}`;
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
              className="flex-1 text-center py-2 px-3 rounded-lg font-medium transition-colors bg-orange-600 text-white hover:bg-orange-700 text-sm flex items-center justify-center gap-2"
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
