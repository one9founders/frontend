import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

interface ToolSitemapItem {
  slug: string;
  updated_at?: string;
}

async function getAllToolSlugs(): Promise<ToolSitemapItem[]> {
  try {
    const response = await fetch(`${API_URL}/tools/?page_size=100`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://one9founders.com';
  
  const staticPages = [
    '',
    '/about',
    '/deals',
    '/news',
    '/submit',
    '/terms',
    '/policy',
    '/internship',
    '/campus-internship',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const tools = await getAllToolSlugs();
  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tool/${tool.slug}`,
    lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...toolPages];
}
