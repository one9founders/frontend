import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

interface ToolSitemapItem {
  slug: string;
  updated_at?: string;
  categories?: { slug: string; name: string }[];
}

interface CategoryItem {
  slug: string;
  name: string;
}

async function getAllTools(): Promise<ToolSitemapItem[]> {
  try {
    const response = await fetch(`${API_URL}/tools/?page_size=500`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch {
    return [];
  }
}

async function getAllCategories(): Promise<CategoryItem[]> {
  try {
    const response = await fetch(`${API_URL}/categories/`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://one9founders.com';
  
  // Static pages with SEO-optimized priorities
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

  // Fetch tools and categories in parallel
  const [tools, categories] = await Promise.all([
    getAllTools(),
    getAllCategories(),
  ]);

  // Tool pages - high priority for individual tool SEO
  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tool/${tool.slug}`,
    lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages - important for content hub strategy
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
