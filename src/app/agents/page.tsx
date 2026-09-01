import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AgentsDirectoryClient from '@/components/features/agents/AgentsDirectoryClient';
import { AgentListResponse, AgentCategoriesResponse, AgentStats } from '@/types/agent';
import { fetchDirectoryStats } from '@/lib/api/toolsStats';
import { formatToolCount, withLiveCount } from '@/lib/constants/stats';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { siteUrl } from '@/lib/constants/site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const stats = await fetchDirectoryStats();
  const agentCount = formatToolCount(stats?.agent_count);
  const title = agentCount
    ? `${agentCount} AI Agents Directory`
    : 'AI Agents Directory';
  const description = `Browse ${withLiveCount(stats?.agent_count, 'AI agents')} that go beyond chat. Autonomous tools for coding, sales, support, research, and operations. Filtered by category, use case, and pricing. Updated weekly.`;
  return generateSEO({
    title,
    description,
    path: '/agents',
  });
}

async function fetchInitialData() {
  try {
    const [agentsRes, categoriesRes, statsRes] = await Promise.all([
      fetch(`${API_URL}/api/agents/?page=1&page_size=24&sort=popular`, { next: { revalidate: 300 } }),
      fetch(`${API_URL}/api/agents/categories/`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/agents/stats/`, { next: { revalidate: 3600 } }),
    ]);

    const agents: AgentListResponse = agentsRes.ok ? await agentsRes.json() : { count: 0, next: null, previous: null, results: [] };
    const categories: AgentCategoriesResponse = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };
    const stats: AgentStats | null = statsRes.ok ? await statsRes.json() : null;

    return { agents, categories: categories.categories || [], stats };
  } catch (error) {
    console.error('Error fetching initial agents data:', error);
    return { agents: { count: 0, next: null, previous: null, results: [] }, categories: [], stats: null };
  }
}

export default async function AgentsPage() {
  const { agents, categories, stats } = await fetchInitialData();
  const structuredData = generateStructuredData({
    '@type': 'CollectionPage',
    name: 'AI Agents Directory',
    url: siteUrl('/agents'),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: agents.count,
      itemListElement: agents.results.slice(0, 20).map((agent, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: agent.name,
        url: siteUrl(`/agents/${agent.slug}`),
      })),
    },
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="py-8 md:py-12 px-4 md:px-6">
        <Suspense fallback={<div className="text-center text-white py-20">Loading agents...</div>}>
          <AgentsDirectoryClient
            initialAgents={agents.results}
            initialCount={agents.count}
            initialCategories={categories}
            initialStats={stats}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
