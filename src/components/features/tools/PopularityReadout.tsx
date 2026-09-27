import { popularityFromRecord } from '@/lib/popularity';

type Payload = {
  state?: string | null;
  value?: number | null;
} | null;

export default function PopularityReadout({
  score,
  payload,
  compact = false,
}: {
  score?: number | string | null;
  payload?: Payload;
  compact?: boolean;
}) {
  const display = popularityFromRecord(score, payload);

  if (display.state === 'unavailable') {
    return (
      <p className={compact ? 'text-xs text-[var(--gray-500)]' : 'text-sm text-[var(--gray-400)]'}>
        Popularity unavailable
      </p>
    );
  }

  if (display.state === 'unbounded') {
    return (
      <div>
        <div className="flex justify-between items-center gap-3">
          <span className={compact ? 'text-xs text-[var(--gray-400)]' : 'text-sm text-[var(--gray-400)]'}>
            Source activity
          </span>
          <span className={compact ? 'text-xs text-white' : 'text-sm font-medium text-white'}>
            {display.label}
          </span>
        </div>
        {!compact && (
          <p className="mt-1 text-xs text-[var(--gray-500)]">{display.detail}</p>
        )}
      </div>
    );
  }

  const width = Math.max(0, Math.min(100, display.value || 0));
  return (
    <div>
      <div className="flex justify-between items-center gap-3 mb-1.5">
        <span className={compact ? 'text-xs text-[var(--gray-400)]' : 'text-sm text-[var(--gray-400)]'}>
          Source activity
        </span>
        <span className={compact ? 'text-xs text-white' : 'text-sm font-medium text-white'}>
          {display.label}
          <span className="text-[var(--gray-500)]"> / 100</span>
        </span>
      </div>
      <div className={`w-full ${compact ? 'h-1.5' : 'h-2'} bg-[var(--gray-700)] rounded-full overflow-hidden`}>
        <div className="h-full bg-copper rounded-full" style={{ width: `${width}%` }} />
      </div>
      {!compact && (
        <p className="mt-1 text-xs text-[var(--gray-500)]">{display.detail}</p>
      )}
    </div>
  );
}
