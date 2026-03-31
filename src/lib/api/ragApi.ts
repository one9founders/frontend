const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export async function getRagTools(params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(`${API_URL}/api/v1/rag/tools/?${searchParams}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { count: 0, next: null, previous: null, results: [] };
  return res.json();
}

export async function getRagTool(slug: string) {
  const res = await fetch(`${API_URL}/api/v1/rag/tools/${slug}/`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getRagCategories() {
  const res = await fetch(`${API_URL}/api/v1/rag/categories/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function compareRagTools(slugs: string[]) {
  const params = slugs.map((s) => `slugs=${s}`).join('&');
  const res = await fetch(`${API_URL}/api/v1/rag/compare/?${params}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getRagToolSimilar(slug: string) {
  const res = await fetch(`${API_URL}/api/v1/rag/tools/${slug}/similar/`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  return res.json();
}
