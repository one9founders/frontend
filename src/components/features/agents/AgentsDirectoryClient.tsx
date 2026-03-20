'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { agentsAPI } from '@/lib/api/apiClient';
import { AgentListItem, AgentCategory, AgentStats, AgentListResponse, AgentCategoriesResponse } from '@/types/agent';
import AgentCard from './AgentCard';
import AgentCardSkeleton from './AgentCardSkeleton';
import AgentFilters from './AgentFilters';
import CategoryPills from './CategoryPills';

interface AgentsDirectoryClientProps {
  initialAgents: AgentListItem[];
  initialCount: number;
  initialCategories: AgentCategory[];
  initialStats: AgentStats | null;
  presetCategory?: string;
  categoryLabel?: string;
}

export default function AgentsDirectoryClient({
  initialAgents,
  initialCount,
  initialCategories,
  initialStats,
  presetCategory,
  categoryLabel,
}: AgentsDirectoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [agents, setAgents] = useState<AgentListItem[]>(initialAgents);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [categories] = useState<AgentCategory[]>(initialCategories);
  const [stats] = useState<AgentStats | null>(initialStats);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialCount > initialAgents.length);

  // Read filters from URL or defaults
  const [category, setCategory] = useState(presetCategory || searchParams.get('category') || '');
  const [pricing, setPricing] = useState(searchParams.get('pricing') || '');
  const [access, setAccess] = useState(searchParams.get('access') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const pageSize = 24;
  const hasFetched = useRef(false);
  const fetchGeneration = useRef(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update URL when filters change
  const updateUrl = useCallback((params: Record<string, string>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    const queryString = query.toString();
    const basePath = presetCategory ? `/agents/category/${presetCategory}` : '/agents';
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [router, presetCategory]);

  // Fetch agents when filters change
  useEffect(() => {
    fetchGeneration.current++;
    const fetchAgents = async () => {
      setLoading(true);
      setPage(1);
      try {
        const params: Record<string, string | number> = {
          page: 1,
          page_size: pageSize,
          sort,
        };
        const effectiveCategory = presetCategory || category;
        if (effectiveCategory) params.category = effectiveCategory;
        if (pricing) params.pricing = pricing;
        if (access) params.access = access;
        if (search) params.search = search;

        const data = await agentsAPI.getAll(params as Parameters<typeof agentsAPI.getAll>[0]);
        const response = (data || { count: 0, next: null, previous: null, results: [] }) as AgentListResponse;
        setAgents(response.results || []);
        setTotalCount(response.count || 0);
        setHasMore(!!(response.next));
        hasFetched.current = true;

        // Update URL (don't include preset category in URL params)
        const urlParams: Record<string, string> = {};
        if (!presetCategory && category) urlParams.category = category;
        if (pricing) urlParams.pricing = pricing;
        if (access) urlParams.access = access;
        if (sort && sort !== 'popular') urlParams.sort = sort;
        if (search) urlParams.search = search;
        updateUrl(urlParams);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
        setAgents([]);
        setTotalCount(0);
      }
      setLoading(false);
    };

    // Skip on initial render if we have initial data and no filter changes
    const isInitial =
      !hasFetched.current &&
      page === 1 &&
      (presetCategory || !category) &&
      !pricing &&
      !access &&
      sort === 'popular' &&
      !search &&
      initialAgents.length > 0;

    if (!isInitial) {
      fetchAgents();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, pricing, access, sort, search]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const gen = fetchGeneration.current;
    const nextPage = page + 1;
    try {
      const params: Record<string, string | number> = {
        page: nextPage,
        page_size: pageSize,
        sort,
      };
      const effectiveCategory = presetCategory || category;
      if (effectiveCategory) params.category = effectiveCategory;
      if (pricing) params.pricing = pricing;
      if (access) params.access = access;
      if (search) params.search = search;

      const data = await agentsAPI.getAll(params as Parameters<typeof agentsAPI.getAll>[0]);
      // Discard stale results if filters changed during the fetch
      if (gen !== fetchGeneration.current) return;
      const response = (data || { count: 0, next: null, previous: null, results: [] }) as AgentListResponse;
      setAgents((prev) => [...prev, ...(response.results || [])]);
      setHasMore(!!(response.next));
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more agents:', error);
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  const handleCategoryChange = (value: string) => {
    if (!presetCategory) {
      setCategory(value);
    }
  };

  const clearFilters = () => {
    if (!presetCategory) setCategory('');
    setPricing('');
    setAccess('');
    setSort('popular');
    setSearch('');
    setSearchInput('');
  };

  const freeCount = stats?.free_agents ?? 0;
  const ossCount = stats?.open_source_agents ?? 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {categoryLabel ? `Top ${categoryLabel} AI Agents` : 'AI Agents Directory'}
        </h1>
        <p className="text-[var(--gray-400)] text-lg max-w-2xl mx-auto">
          {categoryLabel
            ? `Explore ${totalCount}+ ${categoryLabel} AI agents. Compare features, pricing, and ratings. Security-validated by One9Founders.`
            : `Discover ${stats?.total_agents?.toLocaleString() || '1,200'}+ autonomous AI agents across ${stats?.total_categories || 75} categories. Security-validated with zero affiliate bias.`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search AI agents..."
            className="w-full px-6 py-4 text-lg rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-900)] border border-[var(--gray-700)] text-white"
          />
          <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filter Bar */}
      <AgentFilters
        categories={categories}
        selectedCategory={presetCategory || category}
        selectedPricing={pricing}
        selectedAccess={access}
        selectedSort={sort}
        onCategoryChange={handleCategoryChange}
        onPricingChange={setPricing}
        onAccessChange={setAccess}
        onSortChange={setSort}
      />

      {/* Category Pills */}
      <div className="my-4">
        <CategoryPills
          categories={categories}
          selected={presetCategory || category}
          onSelect={handleCategoryChange}
        />
      </div>

      {/* Results Count Bar */}
      {!loading && (
        <div className="mb-4 text-sm text-[var(--gray-400)]">
          Showing {totalCount.toLocaleString()} agents
          {freeCount > 0 && ` \u00b7 ${freeCount.toLocaleString()} Free`}
          {ossCount > 0 && ` \u00b7 ${ossCount.toLocaleString()} Open Source`}
        </div>
      )}

      {/* Agent Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(12)].map((_, i) => (
            <AgentCardSkeleton key={i} />
          ))}
        </div>
      ) : agents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.slug} agent={agent} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-8 py-3 rounded-lg font-medium transition-colors bg-[var(--gray-800)] text-white border border-[var(--gray-700)] hover:bg-[var(--gray-700)] disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--gray-400)] text-lg mb-4">
            No agents found matching your filters. Try broadening your search.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
