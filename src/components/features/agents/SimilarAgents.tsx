'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { agentsAPI } from '@/lib/api/apiClient';
import { AgentListItem } from '@/types/agent';
import ToolLogo from '@/components/shared/ToolLogo';

interface SimilarAgentsProps {
  categorySlug: string;
  currentSlug: string;
}

export default function SimilarAgents({ categorySlug, currentSlug }: SimilarAgentsProps) {
  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await agentsAPI.getAll({
          category: categorySlug,
          page_size: 7,
          sort: 'popular',
        });
        const results: AgentListItem[] = data?.results || [];
        setAgents(results.filter((a: AgentListItem) => a.slug !== currentSlug).slice(0, 6));
      } catch {
        setAgents([]);
      }
      setLoading(false);
    }
    if (categorySlug) {
      load();
    } else {
      setLoading(false);
    }
  }, [categorySlug, currentSlug]);

  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-bold text-white mb-4">Similar Agents</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40 h-24 rounded-lg bg-[var(--gray-800)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (agents.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-white mb-4">Similar Agents</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {agents.map((agent) => (
          <Link
            key={agent.slug}
            href={`/agents/${agent.slug}`}
            className="flex-shrink-0 w-44 rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-3 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <ToolLogo logoUrl={agent.logo_url} name={agent.name} size="xs" />
              <span className="text-sm font-medium text-white truncate">{agent.name}</span>
            </div>
            {agent.popularity_score > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 bg-[var(--gray-700)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${Math.min(agent.popularity_score, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--gray-400)]">{agent.popularity_score}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
