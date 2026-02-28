import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { educationAPI } from '@/lib/api/apiClient';
import LandingPageContent from '@/components/features/education/LandingPageContent';
import type { LandingPage } from '@/types/education';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page: LandingPage | null = await educationAPI.getLandingPage('entrepreneurs');
  if (!page || Array.isArray(page)) {
    return generateSEO({
      title: 'AI Courses for Entrepreneurs',
      description: 'Build faster. Spend less. Scale smarter with AI tools.',
      path: '/learn/entrepreneurs',
    });
  }
  return generateSEO({
    title: page.meta_title || page.hero_title || 'AI for Entrepreneurs',
    description: page.meta_description || page.hero_subtitle || 'AI tools for founders.',
    path: '/learn/entrepreneurs',
    keywords: ['AI for entrepreneurs', 'founder AI tools', 'startup AI', 'business AI automation'],
  });
}

export default async function EntrepreneursPage() {
  const page: LandingPage | null = await educationAPI.getLandingPage('entrepreneurs');

  if (!page || Array.isArray(page)) {
    notFound();
  }

  const structuredData = generateStructuredData({
    '@type': 'WebPage',
    name: page.hero_title,
    description: page.hero_subtitle,
    url: 'https://one9founders.com/learn/entrepreneurs',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Entrepreneurs', path: '/learn/entrepreneurs' },
        ]}
      />
      <LandingPageContent page={page} pageType="entrepreneurs" />
    </>
  );
}
