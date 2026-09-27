'use client';

import Link from 'next/link';
import type { Tool } from '@/types';
import { HugeiconsIcon, ArrowUpRight01Icon, GithubIcon } from '@/components/ui/icons';
import { addRefToUrl } from '@/lib/utils/url';
import { cleanRepoBlurb, githubRefForTool } from '@/lib/githubRepo';
import { inferOpenSourceLane } from '@/lib/openSourceLanes';
import { TRACK_LABELS, isSelfHostTrack } from '@/lib/constants/tracks';
import { listingHref } from '@/lib/listingIdentity';
import { trackCatalogEvent } from '@/lib/catalogEvents';

function formatLabel(tool: Tool): string {
  if (tool.track === 'agent_skill') return TRACK_LABELS.agent_skill;
  if (tool.track === 'mcp_server') return TRACK_LABELS.mcp_server;
  return 'Repo';
}

export default function OpenSourceRepoRow({ tool }: { tool: Tool }) {
  const github = githubRefForTool(tool);
  const lane = inferOpenSourceLane(tool);
  const blurb = cleanRepoBlurb(tool.short_description || tool.description);
  const externalUrl = github?.url || tool.website;
  const selfHost = isSelfHostTrack(tool.track);

  const href = listingHref(tool);
  const handleDetails = () => {
    trackCatalogEvent({
      event_name: 'result_selected',
      entity_type: 'tool',
      entity_id: tool.id,
      entity_slug: tool.slug,
      surface: 'open_source_row',
    });
  };

  const handleOpenRepo = () => {
    trackCatalogEvent({
      event_name: 'official_site_click',
      entity_type: 'tool',
      entity_id: tool.id,
      entity_slug: tool.slug,
      surface: 'open_source_row',
    });
  };

  return (
    <article className="group relative grid gap-3 py-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_auto] md:items-start md:gap-6 border-b border-[var(--line)] last:border-b-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--copper)]">
            {lane.label}
          </span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--gray-500)]">
            {formatLabel(tool)}
          </span>
          {tool.startup_friendly && (
            <span className="text-[10px] uppercase tracking-[0.14em] text-emerald-400/90">
              Startup-friendly
            </span>
          )}
        </div>
        <Link
          href={href}
          onClick={handleDetails}
          className="block"
        >
          <h3 className="font-display text-lg md:text-xl text-[var(--paper)] group-hover:text-[var(--copper-bright)] transition-colors truncate">
            {tool.name}
          </h3>
        </Link>
        {github ? (
          <p className="mt-1 font-mono text-xs text-[var(--gray-500)] truncate">
            {github.fullName}
          </p>
        ) : null}
      </div>

      <p className="text-sm md:text-[15px] leading-relaxed text-[var(--gray-400)] line-clamp-2 md:pt-6">
        {blurb || 'No short description yet — open the repo to judge fit.'}
      </p>

      <div className="flex items-center gap-2 md:pt-5 md:justify-end">
        <Link
          href={href}
          onClick={handleDetails}
          className="px-3 py-2 text-xs font-medium border border-[var(--line)] text-[var(--paper)] hover:border-[var(--copper-dim)] hover:text-[var(--copper)] transition-colors"
        >
          Why this fits
        </Link>
        {externalUrl ? (
          <a
            href={addRefToUrl(tool.affiliate_url || externalUrl)}
            target="_blank"
            rel="noopener nofollow"
            onClick={handleOpenRepo}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[var(--copper)] text-[var(--ink)] hover:bg-[var(--copper-bright)] transition-colors"
          >
            <HugeiconsIcon icon={selfHost ? GithubIcon : ArrowUpRight01Icon} size={14} />
            {selfHost ? 'Open repo' : 'Open'}
          </a>
        ) : null}
      </div>
    </article>
  );
}
