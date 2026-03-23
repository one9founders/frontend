import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LLMExplorerClient from '@/components/features/llms/LLMExplorerClient';
import { LLMDataset } from '@/types/llm';
import llmData from '../../../public/data/llm-models.json';

export const metadata: Metadata = generateSEO({
  title: 'Compare 177+ LLMs | Pricing, Benchmarks & Arena Rankings | One9Founders',
  description:
    'Compare GPT-5, Claude, Gemini, Llama, DeepSeek and 177+ LLMs. Pricing in USD & INR, Arena Elo rankings, context windows, and India-affordable tags.',
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

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-4">
        <p className="text-sm text-[var(--gray-400)] max-w-3xl">
          Compare 177 large language models across pricing, benchmarks, context windows, and Arena Elo rankings. Filter by provider, open-source status, and India-affordable pricing. Data sourced from LMSYS Chatbot Arena and official provider documentation.
        </p>
      </div>
      <LLMExplorerClient dataset={dataset} />
      <Footer />
    </div>
  );
}
