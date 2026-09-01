import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, getReviewsByToolId, getToolUsageCount, getAllToolSlugs, getAllTools } from '@/lib/actions/tools';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { siteUrl } from '@/lib/constants/site';
import RelatedTools, { mergeRelatedTools } from '@/components/features/tools/RelatedTools';
import Link from 'next/link';
import { hasSubstantiveContent } from '@/lib/tool-content';
import Navbar from '@/components/layout/Navbar';
import ToolLogo from '@/components/shared/ToolLogo';
import ToolDetailClient from '@/components/features/tools/ToolDetailClient';
import ToolTLDR from '@/components/features/tools/ToolTLDR';
import ToolQASection, { generateQAPairs } from '@/components/features/tools/ToolQASection';
import INRPriceDisplay from '@/components/shared/INRPriceDisplay';
import { addRefToUrl } from '@/lib/utils/url';
import VisitToolButton from '@/components/features/tools/VisitToolButton';
import { Tool, Review } from '@/types';
import { getToolRatingDisplay, getToolSecurityDisplay, formatAssessedDate } from '@/lib/toolRating';
import ToolRatingBadge from '@/components/features/tools/ToolRatingBadge';
import ToolSecurityBadge from '@/components/features/tools/ToolSecurityBadge';
import ToolCriteriaList from '@/components/features/tools/ToolCriteriaList';
import IndiaFitCard from '@/components/features/tools/IndiaFitCard';

export const revalidate = 300; // 5 minutes - faster updates for ratings and reviews
export const dynamicParams = true;

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

  const primaryCategory = tool.categories?.[0]?.name || 'AI';
  const keywords = [
    tool.name,
    'AI tool',
    `${primaryCategory} tool`,
    `best ${primaryCategory.toLowerCase()} tools`,
    ...(tool.categories?.map((c: { name: string }) => c.name) || []),
    ...(tool.tags || []),
    'startup tools',
    'founder tools',
    'AI tools for startups',
  ];

  const pricingLabel = tool.pricing_models?.length > 0
    ? tool.pricing_models.join(', ')
    : tool.pricing_type
      ? tool.pricing_type.charAt(0).toUpperCase() + tool.pricing_type.slice(1)
      : '';

  const ratingDisplay = getToolRatingDisplay(tool);
  const securityDisplay = getToolSecurityDisplay(tool);
  const description = [
    tool.short_description || tool.description?.substring(0, 80),
    primaryCategory ? `Category: ${primaryCategory}.` : '',
    pricingLabel ? `Pricing: ${pricingLabel}.` : '',
    ratingDisplay.label + '.',
    securityDisplay.label + '.',
  ].filter(Boolean).join(' ').slice(0, 155);

  return generateSEO({
    title: `${tool.name} review & pricing`,
    description,
    path: `/tool/${tool.slug}`,
    image: tool.logo_url || tool.landing_page_screenshot || '/og-image.png',
    keywords,
    robots: tool.assessed === true || hasSubstantiveContent(tool)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  });
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { id } = await params;
  const tool: Tool | null = await getToolBySlug(id);
  
  if (!tool) {
    notFound();
  }

  const primaryCategorySlug = tool.categories?.[0]?.slug || '';
  const primaryCategoryName = tool.categories?.[0]?.name || 'AI Tools';

  const [reviews, usageCount, categoryData] = await Promise.all([
    getReviewsByToolId(tool.id),
    getToolUsageCount(tool.id),
    primaryCategorySlug
      ? getAllTools({ category: primaryCategorySlug, page_size: 12, ordering: '-views_count' })
      : Promise.resolve({ results: [] as Tool[] }),
  ]);
  const related = mergeRelatedTools(
    tool,
    Array.isArray(categoryData) ? categoryData : categoryData?.results || [],
  );

  const ratingDisplay = getToolRatingDisplay(tool);
  const securityDisplay = getToolSecurityDisplay(tool);

  const structuredData = generateStructuredData({
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: siteUrl(`/tool/${tool.slug}`),
    sameAs: tool.website || undefined,
    applicationCategory: tool.categories?.map((c: { name: string }) => c.name).join(', ') || 'AI Tool',
    operatingSystem: tool.platforms?.join(', ') || 'Web',
    offers: tool.pricing_models?.includes('Free') ? {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    } : tool.pricing_from ? {
      '@type': 'Offer',
      price: tool.pricing_from,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      ...(tool.pricing_inr != null ? {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: tool.pricing_inr,
          priceCurrency: 'INR',
        },
      } : {}),
    } : undefined,
    aggregateRating: ratingDisplay.status === 'RATED' && ratingDisplay.score != null ? {
      '@type': 'AggregateRating',
      ratingValue: ratingDisplay.score,
      ratingCount: 1,
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

  const breadcrumbSchema = generateStructuredData({
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: primaryCategoryName,
        item: siteUrl(`/tools/${primaryCategorySlug || 'all'}`),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: siteUrl(`/tool/${tool.slug}`),
      },
    ],
  });

  // FAQPage schema from Q&A pairs
  const qaPairs = generateQAPairs(tool);
  const faqSchema = generateStructuredData({
    '@type': 'FAQPage',
    mainEntity: qaPairs.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
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
                  <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {tool.name} – AI Tool for {tool.categories?.[0]?.name || 'Startups'}
                  </h1>
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
                    <span className="bg-copper text-white px-2 py-1 rounded text-xs">
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
                    {tool.categories?.length
                      ? tool.categories.map((c: { name: string; slug?: string }, index: number) => (
                          <span key={c.slug || c.name}>
                            {index > 0 && ', '}
                            {c.slug ? (
                              <Link href={`/tools/${c.slug}`} className="text-copper hover:text-copper-bright underline">
                                {c.name}
                              </Link>
                            ) : (
                              c.name
                            )}
                          </span>
                        ))
                      : 'N/A'}
                  </span>
                </div>
                
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                  <span className="text-[var(--gray-400)] text-sm">Rating:</span>
                  <ToolRatingBadge tool={tool} className="text-sm" />
                </div>
                
                <VisitToolButton
                  href={addRefToUrl(tool.affiliate_url || tool.website || '')}
                  toolId={tool.id}
                  toolName={tool.name}
                  toolSlug={tool.slug}
                  categories={tool.categories?.map((c: { name: string }) => c.name) || []}
                  isAffiliate={!!tool.affiliate_url}
                  className="btn-primary inline-block px-4 py-2 font-semibold text-sm"
                >
                  Visit {tool.name}
                </VisitToolButton>
                
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
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--brand-primary)] text-[var(--ink)] px-4 py-2 rounded-lg font-medium">
                          Visit Website
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-3 md:gap-4 mb-4 text-sm md:text-base">
                <div>
                  <span className="text-[var(--gray-400)]">Pricing:</span>
                  <span className="text-white ml-2">
                    {tool.pricing_from != null && tool.pricing_from > 0
                      ? `From $${tool.pricing_from}/mo`
                      : tool.pricing_models?.length > 0
                        ? tool.pricing_models.join(', ')
                        : tool.free_tier_available
                          ? 'Free'
                          : tool.pricing_type
                            ? tool.pricing_type.charAt(0).toUpperCase() + tool.pricing_type.slice(1)
                            : 'Pricing not available'}
                  </span>
                  {tool.free_tier_available && tool.pricing_from != null && tool.pricing_from > 0 && (
                    <span className="text-green-400 ml-2 text-xs">(Free tier available)</span>
                  )}
                  <INRPriceDisplay tool={tool} className="mt-1" />
                </div>
                {tool.free_trial_days && (
                  <div>
                    <span className="text-[var(--gray-400)]">Free Trial:</span>
                    <span className="text-green-400 ml-2">{tool.free_trial_days} days</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <ToolTLDR tool={tool} />
          
          <div className="mt-8">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-2">What is {tool.name}?</h2>
            <p className="text-[var(--gray-300)] text-sm md:text-base leading-relaxed">{tool.description}</p>
          </div>
          
          {tool.use_cases && tool.use_cases.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Who Should Use {tool.name}?</h2>
              <ul className="list-disc list-inside text-[var(--gray-300)] space-y-2">
                {tool.use_cases.map((useCase: string, index: number) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </div>
          )}
          
          {tool.features && tool.features.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-[var(--gray-300)] space-y-2">
                {tool.features.map((feature: string, index: number) => {
                  const sepIdx = feature.indexOf('::');
                  if (sepIdx > 0) {
                    const name = feature.substring(0, sepIdx).trim();
                    const desc = feature.substring(sepIdx + 2).trim();
                    return <li key={index}><strong className="text-white">{name}</strong> — {desc}</li>;
                  }
                  return <li key={index}>{feature}</li>;
                })}
              </ul>
            </div>
          )}
          
          {tool.startup_benefits && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Why Founders Love {tool.name}</h2>
              <p className="text-[var(--gray-300)]">{tool.startup_benefits}</p>
            </div>
          )}

          <IndiaFitCard tool={tool} />

          {/* Security Assessment */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Security Assessment</h2>
            <div className="bg-[var(--gray-800)] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <ToolSecurityBadge tool={tool} className="text-lg font-medium" />
              </div>
              <p className="text-[var(--gray-500)] text-sm">
                {securityDisplay.status === 'VERIFIED' &&
                  'Published posture scored 12/20 or above. We check HTTPS, a reachable privacy policy, and stated compliance commitments. We do not perform security testing.'}
                {securityDisplay.status === 'FLAGGED' &&
                  'Published posture scored below 12/20 on Security & Data Privacy. Review the source links and the methodology before using it with sensitive data. We do not perform security testing.'}
                {securityDisplay.status === 'NOT_ASSESSED' &&
                  'Security & Data Privacy has not been scored for this tool yet. We do not perform security testing — see How We Rate for what the automated pass actually checks.'}
              </p>
              {formatAssessedDate(tool.last_assessed_at) && (
                <p className="text-[var(--gray-500)] text-xs mt-2">
                  Last assessed: {formatAssessedDate(tool.last_assessed_at)}
                </p>
              )}
            </div>
          </div>

          <ToolCriteriaList detail={tool.assessment_detail} />

          <ToolQASection tool={tool} />

          {/* Last Updated */}
          <div className="mt-6 text-[var(--gray-500)] text-xs">
            {formatAssessedDate(tool.last_assessed_at)
              ? `Last assessed: ${formatAssessedDate(tool.last_assessed_at)}`
              : `Listed: ${new Date(tool.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`}
          </div>

          <RelatedTools tool={tool} related={related} />
        </div>
      </div>
    </div>
  );
}
