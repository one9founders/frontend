import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return generateSEO({
      title: 'Blog Post Not Found',
      description: 'The blog post you are looking for does not exist.',
      path: `/blog/${slug}`,
    });
  }
  return generateSEO({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: 'article',
    keywords: ['AI tools', 'startup', post.category.toLowerCase(), 'founder guide'],
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--gray-black)]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-[var(--gray-400)]">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="text-purple-400 hover:text-purple-300 underline mt-4 inline-block">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const structuredData = generateStructuredData({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'One9Founders',
      url: 'https://www.one9founders.com',
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `https://www.one9founders.com/blog/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.one9founders.com/blog/${slug}`,
    },
  });

  const breadcrumbSchema = generateStructuredData({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.one9founders.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.one9founders.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.one9founders.com/blog/${slug}` },
    ],
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="text-[var(--gray-500)] hover:text-[var(--gray-300)] text-sm transition-colors">
              &larr; Back to Blog
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
              {post.category}
            </span>
            <span className="text-[var(--gray-500)] text-sm">{post.readingTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-[var(--gray-400)]">
            <span>By {post.author}</span>
            <span>&middot;</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-invert prose-purple max-w-none
            prose-headings:text-white prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-[var(--gray-300)] prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-12 bg-[var(--gray-900)] rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Find the Right AI Tool</h3>
          <p className="text-[var(--gray-400)] mb-4">
            Browse our directory of security-validated AI tools for startup founders.
          </p>
          <Link
            href="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Explore AI Tools
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
