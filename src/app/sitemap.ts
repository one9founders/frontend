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

interface AgentSitemapItem {
  slug: string;
  updated_at?: string;
  category_slug?: string;
}

interface AgentCategoryItem {
  slug: string;
  label: string;
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

async function getAllAgents(): Promise<AgentSitemapItem[]> {
  try {
    const allAgents: AgentSitemapItem[] = [];
    let nextUrl: string | null = `${API_URL}/api/agents/?page_size=500`;
    while (nextUrl) {
      const res: Response = await fetch(nextUrl, { next: { revalidate: 3600 } });
      if (!res.ok) break;
      const data = await res.json();
      allAgents.push(...(data.results || []));
      nextUrl = data.next || null;
    }
    return allAgents;
  } catch {
    return [];
  }
}

async function getAllAgentCategories(): Promise<AgentCategoryItem[]> {
  try {
    const response = await fetch(`${API_URL}/api/agents/categories/`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://one9founders.com';
  
  // Static pages with SEO-optimized priorities
  const staticPages = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/what-is-one9founders', priority: 0.9, changeFrequency: 'monthly' as const },
    { route: '/methodology', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/compare', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/news', priority: 0.7, changeFrequency: 'daily' as const },
    { route: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/learn', priority: 0.6, changeFrequency: 'weekly' as const },
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

  // Fetch tools, categories, agents, and agent categories in parallel
  const [tools, categories, agents, agentCategories] = await Promise.all([
    getAllTools(),
    getAllCategories(),
    getAllAgents(),
    getAllAgentCategories(),
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
    url: `${baseUrl}/tools/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Agent directory page
  const agentDirectoryPage = {
    url: `${baseUrl}/agents`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  };

  // Individual agent pages
  const agentPages = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.slug}`,
    lastModified: agent.updated_at ? new Date(agent.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Agent category pages
  const agentCategoryPages = agentCategories.map((cat) => ({
    url: `${baseUrl}/agents/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, agentDirectoryPage, ...agentCategoryPages, ...agentPages];
}
