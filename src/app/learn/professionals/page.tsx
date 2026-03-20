import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { educationAPI } from '@/lib/api/apiClient';
import LandingPageContent from '@/components/features/education/LandingPageContent';
import type { LandingPage } from '@/types/education';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page: LandingPage | null = await educationAPI.getLandingPage('professionals');
  if (!page || Array.isArray(page)) {
    return generateSEO({
      title: 'AI Courses for Working Professionals',
      description: 'Upskill in AI tools transforming your industry.',
      path: '/learn/professionals',
    });
  }
  return generateSEO({
    title: page.meta_title || page.hero_title || 'AI for Professionals',
    description: page.meta_description || page.hero_subtitle || 'AI upskilling for professionals.',
    path: '/learn/professionals',
    keywords: ['AI for professionals', 'AI upskilling', 'professional AI training', 'career AI skills'],
  });
}

export default async function ProfessionalsPage() {
  const page: LandingPage | null = await educationAPI.getLandingPage('professionals');

  if (!page || Array.isArray(page)) {
    notFound();
  }

  const structuredData = generateStructuredData({
    '@type': 'WebPage',
    name: page.hero_title,
    description: page.hero_subtitle,
    url: 'https://one9founders.com/learn/professionals',
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
          { name: 'Professionals', path: '/learn/professionals' },
        ]}
      />
      <LandingPageContent page={page} pageType="professionals" />
    </>
  );
}
