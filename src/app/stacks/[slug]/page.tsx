import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateSEO } from '@/lib/utils/seo';
import FounderStackTemplate from '@/components/features/stacks/FounderStackTemplate';
import { allStacks } from '@/components/features/stacks/stackData';

interface StackPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(allStacks).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = allStacks[slug];

  if (!data) {
    return {
      title: 'Stack Not Found | One9Founders',
      description: 'The requested founder stack could not be found.',
    };
  }

  return generateSEO({
    title: data.metaTitle,
    description: data.metaDescription,
    path: `/stacks/${data.slug}`,
    keywords: [
      'AI tools India',
      'startup tools INR pricing',
      'founder stack',
      data.title,
      'Indian startups',
      'AI tools for founders',
    ],
  });
}

export default async function StackPage({ params }: StackPageProps) {
  const { slug } = await params;
  const data = allStacks[slug];

  if (!data) {
    notFound();
  }

  return <FounderStackTemplate data={data} />;
}
