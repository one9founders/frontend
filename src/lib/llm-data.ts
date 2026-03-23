import { LLMDataset, LLMModel } from '@/types/llm';

let cachedData: LLMDataset | null = null;

export async function getLLMData(): Promise<LLMDataset> {
  if (cachedData) return cachedData;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.one9founders.com'}/data/llm-models.json`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    // Fallback: try relative import for build time
    const fallbackRes = await fetch('http://localhost:3000/data/llm-models.json').catch(() => null);
    if (fallbackRes?.ok) {
      cachedData = await fallbackRes.json();
      return cachedData!;
    }
    throw new Error('Failed to fetch LLM data');
  }

  cachedData = await res.json();
  return cachedData!;
}

export function getLLMDataSync(data: LLMDataset): LLMModel[] {
  return data.models;
}

export function getModelBySlug(data: LLMDataset, slug: string): LLMModel | undefined {
  return data.models.find((m) => m.slug === slug);
}

export function getAllSlugs(data: LLMDataset): string[] {
  return data.models.map((m) => m.slug);
}

export const PROVIDER_COLORS: Record<string, string> = {
  Anthropic: '#D97706',
  OpenAI: '#10B981',
  Google: '#3B82F6',
  DeepSeek: '#8B5CF6',
  xAI: '#EF4444',
  Meta: '#06B6D4',
  Mistral: '#F59E0B',
  Alibaba: '#EC4899',
  Cohere: '#14B8A6',
  Amazon: '#F97316',
  'Z AI': '#6366F1',
  Kimi: '#84CC16',
  MiniMax: '#A855F7',
  NVIDIA: '#22C55E',
  Microsoft: '#0078D4',
  Tsinghua: '#FF6B6B',
  EleutherAI: '#9333EA',
  BigScience: '#F472B6',
  'Together AI': '#2DD4BF',
  TII: '#FB923C',
  'Stability AI': '#A78BFA',
  '01.AI': '#34D399',
  'Nous Research': '#818CF8',
  Databricks: '#EF4444',
  Upstage: '#F59E0B',
  'Shanghai AI Lab': '#3B82F6',
};

export const TIER_LABELS: Record<string, string> = {
  frontier: 'Frontier',
  'near-frontier': 'Near-Frontier',
  strong: 'Strong',
  capable: 'Capable',
  'entry-level': 'Entry',
  unranked: 'Unranked',
};

export const TIER_COLORS: Record<string, string> = {
  frontier: '#F59E0B',
  'near-frontier': '#3B82F6',
  strong: '#10B981',
  capable: '#8B5CF6',
  'entry-level': '#6B7280',
  unranked: '#4B5563',
};

export const CAPABILITY_LABELS: Record<string, string> = {
  function_calling: 'Function Calling',
  structured_output: 'Structured Output',
  vision: 'Vision',
  web_search: 'Web Search',
  code_execution: 'Code Execution',
  mcp: 'MCP',
  audio_input: 'Audio Input',
  video_input: 'Video Input',
  reasoning: 'Reasoning',
  streaming: 'Streaming',
  batch_api: 'Batch API',
  computer_use: 'Computer Use',
};

export function formatContext(ctx: number | null): string {
  if (!ctx) return '-';
  if (ctx >= 1000000) return `${ctx / 1000000}M`;
  return `${ctx / 1000}K`;
}

export function formatPrice(
  price: number | null,
  currency: 'usd' | 'inr' = 'usd',
  inrRate: number = 84.5
): string {
  if (price === null || price === undefined) return '-';
  if (currency === 'inr') {
    const inr = price * inrRate;
    if (inr < 1) return `₹${inr.toFixed(2)}`;
    return `₹${inr.toFixed(0)}`;
  }
  if (price < 0.01) return `$${price}`;
  return `$${price.toFixed(2)}`;
}

export function formatDownloads(downloads: number | null): string {
  if (!downloads) return '-';
  if (downloads >= 1000000) return `${(downloads / 1000000).toFixed(1)}M`;
  if (downloads >= 1000) return `${(downloads / 1000).toFixed(0)}K`;
  return `${downloads}`;
}

export const INR_RATE = 84.5;

export const QUICK_PICK_LABELS: Record<string, { title: string; emoji: string }> = {
  best_overall: { title: 'Best Overall', emoji: '🏆' },
  best_value: { title: 'Best Value', emoji: '💰' },
  best_for_code: { title: 'Best for Code', emoji: '💻' },
  best_for_indian_startups: { title: 'Best for Indian Startups', emoji: '🇮🇳' },
  best_open_source: { title: 'Best Open Source', emoji: '🔓' },
  cheapest: { title: 'Most Affordable', emoji: '⚡' },
};
