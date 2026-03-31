import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LLMDetailClient from '@/components/features/llms/LLMDetailClient';
import { LLMDataset } from '@/types/llm';
import llmData from '../../../../public/data/llm-models.json';

const dataset = llmData as unknown as LLMDataset;

export async function generateStaticParams() {
  return dataset.models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const model = dataset.models.find((m) => m.slug === slug);
  if (!model) {
    return generateSEO({
      title: 'Model Not Found',
      description: 'This LLM model could not be found.',
      path: `/llms/${slug}`,
    });
  }

  return generateSEO({
    title: `${model.name} by ${model.provider} - Pricing, Benchmarks & Review`,
    description:
      model.one9_summary ||
      `${model.name} from ${model.provider}. ${model.model_type === 'open-weights' ? 'Open weights model.' : `Input: $${model.input_price_per_mtok}/M tokens.`} ${model.context_window ? `${model.context_window / 1000}K context.` : ''} Compare with other LLMs on One9Founders.`,
    path: `/llms/${slug}`,
    keywords: [
      model.name,
      model.provider,
      `${model.name} pricing`,
      `${model.name} vs`,
      'LLM comparison',
      'AI model review',
    ],
  });
}

export default async function LLMDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = dataset.models.find((m) => m.slug === slug);

  if (!model) {
    notFound();
  }

  // Find similar models (same provider or same tier, excluding current)
  const similar = dataset.models
    .filter(
      (m) =>
        m.slug !== model.slug &&
        (m.provider === model.provider || m.tier === model.tier)
    )
    .slice(0, 6);

  const structuredData = generateStructuredData({
    '@type': 'SoftwareApplication',
    name: model.name,
    description: model.one9_summary || `${model.name} by ${model.provider}`,
    applicationCategory: 'AI Model',
    operatingSystem: 'Cloud',
    url: `https://www.one9founders.com/llms/${model.slug}`,
    author: {
      '@type': 'Organization',
      name: model.provider,
    },
    offers: model.input_price_per_mtok
      ? {
          '@type': 'Offer',
          price: model.input_price_per_mtok,
          priceCurrency: 'USD',
          description: 'Per 1M input tokens',
        }
      : undefined,
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <LLMDetailClient model={model} similarModels={similar} />
      <Footer />
    </div>
  );
}
