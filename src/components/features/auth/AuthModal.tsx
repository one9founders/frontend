'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { signUp, login, googleAuth } from '@/lib/actions/auth';
import CloudflareCheck from '@/components/shared/CloudflareCheck';
import Swal from 'sweetalert2';
import posthog from 'posthog-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

declare global {
  interface Window {
    google: any;
  }
}

type Step = 'role' | 'nonfounder_gate' | 'account' | 'startup_profile' | 'ai_prefs';

const STEP_PROGRESS: Record<Step, number> = {
  role: 15,
  nonfounder_gate: 40,
  account: 40,
  startup_profile: 65,
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

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  useEffect(() => {
    if (isOpen && mode === 'signup') setStep('role');
  }, [isOpen, mode]);

  useEffect(() => { if (isOpen) setMode(defaultMode); }, [isOpen, defaultMode]);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleGoogleResponse = useCallback((response: any) => {
    startTransition(async () => {
      try {
        const result = await googleAuth(response.credential);
        if ('error' in result) { Swal.fire('Error', result.error, 'error'); return; }
        const user = result.user;
        posthog.identify(user.email, { email: user.email, name: user.name });
        posthog.capture('user_logged_in_google', { email: user.email, name: user.name });
        await Swal.fire('Success', `Welcome ${user.name}!`, 'success');
        onClose();
      } catch (error: any) { posthog.captureException(error); Swal.fire('Error', error.message, 'error'); }
    });
  }, [onClose, startTransition]);

  useEffect(() => {
    if (!isOpen || (mode === 'signup' && step !== 'account')) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'filled_black', size: 'large', width: '100%', text: 'continue_with' }
      );
    };
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [isOpen, mode, step, handleGoogleResponse]);

  const togglePill = (arr: string[], setArr: (v: string[]) => void, val: string, max?: number) => {
    if (arr.includes(val)) { setArr(arr.filter(v => v !== val)); }
    else if (max === undefined || arr.length < max) { setArr([...arr, val]); }
  };

  const isFounder = selectedRole === 'founder' || selectedRole === 'cofounder';

  const validateAccount = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email is required';
    if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStartupProfile = () => {
    const errs: Record<string, string> = {};
    if (!startupName.trim()) errs.startupName = 'Startup name is required';
    if (!startupStage) errs.startupStage = 'Stage is required';
    if (!teamSize) errs.teamSize = 'Team size is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('is_startup', String(isFounder));
    formData.append('user_role', selectedRole ?? 'other');
    formData.append('turnstileToken', turnstileToken);
    formData.append('referral_source', referralSource);
    if (isFounder) {
      formData.append('startup_name', startupName);
      formData.append('website', website);
      formData.append('startup_stage', startupStage);
      formData.append('team_size', teamSize);
      formData.append('industry', JSON.stringify(industry));
      formData.append('challenges', JSON.stringify(challenges));
      formData.append('ai_tasks', JSON.stringify(aiTasks));
      formData.append('time_lost_per_week', timeLost);
      formData.append('ai_comfort_level', aiComfort);
    }
    startTransition(async () => {
      try {
        const result = await signUp(formData);
        if ('error' in result) {
          if ('userExists' in result && result.userExists) {
            await Swal.fire('Account exists', 'Please log in instead.', 'info');
            setMode('login');
          } else { Swal.fire('Error', result.error, 'error'); }
          return;
        }
        posthog.identify(result.user.email, { email: result.user.email, name: result.user.name });
        posthog.capture('user_signed_up', { email: result.user.email, name: result.user.name, role: selectedRole, method: 'email' });
        await Swal.fire('Success', `Welcome ${result.user.name}!`, 'success');
        onClose();
      } catch (err: any) { posthog.captureException(err); Swal.fire('Error', err.message, 'error'); }
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!turnstileToken) { Swal.fire('Error', 'Please complete the verification', 'error'); return; }
    const formData = new FormData(e.currentTarget);
    formData.append('turnstileToken', turnstileToken);
    startTransition(async () => {
      try {
        const loginEmail = formData.get('email') as string;
        const result = await login(formData);
        if ('error' in result) { Swal.fire('Error', result.error, 'error'); return; }
        const user = result.user;
        posthog.identify(user.email || loginEmail, { email: user.email || loginEmail, name: user.name });
        posthog.capture('user_logged_in', { email: user.email || loginEmail, name: user.name, method: 'email' });
        await Swal.fire('Success', `Welcome ${user.name}!`, 'success');
        onClose();
      } catch (error: any) { posthog.captureException(error); Swal.fire('Error', error.message, 'error'); }
    });
  };

  if (!isOpen) return null;

  if (mode === 'login') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" style={{ overscrollBehavior: 'contain' }} onClick={onClose}>
        <div className="rounded-lg p-8 max-w-md w-full bg-[var(--gray-900)] border border-[var(--gray-800)]" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input type="email" name="email" placeholder="Email" aria-label="Email" autoComplete="email" required className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]" />
            <input type="password" name="password" placeholder="Password" aria-label="Password" autoComplete="current-password" required className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]" />
            <CloudflareCheck onVerified={(token) => setTurnstileToken(token)} />
            <button type="submit" disabled={isPending} className="w-full py-2 rounded-lg text-white disabled:opacity-50 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer">
              {isPending ? 'Processing\u2026' : 'Login'}
            </button>
          </form>
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--gray-700)]"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 text-gray-500 bg-[var(--gray-900)]">Or continue with</span></div>
            </div>
            <div id="google-signin-button" className="mt-4"></div>
          </div>
          <p className="mt-4 text-center text-sm text-[var(--gray-500)]">
            Don&apos;t have an account?{' '}
            <button onClick={() => { setMode('signup'); setStep('role'); }} className="hover:underline text-[var(--brand-primary)]">Sign Up</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" style={{ overscrollBehavior: 'contain' }} onClick={onClose}>
      <div className="rounded-lg max-w-md w-full bg-[var(--gray-900)] border border-[var(--gray-800)] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="h-0.5 bg-[var(--gray-800)] w-full">
          <div className="h-full bg-[var(--brand-primary)] transition-all duration-300" style={{ width: `${STEP_PROGRESS[step]}%` }} />
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-1 text-white">Create your account</h2>
          <p className="text-sm text-[var(--gray-500)] mb-6">Join thousands of founders using AI to grow faster.</p>

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
              <button disabled={!selectedRole} onClick={() => { if (selectedRole === 'founder' || selectedRole === 'cofounder') { setStep('account'); } else { setStep('nonfounder_gate'); } }}
                className="w-full py-2.5 rounded-lg text-white disabled:opacity-50 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer">
                Continue
              </button>
              <p className="mt-4 text-center text-sm text-[var(--gray-500)]">
                Already have an account?{' '}<button onClick={() => setMode('login')} className="hover:underline text-[var(--brand-primary)]">Login</button>
              </p>
            </>
          )}

          {step === 'nonfounder_gate' && (
            <>
              <div className="space-y-4 mb-6">
                <div className="border border-[var(--gray-800)] bg-[var(--gray-800)] rounded-lg p-4">
                  <p className="text-sm font-medium text-white mb-1">one9founders is built for startup founders.</p>
                  <p className="text-xs text-[var(--gray-500)]">Our tools, recommendations, and community are tailored for people building startups. You can still create an account, but some features may not be relevant to you.</p>
                </div>
                <div className="border border-[var(--gray-800)] bg-[var(--gray-800)] rounded-lg p-4">
                  <p className="text-sm font-medium text-white mb-2">What you still get access to</p>
                  <div className="flex flex-wrap gap-2">
                    {['AI tool directory', 'Startup guides', 'Free resources', 'Newsletter'].map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs rounded-full bg-[rgba(120,40,217,0.15)] text-purple-300 border border-purple-500/30">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setStep('account')} className="w-full py-2.5 rounded-lg text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer mb-3">Create a basic account</button>
              <button onClick={() => setStep('role')} className="w-full text-center text-sm text-[var(--gray-500)] hover:text-white cursor-pointer">&larr; Change my answer</button>
            </>
          )}

          {step === 'account' && (
            <>
              <div id="google-signin-button" className="mb-4"></div>
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--gray-700)]"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 text-gray-500 bg-[var(--gray-900)]">OR</span></div>
              </div>
              <div className="space-y-3">
                <div>
                  <input type="text" value={name} onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }} placeholder="Full name" aria-label="Full name" className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }} placeholder="Email" aria-label="Email" autoComplete="email" className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }} placeholder="Password" aria-label="Password" autoComplete="new-password" className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]" />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })); }} placeholder="Confirm password" aria-label="Confirm password" autoComplete="new-password" className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]" />
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
                <CloudflareCheck onVerified={(token) => setTurnstileToken(token)} />
                <button disabled={isPending} onClick={() => { if (!turnstileToken) { Swal.fire('Error', 'Please complete the verification checkbox above', 'error'); return; } if (!validateAccount()) return; if (isFounder) { setStep('startup_profile'); } else { handleSubmit(); } }}
                  className="w-full py-2.5 rounded-lg text-white disabled:opacity-50 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer">
                  {isPending ? 'Processing\u2026' : isFounder ? 'Continue' : 'Create account'}
                </button>
              </div>
              <button onClick={() => setStep(isFounder ? 'role' : 'nonfounder_gate')} className="w-full text-center text-sm text-[var(--gray-500)] hover:text-white cursor-pointer mt-3">&larr; Back</button>
              <p className="mt-3 text-center text-sm text-[var(--gray-500)]">Already have an account?{' '}<button onClick={() => setMode('login')} className="hover:underline text-[var(--brand-primary)]">Login</button></p>
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
              <button onClick={() => setStep('account')} className="w-full text-center text-sm text-[var(--gray-500)] hover:text-white cursor-pointer mt-3">&larr; Back</button>
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
              <button disabled={isPending} onClick={() => { if (!turnstileToken) { Swal.fire('Error', 'Please complete the verification checkbox above', 'error'); return; } handleSubmit(); }}
                className="w-full py-2.5 rounded-lg text-white disabled:opacity-50 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer mt-6">
                {isPending ? 'Creating account\u2026' : 'Create account'}
              </button>
              <button onClick={() => setStep('startup_profile')} className="w-full text-center text-sm text-[var(--gray-500)] hover:text-white cursor-pointer mt-3">&larr; Back</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
