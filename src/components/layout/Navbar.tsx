'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HugeiconsIcon, Menu01Icon, Cancel01Icon, Logout01Icon, Search01Icon } from '@/components/ui/icons';
import AuthModal from '@/components/features/auth/AuthModal';
import { getCurrentUser, logout } from '@/lib/actions/auth';
import { getDirectoryStats } from '@/lib/actions/tools';
import { getTrackCount } from '@/lib/api/toolsStats';
import { useCurrency } from '@/lib/currency';
import { useAnalytics } from '@/hooks/useAnalytics';
import ExploreMenu, { ExploreGroups } from '@/components/layout/ExploreMenu';
import type { DirectoryStats } from '@/types';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navQuery, setNavQuery] = useState('');
  const [stats, setStats] = useState<DirectoryStats | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navSearchRef = useRef<HTMLInputElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const { trackEvent, identify, reset } = useAnalytics();
  const { currency, toggleCurrency } = useCurrency();

  const live = {
    tools: getTrackCount(stats, 'ai_tool') ?? stats?.total_tools,
    agents: stats?.agent_count,
    openSource: getTrackCount(stats, 'open_source'),
  };

  useEffect(() => {
    getCurrentUser().then((userData) => {
      setUser(userData);
      if (userData?.email) {
        identify(userData.email, { email: userData.email, name: userData.name });
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true') {
      setAuthMode('login');
      setShowAuth(true);
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

  useEffect(() => {
    getDirectoryStats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExploreOpen(false);
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (pathname === '/') {
          const hero = document.getElementById('hero-search');
          if (hero) {
            hero.focus();
            return;
          }
        }
        navSearchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const submitNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = navQuery.trim();
    if (q) {
      router.push('/?q=' + encodeURIComponent(q) + '#tools-section');
    } else if (pathname === '/') {
      document.getElementById('hero-search')?.focus();
    } else {
      router.push('/#tools-section');
    }
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
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navLinkClass = (href: string) => {
    const active =
      href === '/learn'
        ? pathname === '/learn' || pathname.startsWith('/learn/')
        : pathname === href;
    return `text-sm ${active ? 'text-[var(--paper)]' : 'text-[var(--gray-400)] hover:text-[var(--paper)]'}`;
  };

  const exploreCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openExplore = () => {
    if (exploreCloseTimer.current) clearTimeout(exploreCloseTimer.current);
    setExploreOpen(true);
  };
  const closeExplore = () => {
    exploreCloseTimer.current = setTimeout(() => setExploreOpen(false), 120);
  };

  const renderCurrency = () => (
    <button
      onClick={toggleCurrency}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium cursor-pointer border ${
        currency === 'INR'
          ? 'bg-[var(--copper)]/15 text-[var(--copper)] border-[var(--copper)]/30'
          : 'bg-transparent text-[var(--gray-400)] border-[var(--line)]'
      } hover:opacity-80`}
      aria-label={`Switch to ${currency === 'USD' ? 'INR' : 'USD'} pricing`}
    >
      <span className={currency === 'USD' ? 'font-bold' : 'opacity-60'}>$</span>
      <span className="text-[var(--gray-600)]">/</span>
      <span className={currency === 'INR' ? 'font-bold' : 'opacity-60'}>₹</span>
    </button>
  );

  const authControls = user ? (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        aria-label="Open user menu"
        className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--ink-2)] border border-[var(--line)] hover:border-[var(--copper-dim)] overflow-hidden cursor-pointer"
      >
        {user.picture ? (
          <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[var(--paper)] font-semibold text-sm">{getInitials(user.name)}</span>
        )}
      </button>
      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--ink-2)] border border-[var(--line)] py-2 z-50">
          <div className="px-4 py-2 border-b border-[var(--line)]">
            <p className="text-[var(--paper)] text-sm font-medium truncate">{user.name}</p>
            <p className="text-[var(--gray-500)] text-xs truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-[var(--gray-500)] hover:text-[var(--paper)] hover:bg-[var(--ink)] flex items-center gap-2 cursor-pointer"
          >
            <HugeiconsIcon icon={Logout01Icon} size={16} aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <>
      <button
        onClick={() => {
          setAuthMode('signup');
          setShowAuth(true);
        }}
        className="px-3.5 py-1.5 text-sm font-medium text-[var(--ink)] bg-[var(--copper)] hover:bg-[var(--copper-bright)] cursor-pointer"
      >
        Sign up free
      </button>
      <button
        onClick={() => {
          setAuthMode('login');
          setShowAuth(true);
        }}
        className="text-sm text-[var(--gray-400)] hover:text-[var(--paper)] cursor-pointer"
      >
        Login
      </button>
    </>
  );

  return (
    <>
      <nav
        ref={exploreRef}
        onMouseLeave={closeExplore}
        onMouseEnter={() => {
          if (exploreCloseTimer.current) clearTimeout(exploreCloseTimer.current);
        }}
        className={`sticky top-0 z-50 bg-[var(--ink)]/90 backdrop-blur-md border-b ${
          scrolled || exploreOpen ? 'border-[var(--line)]' : 'border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-[3.75rem] flex justify-between items-center">
          <Link href="/" aria-label="One9Founders home">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-6 md:h-7" draggable={false} />
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <div className="flex gap-6 items-center">
              <ExploreMenu
                open={exploreOpen}
                onOpen={() => setExploreOpen(true)}
                onToggle={() => setExploreOpen((value) => !value)}
              />
              <Link href="/stack" className={navLinkClass('/stack')}>
                Stack
              </Link>
              <Link href="/learn" className={navLinkClass('/learn')}>
                Learn
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <form onSubmit={submitNavSearch} className="hidden lg:block">
                <label htmlFor="nav-search" className="sr-only">
                  Search the catalog
                </label>
                <div className="flex items-center border border-[var(--line)] bg-transparent px-2.5 h-8 w-48 focus-within:border-[var(--copper-dim)]">
                  <HugeiconsIcon icon={Search01Icon} className="h-3.5 w-3.5 text-[var(--gray-500)] mr-2 shrink-0" />
                  <input
                    id="nav-search"
                    ref={navSearchRef}
                    type="text"
                    value={navQuery}
                    onChange={(e) => setNavQuery(e.target.value)}
                    placeholder="Search"
                    className="flex-1 bg-transparent text-sm text-[var(--paper)] placeholder:text-[var(--gray-500)] focus:outline-none"
                  />
                  <kbd className="text-[10px] text-[var(--gray-500)] font-mono ml-1">⌘K</kbd>
                </div>
              </form>
              {renderCurrency()}
              {authControls}
            </div>
          </div>

          <button
            className="md:hidden text-[var(--paper)] p-2 cursor-pointer"
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

        {exploreOpen && (
          <div
            className="hidden md:block border-t border-[var(--line)] bg-[var(--ink-2)]"
            onMouseEnter={() => setExploreOpen(true)}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
              <ExploreGroups live={live} onNavigate={() => setExploreOpen(false)} />
            </div>
          </div>
        )}
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-[var(--ink)] border-t border-[var(--line)]">
          <div className="px-4 py-6 pb-12">
            <form onSubmit={submitNavSearch} className="mb-8">
              <div className="flex items-center border border-[var(--line)] px-3 h-11">
                <HugeiconsIcon icon={Search01Icon} className="h-4 w-4 text-[var(--gray-500)] mr-2 shrink-0" />
                <input
                  type="text"
                  value={navQuery}
                  onChange={(e) => setNavQuery(e.target.value)}
                  placeholder="Search the catalog"
                  className="flex-1 bg-transparent text-sm text-[var(--paper)] placeholder:text-[var(--gray-500)] focus:outline-none"
                />
              </div>
            </form>

            <ExploreGroups live={live} onNavigate={() => setIsMobileMenuOpen(false)} />

            <div className="mt-8 pt-6 border-t border-[var(--line)] flex flex-col gap-4">
              <Link href="/stack" className="text-[var(--paper)]" onClick={() => setIsMobileMenuOpen(false)}>
                Stack
              </Link>
              <Link href="/learn" className="text-[var(--paper)]" onClick={() => setIsMobileMenuOpen(false)}>
                Learn
              </Link>
            </div>

            <div className="flex flex-col gap-4 pt-6 mt-6 border-t border-[var(--line)]">
              {renderCurrency()}
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--ink-2)] border border-[var(--line)] overflow-hidden flex-shrink-0">
                      {user.picture ? (
                        <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[var(--paper)] font-semibold text-sm">{getInitials(user.name)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--paper)] text-sm font-medium truncate">{user.name}</p>
                      <p className="text-[var(--gray-500)] text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-[var(--gray-500)] hover:text-[var(--paper)] text-left flex items-center gap-2 cursor-pointer"
                  >
                    <HugeiconsIcon icon={Logout01Icon} size={16} aria-hidden="true" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuth(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="self-start px-3.5 py-1.5 text-sm font-medium text-[var(--ink)] bg-[var(--copper)] cursor-pointer"
                  >
                    Sign up free
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuth(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-[var(--gray-400)] hover:text-[var(--paper)] text-left cursor-pointer"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultMode={authMode} />
    </>
  );
}
