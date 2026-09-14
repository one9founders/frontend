import Link from 'next/link';
import type { Tool, TrackStat } from '@/types';
import { openSourceHref } from '@/lib/constants/tracks';
import { formatToolCount } from '@/lib/constants/stats';
import OpenSourceTabs from '@/components/features/tools/OpenSourceTabs';
import OpenSourceRepoRow from '@/components/features/tools/OpenSourceRepoRow';

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
      className="py-10 md:py-16 px-4 md:px-6 bg-[var(--ink-2)] border-y border-[var(--line)]"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--copper)] mb-3">
          Clone · self-host · ship
        </p>
        <h2 className="font-display text-2xl md:text-4xl text-[var(--paper)] mb-3 max-w-2xl leading-tight">
          Open repos founders can actually run
        </h2>
        <p className="text-sm text-[var(--gray-400)] mb-8 max-w-2xl leading-relaxed">
          {formatted ? `${formatted} GitHub repos` : 'GitHub repos'}, skills, and MCP
          servers — sorted by what you are trying to ship, not by favicon. No logos;
          every row is a repo you can open.
        </p>

        <OpenSourceTabs
          counts={{ repos: repoCount, skills: skillCount, mcp: mcpCount }}
          active="repos"
          asLinks
        />

        {initialTools.length > 0 ? (
          <div className="mt-2 border-t border-[var(--line)]">
            {initialTools.slice(0, 6).map((tool) => (
              <OpenSourceRepoRow key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--gray-500)] mt-8">
            Open-source listings are being classified. Check back shortly.
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link
            href={openSourceHref('repos')}
            className="px-4 py-2.5 text-sm font-medium bg-[var(--copper)] text-[var(--ink)] hover:bg-[var(--copper-bright)]"
          >
            Browse by job lane
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
