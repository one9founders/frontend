
'use client';

import { useState } from 'react';
import { HugeiconsIcon, NewTwitterIcon, Linkedin01Icon, GithubIcon, Mail01Icon, Facebook01Icon, InstagramIcon, YoutubeIcon, DiscordIcon, WhatsappIcon, ThreadsIcon, NewsIcon } from '@/components/ui/icons';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="px-6 py-16 m-4 md:m-12 rounded-3xl bg-[var(--gray-900)]  border-t border-[var(--gray-800)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Logo and Social Media - flex 1 */}
          <div className="lg:flex-1">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8 mb-6" draggable={false} />
            <p className="mb-6 text-[var(--gray-400)] max-w-80">
              Discover, compare, and choose the right AI tools for your startup
            </p>
      
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
              {/* <a href="https://substack.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={NewsIcon} size={24} />
              </a> */}
              <a href="https://www.youtube.com/@One9Founders" target="_blank" rel="noopener noreferrer" 
                 aria-label="Subscribe to our YouTube channel"
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={YoutubeIcon} size={24} aria-hidden="true" />
              </a>
              {/* <a href="https://discord.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={DiscordIcon} size={24} />
              </a> */}
              {/* <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={WhatsappIcon} size={24} />
              </a> */}
              <a href="https://in.linkedin.com/company/one9founders" target="_blank" rel="noopener noreferrer" 
                 aria-label="Connect with us on LinkedIn"
                 className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                <HugeiconsIcon icon={Linkedin01Icon} size={24} aria-hidden="true" />
              </a>
            </div>
                  <div className="flex items-center gap-2 mt-6">
              <img src="/iitb-logo.png" alt="IIT Bombay" className="h-6" draggable={false} />
              <p className="text-[var(--gray-400)] text-md">
                Supported by <span className="font-bold">IIT Bombay</span>
              </p>
            </div>
          </div>

          {/* Right: Navigation, Company, Newsletter & Copyright - flex 2 */}
          <div className="lg:flex-[2] space-y-8">
            {/* Navigation and Company in separate columns */}
            <div className="grid grid-cols-2 gap-8">
              {/* Navigation */}
              <div>
                <h3 className="font-semibold mb-4 text-[var(--gray-200)]">Navigation</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/#tools-section" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Explore
                    </a>
                  </li>
                  <li>
                    <a href="/deals" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Deals
                    </a>
                  </li>
                  <li>
                    <a href="/compare" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Compare
                    </a>
                  </li>
                  <li>
                    <a href="/news" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      News
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold mb-4 text-[var(--gray-200)]">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/what-is-one9founders" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      What is One9Founders?
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="/policy" className="hover:opacity-80 transition-opacity text-[var(--gray-400)]">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter and Copyright row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
                    {/* Copyright */}
                <p className="text-xs text-[var(--gray-600)]">
                  © 2026 One9Founders. All rights reserved.
                </p>
              {/* Newsletter */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-[var(--gray-200)]">
                  <HugeiconsIcon icon={Mail01Icon} size={20} />
                  Weekly AI Tool Intelligence
                </h3>
                <p className="mb-4 text-sm text-[var(--gray-400)]">
                  Security alerts, exclusive deals, and our top picks - free every Tuesday.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    aria-label="Email address"
                    className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] bg-white border-[var(--gray-700)] text-[var(--gray-600)]"
                  />
                  <button
                    type="submit"
                    className="btn-primary whitespace-nowrap"
                  >
                    Subscribe Free
                  </button>
                </form>
                <p className="mt-2 text-xs text-[var(--gray-500)]">
                  Join 5,000+ founders. No spam, unsubscribe anytime.
                </p>
              </div>

        
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
