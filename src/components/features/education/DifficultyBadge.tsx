interface DifficultyBadgeProps {
  difficulty: string;
  size?: 'sm' | 'md';
}

const difficultyStyles: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function DifficultyBadge({ difficulty, size = 'sm' }: DifficultyBadgeProps) {
  const style = difficultyStyles[difficulty] || difficultyStyles.beginner;
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const sizeClass = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-block ${sizeClass} font-medium rounded border ${style}`}>
      {label}
    </span>
  );
}
