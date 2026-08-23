'use client';

import Link from 'next/link';
import { BOARD, itemCount } from '@/lib/constants/ecosystem';

interface EcosystemBoardProps {
  toolCount?: number | null;
  agentCount?: number | null;
}

export default function EcosystemBoard({ toolCount, agentCount }: EcosystemBoardProps) {
  const live = { tools: toolCount, agents: agentCount };

  return (
    <div className="border border-[var(--line)] bg-[var(--ink-2)]">
      <div className="flex items-baseline justify-between px-4 py-3 border-b border-[var(--line)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--copper)]">The desk</p>
        <p className="text-[11px] text-[var(--gray-500)]">Eight surfaces. One map.</p>
      </div>
      <div className="grid grid-cols-2">
        {BOARD.map((item, index) => {
          const count = itemCount(item, live);
          const col = index % 2;
          const row = Math.floor(index / 2);
          const lastRow = row === Math.floor((BOARD.length - 1) / 2);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`group p-4 min-h-[104px] flex flex-col justify-between hover:bg-[var(--ink)] ${
                col === 0 ? 'border-r border-[var(--line)]' : ''
              } ${lastRow ? '' : 'border-b border-[var(--line)]'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-[var(--paper)] group-hover:text-[var(--copper)]">
                  {item.name}
                </span>
                {count && (
                  <span className="text-xs tabular-nums text-[var(--gray-500)] shrink-0">
                    {count}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--gray-500)] mt-3 leading-relaxed">
                {item.blurb}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
