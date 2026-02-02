'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon, Menu01Icon, Cancel01Icon, Logout01Icon, Search01Icon } from '@/components/ui/icons';
import AuthModal from '@/components/features/auth/AuthModal';
import { getCurrentUser, logout } from '@/lib/actions/auth';
import posthog from 'posthog-js';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

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
    setIsProfileMenuOpen(false);
    window.location.reload();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="px-4 md:px-6 py-4 relative bg-[var(--gray-black)] border-b border-[var(--gray-800)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="/">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-6 md:h-8" draggable={false} />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6 items-center">
              <button onClick={scrollToTools} className={`hover:text-white cursor-pointer ${pathname === '/' ? 'text-white' : 'text-[var(--gray-500)]'}`}>
                Explore
              </button>
              <Link href="/compare" className={`hover:text-white ${pathname === '/compare' ? 'text-white' : 'text-[var(--gray-500)]'}`}>
                Compare
              </Link>
              <Link href="/about" className={`hover:text-white ${pathname === '/about' ? 'text-white' : 'text-[var(--gray-500)]'}`}>
                About
              </Link>
              <button
                onClick={scrollToTools}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--gray-900)] border border-[var(--gray-700)] text-[var(--gray-400)] hover:text-white hover:border-[var(--gray-600)] transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Search01Icon} size={16} />
                <span className="text-xs text-[var(--gray-500)]">&#8984;K</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/internship">
                <button className="btn-primary px-4 py-2 hover:scale-105 transition-transform cursor-pointer">
                  Internship
                </button>
              </Link>
              {/* <button className="btn-primary px-4 py-2" onClick={handleSubmitTool}>
                Submit Tool
              </button> */}
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gray-800)] hover:bg-[var(--gray-700)] transition-colors overflow-hidden cursor-pointer"
                  >
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold text-sm">{getInitials(user.name)}</span>
                    )}
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-[var(--gray-800)]">
                        <p className="text-white text-sm font-medium truncate">{user.name}</p>
                        <p className="text-[var(--gray-500)] text-xs truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-[var(--gray-500)] hover:text-white hover:bg-[var(--gray-800)] flex items-center gap-2 cursor-pointer"
                      >
                        <HugeiconsIcon icon={Logout01Icon} size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} className="text-[var(--gray-500)] hover:text-white cursor-pointer">
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white p-2 cursor-pointer"
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
          <div className="md:hidden absolute top-full right-0 left-0 bg-[var(--gray-900)] border-t border-[var(--gray-800)] z-50">
            <div className="flex flex-col gap-4 p-4">
              <button onClick={scrollToTools} className="text-[var(--gray-500)] hover:text-white text-left cursor-pointer">
                Explore
              </button>
              <Link href="/compare" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Compare
              </Link>
              <Link href="/about" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <button
                onClick={scrollToTools}
                className="flex items-center gap-2 text-[var(--gray-500)] hover:text-white text-left cursor-pointer"
              >
                <HugeiconsIcon icon={Search01Icon} size={16} />
                Search Tools
              </button>
              <div className="flex flex-col gap-3 pt-2 border-t border-[var(--gray-800)]">
                <Link href="/internship" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="btn-primary px-4 py-2 text-left w-full cursor-pointer">
                    Internship
                  </button>
                </Link>
                {/* <button className="btn-primary px-4 py-2 text-left" onClick={handleSubmitTool}>
                  Submit Tool
                </button> */}
                {user ? (
                  <div className="flex flex-col gap-3 pt-2 border-t border-[var(--gray-800)]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gray-800)] overflow-hidden flex-shrink-0">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-semibold text-sm">{getInitials(user.name)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{user.name}</p>
                        <p className="text-[var(--gray-500)] text-xs truncate">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="text-[var(--gray-500)] hover:text-white text-left flex items-center gap-2 cursor-pointer">
                      <HugeiconsIcon icon={Logout01Icon} size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setShowAuth(true); setIsMobileMenuOpen(false); }} className="text-[var(--gray-500)] hover:text-white text-left cursor-pointer">
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
