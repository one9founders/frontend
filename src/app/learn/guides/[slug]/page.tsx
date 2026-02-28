import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guidesAPI } from '@/lib/api/apiClient';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import type { GuideDetail } from '@/types';

export const revalidate = 300;

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide: GuideDetail | null = await guidesAPI.getBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | One9Founders',
      description: 'The requested guide could not be found.',
    };
  }

  const seoTitle = guide.meta_title || guide.title;
  const seoDescription =
    guide.meta_description ||
    guide.short_description ||
    guide.title;

  return generateSEO({
    title: seoTitle,
    description: seoDescription,
    path: `/learn/guides/${guide.slug}`,
    keywords: [
      guide.title,
      'ChatGPT for business India',
      'AI guide',
      `${guide.category} guide`,
      `${guide.difficulty} guide`,
      'startup AI',
      'founder guides',
      'AI tools for business',
    ],
  });
}

interface FAQItem {
  question: string;
  answer: string;
}

function getGuideFAQs(guide: GuideDetail): FAQItem[] {
  const faqs: FAQItem[] = [
    {
      question: 'What is ChatGPT and how can it help my business in India?',
      answer:
        'ChatGPT is an AI-powered conversational assistant by OpenAI. Indian entrepreneurs use it for marketing copy, customer support scripts, market research, product brainstorming, and more — saving hours of work every week.',
    },
    {
      question: 'Is ChatGPT free to use for business?',
      answer:
        'Yes. ChatGPT offers a free tier with access to GPT-4o mini. The Plus plan at $20/month unlocks faster responses, GPT-4o, image generation with DALL-E, and file analysis — ideal for regular business use.',
    },
    {
      question: 'Can non-technical founders use ChatGPT effectively?',
      answer:
        'Absolutely. ChatGPT requires no coding knowledge. If you can type a message, you can use it. This guide walks you through setup, prompting techniques, and real-world use cases step by step.',
    },
    {
      question: 'What are the best ChatGPT use cases for Indian startups?',
      answer:
        'Common use cases include drafting marketing content in English and regional languages, writing cold outreach emails, creating SOPs, analysing competitor websites, building financial models, and generating MVP code.',
    },
    {
      question: 'What are the best alternatives to ChatGPT for business?',
      answer:
        'Popular alternatives include Google Gemini (great for Google Workspace users), Claude by Anthropic (ideal for long documents), Microsoft Copilot (for Office 365), Perplexity AI (for research), and Jasper (for marketing content).',
    },
    {
      question: `How long does it take to complete this guide?`,
      answer: `This guide takes approximately ${guide.estimated_time || '20 minutes'} to read. It is designed for ${guide.difficulty}-level readers and covers everything from account setup to advanced tips.`,
    },
  ];

  return faqs;
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide: GuideDetail | null = await guidesAPI.getBySlug(slug);

  if (!guide) {
    notFound();
  }

  const faqs = getGuideFAQs(guide);

  const articleSchema = generateStructuredData({
    '@type': 'Article',
    headline: guide.title,
    description: guide.meta_description || guide.short_description,
    author: {
      '@type': 'Organization',
      name: guide.author || 'One9Founders',
      url: 'https://one9founders.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'One9Founders',
      url: 'https://one9founders.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://one9founders.com/logo-light.png',
      },
    },
    datePublished: guide.published_at,
    dateModified: guide.last_updated || guide.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://one9founders.com/learn/guides/${guide.slug}`,
    },
    image: guide.featured_image || 'https://one9founders.com/logo-light.png',
  });

  const faqSchema = generateStructuredData({
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });

  const difficultyLabel =
    guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Guides', path: '/learn/guides' },
          { name: guide.title, path: `/learn/guides/${guide.slug}` },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--brand-primary)] text-white">
              {difficultyLabel}
            </span>
            {guide.estimated_time && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--gray-800)] text-[var(--gray-300)]">
                {guide.estimated_time}
              </span>
            )}
            {guide.category && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--gray-800)] text-[var(--gray-300)]">
                {guide.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {guide.title}
          </h1>

          {guide.short_description && (
            <p className="text-lg text-[var(--gray-400)] mb-4 leading-relaxed">
              {guide.short_description}
            </p>
          )}

          <div className="flex items-center text-[var(--gray-500)] text-sm space-x-4">
            <span>By {guide.author || 'One9Founders'}</span>
            {guide.published_at && (
              <>
                <span>&middot;</span>
                <span>
                  {new Date(guide.published_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </>
            )}
            {guide.last_updated && (
              <>
                <span>&middot;</span>
                <span>
                  Updated{' '}
                  {new Date(guide.last_updated).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {guide.featured_image && (
          <div className="mb-8">
            <img
              src={guide.featured_image}
              alt={guide.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        {/* Tools Used */}
        {guide.tools_used && guide.tools_used.length > 0 && (
          <div className="mb-8 p-4 rounded-lg bg-[var(--gray-900)] border border-[var(--gray-800)]">
            <h3 className="text-sm font-semibold text-white mb-2">Tools Covered</h3>
            <div className="flex flex-wrap gap-2">
              {guide.tools_used.map((tool) => (
                <a
                  key={tool.id}
                  href={`/tool/${tool.slug}`}
                  className="flex items-center gap-2 text-sm text-[var(--gray-300)] hover:text-white bg-[var(--gray-800)] px-3 py-1.5 rounded-full transition-colors"
                >
                  {tool.logo_url && (
                    <img
                      src={tool.logo_url}
                      alt={tool.name}
                      className="w-4 h-4 rounded"
                    />
                  )}
                  {tool.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Guide Content */}
        <div
          className="guide-content"
          dangerouslySetInnerHTML={{ __html: guide.content || '' }}
        />

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg p-5"
              >
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-[var(--gray-400)] text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

      </article>
    </>
  );
}
