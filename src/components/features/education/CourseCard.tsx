import Link from 'next/link';
import type { CourseListItem } from '@/types/education';
import DifficultyBadge from './DifficultyBadge';
import FormatBadge from './FormatBadge';

interface CourseCardProps {
  course: CourseListItem;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/learn/courses/${course.slug}`}
      className="group block rounded-xl border border-[var(--gray-700)] bg-[var(--gray-800)] hover:border-[var(--gray-500)] transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      {course.featured_image ? (
        <div className="w-full h-44 bg-[var(--gray-700)] overflow-hidden">
          <img
            src={course.featured_image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-44 bg-[var(--gray-700)] flex items-center justify-center">
          <svg className="w-12 h-12 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      )}

      <div className="p-5">
        {/* Tags row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <DifficultyBadge difficulty={course.difficulty} />
          <FormatBadge format={course.format} />
          {course.has_certificate && (
            <span className="text-xs text-[var(--gray-500)]">Certificate</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        {course.short_description && (
          <p className="text-sm text-[var(--gray-400)] mb-4 line-clamp-2">
            {course.short_description}
          </p>
        )}

        {/* Footer meta */}
        <div className="flex items-center justify-between text-xs text-[var(--gray-500)]">
          {course.duration_weeks > 0 && <span>{course.duration_weeks} weeks</span>}
          {course.category && <span>{course.category.name}</span>}
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-purple-400 font-medium">Contact for Pricing</span>
          <span className="text-sm text-purple-400 group-hover:text-purple-300 font-medium inline-flex items-center gap-1">
            Learn More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
