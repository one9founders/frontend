'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RagTool } from '@/types/rag';
import RagToolCard from './RagToolCard';

interface RagDirectoryClientProps {
  initialTools: RagTool[];
  initialCount: number;
}

const CATEGORY_TABS = [
  { value: '', label: 'All' },
  { value: 'vector_db', label: 'Vector Databases' },
  { value: 'rag_framework', label: 'RAG Frameworks' },
  { value: 'embedding_model', label: 'Embedding Models' },
];

const PRICING_TABS = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
  { value: 'open_source', label: 'Open Source' },
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating' },
  { value: 'stars', label: 'GitHub Stars' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name A-Z' },
];

export default function RagDirectoryClient({ initialTools, initialCount }: RagDirectoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [pricing, setPricing] = useState(searchParams.get('pricing') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const isFirstRender = useRef(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update URL when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (pricing) query.set('pricing', pricing);
    if (sort && sort !== 'rating') query.set('sort', sort);
    if (search) query.set('search', search);
    const queryString = query.toString();
    router.replace(`/rag-vector-dbs${queryString ? `?${queryString}` : ''}`, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, pricing, sort, search]);

  // Client-side filtering and sorting
  const filteredTools = useMemo(() => {
    let tools = [...initialTools];

    if (category) {
      tools = tools.filter((t) => t.category === category);
    }
    if (pricing) {
      tools = tools.filter((t) => t.pricing_model === pricing);
    }
    if (search) {
      const q = search.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case 'stars':
        tools.sort((a, b) => b.github_stars - a.github_stars);
        break;
      case 'newest':
        tools.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'name':
        tools.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
      default:
        tools.sort((a, b) => b.overall_rating - a.overall_rating);
        break;
    }

    return tools;
  }, [initialTools, category, pricing, sort, search]);

  const clearFilters = () => {
    setCategory('');
    setPricing('');
    setSort('rating');
    setSearch('');
    setSearchInput('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">RAG & Vector DBs</h1>
        <p className="text-[var(--gray-400)] text-lg max-w-2xl mx-auto">
          Build smarter retrieval systems. Explore {initialCount > 0 ? `${initialCount}+ ` : ''}vector databases, RAG frameworks, and embedding models.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search RAG & Vector DBs..."
            className="w-full px-6 py-4 text-lg rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-900)] border border-[var(--gray-700)] text-white"
          />
          <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              category === tab.value
                ? 'bg-copper text-white'
                : 'bg-[var(--gray-900)] text-[var(--gray-400)] border border-[var(--gray-700)] hover:border-[var(--gray-600)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pricing pills + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {PRICING_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setPricing(tab.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                pricing === tab.value
                  ? 'bg-copper/30 text-copper border border-copper/50'
                  : 'bg-[var(--gray-900)] text-[var(--gray-500)] border border-[var(--gray-800)] hover:border-[var(--gray-700)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm bg-[var(--gray-900)] border border-[var(--gray-700)] text-[var(--gray-400)] focus:outline-none focus:border-copper cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-[var(--gray-400)]">
        Showing {filteredTools.length} results
      </div>

      {/* Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredTools.map((tool) => (
            <RagToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--gray-400)] text-lg mb-4">
            No results found matching your filters. Try broadening your search.
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
