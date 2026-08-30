import type { Tool } from '@/types';
import { TRACK_LABELS, isSelfHostTrack } from '@/lib/constants/tracks';

export default function TrackBadge({ tool }: { tool: Tool }) {
  const track = tool.track;
  if (!track || track === 'ai_tool') return null;

  const label = TRACK_LABELS[track];
  const tone = isSelfHostTrack(track)
    ? 'bg-green-600/20 text-green-400'
    : 'bg-[var(--copper)]/20 text-[var(--copper)]';

  return (
    <span className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded ${tone}`}>
      {label}
    </span>
  );
}
