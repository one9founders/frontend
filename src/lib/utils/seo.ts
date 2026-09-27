import { Metadata } from 'next';
import { SITE_NAME, SITE_URL, siteUrl } from '@/lib/constants/site';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  robots?: Metadata['robots'];
}

const TITLE_MAX = 110;
const BRAND_SUFFIX = ` | ${SITE_NAME}`;
const DANGLING_WORDS = new Set([
  'and',
  'or',
  '&',
  'with',
  'for',
  'of',
  'the',
  'a',
  'an',
  'to',
  'in',
  'on',
]);

function stripDanglingWords(value: string): string {
  const parts = value.split(/\s+/).filter(Boolean);
  while (parts.length > 2) {
    const last = parts[parts.length - 1].replace(/[&,.:]+$/u, '').toLowerCase();
    if (!DANGLING_WORDS.has(last)) break;
    parts.pop();
  }
  return parts.join(' ').replace(/[\s|,:–—&-]+$/u, '').trim();
}

/**
 * Editorial assessment gate for SEO helpers.
 * Prefer `criteria_completed` (what the API actually sends); `assessed` is a
 * legacy boolean that is rarely populated on list/detail payloads.
 */
export function isToolAssessed(tool: {
  assessed?: boolean | null;
  criteria_completed?: number | null;
}): boolean {
  if (tool.assessed === true) return true;
  const completed = Number(tool.criteria_completed ?? 0);
  return Number.isFinite(completed) && completed >= 6;
}

/**
 * Keep a complete title. Do not chop a phrase to a 60-character budget.
 * Extremely long titles are trimmed on a word boundary, never after "and" or "&".
 */
export function fitSeoTitle(title: string, max = TITLE_MAX): string {
  const stripped = title
    .replace(new RegExp(`\\s*\\|\\s*${SITE_NAME}\\s*$`), '')
    .trim();
  const core = stripDanglingWords(stripped.replace(/[\s|,:–—&-]+$/u, ''));
  const withBrand = `${core}${BRAND_SUFFIX}`;
  if (withBrand.length <= max) return withBrand;

  const budget = Math.max(16, max - BRAND_SUFFIX.length);
  const sliced = stripDanglingWords(
    core.slice(0, budget).replace(/\s+\S*$/, ''),
  );
  return `${sliced}${BRAND_SUFFIX}`;
}

/** Directory titles name the page contents and do not claim a hands-on review. */
export function directoryPageTitle(name: string, assessed = false): string {
  const subject = (name || 'AI product').trim();
  if (assessed) return `${subject}: Pricing, Features & Alternatives`;
  return `${subject}: Features, Pricing & Alternatives`;
}

export function generateSEO({
  title,
  description,
  path = '',
  image = '/og-image.png',
  type = 'website',
  keywords = [],
  robots,
}: SEOProps): Metadata {
  const url = siteUrl(path);
  const fullTitle = fitSeoTitle(title);

  const metaDescription = description.length > 160
    ? `${description.substring(0, 157)}...`
    : description;

  return {
    title: {
      absolute: fullTitle,
    },
    description: metaDescription,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description: metaDescription,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [image],
      creator: '@one9founders',
    },
    robots: robots ?? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStructuredData(data: object) {
  return {
    '@context': 'https://schema.org',
    ...data,
  };
}

export function organizationJsonLd() {
  return generateStructuredData({
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: siteUrl('/logo-light.png'),
    email: 'hello@one9founders.com',
    foundingDate: '2024',
    areaServed: ['India', 'Global'],
    sameAs: [
      'https://x.com/one9founders',
      'https://www.facebook.com/one9founders',
      'https://www.instagram.com/one9founders',
      'https://in.linkedin.com/company/one9founders',
      'https://www.youtube.com/@One9Founders',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@one9founders.com',
      contactType: 'Customer Service',
    },
  });
}
