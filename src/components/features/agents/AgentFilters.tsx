'use client';

import { AgentCategory } from '@/types/agent';

interface AgentFiltersProps {
  categories: AgentCategory[];
  selectedCategory: string;
  selectedPricing: string;
  selectedAccess: string;
  selectedSort: string;
  onCategoryChange: (value: string) => void;
  onPricingChange: (value: string) => void;
  onAccessChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function AgentFilters({
  categories,
  selectedCategory,
  selectedPricing,
  selectedAccess,
  selectedSort,
  onCategoryChange,
  onPricingChange,
  onAccessChange,
  onSortChange,
}: AgentFiltersProps) {
  return (
    <div className="sticky top-0 z-10 bg-[var(--gray-black)] py-3 border-b border-[var(--gray-800)]">
      <div className="flex flex-wrap gap-3">
        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--gray-800)] text-white border border-[var(--gray-700)] text-sm focus:outline-none focus:border-copper"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.agent_count != null ? `${cat.label} (${cat.agent_count})` : cat.label}
            </option>
          ))}
        </select>

        {/* Pricing Dropdown */}
        <select
          value={selectedPricing}
          onChange={(e) => onPricingChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--gray-800)] text-white border border-[var(--gray-700)] text-sm focus:outline-none focus:border-copper"
        >
          <option value="">All Pricing</option>
          <option value="free">Free</option>
          <option value="freemium">Freemium</option>
          <option value="paid">Paid</option>
        </select>

        {/* Access Dropdown */}
        <select
          value={selectedAccess}
          onChange={(e) => onAccessChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--gray-800)] text-white border border-[var(--gray-700)] text-sm focus:outline-none focus:border-copper"
        >
          <option value="">All Access</option>
          <option value="open-source">Open Source</option>
          <option value="closed-source">Closed Source</option>
          <option value="api">API</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--gray-800)] text-white border border-[var(--gray-700)] text-sm focus:outline-none focus:border-copper ml-auto"
        >
          <option value="popular">Popular</option>
          <option value="trending">Trending</option>
          <option value="newest">Newest</option>
          <option value="top-rated">Top Rated</option>
          <option value="most-upvoted">Most Upvoted</option>
        </select>
      </div>
    </div>
  );
}
