'use client';

import Link from 'next/link';
import { OPEN_SOURCE_TABS, openSourceHref, type OpenSourceKind } from '@/lib/constants/tracks';
import { formatToolCount } from '@/lib/constants/stats';

type Counts = Partial<Record<OpenSourceKind, number>>;

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
    <div className="flex flex-wrap justify-center gap-2">
      {OPEN_SOURCE_TABS.map((tab) => {
        const selected = tab.kind === active;
        const count = counts[tab.kind];
        const label = count != null && count > 0
          ? `${tab.label} · ${formatToolCount(count)}`
          : tab.label;
        const className = `px-3 py-1.5 text-sm rounded-full border transition-colors ${
          selected
            ? 'bg-[var(--gray-50)] border-[var(--gray-300)] text-[var(--gray-800)]'
            : 'bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-300)] hover:bg-[var(--gray-700)]'
        }`;

        if (asLinks) {
          return (
            <Link key={tab.kind} href={openSourceHref(tab.kind)} className={className}>
              {label}
            </Link>
          );
        }

        return (
          <button
            key={tab.kind}
            type="button"
            className={`${className} cursor-pointer`}
            onClick={() => onSelect?.(tab.kind)}
            aria-pressed={selected}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
