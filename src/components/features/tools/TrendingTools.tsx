'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { trackingAPI } from '@/lib/api/apiClient';
import { addRefToUrl } from '@/lib/utils/url';
import { HugeiconsIcon, ArrowLeft01Icon, ArrowRight01Icon } from '@/components/ui/icons';
import { getToolRatingDisplay, type ToolRatingFields } from '@/lib/toolRating';

interface TrendingTool extends ToolRatingFields {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  logo_url: string;
  website: string;
  rating: number;
  review_count: number;
  views_count: number;
  usage_count: number;
  click_count: number;
}

export default function TrendingTools() {
  const [tools, setTools] = useState<TrendingTool[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTrendingTools = async () => {
      try {
        const data = await trackingAPI.getTrendingTools(7, 8);
        setTools(data || []);
      } catch (error) {
        console.error('Error loading trending tools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingTools();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 px-4 md:px-6 bg-[var(--ink)] border-t border-[var(--line)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--copper)] mb-2">This week</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--paper)] mb-6">Trending</h2>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[240px] bg-[var(--ink-2)] p-4 animate-pulse border border-[var(--line)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--line)]"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--line)] w-3/4 mb-1"></div>
                    <div className="h-3 bg-[var(--line)] w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-[var(--ink)] border-t border-[var(--line)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--copper)] mb-2">This week</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--paper)]">Trending</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 border border-[var(--line)] text-[var(--gray-400)] hover:text-[var(--paper)] hover:border-[var(--copper-dim)] transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 border border-[var(--line)] text-[var(--gray-400)] hover:text-[var(--paper)] hover:border-[var(--copper-dim)] transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tool/${tool.slug}`}
              className="min-w-[240px] max-w-[240px] bg-[var(--ink-2)] p-4 border border-[var(--line)] hover:border-[var(--copper-dim)] transition-colors snap-start flex-shrink-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={tool.logo_url || '/logo.svg'}
                  alt={tool.name}
                  className="w-10 h-10 object-contain rounded-lg bg-white p-0.5"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--paper)] truncate">{tool.name}</h3>
                  <span className="text-xs text-[var(--gray-400)]">
                    {getToolRatingDisplay(tool).shortLabel}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--gray-400)] line-clamp-2">
                {tool.short_description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
