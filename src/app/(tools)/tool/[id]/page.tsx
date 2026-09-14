import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, getReviewsByToolId, getToolUsageCount, getAllToolSlugs, getAllTools } from '@/lib/actions/tools';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { siteUrl } from '@/lib/constants/site';
import RelatedTools, { mergeRelatedTools } from '@/components/features/tools/RelatedTools';
import Link from 'next/link';
import { isToolIndexable } from '@/lib/tool-content';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
import { hasPublishedTrial, toolSourceLinks } from '@/lib/verifiedToolFacts';

export const revalidate = 300; // 5 minutes - faster updates for ratings and reviews
export const dynamicParams = true;

interface ToolPageProps {
  params: Promise<{ id: string }>;
}

function formatObservedDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function pricingSummary(tool: Tool): string {
  if (tool.pricing_from != null && tool.pricing_from > 0) {
    return `From $${tool.pricing_from}/mo`;
  }
  if (tool.pricing_models?.length > 0) {
    return tool.pricing_models.filter((model) => model.toLowerCase() !== 'trial').join(', ');
  }
  if (tool.free_tier_available) return 'Free';
  if (tool.pricing_type) {
    return tool.pricing_type.charAt(0).toUpperCase() + tool.pricing_type.slice(1);
  }
  return 'Pricing not available';
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
    robots: isToolIndexable(tool)
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
  const sourceLinks = toolSourceLinks(tool);
  const visitHref = addRefToUrl(tool.affiliate_url || tool.website || '');

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
    <div className="min-h-screen bg-[var(--ink)] selection:bg-[var(--copper)] selection:text-[var(--ink)]">
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

      <header className="tool-page-hero border-b border-[var(--line)]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-10 md:pb-14">
          <nav
            aria-label="Breadcrumb"
            className="tool-animate-in flex flex-wrap items-center gap-2 text-xs text-[var(--gray-500)] mb-8"
          >
            <Link href="/" className="hover:text-[var(--paper)] transition-colors">
              Home
            </Link>
            <span aria-hidden="true" className="text-[var(--gray-700)]">/</span>
            <Link
              href={`/tools/${primaryCategorySlug || 'all'}`}
              className="hover:text-[var(--paper)] transition-colors"
            >
              {primaryCategoryName}
            </Link>
            <span aria-hidden="true" className="text-[var(--gray-700)]">/</span>
            <span className="text-[var(--gray-300)]">{tool.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-end">
            <div className="flex-1 min-w-0">
              <div className="tool-animate-in tool-animate-in-delay-1 flex gap-5 md:gap-6 items-start">
                <ToolLogo
                  logoUrl={tool.logo_url}
                  name={tool.name}
                  size="xl"
                  containerClassName="shadow-[0_0_0_1px_var(--line)] shrink-0"
                />
                <div className="min-w-0 pt-1">
                  <p className="tool-section-label mb-3">
                    AI tool · {primaryCategoryName}
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[var(--paper)] leading-[0.95] tracking-tight">
                    {tool.name}
                  </h1>
                  {tool.short_description && (
                    <p className="mt-4 text-[var(--gray-400)] text-base md:text-lg max-w-2xl leading-relaxed">
                      {tool.short_description}
                    </p>
                  )}
                </div>
              </div>

              <div className="tool-animate-in tool-animate-in-delay-2 mt-6 flex flex-wrap gap-2">
                {tool.verified && <span className="tool-chip tool-chip-ok">Verified</span>}
                {tool.is_featured && <span className="tool-chip tool-chip-accent">Featured</span>}
                {tool.startup_friendly && (
                  <span className="tool-chip tool-chip-ok">Startup Friendly</span>
                )}
                {tool.ideal_for?.slice(0, 4).map((item: string) => (
                  <span key={item} className="tool-chip">
                    {item}
                  </span>
                ))}
              </div>

              <div className="tool-animate-in tool-animate-in-delay-3 mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-center">
                <VisitToolButton
                  href={visitHref}
                  toolId={tool.id}
                  toolName={tool.name}
                  toolSlug={tool.slug}
                  categories={tool.categories?.map((c: { name: string }) => c.name) || []}
                  isAffiliate={!!tool.affiliate_url}
                  className="btn-primary inline-flex px-6 py-3 font-semibold text-sm"
                >
                  Visit {tool.name}
                </VisitToolButton>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[var(--gray-500)] text-sm">Rating</span>
                  <ToolRatingBadge tool={tool} className="text-sm" />
                </div>
              </div>
            </div>

            {(tool.tags?.length ?? 0) > 0 && (
              <div className="tool-animate-in tool-animate-in-delay-2 lg:max-w-xs">
                <p className="tool-section-label">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags!.slice(0, 8).map((tag: string) => (
                    <span key={tag} className="tool-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-8 min-w-0">
            {(tool.landing_page_screenshot || tool.video_demo_url) && (
              <a
                href={visitHref}
                target="_blank"
                rel="noopener nofollow"
                aria-label={`Go to the ${tool.name} website`}
                className="block group mb-2"
              >
                <div className="relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--ink-2)]">
                  <img
                    src={tool.landing_page_screenshot || tool.video_demo_url}
                    alt={`${tool.name} landing page preview`}
                    className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/50 via-transparent to-transparent opacity-80 pointer-events-none" />
                  <div className="absolute inset-0 flex items-end justify-start p-5 md:p-6">
                    <span className="translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-copper text-[var(--ink)] px-4 py-2 rounded-lg text-sm font-semibold">
                      Visit website
                    </span>
                  </div>
                </div>
              </a>
            )}

            <ToolTLDR tool={tool} />

            <section className="tool-section">
              <p className="tool-section-label">Overview</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mb-4 leading-tight">
                What is {tool.name}?
              </h2>
              <p className="text-[var(--gray-300)] text-sm md:text-base leading-relaxed">
                {tool.description}
              </p>
            </section>

            {tool.use_cases && tool.use_cases.length > 0 && (
              <section className="tool-section">
                <p className="tool-section-label">Audience</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mb-5 leading-tight">
                  Who should use {tool.name}?
                </h2>
                <ul className="space-y-3">
                  {tool.use_cases.map((useCase: string, index: number) => (
                    <li
                      key={index}
                      className="flex gap-3 text-[var(--gray-300)] text-sm md:text-base leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper"
                      />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tool.features && tool.features.length > 0 && (
              <section className="tool-section">
                <p className="tool-section-label">Capabilities</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mb-5 leading-tight">
                  Key features
                </h2>
                <ul className="space-y-4">
                  {tool.features.map((feature: string, index: number) => {
                    const sepIdx = feature.indexOf('::');
                    if (sepIdx > 0) {
                      const name = feature.substring(0, sepIdx).trim();
                      const desc = feature.substring(sepIdx + 2).trim();
                      return (
                        <li
                          key={index}
                          className="border-l-2 border-copper/40 pl-4"
                        >
                          <p className="text-[var(--paper)] font-medium">{name}</p>
                          <p className="text-[var(--gray-400)] text-sm mt-1 leading-relaxed">
                            {desc}
                          </p>
                        </li>
                      );
                    }
                    return (
                      <li
                        key={index}
                        className="flex gap-3 text-[var(--gray-300)] text-sm md:text-base"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper"
                        />
                        <span>{feature}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {tool.startup_benefits && (
              <section className="tool-section">
                <p className="tool-section-label">For founders</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mb-4 leading-tight">
                  Why founders love {tool.name}
                </h2>
                <p className="text-[var(--gray-300)] text-sm md:text-base leading-relaxed">
                  {tool.startup_benefits}
                </p>
              </section>
            )}

            <IndiaFitCard tool={tool} />

            <section className="tool-section">
              <p className="tool-section-label">Trust</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mb-5 leading-tight">
                Security assessment
              </h2>
              <div className="tool-meta-panel">
                <div className="flex items-center gap-3 mb-3">
                  <ToolSecurityBadge tool={tool} className="text-lg font-medium" />
                </div>
                <p className="text-[var(--gray-400)] text-sm leading-relaxed">
                  {securityDisplay.status === 'VERIFIED' &&
                    'Published posture scored 12/20 or above. We check HTTPS, a reachable privacy policy, and stated compliance commitments. We do not perform security testing.'}
                  {securityDisplay.status === 'FLAGGED' &&
                    'Published posture scored below 12/20 on Security & Data Privacy. Review the source links and the methodology before using it with sensitive data. We do not perform security testing.'}
                  {securityDisplay.status === 'NOT_ASSESSED' &&
                    'Security & Data Privacy has not been scored for this tool yet. We do not perform security testing — see How We Rate for what the automated pass actually checks.'}
                </p>
                {formatAssessedDate(tool.last_assessed_at) && (
                  <p className="text-[var(--gray-500)] text-xs mt-3">
                    Last assessed: {formatAssessedDate(tool.last_assessed_at)}
                  </p>
                )}
              </div>
            </section>

            <ToolCriteriaList detail={tool.assessment_detail} />

            <ToolQASection tool={tool} />

            <div className="tool-section">
              <ToolDetailClient
                tool={tool}
                initialReviews={reviews}
                initialUsageCount={usageCount}
              />
            </div>

            <p className="mt-8 text-[var(--gray-500)] text-xs">
              {formatAssessedDate(tool.last_assessed_at)
                ? `Last assessed: ${formatAssessedDate(tool.last_assessed_at)}`
                : `Listed: ${new Date(tool.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`}
            </p>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-5">
              <div className="tool-meta-panel space-y-5">
                <div>
                  <p className="tool-section-label mb-2">Pricing</p>
                  <p className="text-[var(--paper)] text-lg font-semibold leading-snug">
                    {pricingSummary(tool)}
                  </p>
                  {tool.free_tier_available && tool.pricing_from != null && tool.pricing_from > 0 && (
                    <p className="text-emerald-400 text-xs mt-1">Free plan available</p>
                  )}
                  <INRPriceDisplay tool={tool} className="mt-2" />
                </div>

                {hasPublishedTrial(tool.free_trial_days) && (
                  <div className="border-t border-[var(--line)] pt-4">
                    <p className="tool-section-label mb-1">Free trial</p>
                    <p className="text-emerald-400 text-sm font-medium">
                      {tool.free_trial_days} days
                    </p>
                  </div>
                )}

                {tool.pricing_tiers && tool.pricing_tiers.length > 0 && (
                  <div className="border-t border-[var(--line)] pt-4">
                    <p className="tool-section-label mb-2">Plans</p>
                    <ul className="space-y-2 text-sm">
                      {tool.pricing_tiers.map((tier) => (
                        <li key={tier.name} className="text-[var(--gray-300)]">
                          <span className="text-[var(--paper)] font-medium">{tier.name}</span>
                          {tier.price === 0
                            ? ' — $0'
                            : ` — $${tier.price}${tier.billing === 'monthly' ? '/mo' : ''}`}
                          {tier.note ? (
                            <span className="text-[var(--gray-500)]"> · {tier.note}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-[var(--line)] pt-4">
                  <VisitToolButton
                    href={visitHref}
                    toolId={tool.id}
                    toolName={tool.name}
                    toolSlug={tool.slug}
                    categories={tool.categories?.map((c: { name: string }) => c.name) || []}
                    isAffiliate={!!tool.affiliate_url}
                    className="btn-primary w-full px-4 py-2.5 font-semibold text-sm"
                  >
                    Visit {tool.name}
                  </VisitToolButton>
                </div>
              </div>

              <div className="tool-meta-panel">
                <p className="tool-section-label mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {tool.categories?.length
                    ? tool.categories.map((c: { name: string; slug?: string }) =>
                        c.slug ? (
                          <Link
                            key={c.slug || c.name}
                            href={`/tools/${c.slug}`}
                            className="tool-chip tool-chip-accent hover:border-copper transition-colors"
                          >
                            {c.name}
                          </Link>
                        ) : (
                          <span key={c.name} className="tool-chip">
                            {c.name}
                          </span>
                        ),
                      )
                    : (
                      <span className="text-[var(--gray-500)] text-sm">N/A</span>
                    )}
                </div>
              </div>

              {sourceLinks.length > 0 && (
                <div className="tool-meta-panel">
                  <p className="tool-section-label mb-2">Sources</p>
                  <ul className="space-y-2">
                    {sourceLinks.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-copper text-xs hover:text-copper-bright hover:underline"
                        >
                          {link.label}
                        </a>
                        {formatObservedDate(link.observedAt) && (
                          <span className="ml-2 text-[var(--gray-500)] text-xs">
                            Observed {formatObservedDate(link.observedAt)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[var(--gray-500)] text-xs leading-relaxed">
                    External references do not determine the One9Founders rating.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="tool-section">
          <RelatedTools tool={tool} related={related} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
