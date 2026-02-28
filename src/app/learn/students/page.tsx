import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { educationAPI } from '@/lib/api/apiClient';
import LandingPageContent from '@/components/features/education/LandingPageContent';
import type { LandingPage } from '@/types/education';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page: LandingPage | null = await educationAPI.getLandingPage('students');
  if (!page || Array.isArray(page)) {
    return generateSEO({
      title: 'AI Courses for Students',
      description: 'Practical AI skills for placements and your first job. Supported by IIT Bombay.',
      path: '/learn/students',
    });
  }
  return generateSEO({
    title: page.meta_title || page.hero_title || 'AI Courses for Students',
    description: page.meta_description || page.hero_subtitle || 'Practical AI skills for students.',
    path: '/learn/students',
    keywords: ['AI for students', 'college AI courses', 'student AI training', 'IIT Bombay', 'AI placements'],
  });
}

export default async function StudentsPage() {
  const page: LandingPage | null = await educationAPI.getLandingPage('students');

  if (!page || Array.isArray(page)) {
    notFound();
  }

  const structuredData = generateStructuredData({
    '@type': 'WebPage',
    name: page.hero_title,
    description: page.hero_subtitle,
    url: 'https://one9founders.com/learn/students',
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
          { name: 'Students', path: '/learn/students' },
        ]}
      />
      <LandingPageContent page={page} pageType="students" />
    </>
  );
}
