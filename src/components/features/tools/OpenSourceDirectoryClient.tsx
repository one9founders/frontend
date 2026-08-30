'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toolsAPI } from '@/lib/api/apiClient';
import type { Tool, TrackStat } from '@/types';
import ToolCard from '@/components/features/tools/ToolCard';
import Pagination from '@/components/shared/Pagination';
import SearchInput from '@/components/shared/SearchInput';
import OpenSourceTabs from '@/components/features/tools/OpenSourceTabs';
import {
  openSourceHref,
  openSourceTabFromKind,
  type OpenSourceKind,
} from '@/lib/constants/tracks';

const PAGE_SIZE = 24;

function countFor(trackCounts: TrackStat[], track: TrackStat['track']) {
  return trackCounts.find((row) => row.track === track)?.count ?? 0;
}

function directoryHref(kind: OpenSourceKind, page: number) {
  const base = openSourceHref(kind);
  if (page <= 1) return base;
  return `${base}${base.includes('?') ? '&' : '?'}page=${page}`;
}

export default function OpenSourceDirectoryClient({
  initialKind,
  initialPage,
  initialTools,
  initialCount,
  trackCounts,
}: {
  initialKind: OpenSourceKind;
  initialPage: number;
  initialTools: Tool[];
  initialCount: number;
  trackCounts: TrackStat[];
}) {
  const router = useRouter();
  const tab = openSourceTabFromKind(initialKind);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[] | null>(null);

  const counts = {
    repos: countFor(trackCounts, 'open_source') || (initialKind === 'repos' ? initialCount : 0),
    skills: countFor(trackCounts, 'agent_skill') || (initialKind === 'skills' ? initialCount : 0),
    mcp: countFor(trackCounts, 'mcp_server') || (initialKind === 'mcp' ? initialCount : 0),
  };

  const handlePageChange = (nextPage: number) => {
    router.push(directoryHref(initialKind, nextPage));
  };

  const handleSearch = useCallback(
    async (query: string) => {
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
        setSearchResults(list.filter((tool) => tool.track === tab.track));
      } catch (error) {
        console.error('Open source search failed:', error);
        setSearchResults([]);
      }
      setSearching(false);
    },
    [tab.track],
  );

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
          Free to run
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Open Source Directory
        </h1>
        <p className="text-sm md:text-base text-[var(--gray-400)] leading-relaxed">
          Repos, SKILL.md packs, and MCP servers you can clone, self-host, or call as an API.
          For developers and teams who cannot buy a hosted seat.{' '}
          <a href="/llms?type=open-weights" className="text-[var(--copper)] hover:text-[var(--copper-bright)]">
            Open-weight models live in the LLM explorer.
          </a>
        </p>
      </div>

      <OpenSourceTabs counts={counts} active={initialKind} asLinks />

      <p className="text-center text-sm text-[var(--gray-500)] mt-4 mb-8">
        {tab.blurb}
      </p>

      <div className="mb-8">
        <SearchInput
          key={initialKind}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={searching}
          placeholder="Search repos, skills, MCP servers…"
          label="Search open source"
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
          Nothing in this lane yet. Try another tab, or{' '}
          <a href="/#tools-section" className="text-[var(--copper)]">
            browse hosted AI tools
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
