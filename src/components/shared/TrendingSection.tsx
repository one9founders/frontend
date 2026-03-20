"use client";

import { Tool } from "@/types";
import ToolLogo from "@/components/shared/ToolLogo";
import Link from "next/link";
import { HugeiconsIcon, StarIcon } from "@/components/ui/icons";

interface TrendingSectionProps {
  tools: Tool[];
}

export default function TrendingSection({ tools }: TrendingSectionProps) {
  const trendingTools = tools.slice(0, 8);

  if (trendingTools.length === 0) return null;

  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Trending this week
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {trendingTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tool/${tool.slug}`}
              className="flex-shrink-0 w-56 md:w-64 snap-start rounded-xl bg-[var(--gray-900)] border border-[var(--gray-800)] p-4 hover:border-[var(--gray-700)] transition-colors group"
            >
              <div className="flex items-start gap-3 mb-3">
                <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                    {tool.name}
                  </h3>
                  {tool.categories?.[0] && (
                    <span className="text-xs text-[var(--gray-500)]">
                      {tool.categories[0].name}
                    </span>
                  )}
                </div>
              </div>
              {tool.rating > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <HugeiconsIcon
                        key={i}
                        icon={StarIcon}
                        size={14}
                        aria-hidden="true"
                        className={
                          i < Math.floor(Number(tool.rating))
                            ? "text-yellow-400"
                            : "text-[var(--gray-600)]"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[var(--gray-400)]">
                    {Number(tool.rating).toFixed(1)}
                  </span>
                </div>
              )}
              <p className="text-xs text-[var(--gray-400)] line-clamp-2 mt-2 leading-relaxed">
                {tool.short_description || tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
