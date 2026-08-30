import Link from 'next/link';
import type { LearningContent } from '@/types';

interface LearnContentCardProps {
  item: LearningContent;
  basePath: string;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const pricingLabels: Record<string, string> = {
  free: 'Free',
  paid: 'Paid',
  freemium: 'Freemium',
};

export default function LearnContentCard({ item, basePath }: LearnContentCardProps) {
  const difficultyClass = difficultyColors[item.difficulty] || difficultyColors.beginner;

  return (
    <Link
      href={`${basePath}/${item.slug}`}
      className="group block rounded-xl border border-[var(--gray-700)] bg-[var(--gray-800)] hover:border-[var(--gray-500)] transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      {item.featured_image ? (
        <div className="w-full h-44 bg-[var(--gray-700)] overflow-hidden">
          <img
            src={item.featured_image}
            alt={item.title}
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
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${difficultyClass}`}>
            {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
          </span>
          {item.estimated_time && (
            <span className="text-xs text-[var(--gray-500)]">
              {item.estimated_time}
            </span>
          )}
          {item.pricing !== 'free' && (
            <span className="text-xs text-[var(--gray-500)]">
              {pricingLabels[item.pricing] || item.pricing}
              {item.price_amount ? ` - $${item.price_amount}` : ''}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-copper-bright transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        {item.short_description && (
          <p className="text-sm text-[var(--gray-400)] mb-4 line-clamp-2">
            {item.short_description}
          </p>
        )}

        {/* Footer meta */}
        <div className="flex items-center justify-between text-xs text-[var(--gray-500)]">
          <span>{item.author}</span>
          {item.last_updated && (
            <span>Updated {new Date(item.last_updated).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
