import { Suspense } from 'react';
import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LLMCompareClient from '@/components/features/llms/LLMCompareClient';
import { LLMDataset } from '@/types/llm';
import llmData from '../../../../public/data/llm-models.json';

export const metadata: Metadata = generateSEO({
  title: 'Compare LLMs Side by Side - GPT vs Claude vs Gemini vs Llama',
  description:
    'Compare up to 4 LLMs side by side. Pricing, benchmarks, capabilities, security, and Arena rankings compared for startup founders.',
  path: '/llms/compare',
  keywords: [
    'LLM comparison',
    'GPT vs Claude',
    'Gemini vs GPT',
    'compare AI models',
    'LLM pricing comparison',
  ],
});

export default function LLMComparePage() {
  const dataset = llmData as unknown as LLMDataset;

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-12 text-center text-[var(--gray-400)]">
            Loading comparison...
          </div>
        }
      >
        <LLMCompareClient dataset={dataset} />
      </Suspense>
      <Footer />
    </div>
  );
}
