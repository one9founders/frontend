'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon, Menu01Icon, Cancel01Icon, Logout01Icon } from '@/components/ui/icons';
import AuthModal from '@/components/features/auth/AuthModal';
import { getCurrentUser, logout } from '@/lib/actions/auth';
import posthog from 'posthog-js';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
    setIsMobileMenuOpen(false);
  };

  const handleSubmitTool = () => {
    window.open('/submit', '_blank');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    // Capture logout event before resetting
    posthog.capture('user_logged_out');
    posthog.reset();

    await logout();
    setUser(null);
    setIsMobileMenuOpen(false);
    window.location.reload();
  };

  return (
    <>
      <nav className="px-4 md:px-6 py-4 relative" style={{ backgroundColor: 'var(--gray-black)', borderBottom: '1px solid var(--gray-800)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="/">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-6 md:h-8" draggable={false} />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              <button onClick={scrollToTools} style={{ color: pathname === '/' ? 'white' : 'var(--gray-500)', cursor: 'pointer' }} className="hover:text-white">
                Explore
              </button>
              <Link href="/deals" style={{ color: pathname === '/deals' ? 'white' : 'var(--gray-500)' }} className="hover:text-white">
                Deals
              </Link>
              <Link href="/compare" style={{ color: pathname === '/compare' ? 'white' : 'var(--gray-500)' }} className="hover:text-white">
                Compare
              </Link>
              <Link href="/news" style={{ color: pathname === '/news' ? 'white' : 'var(--gray-500)' }} className="hover:text-white">
                News
              </Link>
              <Link href="/about" style={{ color: pathname === '/about' ? 'white' : 'var(--gray-500)' }} className="hover:text-white">
                About
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn-primary px-4 py-2" onClick={handleSubmitTool}>
                Submit Tool
              </button>
              {user ? (
                <div className="flex items-center gap-4">
                  <span style={{ color: 'var(--gray-500)' }}>{user.name}</span>
                  <button onClick={handleLogout} style={{ color: 'var(--gray-500)' }} className="hover:text-white flex items-center gap-2">
                    <HugeiconsIcon icon={Logout01Icon} size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} style={{ color: 'var(--gray-500)' }} className="hover:text-white">
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <HugeiconsIcon icon={Cancel01Icon} size={24} />
            ) : (
              <HugeiconsIcon icon={Menu01Icon} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full right-0 left-0 bg-gray-900 border-t border-gray-800 z-50">
            <div className="flex flex-col gap-4 p-4">
              <button onClick={scrollToTools} style={{ color: 'var(--gray-500)' }} className="hover:text-white text-left">
                Explore
              </button>
              <Link href="/deals" style={{ color: 'var(--gray-500)' }} className="hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Deals
              </Link>
              <Link href="/compare" style={{ color: 'var(--gray-500)' }} className="hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Compare
              </Link>
              <Link href="/news" style={{ color: 'var(--gray-500)' }} className="hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                News
              </Link>
              <Link href="/about" style={{ color: 'var(--gray-500)' }} className="hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-800">
                <button className="btn-primary px-4 py-2 text-left" onClick={handleSubmitTool}>
                  Submit Tool
                </button>
                {user ? (
                  <>
                    <span style={{ color: 'var(--gray-500)' }} className="text-sm">{user.name}</span>
                    <button onClick={handleLogout} style={{ color: 'var(--gray-500)' }} className="hover:text-white text-left flex items-center gap-2">
                      <HugeiconsIcon icon={Logout01Icon} size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <button onClick={() => { setShowAuth(true); setIsMobileMenuOpen(false); }} style={{ color: 'var(--gray-500)' }} className="hover:text-white text-left">
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}