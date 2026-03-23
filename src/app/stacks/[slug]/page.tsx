import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateSEO } from '@/lib/utils/seo';
import FounderStackTemplate from '@/components/features/stacks/FounderStackTemplate';
import { allStacks } from '@/components/features/stacks/stackData';
import { fetchToolsForStack } from '@/lib/api/stackApi';
import { StackPageData } from '@/components/features/stacks/FounderStackTemplate';

// ISR: revalidate every 5 minutes so DB price updates propagate without redeploy
export const revalidate = 300;

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

/**
 * Enrich stack data with live pricing from the backend API.
 * Falls back to hardcoded values when API data is unavailable.
 */
async function enrichStackData(data: StackPageData): Promise<StackPageData> {
  const allSlugs = data.categories.flatMap(cat => cat.tools.map(t => t.slug));
  const liveData = await fetchToolsForStack(allSlugs);

  const enrichedCategories = data.categories.map(cat => ({
    ...cat,
    tools: cat.tools.map(tool => {
      const live = liveData[tool.slug];
      if (!live) return tool;

      return {
        ...tool,
        priceUSD: live.priceUSD ?? tool.priceUSD,
        priceINR: live.priceINR ?? tool.priceINR,
        freeTier: live.freeTier ?? tool.freeTier,
        score: live.score > 0 ? live.score : tool.score,
        securityRating: live.securityRating > 0 ? live.securityRating : tool.securityRating,
      };
    }),
  }));

  return { ...data, categories: enrichedCategories };
}

export default async function StackPage({ params }: StackPageProps) {
  const { slug } = await params;
  const data = allStacks[slug];

  if (!data) {
    notFound();
  }

  const enrichedData = await enrichStackData(data);

  return <FounderStackTemplate data={enrichedData} />;
}
