'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon, Menu01Icon, Cancel01Icon, Logout01Icon, Search01Icon } from '@/components/ui/icons';
import AuthModal from '@/components/features/auth/AuthModal';
import { getCurrentUser, logout } from '@/lib/actions/auth';
import { useCurrency } from '@/lib/currency';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { trackEvent, identify, reset } = useAnalytics();

  const { currency, toggleCurrency } = useCurrency();

  useEffect(() => {
    getCurrentUser().then((userData) => {
      setUser(userData);
      // Identify returning logged-in users so PostHog links session to their profile
      if (userData?.email) {
        identify(userData.email, { email: userData.email, name: userData.name });
      }
    });
    
    // Check for login query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true') {
      setAuthMode('login');
      setShowAuth(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const handleOpenAuthModal = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setAuthMode(detail?.mode === 'signup' ? 'signup' : 'login');
      setShowAuth(true);
    };
    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuthModal);
  }, []);

  // Cmd+K / Ctrl+K keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const toolsSection = document.querySelector('#tools-section');
        if (toolsSection) {
          toolsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = '/#tools-section';
          return;
        }
        // Focus the search input after scrolling
        setTimeout(() => {
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            searchInput.focus();
          }
        }, 300);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
    trackEvent('user_logged_out');
    reset();

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
              <div className="relative group">
                <button onClick={scrollToTools} className={`hover:text-white cursor-pointer ${pathname === '/' ? 'text-white' : 'text-[var(--gray-500)]'}`}>
                  Explore
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button onClick={scrollToTools} className="w-full px-4 py-2 text-left text-sm text-[var(--gray-400)] hover:text-white hover:bg-[var(--gray-800)] cursor-pointer">AI Tools</button>
                  <Link href="/new" className="block px-4 py-2 text-sm text-[var(--gray-400)] hover:text-white hover:bg-[var(--gray-800)]">New Tools</Link>
                  <Link href="/agents" className="block px-4 py-2 text-sm text-[var(--gray-400)] hover:text-white hover:bg-[var(--gray-800)]">AI Agents</Link>
                  <Link href="/llms" className="block px-4 py-2 text-sm text-[var(--gray-400)] hover:text-white hover:bg-[var(--gray-800)]">LLMs</Link>
                  <Link href="/rag-vector-dbs" className="block px-4 py-2 text-sm text-[var(--gray-400)] hover:text-white hover:bg-[var(--gray-800)]">RAG & Vector DBs</Link>
                  <Link href="/research" className="block px-4 py-2 text-sm text-[var(--gray-400)] hover:text-white hover:bg-[var(--gray-800)]">Research</Link>
                  <Link href="/stacks" className="block px-4 py-2 text-sm text-[var(--gray-400)] hover:text-white hover:bg-[var(--gray-800)]">Founder Stacks</Link>
                </div>
              </div>
              <Link href="/compare" className={`hover:text-white ${pathname === '/compare' ? 'text-white' : 'text-[var(--gray-500)]'}`}>
                Compare
              </Link>
              <Link href="/methodology" className={`hover:text-white ${pathname === '/methodology' ? 'text-white' : 'text-[var(--gray-500)]'}`}>
                How We Rate
              </Link>
              <Link href="/about" className={`hover:text-white ${pathname === '/about' ? 'text-white' : 'text-[var(--gray-500)]'}`}>
                About
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleCurrency}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  currency === 'INR'
                    ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                    : 'bg-[var(--gray-800)] text-[var(--gray-400)] border border-[var(--gray-700)]'
                } hover:opacity-80`}
                aria-label={`Switch to ${currency === 'USD' ? 'INR' : 'USD'} pricing`}
              >
                <span className={currency === 'USD' ? 'font-bold' : 'opacity-60'}>$</span>
                <span className="text-[var(--gray-600)]">/</span>
                <span className={currency === 'INR' ? 'font-bold' : 'opacity-60'}>₹</span>
              </button>
              <button
                onClick={scrollToTools}
                aria-label="Search AI tools (⌘K)"
                className="hidden lg:inline-flex items-center text-xs text-[var(--gray-500)] border border-[var(--gray-700)] rounded px-1.5 py-0.5 font-mono cursor-pointer hover:border-[var(--gray-500)] transition-colors"
              >
                ⌘K
              </button>
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    aria-label="Open user menu"
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
                        <HugeiconsIcon icon={Logout01Icon} size={16} aria-hidden="true" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => { setAuthMode('signup'); setShowAuth(true); }} className="px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] transition-colors cursor-pointer">
                    Sign up free
                  </button>
                  <button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="text-[var(--gray-500)] hover:text-white cursor-pointer">
                    Login
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white p-2 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <HugeiconsIcon icon={Cancel01Icon} size={24} aria-hidden="true" />
            ) : (
              <HugeiconsIcon icon={Menu01Icon} size={24} aria-hidden="true" />
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
              <Link href="/new" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                New Tools
              </Link>
              <Link href="/llms" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                LLMs
              </Link>
              <Link href="/agents" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Agents
              </Link>
              <Link href="/rag-vector-dbs" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                RAG & Vector DBs
              </Link>
              <Link href="/research" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Research
              </Link>
              <Link href="/stacks" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Founder Stacks
              </Link>
              <Link href="/compare" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Compare
              </Link>
              <Link href="/methodology" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                How We Rate
              </Link>
              <Link href="/about" className="text-[var(--gray-500)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <div className="flex flex-col gap-3 pt-2 border-t border-[var(--gray-800)]">
                <button
                  onClick={toggleCurrency}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer self-start ${
                    currency === 'INR'
                      ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                      : 'bg-[var(--gray-800)] text-[var(--gray-400)] border border-[var(--gray-700)]'
                  } hover:opacity-80`}
                  aria-label={`Switch to ${currency === 'USD' ? 'INR' : 'USD'} pricing`}
                >
                  <span className={currency === 'USD' ? 'font-bold' : 'opacity-60'}>$</span>
                  <span className="text-[var(--gray-600)]">/</span>
                  <span className={currency === 'INR' ? 'font-bold' : 'opacity-60'}>₹</span>
                </button>
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
                      <HugeiconsIcon icon={Logout01Icon} size={16} aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => { setAuthMode('signup'); setShowAuth(true); setIsMobileMenuOpen(false); }} className="text-[var(--brand-primary)] hover:text-white text-left cursor-pointer">
                      Sign up free
                    </button>
                    <button onClick={() => { setAuthMode('login'); setShowAuth(true); setIsMobileMenuOpen(false); }} className="text-[var(--gray-500)] hover:text-white text-left cursor-pointer">
                      Login
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultMode={authMode} />
    </>
  );
}
