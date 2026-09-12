import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import PaperCard from '@/components/research/PaperCard';
import { getAuthor } from '@/lib/api/papersApi';
import { siteUrl } from '@/lib/constants/site';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';

export const revalidate = 3600;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}

function pageNumber(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAuthor(slug);
  if (!data) return { title: 'Author Not Found | One9Founders' };

  const { author } = data;
  const paperLabel = author.paper_count === 1 ? 'paper' : 'papers';
  return generateSEO({
    title: `${author.name} — AI Research Papers`,
    description: `Explore ${author.paper_count} AI research ${paperLabel} by ${author.name}, with summaries, citations, code links, and related work.`,
    path: `/research/authors/${author.slug}`,
    type: 'website',
    keywords: [
      `${author.name} research`,
      `${author.name} papers`,
      `${author.name} AI`,
    ],
  });
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const currentPage = pageNumber(query.page);
  const data = await getAuthor(slug, currentPage);

  if (!data || (currentPage > 1 && data.results.length === 0)) {
    notFound();
  }

  const { author, results: papers } = data;
  const totalPages = Math.max(1, Math.ceil(data.count / 20));
  const canonicalUrl = siteUrl(`/research/authors/${author.slug}`);
  const structuredData = generateStructuredData({
    '@type': 'ProfilePage',
    name: `${author.name} — AI Research Papers`,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'Person',
      name: author.name,
      url: canonicalUrl,
      subjectOf: {
        '@type': 'ItemList',
        numberOfItems: data.count,
        itemListElement: papers.map((paper, index) => ({
          '@type': 'ListItem',
          position: (currentPage - 1) * 20 + index + 1,
          url: siteUrl(`/research/${paper.arxiv_id}`),
          name: paper.title,
        })),
      },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <Link href="/research" className="text-[var(--gray-400)] hover:text-white transition-colors">
              Research
            </Link>
            <span className="mx-2 text-[var(--gray-600)]">/</span>
            <span className="text-[var(--gray-300)]">{author.name}</span>
          </nav>

          <header className="mb-8 border-b border-[var(--gray-800)] pb-8">
            <p className="text-sm font-medium text-copper mb-2">Research author</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{author.name}</h1>
            <p className="text-lg text-[var(--gray-400)]">
              {data.count.toLocaleString()} AI research {data.count === 1 ? 'paper' : 'papers'} in the
              One9Founders library, with summaries and links to original sources.
            </p>
          </header>

          <section aria-labelledby="author-papers">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 id="author-papers" className="text-xl font-bold text-white">
                Papers by {author.name}
              </h2>
              {totalPages > 1 && (
                <span className="text-sm text-[var(--gray-500)]">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {papers.map((paper) => (
                <PaperCard key={paper.arxiv_id} paper={paper} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Author papers pagination" className="flex justify-between items-center mt-8">
                {currentPage > 1 ? (
                  <Link
                    rel="prev"
                    href={currentPage === 2 ? `/research/authors/${author.slug}` : `/research/authors/${author.slug}?page=${currentPage - 1}`}
                    className="px-4 py-2 rounded-lg border border-[var(--gray-700)] text-sm text-[var(--gray-300)] hover:border-[var(--gray-500)] hover:text-white transition-colors"
                  >
                    Previous
                  </Link>
                ) : <span />}
                {currentPage < totalPages && (
                  <Link
                    rel="next"
                    href={`/research/authors/${author.slug}?page=${currentPage + 1}`}
                    className="px-4 py-2 rounded-lg border border-[var(--gray-700)] text-sm text-[var(--gray-300)] hover:border-[var(--gray-500)] hover:text-white transition-colors"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
