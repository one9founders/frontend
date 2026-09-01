import { Metadata } from 'next';
import { getAllTools } from '@/lib/actions/tools';
import { fetchDirectoryStats, getCategoryCount } from '@/lib/api/toolsStats';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import { siteUrl } from '@/lib/constants/site';
import { hasSubstantiveContent } from '@/lib/tool-content';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolCard from '@/components/features/tools/ToolCard';
import { Tool } from '@/types';

export const revalidate = 3600;
export const dynamicParams = true;

const CATEGORIES: Record<string, { name: string; description: string; editorial: string }> = {
  writing: {
    name: 'Writing',
    description: 'AI writing tools for content creation, copywriting, and editing. Security-validated for startup founders.',
    editorial: 'AI writing tools have transformed content creation for startups. From blog posts and marketing copy to technical documentation, these tools help founders produce high-quality content at scale without hiring large content teams.',
  },
  images: {
    name: 'Images',
    description: 'AI image generation and editing tools. Security-validated for startup founders.',
    editorial: 'AI image tools enable startups to create professional visuals without a dedicated design team. From product mockups and social media graphics to brand assets, these tools democratize visual content creation for early-stage companies.',
  },
  video: {
    name: 'Video',
    description: 'AI video creation, editing, and production tools. Security-validated for startup founders.',
    editorial: 'Video content drives engagement, and AI video tools make production accessible to resource-constrained startups. Create product demos, social clips, and marketing videos without expensive production setups.',
  },
  code: {
    name: 'Code',
    description: 'AI coding assistants and developer tools. Security-validated for startup founders.',
    editorial: 'AI coding tools accelerate development velocity for startup engineering teams. From code completion and review to automated testing and documentation, these tools help small teams ship faster.',
  },
  chatbots: {
    name: 'Chatbots',
    description: 'AI chatbot and conversational AI tools. Security-validated for startup founders.',
    editorial: 'AI chatbots enable startups to provide 24/7 customer support without scaling headcount. From customer service automation to lead qualification and onboarding, chatbot tools are essential for capital-efficient growth.',
  },
  marketing: {
    name: 'Marketing',
    description: 'AI marketing tools for growth, SEO, and campaigns. Security-validated for startup founders.',
    editorial: 'AI marketing tools level the playing field for startups competing against established brands. Automate SEO, optimize ad spend, personalize outreach, and analyze campaign performance with data-driven precision.',
  },
  productivity: {
    name: 'Productivity',
    description: 'AI productivity and workflow automation tools. Security-validated for startup founders.',
    editorial: 'Productivity AI tools help lean startup teams do more with less. From meeting transcription and task management to email automation and scheduling, these tools eliminate busywork so founders can focus on building.',
  },
  design: {
    name: 'Design',
    description: 'AI design and creative tools. Security-validated for startup founders.',
    editorial: 'AI design tools empower non-designers to create professional-grade assets. From UI/UX prototyping and logo creation to presentation design, startups can maintain brand quality without a full design team.',
  },
  analytics: {
    name: 'Analytics',
    description: 'AI analytics and data intelligence tools. Security-validated for startup founders.',
    editorial: 'Data-driven decision making is critical for startups. AI analytics tools help founders understand user behavior, predict trends, and extract actionable insights from complex datasets without needing a dedicated data team.',
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

function titleCaseSlug(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function hubFromTools(slug: string, tools: Tool[]) {
  if (CATEGORIES[slug]) return { slug, ...CATEGORIES[slug] };
  const named = tools
    .flatMap((tool) => tool.categories || [])
    .find((category) => category.slug === slug);
  if (!named && tools.length === 0) return null;
  const name = named?.name || titleCaseSlug(slug);
  return {
    slug,
    name,
    description: `Browse ${name} AI tools for startup founders. Compare pricing, features, and security-first ratings.`,
    editorial: `${name} tools in the One9Founders directory, scored from published evidence with zero affiliate bias.`,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  if (CATEGORIES[category]) {
    const cat = CATEGORIES[category];
    return generateSEO({
      title: `Best AI ${cat.name} Tools for Startups (2026)`,
      description: cat.description,
      path: `/tools/${category}`,
      keywords: [`AI ${cat.name.toLowerCase()} tools`, `best ${cat.name.toLowerCase()} AI`, 'startup tools', 'founder tools', 'security validated'],
    });
  }

  const data = await getAllTools({ category, page_size: 1 });
  const tools: Tool[] = Array.isArray(data) ? data : (data?.results || []);
  const cat = hubFromTools(category, tools);
  if (!cat) {
    return generateSEO({
      title: 'AI Tools Directory',
      description: 'Browse security-validated AI tools for startup founders.',
      path: '/tools',
    });
  }
  return generateSEO({
    title: `Best AI ${cat.name} Tools for Startups (2026)`,
    description: cat.description,
    path: `/tools/${category}`,
    keywords: [`AI ${cat.name.toLowerCase()} tools`, `best ${cat.name.toLowerCase()} AI`, 'startup tools', 'founder tools', 'security validated'],
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const [data, stats] = await Promise.all([
    getAllTools({ category, page_size: 100 }),
    fetchDirectoryStats(),
  ]);
  const tools: Tool[] = Array.isArray(data) ? data : (data?.results || []);
  const cat = hubFromTools(category, tools);

  if (!cat) {
    return (
      <div className="min-h-screen bg-[var(--gray-black)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-[var(--gray-400)]">The category you&apos;re looking for doesn&apos;t exist.</p>
        </div>
        <Footer />
      </div>
    );
  }
  const indexedTools = tools.filter((tool) => tool.assessed === true || hasSubstantiveContent(tool));
  const categoryCount = getCategoryCount(stats, category, cat.name);

  const structuredData = generateStructuredData({
    '@type': 'CollectionPage',
    name: `Best AI ${cat.name} Tools for Startups`,
    description: cat.description,
    url: siteUrl(`/tools/${category}`),
    mainEntity: {
      '@type': 'ItemList',
      name: `AI ${cat.name} Tools`,
      numberOfItems: indexedTools.length,
      itemListElement: indexedTools.slice(0, 20).map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: tool.name,
          url: siteUrl(`/tool/${tool.slug}`),
          description: tool.short_description,
          applicationCategory: cat.name,
        },
      })),
    },
  });

  const breadcrumbSchema = generateStructuredData({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
      { '@type': 'ListItem', position: 2, name: `${cat.name} Tools`, item: siteUrl(`/tools/${category}`) },
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Best AI {cat.name} Tools for Startups
          </h1>
          <p className="text-lg text-[var(--gray-300)] max-w-3xl mx-auto">
            {cat.description}
          </p>
        </div>

        {/* Editorial Content */}
        <div className="bg-[var(--gray-900)] rounded-lg p-6 mb-10">
          <p className="text-[var(--gray-300)] leading-relaxed">{cat.editorial}</p>
        </div>

        {categoryCount != null && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-[var(--gray-400)] text-sm">
              {categoryCount.toLocaleString('en-US')} {cat.name.toLowerCase()} tool{categoryCount !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Tool Grid */}
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--gray-400)] text-lg">No tools found in this category yet.</p>
            <p className="text-[var(--gray-500)] mt-2">Check back soon as we&apos;re constantly adding new tools.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
