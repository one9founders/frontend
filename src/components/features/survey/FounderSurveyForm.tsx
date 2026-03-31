'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FormData = {
  name: string;
  startup: string;
  stage: string;
  time_wasting_task: string;
  area: string;
  hours_per_week: string;
  pain_score: string;
  tried_to_solve: string;
  freed_time_use: string;
  willingness_to_pay: string;
  contact: string;
};

const STAGES = ['Idea', 'Building', 'Early revenue', 'Scaling'];
const AREAS = ['Sales & outreach', 'Ops & admin', 'Finance', 'Marketing', 'Hiring', 'Other'];
const HOURS = ['1–2h', '3–5h', '5–10h', '10h+'];
const PAIN = ['1', '2', '3', '4', '5'];
const PAY_OPTIONS = ['Yes, easily', 'Depends on price', 'Probably not', 'Already paying someone'];

export default function FounderSurveyForm() {
  const [form, setForm] = useState<FormData>({
    name: '', startup: '', stage: '', time_wasting_task: '',
    area: '', hours_per_week: '', pain_score: '', tried_to_solve: '',
    freed_time_use: '', willingness_to_pay: '', contact: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.time_wasting_task.trim()) {
      setError('Please tell us what wastes your time.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/founder-survey/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Try again or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--brand-primary)] bg-opacity-20 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5 9-9" stroke="#7828D9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Got it. Thank you.</h2>
        <p className="text-[var(--gray-400)] text-base leading-relaxed">
          We'll reach out if we build something that fixes this.<br />
          Appreciate you taking the time.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <p className="text-xs font-semibold tracking-widest text-[var(--brand-tertiary)] uppercase mb-4">
        one9 founders
      </p>
      <h1 className="text-3xl font-bold text-white mb-2">What's slowing you down?</h1>
      <p className="text-[var(--gray-400)] text-base mb-10 leading-relaxed">
        Takes 2 minutes. We're building tools to fix real founder problems.<br />No pitch, just listening.
      </p>

      <form onSubmit={handleSubmit} className="space-y-7">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Your name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="First name is fine"
            className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors text-sm"
          />
        </div>

        {/* Startup */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Your startup <span className="text-[var(--gray-500)] font-normal">(one line)</span></label>
          <input
            type="text"
            value={form.startup}
            onChange={e => set('startup', e.target.value)}
            placeholder="What do you do?"
            className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors text-sm"
          />
        </div>

        {/* Stage */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">Stage</label>
          <div className="flex flex-wrap gap-2">
            {STAGES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => set('stage', s)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  form.stage === s
                    ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                    : 'bg-transparent border-[var(--gray-700)] text-[var(--gray-400)] hover:border-[var(--gray-500)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--gray-800)]" />

        {/* Core question */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            What's the one task that eats your time every week?
          </label>
          <p className="text-xs text-[var(--gray-500)] mb-2">
            The thing you do manually, hate doing, but haven't fixed yet.
          </p>
          <textarea
            value={form.time_wasting_task}
            onChange={e => set('time_wasting_task', e.target.value)}
            placeholder="e.g. Following up with leads, reconciling invoices, updating the team on status..."
            rows={3}
            className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors text-sm resize-none"
          />
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">Which area does this fall under?</label>
          <div className="flex flex-wrap gap-2">
            {AREAS.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => set('area', a)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  form.area === a
                    ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                    : 'bg-transparent border-[var(--gray-700)] text-[var(--gray-400)] hover:border-[var(--gray-500)]'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">How many hours a week does this cost you?</label>
          <div className="grid grid-cols-4 gap-2">
            {HOURS.map(h => (
              <button
                key={h}
                type="button"
                onClick={() => set('hours_per_week', h)}
                className={`py-2.5 rounded-lg text-sm border transition-all ${
                  form.hours_per_week === h
                    ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                    : 'bg-transparent border-[var(--gray-700)] text-[var(--gray-400)] hover:border-[var(--gray-500)]'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Pain score */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">How painful is this on a scale of 1–5?</label>
          <div className="grid grid-cols-5 gap-2">
            {PAIN.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => set('pain_score', p)}
                className={`py-2.5 rounded-lg text-sm border transition-all ${
                  form.pain_score === p
                    ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                    : 'bg-transparent border-[var(--gray-700)] text-[var(--gray-400)] hover:border-[var(--gray-500)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-[var(--gray-600)]">Annoying</span>
            <span className="text-xs text-[var(--gray-600)]">Killing me</span>
          </div>
        </div>

        {/* Tried to solve */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Have you tried to solve this? What happened?</label>
          <textarea
            value={form.tried_to_solve}
            onChange={e => set('tried_to_solve', e.target.value)}
            placeholder="Hired someone, tried a tool, gave up..."
            rows={2}
            className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors text-sm resize-none"
          />
        </div>

        <div className="border-t border-[var(--gray-800)]" />

        {/* Freed time */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">If this was fixed, what would you do with that time?</label>
          <textarea
            value={form.freed_time_use}
            onChange={e => set('freed_time_use', e.target.value)}
            placeholder="Close more deals, sleep, actually build the product..."
            rows={2}
            className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors text-sm resize-none"
          />
        </div>

        {/* Willingness to pay */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">Would you pay to have this solved?</label>
          <div className="flex flex-wrap gap-2">
            {PAY_OPTIONS.map(o => (
              <button
                key={o}
                type="button"
                onClick={() => set('willingness_to_pay', o)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  form.willingness_to_pay === o
                    ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                    : 'bg-transparent border-[var(--gray-700)] text-[var(--gray-400)] hover:border-[var(--gray-500)]'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            WhatsApp or email{' '}
            <span className="text-[var(--gray-500)] font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.contact}
            onChange={e => set('contact', e.target.value)}
            placeholder="So we can follow up if we build something"
            className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors text-sm"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-lg font-semibold text-white text-sm transition-all bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit →'}
        </button>

        <p className="text-xs text-center text-[var(--gray-600)]">No spam. No pitch. Just building something useful.</p>
      </form>
    </div>
  );
}
