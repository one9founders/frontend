'use client';

import { useRouter } from 'next/navigation';
import { STATS } from '@/lib/constants/stats';

const CATEGORIES = [
  {
    title: 'AI Tools',
    description: `${STATS.totalResources} tools for every use case. From writing and code to marketing and design. Every tool scored with our 10-point framework.`,
    emoji: '🛠️',
    active: true,
    href: '#tools-section',
    cta: 'Explore Tools',
  },
  {
    title: 'AI Agents',
    description: `${STATS.aiAgents} autonomous AI agents. Agents that go beyond chat. Browse tools that take action, run workflows, and integrate with your stack.`,
    emoji: '🤖',
    active: true,
    href: '/agents',
    cta: 'Browse Agents',
  },
  {
    title: 'LLMs & Foundation Models',
    description: '177 models compared with pricing & benchmarks. Arena rankings, input/output costs, context windows, and India-affordable tags.',
    emoji: '🧠',
    active: true,
    href: '/llms',
    cta: 'Open LLM Explorer',
  },
  {
    title: 'Open Source Models',
    description: '100+ open-weight models to self-host. Sorted by downloads, parameters, and provider. Full specs for every model.',
    emoji: '🔓',
    active: true,
    href: '/llms?type=open-weights',
    cta: 'View Open Source',
  },
  {
    title: 'RAG & Vector DBs',
    description: 'Build smarter retrieval systems. Compare vector databases and RAG frameworks for your AI stack.',
    emoji: '🗄️',
    active: true,
    href: '/rag-vector-dbs',
    cta: 'Explore RAG Tools',
  },
  {
    title: 'AI Startups',
    description: 'Discover companies building with AI. Indian and global AI startups, categorized by stage, sector, and funding.',
    emoji: '🚀',
    active: false,
    comingSoon: true,
    cta: 'Get Notified',
  },
  {
    title: 'Research & Papers',
    description: 'Stay current with AI research',
    emoji: '📄',
    active: true,
    href: '/research',
    cta: 'Browse Research',
  },
  {
    title: 'Fintech AI Stack',
    description: 'Special stacks for fintech startups. Compliance-rated AI tools evaluated against RBI, DPDP Act, and 30+ Indian regulatory checks.',
    emoji: '🏦',
    active: true,
    href: '/fintech',
    cta: 'Explore Fintech Stack',
  },
];

export default function BrowseCategories() {
  const router = useRouter();

  const handleClick = (category: (typeof CATEGORIES)[number]) => {
    if (category.href?.startsWith('/')) {
      router.push(category.href);
    } else if (category.href) {
      const el = document.querySelector(category.href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Explore the full AI ecosystem</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.title}
              onClick={() => handleClick(cat)}
              className={`group relative text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                cat.active
                  ? 'bg-[var(--gray-900)] border-purple-500/40 hover:border-purple-500/60'
                  : 'bg-[var(--gray-900)] border-[var(--gray-800)] hover:border-[var(--gray-700)] opacity-80'
              }`}
            >
              {cat.comingSoon && (
                <span className="absolute top-3 right-3 text-[10px] font-medium uppercase tracking-wider text-[var(--gray-500)] bg-[var(--gray-800)] px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              )}
              <span className="text-2xl mb-2 block">{cat.emoji}</span>
              <h3 className="text-sm font-semibold text-white mb-1">{cat.title}</h3>
              <p className="text-xs text-[var(--gray-400)] mb-2">{cat.description}</p>
              {cat.cta && (
                <span className="text-xs font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
                  {cat.cta} &rarr;
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
