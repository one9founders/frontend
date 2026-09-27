import { AgentDetail } from '@/types/agent';
import PopularityReadout from '@/components/features/tools/PopularityReadout';

interface AgentMetricsProps {
  agent: AgentDetail;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return num.toLocaleString();
  return num.toString();
}

export default function AgentMetrics({ agent }: AgentMetricsProps) {
  return (
    <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-xl p-5 space-y-5">
      <h3 className="text-lg font-semibold text-white">Listing activity</h3>
      <PopularityReadout score={agent.popularity_score} payload={agent.popularity} />

      <div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--gray-400)]">Total views</span>
          <span className="text-sm font-medium text-white">{formatNumber(agent.views || 0)}</span>
        </div>
        <div className="ml-4 mt-1 space-y-0.5">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--gray-500)]">Last 24h</span>
            <span className="text-[var(--gray-400)]">{formatNumber(agent.views_24h || 0)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--gray-500)]">Last 7 days</span>
            <span className="text-[var(--gray-400)]">{formatNumber(agent.views_7d || 0)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--gray-500)]">Last 30 days</span>
            <span className="text-[var(--gray-400)]">{formatNumber(agent.views_30d || 0)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--gray-400)]">Upvotes</span>
        <span className="text-sm font-medium text-white">{formatNumber(agent.upvotes || 0)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--gray-400)]">Bookmarks</span>
        <span className="text-sm font-medium text-white">{formatNumber(agent.bookmark_count || 0)}</span>
      </div>
      <p className="text-xs text-[var(--gray-500)]">
        Views and votes are directory activity. They are not an editorial rating.
      </p>
    </div>
  );
}
