'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HugeiconsIcon,
  ArrowUpRight01Icon,
  ChartUpIcon,
} from '@/components/ui/icons';
import {
  rememberRecentStack,
  savePersonStack,
  type JobStack,
  type StackLaneItem,
} from '@/lib/api/jobStack';

function costClass(kind: string) {
  if (kind === 'free') return 'bg-emerald-950/80 text-emerald-400';
  if (kind === 'skill') return 'bg-copper/20 text-copper-bright';
  return 'bg-[var(--gray-800)] text-[var(--gray-400)]';
}

function itemKey(item: StackLaneItem, index: number) {
  return item.slug || `${item.name}-${index}`;
}

export default function SavedStackView({ stack }: { stack: JobStack }) {
  const router = useRouter();
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    rememberRecentStack(stack);
  }, [stack]);

  const visibleLanes = useMemo(
    () =>
      stack.lanes.map((lane) => ({
        ...lane,
        items: lane.items.filter((item, i) => !hidden.has(itemKey(item, i))),
      })),
    [stack.lanes, hidden],
  );

  const removedCount = hidden.size;

  const toggleItem = (key: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/stack/${stack.public_id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const saveMine = async () => {
    setSaving(true);
    setError('');
    try {
      const saved = await savePersonStack({
        query: stack.query,
        title: stack.title,
        blurb: stack.blurb,
        cash_out: stack.cash_out,
        lanes: visibleLanes.filter((lane) => lane.id !== 'worker'),
      });
      rememberRecentStack(saved);
      router.push(`/stack/${saved.public_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this stack.');
      setSaving(false);
    }
  };

  return (
    <section className="px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-copper">
          {stack.source === 'person' ? 'Saved by a person' : 'Assembled by the agent'}
          {' · '}
          {stack.public_id}
        </p>
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">{stack.title}</h1>
        <p className="mb-6 max-w-2xl text-sm text-[var(--gray-400)]">{stack.blurb}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyLink()}
            className="rounded-lg border border-[var(--gray-700)] px-3 py-1.5 text-sm text-[var(--gray-300)] hover:border-[var(--gray-500)]"
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <Link
            href="/stack"
            className="rounded-lg border border-[var(--gray-700)] px-3 py-1.5 text-sm text-[var(--gray-300)] hover:border-[var(--gray-500)]"
          >
            Assemble another
          </Link>
          {removedCount > 0 && (
            <button
              type="button"
              onClick={() => void saveMine()}
              disabled={saving}
              className="rounded-lg bg-[var(--brand-primary)] px-3 py-1.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--brand-secondary)] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save my version'}
            </button>
          )}
        </div>
        {error && <p className="mb-4 text-sm text-amber-400">{error}</p>}

        <div className="overflow-hidden rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)]">
          <div className="flex items-start gap-2 border-b border-[var(--gray-800)] bg-[var(--gray-950)] px-4 py-3 font-mono text-sm text-[var(--gray-300)]">
            <span className="text-copper">▸</span>
            <span>{stack.query}</span>
          </div>
          {visibleLanes.map((lane) => {
            const isWorker = lane.id === 'worker';
            const original = stack.lanes.find((l) => l.id === lane.id);
            return (
              <div
                key={lane.id}
                className={`border-b border-[var(--gray-800)] px-4 py-5 last:border-b-0 ${
                  isWorker ? 'bg-copper/10' : ''
                }`}
              >
                <p
                  className={`mb-3 font-mono text-[11px] uppercase tracking-[0.14em] ${
                    isWorker ? 'text-copper' : 'text-[var(--gray-500)]'
                  }`}
                >
                  {isWorker ? 'Then run it · ' : ''}
                  {lane.label}
                </p>
                <ul className="space-y-2.5">
                  {(original?.items || []).map((item, index) => {
                    const key = itemKey(item, index);
                    const dropped = hidden.has(key);
                    const href = item.href || (item.slug ? `/tool/${item.slug}` : undefined);
                    return (
                      <li key={key} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        {!isWorker && (
                          <button
                            type="button"
                            onClick={() => toggleItem(key)}
                            className="font-mono text-[10px] text-[var(--gray-600)] hover:text-[var(--gray-400)]"
                            aria-label={dropped ? `Keep ${item.name}` : `Remove ${item.name}`}
                          >
                            {dropped ? 'undo' : 'remove'}
                          </button>
                        )}
                        <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wide ${costClass(item.cost)}`}>
                          {item.cost_label}
                        </span>
                        {href ? (
                          <Link
                            href={href}
                            className={`text-sm font-semibold ${dropped ? 'text-[var(--gray-600)] line-through' : 'text-white hover:text-copper-bright'}`}
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold text-white">{item.name}</span>
                        )}
                        {item.note && (
                          <span className={`text-sm ${dropped ? 'text-[var(--gray-700)]' : 'text-[var(--gray-400)]'}`}>
                            — {item.note}
                          </span>
                        )}
                        {isWorker && (
                          <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-3.5 w-3.5 text-copper" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        {stack.cash_out && (
          <div className="mt-4 flex items-start gap-2 text-sm text-[var(--gray-400)]">
            <HugeiconsIcon icon={ChartUpIcon} className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <p>{stack.cash_out}</p>
          </div>
        )}
        <p className="mt-6 text-xs text-[var(--gray-600)]">
          Come back anytime: <span className="font-mono text-[var(--gray-500)]">/stack/{stack.public_id}</span>
          . Remove a pick and save your version if the agent over-included.
        </p>
      </div>
    </section>
  );
}
