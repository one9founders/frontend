'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Paper, PaperStats } from '@/types/paper';
import PaperCard from './PaperCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

interface ResearchFeedClientProps {
  initialPapers: Paper[];
  initialCount: number;
  trendingPapers: Paper[];
  stats: PaperStats | null;
}

const CATEGORY_TABS = [
  { value: '', label: 'All' },
  { value: 'llms', label: 'LLMs' },
  { value: 'agents', label: 'Agents' },
  { value: 'rag', label: 'RAG' },
  { value: 'vision', label: 'Vision' },
  { value: 'multimodal', label: 'Multimodal' },
  { value: 'rl', label: 'RL' },
];

const DIFFICULTY_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const DATE_OPTIONS = [
  { value: '', label: 'All Time' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export default function ResearchFeedClient({ initialPapers, initialCount, trendingPapers, stats }: ResearchFeedClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [papers, setPapers] = useState<Paper[]>(initialPapers);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialCount > initialPapers.length);

  const [tab, setTab] = useState(searchParams.get('tab') || '');
  const [hasCode, setHasCode] = useState(searchParams.get('has_code') === 'true');
  const [trendingOnly, setTrendingOnly] = useState(searchParams.get('trending') === 'true');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [dateRange, setDateRange] = useState(searchParams.get('date') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const hasFetched = useRef(false);
  const fetchGeneration = useRef(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update URL
  const updateUrl = useCallback((params: Record<string, string>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    const queryString = query.toString();
    router.push(`/research${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [router]);

  // Fetch papers when filters change
  useEffect(() => {
    fetchGeneration.current++;
    const gen = fetchGeneration.current;

    const fetchPapers = async () => {
      setLoading(true);
      setPage(1);
      try {
        const params = new URLSearchParams({ page: '1', page_size: '20' });
        if (tab) params.set('tab', tab);
        if (hasCode) params.set('has_code', 'true');
        if (trendingOnly) params.set('trending', 'true');
        if (difficulty) params.set('difficulty', difficulty);
        if (dateRange) params.set('date_range', dateRange);
        if (search) params.set('search', search);

        const res = await fetch(`${API_URL}/api/v1/papers/?${params}`);
        if (gen !== fetchGeneration.current) return;
        if (res.ok) {
          const data = await res.json();
          setPapers(data.results || []);
          setTotalCount(data.count || 0);
          setHasMore(!!data.next);
          hasFetched.current = true;

          const urlParams: Record<string, string> = {};
          if (tab) urlParams.tab = tab;
          if (hasCode) urlParams.has_code = 'true';
          if (trendingOnly) urlParams.trending = 'true';
          if (difficulty) urlParams.difficulty = difficulty;
          if (dateRange) urlParams.date = dateRange;
          if (search) urlParams.search = search;
          updateUrl(urlParams);
        } else {
          setPapers([]);
          setTotalCount(0);
          setHasMore(false);
        }
      } catch {
        if (gen !== fetchGeneration.current) return;
        setPapers([]);
        setTotalCount(0);
      }
      if (gen !== fetchGeneration.current) return;
      setLoading(false);
    };

    const isInitial =
      !hasFetched.current &&
      !tab && !hasCode && !trendingOnly && !difficulty && !dateRange && !search &&
      initialPapers.length > 0;

    if (!isInitial) {
      fetchPapers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, hasCode, trendingOnly, difficulty, dateRange, search]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const gen = fetchGeneration.current;
    const nextPage = page + 1;
    try {
      const params = new URLSearchParams({ page: nextPage.toString(), page_size: '20' });
      if (tab) params.set('tab', tab);
      if (hasCode) params.set('has_code', 'true');
      if (trendingOnly) params.set('trending', 'true');
      if (difficulty) params.set('difficulty', difficulty);
      if (dateRange) params.set('date_range', dateRange);
      if (search) params.set('search', search);

      const res = await fetch(`${API_URL}/api/v1/papers/?${params}`);
      if (gen !== fetchGeneration.current) { setLoadingMore(false); return; }
      if (res.ok) {
        const data = await res.json();
        setPapers((prev) => [...prev, ...(data.results || [])]);
        setHasMore(!!data.next);
        setPage(nextPage);
      }
    } catch {
      if (gen !== fetchGeneration.current) { setLoadingMore(false); return; }
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  const clearFilters = () => {
    setTab('');
    setHasCode(false);
    setTrendingOnly(false);
    setDifficulty('');
    setDateRange('');
    setSearch('');
    setSearchInput('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">AI Research Papers</h1>
        <p className="text-[var(--gray-400)] text-lg max-w-2xl mx-auto mb-4">
          Stay current with the latest AI research. Updated daily from arXiv and HuggingFace.
        </p>
        {stats && (
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-sm text-[var(--gray-500)] bg-[var(--gray-900)] px-3 py-1 rounded-full border border-[var(--gray-800)]">
              {stats.total_papers.toLocaleString()} papers
            </span>
            {stats.total_authors != null && stats.total_authors > 0 && (
              <span className="text-sm text-[var(--gray-500)] bg-[var(--gray-900)] px-3 py-1 rounded-full border border-[var(--gray-800)]">
                {stats.total_authors.toLocaleString()} authors
              </span>
            )}
            {stats.papers_today > 0 && (
              <span className="text-sm text-green-400 bg-green-600/20 px-3 py-1 rounded-full border border-green-600/30">
                +{stats.papers_today} today
              </span>
            )}
            {stats.papers_this_week > 0 && (
              <span className="text-sm text-[var(--gray-500)] bg-[var(--gray-900)] px-3 py-1 rounded-full border border-[var(--gray-800)]">
                {stats.papers_this_week} this week
              </span>
            )}
          </div>
        )}
      </div>

      {/* Trending section */}
      {trendingPapers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Trending this week</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
            {trendingPapers.map((paper) => (
              <PaperCard key={paper.arxiv_id} paper={paper} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search papers..."
            className="w-full px-6 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-900)] border border-[var(--gray-700)] text-white"
          />
          <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORY_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === t.value
                ? 'bg-copper text-white'
                : 'bg-[var(--gray-900)] text-[var(--gray-400)] border border-[var(--gray-700)] hover:border-[var(--gray-600)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Toggle pills + filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setHasCode(!hasCode)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            hasCode
              ? 'bg-green-600/30 text-green-400 border border-green-500/50'
              : 'bg-[var(--gray-900)] text-[var(--gray-500)] border border-[var(--gray-800)] hover:border-[var(--gray-700)]'
          }`}
        >
          Has Code
        </button>
        <button
          onClick={() => setTrendingOnly(!trendingOnly)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            trendingOnly
              ? 'bg-amber-600/30 text-amber-400 border border-amber-500/50'
              : 'bg-[var(--gray-900)] text-[var(--gray-500)] border border-[var(--gray-800)] hover:border-[var(--gray-700)]'
          }`}
        >
          Trending Only
        </button>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm bg-[var(--gray-900)] border border-[var(--gray-700)] text-[var(--gray-400)] focus:outline-none focus:border-copper cursor-pointer"
        >
          {DIFFICULTY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm bg-[var(--gray-900)] border border-[var(--gray-700)] text-[var(--gray-400)] focus:outline-none focus:border-copper cursor-pointer"
        >
          {DATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="mb-4 text-sm text-[var(--gray-400)]">
          Showing {totalCount.toLocaleString()} papers
        </div>
      )}

      {/* Papers feed */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-5 animate-pulse">
              <div className="h-3 bg-[var(--gray-800)] rounded w-24 mb-3" />
              <div className="h-5 bg-[var(--gray-800)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[var(--gray-800)] rounded w-1/2 mb-3" />
              <div className="h-3 bg-[var(--gray-800)] rounded w-full mb-1" />
              <div className="h-3 bg-[var(--gray-800)] rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : papers.length > 0 ? (
        <>
          <div className="space-y-4">
            {papers.map((paper) => (
              <PaperCard key={paper.arxiv_id} paper={paper} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-8 py-3 rounded-lg font-medium transition-colors bg-[var(--gray-800)] text-white border border-[var(--gray-700)] hover:bg-[var(--gray-700)] disabled:opacity-50 cursor-pointer"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--gray-400)] text-lg mb-4">
            No papers found matching your filters. Try broadening your search.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 rounded-lg font-medium transition-colors bg-copper text-white hover:bg-copper-dim cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
