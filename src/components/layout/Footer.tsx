
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { subscribeToNewsletter } from '@/lib/actions/tools';
import posthog from 'posthog-js';
import { HugeiconsIcon, NewTwitterIcon, Linkedin01Icon, Facebook01Icon, InstagramIcon, YoutubeIcon, ThreadsIcon } from '@/components/ui/icons';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage('');
    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        posthog.capture('newsletter_subscribed', {
          email: email,
          source: 'footer',
        });
        setIsSuccess(true);
        setMessage('Thanks for subscribing!');
        setEmail('');
      } else {
        setIsSuccess(false);
        setMessage(result.error || 'Something went wrong');
      }
    } catch (error) {
      posthog.captureException(error);
      setIsSuccess(false);
      setMessage('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="px-6 py-16 border-t border-[var(--line)] bg-[var(--ink-2)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Logo, tagline, IIT Bombay */}
          <div className="lg:flex-1">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8 mb-6" draggable={false} />
            <p className="mb-2 text-[var(--gray-400)] max-w-80">
              India&apos;s largest AI ecosystem navigator for startup founders.
            </p>
            <p className="mb-6 text-[var(--gray-400)] max-w-80">
              Mumbai, Maharashtra, India |{' '}
              <a href="mailto:hello@one9founders.com" className="hover:text-[var(--copper)] transition-colors">
                hello@one9founders.com
              </a>
            </p>

            <div className="flex items-center gap-2 mb-6">
              <img src="/iitb-logo.png" alt="IIT Bombay" className="h-6" draggable={false} />
              <p className="text-[var(--gray-400)] text-md">
                Supported by <span className="font-bold">IIT Bombay</span>
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <a href="https://www.facebook.com/one9founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Follow us on Facebook"
                 className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                <HugeiconsIcon icon={Facebook01Icon} size={24} aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/one9founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Follow us on Instagram"
                 className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                <HugeiconsIcon icon={InstagramIcon} size={24} aria-hidden="true" />
              </a>
              <a href="https://threads.com/one9founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Follow us on Threads"
                 className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                <HugeiconsIcon icon={ThreadsIcon} size={24} aria-hidden="true" />
              </a>
              <a href="https://x.com/one9founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Follow us on X (Twitter)"
                 className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                <HugeiconsIcon icon={NewTwitterIcon} size={24} aria-hidden="true" />
              </a>
              <a href="https://www.youtube.com/@One9Founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Subscribe to our YouTube channel"
                 className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                <HugeiconsIcon icon={YoutubeIcon} size={24} aria-hidden="true" />
              </a>
              <a href="https://in.linkedin.com/company/one9founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Connect with us on LinkedIn"
                 className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                <HugeiconsIcon icon={Linkedin01Icon} size={24} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right: Navigation columns + Newsletter */}
          <div className="lg:flex-[2] space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Navigate */}
              <div>
                <h3 className="font-display font-semibold mb-4 text-[var(--paper)] text-sm">Navigate</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/#tools-section" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      Explore AI Tools
                    </a>
                  </li>
                  <li>
                    <Link href="/new" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      New AI Tools
                    </Link>
                  </li>
                  <li>
                    <Link href="/llms" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      LLM Explorer
                    </Link>
                  </li>
                  <li>
                    <Link href="/research" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      Research Papers
                    </Link>
                  </li>
                  <li>
                    <Link href="/agents" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      AI Agents
                    </Link>
                  </li>
                  <li>
                    <Link href="/stack" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      Assemble a stack
                    </Link>
                  </li>
                  <li>
                    <Link href="/fintech" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      Fintech AI Stack
                    </Link>
                  </li>
                  <li>
                    <Link href="/worker" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      One9 Worker
                    </Link>
                  </li>
                  <li>
                    <Link href="/compare" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      Compare Tools
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-display font-semibold mb-4 text-[var(--paper)] text-sm">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/about" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/learn/organizations" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      For Colleges &amp; Corporates
                    </Link>
                  </li>
                  <li>
                    <Link href="/methodology" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      How We Rate
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* More */}
              <div>
                <h3 className="font-display font-semibold mb-4 text-[var(--paper)] text-sm">More</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/#corporate-section" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      For Corporates
                    </a>
                  </li>
                  <li>
                    <Link href="/learn" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      AI Training
                    </Link>
                  </li>
                  <li>
                    <Link href="/submit" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      Submit a Tool
                    </Link>
                  </li>
                  <li>
                    <a href="mailto:hello@one9founders.com" className="hover:text-[var(--copper)] transition-colors text-[var(--gray-400)]">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter and Copyright */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
              <p className="text-xs text-[var(--gray-600)]">
                &copy; 2026 One9Founders. All rights reserved.
              </p>
              <div>
                <h3 className="font-display font-semibold mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--copper)]">
                  Get Smarter About AI Tools. Every Tuesday.
                </h3>
                <p className="mb-4 text-sm text-[var(--gray-400)]">
                  Join 5,000+ founders getting weekly security alerts, exclusive deals, and our honest picks.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    aria-label="Email address"
                    disabled={loading}
                    className="flex-1 px-4 py-2 border focus:outline-none focus:border-[var(--copper-dim)] bg-[var(--ink)] border-[var(--line)] text-[var(--paper)]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="px-4 py-2 text-sm font-medium bg-[var(--copper)] text-[var(--ink)] hover:bg-[var(--copper-bright)] whitespace-nowrap disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Subscribing...' : 'Subscribe Free'}
                  </button>
                </form>
                {message && (
                  <p className={`mt-2 text-xs ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
