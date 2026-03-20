import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AgentDetailClient from '@/components/features/agents/AgentDetailClient';
import { generateStructuredData } from '@/lib/utils/seo';
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

  const description = agent.short_description
    ? agent.short_description.substring(0, 155)
    : `Discover ${agent.name} - an AI agent for ${agent.category_name || 'various tasks'}.`;

  const ogDescription = agent.short_description
    ? agent.short_description.substring(0, 200)
    : description;

  return {
    title: `${agent.name} - Review, Features & Alternatives | One9Founders`,
    description,
    openGraph: {
      title: `${agent.name} | One9Founders AI Agents`,
      description: ogDescription,
      type: 'website',
      url: `https://one9founders.com/agents/${agent.slug}`,
      images: agent.logo_url ? [{ url: agent.logo_url }] : undefined,
    },
    alternates: {
      canonical: `https://one9founders.com/agents/${agent.slug}`,
    },
  };
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
    ...(agent.category_slug
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
      price: agent.pricing_model === 'Free' ? '0' : undefined,
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
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <Breadcrumbs items={breadcrumbs} />
      <main className="py-6 md:py-10 px-4 md:px-6">
        <AgentDetailClient agent={agent} />
      </main>
      <Footer />
    </div>
  );
}
