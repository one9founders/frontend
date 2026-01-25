import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import NewsPageClient from './NewsPageClient';

export const metadata: Metadata = generateSEO({
  title: 'AI News & Insights for Founders',
  description: 'Stay updated with the latest AI tools, tips, and industry insights for founders and entrepreneurs. Expert articles and tutorials.',
  path: '/news',
  keywords: ['AI news', 'startup insights', 'AI tools news', 'founder tips', 'AI tutorials'],
});

export default function NewsPage() {
  return <NewsPageClient />;
}
