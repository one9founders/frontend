"use client";

import { useState } from "react";
import { HugeiconsIcon, Search01Icon } from "@/components/ui/icons";
import posthog from "posthog-js";

const CATEGORY_PILLS = [
  { label: "AI Tools", isActive: true },
  { label: "AI Agents", isActive: false },
  { label: "LLMs", isActive: false },
  { label: "Open Source", isActive: false },
  { label: "RAG / Vector DBs", isActive: false },
  { label: "Startups", isActive: false },
  { label: "Research", isActive: false },
];

export default function HeroSection() {
  const [activePill, setActivePill] = useState("AI Tools");

  const scrollToToolsAndSearch = (query?: string) => {
    const toolsSection = document.querySelector("#tools-section");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
    // Focus the search input after scrolling
    setTimeout(() => {
      const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
      if (searchInput) {
        searchInput.focus();
        if (query) {
          // Trigger a search by setting the value and dispatching input event
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(searchInput, query);
            searchInput.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }
      }
    }, 400);
  };

  const handlePillClick = (label: string) => {
    setActivePill(label);
    posthog.capture("category_pill_clicked", { category: label, source: "hero_section" });

    if (label === "AI Tools") {
      scrollToToolsAndSearch();
    } else {
      scrollToToolsAndSearch(label);
    }
  };

  const handleSearchBarClick = () => {
    posthog.capture("hero_search_clicked", { source: "hero_section" });
    scrollToToolsAndSearch();
  };

  return (
    <section className="text-white pt-12 pb-8 md:pt-16 md:pb-10 px-6 bg-[var(--gray-black)]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <p className="text-xs sm:text-sm uppercase tracking-widest text-purple-400 font-semibold mb-4">
          India&apos;s Largest AI Ecosystem Navigator
        </p>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          Discover AI tools, agents, models, and startups. All in one place.
        </h1>

        {/* Subheadline */}
        <p className="text-sm md:text-base text-[var(--gray-400)] max-w-xl mx-auto mb-8">
          27,000+ AI resources across tools, LLMs, agents, open source models,
          RAG frameworks, and more. Security-validated with zero affiliate bias.
        </p>

        {/* Search Bar (moved above the fold) */}
        <button
          onClick={handleSearchBarClick}
          className="w-full max-w-lg mx-auto flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[var(--gray-900)] border border-[var(--gray-700)] hover:border-[var(--gray-600)] transition-colors cursor-text mb-6"
        >
          <HugeiconsIcon icon={Search01Icon} size={20} aria-hidden="true" className="text-[var(--gray-500)] flex-shrink-0" />
          <span className="text-sm md:text-base text-[var(--gray-500)] text-left flex-1">
            Search AI tools, models, agents, startups...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs text-[var(--gray-500)] border border-[var(--gray-700)] rounded-md font-mono">
            &#8984;K
          </kbd>
        </button>

        {/* Category Pills */}
        <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 overflow-x-auto pb-2 md:pb-0 mb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {CATEGORY_PILLS.map((pill) => (
            <button
              key={pill.label}
              onClick={() => handlePillClick(pill.label)}
              className={`flex-shrink-0 px-4 py-1.5 text-xs sm:text-sm rounded-full border transition-colors cursor-pointer ${
                activePill === pill.label
                  ? "bg-purple-600/20 text-purple-300 border-purple-500/50 font-medium"
                  : "bg-transparent text-[var(--gray-400)] border-[var(--gray-700)] hover:border-[var(--gray-600)] hover:text-[var(--gray-300)]"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Compressed Stat Bar */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[var(--gray-500)] border-t border-[var(--gray-800)] pt-5">
          <span>27,000+ resources</span>
          <span className="text-[var(--gray-700)]">&middot;</span>
          <span>2,500+ security validated</span>
          <span className="text-[var(--gray-700)]">&middot;</span>
          <span>Zero affiliate bias</span>
          <span className="text-[var(--gray-700)]">&middot;</span>
          <span>Updated daily</span>
        </div>
      </div>
    </section>
  );
}
