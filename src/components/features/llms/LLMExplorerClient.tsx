'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  LLMModel,
  LLMDataset,
  LLMSortOption,
  CurrencyMode,
} from '@/types/llm';
import {
  PROVIDER_COLORS,
  TIER_LABELS,
  TIER_COLORS,
  CAPABILITY_LABELS,
  formatContext,
  formatPrice,
  formatDownloads,
  QUICK_PICK_LABELS,
} from '@/lib/llm-data';

interface LLMExplorerClientProps {
  dataset: LLMDataset;
}

export default function LLMExplorerClient({ dataset }: LLMExplorerClientProps) {
  const [search, setSearch] = useState('');
  const [provFilter, setProvFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [capFilter, setCapFilter] = useState('all');
  const [sortBy, setSortBy] = useState<LLMSortOption>('arena');
  const [currency, setCurrency] = useState<CurrencyMode>('usd');
  const [showFilters, setShowFilters] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const models = dataset.models;

  const providers = useMemo(
    () => [...new Set(models.map((m) => m.provider))].sort(),
    [models]
  );

  const capabilityKeys = useMemo(() => {
    const caps = new Set<string>();
    models.forEach((m) => {
      Object.entries(m.capabilities).forEach(([k, v]) => {
        if (v === true) caps.add(k);
      });
    });
    return [...caps].sort();
  }, [models]);

  const filtered = useMemo(() => {
    let list = models.filter((m) => {
      if (
        search &&
        !m.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.provider.toLowerCase().includes(search.toLowerCase()) &&
        !m.slug.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (provFilter !== 'all' && m.provider !== provFilter) return false;
      if (tierFilter !== 'all' && m.tier !== tierFilter) return false;
      if (typeFilter !== 'all' && m.model_type !== typeFilter) return false;
      if (
        capFilter !== 'all' &&
        !m.capabilities[capFilter as keyof typeof m.capabilities]
      )
        return false;
      return true;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case 'arena':
          return (a.arena_elo_overall || 999) - (b.arena_elo_overall || 999);
        case 'intelligence':
          return (
            (b.aa_intelligence_index || 0) - (a.aa_intelligence_index || 0)
          );
        case 'coding':
          return (a.arena_elo_coding || 999) - (b.arena_elo_coding || 999);
        case 'price-low':
          return (
            (a.input_price_per_mtok ?? 999) - (b.input_price_per_mtok ?? 999)
          );
        case 'price-high':
          return (
            (b.input_price_per_mtok ?? 0) - (a.input_price_per_mtok ?? 0)
          );
        case 'name':
          return a.name.localeCompare(b.name);
        case 'downloads':
          return (b.hf_downloads || 0) - (a.hf_downloads || 0);
        case 'newest':
          return (b.release_date || '').localeCompare(a.release_date || '');
        default:
          return 0;
      }
    });
    return list;
  }, [search, provFilter, tierFilter, typeFilter, capFilter, sortBy, models]);

  const toggleCompare = useCallback((slug: string) => {
    setCompareList((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 4) return prev;
      return [...prev, slug];
    });
  }, []);

  const quickPicks = dataset.quick_picks;

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          <span className="text-purple-400">One9</span>Founders LLM Explorer
        </h1>
        <p className="text-[var(--gray-400)] text-sm sm:text-base">
          {dataset.metadata.total_models} models compared - Pricing, benchmarks
          &amp; Arena rankings - Updated {dataset.metadata.last_updated}
        </p>
      </div>

      {/* Quick Picks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <h2 className="text-sm font-semibold text-[var(--gray-400)] uppercase tracking-wider mb-3">
          Quick Picks
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(quickPicks).map(([key, pick]) => {
            const label = QUICK_PICK_LABELS[key];
            if (!label || !pick) return null;
            return (
              <Link
                key={key}
                href={`/llms/${pick.slug}`}
                className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg p-3 hover:border-purple-500/40 transition-colors group"
              >
                <span className="text-lg block mb-1">{label.emoji}</span>
                <p className="text-xs font-semibold text-[var(--gray-400)] group-hover:text-white transition-colors">
                  {label.title}
                </p>
                <p className="text-sm font-medium text-white truncate">
                  {pick.name}
                </p>
                <p className="text-[10px] text-[var(--gray-500)] truncate">
                  {pick.reason}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
          <input
            type="text"
            placeholder="Search models or providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[var(--gray-500)] focus:outline-none focus:border-purple-500/60 sm:min-w-[240px] flex-1 sm:flex-none"
          />

          {/* Mobile filter toggle */}
          <button
            className="sm:hidden bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-2.5 text-[var(--gray-400)] text-sm font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'} ({filtered.length})
          </button>

          {/* Desktop filters (always visible) + Mobile filters (toggleable) */}
          <div
            className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap`}
          >
            <select
              value={provFilter}
              onChange={(e) => setProvFilter(e.target.value)}
              className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60"
            >
              <option value="all">All Providers</option>
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60"
            >
              <option value="all">All Tiers</option>
              {Object.entries(TIER_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60"
            >
              <option value="all">All Types</option>
              <option value="proprietary">Proprietary</option>
              <option value="open-weights">Open Weights</option>
            </select>

            <select
              value={capFilter}
              onChange={(e) => setCapFilter(e.target.value)}
              className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60"
            >
              <option value="all">All Capabilities</option>
              {capabilityKeys.map((c) => (
                <option key={c} value={c}>
                  {CAPABILITY_LABELS[c] || c}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as LLMSortOption)}
              className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60"
            >
              <option value="arena">Arena Rank</option>
              <option value="intelligence">Intelligence</option>
              <option value="coding">Coding Rank</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="downloads">Downloads</option>
              <option value="newest">Newest First</option>
              <option value="name">Name A→Z</option>
            </select>

            <button
              onClick={() =>
                setCurrency((c) => (c === 'usd' ? 'inr' : 'usd'))
              }
              className="bg-purple-600 hover:bg-purple-700 text-white border-none rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
            >
              {currency === 'usd' ? '$ USD' : '₹ INR'}
            </button>
          </div>
        </div>

        <p className="text-[var(--gray-500)] text-xs mt-3">
          Showing {filtered.length} of {models.length} models
        </p>
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--gray-900)] border-t border-purple-500/40 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-[var(--gray-400)]">
                Compare ({compareList.length}/4):
              </span>
              {compareList.map((slug) => {
                const m = models.find((mod) => mod.slug === slug);
                return (
                  <span
                    key={slug}
                    className="inline-flex items-center gap-1 bg-[var(--gray-800)] rounded-full px-3 py-1 text-xs text-white"
                  >
                    {m?.name || slug}
                    <button
                      onClick={() => toggleCompare(slug)}
                      className="text-[var(--gray-500)] hover:text-white ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCompareList([])}
                className="text-xs text-[var(--gray-500)] hover:text-white cursor-pointer"
              >
                Clear
              </button>
              <Link
                href={`/llms/compare?models=${compareList.join(',')}`}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
              >
                Compare →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Model Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m) => (
            <ModelCard
              key={m.slug}
              model={m}
              currency={currency}
              isComparing={compareList.includes(m.slug)}
              onToggleCompare={() => toggleCompare(m.slug)}
              compareDisabled={
                compareList.length >= 4 && !compareList.includes(m.slug)
              }
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--gray-400)] text-lg">
              No models match your filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setProvFilter('all');
                setTierFilter('all');
                setTypeFilter('all');
                setCapFilter('all');
              }}
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ModelCard({
  model: m,
  currency,
  isComparing,
  onToggleCompare,
  compareDisabled,
}: {
  model: LLMModel;
  currency: CurrencyMode;
  isComparing: boolean;
  onToggleCompare: () => void;
  compareDisabled: boolean;
}) {
  return (
    <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-xl p-4 hover:border-purple-500/40 transition-all group relative">
      {/* Compare checkbox */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleCompare();
        }}
        disabled={compareDisabled && !isComparing}
        className={`absolute top-3 right-3 w-5 h-5 rounded border text-xs flex items-center justify-center transition-colors cursor-pointer ${
          isComparing
            ? 'bg-purple-600 border-purple-600 text-white'
            : 'border-[var(--gray-700)] text-transparent hover:border-[var(--gray-500)]'
        } ${compareDisabled && !isComparing ? 'opacity-30 cursor-not-allowed' : ''}`}
        title={isComparing ? 'Remove from compare' : 'Add to compare'}
      >
        ✓
      </button>

      <Link href={`/llms/${m.slug}`} className="block">
        {/* Header */}
        <div className="flex justify-between items-start mb-2 pr-6">
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
              {m.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: PROVIDER_COLORS[m.provider] || '#666',
                }}
              />
              <span className="text-xs text-[var(--gray-400)]">
                {m.provider}
              </span>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                  m.model_type === 'open-weights'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-[var(--gray-800)] text-[var(--gray-400)]'
                }`}
              >
                {m.model_type === 'open-weights' ? 'Open' : 'Proprietary'}
              </span>
              {m.is_reasoning && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400">
                  Reasoning
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            {m.arena_elo_overall && (
              <>
                <div
                  className="text-lg font-bold font-mono"
                  style={{
                    color:
                      m.arena_elo_overall <= 10
                        ? '#F59E0B'
                        : m.arena_elo_overall <= 30
                          ? '#3B82F6'
                          : '#E2E8F0',
                  }}
                >
                  #{m.arena_elo_overall}
                </div>
                <div className="text-[10px] text-[var(--gray-500)]">Arena</div>
              </>
            )}
            {!m.arena_elo_overall && m.hf_downloads && (
              <>
                <div className="text-sm font-bold font-mono text-[var(--gray-300)]">
                  {formatDownloads(m.hf_downloads)}
                </div>
                <div className="text-[10px] text-[var(--gray-500)]">
                  Downloads
                </div>
              </>
            )}
          </div>
        </div>

        {/* Price + Intelligence row */}
        <div className="flex gap-3 mb-2">
          <div className="flex-1">
            <div className="text-[10px] text-[var(--gray-500)] uppercase tracking-wider">
              Input / Output
            </div>
            <div className="text-sm font-mono font-medium text-white">
              {m.input_price_per_mtok !== null ? (
                <>
                  {formatPrice(m.input_price_per_mtok, currency)} /{' '}
                  {formatPrice(m.output_price_per_mtok, currency)}
                  <span className="text-[10px] text-[var(--gray-500)]">
                    {' '}
                    /M
                  </span>
                </>
              ) : (
                <span className="text-emerald-400">Self-host</span>
              )}
            </div>
          </div>
          {m.aa_intelligence_index && (
            <div>
              <div className="text-[10px] text-[var(--gray-500)] uppercase tracking-wider">
                Intelligence
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-14 h-1.5 rounded-full bg-[var(--gray-800)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${m.aa_intelligence_index}%`,
                      backgroundColor:
                        m.aa_intelligence_index >= 65
                          ? '#10B981'
                          : m.aa_intelligence_index >= 50
                            ? '#3B82F6'
                            : '#F59E0B',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold font-mono text-white">
                  {m.aa_intelligence_index}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex gap-3 mb-2 text-xs">
          {m.context_window && (
            <span className="text-[var(--gray-500)]">
              Ctx:{' '}
              <strong className="text-[var(--gray-300)]">
                {formatContext(m.context_window)}
              </strong>
            </span>
          )}
          {m.arena_elo_coding && (
            <span className="text-[var(--gray-500)]">
              Code:{' '}
              <strong
                className={
                  m.arena_elo_coding <= 20
                    ? 'text-amber-400'
                    : 'text-[var(--gray-300)]'
                }
              >
                #{m.arena_elo_coding}
              </strong>
            </span>
          )}
          {m.parameter_display && m.parameter_display !== 'Unknown' && (
            <span className="text-[var(--gray-500)]">
              Params:{' '}
              <strong className="text-[var(--gray-300)]">
                {m.parameter_display}
              </strong>
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {(m.tags || []).slice(0, 5).map((t) => (
            <span
              key={t}
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                t.includes('budget') || t.includes('india')
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : t.includes('top')
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-[var(--gray-800)] text-[var(--gray-500)]'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}
