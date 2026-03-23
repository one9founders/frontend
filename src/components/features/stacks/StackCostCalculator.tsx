'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { StackCategory, StackTool } from './FounderStackTemplate';
import { useCurrency } from '@/lib/currency';

const GST_RATE = 0.18;
const EXCHANGE_RATE = 83.5;

interface StackCostCalculatorProps {
  stackSlug: string;
  categories: StackCategory[];
}

export default function StackCostCalculator({ stackSlug, categories }: StackCostCalculatorProps) {
  const { currency } = useCurrency();
  const isInitialized = useRef(false);
  const storageKey = `one9founders_stack_selections_${stackSlug}`;

  // Initialize selected tools: one per category (the isPick tool by default)
  const [selectedTools, setSelectedTools] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    categories.forEach((cat) => {
      const pick = cat.tools.find(t => t.isPick);
      if (pick) initial[cat.name] = pick.slug;
    });
    return initial;
  });

  // Load persisted selections from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          setSelectedTools(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [storageKey]);

  // Persist selections to localStorage (skip first render to avoid overwriting saved data)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(selectedTools));
  }, [selectedTools, storageKey]);

  const handleToolSelect = useCallback((categoryName: string, toolSlug: string) => {
    setSelectedTools(prev => {
      if (prev[categoryName] === toolSlug) {
        // Deselect: remove category from selections
        const next = { ...prev };
        delete next[categoryName];
        return next;
      }
      return { ...prev, [categoryName]: toolSlug };
    });
  }, []);

  // Calculate totals from selected tools
  const getSelectedTool = (cat: StackCategory): StackTool | undefined => {
    const slug = selectedTools[cat.name];
    if (!slug) return undefined;
    return cat.tools.find(t => t.slug === slug);
  };

  const totalINR = categories.reduce((sum, cat) => {
    const tool = getSelectedTool(cat);
    return sum + (tool?.priceINR || 0);
  }, 0);

  const totalUSD = categories.reduce((sum, cat) => {
    const tool = getSelectedTool(cat);
    return sum + (tool?.priceUSD || 0);
  }, 0);

  const totalWithGST = Math.round(totalINR * (1 + GST_RATE));
  const categoryNames = new Set(categories.map(c => c.name));
  const selectedCount = Object.keys(selectedTools).filter(k => categoryNames.has(k)).length;

  const formatPrice = (inr: number, usd: number) => {
    if (currency === 'INR') {
      return `₹${inr.toLocaleString('en-IN')}`;
    }
    return `$${usd}`;
  };

  const formatPriceCell = (tool: StackTool) => {
    if (tool.priceINR === 0 && tool.priceUSD === 0) return 'Free';
    if (currency === 'INR') {
      return `₹${tool.priceINR.toLocaleString('en-IN')}/mo`;
    }
    return `$${tool.priceUSD}/mo`;
  };

  return (
    <>
      {/* Sticky Cost Summary */}
      <div className="sticky top-16 z-10 bg-[var(--gray-black)]/95 backdrop-blur-sm border border-[var(--gray-700)] rounded-lg px-5 py-4 mb-8 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="text-[var(--gray-500)] text-xs mb-0.5">Your Stack Cost</div>
          <div className="text-2xl font-bold text-white">
            {formatPrice(totalINR, totalUSD)}
            <span className="text-sm text-[var(--gray-400)] font-normal">/mo</span>
          </div>
          {currency === 'INR' && totalINR > 0 && (
            <div className="text-[var(--gray-500)] text-xs">
              ₹{totalWithGST.toLocaleString('en-IN')} incl. GST
            </div>
          )}
        </div>
        <div className="text-center px-4">
          <div className="text-[var(--gray-500)] text-xs">Selected</div>
          <div className="text-lg font-bold text-white">{selectedCount}/{categories.length}</div>
        </div>
        <div className="text-center px-4">
          <div className="text-[var(--gray-500)] text-xs">Categories</div>
          <div className="text-lg font-bold text-white">{categories.length}</div>
        </div>
        <button
          onClick={() => {
            const defaults: Record<string, string> = {};
            categories.forEach(cat => {
              const pick = cat.tools.find(t => t.isPick);
              if (pick) defaults[cat.name] = pick.slug;
            });
            setSelectedTools(defaults);
          }}
          className="px-3 py-1.5 text-xs rounded-lg bg-[var(--gray-800)] text-[var(--gray-400)] border border-[var(--gray-700)] hover:text-white hover:border-[var(--gray-500)] transition-colors cursor-pointer"
        >
          Reset to Top Picks
        </button>
      </div>

      {/* Tool Categories with Selection */}
      {categories.map((category, catIdx) => (
        <div key={catIdx} className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">{category.name}</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--gray-700)]">
                  <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium w-10"></th>
                  <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Tool</th>
                  <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Free Tier</th>
                  <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Key Feature</th>
                  <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Score</th>
                  <th className="text-left py-3 px-4 text-[var(--gray-400)] font-medium">Security</th>
                </tr>
              </thead>
              <tbody>
                {category.tools.map((tool, toolIdx) => {
                  const isSelected = selectedTools[category.name] === tool.slug;
                  return (
                    <tr
                      key={toolIdx}
                      onClick={() => handleToolSelect(category.name, tool.slug)}
                      className={`border-b border-[var(--gray-800)] cursor-pointer transition-colors ${
                        isSelected ? 'bg-purple-600/15' : 'hover:bg-[var(--gray-800)]/50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-[var(--gray-600)]'
                        }`}>
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`/tool/${tool.slug}`}
                          className="text-white hover:text-purple-400 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tool.name}
                        </a>
                        {tool.isPick && (
                          <span className="ml-2 bg-purple-600 text-white px-1.5 py-0.5 rounded text-xs">
                            Top Pick
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-white">{formatPriceCell(tool)}</td>
                      <td className="py-3 px-4">
                        {tool.freeTier ? (
                          <span className="text-green-400">Yes</span>
                        ) : (
                          <span className="text-[var(--gray-500)]">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[var(--gray-300)]">{tool.keyFeature}</td>
                      <td className="py-3 px-4 text-white">{tool.score}/10</td>
                      <td className="py-3 px-4 text-white">{tool.securityRating}/100</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}
