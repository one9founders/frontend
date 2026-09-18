import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getNewsById } from '@/lib/api/newsService';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { siteUrl } from '@/lib/constants/site';

export const revalidate = 600;

type NewsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const article = await getNewsById(id);
    return generateSEO({
      title: article.title,
      description: article.description || article.excerpt || 'AI news for startup founders.',
      path: `/news/${article.slug || id}`,
      type: 'article',
      image: article.image || article.featured_image || '/og-image.png',
      keywords: [
        'AI news',
        article.category || 'AI',
        'startup founders',
        'AI tools',
        article.title,
      ].filter(Boolean),
    });
  } catch {
    return generateSEO({
      title: 'Article Not Found',
      description: 'This news article could not be found.',
      path: `/news/${id}`,
      robots: { index: false, follow: false },
    });
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  let article;
  try {
    article = await getNewsById(id);
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  const articleUrl = siteUrl(`/news/${article.slug || id}`);
  const published = article.published_at || article.date;

  const articleSchema = generateStructuredData({
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description || article.excerpt,
    image: article.image || article.featured_image || siteUrl('/og-image.png'),
    datePublished: published,
    dateModified: published,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'One9Founders',
      url: siteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: siteUrl('/logo-light.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category || 'AI News',
  });

  const breadcrumbSchema = generateStructuredData({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'News', item: siteUrl('/news') },
      { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
    ],
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="mb-4">
            <span className="text-[var(--ink)] text-sm px-3 py-1 rounded-full bg-[var(--brand-primary)]">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">{article.title}</h1>
          <div className="flex items-center text-[var(--gray-400)] text-sm space-x-4">
            <span>By {article.author}</span>
            <span>•</span>
            <span>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        {article.image ? (
          <div className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        ) : null}

        <div
          className="article-content prose prose-invert max-w-none
            [&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
            [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4
            [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:text-gray-300 [&_p]:my-4 [&_p]:leading-relaxed
            [&_ul]:my-4 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:pl-6
            [&_li]:my-2 [&_li]:text-gray-300"
          dangerouslySetInnerHTML={{
            __html: article.content || '<p>Content could not be displayed.</p>',
          }}
        />
      </article>

      <Footer />
    </div>
  );
}
