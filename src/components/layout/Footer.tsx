
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
    <footer className="px-6 py-16 m-4 md:m-12 rounded-3xl bg-[var(--gray-900)] border-t border-[var(--gray-800)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Logo, tagline, IIT Bombay */}
          <div className="lg:flex-1">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8 mb-6" draggable={false} />
            <p className="mb-6 text-[var(--gray-400)] max-w-80">
              India&apos;s largest AI ecosystem navigator for startup founders.
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
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={Facebook01Icon} size={24} aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/one9founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Follow us on Instagram"
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={InstagramIcon} size={24} aria-hidden="true" />
              </a>
              <a href="https://threads.com/one9founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Follow us on Threads"
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={ThreadsIcon} size={24} aria-hidden="true" />
              </a>
              <a href="https://x.com/one9founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Follow us on X (Twitter)"
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={NewTwitterIcon} size={24} aria-hidden="true" />
              </a>
              <a href="https://www.youtube.com/@One9Founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Subscribe to our YouTube channel"
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={YoutubeIcon} size={24} aria-hidden="true" />
              </a>
              <a href="https://in.linkedin.com/company/one9founders" target="_blank" rel="noopener noreferrer"
                 aria-label="Connect with us on LinkedIn"
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={Linkedin01Icon} size={24} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right: Navigation columns + Newsletter */}
          <div className="lg:flex-[2] space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Navigate */}
              <div>
                <h3 className="font-semibold mb-4 text-[var(--gray-200)]">Navigate</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/#tools-section" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Explore AI Tools
                    </a>
                  </li>
                  <li>
                    <Link href="/llms" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      LLM Explorer
                    </Link>
                  </li>
                  <li>
                    <Link href="/agents" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      AI Agents
                    </Link>
                  </li>
                  <li>
                    <Link href="/compare" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Compare Tools
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold mb-4 text-[var(--gray-200)]">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/about" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/methodology" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      How We Rate
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/policy" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* More */}
              <div>
                <h3 className="font-semibold mb-4 text-[var(--gray-200)]">More</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/#corporate-section" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      For Corporates
                    </a>
                  </li>
                  <li>
                    <Link href="/learn" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      AI Training
                    </Link>
                  </li>
                  <li>
                    <Link href="/submit" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Submit a Tool
                    </Link>
                  </li>
                  <li>
                    <a href="mailto:hello@one9founders.com" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
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
                <h3 className="font-semibold mb-2 text-xs uppercase tracking-widest text-[var(--gray-200)]">
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
                    className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-200)]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="btn-primary whitespace-nowrap disabled:opacity-50"
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
