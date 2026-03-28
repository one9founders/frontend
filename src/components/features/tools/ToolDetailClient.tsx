'use client';

import { useState, useEffect } from 'react';
import { trackingAPI } from '@/lib/api/apiClient';
import { getCurrentUser } from '@/lib/actions/auth';
import ReviewForm from '@/components/features/reviews/ReviewForm';
import ReviewsList from '@/components/features/reviews/ReviewsList';
import { Tool, Review } from '@/types';

interface ToolDetailClientProps {
  tool: Tool;
  initialReviews: Review[];
  initialUsageCount: number;
}

export default function ToolDetailClient({ 
  tool, 
  initialReviews, 
  initialUsageCount 
}: ToolDetailClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [user, setUser] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [usageCount, setUsageCount] = useState<number>(initialUsageCount);
  const [hasMarkedUsage, setHasMarkedUsage] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadUser();
    checkUsageStatus();
  }, []);

  const loadUser = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const checkUsageStatus = () => {
    if (typeof window !== 'undefined') {
      const usedTools = JSON.parse(localStorage.getItem('usedTools') || '[]');
      setHasMarkedUsage(usedTools.includes(tool.id));
    }
  };

  const handleReviewAdded = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';
    try {
      const response = await fetch(`${API_URL}/reviews/?tool_id=${tool.id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data?.results || data || []);
      }
    } catch (error) {
      console.error('Error reloading reviews:', error);
    }
    setShowReviewForm(false);
  };

  const handleIUseThis = async () => {
    if (!tool) return;
    
    try {
      await trackingAPI.trackUsage(tool.id);
      setUsageCount(prev => prev + 1);
      setHasMarkedUsage(true);
      
      if (typeof window !== 'undefined') {
        const usedTools = JSON.parse(localStorage.getItem('usedTools') || '[]');
        if (!usedTools.includes(tool.id)) {
          usedTools.push(tool.id);
          localStorage.setItem('usedTools', JSON.stringify(usedTools));
        }
      }
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  const handleWriteReview = () => {
    if (!user) {
      if (mounted && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
      }
      return;
    }
    setShowReviewForm(true);
  };

  return (
    <>
      <div className="mt-4">
        <button
          onClick={handleIUseThis}
          disabled={hasMarkedUsage}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            hasMarkedUsage
              ? 'bg-green-600 text-white cursor-default'
              : 'bg-[var(--gray-800)] text-white hover:bg-[var(--gray-700)]'
          }`}
        >
          {hasMarkedUsage ? 'You use this tool' : 'I use this tool'}
        </button>
        {usageCount > 0 && (
          <span className="ml-2 text-[var(--gray-400)] text-sm">
            {usageCount} {usageCount === 1 ? 'user' : 'users'}
          </span>
        )}
      </div>

      <div className="mt-8 md:mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">Reviews & Comments</h2>
          {!showReviewForm && (
            <button
              onClick={handleWriteReview}
              className="btn-primary px-4 md:px-6 py-2 text-sm md:text-base"
            >
              Write a Review
            </button>
          )}
        </div>
        
        {showReviewForm && user && (
          <div className="mb-8">
            <ReviewForm
              toolId={tool.id}
              toolName={tool.name}
              onReviewAdded={handleReviewAdded}
            />
            <button
              onClick={() => setShowReviewForm(false)}
              className="mt-4 text-[var(--gray-400)] hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}
        
        {reviews && reviews.length === 0 ? (
          <div className="text-center py-12 bg-[var(--gray-900)] rounded-lg">
            <p className="text-[var(--gray-400)] mb-4">
              {user ? 
                "Be the first to write about this tool!" : 
                "Become the first to write about this tool"
              }
            </p>
            {!user && mounted && (
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                }}
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Login to write a review
              </button>
            )}
          </div>
        ) : (
          <ReviewsList reviews={reviews} />
        )}
      </div>
    </>
  );
}
