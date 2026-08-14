import { Paper, PaperListResponse, PaperStats } from '@/types/paper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export async function getPapers(params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(`${API_URL}/api/v1/papers/?${searchParams}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { count: 0, next: null, previous: null, results: [] };
  return res.json();
}

export async function getPaper(arxivId: string) {
  const res = await fetch(`${API_URL}/api/v1/papers/${arxivId}/`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getTrendingPapers() {
  const res = await fetch(`${API_URL}/api/v1/papers/trending/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getPaperStats(): Promise<PaperStats | null> {
  const res = await fetch(`${API_URL}/api/v1/papers/stats/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getAllPapersForSitemap(): Promise<Pick<Paper, 'arxiv_id' | 'published_at'>[]> {
  try {
    const pageSize = 100;
    const firstRes = await fetch(`${API_URL}/api/v1/papers/?page=1&page_size=${pageSize}`, {
      next: { revalidate: 3600 },
    });
    if (!firstRes.ok) return [];

    const first: PaperListResponse = await firstRes.json();
    const papers = [...(first.results || [])];
    const totalPages = Math.ceil((first.count || 0) / pageSize);
    const batchSize = 10;

    for (let start = 2; start <= totalPages; start += batchSize) {
      const end = Math.min(start + batchSize - 1, totalPages);
      const pages = await Promise.all(
        Array.from({ length: end - start + 1 }, (_, i) =>
          fetch(`${API_URL}/api/v1/papers/?page=${start + i}&page_size=${pageSize}`, {
            next: { revalidate: 3600 },
          }).then((res) => (res.ok ? res.json() : { results: [] })).catch(() => ({ results: [] }))
        )
      );
      for (const data of pages) {
        papers.push(...(data.results || []));
      }
    }

    return papers.map((paper) => ({
      arxiv_id: paper.arxiv_id,
      published_at: paper.published_at,
    }));
  } catch {
    return [];
  }
}

export async function getRelatedPapers(arxivId: string) {
  const res = await fetch(`${API_URL}/api/v1/papers/${arxivId}/related/`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  return res.json();
}
