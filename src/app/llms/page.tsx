import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { siteUrl } from '@/lib/constants/site';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LLMExplorerClient from '@/components/features/llms/LLMExplorerClient';
import { LLMDataset } from '@/types/llm';
import llmData from '../../../public/data/llm-models.json';

export const metadata: Metadata = generateSEO({
  title: 'Compare 250+ LLMs',
  description:
    'Compare Claude Opus 5, GPT-5.6, Gemini, Kimi K3, DeepSeek V4, Llama, Sarvam and 250+ LLMs. Pricing in USD & INR, Arena rankings, context windows, and India-affordable tags.',
  path: '/llms',
  keywords: [
    'LLM comparison',
    'AI model directory',
    'GPT vs Claude',
    'LLM pricing India',
    'best LLM for startups',
    'open source LLMs',
    'AI model benchmarks',
    'Chatbot Arena rankings',
  ],
});

export default function LLMsPage() {
  const dataset = llmData as unknown as LLMDataset;
  const structuredData = generateStructuredData({
    '@type': 'CollectionPage',
    name: 'LLM Directory',
    url: siteUrl('/llms'),
    mainEntity: {
      '@type': 'ItemList',
      name: 'Language models',
      numberOfItems: dataset.models.length,
      itemListElement: dataset.models.slice(0, 50).map((model, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: model.name,
        url: siteUrl(`/llms/${model.slug}`),
      })),
    },
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <LLMExplorerClient dataset={dataset} />
      <Footer />
    </div>
  );
}
