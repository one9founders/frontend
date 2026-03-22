'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LLMModel, CurrencyMode } from '@/types/llm';
import {
  PROVIDER_COLORS,
  TIER_LABELS,
  TIER_COLORS,
  CAPABILITY_LABELS,
  formatContext,
  formatPrice,
  formatDownloads,
  INR_RATE,
} from '@/lib/llm-data';

interface LLMDetailClientProps {
  model: LLMModel;
  similarModels: LLMModel[];
}

export default function LLMDetailClient({
  model,
  similarModels,
}: LLMDetailClientProps) {
  const [currency, setCurrency] = useState<CurrencyMode>('usd');
  const m = model;

  const tryItLink =
    m.links.try_it || m.links.playground || m.links.provider || null;
  const apiDocsLink = m.links.api_docs || null;
  const hfLink = m.links.huggingface || null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/llms" className="text-[var(--gray-500)] hover:text-purple-400">
          ← Back to LLM Explorer
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: PROVIDER_COLORS[m.provider] || '#666' }}
            />
            <span className="text-[var(--gray-400)] text-sm">{m.provider}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {m.name}
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${TIER_COLORS[m.tier] || '#4B5563'}20`,
                color: TIER_COLORS[m.tier] || '#9CA3AF',
              }}
            >
              {TIER_LABELS[m.tier] || 'Unranked'}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                m.model_type === 'open-weights'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-[var(--gray-800)] text-[var(--gray-400)]'
              }`}
            >
              {m.model_type === 'open-weights' ? 'Open Weights' : 'Proprietary'}
            </span>
            {m.is_reasoning && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400">
                Reasoning
              </span>
            )}
            {m.license && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--gray-800)] text-[var(--gray-400)]">
                {m.license}
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            {m.model_type === 'open-weights' && hfLink ? (
              <a
                href={hfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Download Model →
              </a>
            ) : tryItLink ? (
              <a
                href={tryItLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Try in Playground →
              </a>
            ) : null}
            {apiDocsLink && (
              <a
                href={apiDocsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--gray-800)] hover:bg-[var(--gray-700)] text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors border border-[var(--gray-700)]"
              >
                API Docs →
              </a>
            )}
            {hfLink && m.model_type !== 'open-weights' && (
              <a
                href={hfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--gray-400)] hover:text-white text-sm transition-colors"
              >
                View on HuggingFace
              </a>
            )}
            <button
              onClick={() => setCurrency((c) => (c === 'usd' ? 'inr' : 'usd'))}
              className="inline-flex items-center gap-1 bg-[var(--gray-800)] hover:bg-[var(--gray-700)] text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors border border-[var(--gray-700)] cursor-pointer"
            >
              {currency === 'usd' ? '$ USD' : '₹ INR'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:w-80">
          {m.input_price_per_mtok !== null && (
            <StatCard
              label="Input Price"
              value={formatPrice(m.input_price_per_mtok, currency)}
              sub="/M tokens"
            />
          )}
          {m.output_price_per_mtok !== null && (
            <StatCard
              label="Output Price"
              value={formatPrice(m.output_price_per_mtok, currency)}
              sub="/M tokens"
            />
          )}
          {m.input_price_per_mtok === null && (
            <StatCard label="Price" value="Free" sub="Self-host" highlight />
          )}
          {m.aa_intelligence_index && (
            <StatCard
              label="Intelligence"
              value={`${m.aa_intelligence_index}`}
              sub="/100"
            />
          )}
          {m.arena_elo_overall && (
            <StatCard
              label="Arena Rank"
              value={`#${m.arena_elo_overall}`}
              sub="Overall"
            />
          )}
          {m.arena_elo_coding && (
            <StatCard
              label="Coding Rank"
              value={`#${m.arena_elo_coding}`}
              sub="Arena"
            />
          )}
          {m.context_window && (
            <StatCard
              label="Context"
              value={formatContext(m.context_window)}
              sub="tokens"
            />
          )}
          {m.hf_downloads && (
            <StatCard
              label="Downloads"
              value={formatDownloads(m.hf_downloads)}
              sub="HuggingFace"
            />
          )}
          {m.parameter_display && m.parameter_display !== 'Unknown' && (
            <StatCard label="Parameters" value={m.parameter_display} sub="" />
          )}
        </div>
      </div>

      {/* One9Founders Verdict */}
      {m.one9_summary && (
        <div className="bg-gradient-to-br from-purple-900/20 to-[var(--gray-900)] border border-purple-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-purple-400">One9</span>Founders Verdict
            {m.one9_value_rating && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 ml-2">
                {m.one9_value_rating}
              </span>
            )}
          </h2>
          <p className="text-[var(--gray-300)] leading-relaxed mb-4">
            {m.one9_summary}
          </p>

          {m.one9_verdict && (
            <p className="text-white font-semibold text-sm mb-4 italic">
              &ldquo;{m.one9_verdict}&rdquo;
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {m.one9_best_for.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-emerald-400 mb-2">
                  Best For
                </h3>
                <ul className="space-y-1">
                  {m.one9_best_for.map((item, i) => (
                    <li key={i} className="text-sm text-[var(--gray-300)] flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {m.one9_not_great_for.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-2">
                  Not Great For
                </h3>
                <ul className="space-y-1">
                  {m.one9_not_great_for.map((item, i) => (
                    <li key={i} className="text-sm text-[var(--gray-300)] flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {m.startup_recommendation && (
            <div className="mt-4 pt-4 border-t border-purple-500/10">
              <h3 className="text-sm font-semibold text-purple-300 mb-1">
                Startup Recommendation
              </h3>
              <p className="text-sm text-[var(--gray-300)]">
                {m.startup_recommendation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pricing Details */}
      {m.input_price_per_mtok !== null && (
        <Section title="Pricing Details" className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <PriceRow
              label="Input"
              value={m.input_price_per_mtok}
              currency={currency}
            />
            <PriceRow
              label="Output"
              value={m.output_price_per_mtok}
              currency={currency}
            />
            {m.cached_input_price && (
              <PriceRow
                label="Cached Input"
                value={m.cached_input_price}
                currency={currency}
              />
            )}
            {m.batch_input_price && (
              <PriceRow
                label="Batch Input"
                value={m.batch_input_price}
                currency={currency}
              />
            )}
          </div>
          {m.has_free_tier && (
            <p className="text-emerald-400 text-sm mt-3">
              Free tier available
            </p>
          )}
        </Section>
      )}

      {/* Capabilities */}
      <Section title="Capabilities" className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.entries(m.capabilities).map(([key, value]) => (
            <div
              key={key}
              className={`flex items-center gap-2 p-2.5 rounded-lg ${
                value === true
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : value === false
                    ? 'bg-red-500/5 border border-red-500/10'
                    : 'bg-[var(--gray-800)]/50 border border-[var(--gray-800)]'
              }`}
            >
              <span
                className={`text-sm ${
                  value === true
                    ? 'text-emerald-400'
                    : value === false
                      ? 'text-red-400'
                      : 'text-[var(--gray-600)]'
                }`}
              >
                {value === true ? '✓' : value === false ? '✗' : '—'}
              </span>
              <span
                className={`text-xs font-medium ${
                  value === true
                    ? 'text-emerald-300'
                    : value === false
                      ? 'text-red-300/60'
                      : 'text-[var(--gray-500)]'
                }`}
              >
                {CAPABILITY_LABELS[key] || key}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Arena Rankings */}
      {(m.arena_elo_overall || m.arena_elo_coding || m.arena_elo_math || m.arena_elo_creative) && (
        <Section title="Chatbot Arena Rankings" className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {m.arena_elo_overall && (
              <RankCard label="Overall" rank={m.arena_elo_overall} />
            )}
            {m.arena_elo_coding && (
              <RankCard label="Coding" rank={m.arena_elo_coding} />
            )}
            {m.arena_elo_math && (
              <RankCard label="Math" rank={m.arena_elo_math} />
            )}
            {m.arena_elo_creative && (
              <RankCard label="Creative" rank={m.arena_elo_creative} />
            )}
          </div>
        </Section>
      )}

      {/* Security & Compliance */}
      {m.security && (
        <Section title="Security & Compliance" className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <ComplianceBadge label="SOC 2 Type II" value={!!m.security.soc2_type2} />
            <ComplianceBadge label="GDPR" value={!!m.security.gdpr_compliant} />
            <ComplianceBadge label="HIPAA" value={!!m.security.hipaa_eligible} />
            <ComplianceBadge label="Enterprise SSO" value={!!m.security.enterprise_sso} />
            <ComplianceBadge label="Audit Logs" value={!!m.security.audit_logs} />
          </div>
          {m.security.data_used_for_training && (
            <p className="text-sm text-[var(--gray-400)] mt-3">
              <strong className="text-[var(--gray-300)]">Training data policy:</strong>{' '}
              {m.security.data_used_for_training}
            </p>
          )}
          {m.security.dpdp_act_notes && (
            <p className="text-sm text-[var(--gray-400)] mt-2">
              <strong className="text-[var(--gray-300)]">DPDP Act (India):</strong>{' '}
              {m.security.dpdp_act_notes}
            </p>
          )}
          {m.security.data_residency && m.security.data_residency.length > 0 && (
            <p className="text-sm text-[var(--gray-400)] mt-2">
              <strong className="text-[var(--gray-300)]">Data residency:</strong>{' '}
              {m.security.data_residency.join(', ')}
            </p>
          )}
        </Section>
      )}

      {/* India Availability */}
      {m.india_availability && (
        <Section title="India Availability" className="mb-8">
          <p className="text-sm text-[var(--gray-300)]">{m.india_availability}</p>
        </Section>
      )}

      {/* Similar Models */}
      {similarModels.length > 0 && (
        <Section title="Similar Models" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {similarModels.map((sm) => (
              <Link
                key={sm.slug}
                href={`/llms/${sm.slug}`}
                className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg p-4 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: PROVIDER_COLORS[sm.provider] || '#666',
                    }}
                  />
                  <span className="text-xs text-[var(--gray-400)]">
                    {sm.provider}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">{sm.name}</h4>
                <div className="flex gap-3 mt-2 text-xs text-[var(--gray-500)]">
                  {sm.arena_elo_overall && (
                    <span>
                      Arena #{sm.arena_elo_overall}
                    </span>
                  )}
                  {sm.input_price_per_mtok !== null ? (
                    <span>
                      {formatPrice(sm.input_price_per_mtok)} /M
                    </span>
                  ) : (
                    <span className="text-emerald-400">Free</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg p-3 text-center">
      <div className="text-[10px] text-[var(--gray-500)] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div
        className={`text-lg font-bold font-mono ${highlight ? 'text-emerald-400' : 'text-white'}`}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[10px] text-[var(--gray-500)]">{sub}</div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-xl p-6 ${className || ''}`}
    >
      <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wider">
        {title}
      </h2>
      {children}
    </div>
  );
}

function PriceRow({
  label,
  value,
  currency,
}: {
  label: string;
  value: number | null;
  currency: CurrencyMode;
}) {
  if (value === null) return null;
  return (
    <div>
      <div className="text-xs text-[var(--gray-500)] mb-1">{label}</div>
      <div className="text-lg font-bold font-mono text-white">
        {formatPrice(value, currency)}
      </div>
      <div className="text-[10px] text-[var(--gray-500)]">per 1M tokens</div>
    </div>
  );
}

function RankCard({ label, rank }: { label: string; rank: number }) {
  return (
    <div className="bg-[var(--gray-800)]/50 rounded-lg p-3 text-center">
      <div className="text-xs text-[var(--gray-500)] mb-1">{label}</div>
      <div
        className="text-2xl font-bold font-mono"
        style={{
          color:
            rank <= 10 ? '#F59E0B' : rank <= 30 ? '#3B82F6' : '#E2E8F0',
        }}
      >
        #{rank}
      </div>
    </div>
  );
}

function ComplianceBadge({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 p-2.5 rounded-lg ${
        value
          ? 'bg-emerald-500/10 border border-emerald-500/20'
          : 'bg-[var(--gray-800)]/50 border border-[var(--gray-800)]'
      }`}
    >
      <span className={value ? 'text-emerald-400' : 'text-[var(--gray-600)]'}>
        {value ? '✓' : '✗'}
      </span>
      <span
        className={`text-xs font-medium ${
          value ? 'text-emerald-300' : 'text-[var(--gray-500)]'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
