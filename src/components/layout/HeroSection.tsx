"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon, Search01Icon } from "@/components/ui/icons";
import posthog from "posthog-js";
import { STATS, withLiveCount } from "@/lib/constants/stats";
import EcosystemBoard from "@/components/layout/EcosystemBoard";

interface HeroSectionProps {
  toolCount?: number | null;
  agentCount?: number | null;
}

export default function HeroSection({ toolCount, agentCount }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    } else {
      document.querySelector("#tools-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openCatalog = () => {
    const toolsSection = document.querySelector("#tools-section");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="text-[var(--paper)] pt-10 pb-12 lg:pt-16 lg:pb-20 px-4 md:px-6 bg-[var(--ink)] lg:min-h-[calc(100svh-4.5rem)] lg:flex lg:items-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 lg:items-center">
        <div className="lg:col-span-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--copper)] mb-5">
            Supported by IIT Bombay
          </p>
          <h1 className="font-display text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tight mb-6">
            Pick AI like you run a company.
          </h1>
          <p className="text-sm md:text-base text-[var(--gray-400)] mb-8 max-w-md leading-relaxed">
            {withLiveCount(toolCount, 'tools')}, {withLiveCount(agentCount, 'agents')}, {STATS.llmsCompared} LLMs, {STATS.ragVectorDbs} retrieval systems, and {STATS.researchPapers} papers. Compared the same way. No affiliate cut.
          </p>

          <form onSubmit={handleHeroSearch} className="max-w-md mb-5">
            <label htmlFor="hero-search" className="sr-only">
              Search the catalog
            </label>
            <div className="relative flex items-center border border-[var(--line)] bg-[var(--ink-2)] px-3.5 py-3 focus-within:border-[var(--copper-dim)]">
              <HugeiconsIcon
                icon={Search01Icon}
                className="h-4 w-4 text-[var(--gray-500)] mr-3 flex-shrink-0"
              />
              <input
                id="hero-search"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, models, agents…"
                className="flex-1 bg-transparent text-[var(--paper)] text-sm placeholder:text-[var(--gray-500)] focus:outline-none"
              />
              <kbd className="hidden md:inline-flex items-center text-[10px] text-[var(--gray-500)] border border-[var(--line)] rounded px-1.5 py-0.5 font-mono ml-2">
                ⌘K
              </kbd>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openCatalog}
              className="px-4 py-2.5 text-sm font-medium bg-[var(--copper)] text-[var(--ink)] hover:bg-[var(--copper-bright)] cursor-pointer"
            >
              Open the catalog
            </button>
            <Link
              href="/stack"
              className="px-4 py-2.5 text-sm font-medium border border-[var(--line)] text-[var(--paper)] hover:border-[var(--copper-dim)] hover:text-[var(--copper)]"
            >
              Assemble a stack
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <EcosystemBoard toolCount={toolCount} agentCount={agentCount} />
        </div>
      </div>
    </section>
  );
}
