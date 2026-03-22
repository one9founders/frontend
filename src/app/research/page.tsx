import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ResearchFeedClient from '@/components/research/ResearchFeedClient';
import { generateStructuredData } from '@/lib/utils/seo';
import { PaperListResponse, PaperStats, Paper } from '@/types/paper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'AI Research Papers — Updated Daily | One9Founders',
  description: 'Stay current with the latest AI research. Daily-ingested papers from arXiv and HuggingFace with AI-generated summaries and difficulty ratings.',
  openGraph: {
    title: 'AI Research Papers | One9Founders',
    description: 'Stay current with the latest AI research. Updated daily from arXiv and HuggingFace.',
    type: 'website',
    url: 'https://www.one9founders.com/research',
  },
  alternates: {
    canonical: 'https://www.one9founders.com/research',
  },
};

async function fetchInitialData() {
  try {
    const [papersRes, trendingRes, statsRes] = await Promise.all([
      fetch(`${API_URL}/api/v1/papers/?page=1&page_size=20`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/v1/papers/trending/`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/v1/papers/stats/`, { next: { revalidate: 3600 } }),
    ]);

    const papers: PaperListResponse = papersRes.ok ? await papersRes.json() : { count: 0, next: null, previous: null, results: [] };
    const trending: Paper[] = trendingRes.ok ? await trendingRes.json() : [];
    const stats: PaperStats | null = statsRes.ok ? await statsRes.json() : null;

    return { papers, trending, stats };
  } catch (error) {
    console.error('Error fetching research data:', error);
    return {
      papers: { count: 0, next: null, previous: null, results: [] },
      trending: [],
      stats: null,
    };
  }
}

export default async function ResearchPage() {
  const { papers, trending, stats } = await fetchInitialData();

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData({
              '@type': 'CollectionPage',
              name: 'AI Research Papers',
              description: 'Stay current with the latest AI research. Updated daily from arXiv and HuggingFace.',
              url: 'https://www.one9founders.com/research',
            })
          ),
        }}
      />
      <Navbar />
      <main className="py-8 md:py-12 px-4 md:px-6">
        <Suspense fallback={<div className="text-center text-white py-20">Loading papers...</div>}>
          <ResearchFeedClient
            initialPapers={papers.results}
            initialCount={papers.count}
            trendingPapers={trending}
            stats={stats}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
