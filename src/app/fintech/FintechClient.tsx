'use client';

import { useState, useEffect, useRef } from 'react';
import { subscribeToNewsletter } from '@/lib/actions/tools';

// Animated grid background
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
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.fill();
        }
      }

      const scanY = ((time * 80) % (canvas.height + 200)) - 100;
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.03)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
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

// Animated number counter
function AnimNum({ target, duration = 1800, delay = 0, suffix = '' }: { target: number; duration?: number; delay?: number; suffix?: string }) {
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

  return <>{val}{suffix}</>;
}

// Regulation ticker
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
            style={{ color: '#38bdf833' }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FintechClient() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [startupType, setStartupType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const result = await subscribeToNewsletter(email);
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

  const categories = [
    { icon: '\u{1F510}', name: 'KYC & Identity', count: '7 tools', status: 'Evaluating' },
    { icon: '\u{1F4CA}', name: 'Credit Scoring', count: '5 tools', status: 'Evaluating' },
    { icon: '\u{1F6E1}\uFE0F', name: 'Fraud & AML', count: '5 tools', status: 'Evaluating' },
    { icon: '\u{1F4C4}', name: 'Doc Processing', count: '3 tools', status: 'Coming Soon' },
    { icon: '\u{1F4AC}', name: 'Customer AI', count: '3 tools', status: 'Coming Soon' },
    { icon: '\u2696\uFE0F', name: 'RegTech', count: '2 tools', status: 'Coming Soon' },
  ];

  const checks = [
    { name: 'Data Localization', desc: 'Is your data stored in India per RBI and DPDP requirements?' },
    { name: 'Consent Management', desc: 'Does the tool honor consent withdrawal as DPDP mandates?' },
    { name: 'Model Explainability', desc: 'Can the vendor explain how their AI makes decisions?' },
    { name: 'Security Certs', desc: 'SOC 2 Type II, ISO 27001, PCI DSS verification' },
    { name: 'Bias Testing', desc: 'Has the model been tested for discriminatory outcomes?' },
    { name: 'Vendor Viability', desc: 'Funding, team, MCA filings, financial stability' },
  ];

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
          0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(56, 189, 248, 0); }
          100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
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
          border-color: #38bdf844 !important;
          background: #0a1e30 !important;
        }
        .fintech-input-glow:focus {
          outline: none;
          border-color: #38bdf8 !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
        }
        .fintech-btn-primary {
          transition: all 0.2s ease;
        }
        .fintech-btn-primary:hover {
          background: #2ba8e0 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(56, 189, 248, 0.3);
        }
      `}</style>

      <GridBackground />

      {/* Hero */}
      <section className="relative z-10 max-w-[1100px] mx-auto px-6 pt-16 pb-10 text-center">
        {/* Status badge */}
        <div
          className="fintech-fade-up inline-flex items-center gap-2 rounded-3xl px-5 py-2 mb-7"
          style={{ background: '#0a1e30', border: '1px solid #1a3450', animationDelay: '0.1s' }}
        >
          <div
            className="fintech-pulse-ring w-2 h-2 rounded-full"
            style={{ background: '#22c55e' }}
          />
          <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>
            Evaluating {'>'}25 AI tools against Indian fintech regulations
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
              background: 'linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8)',
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
          We independently evaluate every AI tool Indian fintech startups use,
          against RBI FREE-AI, DPDP Act, AML/CFT, and 30+ compliance checks.
          So you can build fast without regulatory risk.
        </p>

        {/* Waitlist */}
        <div
          className="fintech-fade-up max-w-[480px] mx-auto"
          style={{ animationDelay: '0.5s' }}
        >
          {!submitted ? (
            <div>
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
                    background: '#38bdf8',
                    border: 'none',
                    color: '#030a14',
                    fontFamily: 'inherit',
                  }}
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
              {error && <p className="text-sm mt-2" style={{ color: '#ef4444' }}>{error}</p>}

              {/* Startup type selector */}
              <div className="flex gap-1.5 justify-center flex-wrap">
                {['Lending', 'Payments', 'WealthTech', 'InsurTech', 'Neobank', 'Other'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setStartupType(t)}
                    className="rounded-md px-3 py-[5px] text-[11px] cursor-pointer transition-all duration-150"
                    style={{
                      background: startupType === t ? '#1a3450' : 'transparent',
                      border: `1px solid ${startupType === t ? '#38bdf844' : '#1a3450'}`,
                      color: startupType === t ? '#38bdf8' : '#5a7a8a',
                      fontFamily: 'inherit',
                      fontWeight: startupType === t ? 600 : 400,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-5"
              style={{ background: '#0a1e30', border: '1px solid #22c55e44' }}
            >
              <div className="text-2xl mb-2">{'\u2713'}</div>
              <div className="font-bold text-base mb-1" style={{ color: '#22c55e' }}>
                You&apos;re on the list.
              </div>
              <div className="text-[13px]" style={{ color: '#7a90a8' }}>
                We&apos;ll send you early access when we launch the first compliance ratings.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Regulation Ticker */}
      <div
        className="relative z-10 py-3.5 mt-10"
        style={{ borderTop: '1px solid #0f2035', borderBottom: '1px solid #0f2035' }}
      >
        <Ticker />
      </div>

      {/* Stats Bar */}
      <section className="relative z-10 max-w-[900px] mx-auto my-12 px-6">
        <div
          className="fintech-fade-up grid gap-3"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            animationDelay: '0.6s',
          }}
        >
          {[
            { val: 8, suffix: '', label: 'Regulations Tracked', color: '#ef4444' },
            { val: 25, suffix: '+', label: 'AI Tools In Process of Evaluation', color: '#38bdf8' },
            { val: 33, suffix: '', label: 'Compliance Checks', color: '#a78bfa' },
            { val: 7, suffix: '', label: 'Startup Categories', color: '#22c55e' },
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

      {/* Problem Section */}
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
            The RBI FREE-AI framework makes it clear: regulated entities are responsible for their third-party AI providers.
            If your KYC vendor stores data outside India, if your credit scoring tool has biased models, if your fraud
            detection vendor can&apos;t explain its decisions, the enforcement action lands on you. Penalties under DPDP alone
            can reach {'\u20B9'}250 crore. You can&apos;t just pick an AI tool off Google and hope for the best.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-[900px] mx-auto py-12 px-6">
        <div
          className="text-[11px] font-bold uppercase mb-2"
          style={{ color: '#38bdf8', letterSpacing: '2px' }}
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
          We scrape. We verify. We rate.
        </h2>
        <p className="text-sm mb-7 max-w-[560px] leading-relaxed" style={{ color: '#6a8098' }}>
          Our AI engine crawls vendor websites, security pages, and public regulatory databases,
          then cross-references against every Indian fintech compliance requirement.
        </p>

        <div
          className="grid gap-2.5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}
        >
          {checks.map((c, i) => (
            <div
              key={i}
              className="fintech-card-hover rounded-[10px] p-[18px] cursor-default"
              style={{ background: '#060e1c', border: '1px solid #0f2035' }}
            >
              <div
                className="text-[10px] font-medium mb-2"
                style={{ fontFamily: 'monospace', color: '#38bdf844' }}
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

      {/* Tool Categories */}
      <section className="relative z-10 max-w-[900px] mx-auto py-12 px-6">
        <div
          className="text-[11px] font-bold uppercase mb-2"
          style={{ color: '#a78bfa', letterSpacing: '2px' }}
        >
          The Stack
        </div>
        <h2
          className="font-extrabold mb-2"
          style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            color: '#f0f7ff',
            letterSpacing: '-0.5px',
          }}
        >
          Every AI tool category, evaluated.
        </h2>
        <p className="text-sm mb-7 max-w-[560px] leading-relaxed" style={{ color: '#6a8098' }}>
          We&apos;re building compliance ratings for the full fintech AI stack.
          Tell us your startup type, and we&apos;ll recommend a verified, compliant stack.
        </p>

        <div
          className="grid gap-2.5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
        >
          {categories.map((c, i) => (
            <div
              key={i}
              className="fintech-card-hover rounded-[10px] p-[18px] text-center cursor-default"
              style={{ background: '#060e1c', border: '1px solid #0f2035' }}
            >
              <div className="text-[28px] mb-2">{c.icon}</div>
              <div className="font-bold text-[13px] mb-1" style={{ color: '#e8f4fc' }}>
                {c.name}
              </div>
              <div className="text-[11px] mb-2" style={{ color: '#5a7a8a' }}>
                {c.count}
              </div>
              <div
                className="inline-block px-2.5 py-[3px] rounded-[10px] text-[10px] font-bold uppercase"
                style={{
                  letterSpacing: '0.5px',
                  background: c.status === 'Evaluating' ? '#38bdf815' : '#a78bfa15',
                  color: c.status === 'Evaluating' ? '#38bdf8' : '#a78bfa',
                  border: `1px solid ${c.status === 'Evaluating' ? '#38bdf833' : '#a78bfa33'}`,
                }}
              >
                {c.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Built For Section */}
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
              This isn&apos;t a generic SaaS review site. Every evaluation is built around Indian regulations,
              Indian data residency requirements, and the specific risks Indian fintech startups face.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { type: 'Lending NBFCs', desc: 'KYC + Credit + Fraud stack' },
              { type: 'Payment Platforms', desc: 'Fraud + AML + KYC stack' },
              { type: 'WealthTech', desc: 'KYC + Risk + SEBI compliance' },
              { type: 'InsurTech', desc: 'Claims AI + KYC + Fraud' },
              { type: 'Neobanks', desc: 'Full stack evaluation' },
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

      {/* CTA Bottom */}
      <section className="relative z-10 max-w-[600px] mx-auto px-6 pt-16 pb-12 text-center">
        <h2
          className="font-extrabold mb-3"
          style={{
            fontSize: 'clamp(22px, 3.5vw, 32px)',
            color: '#f0f7ff',
            letterSpacing: '-0.5px',
          }}
        >
          Launching Q2 2026.
        </h2>
        <p className="text-sm mb-7 leading-relaxed" style={{ color: '#6a8098' }}>
          First batch of compliance ratings for KYC and Credit Scoring tools
          drops soon. Get early access.
        </p>

        {!submitted ? (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-[400px] mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
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
                className="fintech-btn-primary rounded-[10px] px-6 py-[14px] text-sm font-bold cursor-pointer disabled:opacity-50"
                style={{
                  background: '#38bdf8',
                  border: 'none',
                  color: '#030a14',
                  fontFamily: 'inherit',
                }}
              >
                {loading ? 'Joining...' : 'Get Early Access'}
              </button>
            </form>
            {error && <p className="text-sm mt-2" style={{ color: '#ef4444' }}>{error}</p>}
          </>
        ) : (
          <p className="font-semibold" style={{ color: '#22c55e' }}>You&apos;re on the list {'\u2713'}</p>
        )}
      </section>
    </div>
  );
}
