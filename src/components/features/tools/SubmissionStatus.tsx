'use client';

import { useEffect, useState } from 'react';
import { submissionAPI } from '@/lib/api/apiClient';

type StatusPayload = {
  name?: string;
  moderation_status?: string;
  enrichment_status?: string;
  facts_verified?: boolean;
  verification_note?: string;
  missing?: string[];
};

export default function SubmissionStatus({ token }: { token: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [payload, setPayload] = useState<StatusPayload | null>(null);

  useEffect(() => {
    if (!token) {
      setState('missing');
      return;
    }
    submissionAPI.getStatus(token)
      .then((data) => {
        if (!data) {
          setState('missing');
          return;
        }
        setPayload(data);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, [token]);

  if (state === 'loading') return <p>Loading status…</p>;
  if (state === 'missing') return <p>This status link is missing or no longer matches a submission.</p>;
  if (state === 'error') return <p role="alert">Status could not be loaded. The submission itself is not deleted by this failure.</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-lg text-[var(--paper)]">{payload?.name}</p>
      <p>Moderation: {payload?.moderation_status || 'unknown'}</p>
      <p>Enrichment: {payload?.enrichment_status || 'unknown'}</p>
      <p>Facts verified: {payload?.facts_verified ? 'yes' : 'no'}</p>
      <p className="text-[var(--gray-400)]">{payload?.verification_note}</p>
      {payload?.missing && payload.missing.length > 0 && (
        <div>
          <p className="mb-2">Still needed</p>
          <ul className="list-disc pl-5 text-[var(--gray-400)]">
            {payload.missing.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
