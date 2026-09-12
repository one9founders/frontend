'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toolsAPI } from '@/lib/api/apiClient';
import type { Tool } from '@/types';
import ToolCard from '@/components/features/tools/ToolCard';
import Pagination from '@/components/shared/Pagination';
import SearchInput from '@/components/shared/SearchInput';

const PAGE_SIZE = 24;

function isHackerNewsTool(tool: Tool): boolean {
  if (Array.isArray(tool.tags) && tool.tags.includes('hackernews')) return true;
  if (!Array.isArray(tool.sources)) return false;
  return tool.sources.some((row) => row.source === 'hackernews');
}

function directoryHref(page: number) {
  if (page <= 1) return '/hacker-news';
  return `/hacker-news?page=${page}`;
}

export default function HackerNewsDirectoryClient({
  initialPage,
  initialTools,
  initialCount,
}: {
  initialPage: number;
  initialTools: Tool[];
  initialCount: number;
}) {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[] | null>(null);

  const handlePageChange = (nextPage: number) => {
    router.push(directoryHref(nextPage));
  };

  const handleSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);
    if (!trimmed) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    try {
      const results = await toolsAPI.smartSearch(trimmed);
      const list = Array.isArray(results) ? (results as Tool[]) : [];
      setSearchResults(list.filter(isHackerNewsTool));
    } catch (error) {
      console.error('Hacker News search failed:', error);
      setSearchResults([]);
    }
    setSearching(false);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults(null);
    setSearching(false);
  }, []);

  const visible = searchResults ?? initialTools;
  const totalPages = Math.max(1, Math.ceil(initialCount / PAGE_SIZE));
  const isSearch = searchResults !== null;
  const page = Math.min(Math.max(initialPage, 1), totalPages);

  return (
    <div>
      <div className="text-center max-w-3xl mx-auto mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--copper)] mb-3">
          From the orange site
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Hacker News Directory
        </h1>
        <p className="text-sm md:text-base text-[var(--gray-400)] leading-relaxed">
          AI tools catalogued from Hacker News Show HN and AI threads. Each listing
          credits the original discussion and links to the product site.
        </p>
      </div>

      <div className="mb-8">
        <SearchInput
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={searching}
          placeholder="Search Hacker News tools…"
          label="Search Hacker News tools"
        />
      </div>

      {!searching && (isSearch || initialCount > 0) && (
        <div className="mb-6 text-[var(--gray-400)] text-sm">
          {isSearch
            ? `${visible.length} result${visible.length === 1 ? '' : 's'} for “${searchQuery}”`
            : `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, initialCount)}–${Math.min(page * PAGE_SIZE, initialCount)} of ${initialCount.toLocaleString('en-US')}`}
        </div>
      )}

      {searching ? (
        <div className="text-center text-white py-12">Searching…</div>
      ) : visible.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {visible.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[var(--gray-400)]">
          No Hacker News tools listed yet. Check back after the next catalogue run, or{' '}
          <a href="/#tools-section" className="text-[var(--copper)]">
            browse the full directory
          </a>
          .
        </div>
      )}

      {!isSearch && !searching && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
