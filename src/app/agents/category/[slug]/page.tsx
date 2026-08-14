import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AgentsDirectoryClient from '@/components/features/agents/AgentsDirectoryClient';
import { AgentListResponse, AgentCategoriesResponse, AgentCategory, AgentStats } from '@/types/agent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchCategoryData(categorySlug: string) {
  try {
    const [agentsRes, categoriesRes, statsRes] = await Promise.all([
      fetch(`${API_URL}/api/agents/?category=${encodeURIComponent(categorySlug)}&page=1&page_size=24&sort=popular`, { next: { revalidate: 300 } }),
      fetch(`${API_URL}/api/agents/categories/`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/agents/stats/`, { next: { revalidate: 3600 } }),
    ]);

    const agents: AgentListResponse = agentsRes.ok ? await agentsRes.json() : { count: 0, next: null, previous: null, results: [] };
    const categoriesData: AgentCategoriesResponse = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };
    const stats: AgentStats | null = statsRes.ok ? await statsRes.json() : null;

    const categories = categoriesData.categories || [];
    const currentCategory = categories.find((c: AgentCategory) => c.slug === categorySlug);

    return { agents, categories, stats, currentCategory };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      agents: { count: 0, next: null, previous: null, results: [] },
      categories: [],
      stats: null,
      currentCategory: undefined,
    };
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { currentCategory, agents } = await fetchCategoryData(slug);
  const label = currentCategory?.label || slug.replace(/-/g, ' ');
  const count = currentCategory?.agent_count
    ?? (agents.count > 0 ? agents.count : null);
  const title = count != null
    ? `Top ${label} AI Agents (${count}+) | One9Founders`
    : `Top ${label} AI Agents | One9Founders`;
  const description = count != null
    ? `Explore ${count}+ ${label} AI agents. Compare features, pricing, and ratings. Security-validated by One9Founders.`
    : `Explore ${label} AI agents. Compare features, pricing, and ratings. Security-validated by One9Founders.`;

  return {
    title,
    description,
    openGraph: {
      title: `Top ${label} AI Agents | One9Founders`,
      description: count != null
        ? `Explore ${count}+ ${label} AI agents. Compare features, pricing, and ratings.`
        : `Explore ${label} AI agents. Compare features, pricing, and ratings.`,
      type: 'website',
      url: `https://one9founders.com/agents/category/${slug}`,
    },
    alternates: {
      canonical: `https://one9founders.com/agents/category/${slug}`,
    },
  };
}

export default async function AgentCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { agents, categories, stats, currentCategory } = await fetchCategoryData(slug);

  if (!currentCategory && agents.count === 0) {
    notFound();
  }

  const label = currentCategory?.label || slug.replace(/-/g, ' ');

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'AI Agents', path: '/agents' },
    { name: label, path: `/agents/category/${slug}` },
  ];

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <Breadcrumbs items={breadcrumbs} />
      <main className="py-8 md:py-12 px-4 md:px-6">
        <Suspense fallback={<div className="text-center text-white py-20">Loading agents...</div>}>
          <AgentsDirectoryClient
            key={slug}
            initialAgents={agents.results}
            initialCount={agents.count}
            initialCategories={categories}
            initialStats={stats}
            presetCategory={slug}
            categoryLabel={label}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
