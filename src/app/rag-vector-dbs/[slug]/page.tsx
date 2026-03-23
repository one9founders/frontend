import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import RagToolDetailClient from '@/components/rag/RagToolDetailClient';
import { generateStructuredData } from '@/lib/utils/seo';
import { RagTool } from '@/types/rag';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

interface RagToolDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getRagTool(slug: string): Promise<(RagTool & { similar_tools?: RagTool[] }) | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/rag/tools/${slug}/`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: RagToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getRagTool(slug);
  if (!tool) return { title: 'Not Found | One9Founders' };

  const description = tool.description
    ? tool.description.substring(0, 155)
    : `Discover ${tool.name} - a ${tool.category.replace('_', ' ')} solution for AI workflows.`;

  return {
    title: `${tool.name} - RAG & Vector DB | One9Founders`,
    description,
    openGraph: {
      title: `${tool.name} | One9Founders RAG Directory`,
      description: tool.description?.substring(0, 200) || description,
      type: 'website',
      url: `https://www.one9founders.com/rag-vector-dbs/${tool.slug}`,
      images: tool.logo_url ? [{ url: tool.logo_url }] : undefined,
    },
    alternates: {
      canonical: `https://www.one9founders.com/rag-vector-dbs/${tool.slug}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/v1/rag/tools/?status=active&page_size=200`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((tool: RagTool) => ({ slug: tool.slug }));
  } catch {
    return [];
  }
}

const categoryLabels: Record<string, string> = {
  vector_db: 'Vector Databases',
  rag_framework: 'RAG Frameworks',
  embedding_model: 'Embedding Models',
};

export default async function RagToolDetailPage({ params }: RagToolDetailPageProps) {
  const { slug } = await params;
  const tool = await getRagTool(slug);

  if (!tool) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'RAG & Vector DBs', path: '/rag-vector-dbs' },
    { name: categoryLabels[tool.category] || tool.category, path: `/rag-vector-dbs?category=${tool.category}` },
    { name: tool.name, path: `/rag-vector-dbs/${tool.slug}` },
  ];

  const structuredData = generateStructuredData({
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: tool.website_url,
    applicationCategory: categoryLabels[tool.category] || tool.category,
    offers: {
      '@type': 'Offer',
      price: tool.pricing_model === 'free' || tool.pricing_model === 'open_source' ? '0' : undefined,
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly',
    },
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
        <RagToolDetailClient key={tool.slug} tool={tool} />
      </main>
      <Footer />
    </div>
  );
}
