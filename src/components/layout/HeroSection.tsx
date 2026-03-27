"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon, Search01Icon } from "@/components/ui/icons";
import posthog from "posthog-js";
import { STATS } from "@/lib/constants/stats";

interface CategoryPill {
  label: string;
  active: boolean;
  href?: string;
}

const CATEGORY_PILLS: CategoryPill[] = [
  { label: "AI Tools", active: true },
  { label: "AI Agents", active: false, href: "/agents" },
  { label: "LLMs", active: false, href: "/llms" },
  { label: "Open Source", active: false },
  { label: "RAG / Vector DBs", active: false, href: "/rag-vector-dbs" },
  { label: "Startups", active: false },
  { label: "Research", active: false, href: "/research" },
];

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigateToSearch = (query: string) => {
    router.push("/?q=" + encodeURIComponent(query) + "#tools-section");
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      posthog.capture("hero_search_performed", {
        search_query: searchQuery,
        source: "hero_section",
      });
      navigateToSearch(searchQuery);
    }
  };

  const handlePillClick = (pill: (typeof CATEGORY_PILLS)[number]) => {
    posthog.capture("category_pill_clicked", {
      category: pill.label,
      source: "hero_section",
    });

    if (pill.href) {
      router.push(pill.href);
    } else if (pill.label === "AI Tools") {
      const toolsSection = document.querySelector("#tools-section");
      if (toolsSection) {
        toolsSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigateToSearch(pill.label);
    }
  };

  return (
    <section className="text-white pt-12 pb-8 md:pt-20 md:pb-12 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <p className="text-xs md:text-sm uppercase tracking-widest text-purple-400 font-semibold mb-4">
          India&apos;s #1 AI Ecosystem Navigator &middot; Supported by IIT Bombay
        </p>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Discover AI tools, agents, models, and startups. All in one place.
        </h1>

        {/* Subheadline */}
        <p className="text-sm md:text-base text-[var(--gray-400)] mb-8 max-w-xl mx-auto">
          {STATS.totalResources} AI tools, {STATS.llmsCompared} LLMs, {STATS.aiAgents} agents, {STATS.ragVectorDbs} RAG & vector databases, and the latest AI research papers. Supported by IIT Bombay.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleHeroSearch} className="max-w-lg mx-auto mb-6">
          <div className="relative flex items-center bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl px-4 py-3 focus-within:border-purple-500 transition-colors">
            <HugeiconsIcon
              icon={Search01Icon}
              className="h-5 w-5 text-[var(--gray-500)] mr-3 flex-shrink-0"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI tools, models, agents, startups..."
              className="flex-1 bg-transparent text-white text-sm md:text-base placeholder:text-[var(--gray-500)] focus:outline-none"
            />
            <kbd className="hidden md:inline-flex items-center text-xs text-[var(--gray-500)] border border-[var(--gray-700)] rounded px-1.5 py-0.5 font-mono ml-2">
              ⌘K
            </kbd>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 overflow-x-auto md:overflow-visible px-2">
          {CATEGORY_PILLS.map((pill) => (
            <button
              key={pill.label}
              onClick={() => handlePillClick(pill)}
              className={`whitespace-nowrap px-3 py-1.5 text-xs md:text-sm rounded-full border transition-colors cursor-pointer ${
                pill.active
                  ? "bg-purple-600/20 text-purple-300 border-purple-500/40 font-medium"
                  : "bg-transparent text-[var(--gray-400)] border-[var(--gray-700)] hover:border-[var(--gray-500)] hover:text-[var(--gray-300)]"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Social Proof Line */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs md:text-sm text-[var(--gray-500)] border-t border-[var(--gray-800)] pt-4">
          <span>Trusted by 5,000+ founders</span>
          <span className="text-[var(--gray-700)]">&middot;</span>
          <span>Zero affiliate bias</span>
          <span className="text-[var(--gray-700)]">&middot;</span>
          <span>Updated daily</span>
        </div>
      </div>
    </section>
  );
}
