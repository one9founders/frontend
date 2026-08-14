import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LLMExplorerClient from '@/components/features/llms/LLMExplorerClient';
import { LLMDataset } from '@/types/llm';
import llmData from '../../../public/data/llm-models.json';

export const metadata: Metadata = generateSEO({
  title: 'Compare 250+ LLMs | Pricing, Benchmarks & Arena Rankings | One9Founders',
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

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <LLMExplorerClient dataset={dataset} />
      <Footer />
    </div>
  );
}
