import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
}

export function generateSEO({
  title,
  description,
  path = '',
  image = '/logo-light.png',
  type = 'website',
  keywords = [],
}: SEOProps): Metadata {
  const baseUrl = 'https://one9founders.com';
  const url = `${baseUrl}${path}`;
  const fullTitle = title.includes('One9Founders') ? title : `${title} | One9Founders`;
  
  // Ensure description is within 150-160 characters
  const metaDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: keywords.join(', '),
    authors: [{ name: 'One9Founders' }],
    creator: 'One9Founders',
    publisher: 'One9Founders',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description: metaDescription,
      siteName: 'One9Founders',
      images: [
        {
          url: image,
          width: 1200,
          height: 628,
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
    robots: {
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

export function generateStructuredData(data: any) {
  return {
    '@context': 'https://schema.org',
    ...data,
  };
}
