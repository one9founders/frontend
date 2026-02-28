'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface LearnContentFilterProps {
  difficultyOptions: FilterOption[];
  categoryOptions: FilterOption[];
  audienceOptions: FilterOption[];
}

export default function LearnContentFilter({
  difficultyOptions,
  categoryOptions,
  audienceOptions,
}: LearnContentFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentDifficulty = searchParams.get('difficulty') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentAudience = searchParams.get('audience') || '';

  const hasActiveFilters = currentDifficulty || currentCategory || currentAudience;

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return (
    <div className="space-y-6">
      {/* Difficulty Filter */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
          Difficulty
        </h3>
        <div className="flex flex-wrap gap-2">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateFilter(
                  'difficulty',
                  currentDifficulty === option.value ? '' : option.value
                )
              }
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                currentDifficulty === option.value
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-400)] hover:border-[var(--gray-500)] hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
          Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateFilter(
                  'category',
                  currentCategory === option.value ? '' : option.value
                )
              }
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                currentCategory === option.value
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-400)] hover:border-[var(--gray-500)] hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audience Filter */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
          Audience
        </h3>
        <div className="flex flex-wrap gap-2">
          {audienceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateFilter(
                  'audience',
                  currentAudience === option.value ? '' : option.value
                )
              }
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                currentAudience === option.value
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-400)] hover:border-[var(--gray-500)] hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
