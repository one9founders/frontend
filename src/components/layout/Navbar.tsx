'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthModal from '@/components/features/auth/AuthModal';
import { getCurrentUser, logout } from '@/lib/actions/auth';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
    
    // Check for login query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true') {
      setShowAuth(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const scrollToTools = () => {
    const toolsSection = document.querySelector('#tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#tools-section';
    }
  };

  const handleSubmitTool = () => {
    window.open('/submit', '_blank');
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <nav className="px-4 md:px-6 py-4" style={{ backgroundColor: 'var(--gray-black)', borderBottom: '1px solid var(--gray-800)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
            <a href="/">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-6 md:h-8" draggable={false} />
            </a>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6">
              <button onClick={scrollToTools} style={{ color: 'var(--gray-500)', cursor: 'pointer' }} className="hover:text-white text-sm md:text-base">Explore</button>
              <Link href="/deals" style={{ color: 'var(--gray-500)' }} className="hover:text-white text-sm md:text-base">Deals</Link>
              <Link href="/compare" style={{ color: 'var(--gray-500)' }} className="hover:text-white text-sm md:text-base">Compare</Link>
              <Link href="/news" style={{ color: 'var(--gray-500)' }} className="hover:text-white text-sm md:text-base">News</Link>
              <Link href="/about" style={{ color: 'var(--gray-500)' }} className="hover:text-white text-sm md:text-base">About</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="btn-primary text-sm md:text-base px-3 md:px-4 py-2" onClick={handleSubmitTool}>
              Submit Tool
            </button>
            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                <span style={{ color: 'var(--gray-500)' }} className="text-sm md:text-base hidden md:inline">{user.name}</span>
                <button onClick={handleLogout} style={{ color: 'var(--gray-500)' }} className="hover:text-white text-sm md:text-base">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} style={{ color: 'var(--gray-500)' }} className="hover:text-white text-sm md:text-base">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}