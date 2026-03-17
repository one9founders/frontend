'use client';

import { useState } from 'react';
import { educationAPI } from '@/lib/api/apiClient';

interface WorkshopRegisterFormProps {
  workshopSlug: string;
  workshopTitle: string;
  onClose?: () => void;
}

export default function WorkshopRegisterForm({
  workshopSlug,
  workshopTitle,
  onClose,
}: WorkshopRegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await educationAPI.registerForWorkshop(workshopSlug, formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', organization: '' });
      setTimeout(() => {
        setStatus('idle');
        onClose?.();
      }, 3000);
    } catch (err: unknown) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMessage(message);
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
        <svg className="w-10 h-10 mx-auto mb-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-bold text-white mb-1">You&apos;re Registered!</h3>
        <p className="text-sm text-[var(--gray-400)]">Check your email for details.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Register for Workshop</h3>
        {onClose && (
          <button onClick={onClose} className="text-[var(--gray-500)] hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <p className="text-sm text-[var(--gray-400)] mb-4">{workshopTitle}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your Name *"
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500 text-sm"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email *"
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500 text-sm"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500 text-sm"
        />
        <input
          type="text"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          placeholder="Organization"
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500 text-sm"
        />

        {errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full px-4 py-2.5 disabled:opacity-50 text-sm"
        >
          {status === 'loading' ? 'Registering...' : 'Register Now'}
        </button>
      </form>
    </div>
  );
}
