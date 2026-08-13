import { getToolSecurityDisplay, type ToolRatingFields } from '@/lib/toolRating';

interface ToolSecurityBadgeProps {
  tool: ToolRatingFields;
  compact?: boolean;
  className?: string;
}

export default function ToolSecurityBadge({
  tool,
  compact = false,
  className = '',
}: ToolSecurityBadgeProps) {
  const display = getToolSecurityDisplay(tool);
  const color =
    display.status === 'VERIFIED'
      ? 'text-green-400'
      : display.status === 'FLAGGED'
        ? 'text-amber-400'
        : 'text-[var(--gray-500)]';

  return (
    <span className={`inline-flex items-center gap-1 ${color} ${className}`}>
      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <span>{compact ? display.shortLabel : display.label}</span>
    </span>
  );
}
