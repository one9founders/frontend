'use client';

import { useState } from 'react';
import { submissionAPI } from '@/lib/api/apiClient';
import { showSuccess, showError } from '@/lib/utils/sweetAlert';
import { useReCaptcha } from '@/lib/recaptcha';
import Link from 'next/link';
import { trackCatalogEvent } from '@/lib/catalogEvents';

export default function SubmitToolPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    submitter_email: '',
    submitter_name: '',
    logo_url: '',
    short_description: '',
    pricing_info: ''
  });
  const [emailCode, setEmailCode] = useState('');
  const [codeSentTo, setCodeSentTo] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [statusToken, setStatusToken] = useState('');
  const [started, setStarted] = useState(false);
  const { executeRecaptcha } = useReCaptcha();

  const errorText = (error: unknown, fallback: string) => {
    if (error instanceof Error) {
      const text = error.message.replace(/^API Error:\s*/, '').trim();
      if (text) return text;
    }
    return fallback;
  };

  const handleSendCode = async () => {
    const email = formData.submitter_email.trim();
    if (!email) {
      setMessage('Enter your email first.');
      setMessageType('error');
      return;
    }

    setSendingCode(true);
    setMessage('');
    try {
      const recaptchaToken = await executeRecaptcha('verify_submitter_email');
      await submissionAPI.requestEmailCode({
        email,
        name: formData.submitter_name,
        ...(recaptchaToken ? { recaptcha_token: recaptchaToken } : {}),
      });
      setCodeSentTo(email.toLowerCase());
      setMessage(`We emailed a 6-digit code to ${email}. It expires in 10 minutes.`);
      setMessageType('success');
    } catch (error) {
      setMessage(errorText(error, 'Could not send the verification code. Try again.'));
      setMessageType('error');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.website || !formData.submitter_email || !formData.submitter_name) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      trackCatalogEvent({
        event_name: 'submission_validation_failed',
        entity_type: 'tool',
        surface: 'submit_form',
      });
      return;
    }

    if (!/^\d{6}$/.test(emailCode.trim())) {
      setMessage('Enter the 6-digit code we emailed you.');
      setMessageType('error');
      return;
    }

    if (codeSentTo && codeSentTo !== formData.submitter_email.trim().toLowerCase()) {
      setMessage('That code was sent to a different email. Request a new code.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha('submit_tool');

      const submissionData: Record<string, unknown> = {
        ...formData,
        email_code: emailCode.trim(),
      };
      if (recaptchaToken) {
        submissionData.recaptcha_token = recaptchaToken;
      }

      const saved = await submissionAPI.submit(submissionData);
      const token = saved?.public_token || '';
      setStatusToken(token);

      trackCatalogEvent({
        event_name: 'submission_completed',
        entity_type: 'tool',
        entity_slug: formData.name,
        surface: 'submit_form',
      });

      const submission = saved && !Array.isArray(saved) ? saved : null;
      const accountNote = submission?.account_created
        ? ' We created your One9Founders account for this email.'
        : submission?.email_verified
          ? ' Your email is verified on One9Founders.'
          : '';
      setMessageType('success');
      setMessage(`Saved. Enrichment runs after this and can fail without deleting the submission. Approval is not a fact check.${accountNote}`);
      await showSuccess('Saved', `The submission is stored. Enrichment runs after that and can fail without deleting it. Approval is not a fact check.${accountNote}`);
      setEmailCode('');
      setCodeSentTo('');
      setFormData({
        name: '',
        description: '',
        website: '',
        submitter_email: '',
        submitter_name: '',
        logo_url: '',
        short_description: '',
        pricing_info: ''
      });
    } catch (error) {
      const text = errorText(error, 'Failed to submit tool. Please try again.');
      setMessage(text);
      setMessageType('error');
      await showError('Error', text);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!started) {
      setStarted(true);
      trackCatalogEvent({
        event_name: 'submission_started',
        entity_type: 'tool',
        surface: 'submit_form',
      });
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'submitter_email') {
      setEmailCode('');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Submit an AI Tool
          </h1>
          <p className="text-xl text-[var(--gray-300)] mb-12">
            Help fellow founders discover amazing AI tools by submitting your recommendations
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-lg p-8 bg-[var(--gray-900)] border border-[var(--gray-800)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tool Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Tool Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., ChatGPT, Midjourney, Notion AI"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label htmlFor="short_description" className="block text-sm font-medium text-white mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  placeholder="Brief one-liner about the tool"
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this tool does and how it helps founders/startups..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors resize-vertical bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
                <p className="text-sm text-[var(--gray-400)] mt-1">
                  Be specific about the tool's features and benefits for startups
                </p>
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-white mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
              </div>

              {/* Logo URL */}
              <div>
                <label htmlFor="logo_url" className="block text-sm font-medium text-white mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  id="logo_url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.jpg"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>

              {/* Pricing Info */}
              <div>
                <label htmlFor="pricing_info" className="block text-sm font-medium text-white mb-2">
                  Pricing Information
                </label>
                <textarea
                  id="pricing_info"
                  name="pricing_info"
                  value={formData.pricing_info}
                  onChange={handleChange}
                  placeholder="e.g., Free tier available, Paid plans start at $10/month"
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors resize-vertical bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>

              {/* Submitter Name */}
              <div>
                <label htmlFor="submitter_name" className="block text-sm font-medium text-white mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="submitter_name"
                  name="submitter_name"
                  value={formData.submitter_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
              </div>

              {/* Submitter Email */}
              <div>
                <label htmlFor="submitter_email" className="block text-sm font-medium text-white mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="submitter_email"
                  name="submitter_email"
                  value={formData.submitter_email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
                <p className="text-sm text-[var(--gray-400)] mt-1">
                  We email a code to confirm this address, then create your One9Founders account so the directory only keeps real inboxes.
                </p>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode}
                  className="mt-3 w-full py-3 px-6 rounded-lg font-medium border border-[var(--gray-600)] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingCode ? 'Sending code...' : codeSentTo ? 'Resend code' : 'Email me a code'}
                </button>
              </div>

              {codeSentTo && (
                <div>
                  <label htmlFor="email_code" className="block text-sm font-medium text-white mb-2">
                    Verification code *
                  </label>
                  <input
                    type="text"
                    id="email_code"
                    name="email_code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={emailCode}
                    onChange={(event) => setEmailCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit code"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white tracking-[0.3em]"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    loading ? 'bg-[var(--gray-700)] text-white' : 'bg-[var(--brand-primary)] text-[var(--ink)]'
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Tool'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg ${messageType === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                  <p>{message}</p>
                  {statusToken && messageType === 'success' && (
                    <p className="mt-2">
                      <Link href={`/submit/status?token=${encodeURIComponent(statusToken)}`} className="underline">
                        Open your status page
                      </Link>
                    </p>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Submission Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">What We're Looking For</h3>
              <ul className="space-y-3 text-[var(--gray-300)]">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  AI-powered tools that solve real business problems
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Tools specifically useful for startups and founders
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Clear, detailed descriptions of functionality
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Active, maintained tools with good reputation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Please Avoid</h3>
              <ul className="space-y-3 text-[var(--gray-300)]">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Duplicate submissions of existing tools
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Tools that are no longer active or maintained
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Vague or marketing-heavy descriptions
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Tools without clear AI/automation features
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Help Build the Directory</h2>
          <p className="text-xl text-[var(--gray-300)] mb-8">
            Every submission helps fellow founders discover tools that can accelerate their growth. 
            Your contribution makes a difference in the startup community.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/" className="btn-primary">
              Explore Tools
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
