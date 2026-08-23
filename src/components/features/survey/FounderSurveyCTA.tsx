'use client';

import Link from 'next/link';

/**
 * Drop this anywhere on the landing page (page.tsx or HeroSection.tsx).
 * It's a lightweight CTA card that links to /founder-survey.
 * 
 * Usage:
 *   import FounderSurveyCTA from '@/components/features/survey/FounderSurveyCTA';
 *   <FounderSurveyCTA />
 */
export default function FounderSurveyCTA() {
  return (
    <section className="py-16 px-4 border-t border-[var(--line)] bg-[var(--ink)]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--copper)] uppercase mb-4">
          for founders
        </p>
        <h2 className="text-3xl font-bold text-[var(--paper)] mb-4">
          What's slowing your startup down?
        </h2>
        <p className="text-[var(--gray-400)] text-base mb-8 leading-relaxed">
          Tell us the one thing that eats your time every week.<br />
          We're building tools to fix real problems. Takes 2 minutes.
        </p>
        <Link
          href="/founder-survey"
          className="inline-block px-8 py-3.5 bg-[var(--copper)] hover:bg-[var(--copper-bright)] text-[var(--ink)] font-semibold text-sm transition-colors"
        >
          Share your problem
        </Link>
        <p className="text-xs text-[var(--gray-600)] mt-4">No spam. No pitch.</p>
      </div>
    </section>
  );
}
