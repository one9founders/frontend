'use client';

import { AgentCategory } from '@/types/agent';

interface CategoryPillsProps {
  categories: AgentCategory[];
  selected: string;
  onSelect: (slug: string) => void;
}

export default function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  const topCategories = categories.slice(0, 15);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      <button
        onClick={() => onSelect('')}
        className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors border cursor-pointer ${
          selected === ''
            ? 'bg-[var(--gray-50)] border-[var(--gray-300)] text-[var(--gray-800)]'
            : 'bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-300)] hover:bg-[var(--gray-700)] hover:border-[var(--gray-600)]'
        }`}
      >
        All
      </button>
      {topCategories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors border cursor-pointer ${
            selected === cat.slug
              ? 'bg-[var(--gray-50)] border-[var(--gray-300)] text-[var(--gray-800)]'
              : 'bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-300)] hover:bg-[var(--gray-700)] hover:border-[var(--gray-600)]'
          }`}
        >
          {cat.label} ({cat.agent_count})
        </button>
      ))}
    </div>
  );
}
