'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toolsAPI } from '@/lib/api/apiClient';
import { Tool } from '@/types';
import SearchInput from '@/components/shared/SearchInput';
import ToolCard from '@/components/features/tools/ToolCard';
import PricingFilter from '@/components/features/tools/PricingFilter';
import JobClusterFilter from '@/components/features/tools/JobClusterFilter';
import Pagination from '@/components/shared/Pagination';
import {
  activeFilterCount,
  catalogApiQuery,
  catalogHref,
  catalogQueryFromParams,
  catalogQueryKey,
  EMPTY_CATALOG_QUERY,
  SORT_LABELS,
  type CatalogQuery,
  type CatalogSort,
} from '@/lib/catalogQuery';
import { trackCatalogEvent } from '@/lib/catalogEvents';
import Link from 'next/link';

const PAGE_SIZE = 20;
const DEPLOYMENTS = [
  { value: 'web', label: 'Web' },
  { value: 'api', label: 'API' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'self-hosted', label: 'Self-hosted' },
];

export type CatalogInitial = {
  tools: Tool[];
  count: number;
  queryKey: string;
};

function queryIdentity(query: CatalogQuery): string {
  return catalogQueryKey({ ...query, page: 1 });
}

function Top20ToolsInner({ initial }: { initial?: CatalogInitial | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = catalogQueryFromParams(searchParams);
  const queryKey = catalogQueryKey(query);
  const tags = ['All', 'Writing', 'Images', 'Video', 'Code', 'Chatbots', 'Marketing', 'Productivity', 'Design', 'Analytics'];

  const [tools, setTools] = useState<Tool[]>(initial?.tools || []);
  const [totalCount, setTotalCount] = useState(initial?.count || 0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    initial && initial.queryKey === queryKey ? 'ready' : 'loading',
  );
  const [retry, setRetry] = useState(0);
  const [integrationDraft, setIntegrationDraft] = useState(query.integration);
  const queryIds = useRef(new Map<string, string>());
  const trackedSearch = useRef('');
  const skipInitialFetch = useRef(Boolean(initial && initial.queryKey === queryKey));

  useEffect(() => {
    setIntegrationDraft(query.integration);
  }, [query.integration]);

  const replaceQuery = useCallback((next: CatalogQuery) => {
    router.replace(catalogHref(next), { scroll: false });
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    const apiQuery = catalogApiQuery(query);

    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    setStatus('loading');
    toolsAPI
      .getAll({
        q: apiQuery.q,
        category: apiQuery.category,
        pricing_type: apiQuery.pricing_type,
        job_cluster: apiQuery.job_cluster,
        deployment: apiQuery.deployment,
        integration: apiQuery.integration,
        ordering: apiQuery.ordering,
        page: Number(apiQuery.page),
        page_size: PAGE_SIZE,
        track: apiQuery.track,
      })
      .then((data) => {
        if (cancelled) return;
        if (data && typeof data === 'object' && 'results' in data) {
          const rows = data.results || [];
          const count = data.count || 0;
          setTools(rows);
          setTotalCount(count);
          setStatus('ready');
          const identity = queryIdentity(query);
          let queryId = queryIds.current.get(identity);
          if (!queryId) {
            queryId = crypto.randomUUID();
            queryIds.current.set(identity, queryId);
          }
          if (query.q && trackedSearch.current !== identity) {
            trackedSearch.current = identity;
            trackCatalogEvent({
              event_name: 'search_submitted',
              surface: 'directory',
              query_id: queryId,
              context: { sort: query.sort, filter_count: activeFilterCount(query) },
            });
          }
          trackCatalogEvent({
            event_name: 'results_displayed',
            surface: 'directory',
            query_id: queryId,
            context: {
              results_count: count,
              sort: query.sort,
              filter_count: activeFilterCount(query),
            },
          });
        } else if (Array.isArray(data)) {
          setTools(data);
          setTotalCount(data.length);
          setStatus('ready');
        } else {
          setTools([]);
          setTotalCount(0);
          setStatus('error');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setTools([]);
        setTotalCount(0);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
    // initial is only the first server payload; later URL changes refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, retry]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const filtersActive = activeFilterCount(query) > 0 || Boolean(query.q);

  const handleSearch = (text: string) => {
    const q = text.trim();
    const starting = !query.q && Boolean(q);
    replaceQuery({
      ...query,
      q,
      page: 1,
      sort: starting ? 'relevance' : q ? query.sort : query.sort === 'relevance' ? 'name' : query.sort,
    });
  };

  const handleClearSearch = () => {
    replaceQuery({
      ...query,
      q: '',
      page: 1,
      sort: query.sort === 'relevance' ? 'name' : query.sort,
    });
  };

  return (
    <section id="tools-section" className="py-8 md:py-16 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-3 md:mb-4 text-white">Discover tools</h2>
        <p className="text-center text-sm text-[var(--gray-400)] mb-6 md:mb-8 max-w-2xl mx-auto">
          Search, filters, and sort apply before pagination. Counts are the full match, not the 20 rows on this page.
        </p>

        <div className="mb-8 md:mb-12">
          <SearchInput
            onSearch={handleSearch}
            onClear={handleClearSearch}
            loading={status === 'loading'}
            initialValue={query.q}
            placeholder="What job should the tool do?"
          />
        </div>

        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="w-full">
              <h3 className="text-sm font-medium text-[var(--gray-300)] mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={query.category === tag}
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-full transition-colors border cursor-pointer ${
                      query.category === tag
                        ? 'bg-[var(--gray-50)] border-[var(--gray-300)] text-[var(--gray-800)]'
                        : 'bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-300)] hover:text-gray-300 hover:bg-[var(--gray-700)] hover:border-[var(--gray-600)]'
                    }`}
                    onClick={() => replaceQuery({ ...query, category: tag, page: 1 })}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex-1">
                <PricingFilter
                  selectedPricing={query.pricing}
                  onPricingChange={(pricing) => replaceQuery({ ...query, pricing, page: 1 })}
                />
              </div>
              <div className="flex-1">
                <JobClusterFilter
                  selectedClusters={query.jobs}
                  onClustersChange={(jobs) => replaceQuery({ ...query, jobs, page: 1 })}
                />
              </div>
              <div className="flex-1 md:max-w-xs">
                <h3 className="text-sm font-medium text-[var(--gray-300)] mb-3" id="sort-label">Sort by</h3>
                <select
                  aria-labelledby="sort-label"
                  value={query.q ? query.sort : query.sort === 'relevance' ? 'name' : query.sort}
                  onChange={(e) => replaceQuery({ ...query, sort: e.target.value as CatalogSort, page: 1 })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--gray-700)] text-white border border-[var(--gray-600)]"
                >
                  {query.q && <option value="relevance">{SORT_LABELS.relevance}</option>}
                  <option value="name">{SORT_LABELS.name}</option>
                  <option value="rating">{SORT_LABELS.rating}</option>
                  <option value="newest">{SORT_LABELS.newest}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[var(--gray-300)] mb-3">Deployment text</h3>
                <div className="flex flex-wrap gap-2">
                  {DEPLOYMENTS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={query.deployment === option.value}
                      className={`px-3 py-1 text-sm rounded-full border cursor-pointer ${
                        query.deployment === option.value
                          ? 'bg-[var(--gray-50)] text-[var(--gray-800)] border-[var(--gray-300)]'
                          : 'bg-[var(--gray-800)] text-[var(--gray-300)] border-[var(--gray-700)]'
                      }`}
                      onClick={() =>
                        replaceQuery({
                          ...query,
                          deployment: query.deployment === option.value ? '' : option.value,
                          page: 1,
                        })
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--gray-500)]">
                  Matches platform or tag text. It is not a verified deployment audit.
                </p>
              </div>
              <form
                className="flex-1 md:max-w-xs"
                onSubmit={(event) => {
                  event.preventDefault();
                  replaceQuery({ ...query, integration: integrationDraft.trim(), page: 1 });
                }}
              >
                <label htmlFor="integration-filter" className="block text-sm font-medium text-[var(--gray-300)] mb-3">
                  Integration text
                </label>
                <input
                  id="integration-filter"
                  value={integrationDraft}
                  onChange={(event) => setIntegrationDraft(event.target.value)}
                  placeholder="e.g. Slack"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--gray-700)] text-white border border-[var(--gray-600)]"
                />
              </form>
            </div>

            {filtersActive && (
              <button
                type="button"
                className="self-start text-sm text-[var(--copper)] hover:text-[var(--copper-bright)] cursor-pointer"
                onClick={() => replaceQuery(EMPTY_CATALOG_QUERY)}
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 text-[var(--gray-400)] text-sm" role="status" aria-live="polite">
          {status === 'loading' && 'Loading results…'}
          {status === 'error' && 'Results could not be loaded.'}
          {status === 'ready' && totalCount > 0 && (
            `Showing ${((query.page - 1) * PAGE_SIZE) + 1}-${Math.min(query.page * PAGE_SIZE, totalCount)} of ${totalCount.toLocaleString('en-US')} tools`
          )}
          {status === 'ready' && totalCount === 0 && 'No matching tools.'}
        </div>

        {status === 'error' && (
          <div role="alert" className="mb-6 border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100">
            <p>The directory request failed. This is not an empty catalog.</p>
            <button
              type="button"
              className="mt-3 px-3 py-1.5 bg-[var(--paper)] text-[var(--ink)] cursor-pointer"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {status !== 'error' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                position={(query.page - 1) * PAGE_SIZE + index + 1}
                surface="directory"
              />
            ))}
          </div>
        )}

        {status === 'ready' && tools.length === 0 && (
          <div className="text-center text-[var(--gray-400)] mt-8 space-y-3">
            <p>Nothing matched this combination.</p>
            <p className="text-sm">
              <Link href="/solutions" className="text-[var(--copper)]">Browse task guides</Link>
              {' · '}
              <Link href="/services" className="text-[var(--copper)]">Ask for implementation help</Link>
              {' · '}
              <button type="button" className="text-[var(--copper)] cursor-pointer" onClick={() => replaceQuery(EMPTY_CATALOG_QUERY)}>
                Reset filters
              </button>
            </p>
          </div>
        )}

        {status === 'ready' && totalPages > 1 && (
          <Pagination
            currentPage={query.page}
            totalPages={totalPages}
            onPageChange={(page) => {
              replaceQuery({ ...query, page });
              document.querySelector('#tools-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </section>
  );
}

export default function Top20Tools({ initial }: { initial?: CatalogInitial | null }) {
  return (
    <Suspense fallback={
      <section id="tools-section" className="py-8 md:py-16 px-4 md:px-6 bg-[var(--gray-black)]">
        <div className="max-w-7xl mx-auto text-center text-white">Loading tools...</div>
      </section>
    }>
      <Top20ToolsInner initial={initial} />
    </Suspense>
  );
}
