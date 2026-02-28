'use client';

import { useState } from 'react';
import { educationAPI } from '@/lib/api/apiClient';

interface InquiryFormProps {
  courseSlug?: string;
  sourcePage: string;
  title?: string;
  subtitle?: string;
}

export default function InquiryForm({
  courseSlug,
  sourcePage,
  title = 'Interested in This Course?',
  subtitle = "We'll get back within 24 hours with enrollment details.",
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    current_role: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const payload: Record<string, unknown> = {
        ...formData,
        source_page: sourcePage,
      };
      if (courseSlug) {
        payload.course_slug = courseSlug;
      }

      await educationAPI.submitCourseInquiry(payload);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', city: '', current_role: '', message: '' });

      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: unknown) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMessage(message);
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
        <svg className="w-12 h-12 mx-auto mb-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-white mb-2">Thanks!</h3>
        <p className="text-[var(--gray-400)]">We&apos;ll contact you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6 md:p-8">
      {title && <h3 className="text-xl font-bold text-white mb-2">{title}</h3>}
      {subtitle && <p className="text-[var(--gray-400)] mb-6">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="inquiry-name" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Name *</label>
            <input
              id="inquiry-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="inquiry-email" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Email *</label>
            <input
              id="inquiry-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="inquiry-phone" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Phone (WhatsApp) *</label>
            <input
              id="inquiry-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div>
            <label htmlFor="inquiry-city" className="block text-sm font-medium text-[var(--gray-300)] mb-1">City</label>
            <input
              id="inquiry-city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500"
              placeholder="Mumbai"
            />
          </div>
        </div>

        <div>
          <label htmlFor="inquiry-role" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Current Role</label>
          <select
            id="inquiry-role"
            name="current_role"
            value={formData.current_role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">Select your role</option>
            <option value="student">College Student</option>
            <option value="professional">Working Professional</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="business_owner">Business Owner</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="inquiry-message" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Message</label>
          <textarea
            id="inquiry-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-purple-500 resize-none"
            placeholder="Tell us about your goals..."
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full px-6 py-3 disabled:opacity-50"
        >
          {status === 'loading' ? 'Submitting...' : 'Get Started'}
        </button>
      </form>
    </div>
  );
}
