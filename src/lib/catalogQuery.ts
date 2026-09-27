export type CatalogSort = 'relevance' | 'name' | 'rating' | 'newest';

export type CatalogQuery = {
  q: string;
  category: string;
  pricing: string[];
  jobs: string[];
  deployment: string;
  integration: string;
  sort: CatalogSort;
  page: number;
};

const SORTS = new Set<CatalogSort>(['relevance', 'name', 'rating', 'newest']);

export const EMPTY_CATALOG_QUERY: CatalogQuery = {
  q: '',
  category: 'All',
  pricing: [],
  jobs: [],
  deployment: '',
  integration: '',
  sort: 'name',
  page: 1,
};

function splitList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function catalogQueryFromParams(params: {
  get(name: string): string | null;
}): CatalogQuery {
  const q = (params.get('q') || '').trim();
  const sortRaw = (params.get('sort') || '').trim() as CatalogSort;
  const sort = SORTS.has(sortRaw) ? sortRaw : q ? 'relevance' : 'name';
  const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
  return {
    q,
    category: params.get('category') || 'All',
    pricing: splitList(params.get('pricing')),
    jobs: splitList(params.get('job')),
    deployment: (params.get('deployment') || '').trim(),
    integration: (params.get('integration') || '').trim(),
    sort,
    page,
  };
}

export function catalogQueryKey(query: CatalogQuery): string {
  return JSON.stringify({
    ...query,
    pricing: [...query.pricing].sort(),
    jobs: [...query.jobs].sort(),
  });
}

export function catalogSearchParams(query: CatalogQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category && query.category !== 'All') params.set('category', query.category);
  if (query.pricing.length) params.set('pricing', query.pricing.join(','));
  if (query.jobs.length) params.set('job', query.jobs.join(','));
  if (query.deployment) params.set('deployment', query.deployment);
  if (query.integration) params.set('integration', query.integration);
  const defaultSort = query.q ? 'relevance' : 'name';
  if (query.sort !== defaultSort) params.set('sort', query.sort);
  if (query.page > 1) params.set('page', String(query.page));
  return params;
}

export function catalogHref(query: CatalogQuery, hash = 'tools-section'): string {
  const params = catalogSearchParams(query);
  const search = params.toString();
  return `/${search ? `?${search}` : ''}#${hash}`;
}

export const SORT_LABELS: Record<CatalogSort, string> = {
  relevance: 'Best match',
  name: 'Name (A–Z)',
  rating: 'Highest editorial score',
  newest: 'Newest listings',
};

export function activeFilterCount(query: CatalogQuery): number {
  return (
    (query.category && query.category !== 'All' ? 1 : 0) +
    query.pricing.length +
    query.jobs.length +
    (query.deployment ? 1 : 0) +
    (query.integration ? 1 : 0)
  );
}

export function catalogApiQuery(query: CatalogQuery): Record<string, string> {
  const params: Record<string, string> = {
    page: String(query.page),
    page_size: '20',
    track: 'ai_tool',
  };
  if (query.q) params.q = query.q;
  if (query.category && query.category !== 'All') params.category = query.category;
  if (query.pricing.length) params.pricing_type = query.pricing.join(',');
  if (query.jobs.length) params.job_cluster = query.jobs.join(',');
  if (query.deployment) params.deployment = query.deployment;
  if (query.integration) params.integration = query.integration;
  if (query.q && (query.sort === 'relevance' || !query.sort)) {
    params.ordering = 'relevance';
  } else if (query.sort === 'rating') {
    params.ordering = '-overall_score';
  } else if (query.sort === 'newest') {
    params.ordering = '-created_at';
  } else {
    params.ordering = 'name';
  }
  return params;
}
