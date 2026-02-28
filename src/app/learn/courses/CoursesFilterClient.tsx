'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import type { EducationCategory } from '@/types/education';

interface CoursesFilterClientProps {
  categories: EducationCategory[];
}

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const FORMAT_OPTIONS = [
  { value: 'self_paced', label: 'Self-Paced' },
  { value: 'cohort', label: 'Cohort-Based' },
  { value: 'live', label: 'Live' },
  { value: 'hybrid', label: 'Hybrid' },
];

export default function CoursesFilterClient({ categories }: CoursesFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategory = searchParams.get('category') || '';
  const currentDifficulty = searchParams.get('difficulty') || '';
  const currentFormat = searchParams.get('format') || '';

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    const audience = searchParams.get('audience');
    if (audience) params.set('audience', audience);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [router, pathname, searchParams]);

  const hasFilters = !!(currentCategory || currentDifficulty || currentFormat);

  return (
    <div className="mb-8 p-6 rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)]">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Filters</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          value={currentCategory}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        <select
          value={currentDifficulty}
          onChange={(e) => updateFilter('difficulty', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="">All Difficulty Levels</option>
          {DIFFICULTY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={currentFormat}
          onChange={(e) => updateFilter('format', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="">All Formats</option>
          {FORMAT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="mt-3 text-sm text-purple-400 hover:text-purple-300"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
