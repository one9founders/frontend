import { SITE_URL } from '@/lib/constants/site';
import { allStacks } from '@/components/features/stacks/stackData';
import llmData from '../../../public/data/llm-models.json';
import type { LLMDataset } from '@/types/llm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';
const LIST_PAGE_SIZE = 100;
const REVALIDATE = 3600;

export const SITEMAP_CHUNK = 2000;

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  results: T[];
};

export function toUrlsetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified.toISOString();
      return `<url><loc>${escapeXml(entry.url)}</loc><lastmod>${lastmod}</lastmod></url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function sitemapXmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchPaginated<T>(url: string): Promise<Paginated<T> | null> {
  const data = await fetchJson<Paginated<T>>(url);
  if (!data || !Array.isArray(data.results) || typeof data.count !== 'number') return null;
  return data;
}

export async function getToolSitemapCount(): Promise<number> {
  const compact = await fetchPaginated<{ slug: string }>(
    `${API_URL}/tools/sitemap/?page=1&page_size=1`,
  );
  if (compact) return compact.count;
  const list = await fetchPaginated<unknown>(`${API_URL}/tools/?page=1&page_size=1`);
  return list?.count ?? 0;
}

export async function getPaperSitemapCount(): Promise<number> {
  const compact = await fetchPaginated<{ arxiv_id: string }>(
    `${API_URL}/api/v1/papers/sitemap/?page=1&page_size=1`,
  );
  if (compact) return compact.count;
  const list = await fetchPaginated<unknown>(`${API_URL}/api/v1/papers/?page=1&page_size=1`);
  return list?.count ?? 0;
}

export async function getSitemapIndexLocs(): Promise<string[]> {
  const [toolCount, paperCount] = await Promise.all([
    getToolSitemapCount(),
    getPaperSitemapCount(),
  ]);
  const toolPages = Math.max(1, Math.ceil(toolCount / SITEMAP_CHUNK));
  const paperPages = Math.max(1, Math.ceil(paperCount / SITEMAP_CHUNK));
  return [
    `${SITE_URL}/sitemaps/static.xml`,
    ...Array.from({ length: toolPages }, (_, i) => `${SITE_URL}/sitemaps/tools-${i + 1}.xml`),
    ...Array.from({ length: paperPages }, (_, i) => `${SITE_URL}/sitemaps/papers-${i + 1}.xml`),
  ];
}

async function listFallbackPage<T>(
  baseUrl: string,
  page: number,
): Promise<T[]> {
  const start = (page - 1) * (SITEMAP_CHUNK / LIST_PAGE_SIZE) + 1;
  const end = start + SITEMAP_CHUNK / LIST_PAGE_SIZE - 1;
  const results: T[] = [];
  for (let listPage = start; listPage <= end; listPage += 1) {
    const data = await fetchPaginated<T>(`${baseUrl}?page=${listPage}&page_size=${LIST_PAGE_SIZE}`);
    if (!data?.results?.length) break;
    results.push(...data.results);
    if (!data.next) break;
  }
  return results;
}

export async function getToolSitemapPage(page: number): Promise<{ slug: string; updated_at?: string }[]> {
  const compact = await fetchPaginated<{ slug: string; updated_at?: string }>(
    `${API_URL}/tools/sitemap/?page=${page}&page_size=${SITEMAP_CHUNK}`,
  );
  if (compact) return compact.results;
  return listFallbackPage(`${API_URL}/tools/`, page);
}

export async function getPaperSitemapPage(
  page: number,
): Promise<{ arxiv_id: string; published_at?: string }[]> {
  const compact = await fetchPaginated<{ arxiv_id: string; published_at?: string }>(
    `${API_URL}/api/v1/papers/sitemap/?page=${page}&page_size=${SITEMAP_CHUNK}`,
  );
  if (compact) return compact.results;
  return listFallbackPage(`${API_URL}/api/v1/papers/`, page);
}

async function collectAll<T>(firstUrl: string, pick: (data: unknown) => T[]): Promise<T[]> {
  const items: T[] = [];
  let nextUrl: string | null = firstUrl;
  while (nextUrl) {
    const payload: Record<string, unknown> | null = await fetchJson<Record<string, unknown>>(nextUrl);
    if (!payload) break;
    items.push(...pick(payload));
    nextUrl = typeof payload.next === 'string' ? payload.next : null;
  }
  return items;
}

export async function getStaticSitemapEntries(): Promise<SitemapEntry[]> {
  const now = new Date();
  const staticPages: { route: string; priority: number; changeFrequency: SitemapEntry['changeFrequency'] }[] = [
    { route: '/', priority: 1.0, changeFrequency: 'daily' },
    { route: '/methodology', priority: 0.8, changeFrequency: 'monthly' },
    { route: '/compare', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/news', priority: 0.7, changeFrequency: 'daily' },
    { route: '/blog', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { route: '/llms', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/llms/compare', priority: 0.6, changeFrequency: 'weekly' },
    { route: '/rag-vector-dbs', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/research', priority: 0.8, changeFrequency: 'daily' },
    { route: '/deals', priority: 0.6, changeFrequency: 'weekly' },
    { route: '/learn', priority: 0.6, changeFrequency: 'weekly' },
    { route: '/learn/courses', priority: 0.6, changeFrequency: 'weekly' },
    { route: '/learn/guides', priority: 0.6, changeFrequency: 'weekly' },
    { route: '/learn/paths', priority: 0.5, changeFrequency: 'monthly' },
    { route: '/learn/labs', priority: 0.5, changeFrequency: 'monthly' },
    { route: '/learn/workshops', priority: 0.5, changeFrequency: 'monthly' },
    { route: '/submit', priority: 0.5, changeFrequency: 'monthly' },
    { route: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { route: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { route: '/worker', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/stack', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/stacks', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/fintech', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/open-source', priority: 0.8, changeFrequency: 'daily' },
    { route: '/new', priority: 0.7, changeFrequency: 'daily' },
    { route: '/agents', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/founder-survey', priority: 0.4, changeFrequency: 'monthly' },
  ];

  const staticEntries = staticPages.map((page) => ({
    url: page.route === '/' ? SITE_URL : `${SITE_URL}${page.route}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const courseCompact = await fetchPaginated<{ slug: string; updated_at?: string }>(
    `${API_URL}/education/courses/sitemap/?page=1&page_size=${SITEMAP_CHUNK}`,
  );

  const [categories, agents, agentCategories, courses, guides, paths, ragTools] = await Promise.all([
    collectAll<{ slug: string }>(`${API_URL}/categories/?page_size=100`, (data) => {
      const rows = Array.isArray(data) ? data : (data as Paginated<{ slug: string }>).results || [];
      return rows.filter((row) => row.slug);
    }),
    collectAll<{ slug: string; updated_at?: string }>(
      `${API_URL}/api/agents/?page_size=100`,
      (data) => (data as Paginated<{ slug: string; updated_at?: string }>).results || [],
    ),
    fetchJson<{ categories?: { slug: string }[] }>(`${API_URL}/api/agents/categories/`).then(
      (data) => data?.categories || [],
    ),
    courseCompact
      ? Promise.resolve(courseCompact.results)
      : collectAll<{ slug: string; updated_at?: string }>(
          `${API_URL}/education/courses/?page_size=100`,
          (data) => (data as Paginated<{ slug: string; updated_at?: string }>).results || [],
        ),
    collectAll<{ slug: string; updated_at?: string }>(
      `${API_URL}/education/guides/?page_size=100`,
      (data) => (data as Paginated<{ slug: string; updated_at?: string }>).results || [],
    ),
    collectAll<{ slug: string }>(`${API_URL}/education/learning-paths/?page_size=100`, (data) => {
      const rows = Array.isArray(data) ? data : (data as Paginated<{ slug: string }>).results || [];
      return rows.filter((row) => row.slug);
    }),
    collectAll<{ slug: string; updated_at?: string }>(
      `${API_URL}/api/v1/rag/tools/?status=active&page_size=200`,
      (data) => (data as Paginated<{ slug: string; updated_at?: string }>).results || [],
    ),
  ]);

  const models = (llmData as unknown as LLMDataset).models || [];

  return [
    ...staticEntries,
    ...categories.map((category) => ({
      url: `${SITE_URL}/tools/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...Object.values(allStacks).map((stack) => ({
      url: `${SITE_URL}/stacks/${stack.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...models.map((model) => ({
      url: `${SITE_URL}/llms/${model.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...agents.map((agent) => ({
      url: `${SITE_URL}/agents/${agent.slug}`,
      lastModified: agent.updated_at ? new Date(agent.updated_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...agentCategories.map((category) => ({
      url: `${SITE_URL}/agents/category/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...courses.map((course) => ({
      url: `${SITE_URL}/learn/courses/${course.slug}`,
      lastModified: course.updated_at ? new Date(course.updated_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...guides.map((guide) => ({
      url: `${SITE_URL}/learn/guides/${guide.slug}`,
      lastModified: guide.updated_at ? new Date(guide.updated_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...paths.map((path) => ({
      url: `${SITE_URL}/learn/paths/${path.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...ragTools.map((tool) => ({
      url: `${SITE_URL}/rag-vector-dbs/${tool.slug}`,
      lastModified: tool.updated_at ? new Date(tool.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];
}
