'use client';

import Link from 'next/link';
import posthog from 'posthog-js';

interface Top20Tool {
  name: string;
  slug: string;
  description: string;
  website: string;
  screenshotUrl: string;
  logoUrl: string;
}

const TOP_20_TOOLS: Top20Tool[] = [
  {
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: 'Most recognized AI assistant, baseline for comparison',
    website: 'https://chat.openai.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  },
  {
    name: 'Claude',
    slug: 'claude',
    description: 'Strong AI alternative, growing fast with advanced reasoning',
    website: 'https://claude.ai',
    screenshotUrl: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&q=80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg',
  },
  {
    name: 'Midjourney',
    slug: 'midjourney',
    description: 'Visual content leader for AI-generated images',
    website: 'https://midjourney.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=800&q=80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
  },
  {
    name: 'Notion AI',
    slug: 'notion-ai',
    description: 'Productivity essential with AI-powered workspace',
    website: 'https://notion.so',
    screenshotUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
  },
  {
    name: 'Canva AI',
    slug: 'canva-ai',
    description: "Non-designers' best friend for visual content creation",
    website: 'https://canva.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
  },
  {
    name: 'Perplexity',
    slug: 'perplexity',
    description: 'AI-powered research and analysis assistant',
    website: 'https://perplexity.ai',
    screenshotUrl: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1754191037213052928/ViTsz26D_400x400.jpg',
  },
  {
    name: 'Jasper',
    slug: 'jasper',
    description: 'Marketing content at scale with AI assistance',
    website: 'https://jasper.ai',
    screenshotUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
  {
    name: 'HeyGen',
    slug: 'heygen',
    description: 'Video avatars - huge for founders and content creators',
    website: 'https://heygen.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
  {
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    description: 'Voice content creation with realistic AI voices',
    website: 'https://elevenlabs.io',
    screenshotUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
  {
    name: 'Grammarly',
    slug: 'grammarly',
    description: 'Professional communication with AI writing assistance',
    website: 'https://grammarly.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Grammarly_Logo.svg',
  },
  {
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'Dev productivity with AI pair programming',
    website: 'https://github.com/features/copilot',
    screenshotUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/GitHub_Copilot_logo.svg',
  },
  {
    name: 'Zapier AI',
    slug: 'zapier-ai',
    description: 'Workflow automation powered by AI',
    website: 'https://zapier.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg',
  },
  {
    name: 'Runway',
    slug: 'runway',
    description: 'Advanced video creation with AI tools',
    website: 'https://runwayml.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
  {
    name: 'Copy.ai',
    slug: 'copy-ai',
    description: 'Quick marketing copy generation',
    website: 'https://copy.ai',
    screenshotUrl: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
  {
    name: 'Otter.ai',
    slug: 'otter-ai',
    description: 'Meeting transcription and note-taking',
    website: 'https://otter.ai',
    screenshotUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
  {
    name: 'Descript',
    slug: 'descript',
    description: 'All-in-one video and audio editing',
    website: 'https://descript.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
  {
    name: 'Synthesia',
    slug: 'synthesia',
    description: 'AI video presentations with virtual avatars',
    website: 'https://synthesia.io',
    screenshotUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
  {
    name: 'Figma AI',
    slug: 'figma-ai',
    description: 'Design automation and AI-powered features',
    website: 'https://figma.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&q=80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
  },
  {
    name: 'Surfer SEO',
    slug: 'surfer-seo',
    description: 'SEO optimization with AI insights',
    website: 'https://surferseo.com',
    screenshotUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
  {
    name: 'Fireflies.ai',
    slug: 'fireflies-ai',
    description: 'Meeting intelligence and transcription',
    website: 'https://fireflies.ai',
    screenshotUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    logoUrl: 'https://pbs.twimg.com/profile_images/1590024058560167936/Iu9Xqzqf_400x400.jpg',
  },
];

export default function Top20Tools() {
  const handleToolClick = (tool: Top20Tool) => {
    posthog.capture('top20_tool_clicked', {
      tool_name: tool.name,
      tool_slug: tool.slug,
      tool_website: tool.website,
    });
  };

  const handleVisitTool = (tool: Top20Tool) => {
    posthog.capture('top20_tool_visited', {
      tool_name: tool.name,
      tool_slug: tool.slug,
      tool_website: tool.website,
    });
  };

  return (
    <section id="tools-section" className="py-12 md:py-20 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Top 20 AI Tools for Founders</h2>
          <p className="text-[var(--gray-400)] text-lg max-w-2xl mx-auto">
            Discover the most essential AI tools to supercharge your startup journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_20_TOOLS.map((tool, index) => (
            <div
              key={tool.slug}
              className="rounded-xl overflow-hidden bg-[var(--gray-900)] border border-[var(--gray-800)] hover:border-[var(--gray-700)] transition-all duration-300 group flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={tool.screenshotUrl}
                  alt={`${tool.name} landing page`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/800x450/1a1a2e/ffffff?text=' + encodeURIComponent(tool.name);
                  }}
                />
                <div className="absolute top-3 left-3 bg-[var(--gray-900)]/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
                  #{index + 1}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white p-1 flex-shrink-0">
                    <img
                      src={tool.logoUrl}
                      alt={`${tool.name} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/32x32/6366f1/ffffff?text=' + tool.name.charAt(0);
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white truncate">{tool.name}</h3>
                </div>
                
                <p className="text-sm text-[var(--gray-400)] line-clamp-2 mb-4 flex-1">
                  {tool.description}
                </p>
                
                <div className="flex gap-2">
                  <Link
                    href={`/tool/${tool.slug}`}
                    className="flex-1 text-center py-2 px-3 rounded-lg font-medium transition-colors bg-[var(--gray-700)] text-white hover:bg-[var(--gray-600)] text-sm"
                    onClick={() => handleToolClick(tool)}
                  >
                    Details
                  </Link>
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-3 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700 text-sm"
                    onClick={() => handleVisitTool(tool)}
                  >
                    Visit
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
