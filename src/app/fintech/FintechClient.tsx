'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { subscribeToNewsletter } from '@/lib/actions/tools';
import { CHECK_CATALOG, type KycVendorRating } from './kycRatings';
import KycRatingCards from './KycRatingCards';

const COPPER = '#C47A3A';
const COPPER_BRIGHT = '#D4924A';

function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 60;
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dist = Math.sqrt(
            Math.pow(x - canvas.width * 0.5, 2) + Math.pow(y - canvas.height * 0.35, 2)
          );
          const wave = Math.sin(dist * 0.005 - time * 2) * 0.5 + 0.5;
          const alpha = wave * 0.12 * Math.max(0, 1 - dist / (canvas.width * 0.6));

          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196, 122, 58, ${alpha})`;
          ctx.fill();
        }
      }

      const scanY = ((time * 80) % (canvas.height + 200)) - 100;
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      grad.addColorStop(0, 'rgba(196, 122, 58, 0)');
      grad.addColorStop(0.5, 'rgba(196, 122, 58, 0.03)');
      grad.addColorStop(1, 'rgba(196, 122, 58, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 40, canvas.width, 80);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}

function AnimNum({
  target,
  duration = 1800,
  delay = 0,
  suffix = '',
}: {
  target: number;
  duration?: number;
  delay?: number;
  suffix?: string;
}) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let animId: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [started, target, duration]);

  return (
    <>
      {val}
      {suffix}
    </>
  );
}

const tickerItems = [
  'RBI FREE-AI Framework (26 Recommendations)',
  'DPDP Act 2023 + Rules 2025',
  'Digital Lending Directions 2025',
  'PMLA / AML-CFT Compliance',
  'SEBI AI/ML Guidelines',
  'MeitY AI Governance Sutras',
  'RBI Cyber Security Framework',
  'Data Localization Norms',
  'NPCI UPI Guidelines',
  'IT Act 2000 + Intermediary Rules',
];

function Ticker() {
  return (
    <div className="overflow-hidden w-full relative">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{ animation: 'fintech-ticker 40s linear infinite' }}
      >
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span
            key={i}
            className="text-xs font-semibold tracking-wide uppercase shrink-0"
            style={{ color: '#C47A3A33' }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FintechClient({
  kycRatings,
  kycReviewedAt,
  kycFailed,
  creditRatings,
  creditReviewedAt,
  creditFailed,
  fraudRatings,
  fraudReviewedAt,
  fraudFailed,
}: {
  kycRatings: KycVendorRating[];
  kycReviewedAt: string;
  kycFailed: boolean;
  creditRatings: KycVendorRating[];
  creditReviewedAt: string;
  creditFailed: boolean;
  fraudRatings: KycVendorRating[];
  fraudReviewedAt: string;
  fraudFailed: boolean;
}) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [startupType, setStartupType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stack, setStack] = useState<'kyc' | 'credit' | 'fraud'>('kyc');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const source = startupType
        ? `fintech-${startupType.toLowerCase()}`
        : 'fintech';
      const result = await subscribeToNewsletter(email, source);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  const stacks = {
    kyc: {
      ratings: kycRatings,
      reviewedAt: kycReviewedAt,
      failed: kycFailed,
      title: kycFailed
        ? 'KYC ratings could not be loaded.'
        : `${kycRatings.length} KYC vendors, scored from their own pages.`,
    },
    credit: {
      ratings: creditRatings,
      reviewedAt: creditReviewedAt,
      failed: creditFailed,
      title: creditFailed
        ? 'Credit ratings could not be loaded.'
        : `${creditRatings.length} credit vendors, scored from their own pages.`,
    },
    fraud: {
      ratings: fraudRatings,
      reviewedAt: fraudReviewedAt,
      failed: fraudFailed,
      title: fraudFailed
        ? 'Fraud/AML ratings could not be loaded.'
        : `${fraudRatings.length} fraud/AML vendors, scored from their own pages.`,
    },
  };
  const active = stacks[stack];
  const previewBits = [
    kycRatings.length ? `${kycRatings.length} KYC` : null,
    creditRatings.length ? `${creditRatings.length} credit` : null,
    fraudRatings.length ? `${fraudRatings.length} fraud/AML` : null,
  ].filter(Boolean);
  const allFailed = kycFailed && creditFailed && fraudFailed;
  const previewBadge = allFailed
    ? 'Published-evidence ratings. Live counts could not be loaded.'
    : previewBits.length
      ? `Published evidence: ${previewBits.join(', ')} ratings.`
      : 'Published-evidence ratings. Unknown is valid until a page can be cited.';
  const ratedCount = kycRatings.length + creditRatings.length + fraudRatings.length;
  const checks = CHECK_CATALOG;

  const waitlistForm = (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourfintech.com"
          className="fintech-input-glow flex-1 rounded-[10px] px-[18px] py-[14px] text-[15px]"
          style={{
            background: '#0a1e30',
            border: '1px solid #1a3450',
            color: '#e8f4fc',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="fintech-btn-primary rounded-[10px] px-7 py-[14px] text-sm font-bold whitespace-nowrap cursor-pointer disabled:opacity-50"
          style={{
            background: COPPER,
            border: 'none',
            color: '#030a14',
            fontFamily: 'inherit',
          }}
        >
          {loading ? 'Joining...' : 'Get updates'}
        </button>
      </form>
      {error && (
        <p className="text-sm mt-2" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
      <div className="flex gap-1.5 justify-center flex-wrap">
        {['Lending', 'Payments', 'WealthTech', 'InsurTech', 'Neobank', 'Other'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setStartupType(t)}
            className="rounded-md px-3 py-[5px] text-[11px] cursor-pointer transition-all duration-150"
            style={{
              background: startupType === t ? '#1a3450' : 'transparent',
              border: `1px solid ${startupType === t ? '#C47A3A44' : '#1a3450'}`,
              color: startupType === t ? COPPER : '#5a7a8a',
              fontFamily: 'inherit',
              fontWeight: startupType === t ? 600 : 400,
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="relative overflow-hidden" style={{ background: '#030a14', color: '#c8dae8' }}>
      <style>{`
        @keyframes fintech-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes fintech-fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fintech-pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(196, 122, 58, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(196, 122, 58, 0); }
          100% { box-shadow: 0 0 0 0 rgba(196, 122, 58, 0); }
        }
        @keyframes fintech-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .fintech-fade-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fintech-fadeUp 0.8s ease forwards;
        }
        .fintech-pulse-ring {
          animation: fintech-pulseRing 2.5s ease infinite;
        }
        .fintech-card-hover {
          transition: all 0.25s ease;
        }
        .fintech-card-hover:hover {
          transform: translateY(-2px);
          border-color: #C47A3A44 !important;
          background: #0a1e30 !important;
        }
        .fintech-input-glow:focus {
          outline: none;
          border-color: ${COPPER} !important;
          box-shadow: 0 0 0 3px rgba(196, 122, 58, 0.15);
        }
        .fintech-btn-primary {
          transition: all 0.2s ease;
        }
        .fintech-btn-primary:hover {
          background: ${COPPER_BRIGHT} !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(196, 122, 58, 0.3);
        }
      `}</style>

      <GridBackground />

      <section className="relative z-10 max-w-[1100px] mx-auto px-6 pt-16 pb-10 text-center">
        <div
          className="fintech-fade-up inline-flex items-center gap-2 rounded-3xl px-5 py-2 mb-7"
          style={{ background: '#0a1e30', border: '1px solid #1a3450', animationDelay: '0.1s' }}
        >
          <div
            className="fintech-pulse-ring w-2 h-2 rounded-full"
            style={{ background: '#22c55e' }}
          />
          <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>
            {previewBadge}
          </span>
        </div>

        <h1
          className="fintech-fade-up font-extrabold leading-[1.1] mb-5"
          style={{
            fontSize: 'clamp(32px, 5.5vw, 56px)',
            color: '#f0f7ff',
            letterSpacing: '-1.5px',
            animationDelay: '0.2s',
          }}
        >
          Don&apos;t let your AI vendor
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #C47A3A, #E0A85C, #C47A3A)',
              backgroundSize: '200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'fintech-shimmer 4s linear infinite',
            }}
          >
            shut down your fintech.
          </span>
        </h1>

        <p
          className="fintech-fade-up mx-auto mb-9"
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#7a90a8',
            maxWidth: '620px',
            lineHeight: 1.7,
            animationDelay: '0.35s',
          }}
        >
          {ratedCount
            ? `${ratedCount} vendors across KYC, credit, and fraud/AML, scored from published pages against six RBI and DPDP-style checks. Pass, Fail, or Unknown — each Pass or Fail cites a URL. We do not lab-test vendor controls.`
            : 'Six published-evidence checks against RBI and DPDP-style rules. Pass, Fail, or Unknown — each Pass or Fail cites a URL. We do not lab-test vendor controls.'}
        </p>
      </section>

      <div
        className="relative z-10 py-3.5 mt-2"
        style={{ borderTop: '1px solid #0f2035', borderBottom: '1px solid #0f2035' }}
      >
        <Ticker />
      </div>

      <section className="relative z-10 max-w-[900px] mx-auto my-12 px-6">
        <div
          className="fintech-fade-up grid gap-3"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            animationDelay: '0.6s',
          }}
        >
          {[
            { val: kycRatings.length, suffix: '', label: 'KYC Ratings', color: COPPER },
            { val: creditRatings.length, suffix: '', label: 'Credit Ratings', color: COPPER_BRIGHT },
            { val: fraudRatings.length, suffix: '', label: 'Fraud / AML Ratings', color: '#ef4444' },
            { val: 6, suffix: '', label: 'Published-evidence checks', color: '#22c55e' },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-5 text-center"
              style={{ background: '#060e1c', border: '1px solid #0f2035' }}
            >
              <div
                className="font-extrabold leading-none"
                style={{
                  fontFamily: 'monospace',
                  fontSize: '28px',
                  color: s.color,
                }}
              >
                <AnimNum target={s.val} delay={800 + i * 200} suffix={s.suffix} />
              </div>
              <div
                className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: '#5a7a8a' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-[900px] mx-auto py-12 px-6">
        <div
          className="rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #1a0a0a 0%, #0a0a1a 100%)',
            border: '1px solid #3a1515',
            padding: 'clamp(24px, 4vw, 40px)',
          }}
        >
          <div
            className="text-[11px] font-bold uppercase mb-3"
            style={{ color: '#ef4444', letterSpacing: '2px' }}
          >
            The Problem
          </div>
          <h2
            className="font-extrabold leading-[1.3] mb-4"
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              color: '#f0f7ff',
              letterSpacing: '-0.5px',
            }}
          >
            If your AI vendor violates compliance,
            <br />
            RBI shuts <em style={{ fontStyle: 'italic', color: '#ef4444' }}>you</em> down. Not them.
          </h2>
          <p className="text-sm leading-[1.8] max-w-[640px]" style={{ color: '#8a7a7a' }}>
            The RBI FREE-AI framework makes it clear: regulated entities are responsible for their
            third-party AI providers. If your KYC vendor stores data outside India, if your credit
            scoring tool has biased models, if your fraud detection vendor can&apos;t explain its
            decisions, the enforcement action lands on you. Penalties under DPDP alone can reach{' '}
            {'\u20B9'}250 crore. You can&apos;t just pick an AI tool off Google and hope for the best.
          </p>
        </div>
      </section>

      <section className="relative z-10 max-w-[900px] mx-auto py-12 px-6">
        <div
          className="text-[11px] font-bold uppercase mb-2"
          style={{ color: COPPER, letterSpacing: '2px' }}
        >
          How It Works
        </div>
        <h2
          className="font-extrabold mb-2"
          style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            color: '#f0f7ff',
            letterSpacing: '-0.5px',
          }}
        >
          Published pages. Cited URLs. Unknown is allowed.
        </h2>
        <p className="text-sm mb-7 max-w-[560px] leading-relaxed" style={{ color: '#6a8098' }}>
          We map each vendor site and read homepage, security, privacy, and trust pages. Pass and
          Fail need a cited URL. Unknown means we could not cite a page. We do not hands-on test
          vendor controls.
        </p>

        <div
          className="grid gap-2.5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}
        >
          {checks.map((c, i) => (
            <div
              key={c.id}
              className="fintech-card-hover rounded-[10px] p-[18px] cursor-default"
              style={{ background: '#060e1c', border: '1px solid #0f2035' }}
            >
              <div
                className="text-[10px] font-medium mb-2"
                style={{ fontFamily: 'monospace', color: '#C47A3A44' }}
              >
                CHECK_{String(i + 1).padStart(2, '0')}
              </div>
              <div className="font-bold text-sm mb-1.5" style={{ color: '#e8f4fc' }}>
                {c.name}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: '#5a7a8a' }}>
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 flex gap-2 flex-wrap">
        {(
          [
            ['kyc', `KYC (${kycRatings.length})`],
            ['credit', `Credit (${creditRatings.length})`],
            ['fraud', `Fraud / AML (${fraudRatings.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setStack(id)}
            className="rounded-md px-3.5 py-2 text-[12px] font-semibold cursor-pointer"
            style={{
              background: stack === id ? '#1a3450' : 'transparent',
              border: `1px solid ${stack === id ? '#C47A3A44' : '#1a3450'}`,
              color: stack === id ? COPPER : '#5a7a8a',
              fontFamily: 'inherit',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <KycRatingCards
        ratings={active.ratings}
        reviewedAt={active.reviewedAt}
        loadFailed={active.failed}
        title={active.title}
        intro={
          <>
            Pass and Fail each cite a URL. Unknown means we could not find a published page for that
            check — it is not a hidden fail. We do not hands-on test vendor controls.{' '}
            <Link href="/methodology" className="font-semibold" style={{ color: COPPER }}>
              Same published-posture rule as /methodology
            </Link>
            {active.reviewedAt ? `. Reviewed ${active.reviewedAt}.` : '.'}
          </>
        }
      />

      <section className="relative z-10 max-w-[900px] mx-auto py-12 px-6">
        <div
          className="rounded-2xl grid gap-6"
          style={{
            background: '#060e1c',
            border: '1px solid #0f2035',
            padding: 'clamp(24px, 4vw, 40px)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          <div>
            <div
              className="text-[11px] font-bold uppercase mb-3"
              style={{ color: '#22c55e', letterSpacing: '2px' }}
            >
              Built For
            </div>
            <h3
              className="text-xl font-extrabold mb-3"
              style={{ color: '#f0f7ff', letterSpacing: '-0.3px' }}
            >
              Indian Fintech Founders Only
            </h3>
            <p className="text-[13px] leading-[1.7]" style={{ color: '#6a8098' }}>
              This isn&apos;t a generic SaaS review site. Every rating is built around Indian
              regulations, Indian data residency requirements, and the specific risks Indian fintech
              startups face. Unknown is the majority until a vendor publishes a citable page.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { type: 'Lending NBFCs', desc: 'KYC + Credit + Fraud stack' },
              { type: 'Payment Platforms', desc: 'Fraud + AML + KYC stack' },
              { type: 'WealthTech', desc: 'KYC + Risk + SEBI compliance' },
              { type: 'InsurTech', desc: 'Claims AI + KYC + Fraud' },
              { type: 'Neobanks', desc: 'KYC + credit + fraud ratings' },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-lg px-3.5 py-2.5 flex justify-between items-center"
                style={{ background: '#0a1828', border: '1px solid #122a40' }}
              >
                <span className="font-semibold text-[13px]" style={{ color: '#c8dae8' }}>
                  {s.type}
                </span>
                <span className="text-[11px]" style={{ color: '#4a6a8a' }}>
                  {s.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-[600px] mx-auto px-6 pt-16 pb-12 text-center">
        <h2
          className="font-extrabold mb-3"
          style={{
            fontSize: 'clamp(22px, 3.5vw, 32px)',
            color: '#f0f7ff',
            letterSpacing: '-0.5px',
          }}
        >
          {ratedCount
            ? `${ratedCount} published ratings are up. Next batch uses the same rule.`
            : 'Published ratings use the same rule as they land.'}
        </h2>
        <p className="text-sm mb-7 leading-relaxed" style={{ color: '#6a8098' }}>
          Join the waitlist as more KYC, credit, and fraud/AML vendors are scored. Published
          evidence, cited URLs, no lab-test claim.
        </p>

        {!submitted ? (
          <div className="max-w-[480px] mx-auto">{waitlistForm}</div>
        ) : (
          <div
            className="rounded-xl p-5 max-w-[480px] mx-auto"
            style={{ background: '#0a1e30', border: '1px solid #22c55e44' }}
          >
            <div className="text-2xl mb-2">{'\u2713'}</div>
            <div className="font-bold text-base mb-1" style={{ color: '#22c55e' }}>
              You&apos;re on the list.
            </div>
            <div className="text-[13px]" style={{ color: '#7a90a8' }}>
              We&apos;ll email you as more KYC, credit, and fraud/AML ratings publish.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
