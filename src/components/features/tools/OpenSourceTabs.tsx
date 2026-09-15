'use client';

import Link from 'next/link';
import { OPEN_SOURCE_TABS, openSourceHref, type OpenSourceKind } from '@/lib/constants/tracks';
import { formatToolCount } from '@/lib/constants/stats';

type Counts = Partial<Record<OpenSourceKind, number>>;

/**
 * Format switcher: Repo vs Skill vs MCP — what kind of artifact it is.
 * Job lanes (Local models, Agents, …) live separately; this is packaging.
 */
export default function OpenSourceTabs({
  counts,
  active,
  asLinks = false,
  onSelect,
}: {
  counts: Counts;
  active: OpenSourceKind;
  asLinks?: boolean;
  onSelect?: (kind: OpenSourceKind) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Open source format"
      className="flex flex-wrap gap-0 border-b border-[var(--line)]"
    >
      {OPEN_SOURCE_TABS.map((tab) => {
        const selected = tab.kind === active;
        const count = counts[tab.kind];
        const countLabel =
          count != null && count > 0 ? formatToolCount(count) : null;
        const className = `relative px-4 py-3 text-sm transition-colors ${
          selected
            ? 'text-[var(--paper)]'
            : 'text-[var(--gray-500)] hover:text-[var(--gray-300)]'
        }`;

        const inner = (
          <>
            <span className="font-medium">{tab.label}</span>
            {countLabel ? (
              <span className={`ml-2 tabular-nums ${selected ? 'text-[var(--copper)]' : ''}`}>
                {countLabel}
              </span>
            ) : null}
            {selected ? (
              <span
                aria-hidden
                className="absolute inset-x-4 -bottom-px h-px bg-[var(--copper)]"
              />
            ) : null}
          </>
        );

        if (asLinks) {
          return (
            <Link
              key={tab.kind}
              href={openSourceHref(tab.kind)}
              role="tab"
              aria-selected={selected}
              className={className}
            >
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={tab.kind}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`${className} cursor-pointer`}
            onClick={() => onSelect?.(tab.kind)}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
