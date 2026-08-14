import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ResearchFeedClient from '@/components/research/ResearchFeedClient';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { STATS, formatCatalogCount } from '@/lib/constants/stats';
import { getPaperStats, getPapers, getTrendingPapers } from '@/lib/api/papersApi';
import { PaperListResponse, PaperStats, Paper } from '@/types/paper';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getPaperStats();
  const papers = formatCatalogCount(stats?.total_papers, STATS.researchPapers, 100);
  const authors = formatCatalogCount(stats?.total_authors, STATS.researchAuthors, 1000);

  return generateSEO({
    title: `${papers} AI Research Papers | Daily arXiv & HuggingFace`,
    description: `Browse ${papers} AI research papers from ${authors} authors. Updated daily from arXiv and HuggingFace with AI summaries and difficulty ratings.`,
    path: '/research',
    keywords: [
      'AI research papers',
      'arXiv papers',
      'HuggingFace papers',
      'latest AI research',
      'LLM research papers',
      'AI paper summaries',
      'daily arXiv digest',
    ],
  });
}

async function fetchInitialData() {
  try {
    const [papers, trending, stats] = await Promise.all([
      getPapers({ page: '1', page_size: '20' }) as Promise<PaperListResponse>,
      getTrendingPapers() as Promise<Paper[]>,
      getPaperStats(),
    ]);

    return {
      papers: papers ?? { count: 0, next: null, previous: null, results: [] },
      trending: trending ?? [],
      stats,
    };
  } catch (error) {
    console.error('Error fetching research data:', error);
    return {
      papers: { count: 0, next: null, previous: null, results: [] },
      trending: [],
      stats: null as PaperStats | null,
    };
  }
}

export default async function ResearchPage() {
  const { papers, trending, stats } = await fetchInitialData();
  const paperCount = formatCatalogCount(stats?.total_papers ?? papers.count, STATS.researchPapers, 100);
  const authorCount = formatCatalogCount(stats?.total_authors, STATS.researchAuthors, 1000);

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData({
              '@type': 'CollectionPage',
              name: `${paperCount} AI Research Papers`,
              description: `Browse ${paperCount} AI research papers from ${authorCount} authors. Updated daily from arXiv and HuggingFace.`,
              url: 'https://one9founders.com/research',
              mainEntity: {
                '@type': 'ItemList',
                name: 'AI Research Papers',
                numberOfItems: stats?.total_papers ?? papers.count,
              },
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
