import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LLMExplorerClient from '@/components/features/llms/LLMExplorerClient';
import { LLMDataset } from '@/types/llm';
import llmData from '../../../public/data/llm-models.json';

export const metadata: Metadata = generateSEO({
  title: 'LLM Explorer — Compare 170+ AI Models | Pricing, Benchmarks & Rankings',
  description:
    'Compare GPT-5, Claude, Gemini, Llama, DeepSeek and 170+ LLMs side by side. Pricing in USD & INR, Arena rankings, capabilities, and security compliance for Indian startups.',
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
