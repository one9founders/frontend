
'use client';

import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="px-6 py-16 m-4 md:m-12 rounded-3xl" style={{ backgroundColor: 'var(--gray-900)', borderTop: '1px solid var(--gray-800)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Logo and Social Media - flex 1 */}
          <div className="lg:flex-1">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8 mb-6" draggable={false} />
            <p className="mb-6" style={{ color: 'var(--gray-400)', maxWidth: '320px' }}>
              Discover, compare, and choose the right AI tools for your startup
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Navigation, Company, Newsletter & Copyright - flex 2 */}
          <div className="lg:flex-[2] space-y-8">
            {/* Navigation and Company in separate columns */}
            <div className="grid grid-cols-2 gap-8">
              {/* Navigation */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--gray-200)' }}>Navigation</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/#tools-section" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                      Explore
                    </a>
                  </li>
                  <li>
                    <a href="/deals" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                      Deals
                    </a>
                  </li>
                  <li>
                    <a href="/compare" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                      Compare
                    </a>
                  </li>
                  <li>
                    <a href="/news" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                      News
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--gray-200)' }}>Company</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/about" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="/policy" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--gray-400)' }}>
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter and Copyright row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
                    {/* Copyright */}
                <p className="text-xs" style={{ color: 'var(--gray-600)' }}>
                  © 2025 One9Founders. All rights reserved.
                </p>
              {/* Newsletter */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--gray-200)' }}>Newsletter</h3>
                <p className="mb-4 text-sm" style={{ color: 'var(--gray-400)' }}>
                  Stay updated with the latest AI tools
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--gray-800)',
                      borderColor: 'var(--gray-700)',
                      color: 'var(--gray-200)'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

        
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}