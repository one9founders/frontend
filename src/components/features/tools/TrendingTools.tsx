'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackingAPI } from '@/lib/api/apiClient';
import { addRefToUrl } from '@/lib/utils/url';
import ToolLogo from '@/components/shared/ToolLogo';

interface TrendingTool {
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

  useEffect(() => {
    const loadTrendingTools = async () => {
      try {
        const data = await trackingAPI.getTrendingTools(7, 6);
        setTools(data || []);
      } catch (error) {
        console.error('Error loading trending tools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingTools();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--gray-600)] mb-8">Trending Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--gray-900)] rounded-lg p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[var(--gray-800)] rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-[var(--gray-800)] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[var(--gray-800)] rounded w-1/2"></div>
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
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Trending Tools</h2>
          <span className="text-[var(--gray-400)] text-sm">Based on recent activity</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-[var(--gray-900)] rounded-lg p-6 hover:bg-[var(--gray-800)] transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="md" />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/tool/${tool.slug}`}
                    className="text-lg font-semibold text-[var(--gray-600)] hover:text-orange-600 transition-colors block truncate"
                  >
                    {tool.name}
                  </Link>
                  <p className="text-[var(--gray-400)] text-sm line-clamp-2">
                    {tool.short_description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-[var(--gray-400)]">
                  <span>{tool.views_count || 0} views</span>
                  {tool.usage_count > 0 && (
                    <span>{tool.usage_count} users</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/tool/${tool.slug}`}
                    className="text-orange-600 hover:text-orange-500 text-sm"
                  >
                    Details
                  </Link>
                  {tool.website && (
                    <a
                      href={addRefToUrl(tool.website)}
                      target="_blank"
                      rel="noopener nofollow"
                      className="text-[var(--gray-400)] hover:text-white text-sm"
                    >
                      Visit
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
