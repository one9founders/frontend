'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  CHECK_CATALOG,
  resultLabel,
  sourcesForVendor,
  type CheckResult,
  type KycCheck,
  type KycVendorRating,
} from './kycRatings';

const COPPER = '#C47A3A';

const RESULT_STYLE: Record<
  CheckResult,
  { color: string; background: string; border: string }
> = {
  pass: { color: '#22c55e', background: '#22c55e18', border: '#22c55e44' },
  fail: { color: '#ef4444', background: '#ef444418', border: '#ef444444' },
  unknown: { color: '#cbd5e1', background: '#1e293b', border: '#475569' },
};

function catalogName(id: KycCheck['id']): string {
  return CHECK_CATALOG.find((c) => c.id === id)?.name ?? id;
}

function ResultBadge({ result }: { result: CheckResult }) {
  const s = RESULT_STYLE[result];
  return (
    <span
      className="inline-block shrink-0 rounded-[10px] px-2.5 py-[3px] text-[10px] font-bold uppercase"
      style={{
        letterSpacing: '0.5px',
        color: s.color,
        background: s.background,
        border: `1px solid ${s.border}`,
      }}
    >
      {resultLabel(result)}
    </span>
  );
}

function VendorCard({ vendor }: { vendor: KycVendorRating }) {
  const sources = sourcesForVendor(vendor);

  return (
    <article
      className="rounded-[10px] p-5"
      style={{ background: '#060e1c', border: '1px solid #0f2035' }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-extrabold text-lg" style={{ color: '#f0f7ff' }}>
            {vendor.name}
          </h3>
          <p className="text-[13px] leading-relaxed mt-1" style={{ color: '#8aa4b8' }}>
            {vendor.oneLiner}
          </p>
        </div>
        {vendor.website ? (
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold shrink-0"
            style={{ color: COPPER }}
          >
            {vendor.websiteLabel || vendor.website} ↗
          </a>
        ) : null}
      </div>

      {vendor.indiaRelevance ? (
        <p className="text-xs leading-relaxed mb-4" style={{ color: '#5a7a8a' }}>
          <span className="font-semibold" style={{ color: '#7a90a8' }}>
            India relevance.{' '}
          </span>
          {vendor.indiaRelevance}
        </p>
      ) : null}

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
      >
        {vendor.checks.map((check) => (
          <div
            key={check.id}
            className="rounded-lg px-3 py-2.5"
            style={{ background: '#0a1828', border: '1px solid #122a40' }}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-semibold text-[12px]" style={{ color: '#e8f4fc' }}>
                {catalogName(check.id)}
              </span>
              <ResultBadge result={check.result} />
            </div>
            {check.rationale ? (
              <p className="text-[11px] leading-relaxed" style={{ color: '#6a8098' }}>
                {check.rationale}
              </p>
            ) : null}
            {check.result === 'pass' || check.result === 'fail' ? (
              check.sourceUrl ? (
                <a
                  href={check.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1.5 text-[11px] font-medium"
                  style={{ color: COPPER }}
                >
                  Source: {check.sourceLabel || 'vendor page'} ↗
                </a>
              ) : (
                <p className="mt-1.5 text-[11px]" style={{ color: '#64748b' }}>
                  No cited URL on this {resultLabel(check.result).toLowerCase()}.
                </p>
              )
            ) : (
              <p className="mt-1.5 text-[11px]" style={{ color: '#64748b' }}>
                {check.sourceUrl ? (
                  <a
                    href={check.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium"
                    style={{ color: COPPER }}
                  >
                    Source: {check.sourceLabel || 'vendor page'} ↗
                  </a>
                ) : (
                  'No source URL — Unknown'
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      {sources.length > 0 && (
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid #122a40' }}>
          <div
            className="text-[10px] font-bold uppercase mb-2"
            style={{ color: '#5a7a8a', letterSpacing: '1px' }}
          >
            Sources
          </div>
          <ul className="flex flex-col gap-1">
            {sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px]"
                  style={{ color: '#7a90a8' }}
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default function KycRatingCards({
  ratings = [],
  reviewedAt = '',
  loadFailed = false,
  eyebrow = 'Published evidence, not a lab test',
  title = 'Vendors, scored from their own pages.',
  intro,
}: {
  ratings?: KycVendorRating[];
  reviewedAt?: string;
  loadFailed?: boolean;
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
}) {
  const [query, setQuery] = useState('');
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return ratings;
    return ratings.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(needle) ||
        vendor.oneLiner.toLowerCase().includes(needle)
    );
  }, [ratings, query]);

  return (
    <section className="relative z-10 max-w-[900px] mx-auto py-12 px-6">
      <div
        className="text-[11px] font-bold uppercase mb-2"
        style={{ color: COPPER, letterSpacing: '2px' }}
      >
        {eyebrow}
      </div>
      <h2
        className="font-extrabold mb-2"
        style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          color: '#f0f7ff',
          letterSpacing: '-0.5px',
        }}
      >
        {title}
      </h2>
      <p className="text-sm mb-7 max-w-[640px] leading-relaxed" style={{ color: '#6a8098' }}>
        {intro ?? (
          <>
            Pass and Fail each cite a URL. Unknown means we could not find a published
            page for that check — it is not a hidden fail. We do not hands-on test
            vendor controls.{' '}
            <Link href="/methodology" className="font-semibold" style={{ color: COPPER }}>
              Same published-posture rule as /methodology
            </Link>
            {reviewedAt ? `. Reviewed ${reviewedAt}.` : '.'}
          </>
        )}
      </p>

      {ratings.length > 6 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter vendors"
          className="mb-4 w-full max-w-sm rounded-[10px] px-3.5 py-2.5 text-sm fintech-input-glow"
          style={{
            background: '#0a1e30',
            border: '1px solid #1a3450',
            color: '#e8f4fc',
            fontFamily: 'inherit',
          }}
        />
      )}

      {loadFailed && ratings.length === 0 ? (
        <p className="text-sm leading-relaxed" style={{ color: '#6a8098' }}>
          Ratings could not be loaded from the API. Unknown is the honest state until
          published pages can be read. This page does not invent Pass or Fail.
        </p>
      ) : visible.length === 0 ? (
        <p className="text-sm leading-relaxed" style={{ color: '#6a8098' }}>
          {query.trim()
            ? 'No vendors match that filter.'
            : 'No vendors in this stack yet. Unknown is the honest state until published pages are scored.'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((vendor) => (
            <VendorCard key={vendor.slug} vendor={vendor} />
          ))}
        </div>
      )}
    </section>
  );
}
