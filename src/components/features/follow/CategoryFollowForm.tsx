'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/actions/tools';

export default function CategoryFollowForm({
  source,
  label,
}: {
  source: string;
  label: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [detail, setDetail] = useState('');

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus('saving');
        setDetail('');
        const result = await subscribeToNewsletter(email, source.slice(0, 50));
        if (result.success) {
          setStatus('saved');
          setEmail('');
          setDetail('Saved. This form does not send email.');
        } else {
          setStatus('error');
          setDetail(result.error || 'Could not save the address.');
        }
      }}
    >
      <label htmlFor={`follow-${source}`} className="block text-sm text-[var(--paper)]">
        Email for {label}
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id={`follow-${source}`}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="flex-1 px-3 py-2 bg-[var(--ink-2)] border border-[var(--line)] text-[var(--paper)]"
        />
        <button
          type="submit"
          disabled={status === 'saving'}
          className="px-4 py-2 bg-[var(--copper)] text-[var(--ink)] text-sm cursor-pointer disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving…' : 'Save email'}
        </button>
      </div>
      <p className="text-xs text-[var(--gray-500)]">
        Optional. Saving an address does not start a campaign or a weekly email.
      </p>
      {detail && (
        <p className={`text-sm ${status === 'error' ? 'text-red-300' : 'text-green-300'}`} role="status">
          {detail}
        </p>
      )}
    </form>
  );
}
