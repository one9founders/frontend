'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HugeiconsIcon, Time01Icon, UserIcon, ThumbsUpIcon } from '@/components/ui/icons';
import { newsAPI } from '@/lib/api/apiClient';

interface NewsArticle {
  id: number;
  slug?: string;
  title: string;
  description: string;
  excerpt?: string;
  author: string;
  date: string;
  published_at?: string;
  readTime: string;
  reading_time?: number;
  category?: string;
  image: string;
  featured_image?: string;
  upvote_count?: number;
  has_upvoted?: boolean;
}

interface NewsCardProps {
  article: NewsArticle;
  sessionId?: string;
}

export default function NewsCard({ article, sessionId }: NewsCardProps) {
  const [upvoteCount, setUpvoteCount] = useState(article.upvote_count || 0);
  const [hasUpvoted, setHasUpvoted] = useState(article.has_upvoted || false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUpvoting) return;
    
    setIsUpvoting(true);
    try {
      if (hasUpvoted) {
        const result = await newsAPI.removeUpvote(article.id, sessionId);
        if (result) {
          setUpvoteCount(result.upvote_count ?? Math.max(0, upvoteCount - 1));
          setHasUpvoted(false);
        }
      } else {
        const result = await newsAPI.upvote(article.id, sessionId);
        if (result) {
          setUpvoteCount(result.upvote_count ?? upvoteCount + 1);
          setHasUpvoted(true);
        }
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const displayDate = article.published_at || article.date;
  const displayImage = article.featured_image || article.image;
  const displayDescription = article.excerpt || article.description;
  const displayReadTime = article.reading_time ? `${article.reading_time} min read` : article.readTime;

  return (
    <div className="bg-[var(--gray-900)] rounded-lg overflow-hidden hover:bg-[var(--gray-800)] transition-colors">
      <Link href={`/news/${article.slug || article.id}`}>
        <div className="aspect-video bg-[var(--gray-800)] relative">
          <img 
            src={displayImage} 
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNTBIMTc1VjEwMFoiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTE1MCA3NUgyNTBWMTc1SDE1MFY3NVoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkFJIE5ld3M8L3RleHQ+Cjwvc3ZnPgo=';
            }}
          />
          {article.category && (
            <div className="absolute top-3 left-3">
              <span className="text-white text-xs px-2 py-1 rounded-full bg-[var(--brand-primary)]">
                {article.category}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-[var(--gray-400)] text-sm mb-4 line-clamp-3">
            {displayDescription}
          </p>

          <div className="flex items-center justify-between text-xs text-[var(--gray-500)]">
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={UserIcon} size={12} />
                <span>{article.author}</span>
              </div>
              <span>•</span>
              <span>{formatDate(displayDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={Time01Icon} size={12} />
              <span>{displayReadTime}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-6 pb-4 pt-2 border-t border-[var(--gray-800)]">
        <button
          onClick={handleUpvote}
          disabled={isUpvoting}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            hasUpvoted 
              ? 'bg-[var(--brand-primary)] text-white' 
              : 'bg-[var(--gray-800)] text-[var(--gray-400)] hover:bg-[var(--gray-700)] hover:text-white'
          } ${isUpvoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <HugeiconsIcon icon={ThumbsUpIcon} size={16} />
          <span className="text-sm font-medium">{upvoteCount}</span>
        </button>
      </div>
    </div>
  );
}
