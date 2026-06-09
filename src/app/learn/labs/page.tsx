export const runtime = 'edge';

import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { labsAPI } from '@/lib/api/apiClient';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import LearnArchivePage from '@/components/shared/LearnArchivePage';
import type { LearningContent } from '@/types';

export const metadata: Metadata = generateSEO({
  title: 'Hands-On AI Labs for Founders',
  description: 'Interactive, project-based labs to build real skills with AI tools. Practice in sandboxed environments with guided exercises.',
  path: '/learn/labs',
  keywords: ['AI labs', 'hands-on AI', 'interactive AI exercises', 'AI tool practice', 'startup labs'],
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

interface LabsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LabsPage({ searchParams }: LabsPageProps) {
  const params = await searchParams;
  const difficulty = typeof params.difficulty === 'string' ? params.difficulty : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const audience = typeof params.audience === 'string' ? params.audience : '';

  const hasActiveFilters = !!(difficulty || category || audience);

  let items: LearningContent[] = [];
  try {
    const response = await labsAPI.getAll({
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
    name: 'Hands-On AI Labs for Founders',
    description: 'Interactive, project-based labs to build real skills with AI tools.',
    url: 'https://www.one9founders.com/learn/labs',
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
          { name: 'Labs', path: '/learn/labs' },
        ]}
      />
      <LearnArchivePage
        title="Hands-On Labs"
        description="Interactive, project-based exercises to build real skills with AI tools in guided environments."
        basePath="/learn/labs"
        contentType="labs"
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
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
