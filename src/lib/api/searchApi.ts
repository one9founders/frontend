const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export async function globalSearch(query: string, types: string[] = ['rag', 'papers']) {
  const params = new URLSearchParams({ q: query, type: types.join(',') });
  const res = await fetch(`${API_URL}/v1/search/?${params}`);
  if (!res.ok) return { rag: [], papers: [] };
  return res.json();
}
