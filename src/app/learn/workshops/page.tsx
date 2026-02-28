import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { workshopsAPI } from '@/lib/api/apiClient';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import LearnArchivePage from '@/components/shared/LearnArchivePage';
import type { LearningContent } from '@/types';

export const metadata: Metadata = generateSEO({
  title: 'AI Workshops for Startup Founders',
  description: 'Live and recorded workshops led by AI experts. Learn practical AI tool skills, ask questions, and connect with fellow founders.',
  path: '/learn/workshops',
  keywords: ['AI workshops', 'live AI training', 'startup workshops', 'AI tool workshops', 'founder workshops'],
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

interface WorkshopsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WorkshopsPage({ searchParams }: WorkshopsPageProps) {
  const params = await searchParams;
  const difficulty = typeof params.difficulty === 'string' ? params.difficulty : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const audience = typeof params.audience === 'string' ? params.audience : '';

  const hasActiveFilters = !!(difficulty || category || audience);

  let items: LearningContent[] = [];
  try {
    const response = await workshopsAPI.getAll({
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
    name: 'AI Workshops for Startup Founders',
    description: 'Live and recorded workshops led by AI experts.',
    url: 'https://one9founders.com/learn/workshops',
    isPartOf: {
      '@type': 'WebSite',
      name: 'One9Founders',
      url: 'https://one9founders.com',
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
          { name: 'Workshops', path: '/learn/workshops' },
        ]}
      />
      <LearnArchivePage
        title="Workshops"
        description="Live and recorded sessions led by industry experts. Learn, ask questions, and network with fellow founders."
        basePath="/learn/workshops"
        contentType="workshops"
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
