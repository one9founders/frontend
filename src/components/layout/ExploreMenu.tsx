'use client';

import Link from 'next/link';
import { BUILD, CATALOG, itemCount, type EcosystemItem } from '@/lib/constants/ecosystem';

type LiveCounts = {
  tools?: number | null;
  agents?: number | null;
  openSource?: number | null;
};

function Group({
  label,
  items,
  live,
  onNavigate,
}: {
  label: string;
  items: EcosystemItem[];
  live: LiveCounts;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--copper)] mb-3">
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const count = itemCount(item, live);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="group/item flex items-baseline justify-between gap-4 px-2 py-2 -mx-2 rounded-sm hover:bg-[var(--ink)] border-l-2 border-transparent hover:border-[var(--copper)]"
              >
                <span>
                  <span className="block text-sm text-[var(--paper)] group-hover/item:text-white">
                    {item.name}
                  </span>
                  <span className="block text-xs text-[var(--gray-500)] mt-0.5">
                    {item.blurb}
                  </span>
                </span>
                {count && (
                  <span className="text-xs tabular-nums text-[var(--gray-500)] shrink-0">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ExploreGroups({
  live,
  onNavigate,
}: {
  live: LiveCounts;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Group label="Catalog" items={CATALOG} live={live} onNavigate={onNavigate} />
        <Group label="Build" items={BUILD} live={live} onNavigate={onNavigate} />
      </div>
      <div className="mt-6 pt-4 border-t border-[var(--line)]">
        <Link
          href="/methodology"
          onClick={onNavigate}
          className="text-xs text-[var(--gray-500)] hover:text-[var(--copper)]"
        >
          How we rate
        </Link>
      </div>
    </div>
  );
}

export default function ExploreMenu({
  open,
  onToggle,
  onOpen,
}: {
  open: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={onOpen}
      aria-expanded={open}
      aria-haspopup="true"
      className={`inline-flex items-center gap-1.5 text-sm cursor-pointer ${
        open ? 'text-[var(--paper)]' : 'text-[var(--gray-400)] hover:text-[var(--paper)]'
      }`}
    >
      Explore
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        aria-hidden="true"
        className={`transition-transform ${open ? 'rotate-180' : ''}`}
      >
        <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </button>
  );
}
