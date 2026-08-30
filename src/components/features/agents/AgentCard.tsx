'use client';

import Link from 'next/link';
import { AgentListItem } from '@/types/agent';
import ToolLogo from '@/components/shared/ToolLogo';
import { HugeiconsIcon, StarIcon } from '@/components/ui/icons';

interface AgentCardProps {
  agent: AgentListItem;
}

function getPricingColor(pricing: string): string {
  switch (pricing?.toLowerCase()) {
    case 'free':
      return 'bg-green-600/20 text-green-400 border-green-600/30';
    case 'freemium':
      return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
    case 'paid':
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    default:
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
  }
}

function getAccessColor(access: string): string {
  switch (access?.toLowerCase()) {
    case 'open source':
      return 'bg-green-600/20 text-green-400 border-green-600/30';
    case 'closed source':
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    case 'api':
      return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
    default:
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
  }
}

export default function AgentCard({ agent }: AgentCardProps) {
  const score = agent.popularity_score || 0;
  const scorePercent = Math.min(score, 100);

  return (
    <Link href={`/agents/${agent.slug}`}>
      <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-4 hover:border-copper/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full">
        {/* Header: Logo + Name + Featured Star */}
        <div className="flex items-start gap-3 mb-3">
          <ToolLogo logoUrl={agent.logo_url} name={agent.name} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white truncate">{agent.name}</h3>
              {agent.is_featured && (
                <HugeiconsIcon icon={StarIcon} size={16} className="text-yellow-400 flex-shrink-0" />
              )}
            </div>
            {agent.category_name && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-copper/20 text-copper border border-copper/30">
                {agent.category_name}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--gray-400)] line-clamp-2 leading-relaxed mb-3 flex-1">
          {agent.short_description || 'No description available.'}
        </p>

        {/* Bottom: Badges + Score */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {agent.pricing_model && (
              <span className={`px-2 py-0.5 text-xs rounded-full border ${getPricingColor(agent.pricing_model)}`}>
                {agent.pricing_model}
              </span>
            )}
            {agent.access && (
              <span className={`px-2 py-0.5 text-xs rounded-full border ${getAccessColor(agent.access)}`}>
                {agent.access}
              </span>
            )}
          </div>
          {score > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-[var(--gray-400)]">{score}</span>
              <div className="w-16 h-1.5 bg-[var(--gray-700)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-copper rounded-full"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
