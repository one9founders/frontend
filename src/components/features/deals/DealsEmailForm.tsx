'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/actions/tools';

export default function DealsEmailForm() {
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
        setMessage('You\'re on the list! We\'ll notify you when deals drop.');
        setEmail('');
      } else {
        setMessage(result.error || 'Something went wrong');
      }
    } catch {
      setMessage('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-label="Email address"
          className="flex-1 px-4 py-2 rounded-lg border bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-200)] focus:outline-none focus:ring-2"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="btn-primary whitespace-nowrap disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Notify Me'}
        </button>
      </form>
      <p className="text-xs text-[var(--gray-500)] mt-3">No spam. Only deal alerts.</p>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('list') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
