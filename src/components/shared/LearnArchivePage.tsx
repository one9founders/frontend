'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import type { LearningContent } from '@/types';
import LearnContentFilter from './LearnContentFilter';
import LearnContentCard from './LearnContentCard';

interface FilterOption {
  value: string;
  label: string;
}

interface LearnArchivePageProps {
  title: string;
  description: string;
  basePath: string;
  contentType: string;
  icon: React.ReactNode;
  items: LearningContent[];
  difficultyOptions: FilterOption[];
  categoryOptions: FilterOption[];
  audienceOptions: FilterOption[];
  hasActiveFilters: boolean;
}

function LearnArchiveContent({
  title,
  description,
  basePath,
  contentType,
  icon,
  items,
  difficultyOptions,
  categoryOptions,
  audienceOptions,
  hasActiveFilters,
}: LearnArchivePageProps) {
  return (
    <>
      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      {/* Filters + Content Grid */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Filter Bar */}
          <div className="mb-8 p-6 rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)]">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Filters</h2>
            </div>
            <Suspense fallback={<div className="h-20 animate-pulse bg-[var(--gray-800)] rounded" />}>
              <LearnContentFilter
                difficultyOptions={difficultyOptions}
                categoryOptions={categoryOptions}
                audienceOptions={audienceOptions}
              />
            </Suspense>
          </div>

          {/* Results */}
          {items.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[var(--gray-400)]">
                  {items.length} {items.length === 1 ? contentType.slice(0, -1) : contentType} found
                  {hasActiveFilters && ' (filtered)'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <LearnContentCard key={item.id} item={item} basePath={basePath} />
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-20 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
              <div className="w-16 h-16 mx-auto mb-6 text-[var(--gray-600)]">
                {icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {hasActiveFilters
                  ? `No ${contentType} match your filters`
                  : `${title} Coming Soon`}
              </h2>
              <p className="text-[var(--gray-400)] max-w-md mx-auto mb-6">
                {hasActiveFilters
                  ? 'Try adjusting or clearing your filters to see more results.'
                  : `We're working on ${contentType} content. Check back soon or subscribe to get notified.`}
              </p>
              <Link href="/learn" className="text-copper hover:text-copper-bright font-medium inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Education Hub
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function LearnArchivePage(props: LearnArchivePageProps) {
  return <LearnArchiveContent {...props} />;
}
