'use client';

import Link from 'next/link';
import type { WorkshopListItem } from '@/types/education';
import FormatBadge from './FormatBadge';

interface WorkshopCardProps {
  workshop: WorkshopListItem;
  onRegister?: (slug: string) => void;
}

export default function WorkshopCard({ workshop, onRegister }: WorkshopCardProps) {
  const isUpcoming = workshop.status === 'upcoming' || workshop.status === 'live';
  const workshopDate = workshop.date ? new Date(workshop.date) : null;

  return (
    <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-800)] hover:border-[var(--gray-500)] transition-all p-6">
      <div className="flex items-start gap-4">
        {/* Date block */}
        {workshopDate && (
          <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center">
            <span className="text-xs text-purple-400 font-medium uppercase">
              {workshopDate.toLocaleDateString('en-IN', { month: 'short' })}
            </span>
            <span className="text-lg font-bold text-white leading-none">
              {workshopDate.getDate()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <FormatBadge format={workshop.format} />
            {workshop.status === 'live' && (
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-500/10 text-red-400 border border-red-500/20">
                Live Now
              </span>
            )}
            {workshop.duration_minutes > 0 && (
              <span className="text-xs text-[var(--gray-500)]">
                {workshop.duration_minutes} min
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
            {workshop.title}
          </h3>

          {/* Description */}
          {workshop.short_description && (
            <p className="text-sm text-[var(--gray-400)] mb-3 line-clamp-2">
              {workshop.short_description}
            </p>
          )}

          {/* Instructor */}
          {workshop.instructor && (
            <p className="text-xs text-[var(--gray-500)] mb-3">
              by {workshop.instructor}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isUpcoming ? (
              <button
                onClick={() => onRegister?.(workshop.slug)}
                className="btn-primary px-4 py-2 text-sm"
              >
                Register
              </button>
            ) : (
              <Link
                href={`/learn/workshops`}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--gray-700)] text-white hover:bg-[var(--gray-600)] transition-colors inline-flex items-center gap-2"
              >
                Watch Recording
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
