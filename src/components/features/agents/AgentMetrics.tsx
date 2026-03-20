import { AgentDetail } from '@/types/agent';

interface AgentMetricsProps {
  agent: AgentDetail;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return num.toLocaleString();
  return num.toString();
}

export default function AgentMetrics({ agent }: AgentMetricsProps) {
  const score = agent.popularity_score || 0;
  const scorePercent = Math.min(score, 100);

  return (
    <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-xl p-5 space-y-5">
      <h3 className="text-lg font-semibold text-white">Metrics</h3>

      {/* Popularity Score */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-[var(--gray-400)]">Popularity Score</span>
          <span className="text-sm font-medium text-white">{score}/100</span>
        </div>
        <div className="w-full h-2 bg-[var(--gray-700)] rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Views */}
      <div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--gray-400)]">Total Views</span>
          <span className="text-sm font-medium text-white">{formatNumber(agent.views)}</span>
        </div>
        <div className="ml-4 mt-1 space-y-0.5">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--gray-500)]">Last 24h</span>
            <span className="text-[var(--gray-400)]">{formatNumber(agent.views_24h)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--gray-500)]">Last 7 days</span>
            <span className="text-[var(--gray-400)]">{formatNumber(agent.views_7d)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--gray-500)]">Last 30 days</span>
            <span className="text-[var(--gray-400)]">{formatNumber(agent.views_30d)}</span>
          </div>
        </div>
      </div>

      {/* Upvotes */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--gray-400)]">Upvotes</span>
        <span className="text-sm font-medium text-white">{formatNumber(agent.upvotes)}</span>
      </div>

      {/* Bookmarks */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--gray-400)]">Bookmarks</span>
        <span className="text-sm font-medium text-white">{formatNumber(agent.bookmark_count)}</span>
      </div>
    </div>
  );
}
