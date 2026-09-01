import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PaperDetailClient from '@/components/research/PaperDetailClient';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { Paper } from '@/types/paper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

interface PaperDetailPageProps {
  params: Promise<{ arxivId: string }>;
}

async function getPaper(arxivId: string): Promise<Paper | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/papers/${arxivId}/`, {
      next: { revalidate: 86400 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function getRelatedPapers(arxivId: string): Promise<Paper[]> {
  try {
    const response = await fetch(`${API_URL}/api/v1/papers/${arxivId}/related/`, {
      next: { revalidate: 86400 },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PaperDetailPageProps): Promise<Metadata> {
  const { arxivId } = await params;
  const paper = await getPaper(arxivId);
  if (!paper) return { title: 'Paper Not Found | One9Founders' };

  const description = paper.ai_summary
    ? paper.ai_summary.substring(0, 155)
    : paper.abstract?.substring(0, 155) || `AI research paper: ${paper.title}`;

  return generateSEO({
    title: `${paper.title} - AI Research | One9Founders`,
    description,
    path: `/research/${paper.arxiv_id}`,
    type: 'article',
  });
}

export default async function PaperDetailPage({ params }: PaperDetailPageProps) {
  const { arxivId } = await params;
  const [paper, relatedPapers] = await Promise.all([
    getPaper(arxivId),
    getRelatedPapers(arxivId),
  ]);

  if (!paper) {
    notFound();
  }

  const structuredData = generateStructuredData({
    '@type': 'ScholarlyArticle',
    name: paper.title,
    description: paper.ai_summary || paper.abstract,
    url: paper.arxiv_url,
    datePublished: paper.published_at,
    author: paper.authors?.map((name: string) => ({
      '@type': 'Person',
      name,
    })),
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="py-6 md:py-10 px-4 md:px-6">
        <PaperDetailClient paper={paper} relatedPapers={relatedPapers} />
      </main>
      <Footer />
    </div>
  );
}
