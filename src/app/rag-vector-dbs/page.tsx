import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RagDirectoryClient from '@/components/rag/RagDirectoryClient';
import { generateStructuredData } from '@/lib/utils/seo';
import { RagToolListResponse } from '@/types/rag';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'RAG & Vector DB Directory | One9Founders',
  description: 'Compare 110+ vector databases, RAG frameworks, and embedding models. Security-validated with zero affiliate bias. Backed by IIT Bombay.',
  openGraph: {
    title: 'RAG & Vector DB Directory | One9Founders',
    description: 'Compare 110+ vector databases, RAG frameworks, and embedding models.',
    type: 'website',
    url: 'https://www.one9founders.com/rag-vector-dbs',
  },
  alternates: {
    canonical: 'https://www.one9founders.com/rag-vector-dbs',
  },
};

async function fetchTools() {
  try {
    const res = await fetch(`${API_URL}/api/v1/rag/tools/?status=active&page_size=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { count: 0, next: null, previous: null, results: [] };
    const data: RagToolListResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching RAG tools:', error);
    return { count: 0, next: null, previous: null, results: [] };
  }
}

export default async function RagVectorDbsPage() {
  const data = await fetchTools();

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData({
              '@type': 'CollectionPage',
              name: 'RAG & Vector DB Directory',
              description: 'Compare 110+ vector databases, RAG frameworks, and embedding models.',
              url: 'https://www.one9founders.com/rag-vector-dbs',
            })
          ),
        }}
      />
      <Navbar />
      <main className="py-8 md:py-12 px-4 md:px-6">
        <Suspense fallback={<div className="text-center text-white py-20">Loading tools...</div>}>
          <RagDirectoryClient
            initialTools={data.results}
            initialCount={data.count || data.results.length}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
