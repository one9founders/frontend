'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toolsAPI } from '@/lib/api/apiClient';
import type { Tool, TrackStat } from '@/types';
import Pagination from '@/components/shared/Pagination';
import SearchInput from '@/components/shared/SearchInput';
import OpenSourceTabs from '@/components/features/tools/OpenSourceTabs';
import OpenSourceRepoRow from '@/components/features/tools/OpenSourceRepoRow';
import {
  openSourceHref,
  openSourceTabFromKind,
  type OpenSourceKind,
} from '@/lib/constants/tracks';
import {
  OPEN_SOURCE_LANES,
  countByLane,
  inferOpenSourceLane,
  type OpenSourceLaneId,
} from '@/lib/openSourceLanes';

const PAGE_SIZE = 24;

type SortKey = 'relevant' | 'newest' | 'name';

function countFor(trackCounts: TrackStat[], track: TrackStat['track']) {
  return trackCounts.find((row) => row.track === track)?.count ?? 0;
}

function directoryHref(kind: OpenSourceKind, page: number) {
  const base = openSourceHref(kind);
  if (page <= 1) return base;
  return `${base}${base.includes('?') ? '&' : '?'}page=${page}`;
}

function popularity(tool: Tool): number {
  const raw = tool.popularity_score;
  if (raw == null || raw === '') return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function sortTools(tools: Tool[], sort: SortKey): Tool[] {
  const next = [...tools];
  switch (sort) {
    case 'newest':
      return next.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    case 'name':
      return next.sort((a, b) => a.name.localeCompare(b.name));
    case 'relevant':
    default:
      return next.sort((a, b) => {
        const pop = popularity(b) - popularity(a);
        if (pop !== 0) return pop;
        return (b.views_count || 0) - (a.views_count || 0);
      });
  }
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
  const [lane, setLane] = useState<OpenSourceLaneId | ''>('');
  const [sort, setSort] = useState<SortKey>('relevant');

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

  const baseList = searchResults ?? initialTools;
  const laneCounts = useMemo(() => countByLane(baseList), [baseList]);

  const visible = useMemo(() => {
    const filtered = lane
      ? baseList.filter((tool) => inferOpenSourceLane(tool).id === lane)
      : baseList;
    return sortTools(filtered, sort);
  }, [baseList, lane, sort]);

  const totalPages = Math.max(1, Math.ceil(initialCount / PAGE_SIZE));
  const isSearch = searchResults !== null;
  const page = Math.min(Math.max(initialPage, 1), totalPages);
  const activeLane = OPEN_SOURCE_LANES.find((row) => row.id === lane);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10 md:mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--copper)] mb-3">
          Clone · self-host · ship
        </p>
        <h1 className="font-display text-3xl md:text-5xl text-[var(--paper)] mb-4 max-w-3xl leading-[1.1]">
          Open repos founders can actually run
        </h1>
        <p className="text-sm md:text-base text-[var(--gray-400)] leading-relaxed max-w-2xl">
          Scan by job first — local models, agents, RAG, MCP — then open the repo.
          No logos: every listing is GitHub. We surface what it does and which lane it
          fits so you can pick fast.{' '}
          <a
            href="/llms?type=open-weights"
            className="text-[var(--copper)] hover:text-[var(--copper-bright)]"
          >
            Open-weight model cards live in the LLM explorer.
          </a>
        </p>
      </header>

      <OpenSourceTabs counts={counts} active={initialKind} asLinks />

      <p className="text-sm text-[var(--gray-500)] mt-4 mb-6">
        {activeLane ? activeLane.hint : tab.blurb}
      </p>

      <div className="mb-6">
        <SearchInput
          key={initialKind}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={searching}
          placeholder="Search by job, stack, or repo name…"
          label="Search open source"
        />
      </div>

      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gray-500)] mb-3">
          What are you trying to ship?
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Job lanes">
          <button
            type="button"
            onClick={() => setLane('')}
            aria-pressed={lane === ''}
            className={`px-3 py-1.5 text-sm border transition-colors cursor-pointer ${
              lane === ''
                ? 'border-[var(--copper)] text-[var(--paper)] bg-[var(--ink-2)]'
                : 'border-[var(--line)] text-[var(--gray-400)] hover:border-[var(--gray-600)] hover:text-[var(--paper)]'
            }`}
          >
            All lanes
          </button>
          {OPEN_SOURCE_LANES.filter((row) => row.id !== 'other' || laneCounts.other > 0).map(
            (row) => {
              const n = laneCounts[row.id];
              const selected = lane === row.id;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setLane(selected ? '' : row.id)}
                  aria-pressed={selected}
                  title={row.hint}
                  className={`px-3 py-1.5 text-sm border transition-colors cursor-pointer ${
                    selected
                      ? 'border-[var(--copper)] text-[var(--paper)] bg-[var(--ink-2)]'
                      : 'border-[var(--line)] text-[var(--gray-400)] hover:border-[var(--gray-600)] hover:text-[var(--paper)]'
                  }`}
                >
                  {row.label}
                  {n > 0 ? (
                    <span className="ml-1.5 tabular-nums text-[var(--gray-500)]">{n}</span>
                  ) : null}
                </button>
              );
            },
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <p className="text-[var(--gray-400)] text-sm">
          {searching
            ? 'Searching…'
            : isSearch
              ? `${visible.length} match${visible.length === 1 ? '' : 'es'} for “${searchQuery}”`
              : lane
                ? `${visible.length} in this lane on page ${page}`
                : `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, initialCount)}–${Math.min(page * PAGE_SIZE, initialCount)} of ${initialCount.toLocaleString('en-US')}`}
        </p>
        <label className="flex items-center gap-2 text-sm text-[var(--gray-400)]">
          <span className="sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-[var(--ink-2)] border border-[var(--line)] text-[var(--paper)] px-3 py-1.5 text-sm cursor-pointer"
          >
            <option value="relevant">Most relevant</option>
            <option value="newest">Newest first</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      {searching ? (
        <div className="text-center text-[var(--gray-400)] py-16">Searching…</div>
      ) : visible.length > 0 ? (
        <div className="border-t border-[var(--line)]">
          {visible.map((tool) => (
            <OpenSourceRepoRow key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[var(--gray-400)] border-t border-[var(--line)]">
          Nothing in this lane yet. Try another filter, or{' '}
          <a href="/#tools-section" className="text-[var(--copper)]">
            browse hosted AI tools
          </a>
          .
        </div>
      )}

      {!isSearch && !searching && !lane && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
