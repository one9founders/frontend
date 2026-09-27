'use client';

import { useState } from 'react';
import { trackCatalogEvent } from '@/lib/catalogEvents';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

type Offer = 'workflow_audit' | 'implementation' | 'maintenance';

const EMPTY = {
  workflow: '',
  current_tools: '',
  team_context: '',
  desired_outcome: '',
  contact_name: '',
  contact_email: '',
  company: '',
  website: '',
};

export default function ServiceInquiryForm({ offer }: { offer: Offer }) {
  const [fields, setFields] = useState(EMPTY);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [detail, setDetail] = useState('');
  const [started, setStarted] = useState(false);

  const update = (key: keyof typeof EMPTY, value: string) => {
    if (!started) {
      setStarted(true);
      trackCatalogEvent({
        event_name: 'service_inquiry_started',
        entity_type: 'service',
        entity_slug: offer,
        surface: 'service_form',
        context: { offer },
      });
    }
    setFields((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus('saving');
        setDetail('');
        try {
          const response = await fetch(`${API_URL}/services/inquiries/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...fields, offer }),
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            const message = data.detail
              || Object.values(data).flat().join(' ')
              || 'The inquiry was not saved.';
            setStatus('error');
            setDetail(String(message));
            return;
          }
          setStatus('saved');
          setFields(EMPTY);
          setDetail('Saved. A person can read it in the admin queue. This form does not send email and does not promise a reply time.');
          trackCatalogEvent({
            event_name: 'service_inquiry_submitted',
            entity_type: 'service',
            entity_slug: offer,
            surface: 'service_form',
            context: { offer },
          });
        } catch {
          setStatus('error');
          setDetail('The inquiry could not be sent. Nothing was confirmed as saved.');
        }
      }}
    >
      <Field label="Workflow or problem" id="workflow" value={fields.workflow} onChange={(value) => update('workflow', value)} multiline required />
      <Field label="Tools already in use" id="current_tools" value={fields.current_tools} onChange={(value) => update('current_tools', value)} multiline />
      <Field label="Who does the work today" id="team_context" value={fields.team_context} onChange={(value) => update('team_context', value)} />
      <Field label="Outcome you want" id="desired_outcome" value={fields.desired_outcome} onChange={(value) => update('desired_outcome', value)} multiline required />
      <Field label="Name" id="contact_name" value={fields.contact_name} onChange={(value) => update('contact_name', value)} required />
      <Field label="Email" id="contact_email" type="email" value={fields.contact_email} onChange={(value) => update('contact_email', value)} required />
      <Field label="Company" id="company" value={fields.company} onChange={(value) => update('company', value)} />
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company-website">Website</label>
        <input
          id="company-website"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={(event) => update('website', event.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'saving'}
        className="px-4 py-2 bg-[var(--copper)] text-[var(--ink)] text-sm cursor-pointer disabled:opacity-60"
      >
        {status === 'saving' ? 'Saving…' : 'Send intake'}
      </button>
      {detail && (
        <p className={`text-sm ${status === 'error' ? 'text-red-300' : 'text-green-300'}`} role="status">
          {detail}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  multiline,
  required,
  type = 'text',
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
  type?: string;
}) {
  const className = 'w-full px-3 py-2 bg-[var(--ink-2)] border border-[var(--line)] text-[var(--paper)]';
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-[var(--paper)] mb-1">
        {label}{required ? ' *' : ''}
      </label>
      {multiline ? (
        <textarea id={id} required={required} rows={4} value={value} onChange={(event) => onChange(event.target.value)} className={className} />
      ) : (
        <input id={id} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className={className} />
      )}
    </div>
  );
}
