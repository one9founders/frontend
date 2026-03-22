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

export async function getPaperStats() {
  const res = await fetch(`${API_URL}/api/v1/papers/stats/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getRelatedPapers(arxivId: string) {
  const res = await fetch(`${API_URL}/api/v1/papers/${arxivId}/related/`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  return res.json();
}
