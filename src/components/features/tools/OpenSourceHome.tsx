import Link from 'next/link';
import type { Tool, TrackStat } from '@/types';
import ToolCard from '@/components/features/tools/ToolCard';
import { openSourceHref } from '@/lib/constants/tracks';
import { formatToolCount } from '@/lib/constants/stats';
import OpenSourceTabs from '@/components/features/tools/OpenSourceTabs';

function countFor(trackCounts: TrackStat[], track: TrackStat['track']) {
  return trackCounts.find((row) => row.track === track)?.count ?? 0;
}

export default function OpenSourceHome({
  initialTools,
  initialCount,
  trackCounts,
}: {
  initialTools: Tool[];
  initialCount: number;
  trackCounts: TrackStat[];
}) {
  const repoCount = initialCount || countFor(trackCounts, 'open_source');
  const skillCount = countFor(trackCounts, 'agent_skill');
  const mcpCount = countFor(trackCounts, 'mcp_server');
  const formatted = formatToolCount(repoCount);

  if (!initialTools.length && repoCount === 0 && skillCount === 0 && mcpCount === 0) {
    return null;
  }

  return (
    <section
      id="open-source-section"
      className="py-8 md:py-16 px-4 md:px-6 bg-[var(--ink-2)] border-y border-[var(--line)]"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--copper)] text-center mb-3">
          Free to run
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-3 text-white">
          Open Source Directory
        </h2>
        <p className="text-center text-sm text-[var(--gray-400)] mb-8 max-w-2xl mx-auto leading-relaxed">
          {formatted ? `${formatted} GitHub repos` : 'GitHub repos'}, skills.md packs, and MCP servers
          you can clone and run locally or over an API. Built for developers and teams who cannot buy
          a hosted seat.
        </p>

        <OpenSourceTabs
          counts={{ repos: repoCount, skills: skillCount, mcp: mcpCount }}
          active="repos"
          asLinks
        />

        {initialTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-8">
            {initialTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--gray-500)] mt-8">
            Open-source listings are being classified. Check back shortly.
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={openSourceHref('repos')}
            className="px-4 py-2.5 text-sm font-medium bg-[var(--copper)] text-[var(--ink)] hover:bg-[var(--copper-bright)]"
          >
            Browse all open source
          </Link>
          <Link
            href="/llms?type=open-weights"
            className="px-4 py-2.5 text-sm font-medium border border-[var(--line)] text-[var(--paper)] hover:border-[var(--copper-dim)] hover:text-[var(--copper)]"
          >
            Open-weight models
          </Link>
        </div>
      </div>
    </section>
  );
}
