'use client';

import { useState } from 'react';
import { educationAPI } from '@/lib/api/apiClient';

interface OrganizationInquiryFormProps {
  inquiryType?: 'college' | 'corporate';
  title?: string;
  subtitle?: string;
}

export default function OrganizationInquiryForm({
  inquiryType,
  title = 'Get in Touch',
  subtitle = 'Contact us for custom pricing and program details.',
}: OrganizationInquiryFormProps) {
  const [formData, setFormData] = useState({
    inquiry_type: inquiryType || 'college' as 'college' | 'corporate',
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    city: '',
    estimated_batch_size: '',
    preferred_timeline: '',
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
      await educationAPI.submitOrgInquiry(formData as unknown as Record<string, unknown>);
      setStatus('success');
      setFormData({
        inquiry_type: inquiryType || 'college',
        name: '', email: '', phone: '', organization: '', role: '',
        city: '', estimated_batch_size: '', preferred_timeline: '', message: '',
      });
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
        <p className="text-[var(--gray-400)]">Our team will reach out within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6 md:p-8">
      {title && <h3 className="text-xl font-bold text-white mb-2">{title}</h3>}
      {subtitle && <p className="text-[var(--gray-400)] mb-6">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!inquiryType && (
          <div>
            <label htmlFor="org-type" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Organization Type *</label>
            <select
              id="org-type"
              name="inquiry_type"
              value={formData.inquiry_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper"
            >
              <option value="college">College / University</option>
              <option value="corporate">Corporate / Company</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="org-name" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Name *</label>
            <input
              id="org-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper"
            />
          </div>
          <div>
            <label htmlFor="org-email" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Email *</label>
            <input
              id="org-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="org-phone" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Phone *</label>
            <input
              id="org-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper"
            />
          </div>
          <div>
            <label htmlFor="org-organization" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Organization *</label>
            <input
              id="org-organization"
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="org-role" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Your Role</label>
            <input
              id="org-role"
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper"
            />
          </div>
          <div>
            <label htmlFor="org-city" className="block text-sm font-medium text-[var(--gray-300)] mb-1">City</label>
            <input
              id="org-city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="org-batch" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Estimated Batch Size</label>
            <input
              id="org-batch"
              type="number"
              name="estimated_batch_size"
              value={formData.estimated_batch_size}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper"
              placeholder="e.g. 50"
            />
          </div>
          <div>
            <label htmlFor="org-timeline" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Preferred Timeline</label>
            <select
              id="org-timeline"
              name="preferred_timeline"
              value={formData.preferred_timeline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper"
            >
              <option value="">Select timeline</option>
              <option value="immediate">Immediate (within 2 weeks)</option>
              <option value="1_month">Within 1 month</option>
              <option value="3_months">Within 3 months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="org-message" className="block text-sm font-medium text-[var(--gray-300)] mb-1">Message</label>
          <textarea
            id="org-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white focus:outline-none focus:border-copper resize-none"
            placeholder="Tell us about your training needs..."
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
          {status === 'loading' ? 'Submitting...' : 'Contact Us'}
        </button>
      </form>
    </div>
  );
}
