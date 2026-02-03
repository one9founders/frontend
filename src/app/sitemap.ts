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
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/methodology', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/compare', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/deals', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/news', priority: 0.7, changeFrequency: 'daily' as const },
    { route: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/submit', priority: 0.5, changeFrequency: 'monthly' as const },
    { route: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { route: '/policy', priority: 0.3, changeFrequency: 'yearly' as const },
    { route: '/internship', priority: 0.5, changeFrequency: 'monthly' as const },
  ].map((page) => ({
    url: `${baseUrl}${page.route}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
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
