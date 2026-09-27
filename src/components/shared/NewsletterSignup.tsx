'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/actions/tools';
import posthog from 'posthog-js';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        // Capture newsletter subscription event
        setMessage('Saved. No email was sent.');
        setEmail('');
      } else {
        setMessage(result.error || 'Something went wrong');
      }
    } catch (error) {
      posthog.captureException(error);
      setMessage('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-[var(--gray-900)]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Save an email for later updates</h2>
        <p className="mb-8 text-[var(--gray-400)]">
          This stores the address. It does not send a weekly email from this form.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            aria-label="Email address"
            className="flex-1 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-copper bg-[var(--gray-800)] border border-[var(--gray-700)]"
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="btn-primary px-6 py-3 disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Subscribing...' : 'Subscribe Free'}
          </button>
        </form>
        
        <p className="mt-4 text-xs text-[var(--gray-500)]">
          Optional. No message is sent by submitting this form.
        </p>
        
        {message && (
          <p className={`mt-4 text-sm ${message.includes('Thanks') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
