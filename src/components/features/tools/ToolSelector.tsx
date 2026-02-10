'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Tool, Category } from '@/types';
import { HugeiconsIcon, Search01Icon, Cancel01Icon, StarIcon, CheckmarkCircle01Icon } from '@/components/ui/icons';
import { searchTools } from '@/lib/actions/tools';
import ToolLogo from '@/components/shared/ToolLogo';

interface ToolSelectorProps {
  tools: Tool[];
  selectedTools: Tool[];
  onAddTool: (tool: Tool) => void;
  loading: boolean;
}

export default function ToolSelector({ tools, selectedTools, onAddTool, loading }: ToolSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [showMore, setShowMore] = useState(false);
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced server-side search
  const debouncedSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchTools(query);
      // Map search results to Tool format with all required fields
      const mappedResults: Tool[] = (Array.isArray(results) ? results : []).map((r: any) => ({
        id: r.id,
        name: r.name,
        slug: r.slug || '',
        description: r.description || '',
        short_description: r.short_description || '',
        logo_url: r.logo_url,
        website: r.website,
        rating: r.rating || 0,
        review_count: r.review_count || 0,
        views_count: r.views_count || 0,
        categories: r.categories || [],
        pricing_models: r.pricing_models || [],
        pricing_from: r.pricing_from,
        free_tier_available: r.free_tier_available || false,
        free_trial_days: r.free_trial_days,
        tags: r.tags || [],
        use_cases: r.use_cases || [],
        integrations: r.integrations || [],
        features: r.features || [],
        platforms: r.platforms || [],
        ideal_for: r.ideal_for || [],
        startup_friendly: r.startup_friendly || false,
        verified: r.verified || false,
        is_featured: r.is_featured || false,
        is_active: r.is_active !== false,
        created_at: r.created_at || '',
        updated_at: r.updated_at || '',
      }));
      setSearchResults(mappedResults);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debouncedSearch]);

  // Extract unique categories from tools
  const categories = useMemo(() => {
    const categoryMap = new Map<string, Category>();
    (Array.isArray(tools) ? tools : []).forEach(tool => {
      tool.categories?.forEach(cat => {
        if (!categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, cat);
        }
      });
    });
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tools]);

  // Pricing options
  const pricingOptions = [
    { value: 'all', label: 'All Pricing' },
    { value: 'free', label: 'Free' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'paid', label: 'Paid' },
  ];

  // Use search results when searching, otherwise use loaded tools
  const baseTools = useMemo(() => {
    if (hasSearched && searchQuery.length >= 2) {
      return searchResults;
    }
    return Array.isArray(tools) ? tools : [];
  }, [tools, searchResults, hasSearched, searchQuery]);

  const filteredTools = useMemo(() => {
    return baseTools.filter(tool => {
      // Exclude already selected tools
      if (selectedTools.find(selected => selected.id === tool.id)) return false;
      
      // Category filter (only apply when not using server search)
      if (!hasSearched && selectedCategory !== 'all' && 
          !tool.categories?.some(cat => cat.slug === selectedCategory)) {
        return false;
      }
      
      // Pricing filter
      if (selectedPricing !== 'all') {
        const hasFree = tool.free_tier_available || tool.pricing_models?.some(p => p.toLowerCase() === 'free');
        const hasFreemium = tool.pricing_models?.some(p => p.toLowerCase() === 'freemium');
        
        if (selectedPricing === 'free' && !hasFree) return false;
        if (selectedPricing === 'freemium' && !hasFreemium) return false;
        if (selectedPricing === 'paid' && (hasFree || hasFreemium)) return false;
      }
      
      return true;
    });
  }, [baseTools, selectedTools, selectedCategory, selectedPricing, hasSearched]);

  const displayedTools = showMore ? filteredTools : filteredTools.slice(0, 12);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="bg-[var(--gray-900)] rounded-lg p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-white">Loading tools...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Selected Tools Preview */}
      {selectedTools.length > 0 && (
        <div className="bg-[var(--gray-900)] rounded-lg p-4 mb-4 border border-orange-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Selected for Comparison</h3>
            <span className="text-sm text-orange-600">{selectedTools.length}/4 tools</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-2 px-3 py-2 bg-orange-100 border border-orange-300 rounded-lg"
              >
                <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="xs" />
                <span className="text-white text-sm font-medium">{tool.name}</span>
                <HugeiconsIcon 
                  icon={CheckmarkCircle01Icon} 
                  size={16} 
                  className="text-green-400" 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[var(--gray-900)] rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">
            Select Tools to Compare
          </h2>
          <span className="text-[var(--gray-400)] text-sm">
            {isSearching ? 'Searching...' : hasSearched ? `${filteredTools.length} results found` : `Showing ${filteredTools.length} of 26,000+ tools`}
          </span>
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Input */}
          <div className="relative">
            <HugeiconsIcon 
              icon={Search01Icon} 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--gray-400)]" 
            />
            <input
              type="text"
              placeholder="Search all 26,000+ tools by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-[var(--gray-800)] text-white rounded-lg border border-[var(--gray-700)] focus:border-purple-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--gray-400)] hover:text-white"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-[var(--gray-800)] text-[var(--gray-600)] rounded-lg border border-[var(--gray-700)] focus:border-orange-500 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Pricing Filter */}
            <div className="flex gap-2">
              {pricingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedPricing(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPricing === option.value
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-[var(--gray-800)] text-[var(--gray-400)] hover:bg-[var(--gray-700)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'all' || selectedPricing !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPricing('all');
                  setSearchQuery('');
                }}
                              className="px-4 py-2 text-sm text-orange-600 hover:text-orange-500 transition-colors"
                            >
                              Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => selectedTools.length < 4 && onAddTool(tool)}
                  className={`flex items-start gap-3 p-4 bg-[var(--gray-800)] rounded-lg border border-[var(--gray-700)] transition-all ${
                    selectedTools.length >= 4
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-[var(--gray-700)] hover:border-orange-400'
                  }`}
                >
                    <div className="flex-shrink-0">
                      <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="sm" />
                    </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-medium truncate">{tool.name}</h3>
                      {tool.rating > 0 && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <HugeiconsIcon icon={StarIcon} size={14} className="text-yellow-400" />
                          <span className="text-xs text-[var(--gray-400)]">{Number(tool.rating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[var(--gray-400)] text-xs mt-1 line-clamp-2">
                      {tool.short_description || tool.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tool.categories?.slice(0, 2).map((cat) => (
                        <span
                          key={cat.slug}
                          className="px-2 py-0.5 text-xs bg-[var(--gray-700)] text-[var(--gray-300)] rounded-full"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {filteredTools.length > 12 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="px-6 py-2 bg-[var(--gray-800)] text-white rounded-lg hover:bg-[var(--gray-700)] transition-colors"
                >
                  {showMore ? 'Show Less' : `Show More (${filteredTools.length - 12} more)`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--gray-400)]">No tools found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPricing('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-sm text-orange-600 hover:text-orange-500 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {selectedTools.length >= 4 && (
          <p className="text-yellow-400 text-sm mt-4 text-center">
            Maximum 4 tools can be compared at once. Remove a tool to add another.
          </p>
        )}
      </div>
    </div>
  );
}
