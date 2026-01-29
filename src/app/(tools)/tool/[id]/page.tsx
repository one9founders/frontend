'use client';

import { useState, useEffect } from 'react';
import { toolsAPI, reviewsAPI, trackingAPI } from '@/lib/api/apiClient';
import { getCurrentUser } from '@/lib/actions/auth';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import ReviewForm from '@/components/features/reviews/ReviewForm';
import ReviewsList from '@/components/features/reviews/ReviewsList';
import { addRefToUrl } from '@/lib/utils/url';
import ToolLogo from '@/components/shared/ToolLogo';

interface ToolPageProps {
  params: Promise<{ id: string }>;
}

export default function ToolPage({ params }: ToolPageProps) {
  const [tool, setTool] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [hasMarkedUsage, setHasMarkedUsage] = useState(false);

  const getRatingStars = () => {
    if (!tool?.rating) return null;
    const rating = Number(tool.rating);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-[var(--gray-600)]'}>★</span>
    ));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [toolData, userData] = await Promise.all([
        toolsAPI.getBySlug(id),
        getCurrentUser()
      ]);
      
      if (!toolData) {
        notFound();
        return;
      }
      
      setTool(toolData);
      setUser(userData);
      
      // Load reviews
      const reviewsData = await reviewsAPI.getByToolId(toolData.id);
      console.log('Reviews API response:', reviewsData);
      const reviewsArray = reviewsData?.results || reviewsData || [];
      console.log('Reviews array:', reviewsArray);
      setReviews(reviewsArray);

      // Load usage count
      try {
        const usageData = await trackingAPI.getUsageCount(toolData.id);
        if (usageData) {
          setUsageCount(usageData.usage_count || 0);
        }
      } catch (err) {
        console.log('Could not load usage count');
      }

      // Check if user already marked usage (stored in localStorage)
      if (typeof window !== 'undefined') {
        const usedTools = JSON.parse(localStorage.getItem('usedTools') || '[]');
        setHasMarkedUsage(usedTools.includes(toolData.id));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    loadData();
    setShowReviewForm(false);
  };

  const handleIUseThis = async () => {
    if (!tool) return;
    
    try {
      await trackingAPI.trackUsage(tool.id);
      setUsageCount(prev => prev + 1);
      setHasMarkedUsage(true);
      
      // Store in localStorage to prevent duplicate clicks
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
      // Store current URL for redirect after login (only on client)
      if (mounted && typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/?login=true';
      }
      return;
    }
    setShowReviewForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gray-black)]">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      
      <div className="w-full mx-auto p-4 md:p-8">
        <div className="bg-[var(--gray-900)] rounded-lg p-4 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left Side - 30% */}
            <div className="lg:w-3/10">
              {/* Top section with logo and basic info */}
              <div className="flex gap-4 mb-6">
                {/* Logo - 32 width */}
                <div className="w-32 flex-shrink-0">
                  <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="xl" />
                </div>
                
                {/* Name and short description */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{tool.name}</h1>
                  {tool.short_description && (
                    <p className="text-[var(--gray-400)] text-base md:text-lg mt-1 leading-tight">{tool.short_description}</p>
                  )}
                </div>
              </div>
              
              {/* Ideal For */}
              {tool.ideal_for && tool.ideal_for.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Ideal For</h3>
                  <div className="flex flex-wrap gap-1">
                    {tool.ideal_for.map((item: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-[var(--gray-800)] text-[var(--gray-300)] px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tool Info */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.verified && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                      Verified
                    </span>
                  )}
                  {tool.is_featured && (
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                      Featured
                    </span>
                  )}
                  {tool.startup_friendly && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                      Startup Friendly
                    </span>
                  )}
                </div>
                
                {/* Categories */}
                <div className="mb-2">
                  <span className="text-[var(--gray-400)] text-sm">Categories: </span>
                  <span className="text-white text-sm">
                    {tool.categories?.map((c: any) => c.name).join(', ') || 'N/A'}
                  </span>
                </div>
                
                {/* Rating */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-[var(--gray-400)] text-sm">Rating:</span>
                  <div className="flex">{getRatingStars()}</div>
                  <span className="text-[var(--gray-400)] text-sm">{tool.rating} ({tool.review_count} reviews)</span>
                </div>
                
                {/* Visit Button */}
                <a
                  href={addRefToUrl(tool.affiliate_url || tool.website)}
                  target="_blank"
                  rel="noopener nofollow"
                  className="btn-primary inline-block px-4 py-2 font-semibold text-sm"
                >
                  Visit {tool.name}
                </a>
                
                {/* I Use This Tool Button */}
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
              </div>
            </div>
            
            {/* Right Side - 70% */}
            <div className="lg:w-7/10">
              {/* Landing Page Preview */}
              {tool.landing_page_screenshot && (
                <div className="mb-6">
                  <a
                    href={addRefToUrl(tool.affiliate_url || tool.website)}
                    target="_blank"
                    rel="noopener nofollow"
                    aria-label={`Go to the ${tool.name} website`}
                    className="block group"
                  >
                    <div className="relative overflow-hidden rounded-lg border border-[var(--gray-700)] hover:border-[var(--brand-primary)] transition-colors">
                      <img
                        src={tool.landing_page_screenshot}
                        alt={`${tool.name} landing page preview`}
                        className="w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--brand-primary)] text-white px-4 py-2 rounded-lg font-medium">
                          Visit Website
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* Demo Image */}
              {tool.video_demo_url && (
                <div className="mb-6">
                  <img
                    src={tool.video_demo_url}
                    alt={`${tool.name} demo`}
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              
              {/* Additional Info */}
              <div className="grid grid-cols-1 gap-3 md:gap-4 mb-4 text-sm md:text-base">
                {tool.pricing_models?.length > 0 && (
                  <div>
                    <span className="text-[var(--gray-400)]">Pricing:</span>
                    <span className="text-white ml-2">
                      {tool.pricing_models.join(', ')}
                      {tool.pricing_from && ` from $${tool.pricing_from}`}
                    </span>
                  </div>
                )}
                {tool.free_trial_days && (
                  <div>
                    <span className="text-[var(--gray-400)]">Free Trial:</span>
                    <span className="text-green-400 ml-2">{tool.free_trial_days} days</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Full Width Description */}
          <div className="mt-8">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Description</h3>
            <p className="text-[var(--gray-300)] text-sm md:text-base leading-relaxed">{tool.description}</p>
          </div>
          
          {/* Use Cases */}
          {tool.use_cases && tool.use_cases.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Use Cases</h3>
              <ul className="list-disc list-inside text-[var(--gray-300)] space-y-2">
                {tool.use_cases.map((useCase: string, index: number) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Features */}
          {tool.features && tool.features.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
              <ul className="list-disc list-inside text-[var(--gray-300)] space-y-2">
                {tool.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Startup Benefits */}
          {tool.startup_benefits && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Startup Benefits</h3>
              <p className="text-[var(--gray-300)]">{tool.startup_benefits}</p>
            </div>
          )}
        </div>
        
        {/* Reviews Section */}
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
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('redirectAfterLogin', window.location.pathname);
                      window.location.href = '/?login=true';
                    }
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
      </div>
    </div>
  );
}
