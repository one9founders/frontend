export const runtime = 'edge';

import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { guidesAPI } from '@/lib/api/apiClient';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import LearnArchivePage from '@/components/shared/LearnArchivePage';
import type { LearningContent } from '@/types';

export const metadata: Metadata = generateSEO({
  title: 'AI Tool Guides for Startup Founders',
  description: 'Step-by-step guides on choosing, implementing, and getting the most out of AI tools for your startup. Written by founders, for founders.',
  path: '/learn/guides',
  keywords: ['AI tool guides', 'startup AI tutorials', 'how to use AI tools', 'AI implementation guides', 'founder guides'],
});

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const CATEGORY_OPTIONS = [
  { value: 'ai-fundamentals', label: 'AI Fundamentals' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'natural-language-processing', label: 'Natural Language Processing' },
  { value: 'computer-vision', label: 'Computer Vision' },
  { value: 'automation', label: 'Automation' },
  { value: 'data-analytics', label: 'Data & Analytics' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'product-development', label: 'Product Development' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
  { value: 'security', label: 'Security' },
  { value: 'other', label: 'Other' },
];

const AUDIENCE_OPTIONS = [
  { value: 'founders', label: 'Founders' },
  { value: 'developers', label: 'Developers' },
  { value: 'marketers', label: 'Marketers' },
  { value: 'product-managers', label: 'Product Managers' },
  { value: 'designers', label: 'Designers' },
  { value: 'non-technical', label: 'Non-Technical' },
  { value: 'everyone', label: 'Everyone' },
];

interface GuidesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams;
  const difficulty = typeof params.difficulty === 'string' ? params.difficulty : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const audience = typeof params.audience === 'string' ? params.audience : '';

  const hasActiveFilters = !!(difficulty || category || audience);

  let items: LearningContent[] = [];
  try {
    const response = await guidesAPI.getAll({
      difficulty: difficulty || undefined,
      category: category || undefined,
      audience: audience || undefined,
    });
    items = response?.results || response || [];
    if (!Array.isArray(items)) items = [];
  } catch {
    items = [];
  }

  const structuredData = generateStructuredData({
    '@type': 'CollectionPage',
    name: 'AI Tool Guides for Startup Founders',
    description: 'Step-by-step guides on choosing, implementing, and getting the most out of AI tools for your startup.',
    url: 'https://www.one9founders.com/learn/guides',
    isPartOf: {
      '@type': 'WebSite',
      name: 'One9Founders',
      url: 'https://www.one9founders.com',
    },
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
          { name: 'Guides', path: '/learn/guides' },
        ]}
      />
      <LearnArchivePage
        title="Guides"
        description="Step-by-step tutorials on choosing, implementing, and mastering AI tools for your startup."
        basePath="/learn/guides"
        contentType="guides"
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
        items={items}
        difficultyOptions={DIFFICULTY_OPTIONS}
        categoryOptions={CATEGORY_OPTIONS}
        audienceOptions={AUDIENCE_OPTIONS}
        hasActiveFilters={hasActiveFilters}
      />
    </>
  );
}
