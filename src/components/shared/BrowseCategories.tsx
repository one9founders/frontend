'use client';

import { useRouter } from 'next/navigation';

const CATEGORIES = [
  {
    title: 'AI Tools',
    description: '27,000+ tools for every use case',
    emoji: '🛠️',
    active: true,
    href: '#tools-section',
  },
  {
    title: 'AI Agents',
    description: 'Autonomous AI that takes action',
    emoji: '🤖',
    active: true,
    href: '/agents',
  },
  {
    title: 'LLMs & Foundation Models',
    description: '170+ models compared with pricing & benchmarks',
    emoji: '🧠',
    active: true,
    href: '/llms',
  },
  {
    title: 'Open Source Models',
    description: '100+ open-weight models to self-host',
    emoji: '🔓',
    active: true,
    href: '/llms?type=open-weights',
  },
  {
    title: 'RAG & Vector DBs',
    description: 'Build smarter retrieval systems',
    emoji: '🗄️',
    active: true,
    href: '/rag-vector-dbs',
  },
  {
    title: 'AI Startups',
    description: 'Discover companies building with AI',
    emoji: '🚀',
    active: false,
    comingSoon: true,
  },
  {
    title: 'Research & Papers',
    description: 'Stay current with AI research',
    emoji: '📄',
    active: true,
    href: '/research',
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
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Browse the AI ecosystem</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.title}
              onClick={() => handleClick(cat)}
              className={`relative text-left p-4 rounded-xl border transition-colors cursor-pointer ${
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
              <p className="text-xs text-[var(--gray-400)]">{cat.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
