"use client";

const CATEGORIES = [
  {
    title: "AI Tools",
    description: "27,000+ tools for every use case",
    icon: "🛠️",
    active: true,
    href: "#tools-section",
  },
  {
    title: "AI Agents",
    description: "Autonomous AI that takes action",
    icon: "🤖",
    active: false,
    href: null,
  },
  {
    title: "LLMs & Foundation Models",
    description: "GPT, Claude, Gemini, Llama and more",
    icon: "🧠",
    active: false,
    href: null,
  },
  {
    title: "Open Source Models",
    description: "Self-host, fine-tune, own your AI",
    icon: "📦",
    active: false,
    href: null,
  },
  {
    title: "RAG & Vector DBs",
    description: "Build smarter retrieval systems",
    icon: "🔍",
    active: false,
    href: null,
  },
  {
    title: "AI Startups",
    description: "Discover companies building with AI",
    icon: "🚀",
    active: false,
    href: null,
  },
  {
    title: "Research & Papers",
    description: "Stay current with AI research",
    icon: "📄",
    active: false,
    href: null,
  },
];

export default function BrowseCategorySection() {
  const handleCategoryClick = (category: typeof CATEGORIES[number]) => {
    if (category.href) {
      const el = document.querySelector(category.href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Browse the AI ecosystem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.title}
              onClick={() => handleCategoryClick(cat)}
              disabled={!cat.active}
              className={`relative text-left p-5 rounded-xl border transition-colors ${
                cat.active
                  ? "bg-[var(--gray-900)] border-purple-500/40 hover:border-purple-500/70 cursor-pointer"
                  : "bg-[var(--gray-900)]/60 border-[var(--gray-800)] cursor-default opacity-70"
              }`}
            >
              {!cat.active && (
                <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--gray-500)] bg-[var(--gray-800)] px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              )}
              <span className="text-2xl mb-3 block">{cat.icon}</span>
              <h3 className="text-sm font-semibold text-white mb-1">
                {cat.title}
              </h3>
              <p className="text-xs text-[var(--gray-400)] leading-relaxed">
                {cat.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
