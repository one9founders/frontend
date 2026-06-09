import { Metadata } from 'next';
import { getAllTools } from '@/lib/actions/tools';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolCard from '@/components/features/tools/ToolCard';
import { Tool } from '@/types';

export const metadata: Metadata = {
  title: 'New AI Tools This Week | One9Founders',
  description: 'Discover the newest AI tools, agents, and LLMs added to One9Founders this week. Stay ahead with daily updated AI tools.',
  alternates: {
    canonical: 'https://one9founders.com/new',
  },
};

export default async function NewToolsPage() {
  let tools: Tool[] = [];
  let isFallback = false;

  try {
    // Fetch the 100 newest tools
    const res = await getAllTools({ page_size: 100, ordering: '-created_at' });
    const allTools = res?.results || res || [];

    // Filter tools added in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    tools = allTools.filter((tool: Tool) => {
      if (!tool.created_at) return false;
      const createdAt = new Date(tool.created_at);
      return createdAt >= sevenDaysAgo;
    });

    // Fallback: If no tools were added in the last 7 days (or created_at is undefined/null in production API)
    // we show the 20 newest tools so the page is never blank!
    if (tools.length === 0) {
      tools = allTools.slice(0, 20);
      isFallback = true;
    }
  } catch (error) {
    console.error('Error fetching new tools:', error);
  }

  return (
    <div className="min-h-screen bg-[var(--gray-black)] text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 font-bricolage">
            New AI Tools This Week
          </h1>
          <p className="text-sm md:text-base text-[var(--gray-400)]">
            {isFallback 
              ? 'Stay ahead of the curve. Here are the recently added AI tools, agents, and platforms curated and security-reviewed by our team.'
              : 'Stay ahead of the curve. Here are the latest AI tools, agents, and platforms curated and security-reviewed by our team in the last 7 days.'
            }
          </p>
        </div>

        {tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--gray-900)] rounded-2xl border border-[var(--gray-800)]">
            <p className="text-[var(--gray-400)]">No new tools found this week.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
