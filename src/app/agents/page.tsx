import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AgentsDirectoryClient from '@/components/features/agents/AgentsDirectoryClient';
import { AgentListResponse, AgentCategoriesResponse, AgentStats } from '@/types/agent';
import { fetchDirectoryStats } from '@/lib/api/toolsStats';
import { formatToolCount, withLiveCount } from '@/lib/constants/stats';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const stats = await fetchDirectoryStats();
  const agentCount = formatToolCount(stats?.agent_count);
  const title = agentCount
    ? `${agentCount} AI Agents Directory | Autonomous AI Tools | One9Founders`
    : 'AI Agents Directory | Autonomous AI Tools | One9Founders';
  const description = `Browse ${withLiveCount(stats?.agent_count, 'AI agents')} that go beyond chat. Autonomous tools for coding, sales, support, research, and operations. Filtered by category, use case, and pricing. Updated weekly.`;
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description: `Browse ${withLiveCount(stats?.agent_count, 'AI agents')} that go beyond chat. Autonomous tools for coding, sales, support, research, and operations.`,
      type: 'website',
      url: 'https://one9founders.com/agents',
    },
    alternates: {
      canonical: 'https://one9founders.com/agents',
    },
  };
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

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
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
