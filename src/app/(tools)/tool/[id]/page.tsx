import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, getReviewsByToolId, getToolUsageCount, getAllToolSlugs } from '@/lib/actions/tools';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import ToolLogo from '@/components/shared/ToolLogo';
import ToolDetailClient from '@/components/features/tools/ToolDetailClient';
import { addRefToUrl } from '@/lib/utils/url';
import { Tool, Review } from '@/types';

export const revalidate = 3600;

interface ToolPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs();
  return slugs.map((slug: string) => ({ id: slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { id } = await params;
  const tool = await getToolBySlug(id);
  
  if (!tool) {
    return {
      title: 'Tool Not Found | One9Founders',
      description: 'The requested tool could not be found.',
    };
  }

  const keywords = [
    tool.name,
    'AI tool',
    ...(tool.categories?.map((c: { name: string }) => c.name) || []),
    ...(tool.tags || []),
    'startup tools',
    'founder tools',
  ];

  return generateSEO({
    title: `${tool.name} - AI Tool Review & Features`,
    description: tool.short_description || tool.description?.substring(0, 160) || `Discover ${tool.name}, an AI tool for startups and founders.`,
    path: `/tool/${tool.slug}`,
    image: tool.logo_url || tool.landing_page_screenshot || '/logo-light.png',
    keywords,
  });
}

function getRatingStars(rating: number | null | undefined) {
  if (!rating) return null;
  const ratingNum = Number(rating);
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < Math.floor(ratingNum) ? 'text-yellow-400' : 'text-[var(--gray-600)]'}>
      &#9733;
    </span>
  ));
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { id } = await params;
  const tool: Tool | null = await getToolBySlug(id);
  
  if (!tool) {
    notFound();
  }

  const [reviews, usageCount] = await Promise.all([
    getReviewsByToolId(tool.id),
    getToolUsageCount(tool.id),
  ]);

  const structuredData = generateStructuredData({
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: tool.website,
    applicationCategory: tool.categories?.map((c: { name: string }) => c.name).join(', ') || 'AI Tool',
    operatingSystem: tool.platforms?.join(', ') || 'Web',
    offers: tool.pricing_models?.includes('Free') ? {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    } : tool.pricing_from ? {
      '@type': 'Offer',
      price: tool.pricing_from,
      priceCurrency: 'USD',
    } : undefined,
    aggregateRating: tool.review_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      reviewCount: tool.review_count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: reviews.slice(0, 5).map((review: Review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.user_name,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.comment,
      datePublished: review.created_at,
    })),
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Navbar />
      
      <div className="w-full mx-auto p-4 md:p-8">
        <div className="bg-[var(--gray-900)] rounded-lg p-4 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <div className="lg:w-3/10">
              <div className="flex gap-4 mb-6">
                <div className="w-32 flex-shrink-0">
                  <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="xl" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{tool.name}</h1>
                  {tool.short_description && (
                    <p className="text-[var(--gray-400)] text-base md:text-lg mt-1 leading-tight">{tool.short_description}</p>
                  )}
                </div>
              </div>
              
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
                
                <div className="mb-2">
                  <span className="text-[var(--gray-400)] text-sm">Categories: </span>
                  <span className="text-white text-sm">
                    {tool.categories?.map((c: { name: string }) => c.name).join(', ') || 'N/A'}
                  </span>
                </div>
                
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-[var(--gray-400)] text-sm">Rating:</span>
                  <div className="flex">{getRatingStars(tool.rating)}</div>
                  <span className="text-[var(--gray-400)] text-sm">{tool.rating} ({tool.review_count} reviews)</span>
                </div>
                
                <a
                  href={addRefToUrl(tool.affiliate_url || tool.website || '')}
                  target="_blank"
                  rel="noopener nofollow"
                  className="btn-primary inline-block px-4 py-2 font-semibold text-sm"
                >
                  Visit {tool.name}
                </a>
                
                <ToolDetailClient 
                  tool={tool} 
                  initialReviews={reviews} 
                  initialUsageCount={usageCount} 
                />
              </div>
            </div>
            
            <div className="lg:w-7/10">
              {(tool.landing_page_screenshot || tool.video_demo_url) && (
                <div className="mb-6">
                  <a
                    href={addRefToUrl(tool.affiliate_url || tool.website || '')}
                    target="_blank"
                    rel="noopener nofollow"
                    aria-label={`Go to the ${tool.name} website`}
                    className="block group"
                  >
                    <div className="relative overflow-hidden rounded-lg border border-[var(--gray-700)] hover:border-[var(--brand-primary)] transition-colors">
                      <img
                        src={tool.landing_page_screenshot || tool.video_demo_url}
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
          
          <div className="mt-8">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Description</h3>
            <p className="text-[var(--gray-300)] text-sm md:text-base leading-relaxed">{tool.description}</p>
          </div>
          
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
          
          {tool.startup_benefits && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Startup Benefits</h3>
              <p className="text-[var(--gray-300)]">{tool.startup_benefits}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
