'use client';

interface CategoryPillProps {
  label: string;
  variant?: 'teal' | 'purple' | 'copper' | 'amber' | 'green' | 'blue' | 'gray' | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<string, string> = {
  teal: 'bg-teal-600/20 text-teal-400 border-teal-600/30',
  copper: 'bg-copper/20 text-copper border-copper/30',
  purple: 'bg-copper/20 text-copper border-copper/30',
  amber: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  green: 'bg-green-600/20 text-green-400 border-green-600/30',
  blue: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  gray: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
  red: 'bg-red-600/20 text-red-400 border-red-600/30',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function CategoryPill({
  label,
  variant = 'gray',
  size = 'sm',
  className = '',
}: CategoryPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variantClasses[variant] || variantClasses.gray} ${sizeClasses[size]} ${className}`}
    >
      {label}
    </span>
  );
}
