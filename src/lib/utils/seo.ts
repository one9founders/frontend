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

/** Indexable only when assessed is explicitly true. Missing/undefined is false. */
export function isToolAssessed(tool: { assessed?: boolean | null }): boolean {
  return tool.assessed === true;
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
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

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
