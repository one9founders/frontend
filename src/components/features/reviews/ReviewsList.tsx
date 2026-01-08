'use client';

import { Review } from '@/types';
import { HugeiconsIcon, StarIcon, ThumbsUpIcon, UserIcon } from '@/components/ui/icons';

interface ReviewsListProps {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <HugeiconsIcon 
        key={i} 
        icon={StarIcon}
        size={16} 
        className={i < rating ? 'text-yellow-400' : 'text-gray-600'}
      />
    ));
  };

  // Handle undefined or non-array reviews
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No reviews yet. Be the first to review this tool!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg p-4" style={{ backgroundColor: 'var(--gray-900)', border: '1px solid var(--gray-800)' }}>
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium text-white flex items-center gap-2">
                <HugeiconsIcon icon={UserIcon} size={16} />
                {review.user_name}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">{getRatingStars(review.rating)}</div>
              </div>
            </div>
            <span className="text-sm text-gray-400">{formatDate(review.created_at)}</span>
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold text-white mb-1">{review.title}</h4>

          {/* Comment */}
          <p className="text-gray-300 mb-4 leading-relaxed">
            {review.comment || 'No written review provided.'}
          </p>

          {/* Helpful Count */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={ThumbsUpIcon} size={16} />
              Helpful: {review.helpful_count || 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}