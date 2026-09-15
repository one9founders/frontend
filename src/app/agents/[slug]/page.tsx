import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AgentDetailClient from '@/components/features/agents/AgentDetailClient';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { AgentDetail } from '@/types/agent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

interface AgentDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getAgent(slug: string): Promise<AgentDetail | null> {
  try {
    const response = await fetch(`${API_URL}/api/agents/${slug}/`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) return { title: 'Agent Not Found | One9Founders' };

  const description = [
    agent.short_description,
    agent.category_name ? `Category: ${agent.category_name}.` : '',
    agent.pricing_model ? `Pricing: ${agent.pricing_model}.` : '',
    'Reviewed with zero affiliate bias. Security validated by One9Founders.',
  ].filter(Boolean).join(' ').slice(0, 155);

  return generateSEO({
    title: `${agent.name} - Review, Features & Alternatives | One9Founders`,
    description,
    path: `/agents/${agent.slug}`,
    image: agent.logo_url || '/og-image.png',
  });
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { slug } = await params;
  const agent = await getAgent(slug);

  if (!agent) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'AI Agents', path: '/agents' },
    ...(agent.category_slug && agent.category_name
      ? [{ name: agent.category_name, path: `/agents/category/${agent.category_slug}` }]
      : []),
    { name: agent.name, path: `/agents/${agent.slug}` },
  ];

  // JSON-LD structured data
  const structuredData = generateStructuredData({
    '@type': 'SoftwareApplication',
    name: agent.name,
    description: agent.short_description,
    url: agent.website,
    applicationCategory: agent.category_name,
    offers: {
      '@type': 'Offer',
      price: agent.pricing_model?.toLowerCase() === 'free' ? '0' : undefined,
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly',
    },
    ...(agent.review_count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: agent.average_rating.toString(),
            reviewCount: agent.review_count.toString(),
          },
        }
      : {}),
  });

  return (
    <div className="min-h-screen bg-[var(--ink)] selection:bg-[var(--copper)] selection:text-[var(--ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <div className="tool-page-hero border-b border-[var(--line)]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      <main className="py-8 md:py-12 px-4 md:px-6">
        <AgentDetailClient key={agent.slug} agent={agent} />
      </main>
      <Footer />
    </div>
  );
}
