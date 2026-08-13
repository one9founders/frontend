import { getToolRatingDisplay, type ToolRatingFields } from '@/lib/toolRating';

interface ToolRatingBadgeProps {
  tool: ToolRatingFields;
  compact?: boolean;
  className?: string;
}

export default function ToolRatingBadge({
  tool,
  compact = false,
  className = '',
}: ToolRatingBadgeProps) {
  const display = getToolRatingDisplay(tool);
  const text = compact ? display.shortLabel : display.label;
  const color =
    display.status === 'RATED'
      ? 'text-yellow-400'
      : display.status === 'PROVISIONAL'
        ? 'text-amber-300'
        : 'text-[var(--gray-500)]';

  return (
    <span className={`inline-flex items-center gap-1 ${color} ${className}`}>
      {display.numericAllowed && (
        <span aria-hidden="true" className="text-yellow-400">
          {'★'.repeat(Math.max(1, Math.round(display.score || 0)))}
        </span>
      )}
      <span>{text}</span>
    </span>
  );
}
