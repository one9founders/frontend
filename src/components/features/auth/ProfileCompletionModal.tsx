'use client';

import { useState, useTransition } from 'react';
import { completeProfile } from '@/lib/actions/auth';
import Swal from 'sweetalert2';
import posthog from 'posthog-js';

type Step = 'role' | 'startup_profile' | 'ai_prefs';

const STEP_PROGRESS: Record<Step, number> = {
  role: 20,
  startup_profile: 55,
  ai_prefs: 85,
};

const ROLES = [
  { id: 'founder', icon: '\u{1F680}', label: 'Founder', desc: 'Building or running a startup' },
  { id: 'cofounder', icon: '\u{1F91D}', label: 'Co-founder', desc: 'Part of a founding team' },
  { id: 'investor', icon: '\u{1F4BC}', label: 'Investor / VC', desc: 'Funding startups' },
  { id: 'student', icon: '\u{1F393}', label: 'Student', desc: 'University or college' },
  { id: 'professional', icon: '\u{1F4BB}', label: 'Professional', desc: 'Employed, not at a startup' },
  { id: 'other', icon: '\u{1F310}', label: 'Other', desc: 'Researcher, educator, etc.' },
] as const;

const STAGE_OPTIONS = ['Idea / Pre-product', 'MVP / Early traction', 'Seed funded', 'Series A+', 'Bootstrapped & profitable'];
const TEAM_SIZE_OPTIONS = ['Solo founder', '2\u20135', '6\u201315', '16\u201350', '50+'];
const INDUSTRY_OPTIONS = ['SaaS', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'Deep tech', 'Consumer', 'Logistics', 'Other'];
const CHALLENGE_OPTIONS = ['Finding customers', 'Fundraising', 'Building fast', 'Marketing', 'Team management', 'Finance & ops', 'Product direction'];
const AI_TASK_OPTIONS = ['Emails', 'Investor updates', 'Social media', 'Pitch decks', 'Market research', 'Meeting notes', 'Hiring / JDs', 'Financial models', 'Customer support', 'Sales scripts', 'Legal docs'];
const TIME_LOST_OPTIONS = ['Under 5 hrs', '5\u201310 hrs', '10\u201320 hrs', '20+ hrs'];
const AI_COMFORT_OPTIONS = ['Never used it', 'Tried a few tools', 'Use regularly', 'Power user'];
const REFERRAL_OPTIONS = ['WhatsApp message', 'Cold email', 'LinkedIn', 'Friend / referral', 'Google'];

function PillGroup({
  options, selected, onToggle, max
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        const isDisabled = !isSelected && max !== undefined && selected.length >= max;
        return (
          <button
            key={opt}
            type="button"
            disabled={isDisabled}
            onClick={() => onToggle(opt)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isSelected
                ? 'border-[var(--brand-primary)] bg-[rgba(120,40,217,0.15)] text-white'
                : 'border-[var(--gray-700)] bg-[var(--gray-800)] text-[var(--gray-400)]'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

interface ProfileCompletionModalProps {
  onComplete: () => void;
}

export default function ProfileCompletionModal({ onComplete }: ProfileCompletionModalProps) {
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [startupName, setStartupName] = useState('');
  const [website, setWebsite] = useState('');
  const [startupStage, setStartupStage] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [industry, setIndustry] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);

  const [aiTasks, setAiTasks] = useState<string[]>([]);
  const [timeLost, setTimeLost] = useState('');
  const [aiComfort, setAiComfort] = useState('');
  const [referralSource, setReferralSource] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFounder = selectedRole === 'founder' || selectedRole === 'cofounder';

  const togglePill = (arr: string[], setArr: (v: string[]) => void, val: string, max?: number) => {
    if (arr.includes(val)) { setArr(arr.filter(v => v !== val)); }
    else if (max === undefined || arr.length < max) { setArr([...arr, val]); }
  };

  const validateStartupProfile = () => {
    const errs: Record<string, string> = {};
    if (!startupName.trim()) errs.startupName = 'Startup name is required';
    if (!startupStage) errs.startupStage = 'Stage is required';
    if (!teamSize) errs.teamSize = 'Team size is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSkip = () => {
    startTransition(async () => {
      const result = await completeProfile({ user_role: selectedRole || '', profile_completed: true });
      if (result && 'error' in result) { Swal.fire('Error', result.error, 'error'); return; }
      posthog.capture('profile_skipped', { role: selectedRole, step });
      onComplete();
    });
  };

  const handleSubmit = () => {
    const data: Record<string, unknown> = {
      user_role: selectedRole || '',
      is_startup: isFounder,
      referral_source: referralSource,
      profile_completed: true,
    };
    if (isFounder) {
      data.startup_name = startupName;
      data.website = website;
      data.startup_stage = startupStage;
      data.team_size = teamSize;
      data.industry = industry;
      data.challenges = challenges;
      data.ai_tasks = aiTasks;
      data.time_lost_per_week = timeLost;
      data.ai_comfort_level = aiComfort;
    }
    startTransition(async () => {
      const result = await completeProfile(data);
      if (result && 'error' in result) { Swal.fire('Error', result.error, 'error'); return; }
      posthog.capture('profile_completed', { role: selectedRole, method: 'modal' });
      onComplete();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" style={{ overscrollBehavior: 'contain' }}>
      <div className="rounded-lg max-w-md w-full bg-[var(--gray-900)] border border-[var(--gray-800)] max-h-[90vh] overflow-y-auto">
        <div className="h-0.5 bg-[var(--gray-800)] w-full">
          <div className="h-full bg-[var(--brand-primary)] transition-all duration-300" style={{ width: `${STEP_PROGRESS[step]}%` }} />
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-1 text-white">Complete your profile</h2>
          <p className="text-sm text-[var(--gray-500)] mb-6">Help us personalise your experience.</p>

          {step === 'role' && (
            <>
              <p className="text-sm text-[var(--gray-400)] mb-4">What best describes you?</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {ROLES.map((r) => (
                  <button key={r.id} type="button" onClick={() => setSelectedRole(r.id)}
                    className={`border rounded-lg p-3 text-left transition-colors cursor-pointer ${selectedRole === r.id ? 'border-[var(--brand-primary)] bg-[rgba(120,40,217,0.12)]' : 'border-[var(--gray-800)] bg-[var(--gray-800)]'}`}>
                    <span className="text-lg">{r.icon}</span>
                    <p className="text-sm font-medium text-white mt-1">{r.label}</p>
                    <p className="text-xs text-[var(--gray-500)]">{r.desc}</p>
                  </button>
                ))}
              </div>
              <button disabled={!selectedRole || isPending} onClick={() => { if (isFounder) { setStep('startup_profile'); } else { handleSubmit(); } }}
                className="w-full py-2.5 rounded-lg text-white disabled:opacity-50 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer">
                {isFounder ? 'Continue' : 'Save'}
              </button>
              <button onClick={handleSkip} disabled={isPending} className="w-full text-center text-sm text-[var(--gray-500)] hover:text-white cursor-pointer mt-3">
                Skip for now
              </button>
            </>
          )}

          {step === 'startup_profile' && (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input type="text" value={startupName} onChange={(e) => { setStartupName(e.target.value); setErrors(prev => ({ ...prev, startupName: '' })); }} placeholder="Startup name *" aria-label="Startup name" className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]" />
                    {errors.startupName && <p className="text-red-400 text-xs mt-1">{errors.startupName}</p>}
                  </div>
                  <div>
                    <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website (optional)" aria-label="Website" className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[var(--gray-400)] mb-1 block">Stage *</label>
                  <select value={startupStage} onChange={(e) => { setStartupStage(e.target.value); setErrors(prev => ({ ...prev, startupStage: '' })); }} className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]">
                    <option value="">Select stage</option>
                    {STAGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.startupStage && <p className="text-red-400 text-xs mt-1">{errors.startupStage}</p>}
                </div>
                <div>
                  <label className="text-sm text-[var(--gray-400)] mb-1 block">Team size *</label>
                  <select value={teamSize} onChange={(e) => { setTeamSize(e.target.value); setErrors(prev => ({ ...prev, teamSize: '' })); }} className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]">
                    <option value="">Select team size</option>
                    {TEAM_SIZE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.teamSize && <p className="text-red-400 text-xs mt-1">{errors.teamSize}</p>}
                </div>
                <div>
                  <label className="text-sm text-[var(--gray-400)] mb-2 block">Industry</label>
                  <PillGroup options={INDUSTRY_OPTIONS} selected={industry} onToggle={(v) => togglePill(industry, setIndustry, v)} />
                </div>
                <div>
                  <label className="text-sm text-[var(--gray-400)] mb-2 block">Biggest challenges (max 3)</label>
                  <PillGroup options={CHALLENGE_OPTIONS} selected={challenges} onToggle={(v) => togglePill(challenges, setChallenges, v, 3)} max={3} />
                </div>
              </div>
              <button onClick={() => { if (!validateStartupProfile()) return; setStep('ai_prefs'); }}
                className="w-full py-2.5 rounded-lg text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer mt-6">Continue</button>
              <button onClick={() => setStep('role')} className="w-full text-center text-sm text-[var(--gray-500)] hover:text-white cursor-pointer mt-3">&larr; Back</button>
              <button onClick={handleSkip} disabled={isPending} className="w-full text-center text-sm text-[var(--gray-500)] hover:text-white cursor-pointer mt-2">
                Skip for now
              </button>
            </>
          )}

          {step === 'ai_prefs' && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[var(--gray-400)] mb-2 block">What tasks do you want AI to handle?</label>
                  <PillGroup options={AI_TASK_OPTIONS} selected={aiTasks} onToggle={(v) => togglePill(aiTasks, setAiTasks, v)} />
                </div>
                <div>
                  <label className="text-sm text-[var(--gray-400)] mb-2 block">Hours lost per week on repetitive tasks</label>
                  <PillGroup options={TIME_LOST_OPTIONS} selected={timeLost ? [timeLost] : []} onToggle={(v) => setTimeLost(timeLost === v ? '' : v)} />
                </div>
                <div>
                  <label className="text-sm text-[var(--gray-400)] mb-2 block">Your AI comfort level</label>
                  <PillGroup options={AI_COMFORT_OPTIONS} selected={aiComfort ? [aiComfort] : []} onToggle={(v) => setAiComfort(aiComfort === v ? '' : v)} />
                </div>
                <div>
                  <label className="text-sm text-[var(--gray-400)] mb-2 block">How did you hear about us?</label>
                  <PillGroup options={REFERRAL_OPTIONS} selected={referralSource ? [referralSource] : []} onToggle={(v) => setReferralSource(referralSource === v ? '' : v)} />
                </div>
              </div>
              <button disabled={isPending} onClick={handleSubmit}
                className="w-full py-2.5 rounded-lg text-white disabled:opacity-50 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer mt-6">
                {isPending ? 'Saving\u2026' : 'Save profile'}
              </button>
              <button onClick={() => setStep('startup_profile')} className="w-full text-center text-sm text-[var(--gray-500)] hover:text-white cursor-pointer mt-3">&larr; Back</button>
              <button onClick={handleSkip} disabled={isPending} className="w-full text-center text-sm text-[var(--gray-500)] hover:text-white cursor-pointer mt-2">
                Skip for now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
