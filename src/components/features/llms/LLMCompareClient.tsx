'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LLMModel, LLMDataset, CurrencyMode } from '@/types/llm';
import {
  PROVIDER_COLORS,
  TIER_LABELS,
  CAPABILITY_LABELS,
  formatContext,
  formatPrice,
  formatDownloads,
} from '@/lib/llm-data';

interface LLMCompareClientProps {
  dataset: LLMDataset;
}

export default function LLMCompareClient({ dataset }: LLMCompareClientProps) {
  const searchParams = useSearchParams();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currency, setCurrency] = useState<CurrencyMode>('usd');
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  useEffect(() => {
    const modelsParam = searchParams.get('models');
    if (modelsParam) {
      const slugs = modelsParam.split(',').filter(Boolean).slice(0, 4);
      const validSlugs = slugs.filter((s) =>
        dataset.models.some((m) => m.slug === s)
      );
      setSelectedSlugs(validSlugs);
    }
  }, [searchParams, dataset.models]);

  const selectedModels = selectedSlugs
    .map((s) => dataset.models.find((m) => m.slug === s))
    .filter(Boolean) as LLMModel[];

  const searchResults = searchTerm
    ? dataset.models
        .filter(
          (m) =>
            !selectedSlugs.includes(m.slug) &&
            (m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              m.provider.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .slice(0, 8)
    : [];

  const addModel = (slug: string) => {
    if (selectedSlugs.length >= 4) return;
    setSelectedSlugs((prev) => [...prev, slug]);
    setSearchTerm('');
    setActiveSlot(null);
  };

  const removeModel = (slug: string) => {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const capKeys = [
    'function_calling',
    'structured_output',
    'vision',
    'web_search',
    'code_execution',
    'mcp',
    'audio_input',
    'reasoning',
    'streaming',
    'batch_api',
    'computer_use',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <Link
          href="/llms"
          className="text-[var(--gray-500)] hover:text-purple-400 text-sm mb-4 inline-block"
        >
          ← Back to LLM Explorer
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Compare LLMs
        </h1>
        <p className="text-[var(--gray-400)] text-sm">
          Select up to 4 models to compare side by side
        </p>
      </div>

      {/* Model Selector Slots */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[0, 1, 2, 3].map((idx) => {
          const model = selectedModels[idx];
          return (
            <div key={idx} className="relative">
              {model ? (
                <div className="bg-[var(--gray-900)] border border-purple-500/30 rounded-lg p-4">
                  <button
                    onClick={() => removeModel(model.slug)}
                    className="absolute top-2 right-2 text-[var(--gray-500)] hover:text-white text-sm cursor-pointer"
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          PROVIDER_COLORS[model.provider] || '#666',
                      }}
                    />
                    <span className="text-xs text-[var(--gray-400)]">
                      {model.provider}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white truncate">
                    {model.name}
                  </h3>
                </div>
              ) : (
                <button
                  onClick={() => setActiveSlot(idx)}
                  className="w-full bg-[var(--gray-900)] border border-dashed border-[var(--gray-700)] rounded-lg p-4 text-center hover:border-purple-500/40 transition-colors cursor-pointer"
                >
                  <span className="text-[var(--gray-500)] text-sm">
                    + Add Model
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Search dropdown */}
      {activeSlot !== null && selectedSlugs.length < 4 && (
        <div className="mb-8 relative max-w-md">
          <input
            type="text"
            placeholder="Search for a model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[var(--gray-500)] focus:outline-none focus:border-purple-500/60"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-lg overflow-hidden z-10 max-h-64 overflow-y-auto">
              {searchResults.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => addModel(m.slug)}
                  className="w-full text-left px-4 py-3 hover:bg-[var(--gray-800)] transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: PROVIDER_COLORS[m.provider] || '#666',
                    }}
                  />
                  <div>
                    <span className="text-sm text-white">{m.name}</span>
                    <span className="text-xs text-[var(--gray-500)] ml-2">
                      {m.provider}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              setActiveSlot(null);
              setSearchTerm('');
            }}
            className="absolute right-3 top-3 text-[var(--gray-500)] hover:text-white text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Currency Toggle */}
      {selectedModels.length >= 2 && (
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setCurrency((c) => (c === 'usd' ? 'inr' : 'usd'))}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
          >
            {currency === 'usd' ? '$ USD' : '₹ INR'}
          </button>
        </div>
      )}

      {/* Comparison Table */}
      {selectedModels.length >= 2 && (
        <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-xl overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--gray-700)] bg-[var(--gray-800)]/50">
                <th className="py-3 px-4 text-left text-[var(--gray-400)] text-xs font-medium w-40">
                  Feature
                </th>
                {selectedModels.map((m) => (
                  <th
                    key={m.slug}
                    className="py-3 px-4 text-left text-white text-sm font-semibold"
                  >
                    <Link
                      href={`/llms/${m.slug}`}
                      className="hover:text-purple-300"
                    >
                      {m.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="Provider"
                values={selectedModels.map((m) => m.provider)}
              />
              <CompareRow
                label="Type"
                values={selectedModels.map((m) =>
                  m.model_type === 'open-weights' ? 'Open Weights' : 'Proprietary'
                )}
              />
              <CompareRow
                label="Tier"
                values={selectedModels.map((m) => TIER_LABELS[m.tier] || m.tier)}
              />
              <CompareRow
                label="Input Price"
                values={selectedModels.map((m) =>
                  m.input_price_per_mtok !== null
                    ? `${formatPrice(m.input_price_per_mtok, currency)} /M`
                    : 'Free (self-host)'
                )}
                highlight="lowest-price"
                rawValues={selectedModels.map(
                  (m) => m.input_price_per_mtok ?? 0
                )}
              />
              <CompareRow
                label="Output Price"
                values={selectedModels.map((m) =>
                  m.output_price_per_mtok !== null
                    ? `${formatPrice(m.output_price_per_mtok, currency)} /M`
                    : '-'
                )}
              />
              <CompareRow
                label="Intelligence"
                values={selectedModels.map((m) =>
                  m.aa_intelligence_index
                    ? `${m.aa_intelligence_index}/100`
                    : '-'
                )}
                highlight="highest"
                rawValues={selectedModels.map(
                  (m) => m.aa_intelligence_index ?? 0
                )}
              />
              <CompareRow
                label="Arena Overall"
                values={selectedModels.map((m) =>
                  m.arena_elo_overall ? `#${m.arena_elo_overall}` : '-'
                )}
                highlight="lowest-rank"
                rawValues={selectedModels.map(
                  (m) => m.arena_elo_overall ?? 999
                )}
              />
              <CompareRow
                label="Arena Coding"
                values={selectedModels.map((m) =>
                  m.arena_elo_coding ? `#${m.arena_elo_coding}` : '-'
                )}
                highlight="lowest-rank"
                rawValues={selectedModels.map(
                  (m) => m.arena_elo_coding ?? 999
                )}
              />
              <CompareRow
                label="Context Window"
                values={selectedModels.map((m) =>
                  formatContext(m.context_window)
                )}
                highlight="highest"
                rawValues={selectedModels.map((m) => m.context_window ?? 0)}
              />
              <CompareRow
                label="Parameters"
                values={selectedModels.map(
                  (m) => m.parameter_display || '-'
                )}
              />
              <CompareRow
                label="Reasoning"
                values={selectedModels.map((m) =>
                  m.is_reasoning ? '✓ Yes' : '✗ No'
                )}
              />
              <CompareRow
                label="License"
                values={selectedModels.map((m) => m.license || '-')}
              />

              {/* Capabilities section header */}
              <tr>
                <td
                  colSpan={selectedModels.length + 1}
                  className="py-3 px-4 bg-[var(--gray-800)]/50 text-[var(--gray-400)] text-xs font-semibold uppercase tracking-wider"
                >
                  Capabilities
                </td>
              </tr>
              {capKeys.map((key) => (
                <CompareRow
                  key={key}
                  label={CAPABILITY_LABELS[key] || key}
                  values={selectedModels.map((m) => {
                    const val =
                      m.capabilities[key as keyof typeof m.capabilities];
                    return val === true
                      ? '✓'
                      : val === false
                        ? '✗'
                        : '-';
                  })}
                />
              ))}

              {/* Security section header */}
              <tr>
                <td
                  colSpan={selectedModels.length + 1}
                  className="py-3 px-4 bg-[var(--gray-800)]/50 text-[var(--gray-400)] text-xs font-semibold uppercase tracking-wider"
                >
                  Security &amp; Compliance
                </td>
              </tr>
              <CompareRow
                label="SOC 2 Type II"
                values={selectedModels.map((m) =>
                  m.security?.soc2_type2 ? '✓' : '✗'
                )}
              />
              <CompareRow
                label="GDPR"
                values={selectedModels.map((m) =>
                  m.security?.gdpr_compliant ? '✓' : '✗'
                )}
              />
              <CompareRow
                label="HIPAA"
                values={selectedModels.map((m) =>
                  m.security?.hipaa_eligible ? '✓' : '✗'
                )}
              />
              <CompareRow
                label="Enterprise SSO"
                values={selectedModels.map((m) =>
                  m.security?.enterprise_sso ? '✓' : '✗'
                )}
              />
            </tbody>
          </table>
        </div>
      )}

      {selectedModels.length < 2 && (
        <div className="text-center py-16">
          <p className="text-[var(--gray-400)] text-lg mb-2">
            Select at least 2 models to compare
          </p>
          <p className="text-[var(--gray-500)] text-sm">
            Click &ldquo;+ Add Model&rdquo; above, or{' '}
            <Link href="/llms" className="text-purple-400 hover:text-purple-300">
              browse the LLM Explorer
            </Link>{' '}
            and use the compare checkboxes
          </p>
        </div>
      )}
    </div>
  );
}

function CompareRow({
  label,
  values,
  highlight,
  rawValues,
}: {
  label: string;
  values: string[];
  highlight?: 'highest' | 'lowest-rank' | 'lowest-price';
  rawValues?: number[];
}) {
  let winnerIdx = -1;
  if (highlight && rawValues) {
    if (highlight === 'highest') {
      const max = Math.max(...rawValues);
      if (max > 0) winnerIdx = rawValues.indexOf(max);
    } else if (highlight === 'lowest-rank' || highlight === 'lowest-price') {
      const nonZero = rawValues.filter((v) => v > 0);
      if (nonZero.length > 0) {
        const min = Math.min(...nonZero);
        winnerIdx = rawValues.indexOf(min);
      }
    }
  }

  return (
    <tr className="border-b border-[var(--gray-800)]">
      <td className="py-2.5 px-4 text-[var(--gray-400)] text-xs font-medium">
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`py-2.5 px-4 text-sm ${
            i === winnerIdx
              ? 'text-emerald-400 font-semibold'
              : v === '✓'
                ? 'text-emerald-400'
                : v === '✗'
                  ? 'text-red-400/60'
                  : 'text-white'
          }`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
