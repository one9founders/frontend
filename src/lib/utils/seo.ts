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

const TITLE_MAX = 60;
const BRAND_SUFFIX = ` | ${SITE_NAME}`;

/** Indexable only when assessed is explicitly true. Missing/undefined is false. */
export function isToolAssessed(tool: { assessed?: boolean | null }): boolean {
  return tool.assessed === true;
}

/** Cap a title at ~60 characters, keeping a single brand suffix. */
export function fitSeoTitle(title: string, max = TITLE_MAX): string {
  const withBrand = title.includes(SITE_NAME) ? title : `${title}${BRAND_SUFFIX}`;
  if (withBrand.length <= max) return withBrand;

  if (withBrand.endsWith(BRAND_SUFFIX)) {
    const budget = max - BRAND_SUFFIX.length;
    if (budget < 16) return `${withBrand.slice(0, max - 1).trimEnd()}…`;
    const core = withBrand.slice(0, -BRAND_SUFFIX.length);
    const sliced = core.slice(0, budget).trimEnd();
    const atWord = sliced.replace(/\s+\S*$/, '').replace(/[\s|,:–—-]+$/u, '');
    const trimmed = atWord.length >= 16 ? atWord : sliced.replace(/[\s|,:–—-]+$/u, '');
    return `${trimmed}${BRAND_SUFFIX}`;
  }

  return `${withBrand.slice(0, max - 1).trimEnd()}…`;
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
