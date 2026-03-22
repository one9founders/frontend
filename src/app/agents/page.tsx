import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AgentsDirectoryClient from '@/components/features/agents/AgentsDirectoryClient';
import { AgentListResponse, AgentCategoriesResponse, AgentStats } from '@/types/agent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: '1,200+ AI Agents Directory | Autonomous AI Tools | One9Founders' },
  description: 'Browse 1,200+ AI agents that go beyond chat. Autonomous tools for coding, sales, support, research, and operations. Filtered by category, use case, and pricing. Updated weekly.',
  openGraph: {
    title: '1,200+ AI Agents Directory | Autonomous AI Tools | One9Founders',
    description: 'Browse 1,200+ AI agents that go beyond chat. Autonomous tools for coding, sales, support, research, and operations.',
    type: 'website',
    url: 'https://www.one9founders.com/agents',
  },
  alternates: {
    canonical: 'https://www.one9founders.com/agents',
  },
};

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
        <div className="max-w-7xl mx-auto mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Agents Directory</h1>
          <p className="text-lg text-[var(--gray-300)] mb-2">1,200+ autonomous AI agents across 75+ categories</p>
          <p className="text-sm text-[var(--gray-400)] max-w-2xl mx-auto">
            AI agents go beyond chat. They take action, run multi-step workflows, and integrate with your existing tools. Browse agents for coding, sales, customer support, research, HR, and more.
          </p>
        </div>
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
