interface FormatBadgeProps {
  format: string;
  size?: 'sm' | 'md';
}

const formatLabels: Record<string, string> = {
  self_paced: 'Self-Paced',
  cohort: 'Cohort-Based',
  live: 'Live',
  hybrid: 'Hybrid',
  webinar: 'Webinar',
  workshop: 'Workshop',
  corporate: 'Corporate',
};

export default function FormatBadge({ format, size = 'sm' }: FormatBadgeProps) {
  const label = formatLabels[format] || format.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const sizeClass = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-block ${sizeClass} font-medium rounded bg-purple-500/10 text-purple-400 border border-purple-500/20`}>
      {label}
    </span>
  );
}
