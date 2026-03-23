import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import NewsPageClient from './NewsPageClient';

export const metadata: Metadata = generateSEO({
  title: 'AI News & Insights for Startup Founders | One9Founders',
  description: 'Weekly AI news curated for startup founders. Tool launches, model updates, funding rounds, and actionable insights. No fluff, just what matters for your stack.',
  path: '/news',
  keywords: ['AI news', 'startup insights', 'AI tools news', 'founder tips', 'AI tutorials'],
});

export default function NewsPage() {
  return <NewsPageClient />;
}
