import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = generateSEO({
  title: 'Blog - AI Tools Insights for Startup Founders',
  description: 'Expert insights, guides, and analysis on AI tools for startup founders. Learn how to evaluate, implement, and secure AI tools for your business.',
  path: '/blog',
  keywords: ['AI tools blog', 'startup AI', 'founder insights', 'AI security', 'tool reviews'],
});

const BLOG_POSTS = [
  {
    slug: 'how-to-evaluate-ai-tools-for-your-startup',
    title: 'How to Evaluate AI Tools for Your Startup: A Founder\'s Guide',
    excerpt: 'Choosing the right AI tool can make or break your startup\'s productivity. Learn our 10-point evaluation framework that covers security, pricing, and ROI.',
    author: 'Amit Bhartiya',
    publishedAt: '2026-02-15',
    readingTime: '8 min read',
    category: 'Guides',
  },
  {
    slug: 'ai-security-what-founders-need-to-know',
    title: 'AI Security: What Every Startup Founder Needs to Know in 2026',
    excerpt: 'With data breaches on the rise, understanding AI tool security is critical. We break down the key security factors founders should evaluate before adopting any AI tool.',
    author: 'Arnav Gautam',
    publishedAt: '2026-02-28',
    readingTime: '6 min read',
    category: 'Security',
  },
  {
    slug: 'top-ai-tools-bootstrapped-startups-2026',
    title: 'Top 10 AI Tools for Bootstrapped Startups in 2026',
    excerpt: 'Running lean? These AI tools offer the best value for bootstrapped founders, with free tiers and startup-friendly pricing that won\'t drain your runway.',
    author: 'Shreya Nair',
    publishedAt: '2026-03-05',
    readingTime: '10 min read',
    category: 'Lists',
  },
];

export default function BlogPage() {
  const structuredData = generateStructuredData({
    '@type': 'Blog',
    name: 'One9Founders Blog',
    description: 'Expert insights on AI tools for startup founders.',
    url: 'https://one9founders.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'One9Founders',
      url: 'https://one9founders.com',
    },
  });

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Blog</h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            Expert insights, guides, and analysis on AI tools for startup founders.
          </p>
        </div>

        <div className="space-y-8">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="bg-[var(--gray-900)] rounded-lg p-6 hover:bg-[var(--gray-800)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                    {post.category}
                  </span>
                  <span className="text-[var(--gray-500)] text-sm">{post.readingTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-[var(--gray-400)] text-sm mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-sm text-[var(--gray-500)]">
                  <span>{post.author}</span>
                  <span>&middot;</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
